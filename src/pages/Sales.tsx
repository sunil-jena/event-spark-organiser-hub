
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  ChevronDown, 
  Download, 
  FilterIcon, 
  TrendingUp, 
  TrendingDown, 
  Printer,
  FileText,
  BarChart,
  BarChart2,
  PieChart,
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
} from 'lucide-react';
import { SalesChart } from '@/components/ui/sales-chart';
import { SalesStatistics } from '@/components/ui/sales-statistics';
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
import { AdvancedSearch, Filter as SearchFilter } from '@/components/ui/advanced-search';
import { FilterDropdown, FilterGroup } from '@/components/ui/filter-dropdown';
import { useToast } from '@/hooks/use-toast';
import { CustomModalForm, FormField } from '@/components/ui/custom-modal-form';

interface Transaction {
  id: string;
  date: string;
  customer: string;
  amount: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  eventName: string;
}

const Sales = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>([]);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const transactions: Transaction[] = [
    {
      id: 'TX-1234',
      date: '2025-04-01',
      customer: 'Raj Patel',
      amount: 2999,
      paymentMethod: 'Credit Card',
      status: 'completed',
      eventName: 'Summer Music Festival',
    },
    {
      id: 'TX-1235',
      date: '2025-04-01',
      customer: 'Priya Sharma',
      amount: 5998,
      paymentMethod: 'UPI',
      status: 'completed',
      eventName: 'Summer Music Festival',
    },
    {
      id: 'TX-1236',
      date: '2025-04-02',
      customer: 'Anil Kumar',
      amount: 1499,
      paymentMethod: 'Debit Card',
      status: 'completed',
      eventName: 'Tech Conference 2025',
    },
    {
      id: 'TX-1237',
      date: '2025-04-02',
      customer: 'Sunita Reddy',
      amount: 4497,
      paymentMethod: 'NetBanking',
      status: 'completed',
      eventName: 'Tech Conference 2025',
    },
    {
      id: 'TX-1238',
      date: '2025-04-03',
      customer: 'Vikram Singh',
      amount: 2499,
      paymentMethod: 'Credit Card',
      status: 'refunded',
      eventName: 'Food & Wine Expo',
    },
    {
      id: 'TX-1239',
      date: '2025-04-03',
      customer: 'Neha Verma',
      amount: 1799,
      paymentMethod: 'UPI',
      status: 'completed',
      eventName: 'Food & Wine Expo',
    },
    {
      id: 'TX-1240',
      date: '2025-04-04',
      customer: 'Rahul Gupta',
      amount: 3498,
      paymentMethod: 'Credit Card',
      status: 'completed',
      eventName: 'Comedy Night',
    },
    {
      id: 'TX-1241',
      date: '2025-04-04',
      customer: 'Anjali Das',
      amount: 699,
      paymentMethod: 'UPI',
      status: 'pending',
      eventName: 'Comedy Night',
    },
    {
      id: 'TX-1242',
      date: '2025-04-05',
      customer: 'Sanjay Joshi',
      amount: 1499,
      paymentMethod: 'Credit Card',
      status: 'failed',
      eventName: 'Comedy Night',
    },
    {
      id: 'TX-1243',
      date: '2025-04-05',
      customer: 'Kavita Nair',
      amount: 998,
      paymentMethod: 'NetBanking',
      status: 'completed',
      eventName: 'Tech Workshop',
    },
    {
      id: 'TX-1244',
      date: '2025-04-05',
      customer: 'Mohammed Khan',
      amount: 1798,
      paymentMethod: 'Credit Card',
      status: 'completed',
      eventName: 'Art Exhibition',
    },
    {
      id: 'TX-1245',
      date: '2025-04-05',
      customer: 'Lakshmi Pillai',
      amount: 899,
      paymentMethod: 'UPI',
      status: 'pending',
      eventName: 'Art Exhibition',
    },
  ];

  // Filter transactions based on search and active filters
  const filteredTransactions = transactions.filter(transaction => {
    // Check if transaction matches the search query
    const matchesSearch = 
      transaction.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.eventName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if transaction matches all active filters
    const matchesFilters = activeFilters.every(filter => {
      const value = transaction[filter.field as keyof Transaction];
      
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

  // Paginate transactions
  const totalTransactions = filteredTransactions.length;
  const totalPages = Math.ceil(totalTransactions / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Calculate statistics
  const totalRevenue = transactions.reduce((sum, transaction) => {
    if (transaction.status !== 'refunded' && transaction.status !== 'failed') {
      return sum + transaction.amount;
    }
    return sum;
  }, 0);
  
  const totalCompletedTransactions = transactions.filter(t => t.status === 'completed').length;
  const averageOrderValue = totalCompletedTransactions > 0 
    ? Math.round(totalRevenue / totalCompletedTransactions) 
    : 0;

  const totalRefunded = transactions
    .filter(t => t.status === 'refunded')
    .reduce((sum, t) => sum + t.amount, 0);

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <StatusBadge status="success" label="Completed" />;
      case 'pending':
        return <StatusBadge status="warning" label="Pending" />;
      case 'failed':
        return <StatusBadge status="error" label="Failed" />;
      case 'refunded':
        return <StatusBadge status="info" label="Refunded" />;
      default:
        return <StatusBadge status="info" label={status} />;
    }
  };

  // Prepare data for charts
  const dailySales = [
    { name: 'Apr 1', sales: 8997 },
    { name: 'Apr 2', sales: 5996 },
    { name: 'Apr 3', sales: 4298 },
    { name: 'Apr 4', sales: 4197 },
    { name: 'Apr 5', sales: 4595 },
  ];

  const paymentMethodsData = [
    { name: 'Credit Card', value: 14791 },
    { name: 'UPI', value: 9993 },
    { name: 'NetBanking', value: 5495 },
    { name: 'Debit Card', value: 1499 },
  ];

  const eventSalesData = [
    { name: 'Summer Music Festival', value: 8997 },
    { name: 'Tech Conference 2025', value: 5996 },
    { name: 'Food & Wine Expo', value: 4298 },
    { name: 'Comedy Night', value: 4197 },
    { name: 'Tech Workshop', value: 998 },
    { name: 'Art Exhibition', value: 2697 },
  ];

  // Filter options
  const filterOptions = [
    {
      name: 'Status',
      options: ['completed', 'pending', 'failed', 'refunded'],
    },
    {
      name: 'Payment Method',
      options: ['Credit Card', 'Debit Card', 'UPI', 'NetBanking'],
    },
    {
      name: 'Event',
      options: [
        'Summer Music Festival', 
        'Tech Conference 2025', 
        'Food & Wine Expo',
        'Comedy Night',
        'Tech Workshop',
        'Art Exhibition'
      ],
    },
  ];

  // Filter change handler
  const handleFilterChange = (filterName: string, option: string, isSelected: boolean) => {
    setActiveFilters(prev => {
      if (isSelected) {
        // Add new filter
        return [...prev, {
          field: filterName === 'Event' ? 'eventName' : filterName === 'Status' ? 'status' : 'paymentMethod',
          operator: 'equals',
          value: option
        }];
      } else {
        // Remove filter
        return prev.filter(filter => 
          !(filter.field === (filterName === 'Event' ? 'eventName' : filterName === 'Status' ? 'status' : 'paymentMethod') && 
          filter.value === option)
        );
      }
    });
    
    // Reset to first page when filter changes
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (query: string, filters: SearchFilter[]) => {
    setSearchQuery(query);
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  // Form fields for import modal
  const importModalFields: FormField[] = [
    {
      id: 'file',
      label: 'Upload File',
      type: 'file',
      acceptedFileTypes: '.csv, .xlsx',
      required: true,
    },
    {
      id: 'dateFormat',
      label: 'Date Format',
      type: 'select',
      options: [
        { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
        { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
        { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' },
      ],
      defaultValue: 'dd/mm/yyyy',
    },
    {
      id: 'currency',
      label: 'Currency',
      type: 'select',
      options: [
        { value: 'INR', label: 'Indian Rupee (₹)' },
        { value: 'USD', label: 'US Dollar ($)' },
        { value: 'EUR', label: 'Euro (€)' },
      ],
      defaultValue: 'INR',
    },
    {
      id: 'skipHeaders',
      label: 'Skip Header Row',
      type: 'checkbox',
      defaultValue: true,
    },
  ];

  // Handle import form submission
  const handleImportSubmit = async (data: Record<string, any>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Import successful",
      description: `Imported sales data with settings: ${data.dateFormat}, ${data.currency}`,
    });
    
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sales & Revenue</h1>
          <p className="text-muted-foreground">Track your event sales and revenue</p>
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
          <Button onClick={() => setImportModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h2 className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</h2>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500">12.5%</span>
              </Badge>
              <span className="ml-2 text-muted-foreground">vs. last period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Transactions</p>
                <h2 className="text-3xl font-bold">{totalCompletedTransactions}</h2>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500">8.2%</span>
              </Badge>
              <span className="ml-2 text-muted-foreground">vs. last period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                <h2 className="text-3xl font-bold">₹{averageOrderValue.toLocaleString()}</h2>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500">3.1%</span>
              </Badge>
              <span className="ml-2 text-muted-foreground">vs. last period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Refunded</p>
                <h2 className="text-3xl font-bold">₹{totalRefunded.toLocaleString()}</h2>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                <span className="text-red-500">2.4%</span>
              </Badge>
              <span className="ml-2 text-muted-foreground">vs. last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Daily sales for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesChart data={dailySales} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Revenue by payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <SalesStatistics data={paymentMethodsData} type="pie" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Top Selling Events</span>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('reports')}>
                    See details <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead className="text-right">Tickets Sold</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Summer Music Festival</TableCell>
                      <TableCell>₹8,997</TableCell>
                      <TableCell className="text-right">3</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Tech Conference 2025</TableCell>
                      <TableCell>₹5,996</TableCell>
                      <TableCell className="text-right">4</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Food & Wine Expo</TableCell>
                      <TableCell>₹4,298</TableCell>
                      <TableCell className="text-right">3</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Comedy Night</TableCell>
                      <TableCell>₹4,197</TableCell>
                      <TableCell className="text-right">3</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Art Exhibition</TableCell>
                      <TableCell>₹2,697</TableCell>
                      <TableCell className="text-right">3</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Event Performance</CardTitle>
                <CardDescription>Sales by event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <SalesStatistics data={eventSalesData} type="bar" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Showing {filteredTransactions.length} transactions for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex-grow w-full md:w-auto">
                  <AdvancedSearch 
                    onSearch={handleSearch} 
                    searchPlaceholder="Search transactions..." 
                    fields={[
                      { name: 'customer', label: 'Customer' },
                      { name: 'id', label: 'Transaction ID' },
                      { name: 'eventName', label: 'Event' },
                      { name: 'amount', label: 'Amount', type: 'number' },
                      { name: 'status', label: 'Status' },
                      { name: 'paymentMethod', label: 'Payment Method' }
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
                          const field = filterGroup.name === 'Event' ? 'eventName' : 
                                        filterGroup.name === 'Status' ? 'status' : 'paymentMethod';
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
                              <label 
                                htmlFor={`filter-${filterGroup.name}-${option}`}
                                className="text-sm cursor-pointer"
                              >
                                {option}
                              </label>
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
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No transactions found. Try a different search or filter.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="table-row-hover">
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.customer}</TableCell>
                          <TableCell>{transaction.eventName}</TableCell>
                          <TableCell>₹{transaction.amount.toLocaleString()}</TableCell>
                          <TableCell>{transaction.paymentMethod}</TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4">
                <DataPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredTransactions.length}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                  showingText="transactions"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Reports</CardTitle>
              <CardDescription>
                Generate and view detailed sales reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="hover-lift cursor-pointer" onClick={() => toast({ title: "Generating Event Sales Report" })}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Event Sales Report</h3>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <BarChart className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sales breakdown by individual events and categories
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-4">
                      Generate Report <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover-lift cursor-pointer" onClick={() => toast({ title: "Generating Payment Method Report" })}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Payment Methods</h3>
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <PieChart className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Analysis of payment methods used by customers
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-4">
                      Generate Report <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover-lift cursor-pointer" onClick={() => toast({ title: "Generating Revenue Trends Report" })}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Revenue Trends</h3>
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Daily, weekly, and monthly revenue trends
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-4">
                      Generate Report <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover-lift cursor-pointer" onClick={() => toast({ title: "Generating Discount Analysis Report" })}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Discount Analysis</h3>
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <BarChart2 className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Impact of discounts and promotions on sales
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-4">
                      Generate Report <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover-lift cursor-pointer" onClick={() => toast({ title: "Generating Tax Report" })}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Tax Report</h3>
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tax breakdown for accounting and compliance
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-4">
                      Generate Report <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover-lift cursor-pointer" onClick={() => toast({ title: "Generating Custom Report" })}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Custom Report</h3>
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <CalendarIcon className="h-5 w-5 text-red-600" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Create a custom sales report with specific parameters
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-4">
                      Generate Report <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Import Modal */}
      <CustomModalForm
        title="Import Sales Data"
        description="Upload a file with your sales data to import"
        fields={importModalFields}
        onSubmit={handleImportSubmit}
        submitText="Import Data"
        cancelText="Cancel"
        isOpen={importModalOpen}
        onOpenChange={setImportModalOpen}
        width="md"
      />
    </div>
  );
};

export default Sales;
