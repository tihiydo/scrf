import classNames from 'classnames'
import { ComponentProps } from 'react'
import styles from './svg.module.scss';

type Props = ComponentProps<'svg'> & {
    withFill?: boolean;
    withStroke?: boolean;
}


// TIP: To fully normalize svg for customization
// 1. Remove width and height inline styles
// 2. Remove fill or stroke inline colors in svg and in nested elements 
// 3. Remove stroke width attributes 

const Svg = ({ className, withFill = false, withStroke = true, ...props }: Props) => {
    return (
        <svg className={classNames(className, styles.base, withFill && styles.fill, withStroke && styles.stroke)} {...props} />
    )
}

export default Svg