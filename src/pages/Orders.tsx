import React, { useState, useEffect } from 'react';
import { ChevronUp, Filter } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { OrderStatistics } from '@/components/orders/OrderStatistics';
import { useAppContext } from '@/contexts/AppContext';
import {
  OrdersContextProvider,
  useOrdersContext,
} from '@/contexts/OrdersContext';

// Order status badge component
const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusStyles = {
    completed: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    refunded: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[status as keyof typeof statusStyles]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Main Orders content component
const OrdersContent = () => {
  const { scrollToTop } = useAppContext();
  const {
    filteredOrders,
    filterOrders,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
  } = useOrdersContext();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Calculate pagination
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fixed handlers for pagination
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle page navigation
  const handlePageClick = (
    pageNum: number,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setCurrentPage(pageNum);
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      {/* Orders Statistics */}
      <div className='lg:col-span-1'>
        <OrderStatistics title='Order Statistics' orders={filteredOrders} />
      </div>

      {/* Orders Table */}
      <div className='lg:col-span-3'>
        <Card>
          <CardHeader>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div>
                <CardTitle>Orders</CardTitle>
                <CardDescription>Manage your event orders</CardDescription>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='ml-auto flex items-center gap-2'
                  >
                    <Filter className='h-4 w-4' />
                    <span>Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => filterOrders('all')}>
                    All Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => filterOrders('completed')}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => filterOrders('pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => filterOrders('cancelled')}>
                    Cancelled
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => filterOrders('refunded')}>
                    Refunded
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm text-left'>
                <thead className='text-xs uppercase bg-gray-50 dark:bg-gray-800'>
                  <tr>
                    <th className='px-4 py-3'>Order ID</th>
                    <th className='px-4 py-3'>Customer</th>
                    <th className='px-4 py-3'>Event</th>
                    <th className='px-4 py-3'>Date</th>
                    <th className='px-4 py-3'>Amount</th>
                    <th className='px-4 py-3'>Tickets</th>
                    <th className='px-4 py-3'>Status</th>
                    <th className='px-4 py-3'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className='bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                    >
                      <td className='px-4 py-3 font-medium'>{order.id}</td>
                      <td className='px-4 py-3'>{order.customer}</td>
                      <td className='px-4 py-3'>{order.event}</td>
                      <td className='px-4 py-3'>{order.date}</td>
                      <td className='px-4 py-3'>${order.amount.toFixed(2)}</td>
                      <td className='px-4 py-3'>{order.tickets}</td>
                      <td className='px-4 py-3'>
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className='px-4 py-3'>
                        <Button variant='ghost' size='sm'>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className='mt-6'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        handlePrevPage();
                      }}
                      aria-disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>

                  {/* Show a limited number of page links */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href='#'
                          isActive={currentPage === pageNum}
                          onClick={(e) => handlePageClick(pageNum, e)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <span className='px-2'>...</span>
                    </PaginationItem>
                  )}

                  {totalPages > 5 && (
                    <PaginationItem>
                      <PaginationLink
                        href='#'
                        isActive={currentPage === totalPages}
                        onClick={(e) => handlePageClick(totalPages, e)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        handleNextPage();
                      }}
                      aria-disabled={currentPage === totalPages}
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className='fixed bottom-8 right-8 z-50'
          >
            <Button
              variant='secondary'
              size='icon'
              className='rounded-full shadow-md'
              onClick={scrollToTop}
            >
              <ChevronUp className='h-5 w-5' />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Orders page with context provider
const Orders = () => {
  return (
    <OrdersContextProvider>
      <OrdersContent />
    </OrdersContextProvider>
  );
};

export default Orders;
