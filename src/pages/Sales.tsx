
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
  Eye,
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
import { FilterDropdown, FilterGroup, FilterItem } from '@/components/ui/filter-dropdown';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Define a unified SalesData interface that works for both components
export interface SalesData {
  name: string;
  value: number;
  online?: number;
  offline?: number;
  total?: number;
}

interface Sale {
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

const Sales = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const sales: Sale[] = [
    {
      id: 'SL-2345',
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
      id: 'SL-2346',
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
      id: 'SL-2347',
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
      id: 'SL-2348',
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
      id: 'SL-2349',
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
      id: 'SL-2350',
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
      id: 'SL-2351',
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
      id: 'SL-2352',
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
      id: 'SL-2353',
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
      id: 'SL-2354',
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
      id: 'SL-2355',
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
      id: 'SL-2356',
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

  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      safeIncludes(sale.id, searchQuery) ||
      safeIncludes(sale.customer.name, searchQuery) ||
      safeIncludes(sale.event.name, searchQuery);
    
    const matchesFilters = activeFilters.every(filter => {
      const value = sale[filter.field as keyof Sale];
      
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

  const totalSales = filteredSales.length;
  const totalPages = Math.ceil(totalSales / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);

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

  const handleOpenDetailsModal = (sale: Sale) => {
    setSelectedSale(sale);
    setDetailsModalOpen(true);
  };

  const handleSubmitDetails = async (data: Record<string, any>) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Sale updated",
      description: `Sale ${selectedSale?.id} has been updated successfully`,
    });
    
    return true;
  };

  const saleDetailFields: FormField[] = [
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
      defaultValue: selectedSale?.status || 'pending',
    },
    {
      id: 'trackingNumber',
      label: 'Tracking Number',
      type: 'text',
      placeholder: 'Enter tracking number',
      defaultValue: selectedSale?.trackingNumber || '',
    },
    {
      id: 'shippingAddress',
      label: 'Shipping Address',
      type: 'textarea',
      placeholder: 'Enter shipping address',
      defaultValue: selectedSale?.shippingAddress || '',
    },
  ];

