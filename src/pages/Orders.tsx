
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Download, 
  Filter, 
  Search, 
  Eye, 
  ArrowUpDown 
} from 'lucide-react';
import { OrderStatus } from '@/components/ui/order-statistics';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock order data
interface Order {
  id: string;
  eventName: string;
  customer: string;
  email: string;
  date: string;
  amount: number;
  ticketType: string;
  tickets: number;
  status: OrderStatus;
  isOffline?: boolean;
}

const mockOrders: Order[] = [
  {
    id: '1001',
    eventName: 'Summer Music Festival',
    customer: 'John Smith',
    email: 'john@example.com',
    date: 'Apr 3, 2025 12:34 PM',
    amount: 120,
    ticketType: 'VIP',
    tickets: 2,
    status: 'completed',
  },
  {
    id: '1002',
    eventName: 'Tech Conference 2025',
    customer: 'Emma Johnson',
    email: 'emma@example.com',
    date: 'Apr 2, 2025 10:15 AM',
    amount: 75,
    ticketType: 'Standard',
    tickets: 1,
    status: 'pending',
  },
  {
    id: '1003',
    eventName: 'Food & Wine Expo',
    customer: 'Carlos Rodriguez',
    email: 'carlos@example.com',
    date: 'Apr 1, 2025 3:22 PM',
    amount: 60,
    ticketType: 'Early Bird',
    tickets: 2,
    status: 'completed',
    isOffline: true,
  },
  {
    id: '1004',
    eventName: 'Summer Music Festival',
    customer: 'Sarah Lee',
    email: 'sarah@example.com',
    date: 'Mar 31, 2025 9:45 AM',
    amount: 180,
    ticketType: 'Group',
    tickets: 3,
    status: 'cancelled',
  },
  {
    id: '1005',
    eventName: 'Tech Conference 2025',
    customer: 'Michael Brown',
    email: 'michael@example.com',
    date: 'Mar 30, 2025 5:18 PM',
    amount: 150,
    ticketType: 'VIP',
    tickets: 2,
    status: 'refunded',
  },
  {
    id: '1006',
    eventName: 'Art Exhibition',
    customer: 'Lisa Wang',
    email: 'lisa@example.com',
    date: 'Mar 29, 2025 1:12 PM',
    amount: 40,
    ticketType: 'Standard',
    tickets: 1,
    status: 'completed',
  },
  {
    id: '1007',
    eventName: 'Business Summit',
    customer: 'David Kim',
    email: 'david@example.com',
    date: 'Mar 28, 2025 11:05 AM',
    amount: 200,
    ticketType: 'VIP',
    tickets: 1,
    status: 'completed',
    isOffline: true,
  },
  {
    id: '1008',
    eventName: 'Food & Wine Expo',
    customer: 'Jennifer Miller',
    email: 'jennifer@example.com',
    date: 'Mar 27, 2025 2:40 PM',
    amount: 90,
    ticketType: 'Group',
    tickets: 3,
    status: 'pending',
  },
  {
    id: '1009',
    eventName: 'Wellness Retreat',
    customer: 'Robert Chen',
    email: 'robert@example.com',
    date: 'Mar 26, 2025 9:30 AM',
    amount: 120,
    ticketType: 'Early Bird',
    tickets: 2,
    status: 'completed',
  },
  {
    id: '1010',
    eventName: 'Tech Conference 2025',
    customer: 'Amanda Taylor',
    email: 'amanda@example.com',
    date: 'Mar 25, 2025 4:15 PM',
    amount: 75,
    ticketType: 'Standard',
    tickets: 1,
    status: 'cancelled',
  },
];

const Orders = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const uniqueEvents = Array.from(new Set(mockOrders.map(order => order.eventName)));
  const uniqueTicketTypes = Array.from(new Set(mockOrders.map(order => order.ticketType)));
  
  const handleViewOrder = (order: Order) => {
    toast({
      title: "View Order",
      description: `Viewing order #${order.id} for ${order.eventName}`,
    });
  };
  
  const handleResendConfirmation = (order: Order) => {
    toast({
      title: "Confirmation Resent",
      description: `Confirmation email resent to ${order.email}`,
    });
  };
  
  const handleExportOrders = () => {
    toast({
      title: "Orders Exported",
      description: "All orders have been exported to CSV",
    });
  };
  
  const filteredOrders = mockOrders.filter(order => {
    // Apply search filter
    if (searchQuery && !order.customer.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !order.id.includes(searchQuery) && 
        !order.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Apply event filter
    if (eventFilter !== 'all' && order.eventName !== eventFilter) {
      return false;
    }
    
    // Apply ticket type filter
    if (typeFilter !== 'all' && order.ticketType !== typeFilter) {
      return false;
    }
    
    return true;
  });
  
  const statusBadge = (status: OrderStatus) => {
    switch(status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Completed</span>
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Cancelled</span>
          </Badge>
        );
      case 'refunded':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Refunded</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExportOrders}
        >
          <Download className="h-4 w-4" />
          <span>Export Orders</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Order Management</CardTitle>
          <CardDescription>View and manage all your ticket orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search by order ID, customer name, or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {uniqueEvents.map(event => (
                    <SelectItem key={event} value={event}>{event}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Ticket Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTicketTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer}</div>
                          <div className="text-sm text-muted-foreground">{order.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{order.eventName}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.ticketType}</TableCell>
                      <TableCell>{order.tickets}</TableCell>
                      <TableCell>${order.amount.toLocaleString()}</TableCell>
                      <TableCell>{statusBadge(order.status)}</TableCell>
                      <TableCell>
                        <Badge variant={order.isOffline ? "outline" : "default"} className="text-xs">
                          {order.isOffline ? 'Offline' : 'Online'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleViewOrder(order)}
                          >
                            <span className="sr-only">View order</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status !== 'cancelled' && order.status !== 'refunded' && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleResendConfirmation(order)}
                            >
                              <span className="sr-only">Resend confirmation</span>
                              <span className="h-4 w-4">📧</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                      No orders found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
