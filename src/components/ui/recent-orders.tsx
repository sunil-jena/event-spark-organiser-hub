
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle2, XCircle, AlertCircle, Eye } from 'lucide-react';

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
  onViewOrder?: (order: Order) => void;
  className?: string;
}

export function RecentOrders({
  orders,
  onViewOrder,
  className,
}: RecentOrdersProps) {
  const statusConfig = {
    completed: {
      label: 'Completed',
      icon: CheckCircle2,
      className: 'bg-green-50 text-green-600 border-green-200',
    },
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      className: 'bg-red-50 text-red-600 border-red-200',
    },
    refunded: {
      label: 'Refunded',
      icon: AlertCircle,
      className: 'bg-blue-50 text-blue-600 border-blue-200',
    },
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest ticket purchases and reservations</CardDescription>
          </div>
          <Button variant="outline" size="sm">View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-left text-muted-foreground">
                <th className="font-medium p-3">Order ID</th>
                <th className="font-medium p-3">Event</th>
                <th className="font-medium p-3">Customer</th>
                <th className="font-medium p-3">Date</th>
                <th className="font-medium p-3">Amount</th>
                <th className="font-medium p-3">Tickets</th>
                <th className="font-medium p-3">Status</th>
                <th className="font-medium p-3">Type</th>
                <th className="font-medium p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                
                return (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">#{order.id}</td>
                    <td className="p-3 text-sm font-medium">{order.eventName}</td>
                    <td className="p-3 text-sm">{order.customer}</td>
                    <td className="p-3 text-sm text-muted-foreground">{order.date}</td>
                    <td className="p-3 text-sm font-medium">${order.amount.toLocaleString()}</td>
                    <td className="p-3 text-sm">{order.tickets}</td>
                    <td className="p-3 text-sm">
                      <div className="flex items-center gap-1">
                        <StatusIcon className="h-3.5 w-3.5" />
                        <span>{statusConfig[order.status].label}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm">
                      <Badge variant={order.isOffline ? "outline" : "default"} className="text-xs">
                        {order.isOffline ? 'Offline' : 'Online'}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0" 
                        onClick={() => onViewOrder?.(order)}
                      >
                        <span className="sr-only">View order</span>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
