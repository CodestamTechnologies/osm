import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-primary text-white hover:bg-brand-primary-hover",
        secondary: "border-transparent bg-brand-secondary text-white hover:bg-slate-800",
        destructive: "border-transparent bg-brand-danger text-white hover:bg-red-700",
        outline: "text-brand-text-primary",
        success: "border-transparent bg-brand-success text-white hover:bg-green-700",
        warning: "border-transparent bg-brand-warning text-white hover:bg-yellow-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