  // Then ensure that all SalesData arrays match this interface structure
  const salesData: SalesData[] = [
    { name: 'Jan', value: 4000, online: 2500, offline: 1500, total: 4000 },
    { name: 'Feb', value: 3000, online: 1800, offline: 1200, total: 3000 },
    { name: 'Mar', value: 5000, online: 3200, offline: 1800, total: 5000 },
    { name: 'Apr', value: 6000, online: 3800, offline: 2200, total: 6000 },
    { name: 'May', value: 4500, online: 2700, offline: 1800, total: 4500 },
    { name: 'Jun', value: 5500, online: 3500, offline: 2000, total: 5500 },
    { name: 'Jul', value: 7000, online: 4500, offline: 2500, total: 7000 },
    { name: 'Aug', value: 6500, online: 4000, offline: 2500, total: 6500 },
    { name: 'Sep', value: 5000, online: 3000, offline: 2000, total: 5000 },
    { name: 'Oct', value: 5500, online: 3300, offline: 2200, total: 5500 },
    { name: 'Nov', value: 4000, online: 2400, offline: 1600, total: 4000 },
    { name: 'Dec', value: 6000, online: 3600, offline: 2400, total: 6000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sales</h1>
          <p className="text-muted-foreground">Track and manage customer sales</p>
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
                <Printer className="mr-2 h-4 w-4" /> Print Sales Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>
            Showing {filteredSales.length} sales for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex-grow w-full md:w-auto">
              <AdvancedSearch 
                onSearch={handleSearch} 
                placeholder="Search sales..." 
                fields={[
                  { name: 'id', label: 'Sale ID' },
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
                  <FilterGroup title={filterGroup.name}>
                    {filterGroup.options.map((option) => {
                      const field = filterGroup.name === 'Status' ? 'status' : 'paymentMethod';
                      const isActive = activeFilters.some(f => f.field === field && f.value === option);
                      
                      return (
                        <FilterItem
                          key={option}
                          checked={isActive}
                          onCheckedChange={(checked) => handleFilterChange(filterGroup.name, option, checked)}
                          label={option}
                          value={option}
                        />
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-3xl font-bold">₹42,950</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" /> 12.5% from last month
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-3xl font-bold">267</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" /> 8.2% from last month
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-3xl font-bold">156</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" /> 5.3% from last month
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>View monthly sales data</CardDescription>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm">
                        Daily
                      </Button>
                      <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                        Monthly
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Online Sales</TableHead>
                          <TableHead>Offline Sales</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">January</TableCell>
                          <TableCell>₹2,500</TableCell>
                          <TableCell>₹1,500</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">February</TableCell>
                          <TableCell>₹1,800</TableCell>
                          <TableCell>₹1,200</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">March</TableCell>
                          <TableCell>₹3,200</TableCell>
                          <TableCell>₹1,800</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">April</TableCell>
                          <TableCell>₹3,800</TableCell>
                          <TableCell>₹2,200</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">May</TableCell>
                          <TableCell>₹2,700</TableCell>
                          <TableCell>₹1,800</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Events</CardTitle>
                    <CardDescription>Events with most sales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Summer Music Festival</p>
                          <p className="text-sm text-muted-foreground">Mumbai Grounds</p>
                        </div>
                        <p className="font-medium">₹8,497</p>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Tech Conference 2025</p>
                          <p className="text-sm text-muted-foreground">Bangalore Expo</p>
                        </div>
                        <p className="font-medium">₹6,996</p>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Comedy Night</p>
                          <p className="text-sm text-muted-foreground">Chennai Auditorium</p>
                        </div>
                        <p className="font-medium">₹4,197</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="transactions" className="space-y-4">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sale ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSales.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No sales found. Try a different search or filter.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedSales.map((sale) => (
                        <TableRow key={sale.id} className="table-row-hover">
                          <TableCell className="font-medium">{sale.id}</TableCell>
                          <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                          <TableCell>{sale.customer.name}</TableCell>
                          <TableCell>{sale.event.name}</TableCell>
                          <TableCell>₹{sale.totalAmount.toLocaleString()}</TableCell>
                          <TableCell>{sale.paymentMethod}</TableCell>
                          <TableCell>{getStatusBadge(sale.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenDetailsModal(sale)}>
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
                  totalItems={filteredSales.length}
                  pageSize={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setItemsPerPage}
                  showingText="sales"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Payment Method</CardTitle>
                    <CardDescription>Distribution of sales by payment method</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Credit Card</span>
                        <span className="font-medium">₹18,995</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>UPI</span>
                        <span className="font-medium">₹12,494</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Debit Card</span>
                        <span className="font-medium">₹6,497</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>NetBanking</span>
                        <span className="font-medium">₹4,998</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Status</CardTitle>
                    <CardDescription>Status of current sales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span>Delivered</span>
                        </div>
                        <span className="font-medium">86 orders</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span>Processing</span>
                        </div>
                        <span className="font-medium">67 orders</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                          <span>Shipped</span>
                        </div>
                        <span className="font-medium">52 orders</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span>Pending</span>
                        </div>
                        <span className="font-medium">35 orders</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span>Cancelled</span>
                        </div>
                        <span className="font-medium">15 orders</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                          <span>Refunded</span>
                        </div>
                        <span className="font-medium">12 orders</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CustomModalForm
        title="Sale Details"
        description="View complete sale information"
        fields={saleDetailFields}
        onSubmit={handleSubmitDetails}
        submitText="Update Sale"
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
                  <span>{selectedSale?.customer.name}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedSale?.customer.email}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedSale?.customer.phone}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedSale?.customer.address}</span>
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
                  <span>{selectedSale?.event.name}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedSale?.event.venue}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(selectedSale?.event.date || '').toLocaleDateString()}</span>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Sale Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedSale?.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₹{item.price.toLocaleString()}</TableCell>
                    <TableCell className="text-right">₹{(item.quantity * item.price).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Total Amount:</TableCell>
                  <TableCell className="text-right font-bold">₹{selectedSale?.totalAmount.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CustomModalForm>
    </div>
  );
};

export default Sales;
