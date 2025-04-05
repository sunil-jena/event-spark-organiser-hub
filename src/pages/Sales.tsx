
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { 
  BarChart, 
  Calendar, 
  ChevronDown, 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Printer,
  Share2,
  ArrowRight,
  BarChart3,
  PieChart,
  LineChart,
  MoveRight,
  IndianRupee,
  Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataPagination } from '@/components/ui/data-pagination';
import { AdvancedSearch, Filter } from '@/components/ui/advanced-search';
import { FilterDropdown, FilterGroup } from '@/components/ui/filter-dropdown';
import { useToast } from '@/hooks/use-toast';
import { CustomModalForm, FormField } from '@/components/ui/custom-modal-form';
import {
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SalesData {
  id: string;
  eventName: string;
  date: string;
  tickets: number;
  revenue: number;
  averagePrice: number;
  change: number;
}

// Generate a larger dataset for sales data
const generateSalesData = (count: number): SalesData[] => {
  const events = [
    'Summer Music Festival',
    'Tech Conference 2025',
    'Food & Wine Expo',
    'Business Leadership Summit',
    'Comedy Night Special',
    'Wellness Retreat',
    'Art Exhibition',
    'Fashion Show 2025',
    'Gaming Convention',
    'Film Festival'
  ];
  
  const salesData: SalesData[] = [];
  
  for (let i = 1; i <= count; i++) {
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const randomTickets = Math.floor(Math.random() * 500) + 100;
    const randomAvgPrice = Math.floor(Math.random() * 2000) + 300;
    const randomRevenue = randomTickets * randomAvgPrice;
    const randomChange = (Math.random() * 20) - 10; // Between -10 and 10
    
    // Generate a random date within the last 90 days
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - Math.floor(Math.random() * 90));
    
    salesData.push({
      id: i.toString(),
      eventName: randomEvent,
      date: pastDate.toISOString().split('T')[0],
      tickets: randomTickets,
      revenue: randomRevenue,
      averagePrice: randomAvgPrice,
      change: parseFloat(randomChange.toFixed(1)),
    });
  }
  
  return salesData;
};

// Generate monthly sales data for charts
const generateMonthlySalesData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    name: month,
    online: Math.floor(Math.random() * 1000000) + 200000,
    offline: Math.floor(Math.random() * 500000) + 100000,
    total: 0 // Will be calculated
  })).map(item => ({
    ...item,
    total: item.online + item.offline
  }));
};

// Generate ticket type sales data for pie chart
const generateTicketTypeData = () => {
  return [
    { name: 'VIP', value: Math.floor(Math.random() * 300) + 100 },
    { name: 'Standard', value: Math.floor(Math.random() * 800) + 400 },
    { name: 'Early Bird', value: Math.floor(Math.random() * 500) + 200 },
    { name: 'Group', value: Math.floor(Math.random() * 200) + 100 },
    { name: 'Premium', value: Math.floor(Math.random() * 150) + 50 },
  ];
};

// Generate event comparison data for bar chart
const generateEventComparisonData = () => {
  const events = [
    'Summer Music Festival',
    'Tech Conference 2025',
    'Food & Wine Expo',
    'Business Summit',
    'Comedy Night',
    'Wellness Retreat',
  ];
  
  return events.map(event => ({
    name: event,
    revenue: Math.floor(Math.random() * 2000000) + 500000,
    tickets: Math.floor(Math.random() * 1000) + 200,
  }));
};

