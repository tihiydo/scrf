import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import classNames from "classnames"
import styles from './button.module.scss'
import { LoadingIcon } from "@/components/icons/loading-icon"
import { he } from "date-fns/locale"


const buttonVariants = cva(
    styles.index,
    {
        variants: {
            variant: {
                default: styles.variantDefault,
                pimary: styles.variantPrimary,
                'accent-outline': styles.variantAccentOutline,
                ghost: styles.variantGhost,
            },
            size: {
                default: styles.sizeDefault,
                sm: styles.sizeSm,
                lg: styles.sizeLg,
                icon: styles.sizeIcon,
                xl: styles.sizeXl,
                xlT: styles.sizeXlTrailer //For trailers because WATCH has a icon and they have different size
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, children, isLoading, disabled, ...props }, ref) => {
        return (
            <button
                className={classNames(buttonVariants({ variant, size, className }), '')}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <LoadingIcon className={className} />
                ) : null}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
