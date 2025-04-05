import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

// Update DataPaginationProps to not require totalPages since it's calculated internally
export interface DataPaginationProps {
  currentPage: number;
  // totalPages is removed as it should be calculated from totalItems and pageSize
  totalItems: number;
  pageSize: number; // renamed from itemsPerPage to be consistent
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  showingText?: string;
}

export function DataPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = false,
  pageSizeOptions = [10, 25, 50, 100],
  showingText = 'items',
}: DataPaginationProps) {
  // Calculate totalPages from totalItems and pageSize
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <p className="text-sm text-muted-foreground">
        Showing {((currentPage - 1) * pageSize + 1)} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} {showingText}
      </p>
      <div className="flex items-center space-x-2">
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center space-x-1">
            <label htmlFor="page-size" className="text-sm font-medium">
              Page Size:
            </label>
            <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              disabled={currentPage === 1}
            />
            {getPageNumbers().map((page, i) =>
              page === '...' ? (
                <PaginationEllipsis key={`ellipsis-${i}`} />
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isCurrent={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page as number);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              disabled={currentPage === totalPages}
            />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
