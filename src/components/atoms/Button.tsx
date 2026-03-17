import * as React from "react"
import { Button as UIButton, buttonVariants } from "@/components/ui/button"
import { Spinner } from "./Spinner"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      isLoading,
      icon,
      iconPosition = "left",
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <UIButton
        disabled={isLoading || disabled}
        className={cn(className)}
        ref={ref}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="mr-2" />}
        {!isLoading && icon && iconPosition === "left" && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {!isLoading && icon && iconPosition === "right" && (
          <span className="ml-2">{icon}</span>
        )}
      </UIButton>
    )
  }
)
Button.displayName = "Button"

export { Button }
