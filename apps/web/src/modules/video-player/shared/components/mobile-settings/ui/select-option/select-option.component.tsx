import { ComponentProps } from 'react'
import { SettingsBtn } from '../settings-btn';
import { CheckIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './select-option.module.scss'
import classNames from 'classnames';

type Props = {
    selected: boolean;
} & ComponentProps<typeof SettingsBtn>

const SettingSelectOption = ({ selected, children, className, ...props }: Props) => {
    return (
        <SettingsBtn {...props} className={classNames(styles.opt, className)}>
            <div className={styles.content}>
                {children}
            </div>

            <AnimatePresence>
                {selected ? (
                    <motion.div
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        initial={{
                            opacity: 0,
                        }}
                    >
                        <CheckIcon className={styles.icon} />
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </SettingsBtn>
    )
}

export default SettingSelectOption