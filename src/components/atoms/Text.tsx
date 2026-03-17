import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textVariants = cva("", {
  variants: {
    size: {
      h1: "text-4xl font-bold leading-tight tracking-tighter",
      h2: "text-3xl font-semibold leading-snug tracking-tight",
      h3: "text-2xl font-semibold leading-snug",
      h4: "text-xl font-semibold leading-snug",
      h5: "text-lg font-semibold leading-snug",
      h6: "text-base font-semibold",
      body: "text-base leading-relaxed",
      small: "text-sm leading-relaxed",
      xs: "text-xs leading-relaxed",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      accent: "text-accent",
      destructive: "text-destructive",
      success: "text-green-600 dark:text-green-400",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "body",
    color: "default",
    weight: "normal",
  },
})

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
}

const Text = React.forwardRef<HTMLDivElement, TextProps>(
  ({ className, size, color, weight, as = "div", ...props }, ref) => {
    const Component = as as any
    return (
      <Component
        className={cn(textVariants({ size, color, weight, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

export { Text, textVariants }
