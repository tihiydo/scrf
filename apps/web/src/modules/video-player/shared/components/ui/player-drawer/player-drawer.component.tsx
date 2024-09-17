import classNames from 'classnames';
import styles from './player-drawer.module.scss'
import { Drawer } from 'vaul';

type Props = {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (opened: boolean) => void;
    onClose?: () => void;
}

const PlayerDrawer = ({ children, onOpenChange, onClose, open }: Props) => {
    return (
        <Drawer.Root
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    onClose?.()
                }
                onOpenChange?.(isOpen)
            }}
        >
            <Drawer.Portal>
                <Drawer.Overlay
                    style={{ zIndex: 9999999 }}
                    className={styles.overlay}
                />

                <Drawer.Content
                    style={{ zIndex: 9999999 }}

                    className={classNames(styles.content)}
                >
                    <div className={classNames(styles.innerContent, 'no-scrollbar')}>
                        <Drawer.Handle className={styles.handle} />
                        <Drawer.Title />

                        {children}
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}

export default PlayerDrawer