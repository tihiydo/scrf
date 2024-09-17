import styles from './player-message.module.scss'
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';


type Props = {
    title: string;
    description?: string;
    visible?: boolean;
    children?: React.ReactNode
}

const PlayerMessage = ({ title, description, visible, children }: Props) => {
    return (
        <div className={classNames(styles.message)}>
            <AnimatePresence>
                {visible ? (
                    <motion.h4
                        exit={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className={styles.messageTitle}
                    >
                        {title}
                    </motion.h4>
                ) : null}
            </AnimatePresence>

            {description ? (
                <AnimatePresence>
                    {visible ? (
                        <motion.p
                            exit={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                            className={styles.messageDescription}
                        >
                            {description}
                        </motion.p>
                    ) : null}
                </AnimatePresence>
            ) : null}

            <AnimatePresence>
                {visible ? children : null}
            </AnimatePresence>
        </div>
    )
}

export default PlayerMessage