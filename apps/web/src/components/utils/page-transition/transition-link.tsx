import { Link } from '@/i18n/navigation'
import React, { ComponentProps } from 'react'
import { PageTransitionKeys, PageTransitionType } from './enum';
import { durationToString } from './utils';

type Props = ComponentProps<typeof Link> & {
    enter?: Partial<{
        duration: number;
        type: PageTransitionType
    }>

    exit?: Partial<{
        duration: number;
        type: PageTransitionType
    }>
}

const TransitionLink = ({ href, enter, exit, ...props }: Props) => {
    const enterDurationString = durationToString(enter?.duration)
    const exitDurationString = durationToString(exit?.duration)

    const enterTransitionType: PageTransitionType = enter?.type ?? 'sld-y';
    const exitTransitionType: PageTransitionType = exit?.type ?? 'sld-y';

    const searchParams = new URLSearchParams({
        [PageTransitionKeys.EnterTransitionDuration]: enterDurationString,
        [PageTransitionKeys.ExitTranistionDuration]: exitDurationString,
        [PageTransitionKeys.EnterTransitionType]: enterTransitionType,
        [PageTransitionKeys.ExitTransitionType]: exitTransitionType,
    })

    const transitionHref = href + `?${searchParams.toString()}`;

    return (
        <Link href={transitionHref}  {...props} />
    )
}

export default TransitionLink