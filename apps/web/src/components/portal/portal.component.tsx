'use client'

import { useRef, useEffect, useState, ReactNode, ComponentProps } from 'react'
import { createPortal } from 'react-dom'

type PortalProps = {
    children: React.ReactNode;
    portalId: string;
} & ComponentProps<'div'>

export const Portal = ({ children, portalId, ...props }: PortalProps) => {
    const ref = useRef<Element | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        ref.current = document.querySelector<HTMLElement>(`#${portalId}`)
        setMounted(true)
    }, [])

    return (mounted && ref.current) ? createPortal(<div {...props}>{children}</div>, ref.current) : null
}

type PortalRootProps = ComponentProps<'div'> & {
    id: string;
}
export const PortalRoot = (props: PortalRootProps) => {
    return <div {...props} />
}