const Sales = () => {
  const { toast } = useToast();
  const allSalesData = generateSalesData(150);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [displayedSalesData, setDisplayedSalesData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Chart data
  const [monthlySalesData] = useState(generateMonthlySalesData());
  const [ticketTypeData] = useState(generateTicketTypeData());
  const [eventComparisonData] = useState(generateEventComparisonData());
  
  // Chart state
  const [selectedChartView, setSelectedChartView] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [selectedChartType, setSelectedChartType] = useState<'area' | 'bar' | 'line'>('area');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('This Month');
  const [selectedEvent, setSelectedEvent] = useState('All Events');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string | string[]>>({});
  
  // Summary data calculation
  const calculateSummaryData = () => {
    const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
    const ticketsSold = salesData.reduce((sum, item) => sum + item.tickets, 0);
    const averageTicketPrice = ticketsSold > 0 ? totalRevenue / ticketsSold : 0;
    const revenueGrowth = 8.7; // Fixed value for demo purposes
    
    return {
      totalRevenue,
      ticketsSold,
      averageTicketPrice,
      revenueGrowth
    };
  };
  
  const summaryData = calculateSummaryData();
  
  // Format currency function
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };
  
  // Color scheme for charts
  const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981'];
  
  // Filter configuration
  const searchFilters = [
    {
      id: 'eventName',
      name: 'Event',
      type: 'select' as const,
      options: Array.from(new Set(allSalesData.map(item => item.eventName))).map(event => ({
        value: event,
        label: event
      }))
    },
    {
      id: 'date',
      name: 'Date',
      type: 'date' as const,
    },
    {
      id: 'revenueBracket',
      name: 'Revenue Bracket',
      type: 'select' as const,
      options: [
        { value: 'low', label: 'Below ₹100,000' },
        { value: 'medium', label: '₹100,000 - ₹500,000' },
        { value: 'high', label: 'Above ₹500,000' }
      ]
    }
  ];
  
  const filterGroups: FilterGroup[] = [
    {
      id: 'timeFrame',
      label: 'Time Frame',
      options: [
        { id: 'today', label: 'Today' },
        { id: 'yesterday', label: 'Yesterday' },
        { id: 'thisWeek', label: 'This Week' },
        { id: 'thisMonth', label: 'This Month' },
        { id: 'lastMonth', label: 'Last Month' },
        { id: 'thisYear', label: 'This Year' }
      ]
    },
    {
      id: 'growth',
      label: 'Growth',
      options: [
        { id: 'positive', label: 'Positive Growth', colorClass: 'bg-green-500' },
        { id: 'negative', label: 'Negative Growth', colorClass: 'bg-red-500' }
      ]
    }
  ];
  
  // Export form fields
  const exportFields: FormField[] = [
    {
      id: 'format',
      label: 'Export Format',
      type: 'select',
      placeholder: 'Select format',
      required: true,
      options: [
        { value: 'csv', label: 'CSV' },
        { value: 'excel', label: 'Excel (XLSX)' },
        { value: 'pdf', label: 'PDF' }
      ],
      defaultValue: 'csv'
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'select',
      placeholder: 'Select date range',
      required: true,
      options: [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'thisWeek', label: 'This Week' },
        { value: 'thisMonth', label: 'This Month' },
        { value: 'lastMonth', label: 'Last Month' },
        { value: 'thisYear', label: 'This Year' },
        { value: 'custom', label: 'Custom Range' }
      ],
      defaultValue: 'thisMonth'
    },
    {
      id: 'includeCharts',
      label: 'Include Charts',
      type: 'switch',
      defaultValue: true
    },
    {
      id: 'includeSummary',
      label: 'Include Summary',
      type: 'switch',
      defaultValue: true
    }
  ];
  
  // Apply filtering
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate a network delay
    const timer = setTimeout(() => {
      let results = [...allSalesData];
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(item => 
          item.eventName.toLowerCase().includes(query) ||
          item.id.includes(query)
        );
      }
      
      // Apply advanced search filters
      if (activeFilters.length > 0) {
        activeFilters.forEach(filter => {
          if (filter.field === 'eventName' && filter.value) {
            results = results.filter(item => item.eventName === filter.value);
          }
          
          if (filter.field === 'date' && filter.value) {
            const filterDate = new Date(filter.value as string).toISOString().split('T')[0];
            results = results.filter(item => item.date === filterDate);
          }
          
          if (filter.field === 'revenueBracket' && filter.value) {
            switch (filter.value) {
              case 'low':
                results = results.filter(item => item.revenue < 100000);
                break;
              case 'medium':
                results = results.filter(item => item.revenue >= 100000 && item.revenue <= 500000);
                break;
              case 'high':
                results = results.filter(item => item.revenue > 500000);
                break;
            }
          }
        });
      }
      
      // Apply dropdown filters
      if (Object.keys(selectedFilters).length > 0) {
        // Time frame filter
        if (selectedFilters.timeFrame) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const timeFrame = selectedFilters.timeFrame as string;
          
          switch (timeFrame) {
            case 'today':
              results = results.filter(item => new Date(item.date).getTime() === today.getTime());
              break;
            case 'yesterday':
              const yesterday = new Date(today);
              yesterday.setDate(yesterday.getDate() - 1);
              results = results.filter(item => new Date(item.date).getTime() === yesterday.getTime());
              break;
            case 'thisWeek':
              const thisWeekStart = new Date(today);
              thisWeekStart.setDate(today.getDate() - today.getDay());
              results = results.filter(item => new Date(item.date) >= thisWeekStart);
              break;
            case 'thisMonth':
              const thisMonthStart = new Date(today);
              thisMonthStart.setDate(1);
              results = results.filter(item => new Date(item.date) >= thisMonthStart);
              break;
            case 'lastMonth':
              const lastMonthStart = new Date(today);
              lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
              lastMonthStart.setDate(1);
              const thisMonthStart2 = new Date(today);
              thisMonthStart2.setDate(1);
              results = results.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= lastMonthStart && itemDate < thisMonthStart2;
              });
              break;
            case 'thisYear':
              const thisYearStart = new Date(today);
              thisYearStart.setMonth(0, 1);
              results = results.filter(item => new Date(item.date) >= thisYearStart);
              break;
          }
        }
        
        // Growth filter
        if (selectedFilters.growth) {
          if (selectedFilters.growth === 'positive') {
            results = results.filter(item => item.change >= 0);
          } else if (selectedFilters.growth === 'negative') {
            results = results.filter(item => item.change < 0);
          }
        }
      }
      
      // Sort by date (most recent first)
      results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setSalesData(results);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilters, selectedFilters, allSalesData]);
  
  // Update displayed sales data based on pagination
  useEffect(() => {
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    setDisplayedSalesData(salesData.slice(startIdx, endIdx));
  }, [salesData, currentPage, pageSize]);
  
  // Handle time frame selection
  const handleTimeFrameChange = (timeFrame: string) => {
    setSelectedTimeFrame(timeFrame);
    // Apply time frame filter logic here
    toast({
      title: "Time Frame Changed",
      description: `Showing data for ${timeFrame}`
    });
  };
  
  // Handle event selection
  const handleEventChange = (event: string) => {
    setSelectedEvent(event);
    // Apply event filter logic here
    toast({
      title: "Event Filter Changed",
      description: `Showing data for ${event}`
    });
  };
  
  // Handle search
  const handleSearch = (query: string, filters: Filter[]) => {
    setSearchQuery(query);
    setActiveFilters(filters);
    setCurrentPage(1);
  };
  
  // Handle filter change
  const handleFilterChange = (newFilters: Record<string, string | string[]>) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1);
    
    // Show toast with selected filter info
    const filterNames = Object.entries(newFilters).map(([key, value]) => {
      const filterGroup = filterGroups.find(group => group.id === key);
      if (!filterGroup) return '';
      
      const option = filterGroup.options.find(opt => opt.id === value);
      return option ? option.label : '';
    }).filter(Boolean);
    
    if (filterNames.length > 0) {
      toast({
        title: "Filters Applied",
        description: `Showing data for ${filterNames.join(', ')}`
      });
    }
  };
  
  // Handle export data
  const handleExportData = (data: Record<string, any>) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        toast({
          title: "Data Exported",
          description: `Sales data exported as ${data.format.toUpperCase()} with ${data.dateRange} date range.`,
        });
        resolve();
      }, 1500);
    });
  };
  
  // Handle chart view change
  const handleChartViewChange = (view: 'daily' | 'weekly' | 'monthly') => {
    setSelectedChartView(view);
    toast({
      title: "Chart View Changed",
      description: `Showing ${view} view`
    });
  };
  
  // Handle chart type change
  const handleChartTypeChange = (type: 'area' | 'bar' | 'line') => {
    setSelectedChartType(type);
    toast({
      title: "Chart Type Changed",
      description: `Chart type changed to ${type}`
    });
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Render chart based on selected type
  const renderSalesChart = () => {
    switch (selectedChartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlySalesData}>
              <defs>
                <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOffline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D946EF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#D946EF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, undefined]} />
              <Legend />
              <Area
                type="monotone"
                dataKey="online"
                stroke="#8B5CF6"
                fillOpacity={1}
                fill="url(#colorOnline)"
                name="Online Sales"
              />
              <Area
                type="monotone"
                dataKey="offline"
                stroke="#D946EF"
                fillOpacity={1}
                fill="url(#colorOffline)"
                name="Offline Sales"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, undefined]} />
              <Legend />
              <Bar dataKey="online" name="Online Sales" fill="#8B5CF6" />
              <Bar dataKey="offline" name="Offline Sales" fill="#D946EF" />
            </RechartsBarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, undefined]} />
              <Legend />
              <Line type="monotone" dataKey="online" name="Online Sales" stroke="#8B5CF6" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="offline" name="Offline Sales" stroke="#D946EF" />
              <Line type="monotone" dataKey="total" name="Total Sales" stroke="#10B981" />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">Sales</h1>
          <p className="text-muted-foreground">Track your event sales and revenue</p>
        </motion.div>
        <div className="flex gap-2">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => setIsExportModalOpen(true)}
            >
              <Download size={16} />
              Export Report
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button className="flex items-center gap-1">
              <BarChart size={16} />
              Generate Insights
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 md:flex-row">
        <AdvancedSearch
          placeholder="Search sales by event name or ID..."
          filters={searchFilters}
          onSearch={handleSearch}
          showFilterButton={true}
          className="flex-1"
        />
        
        <div className="flex flex-wrap gap-2">
          <FilterDropdown
            groups={filterGroups}
            onFilterChange={handleFilterChange}
            triggerClassName="text-sm"
          />
          
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => {
              const timeFrames = ['Today', 'This Week', 'This Month', 'This Quarter', 'This Year'];
              const nextIndex = (timeFrames.indexOf(selectedTimeFrame) + 1) % timeFrames.length;
              handleTimeFrameChange(timeFrames[nextIndex]);
            }}
          >
            <Calendar size={16} />
            {selectedTimeFrame}
            <ChevronDown size={14} />
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => {
              const events = ['All Events', 'Summer Music Festival', 'Tech Conference 2025', 'Food & Wine Expo'];
              const nextIndex = (events.indexOf(selectedEvent) + 1) % events.length;
              handleEventChange(events[nextIndex]);
            }}
          >
            <Filter size={16} />
            {selectedEvent}
            <ChevronDown size={14} />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{formatCurrency(summaryData.totalRevenue)}</div>
              <div className="flex items-center mt-1 text-sm">
                {summaryData.revenueGrowth > 0 ? (
                  <div className="flex items-center text-green-500">
                    <TrendingUp size={16} className="mr-1" />
                    <span>{summaryData.revenueGrowth}% from last period</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <TrendingDown size={16} className="mr-1" />
                    <span>{Math.abs(summaryData.revenueGrowth)}% from last period</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tickets Sold
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{summaryData.ticketsSold.toLocaleString()}</div>
              <div className="flex items-center mt-1 text-sm">
                <div className="flex items-center text-green-500">
                  <TrendingUp size={16} className="mr-1" />
                  <span>6.2% from last period</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Ticket Price
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{formatCurrency(summaryData.averageTicketPrice)}</div>
              <div className="flex items-center mt-1 text-sm">
                <div className="flex items-center text-green-500">
                  <TrendingUp size={16} className="mr-1" />
                  <span>2.5% from last period</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">42.8%</div>
              <div className="flex items-center mt-1 text-sm">
                <div className="flex items-center text-red-500">
                  <TrendingDown size={16} className="mr-1" />
                  <span>1.3% from last period</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Analysis of your sales performance</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex rounded-md border overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={selectedChartView === 'daily' ? "bg-primary text-white" : ""}
                    onClick={() => handleChartViewChange('daily')}
                  >
                    Daily
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={selectedChartView === 'weekly' ? "bg-primary text-white" : ""}
                    onClick={() => handleChartViewChange('weekly')}
                  >
                    Weekly
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={selectedChartView === 'monthly' ? "bg-primary text-white" : ""}
                    onClick={() => handleChartViewChange('monthly')}
                  >
                    Monthly
                  </Button>
                </div>
                <div className="flex rounded-md border overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={selectedChartType === 'area' ? "bg-primary text-white" : ""}
                    onClick={() => handleChartTypeChange('area')}
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Area
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={selectedChartType === 'bar' ? "bg-primary text-white" : ""}
                    onClick={() => handleChartTypeChange('bar')}
                  >
                    <BarChart className="h-4 w-4 mr-1" />
                    Bar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={selectedChartType === 'line' ? "bg-primary text-white" : ""}
                    onClick={() => handleChartTypeChange('line')}
                  >
                    <LineChart className="h-4 w-4 mr-1" />
                    Line
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[400px]">
              {renderSalesChart()}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Charts - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Ticket Type Distribution</CardTitle>
              <CardDescription>Breakdown of sales by ticket type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={ticketTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ticketTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Tickets`, undefined]} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full flex items-center justify-center gap-1" onClick={() => {
                toast({
                  title: "Detailed Analysis",
                  description: "Opening detailed ticket type analysis report"
                });
              }}>
                <span>View Detailed Analysis</span>
                <MoveRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Event Revenue Comparison</CardTitle>
              <CardDescription>Top performing events by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={eventComparisonData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, undefined]} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#8B5CF6" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full flex items-center justify-center gap-1" onClick={() => {
                toast({
                  title: "Event Comparison",
                  description: "Opening detailed event comparison report"
                });
              }}>
                <span>View Full Comparison</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Sales Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Details of your recent ticket sales</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => {
                  toast({
                    title: "Print Report",
                    description: "Preparing report for printing"
                  });
                }}>
                  <Printer className="h-4 w-4" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => {
                  toast({
                    title: "Share Report",
                    description: "Share options opened"
                  });
                }}>
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Tickets Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Avg. Price</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`}>
                      <TableCell colSpan={6} className="h-16">
                        <div className="w-full h-full bg-gray-100 animate-pulse rounded"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : displayedSalesData.length > 0 ? (
                  displayedSalesData.map((item) => (
                    <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => {
                      toast({
                        title: "Event Details",
                        description: `Viewing details for ${item.eventName}`
                      });
                    }}>
                      <TableCell className="font-medium">{item.eventName}</TableCell>
                      <TableCell>{formatDate(item.date)}</TableCell>
                      <TableCell>{item.tickets}</TableCell>
                      <TableCell>{formatCurrency(item.revenue)}</TableCell>
                      <TableCell>{formatCurrency(item.averagePrice)}</TableCell>
                      <TableCell>
                        <div className={`flex items-center ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {item.change >= 0 ? (
                            <TrendingUp size={16} className="mr-1" />
                          ) : (
                            <TrendingDown size={16} className="mr-1" />
                          )}
                          <span>{Math.abs(item.change)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No sales data found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="p-4">
            <DataPagination
              totalItems={salesData.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={setPageSize}
              showPageSizeSelector={true}
            />
          </CardFooter>
        </Card>
      </motion.div>

      {/* Additional Card for Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      >
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold mb-2">Analyze Your Sales Performance</h3>
                <p className="text-white/80 mb-4">Get deeper insights into your sales trends and customer behavior with our advanced analytics.</p>
                <div className="flex gap-3 mt-6">
                  <Button 
                    variant="outline" 
                    className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                    onClick={() => {
                      toast({
                        title: "Sales Report",
                        description: "Generating comprehensive sales report"
                      });
                    }}
                  >
                    <IndianRupee className="h-4 w-4 mr-2" />
                    Revenue Report
                  </Button>
                  <Button 
                    variant="default" 
                    className="bg-white text-primary hover:bg-white/90"
                    onClick={() => {
                      toast({
                        title: "Advanced Analytics",
                        description: "Opening advanced analytics dashboard"
                      });
                    }}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Payment Analytics
                  </Button>
                </div>
              </div>
              <div className="hidden md:flex justify-end">
                <div className="rounded-full bg-white/10 p-6">
                  <PieChart className="h-16 w-16" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Export Data Modal */}
      <CustomModalForm
        title="Export Sales Data"
        description="Choose the format and filters for your sales data export"
        fields={exportFields}
        onSubmit={handleExportData}
        submitText="Export"
        cancelText="Cancel"
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        width="md"
      />
    </div>
  );
};

export default Sales;
