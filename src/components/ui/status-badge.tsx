
import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Badge, BadgeProps } from './badge';
import { cn } from '@/lib/utils';

export type Status = 'success' | 'pending' | 'error' | 'warning' | 'info';

export interface StatusConfig {
  label: string;
  color: string;
  icon?: React.ReactNode;
  badgeVariant?: BadgeProps['variant'];
}

const defaultStatusConfigs: Record<Status, StatusConfig> = {
  success: {
    label: 'Success',
    color: 'bg-green-50 text-green-600 border-green-200',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    badgeVariant: 'outline'
  },
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-600 border-amber-200',
    icon: <Clock className="h-3.5 w-3.5" />,
    badgeVariant: 'outline'
  },
  error: {
    label: 'Error',
    color: 'bg-red-50 text-red-600 border-red-200',
    icon: <XCircle className="h-3.5 w-3.5" />,
    badgeVariant: 'outline'
  },
  warning: {
    label: 'Warning',
    color: 'bg-orange-50 text-orange-600 border-orange-200',
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    badgeVariant: 'outline'
  },
  info: {
    label: 'Info',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    badgeVariant: 'outline'
  }
};

interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: Status | string;
  showIcon?: boolean;
  label?: string;
  statusConfigs?: Record<string, StatusConfig>;
  variant?: BadgeProps['variant'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showIcon = true,
  label,
  statusConfigs = {},
  variant,
  className,
  ...props
}) => {
  const allConfigs = { ...defaultStatusConfigs, ...statusConfigs };
  
  // Find the status config, using the default 'info' if not found
  const statusConfig = allConfigs[status as keyof typeof allConfigs] || allConfigs.info;
  
  // Use the provided label, or fallback to the status config label
  const displayLabel = label || statusConfig.label;
  
  // Use the provided variant, or fallback to the status config variant
  const badgeVariant = variant || statusConfig.badgeVariant;

  return (
    <Badge
      variant={badgeVariant}
      className={cn(
        "flex items-center gap-1 font-normal",
        statusConfig.color,
        className
      )}
      {...props}
    >
      {showIcon && statusConfig.icon}
      <span>{displayLabel}</span>
    </Badge>
  );
};
