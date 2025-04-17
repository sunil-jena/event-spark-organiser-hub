import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

export type OrderStatus = 'completed' | 'pending' | 'cancelled' | 'refunded';

interface OrderData {
  status: OrderStatus;
  count: number;
}

interface OrderStatisticsProps {
  title: string;
  totalOrders: number;
  data: OrderData[];
  className?: string;
}

export function OrderStatistics({
  title,
  totalOrders,
  data,
  className,
}: OrderStatisticsProps) {
  const statusIcons = {
    completed: <CheckCircle2 className='h-4 w-4 text-green-500' />,
    pending: <Clock className='h-4 w-4 text-amber-500' />,
    cancelled: <XCircle className='h-4 w-4 text-red-500' />,
    refunded: <AlertCircle className='h-4 w-4 text-blue-500' />,
  };

  const statusColors = {
    completed: 'bg-green-500',
    pending: 'bg-amber-500',
    cancelled: 'bg-red-500',
    refunded: 'bg-blue-500',
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-700',
        className
      )}
    >
      <div className='flex justify-between items-start mb-6'>
        <div>
          <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
            {title}
          </p>
          <h3 className='text-2xl font-bold mt-1'>
            {totalOrders.toLocaleString()}
          </h3>
        </div>
      </div>

      <div className='space-y-5'>
        {data.map((item) => {
          const percentage = Math.round((item.count / totalOrders) * 100) || 0;

          return (
            <div key={item.status} className='space-y-2'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  {statusIcons[item.status]}
                  <span className='capitalize font-medium'>{item.status}</span>
                </div>
                <span className='text-sm text-gray-500'>
                  {item.count.toLocaleString()} ({percentage}%)
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className={`${statusColors[item.status]} h-2 rounded-full`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
