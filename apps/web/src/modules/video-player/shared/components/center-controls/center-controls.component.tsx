import classNames from 'classnames'
import styles from './center-controls.module.scss'
import { ComponentProps } from 'react'

type Props = ComponentProps<'div'>

const CenterControls = ({ className, ...props }: Props) => {
  return (
    <div className={classNames(styles.content, className)} {...props} />
  )
}

export default CenterControls