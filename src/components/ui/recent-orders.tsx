import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';

export type OrderStatus = 'completed' | 'pending' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  eventName: string;
  customer: string;
  date: string;
  amount: number;
  tickets: number;
  status: OrderStatus;
  isOffline?: boolean;
}

interface RecentOrdersProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  className?: string;
  currency?: string;
}

export function RecentOrders({
  orders,
  onViewOrder,
  className,
  currency = '₹',
}: RecentOrdersProps) {
  const getOrderStatusClass = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Overview of your latest ticket orders
            </CardDescription>
          </div>
          <Button
            variant='outline'
            className='hidden sm:flex items-center gap-1'
          >
            View All Orders
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b text-xs font-medium text-gray-500'>
                <th className='text-left whitespace-nowrap p-2 pb-3'>
                  Order ID
                </th>
                <th className='text-left whitespace-nowrap p-2 pb-3'>Event</th>
                <th className='text-left whitespace-nowrap p-2 pb-3 hidden sm:table-cell'>
                  Customer
                </th>
                <th className='text-left whitespace-nowrap p-2 pb-3 hidden md:table-cell'>
                  Date
                </th>
                <th className='text-right whitespace-nowrap p-2 pb-3'>
                  Amount
                </th>
                <th className='text-center whitespace-nowrap p-2 pb-3'>
                  Status
                </th>
                <th className='text-right whitespace-nowrap p-2 pb-3'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className='border-b hover:bg-gray-50'>
                  <td className='p-2 text-sm'>{order.id}</td>
                  <td className='p-2 text-sm'>
                    <div className='flex items-center'>
                      {order.eventName}
                      {order.isOffline && (
                        <span className='ml-2 text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full'>
                          Offline
                        </span>
                      )}
                    </div>
                  </td>
                  <td className='p-2 text-sm hidden sm:table-cell'>
                    {order.customer}
                  </td>
                  <td className='p-2 text-sm text-gray-500 hidden md:table-cell'>
                    {order.date}
                  </td>
                  <td className='p-2 text-sm text-right'>
                    <div className='flex justify-end items-center'>
                      {currency}
                      {order.amount.toLocaleString()}
                      <span className='text-xs text-gray-500 ml-1'>
                        ({order.tickets})
                      </span>
                    </div>
                  </td>
                  <td className='p-2'>
                    <div className='flex justify-center'>
                      <span
                        className={cn(
                          'text-xs px-2 py-1 rounded-full whitespace-nowrap',
                          getOrderStatusClass(order.status)
                        )}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className='p-2 text-right'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onViewOrder(order)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant='outline' className='w-full mt-4 sm:hidden'>
          View All Orders
        </Button>
      </CardContent>
    </Card>
  );
}
