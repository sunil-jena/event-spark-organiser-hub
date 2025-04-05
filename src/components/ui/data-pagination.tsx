
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface DataPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  showingText?: string;
  pageSizeOptions?: number[];
}

export function DataPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showingText = 'items',
  pageSizeOptions = [5, 10, 20, 50, 100],
}: DataPaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    // Always show first page
    buttons.push(
      <PageButton
        key={1}
        page={1}
        isActive={currentPage === 1}
        onClick={() => handlePageChange(1)}
      />
    );

    // Calculate range of visible page buttons
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
    
    if (endPage - startPage < maxVisiblePages - 3) {
      startPage = Math.max(2, endPage - (maxVisiblePages - 3) + 1);
    }

    // Add ellipsis if needed before visible pages
    if (startPage > 2) {
      buttons.push(<div key="ellipsis-1" className="px-2">...</div>);
    }

    // Add visible page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PageButton
          key={i}
          page={i}
          isActive={currentPage === i}
          onClick={() => handlePageChange(i)}
        />
      );
    }

    // Add ellipsis if needed after visible pages
    if (endPage < totalPages - 1) {
      buttons.push(<div key="ellipsis-2" className="px-2">...</div>);
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      buttons.push(
        <PageButton
          key={totalPages}
          page={totalPages}
          isActive={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        />
      );
    }

    return buttons;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="text-sm text-muted-foreground">
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
        <strong>{totalItems}</strong> {showingText}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(parseInt(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm ml-2">per page</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="First Page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center">
            {renderPageButtons()}
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last Page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

function PageButton({ page, isActive, onClick }: PageButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="icon"
      className="h-8 w-8"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      {page}
    </Button>
  );
}
