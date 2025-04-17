import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import {
  FilterDropdown,
  FilterGroup,
  FilterItem,
} from '@/components/ui/filter-dropdown';
import { useToast } from '@/hooks/use-toast';
import { CustomModalForm, FormField } from '@/components/ui/custom-modal-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { onSubmitSalesForm } from '@/utils/sales-utils';

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
  status:
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  shippingAddress: string;
  trackingNumber: string;
}

const Sales: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Sample sales data for demonstration
  const salesData: Sale[] = [
    {
      id: 'S-1001',
      date: '2023-04-01',
      customer: {
        id: 'C-1001',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '555-1234',
        address: '123 Main St, New York, NY',
      },
      event: {
        id: 'E-1001',
        name: 'Summer Music Festival',
        venue: 'Central Park',
        date: '2023-07-15',
      },
      items: [
        { name: 'VIP Ticket', quantity: 2, price: 150 },
        { name: 'T-Shirt', quantity: 1, price: 25 },
      ],
      totalAmount: 325,
      paymentMethod: 'Credit Card',
      status: 'delivered',
      shippingAddress: '123 Main St, New York, NY',
      trackingNumber: 'TRK12345',
    },
    {
      id: 'S-1002',
      date: '2023-04-02',
      customer: {
        id: 'C-1002',
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '555-5678',
        address: '456 Elm St, Los Angeles, CA',
      },
      event: {
        id: 'E-1002',
        name: 'Tech Conference',
        venue: 'Convention Center',
        date: '2023-08-10',
      },
      items: [
        { name: 'General Admission', quantity: 1, price: 100 },
        { name: 'Workshop Access', quantity: 1, price: 50 },
      ],
      totalAmount: 150,
      paymentMethod: 'PayPal',
      status: 'processing',
      shippingAddress: '456 Elm St, Los Angeles, CA',
      trackingNumber: 'TRK67890',
    },
    {
      id: 'S-1003',
      date: '2023-04-03',
      customer: {
        id: 'C-1003',
        name: 'Robert Johnson',
        email: 'robert@example.com',
        phone: '555-9012',
        address: '789 Oak St, Chicago, IL',
      },
      event: {
        id: 'E-1003',
        name: 'Food Festival',
        venue: 'City Park',
        date: '2023-09-05',
      },
      items: [{ name: 'Weekend Pass', quantity: 4, price: 75 }],
      totalAmount: 300,
      paymentMethod: 'Credit Card',
      status: 'pending',
      shippingAddress: '789 Oak St, Chicago, IL',
      trackingNumber: '',
    },
  ];

  const getStatusColor = (status: Sale['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='container mx-auto py-6'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Sales Management</h1>
          <p className='text-muted-foreground'>
            Manage and track all your sales and transactions
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline'>
            <Download className='mr-2 h-4 w-4' /> Export
          </Button>
          <Button variant='outline'>
            <Printer className='mr-2 h-4 w-4' /> Print
          </Button>
          <Button>
            <Plus className='mr-2 h-4 w-4' /> New Sale
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full max-w-md grid-cols-3'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='sales'>Sales</TabsTrigger>
          <TabsTrigger value='reports'>Reports</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4 mt-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div className='text-2xl font-bold'>$24,567.89</div>
                  <div className='flex items-center text-green-500'>
                    <ArrowUpRight className='h-4 w-4 mr-1' />
                    <span className='text-sm'>12.5%</span>
                  </div>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  +$3,234.89 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Order Count
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div className='text-2xl font-bold'>1,234</div>
                  <div className='flex items-center text-green-500'>
                    <ArrowUpRight className='h-4 w-4 mr-1' />
                    <span className='text-sm'>8.2%</span>
                  </div>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  +89 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Average Order Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div className='text-2xl font-bold'>$78.32</div>
                  <div className='flex items-center text-red-500'>
                    <ArrowDownRight className='h-4 w-4 mr-1' />
                    <span className='text-sm'>3.1%</span>
                  </div>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  -$2.45 from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='lg:col-span-2'>
              <CardHeader>
                <CardTitle>Sales Over Time</CardTitle>
                <CardDescription>Revenue breakdown by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-80 flex items-center justify-center bg-muted/20 rounded-md'>
                  <p className='text-muted-foreground'>
                    Sales chart would go here
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Events</CardTitle>
                <CardDescription>
                  By revenue in the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='font-medium'>Summer Music Festival</p>
                      <p className='text-sm text-muted-foreground'>
                        Central Park
                      </p>
                    </div>
                    <p className='font-bold'>$12,345</p>
                  </div>
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='font-medium'>Tech Conference 2023</p>
                      <p className='text-sm text-muted-foreground'>
                        Convention Center
                      </p>
                    </div>
                    <p className='font-bold'>$8,724</p>
                  </div>
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='font-medium'>Food & Wine Festival</p>
                      <p className='text-sm text-muted-foreground'>City Park</p>
                    </div>
                    <p className='font-bold'>$5,678</p>
                  </div>
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='font-medium'>Comedy Night</p>
                      <p className='text-sm text-muted-foreground'>
                        Downtown Theater
                      </p>
                    </div>
                    <p className='font-bold'>$3,456</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='lg:col-span-2'>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  Latest transactions in your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className='font-medium'>{sale.id}</TableCell>
                        <TableCell>{sale.customer.name}</TableCell>
                        <TableCell>{sale.event.name}</TableCell>
                        <TableCell>${sale.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant='outline'
                            className={getStatusColor(sale.status)}
                          >
                            {sale.status.charAt(0).toUpperCase() +
                              sale.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='icon'>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem>
                                <Eye className='mr-2 h-4 w-4' /> View details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className='mr-2 h-4 w-4' /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <FileText className='mr-2 h-4 w-4' /> Generate
                                invoice
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Distribution by payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex justify-between'>
                    <div className='flex items-center'>
                      <div className='w-3 h-3 bg-primary rounded-full mr-2'></div>
                      <span>Credit Card</span>
                    </div>
                    <span className='font-medium'>68%</span>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex items-center'>
                      <div className='w-3 h-3 bg-blue-400 rounded-full mr-2'></div>
                      <span>PayPal</span>
                    </div>
                    <span className='font-medium'>22%</span>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex items-center'>
                      <div className='w-3 h-3 bg-green-400 rounded-full mr-2'></div>
                      <span>Bank Transfer</span>
                    </div>
                    <span className='font-medium'>7%</span>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex items-center'>
                      <div className='w-3 h-3 bg-yellow-400 rounded-full mr-2'></div>
                      <span>Other</span>
                    </div>
                    <span className='font-medium'>3%</span>
                  </div>
                </div>
                <div className='h-36 flex items-center justify-center bg-muted/20 rounded-md mt-4'>
                  <p className='text-muted-foreground'>Chart would go here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='sales' className='space-y-4 mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>All Sales</CardTitle>
              <CardDescription>Manage all your sale records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='mb-4 flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <div className='relative w-60'>
                    <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                    <Input placeholder='Search sales...' className='pl-8' />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' size='sm'>
                        <FilterIcon className='mr-2 h-4 w-4' /> Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-[200px]'>
                      <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Status</DropdownMenuItem>
                      <DropdownMenuItem>Date</DropdownMenuItem>
                      <DropdownMenuItem>Amount</DropdownMenuItem>
                      <DropdownMenuItem>Customer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant='outline' size='sm'>
                    <Calendar className='mr-2 h-4 w-4' /> Date Range
                  </Button>
                </div>
                <Button size='sm'>
                  <Plus className='mr-2 h-4 w-4' /> New Sale
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className='font-medium'>{sale.id}</TableCell>
                      <TableCell>
                        {new Date(sale.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col'>
                          <span>{sale.customer.name}</span>
                          <span className='text-xs text-muted-foreground'>
                            {sale.customer.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col'>
                          <span>{sale.event.name}</span>
                          <span className='text-xs text-muted-foreground'>
                            {new Date(sale.event.date).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='font-medium'>
                        ${sale.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>{sale.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getStatusColor(sale.status)}
                        >
                          {sale.status.charAt(0).toUpperCase() +
                            sale.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem>
                              <Eye className='mr-2 h-4 w-4' /> View details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className='mr-2 h-4 w-4' /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <FileText className='mr-2 h-4 w-4' /> Generate
                              invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className='mr-2 h-4 w-4' /> Update shipping
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <RefreshCw className='mr-2 h-4 w-4' /> Change
                              status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className='mt-4 flex items-center justify-between'>
                <div className='text-sm text-muted-foreground'>
                  Showing <span className='font-medium'>1</span> to{' '}
                  <span className='font-medium'>10</span> of{' '}
                  <span className='font-medium'>42</span> results
                </div>
                <div className='flex items-center space-x-2'>
                  <Button variant='outline' size='sm' disabled>
                    Previous
                  </Button>
                  <Button variant='outline' size='sm' className='ml-2'>
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='reports' className='space-y-4 mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Sales Reports</CardTitle>
              <CardDescription>
                Generate custom reports for your sales data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                <div className='space-y-2'>
                  <Label>Report Type</Label>
                  <Select defaultValue='sales'>
                    <SelectTrigger>
                      <SelectValue placeholder='Select report type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='sales'>Sales Summary</SelectItem>
                      <SelectItem value='products'>
                        Product Performance
                      </SelectItem>
                      <SelectItem value='customers'>
                        Customer Analysis
                      </SelectItem>
                      <SelectItem value='payments'>Payment Methods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label>Time Period</Label>
                  <Select defaultValue='month'>
                    <SelectTrigger>
                      <SelectValue placeholder='Select time period' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='today'>Today</SelectItem>
                      <SelectItem value='week'>This Week</SelectItem>
                      <SelectItem value='month'>This Month</SelectItem>
                      <SelectItem value='quarter'>This Quarter</SelectItem>
                      <SelectItem value='year'>This Year</SelectItem>
                      <SelectItem value='custom'>Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                <div className='space-y-2'>
                  <Label>Group By</Label>
                  <Select defaultValue='day'>
                    <SelectTrigger>
                      <SelectValue placeholder='Select grouping' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='day'>Day</SelectItem>
                      <SelectItem value='week'>Week</SelectItem>
                      <SelectItem value='month'>Month</SelectItem>
                      <SelectItem value='quarter'>Quarter</SelectItem>
                      <SelectItem value='category'>Category</SelectItem>
                      <SelectItem value='customer'>Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label>Format</Label>
                  <Select defaultValue='chart'>
                    <SelectTrigger>
                      <SelectValue placeholder='Select format' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='chart'>Chart</SelectItem>
                      <SelectItem value='table'>Table</SelectItem>
                      <SelectItem value='both'>Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='flex justify-end mb-6'>
                <Button className='mr-2'>
                  <FileText className='mr-2 h-4 w-4' /> Generate Report
                </Button>
                <Button variant='outline'>
                  <Download className='mr-2 h-4 w-4' /> Export
                </Button>
              </div>

              <div className='h-80 flex items-center justify-center bg-muted/20 rounded-md'>
                <div className='text-center'>
                  <FileText className='h-10 w-10 text-muted-foreground mx-auto mb-2' />
                  <p className='text-muted-foreground'>
                    Generate a report to see the data here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;
