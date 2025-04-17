import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'warning':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Badge
      variant='outline'
      className={cn(
        'px-2.5 py-0.5 text-xs font-medium border',
        getStatusStyles(),
        className
      )}
    >
      {label}
    </Badge>
  );
}

export function Status({
  status,
  children,
}: {
  status: StatusType;
  children: React.ReactNode;
}) {
  return <StatusBadge status={status} label={children as string} />;
}
