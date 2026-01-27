import { cn } from "@/lib/utils";
import {
  Radio,
  Wifi,
  Cable,
  Box,
  Server,
  Antenna,
  Network,
  LucideIcon,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

export type EquipmentType =
  | "fdt"
  | "fdh"
  | "ip-msan"
  | "splitter"
  | "cabinet"
  | "odf"
  | "pole"
  | "other";

const equipmentIconVariants = cva(
  "flex items-center justify-center rounded-lg transition-all",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        default: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
      variant: {
        filled: "",
        outline: "border-2 bg-transparent",
        ghost: "bg-transparent",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "filled",
    },
  },
);

const equipmentConfig: Record<
  EquipmentType,
  {
    icon: LucideIcon;
    color: string;
    bgColor: string;
    label: string;
  }
> = {
  fdt: {
    icon: Box,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    label: "FDT",
  },
  fdh: {
    icon: Server,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    label: "FDH",
  },
  "ip-msan": {
    icon: Network,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    label: "IP MSAN",
  },
  splitter: {
    icon: Wifi,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    label: "Splitter",
  },
  cabinet: {
    icon: Box,
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-100 dark:bg-slate-900/30",
    label: "Cabinet",
  },
  odf: {
    icon: Cable,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    label: "ODF",
  },
  pole: {
    icon: Antenna,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    label: "Pole",
  },
  other: {
    icon: Radio,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-900/30",
    label: "Other",
  },
};

interface EquipmentIconProps extends VariantProps<
  typeof equipmentIconVariants
> {
  type: EquipmentType;
  className?: string;
  showLabel?: boolean;
}

export function EquipmentIcon({
  type,
  size,
  variant,
  className,
  showLabel = false,
}: EquipmentIconProps) {
  const config = equipmentConfig[type];
  const Icon = config.icon;

  const iconSize =
    size === "sm" ? 16 : size === "lg" ? 24 : size === "xl" ? 32 : 20;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          equipmentIconVariants({ size, variant }),
          variant === "filled" && config.bgColor,
          variant === "outline" && config.color,
        )}>
        <Icon className={cn(config.color)} size={iconSize} />
      </div>
      {showLabel && <span className="text-sm font-medium">{config.label}</span>}
    </div>
  );
}

export function getEquipmentConfig(type: EquipmentType) {
  return equipmentConfig[type];
}

export const equipmentTypes = Object.keys(equipmentConfig) as EquipmentType[];
