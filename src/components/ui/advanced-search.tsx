
import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from './popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './select';
import { X, Search, Filter as FilterIcon, Plus } from 'lucide-react';

export interface Field {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'date';
}

export interface Filter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between';
  value: string;
}

export interface AdvancedSearchProps {
  onSearch: (query: string, filters: Filter[]) => void;
  placeholder?: string;
  fields?: Field[];
}

export function AdvancedSearch({ onSearch, placeholder = 'Search...', fields = [] }: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filter[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<Partial<Filter>>({
    field: fields[0]?.name || '',
    operator: 'contains',
    value: ''
  });

  const handleSearch = () => {
    onSearch(searchQuery, filters);
    setFilterOpen(false);
  };

  const addFilter = () => {
    if (currentFilter.field && currentFilter.operator && currentFilter.value) {
      setFilters([...filters, currentFilter as Filter]);
      setCurrentFilter({
        field: fields[0]?.name || '',
        operator: 'contains',
        value: ''
      });
    }
  };

  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
    onSearch(searchQuery, newFilters);
  };

  const getFieldLabel = (fieldName: string) => {
    const field = fields.find(f => f.name === fieldName);
    return field ? field.label : fieldName;
  };

  const getOperatorLabel = (operator: string) => {
    switch(operator) {
      case 'equals': return 'equals';
      case 'contains': return 'contains';
      case 'startsWith': return 'starts with';
      case 'endsWith': return 'ends with';
      case 'greaterThan': return 'greater than';
      case 'lessThan': return 'less than';
      case 'between': return 'between';
      default: return operator;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 w-full">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            className="pl-8 pr-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3 py-2"
              onClick={() => {
                setSearchQuery('');
                onSearch('', filters);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <FilterIcon className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <h4 className="font-medium">Add Filter</h4>
              {fields.length > 0 && (
                <>
                  <div className="space-y-2">
                    <Select 
                      value={currentFilter.field} 
                      onValueChange={(value) => setCurrentFilter({...currentFilter, field: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.map((field) => (
                          <SelectItem key={field.name} value={field.name}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div className="space-y-2">
                    <Select 
                      value={currentFilter.operator} 
                      onValueChange={(value: any) => setCurrentFilter({...currentFilter, operator: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="startsWith">Starts with</SelectItem>
                        <SelectItem value="endsWith">Ends with</SelectItem>
                        <SelectItem value="greaterThan">Greater than</SelectItem>
                        <SelectItem value="lessThan">Less than</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div className="space-y-2">
                    <Input
                      placeholder="Value"
                      value={currentFilter.value}
                      onChange={(e) => setCurrentFilter({...currentFilter, value: e.target.value})}
                    />
                  </div>
  
                  <Button onClick={addFilter} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Filter
                  </Button>
                </>
              )}
              <div className="pt-2">
                <Button onClick={handleSearch} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button onClick={handleSearch} className="shrink-0">
          Search
        </Button>
      </div>
      
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.map((filter, index) => (
            <Badge variant="outline" key={index} className="flex items-center">
              {getFieldLabel(filter.field)} {getOperatorLabel(filter.operator)} "{filter.value}"
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter(index)}
                className="h-5 w-5 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {filters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilters([]);
                onSearch(searchQuery, []);
              }}
              className="h-7 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
