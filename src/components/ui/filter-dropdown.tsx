import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterDropdownProps {
  triggerText: string;
  icon?: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  children?: React.ReactNode;
}

export interface FilterGroupProps {
  title?: string;
  children?: React.ReactNode;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  children,
}) => {
  return (
    <div className='space-y-2'>
      {title && <div className='text-sm font-medium'>{title}</div>}
      <div className='space-y-1'>{children}</div>
    </div>
  );
};

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  triggerText,
  icon,
  className,
  align = 'end',
  sideOffset = 4,
  children,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('justify-between', className)}
        >
          {icon && <span className='mr-1'>{icon}</span>}
          {triggerText}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='p-0 min-w-48'
        align={align}
        sideOffset={sideOffset}
      >
        <div className='p-2 space-y-4 max-h-[300px] overflow-auto'>
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export interface FilterItemProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  value: string;
}

export const FilterItem: React.FC<FilterItemProps> = ({
  checked,
  onCheckedChange,
  label,
  value,
}) => {
  return (
    <div className='flex items-center space-x-2'>
      <div
        className={cn(
          'h-4 w-4 rounded border flex items-center justify-center',
          checked ? 'bg-primary border-primary' : 'border-input'
        )}
        onClick={() => onCheckedChange(!checked)}
      >
        {checked && <Check className='h-3 w-3 text-primary-foreground' />}
      </div>
      <label
        htmlFor={`filter-${value}`}
        className='text-sm cursor-pointer'
        onClick={() => onCheckedChange(!checked)}
      >
        {label}
      </label>
    </div>
  );
};
