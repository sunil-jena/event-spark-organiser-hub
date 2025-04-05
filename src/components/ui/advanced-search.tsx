import React, { useState } from 'react';
import { Search, Filter, X, Check, ChevronDown } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { Badge } from './badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Checkbox } from './checkbox';

export type FilterOption = {
  id: string;
  name: string;
  options?: { value: string; label: string }[];
  type: 'select' | 'multiselect' | 'checkbox' | 'date' | 'text' | 'number' | 'status';
  placeholder?: string;
};

export type Filter = {
  field: string;
  operator: string;
  value: string | string[] | boolean | number | null;
  displayValue?: string;
};

export type StatusOption = {
  value: string;
  label: string;
  color: string;
};

interface AdvancedSearchProps {
  placeholder?: string;
  filters: FilterOption[];
  onSearch: (searchTerm: string, activeFilters: Filter[]) => void;
  statusOptions?: StatusOption[];
  className?: string;
  searchValue?: string;
  showFilterButton?: boolean;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  placeholder = 'Search...',
  filters,
  onSearch,
  statusOptions = [],
  className = '',
  searchValue = '',
  showFilterButton = true
}) => {
  const [searchTerm, setSearchTerm] = useState(searchValue);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = () => {
    onSearch(searchTerm, activeFilters);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const addFilter = (newFilter: Filter) => {
    // Check if filter already exists and replace it
    const exists = activeFilters.findIndex(f => f.field === newFilter.field);
    if (exists >= 0) {
      const updatedFilters = [...activeFilters];
      updatedFilters[exists] = newFilter;
      setActiveFilters(updatedFilters);
    } else {
      setActiveFilters([...activeFilters, newFilter]);
    }
    setIsFilterOpen(false);
  };

  const removeFilter = (fieldToRemove: string) => {
    setActiveFilters(activeFilters.filter(filter => filter.field !== fieldToRemove));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
    onSearch('', []);
  };

  const getStatusColor = (value: string) => {
    const status = statusOptions.find(s => s.value === value);
    return status?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="pl-10 w-full"
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex gap-2">
          {showFilterButton && (
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  <Badge className="ml-1" variant="secondary">
                    {activeFilters.length}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <Command>
                  <CommandInput placeholder="Search filters..." />
                  <CommandList>
                    <CommandEmpty>No filters found.</CommandEmpty>
                    {filters.map((filter) => (
                      <CommandGroup key={filter.id} heading={filter.name}>
                        {filter.type === 'select' && filter.options && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <CommandItem
                                onSelect={() => { }}
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <span>{filter.name}</span>
                                <ChevronDown className="h-4 w-4" />
                              </CommandItem>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                              <DropdownMenuLabel>{filter.name}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                {filter.options.map((option) => (
                                  <DropdownMenuItem
                                    key={option.value}
                                    onSelect={() =>
                                      addFilter({
                                        field: filter.id,
                                        operator: 'equals',
                                        value: option.value,
                                        displayValue: option.label,
                                      })
                                    }
                                  >
                                    {option.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                        {filter.type === 'multiselect' && filter.options && (
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <CommandItem
                                onSelect={() => { }}
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <span>{filter.name}</span>
                                <ChevronDown className="h-4 w-4" />
                              </CommandItem>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-4 py-2 border-t">
                              {filter.options.map((option) => {
                                const isSelected = activeFilters.some(
                                  (f) => f.field === filter.id &&
                                    (Array.isArray(f.value) ? f.value.includes(option.value) : f.value === option.value)
                                );

                                return (
                                  <div key={option.value} className="flex items-center space-x-2 py-1">
                                    <Checkbox
                                      id={`${filter.id}-${option.value}`}
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        const existingFilter = activeFilters.find(f => f.field === filter.id);
                                        let newValues: string[] = [];

                                        if (existingFilter && Array.isArray(existingFilter.value)) {
                                          newValues = [...existingFilter.value];
                                        }

                                        if (checked) {
                                          newValues.push(option.value);
                                        } else {
                                          newValues = newValues.filter(v => v !== option.value);
                                        }
                                        if (newValues.length > 0) {
                                          addFilter({
                                            field: filter.id,
                                            operator: 'in',
                                            value: newValues,
                                            displayValue: `${filter.name} (${newValues.length})`,
                                          });
                                        } else if (existingFilter) {
                                          removeFilter(filter.id);
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={`${filter.id}-${option.value}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                );
                              })}
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                        {filter.type === 'status' && (
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <CommandItem
                                onSelect={() => { }}
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <span>{filter.name}</span>
                                <ChevronDown className="h-4 w-4" />
                              </CommandItem>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-4 py-2 border-t">
                              {statusOptions.map((option) => (
                                <div key={option.value} className="flex items-center space-x-2 py-1">
                                  <Checkbox
                                    id={`status-${option.value}`}
                                    checked={activeFilters.some(
                                      f => f.field === filter.id &&
                                        (Array.isArray(f.value) ? f.value.includes(option.value) : f.value === option.value)
                                    )}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        addFilter({
                                          field: filter.id,
                                          operator: 'equals',
                                          value: option.value,
                                          displayValue: option.label,
                                        });
                                      } else {
                                        removeFilter(filter.id);
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`status-${option.value}`}
                                    className="flex items-center space-x-2 cursor-pointer"
                                  >
                                    <span className={`inline-block w-2 h-2 rounded-full ${option.color}`}></span>
                                    <span className="text-sm">{option.label}</span>
                                  </label>
                                </div>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {activeFilters.map((filter) => {
            const filterDef = filters.find(f => f.id === filter.field);
            const isStatus = filterDef?.type === 'status';
            const displayValue = filter.displayValue || (
              Array.isArray(filter.value)
                ? filter.value.join(', ')
                : filter.value?.toString() || ''
            );

            return (
              <Badge
                key={filter.field}
                variant="outline"
                className={cn(
                  "flex items-center gap-1 px-2 py-1",
                  isStatus ? getStatusColor(filter.value as string) : ""
                )}
              >
                <span className="text-xs">
                  {filterDef?.name}: {displayValue}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => removeFilter(filter.field)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove filter</span>
                </Button>
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};
