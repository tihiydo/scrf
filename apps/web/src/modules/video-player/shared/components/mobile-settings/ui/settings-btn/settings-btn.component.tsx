import styles from './settings-btn.module.scss'
import { Button } from '@/components/ui/button'
import classNames from 'classnames'
import { ComponentProps } from 'react'

type Props = TypedOmit<ComponentProps<typeof Button>, 'variant'>

const SettingsBtn = ({ className, ...props }: Props) => {
    return (
        <button className={classNames(styles.btn, className)} {...props} />
    )
}

export default SettingsBtn