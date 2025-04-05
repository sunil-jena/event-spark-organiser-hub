import React, { ReactNode, useState } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from './checkbox';
import { Label } from './label';

export interface FilterGroupProps {
  children: ReactNode;
}

export function FilterGroup({ children }: FilterGroupProps) {
  return (
    <div className="p-4 space-y-4">
      {children}
    </div>
  );
}

export interface FilterDropdownProps {
  triggerText?: string;
  icon?: ReactNode;
  groups?: {
    name: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  children?: ReactNode;
  triggerClassName?: string;
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

export function FilterDropdown({
  triggerText = 'Filter',
  icon,
  groups,
  children,
  triggerClassName = '',
  onFilterChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const handleFilterChange = (groupName: string, value: string, checked: boolean) => {
    setFilters(prevFilters => {
      const groupFilters = prevFilters[groupName] || [];
      let updatedFilters;

      if (checked) {
        updatedFilters = [...groupFilters, value];
      } else {
        updatedFilters = groupFilters.filter(item => item !== value);
      }

      if (updatedFilters.length === 0) {
        const newFilters = { ...prevFilters };
        delete newFilters[groupName];
        return newFilters;
      } else {
        return { ...prevFilters, [groupName]: updatedFilters };
      }
    });
  };

  const applyFilters = () => {
    if (onFilterChange) {
      const filterValues = {};
      for (const groupName in filters) {
        if (filters.hasOwnProperty(groupName)) {
          filterValues[groupName] = filters[groupName];
        }
      }
      onFilterChange(filterValues);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`h-8 ${triggerClassName}`} >
          {icon}
          {triggerText}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4 p-0" align="end">
        {groups && groups.map((group, index) => (
          <FilterGroup key={index}>
            <div className="font-medium px-4 pb-2">{group.name}</div>
            <div className="space-y-1 px-4">
              {group.options.map((option, optionIndex) => (
                <div key={optionIndex} className="space-x-2">
                  <Checkbox
                    id={option.value}
                    onCheckedChange={(checked) => handleFilterChange(group.name, option.value, checked)}
                    defaultChecked={filters[group.name]?.includes(option.value)}
                  />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </div>
          </FilterGroup>
        ))}
        {children}
        <div className="p-4">
          <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
