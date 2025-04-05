import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Calendar, 
  ChevronDown, 
  Download, 
  FilterIcon, 
  Printer,
  FileText,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  Calendar as CalendarIcon,
  Search,
  Plus,
  MoreHorizontal,
  RefreshCw,
  PackageCheck,
  Truck,
  MapPin,
  User,
  ShoppingCart,
  LucideIcon,
  Package,
  Receipt,
  ChevronsUpDown,
  Copy,
  Mail,
  Phone,
  Map,
  Edit,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataPagination } from '@/components/ui/data-pagination';
import { AdvancedSearch, Filter } from '@/components/ui/advanced-search';
import { FilterDropdown, FilterGroup } from '@/components/ui/filter-dropdown';
import { useToast } from '@/hooks/use-toast';
import { CustomModalForm, FormField } from '@/components/ui/custom-modal-form';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Order {
  id: string;
  date: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  event: {
    id: string;
    name: string;
    venue: string;
    date: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  shippingAddress: string;
  trackingNumber: string;
}

const Orders = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders: Order[] = [
    {
      id: 'OD-2345',
      date: '2025-04-01',
      customer: {
        id: 'CUST-1122',
        name: 'Raj Patel',
        email: 'raj.patel@example.com',
        phone: '9876543210',
        address: '123, Main Street, Mumbai'
      },
      event: {
        id: 'EV-1001',
        name: 'Summer Music Festival',
        venue: 'Mumbai Grounds',
        date: '2025-04-20'
      },
      items: [
        { name: 'VIP Pass', quantity: 1, price: 2999 },
      ],
      totalAmount: 2999,
      paymentMethod: 'Credit Card',
      status: 'delivered',
      shippingAddress: '123, Main Street, Mumbai',
      trackingNumber: 'TN-987654321',
    },
    {
      id: 'OD-2346',
      date: '2025-04-01',
      customer: {
        id: 'CUST-1123',
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '8765432109',
        address: '456, Linking Road, Bandra'
      },
      event: {
        id: 'EV-1001',
        name: 'Summer Music Festival',
        venue: 'Mumbai Grounds',
        date: '2025-04-20'
      },
      items: [
        { name: 'Regular Pass', quantity: 2, price: 1499 },
        { name: 'Food Voucher', quantity: 2, price: 500 },
      ],
      totalAmount: 3998,
      paymentMethod: 'UPI',
      status: 'shipped',
      shippingAddress: '456, Linking Road, Bandra',
      trackingNumber: 'TN-876543210',
    },
    {
      id: 'OD-2347',
      date: '2025-04-02',
      customer: {
        id: 'CUST-1124',
        name: 'Anil Kumar',
        email: 'anil.kumar@example.com',
        phone: '7654321098',
        address: '789, MG Road, Bangalore'
      },
      event: {
        id: 'EV-1002',
        name: 'Tech Conference 2025',
        venue: 'Bangalore Expo',
        date: '2025-05-10'
      },
      items: [
        { name: 'Full Access Pass', quantity: 1, price: 4499 },
      ],
      totalAmount: 4499,
      paymentMethod: 'Debit Card',
      status: 'processing',
      shippingAddress: '789, MG Road, Bangalore',
      trackingNumber: 'TN-765432109',
    },
    {
      id: 'OD-2348',
      date: '2025-04-02',
      customer: {
        id: 'CUST-1125',
        name: 'Sunita Reddy',
        email: 'sunita.reddy@example.com',
        phone: '6543210987',
        address: '101, Brigade Road, Bangalore'
      },
      event: {
        id: 'EV-1002',
        name: 'Tech Conference 2025',
        venue: 'Bangalore Expo',
        date: '2025-05-10'
      },
      items: [
        { name: 'Basic Pass', quantity: 3, price: 1499 },
      ],
      totalAmount: 4497,
      paymentMethod: 'NetBanking',
      status: 'pending',
      shippingAddress: '101, Brigade Road, Bangalore',
      trackingNumber: 'TN-654321098',
    },
    {
      id: 'OD-2349',
      date: '2025-04-03',
      customer: {
        id: 'CUST-1126',
        name: 'Vikram Singh',
        email: 'vikram.singh@example.com',
        phone: '5432109876',
        address: '222, Park Street, Kolkata'
      },
      event: {
        id: 'EV-1003',
        name: 'Food & Wine Expo',
        venue: 'Kolkata Grounds',
        date: '2025-04-25'
      },
      items: [
        { name: 'Entry Ticket', quantity: 1, price: 2499 },
      ],
      totalAmount: 2499,
      paymentMethod: 'Credit Card',
      status: 'cancelled',
      shippingAddress: '222, Park Street, Kolkata',
      trackingNumber: 'TN-543210987',
    },
    {
      id: 'OD-2350',
      date: '2025-04-03',
      customer: {
        id: 'CUST-1127',
        name: 'Neha Verma',
        email: 'neha.verma@example.com',
        phone: '4321098765',
        address: '333, Camac Street, Kolkata'
      },
      event: {
        id: 'EV-1003',
        name: 'Food & Wine Expo',
        venue: 'Kolkata Grounds',
        date: '2025-04-25'
      },
      items: [
        { name: 'Entry Ticket', quantity: 1, price: 1799 },
      ],
      totalAmount: 1799,
      paymentMethod: 'UPI',
      status: 'refunded',
      shippingAddress: '333, Camac Street, Kolkata',
      trackingNumber: 'TN-432109876',
    },
    {
      id: 'OD-2351',
      date: '2025-04-04',
      customer: {
        id: 'CUST-1128',
        name: 'Rahul Gupta',
        email: 'rahul.gupta@example.com',
        phone: '3210987654',
        address: '444, Central Avenue, Chennai'
      },
      event: {
        id: 'EV-1004',
        name: 'Comedy Night',
        venue: 'Chennai Auditorium',
        date: '2025-05-05'
      },
      items: [
        { name: 'Gold Ticket', quantity: 2, price: 1749 },
      ],
      totalAmount: 3498,
      paymentMethod: 'Credit Card',
      status: 'delivered',
      shippingAddress: '444, Central Avenue, Chennai',
      trackingNumber: 'TN-321098765',
    },
    {
      id: 'OD-2352',
      date: '2025-04-04',
      customer: {
        id: 'CUST-1129',
        name: 'Anjali Das',
        email: 'anjali.das@example.com',
        phone: '2109876543',
        address: '555, Mount Road, Chennai'
      },
      event: {
        id: 'EV-1004',
        name: 'Comedy Night',
        venue: 'Chennai Auditorium',
        date: '2025-05-05'
      },
      items: [
        { name: 'Silver Ticket', quantity: 1, price: 699 },
      ],
      totalAmount: 699,
      paymentMethod: 'UPI',
      status: 'pending',
      shippingAddress: '555, Mount Road, Chennai',
      trackingNumber: 'TN-210987654',
    },
    {
      id: 'OD-2353',
      date: '2025-04-05',
      customer: {
        id: 'CUST-1130',
        name: 'Sanjay Joshi',
        email: 'sanjay.joshi@example.com',
        phone: '1098765432',
        address: '666, Anna Salai, Chennai'
      },
      event: {
        id: 'EV-1004',
        name: 'Comedy Night',
        venue: 'Chennai Auditorium',
        date: '2025-05-05'
      },
      items: [
        { name: 'Bronze Ticket', quantity: 1, price: 1499 },
      ],
      totalAmount: 1499,
      paymentMethod: 'Credit Card',
      status: 'cancelled',
      shippingAddress: '666, Anna Salai, Chennai',
      trackingNumber: 'TN-109876543',
    },
    {
      id: 'OD-2354',
      date: '2025-04-05',
      customer: {
        id: 'CUST-1131',
        name: 'Kavita Nair',
        email: 'kavita.nair@example.com',
        phone: '9988776655',
        address: '777, T Nagar, Chennai'
      },
      event: {
        id: 'EV-1005',
        name: 'Tech Workshop',
        venue: 'Chennai Tech Park',
        date: '2025-04-15'
      },
      items: [
        { name: 'Workshop Pass', quantity: 1, price: 998 },
      ],
      totalAmount: 998,
      paymentMethod: 'NetBanking',
      status: 'delivered',
      shippingAddress: '777, T Nagar, Chennai',
      trackingNumber: 'TN-998877665',
    },
    {
      id: 'OD-2355',
      date: '2025-04-05',
      customer: {
        id: 'CUST-1132',
        name: 'Mohammed Khan',
        email: 'mohammed.khan@example.com',
        phone: '8877665544',
        address: '888, Nungambakkam, Chennai'
      },
      event: {
        id: 'EV-1006',
        name: 'Art Exhibition',
        venue: 'Chennai Art Gallery',
        date: '2025-04-10'
      },
      items: [
        { name: 'Entry Pass', quantity: 2, price: 899 },
      ],
      totalAmount: 1798,
      paymentMethod: 'Credit Card',
      status: 'shipped',
      shippingAddress: '888, Nungambakkam, Chennai',
      trackingNumber: 'TN-887766554',
    },
    {
      id: 'OD-2356',
      date: '2025-04-05',
      customer: {
        id: 'CUST-1133',
        name: 'Lakshmi Pillai',
        email: 'lakshmi.pillai@example.com',
        phone: '7766554433',
        address: '999, Adyar, Chennai'
      },
      event: {
        id: 'EV-1006',
        name: 'Art Exhibition',
        venue: 'Chennai Art Gallery',
        date: '2025-04-10'
      },
      items: [
        { name: 'Entry Pass', quantity: 1, price: 899 },
      ],
      totalAmount: 899,
      paymentMethod: 'UPI',
      status: 'processing',
      shippingAddress: '999, Adyar, Chennai',
      trackingNumber: 'TN-776655443',
    },
  ];

  // Helper function to safely check if a value includes a search string
  const safeIncludes = (value: string | number | boolean | string[], search: string): boolean => {
    if (typeof value === 'string') {
      return value.toLowerCase().includes(search.toLowerCase());
    } else if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
      return value.some(item => item.toLowerCase().includes(search.toLowerCase()));
    }
    return String(value).includes(search);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      safeIncludes(order.id, searchQuery) ||
      safeIncludes(order.customer.name, searchQuery) ||
      safeIncludes(order.event.name, searchQuery);
    
    const matchesFilters = activeFilters.every(filter => {
      const value = order[filter.field as keyof Order];
      
      if (typeof value === 'string') {
        if (filter.operator === 'equals') {
          return value === filter.value;
        } else if (filter.operator === 'contains') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        }
      } else if (typeof value === 'number') {
        const numValue = Number(filter.value);
        if (filter.operator === 'equals') {
          return value === numValue;
        } else if (filter.operator === 'greaterThan') {
          return value > numValue;
        } else if (filter.operator === 'lessThan') {
          return value < numValue;
        }
      }
      
      return true;
    });
    
    return matchesSearch && matchesFilters;
  });

  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <StatusBadge status="warning" label="Pending" />;
      case 'processing':
        return <StatusBadge status="info" label="Processing" />;
      case 'shipped':
        return <StatusBadge status="info" label="Shipped" />;
      case 'delivered':
        return <StatusBadge status="success" label="Delivered" />;
      case 'cancelled':
        return <StatusBadge status="error" label="Cancelled" />;
      case 'refunded':
        return <StatusBadge status="error" label="Refunded" />;
      default:
        return <StatusBadge status="default" label={status} />;
    }
  };

  const filterOptions = [
    {
      name: 'Status',
      options: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    },
    {
      name: 'Payment Method',
      options: ['Credit Card', 'Debit Card', 'UPI', 'NetBanking'],
    },
  ];

  const handleFilterChange = (filterName: string, option: string, isSelected: boolean) => {
    setActiveFilters(prev => {
      if (isSelected) {
        return [...prev, {
          field: filterName === 'Status' ? 'status' : 'paymentMethod',
          operator: 'equals',
          value: option
        }];
      } else {
        return prev.filter(filter => 
          !(filter.field === (filterName === 'Status' ? 'status' : 'paymentMethod') && 
          filter.value === option)
        );
      }
    });
    
    setCurrentPage(1);
  };

  const handleSearch = (query: string, filters: Filter[]) => {
    setSearchQuery(query);
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleOpenDetailsModal = (order: Order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Order updated",
      description: `Order ${selectedOrder?.id} has been updated successfully`,
    });
  };

  const orderDetailFields: FormField[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'refunded', label: 'Refunded' },
      ],
      defaultValue: selectedOrder?.status || 'pending',
    },
    {
      id: 'trackingNumber',
      label: 'Tracking Number',
      type: 'text',
      placeholder: 'Enter tracking number',
      defaultValue: selectedOrder?.trackingNumber || '',
    },
    {
      id: 'shippingAddress',
      label: 'Shipping Address',
      type: 'textarea',
      placeholder: 'Enter shipping address',
      defaultValue: selectedOrder?.shippingAddress || '',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast({ title: "Exporting PDF" })}>
                <FileText className="mr-2 h-4 w-4" /> Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Exporting CSV" })}>
                <FileText className="mr-2 h-4 w-4" /> Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Exporting Excel" })}>
                <FileText className="mr-2 h-4 w-4" /> Export as Excel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast({ title: "Print initiated" })}>
                <Printer className="mr-2 h-4 w-4" /> Print Orders Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Showing {filteredOrders.length} orders for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex-grow w-full md:w-auto">
              <AdvancedSearch 
                onSearch={handleSearch} 
                placeholder="Search orders..." 
                fields={[
                  { name: 'id', label: 'Order ID' },
                  { name: 'customer.name', label: 'Customer Name' },
                  { name: 'event.name', label: 'Event Name' },
                ]}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {filterOptions.map((filterGroup) => (
                <FilterDropdown 
                  key={filterGroup.name}
                  triggerText={filterGroup.name}
                  icon={<FilterIcon className="h-4 w-4" />}
                >
                  <FilterGroup>
                    {filterGroup.options.map((option) => {
                      const field = filterGroup.name === 'Status' ? 'status' : 'paymentMethod';
                      const isActive = activeFilters.some(f => f.field === field && f.value === option);
                      
                      return (
                        <div key={option} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`filter-${filterGroup.name}-${option}`}
                            checked={isActive}
                            onChange={(e) => handleFilterChange(filterGroup.name, option, e.target.checked)}
                            className="rounded text-primary focus:ring-primary"
                          />
                          <Label 
                            htmlFor={`filter-${filterGroup.name}-${option}`}
                            className="text-sm cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      );
                    })}
                  </FilterGroup>
                </FilterDropdown>
              ))}
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setActiveFilters([]);
                  setSearchQuery('');
                }}
                disabled={activeFilters.length === 0 && searchQuery === ''}
                title="Clear filters"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No orders found. Try a different search or filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => (
                    <TableRow key={order.id} className="table-row-hover">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>{order.customer.name}</TableCell>
                      <TableCell>{order.event.name}</TableCell>
                      <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDetailsModal(order)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4">
            <DataPagination
              currentPage={currentPage}
              totalItems={filteredOrders.length}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setItemsPerPage}
              showingText="orders"
            />
          </div>
        </CardContent>
      </Card>

      <CustomModalForm
        title="Order Details"
        description="View complete order information"
        fields={orderDetailFields}
        onSubmit={handleSubmitDetails}
        submitText="Update Order"
        cancelText="Close"
        isOpen={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        width="md"
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder?.customer.name}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder?.customer.email}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder?.customer.phone}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder?.customer.address}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Event Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder?.event.name}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder?.event.venue}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(selectedOrder?.event.date || '').toLocaleDateString()}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedOrder?.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₹{item.price.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Shipping Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder?.shippingAddress}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder?.trackingNumber}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Payment Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Total Amount: ₹{selectedOrder?.totalAmount.toLocaleString()}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span>Payment Method: {selectedOrder?.paymentMethod}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModalForm>
    </div>
  );
};
