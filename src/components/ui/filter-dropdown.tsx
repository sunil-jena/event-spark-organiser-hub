
import React, { useState } from 'react';
import { Check, ChevronDown, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './button';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

export interface FilterOption {
  id: string;
  label: string;
  colorClass?: string;
  icon?: React.ReactNode;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  multiSelect?: boolean;
}

interface FilterDropdownProps {
  trigger?: React.ReactNode;
  groups: FilterGroup[];
  onFilterChange: (selectedFilters: Record<string, string | string[]>) => void;
  initialFilters?: Record<string, string | string[]>;
  align?: 'start' | 'end' | 'center';
  className?: string;
  triggerClassName?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  trigger,
  groups,
  onFilterChange,
  initialFilters = {},
  align = 'end',
  className = '',
  triggerClassName = ''
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string | string[]>>(initialFilters);
  const [open, setOpen] = useState(false);

  const handleSelect = (
    groupId: string, 
    optionId: string, 
    multiSelect: boolean = false
  ) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (multiSelect) {
        const currentValues = Array.isArray(prev[groupId]) 
          ? [...prev[groupId] as string[]] 
          : [];
        
        if (currentValues.includes(optionId)) {
          const newValues = currentValues.filter(val => val !== optionId);
          newFilters[groupId] = newValues.length > 0 ? newValues : undefined;
          if (newValues.length === 0) {
            delete newFilters[groupId];
          }
        } else {
          newFilters[groupId] = [...currentValues, optionId];
        }
      } else {
        if (prev[groupId] === optionId) {
          delete newFilters[groupId];
        } else {
          newFilters[groupId] = optionId;
        }
      }
      
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const countSelectedFilters = () => {
    return Object.keys(selectedFilters).length;
  };

  const isSelected = (groupId: string, optionId: string) => {
    const value = selectedFilters[groupId];
    
    if (Array.isArray(value)) {
      return value.includes(optionId);
    }
    
    return value === optionId;
  };

  const defaultTrigger = (
    <Button 
      variant="outline" 
      className={cn("flex items-center gap-2", triggerClassName)}
    >
      <Filter className="h-4 w-4" />
      <span>Filter</span>
      {countSelectedFilters() > 0 && (
        <Badge variant="secondary" className="ml-1">
          {countSelectedFilters()}
        </Badge>
      )}
    </Button>
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn("w-56", className)}>
        {groups.map(group => (
          <React.Fragment key={group.id}>
            <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {group.options.map(option => {
                const selected = isSelected(group.id, option.id);
                
                return (
                  <DropdownMenuItem
                    key={option.id}
                    onSelect={(e) => {
                      e.preventDefault();
                      handleSelect(group.id, option.id, group.multiSelect);
                    }}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      selected && "bg-accent"
                    )}
                  >
                    {option.icon}
                    {option.colorClass && (
                      <span className={cn("h-2 w-2 rounded-full", option.colorClass)} />
                    )}
                    <span>{option.label}</span>
                    {selected && <Check className="h-4 w-4 ml-auto" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
