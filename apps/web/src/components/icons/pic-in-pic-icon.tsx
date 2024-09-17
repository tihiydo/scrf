import { ComponentProps } from 'react'
import { Svg } from '../ui/svg'

type Props = ComponentProps<'svg'>

const PicInPicIcon = (props: Props) => {
    return (
        <Svg {...props} viewBox="0 0 54 44" xmlns="http://www.w3.org/2000/svg">
            <path d="M47 2H7C4.23858 2 2 4.23858 2 7V37C2 39.7614 4.23858 42 7 42H47C49.7614 42 52 39.7614 52 37V7C52 4.23858 49.7614 2 47 2Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M47 24.5H34.5C31.7386 24.5 29.5 26.7386 29.5 29.5V37C29.5 39.7614 31.7386 42 34.5 42H47C49.7614 42 52 39.7614 52 37V29.5C52 26.7386 49.7614 24.5 47 24.5Z" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    )
}

export default PicInPicIcon