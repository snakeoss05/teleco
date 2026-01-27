import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      status: {
        active: "bg-success/15 text-success border border-success/30",
        warning: "bg-warning/15 text-warning border border-warning/30",
        inactive: "bg-muted text-muted-foreground border border-border",
        error: "bg-destructive/15 text-destructive border border-destructive/30",
        info: "bg-info/15 text-info border border-info/30",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        default: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1.5",
      },
    },
    defaultVariants: {
      status: "active",
      size: "default",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ 
  status, 
  size, 
  children, 
  className,
  dot = true 
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status, size }), className)}>
      {dot && (
        <span 
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            status === "active" && "bg-success",
            status === "warning" && "bg-warning",
            status === "inactive" && "bg-muted-foreground",
            status === "error" && "bg-destructive",
            status === "info" && "bg-info"
          )}
        />
      )}
      {children}
    </span>
  );
}
