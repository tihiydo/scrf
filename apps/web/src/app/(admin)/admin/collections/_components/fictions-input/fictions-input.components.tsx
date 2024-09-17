import { useState } from 'react'
import { FictionsTable } from '../collection-fictions-table';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Modal } from 'antd';
import { FictionSelect } from '../fiction-select';
import styles from './styles.module.scss'
import { Fiction } from '@/entities/fiction';
import { fictionGetter } from '@/utils/fiction';

type Props = {
    value?: Fiction[];
    onChange?: (fictions: Fiction[]) => void;
}

const FictionsInput = ({ value, onChange }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Button
                type='button'
                variant={'pimary'}
                onClick={() => {
                    setOpen(true)
                }}
            >
                <PlusIcon /> Add
            </Button>

            <Modal
                className={styles.modal}
                title={<p className={styles.modalTitle}>New collection</p>}
                open={open}
                onCancel={() => {
                    setOpen(false)
                }}
                onOk={() => {
                    setOpen(false)
                }}
            >
                <FictionSelect
                    selectedFictions={value ?? []}
                    onChange={(fictions) => {
                        onChange?.(fictions)
                    }}
                />
            </Modal>

            <FictionsTable fictions={value ?? []} onChange={(fictions) => { onChange?.(fictions) }} />
        </div>
    )
}

export default FictionsInput