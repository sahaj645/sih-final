import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        safe: "bg-success/10 text-success border border-success/20 shadow-sm status-glow-safe",
        caution: "bg-warning/10 text-warning border border-warning/20 shadow-sm",
        warning: "bg-warning/10 text-warning border border-warning/20 shadow-sm status-glow-warning",
        critical: "bg-destructive/10 text-destructive border border-destructive/20 shadow-sm status-glow-danger",
        online: "bg-success/10 text-success border border-success/20 shadow-sm",
        offline: "bg-muted/50 text-muted-foreground border border-border",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      pulse: {
        true: "animate-pulse-glow",
        false: "",
      },
    },
    defaultVariants: {
      variant: "safe",
      size: "md",
      pulse: false,
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, variant, size, pulse, children, ...props }, ref) => {
    return (
      <div
        className={cn(statusBadgeVariants({ variant, size, pulse, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusBadgeVariants };