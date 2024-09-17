import classNames from 'classnames'
import { ComponentProps } from 'react'
import styles from './hero.module.scss'


type Props = ComponentProps<'div'>

const Hero = ({ className, ...props }: Props) => {
    return (
        <div className={classNames(className, styles.hero)} {...props} />
    )
}

export default Hero