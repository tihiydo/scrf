import { Collection } from "@/entities/collection";
import { message, TableColumnsType } from "antd";
import { useContext } from "react";
import { Button } from '@/components/ui/button';
import { RowContext } from "./table";
import { PopoverMenu, PopoverRoot, PopoverTrigger } from "@/components/ui/popover";
import { EditIcon, GripIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import styles from './styles.module.scss'
import { DeleteCollection } from "@/api/requests/collections/delete";
import { LoadingIcon } from "@/components/icons/loading-icon";
import { useQueryClient } from "@tanstack/react-query";
import { GetManyCollections } from "@/api/requests/collections/get-many";
import Link from "next/link";


const DragHandle: React.FC = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
        <Button
            variant={'ghost'}
            size="icon"
            style={{ cursor: 'move' }}
            ref={setActivatorNodeRef}
            {...listeners}
        >
            <GripIcon />
        </Button>
    );
};

const ActionsCell = ({ collection }: { collection: Collection }) => {
    const queryClient = useQueryClient();
    const deleteMutation = DeleteCollection.useMutation({
        onSuccess: () => {
            message.success(`Collection "${collection.name}" has been succesfuly deleted`)
            queryClient.invalidateQueries({
                queryKey: GetManyCollections.queryKey({
                    limit: 10000,
                })
            })
        }
    });

    return (
        <div>
            <PopoverRoot position="bottom-right">
                <PopoverTrigger>
                    <Button variant={'ghost'} size={'icon'}>
                        <MoreVerticalIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverMenu>
                    <div className={styles.actionsMenuList}>
                        <button
                            disabled={deleteMutation.isPending}
                            className={styles.actionsMenuItem}
                            onClick={() => {
                                deleteMutation.mutate({
                                    slug: collection.slug
                                })
                            }}
                        >
                            {deleteMutation.isPending ? <LoadingIcon /> : <Trash2Icon />} Delete
                        </button>

                        <Link
                            className={styles.actionsMenuItem}
                            href={`/admin/collections/${collection.slug}`}
                        >
                            <EditIcon />  Edit
                        </Link>
                    </div>
                </PopoverMenu>
            </PopoverRoot>
        </div>
    );
}

export const columns: TableColumnsType<Collection> = [
    { key: 'handle', align: 'center', width: 80, render: () => <DragHandle /> },
    { title: 'Position', dataIndex: 'position' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Description', dataIndex: 'description' },
    {
        title: 'Actions',
        width: 100,
        render: (_, collection) => {
            return <ActionsCell collection={collection} />
        }
    }
];
