import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-10 w-10",
    },
    color: {
      default: "text-foreground",
      primary: "text-primary",
      accent: "text-accent",
      destructive: "text-destructive",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    color: "primary",
  },
})

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, color, ...props }, ref) => (
    <div ref={ref} {...props}>
      <Loader2 className={cn(spinnerVariants({ size, color, className }))} />
    </div>
  )
)
Spinner.displayName = "Spinner"

export { Spinner, spinnerVariants }
