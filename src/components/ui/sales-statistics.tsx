
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

export interface SalesData {
  name: string;
  value: number;
  online?: number;
  offline?: number;
  total?: number;
}

export interface SalesStatisticsProps {
  data: SalesData[];
  type: string;
  title?: string;
  totalSales?: number;
  onlineSales?: number;
  offlineSales?: number;
  percentageChange?: number;
  currency?: string;
}

export function SalesStatistics({
  data,
  type,
  title = 'Sales Statistics',
  totalSales,
  onlineSales,
  offlineSales,
  percentageChange = 0,
  currency = '₹'
}: SalesStatisticsProps) {
  const isPositive = percentageChange >= 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <CardDescription>Sales overview and statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold">{currency}{totalSales?.toLocaleString() || '0'}</span>
              <span className="text-sm text-muted-foreground">Total Sales</span>
            </div>
            <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">{Math.abs(percentageChange)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <CardContent className="p-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Online</span>
                  <span className="text-lg font-bold">{currency}{onlineSales?.toLocaleString() || '0'}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Offline</span>
                  <span className="text-lg font-bold">{currency}{offlineSales?.toLocaleString() || '0'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {data && data.length > 0 && (
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium mb-2">By {type}</div>
              <div className="space-y-2">
                {data.map((item, index) => (
                  <div key={index} className="grid grid-cols-2 items-center gap-2">
                    <div className="text-sm">{item.name}</div>
                    <div className="flex items-center justify-end">
                      <span className="text-sm font-medium">{currency}{item.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
