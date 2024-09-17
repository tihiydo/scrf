import React, { useEffect, useMemo, useState } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table } from 'antd';
import { TableColumnsType } from "antd";
import { useContext } from "react";
import { Button } from '@/components/ui/button';
import { PopoverMenu, PopoverRoot, PopoverTrigger } from "@/components/ui/popover";
import { EyeIcon, GripIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import styles from './styles.module.scss'
import { fictionGetter } from "@/utils/fiction";
import Link from "next/link";
import { Fiction } from '@/entities/fiction';


interface RowContextProps {
    setActivatorNodeRef?: (element: HTMLElement | null) => void;
    listeners?: SyntheticListenerMap;
}

export const RowContext = React.createContext<RowContextProps>({});

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

const Row: React.FC<RowProps> = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props['data-row-key'] });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 999 } : {}),
    };

    const contextValue = useMemo<RowContextProps>(
        () => ({ setActivatorNodeRef, listeners }),
        [setActivatorNodeRef, listeners],
    );

    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};


type Props = {
    fictions: Fiction[]
    onChange?: (fictions: Fiction[]) => void;
}
export const FictionsTable = ({ fictions, onChange }: Props) => {
    const [dataSource, setDataSource] = useState<Fiction[]>(fictions);

    useEffect(() => {
        setDataSource(fictions)
    }, [fictions])


    const columns: TableColumnsType<Fiction> = [
        { key: 'handle', align: 'center', width: 80, render: () => <DragHandle /> },
        {
            title: 'Position', render: (_, fiction, index) => {
                return index + 1;
            }
        },
        {
            title: 'Name', render: (_, fiction) => {
                const fictionTitle = fictionGetter(fiction, {
                    movie: (movieFic) => movieFic.movie?.title,
                    serial: (serialFic) => serialFic.serial.title
                })
                return fictionTitle
            }
        },
        {
            title: 'Year', render: (_, fiction) => {
                const years = fictionGetter(fiction, {
                    movie: (movieFic) => movieFic.movie.releaseYear.toString(),
                    serial: (serialFic) => `${serialFic.serial.releaseYear} - ${serialFic.serial.endYear ?? 'Present'}`
                })

                return years
            }
        },
        {
            title: 'Actions',
            width: 100,
            render: (_, fiction) => {
                return <ActionsCell
                    fiction={fiction}
                    onDelete={(id) => {
                        const newValue = dataSource.filter(f => f.id !== id)
                        setDataSource(newValue)
                        onChange?.(newValue)
                    }}
                />
            },
        }
    ];

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setDataSource((prevState) => {
                const activeIndex = prevState.findIndex((record) => record.id === active?.id);
                const overIndex = prevState.findIndex((record) => record.id === over?.id);
                const fictions = arrayMove(prevState, activeIndex, overIndex);

                onChange?.(fictions)

                return fictions;
            });
        }
    };

    return (
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <SortableContext items={dataSource.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <Table
                    pagination={false}
                    rowKey="id"
                    components={{ body: { row: Row } }}
                    columns={columns}
                    dataSource={dataSource}
                />
            </SortableContext>
        </DndContext>
    );
};


const DragHandle: React.FC = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
        <Button
            type='button'
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

const ActionsCell = ({ fiction, onDelete }: { fiction: Fiction, onDelete?: (id: string) => void; }) => {
    const link = fictionGetter(fiction, {
        movie: ({ movie }) => `/movie/${movie.imdbid}`,
        serial: ({ serial }) => `/serial/${serial.imdbid}`,
    });



    return (
        <div>
            <PopoverRoot position="bottom-right">
                <PopoverTrigger>
                    <Button type='button' variant={'ghost'} size={'icon'}>

                        <MoreVerticalIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverMenu>
                    <div className={styles.actionsMenuList}>
                        <button
                            onClick={() => onDelete?.(fiction.id)}
                            className={styles.actionsMenuItem}
                        >
                            <Trash2Icon /> Delete
                        </button>

                        {link ? (
                            <Link
                                href={link}
                                target="_blank"
                                className={styles.actionsMenuItem}
                            >
                                <EyeIcon /> View more
                            </Link>
                        ) : null}

                    </div>
                </PopoverMenu>
            </PopoverRoot>
        </div>
    );
}


export default FictionsTable;