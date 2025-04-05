
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface SalesStatisticsProps {
  title: string;
  totalSales: number;
  onlineSales: number;
  offlineSales: number;
  percentageChange?: number;
  timeFrame?: string;
  currency?: string;
  className?: string;
}

export function SalesStatistics({
  title,
  totalSales,
  onlineSales,
  offlineSales,
  percentageChange,
  timeFrame = "vs last month",
  currency = "$",
  className,
}: SalesStatisticsProps) {
  const isPositive = percentageChange && percentageChange > 0;
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalSales).replace('$', currency);

  const onlinePercentage = Math.round((onlineSales / totalSales) * 100) || 0;
  const offlinePercentage = 100 - onlinePercentage;

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-700",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{formattedTotal}</h3>
          {percentageChange !== undefined && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-xs font-medium flex items-center",
                isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}>
                {isPositive ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                {isPositive ? "+" : ""}{percentageChange}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{timeFrame}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">Online Sales</span>
          <span className="text-gray-500">{currency}{onlineSales.toLocaleString()} ({onlinePercentage}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div className="bg-primary h-2 rounded-full" style={{ width: `${onlinePercentage}%` }}></div>
        </div>
        
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">Offline Sales</span>
          <span className="text-gray-500">{currency}{offlineSales.toLocaleString()} ({offlinePercentage}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary-light h-2 rounded-full" style={{ width: `${offlinePercentage}%` }}></div>
        </div>
      </div>
    </div>
  );
}
