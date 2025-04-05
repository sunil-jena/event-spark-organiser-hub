/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import React, { useState, useEffect } from 'react';
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
  Download,
  Filter,
  Search,
  Eye,
  Mail,
  MoreHorizontal,
  Ticket,
  Calendar,
  FileText,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StatusBadge } from '@/components/ui/status-badge';
import { AdvancedSearch, Filter as FilterType } from '@/components/ui/advanced-search';
import { DataPagination } from '@/components/ui/data-pagination';
import { FilterDropdown, FilterGroup } from '@/components/ui/filter-dropdown';
import { OrderStatus } from '@/components/ui/order-statistics';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { CustomModalForm, FormField } from '@/components/ui/custom-modal-form';
import { motion, AnimatePresence } from 'framer-motion';

<<<<<<< HEAD
// Mock order data generator
const generateMockOrders = (count: number): Order[] => {
  const events = [
    'Summer Music Festival',
    'Tech Conference 2025',
    'Food & Wine Expo',
    'Business Summit',
    'Art Exhibition',
    'Wellness Retreat'
  ];

  const names = [
    'John Smith', 'Emma Johnson', 'Carlos Rodriguez', 'Sarah Lee',
    'Michael Brown', 'Lisa Wang', 'David Kim', 'Jennifer Miller',
    'Robert Chen', 'Amanda Taylor', 'Raj Patel', 'Priya Singh',
    'Mohammed Ali', 'Sophia Zhang', 'Aiden Lee', 'Olivia Wang'
  ];

  const ticketTypes = ['VIP', 'Standard', 'Early Bird', 'Group', 'Premium', 'Basic'];
  const statuses: OrderStatus[] = ['completed', 'pending', 'cancelled', 'refunded'];

  const orders: Order[] = [];

=======
import React, { useState, useEffect } from 'react';
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
  Download, 
  Filter, 
  Search, 
  Eye, 
  Mail, 
  MoreHorizontal, 
  Ticket,
  Calendar,
  FileText,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StatusBadge } from '@/components/ui/status-badge';
import { AdvancedSearch, Filter as FilterType } from '@/components/ui/advanced-search';
import { DataPagination } from '@/components/ui/data-pagination';
import { FilterDropdown, FilterGroup } from '@/components/ui/filter-dropdown';
import { OrderStatus } from '@/components/ui/order-statistics';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { CustomModalForm, FormField } from '@/components/ui/custom-modal-form';
import { motion, AnimatePresence } from 'framer-motion';

// Mock order data generator
const generateMockOrders = (count: number): Order[] => {
  const events = [
    'Summer Music Festival', 
    'Tech Conference 2025', 
    'Food & Wine Expo', 
    'Business Summit', 
    'Art Exhibition', 
    'Wellness Retreat'
  ];
  
  const names = [
    'John Smith', 'Emma Johnson', 'Carlos Rodriguez', 'Sarah Lee', 
    'Michael Brown', 'Lisa Wang', 'David Kim', 'Jennifer Miller', 
    'Robert Chen', 'Amanda Taylor', 'Raj Patel', 'Priya Singh',
    'Mohammed Ali', 'Sophia Zhang', 'Aiden Lee', 'Olivia Wang'
  ];
  
  const ticketTypes = ['VIP', 'Standard', 'Early Bird', 'Group', 'Premium', 'Basic'];
  const statuses: OrderStatus[] = ['completed', 'pending', 'cancelled', 'refunded'];
  
  const orders: Order[] = [];
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  for (let i = 1; i <= count; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const randomType = ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const ticketCount = Math.floor(Math.random() * 5) + 1;
    const ticketPrice = Math.floor(Math.random() * 2000) + 200;
    const totalAmount = ticketCount * ticketPrice;
    const isOffline = Math.random() > 0.7;
<<<<<<< HEAD

=======
    
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
    // Generate a random date within the last 90 days
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - Math.floor(Math.random() * 90));
<<<<<<< HEAD

=======
    
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
    const order: Order = {
      id: (1000 + i).toString(),
      eventName: randomEvent,
      customer: randomName,
      email: randomName.toLowerCase().replace(' ', '.') + '@example.com',
<<<<<<< HEAD
      date: pastDate.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
=======
      date: pastDate.toLocaleString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      amount: totalAmount,
      ticketType: randomType,
      tickets: ticketCount,
      status: randomStatus,
      isOffline: isOffline
    };
<<<<<<< HEAD

    orders.push(order);
  }

=======
    
    orders.push(order);
  }
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  return orders;
};

// Order interface
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

const Orders = () => {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
<<<<<<< HEAD

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

=======
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  // Data state
  const [allOrders] = useState<Order[]>(generateMockOrders(150));
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
<<<<<<< HEAD

=======
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string | string[]>>({});
<<<<<<< HEAD

  // Data loading and animation state
  const [isLoading, setIsLoading] = useState(false);

=======
  
  // Data loading and animation state
  const [isLoading, setIsLoading] = useState(false);
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  // Filter configuration
  const searchFilters = [
    {
      id: 'status',
      name: 'Status',
      type: 'status' as const,
    },
    {
      id: 'eventName',
      name: 'Event',
      type: 'select' as const,
      options: Array.from(new Set(allOrders.map(order => order.eventName))).map(event => ({
        value: event,
        label: event
      }))
    },
    {
      id: 'ticketType',
      name: 'Ticket Type',
      type: 'multiselect' as const,
      options: Array.from(new Set(allOrders.map(order => order.ticketType))).map(type => ({
        value: type,
        label: type
      }))
    },
    {
      id: 'isOffline',
      name: 'Source',
      type: 'select' as const,
      options: [
        { value: 'true', label: 'Offline' },
        { value: 'false', label: 'Online' }
      ]
    }
  ];
<<<<<<< HEAD

=======
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  const statusOptions = [
    { value: 'completed', label: 'Completed', color: 'bg-green-100' },
    { value: 'pending', label: 'Pending', color: 'bg-amber-100' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100' },
    { value: 'refunded', label: 'Refunded', color: 'bg-blue-100' }
  ];
<<<<<<< HEAD

=======
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  const filterGroups: FilterGroup[] = [
    {
      id: 'status',
      label: 'Status',
      options: [
        { id: 'completed', label: 'Completed', colorClass: 'bg-green-500' },
        { id: 'pending', label: 'Pending', colorClass: 'bg-amber-500' },
        { id: 'cancelled', label: 'Cancelled', colorClass: 'bg-red-500' },
        { id: 'refunded', label: 'Refunded', colorClass: 'bg-blue-500' }
      ]
    },
    {
      id: 'source',
      label: 'Source',
      options: [
        { id: 'online', label: 'Online' },
        { id: 'offline', label: 'Offline' }
      ]
    },
    {
      id: 'period',
      label: 'Time Period',
      options: [
        { id: 'today', label: 'Today' },
        { id: 'yesterday', label: 'Yesterday' },
        { id: 'last7days', label: 'Last 7 Days' },
        { id: 'last30days', label: 'Last 30 Days' },
        { id: 'last90days', label: 'Last 90 Days' }
      ]
    }
  ];
<<<<<<< HEAD

=======
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  // Fields for add note form
  const addNoteFields: FormField[] = [
    {
      id: 'note',
      label: 'Note',
      type: 'textarea',
      placeholder: 'Enter your note about this order...',
      required: true
    },
    {
      id: 'noteType',
      label: 'Note Type',
      type: 'select',
      placeholder: 'Select note type',
      required: true,
      options: [
        { value: 'info', label: 'Information' },
        { value: 'issue', label: 'Issue' },
        { value: 'followup', label: 'Follow-up' }
      ]
    },
    {
      id: 'isImportant',
      label: 'Mark as Important',
      type: 'switch',
      helperText: 'This will highlight the note for all team members'
    }
  ];
<<<<<<< HEAD

=======
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  // Fields for export form
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
        { value: 'last7days', label: 'Last 7 Days' },
        { value: 'last30days', label: 'Last 30 Days' },
        { value: 'custom', label: 'Custom Range' }
      ],
      defaultValue: 'last30days'
    },
    {
      id: 'includeCustomerData',
      label: 'Include Customer Data',
      type: 'switch',
      defaultValue: true
    },
    {
      id: 'includePaymentDetails',
      label: 'Include Payment Details',
      type: 'switch',
      defaultValue: true
    }
  ];
<<<<<<< HEAD

  // Effect to apply filtering
  useEffect(() => {
    setIsLoading(true);

    // Simulate a network delay
    const timer = setTimeout(() => {
      let results = [...allOrders];

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(order =>
=======
  
  // Effect to apply filtering
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate a network delay
    const timer = setTimeout(() => {
      let results = [...allOrders];
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(order => 
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
          order.customer.toLowerCase().includes(query) ||
          order.id.includes(query) ||
          order.email.toLowerCase().includes(query) ||
          order.eventName.toLowerCase().includes(query)
        );
      }
<<<<<<< HEAD

=======
      
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
      // Apply advanced search filters
      if (activeFilters.length > 0) {
        activeFilters.forEach(filter => {
          if (filter.field === 'status' && filter.value) {
            results = results.filter(order => order.status === filter.value);
          }
<<<<<<< HEAD

          if (filter.field === 'eventName' && filter.value) {
            results = results.filter(order => order.eventName === filter.value);
          }

          if (filter.field === 'ticketType' && Array.isArray(filter.value) && filter.value.length > 0) {
            results = results.filter((order: any) => filter?.value?.includes(order.ticketType));
          }

=======
          
          if (filter.field === 'eventName' && filter.value) {
            results = results.filter(order => order.eventName === filter.value);
          }
          
          if (filter.field === 'ticketType' && Array.isArray(filter.value) && filter.value.length > 0) {
            results = results.filter(order => filter.value.includes(order.ticketType));
          }
          
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
          if (filter.field === 'isOffline' && filter.value) {
            const isOffline = filter.value === 'true';
            results = results.filter(order => order.isOffline === isOffline);
          }
        });
      }
<<<<<<< HEAD

=======
      
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
      // Apply dropdown filters
      if (Object.keys(selectedFilters).length > 0) {
        // Status filter
        if (selectedFilters.status) {
          results = results.filter(order => order.status === selectedFilters.status);
        }
<<<<<<< HEAD

=======
        
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
        // Source filter
        if (selectedFilters.source) {
          if (selectedFilters.source === 'online') {
            results = results.filter(order => !order.isOffline);
          } else if (selectedFilters.source === 'offline') {
            results = results.filter(order => order.isOffline);
          }
        }
<<<<<<< HEAD

=======
        
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
        // Time period filter
        if (selectedFilters.period) {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
<<<<<<< HEAD

=======
          
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
          switch (selectedFilters.period) {
            case 'today':
              results = results.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= today;
              });
              break;
            case 'yesterday':
              const yesterday = new Date(today);
              yesterday.setDate(yesterday.getDate() - 1);
              results = results.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= yesterday && orderDate < today;
              });
              break;
            case 'last7days':
              const last7Days = new Date(today);
              last7Days.setDate(last7Days.getDate() - 7);
              results = results.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= last7Days;
              });
              break;
            case 'last30days':
              const last30Days = new Date(today);
              last30Days.setDate(last30Days.getDate() - 30);
              results = results.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= last30Days;
              });
              break;
            case 'last90days':
              const last90Days = new Date(today);
              last90Days.setDate(last90Days.getDate() - 90);
              results = results.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= last90Days;
              });
              break;
          }
        }
      }
<<<<<<< HEAD

      setFilteredOrders(results);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, activeFilters, selectedFilters, allOrders]);

=======
      
      setFilteredOrders(results);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilters, selectedFilters, allOrders]);
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  // Effect to update displayed orders based on pagination
  useEffect(() => {
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    setDisplayedOrders(filteredOrders.slice(startIdx, endIdx));
  }, [filteredOrders, currentPage, pageSize]);
<<<<<<< HEAD

=======
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
<<<<<<< HEAD

=======
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  // Handle search
  const handleSearch = (query: string, filters: FilterType[]) => {
    setSearchQuery(query);
    setActiveFilters(filters);
    setCurrentPage(1);
  };
<<<<<<< HEAD

=======
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  // Handle filter change
  const handleFilterChange = (newFilters: Record<string, string | string[]>) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1);
  };
<<<<<<< HEAD

=======
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  // Handle view order 
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };
<<<<<<< HEAD

=======
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  // Handle add note
  const handleAddNote = (order: Order) => {
    setSelectedOrder(order);
    setIsAddNoteModalOpen(true);
  };
<<<<<<< HEAD

=======
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  // Handle resend confirmation
  const handleResendConfirmation = (order: Order) => {
    toast({
      title: "Confirmation Resent",
      description: `Confirmation email sent to ${order.email}`,
    });
  };
<<<<<<< HEAD

=======
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  // Handle export orders
  const handleExportOrders = (data: Record<string, any>) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        toast({
          title: "Orders Exported",
          description: `Orders exported as ${data.format.toUpperCase()} file with ${data.dateRange} date range.`,
        });
        resolve();
      }, 1500);
    });
  };
<<<<<<< HEAD

=======
  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
  // Handle add note form submission
  const handleAddNoteSubmit = (data: Record<string, any>) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        toast({
          title: "Note Added",
          description: `Note added to order #${selectedOrder?.id}`,
        });
        resolve();
      }, 1000);
    });
  };
<<<<<<< HEAD

  const statusBadge = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { status: any, label: string }> = {
=======
  
  const statusBadge = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { status: Status, label: string }> = {
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
      completed: { status: 'success', label: 'Completed' },
      pending: { status: 'pending', label: 'Pending' },
      cancelled: { status: 'error', label: 'Cancelled' },
      refunded: { status: 'warning', label: 'Refunded' }
    };
<<<<<<< HEAD

    return (
      <StatusBadge
=======
    
    return (
      <StatusBadge 
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
        status={statusMap[status].status}
        label={statusMap[status].label}
      />
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage all your ticket orders</p>
        </motion.div>
<<<<<<< HEAD

=======
        
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
        <div className="flex flex-wrap gap-2">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
<<<<<<< HEAD
            <Button
              variant="outline"
=======
            <Button 
              variant="outline" 
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
              className="flex items-center gap-2"
              onClick={() => setIsExportModalOpen(true)}
            >
              <Download className="h-4 w-4" />
              <span>Export Orders</span>
            </Button>
          </motion.div>
<<<<<<< HEAD

=======
          
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Manual Order</span>
            </Button>
          </motion.div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Order Management</CardTitle>
          <CardDescription>View and manage all your ticket orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <AdvancedSearch
                placeholder="Search by order ID, customer name, or email..."
                filters={searchFilters}
                onSearch={handleSearch}
                statusOptions={statusOptions}
                showFilterButton={true}
              />
<<<<<<< HEAD

=======
              
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
              <div className="flex flex-wrap gap-2">
                <FilterDropdown
                  groups={filterGroups}
                  onFilterChange={handleFilterChange}
                  triggerClassName="text-sm"
                />
<<<<<<< HEAD

                <Button
                  variant="outline"
=======
                
                <Button 
                  variant="outline" 
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
                  size="sm"
                  className="flex items-center gap-2 text-sm"
                  onClick={() => {
                    toast({
                      title: "Today's Orders",
                      description: "Showing orders placed today"
                    });
                    handleFilterChange({ period: 'today' });
                  }}
                >
                  <Calendar className="h-4 w-4" />
                  Today
                </Button>
<<<<<<< HEAD

                <Button
                  variant="outline"
=======
                
                <Button 
                  variant="outline" 
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
                  size="sm"
                  className="flex items-center gap-2 text-sm"
                  onClick={() => {
                    toast({
                      title: "Pending Orders",
                      description: "Showing pending orders"
                    });
                    handleFilterChange({ status: 'pending' });
                  }}
                >
                  <Badge className="h-2 w-2 rounded-full bg-amber-500" />
                  Pending
                </Button>
<<<<<<< HEAD

                <Button
                  variant="outline"
=======
                
                <Button 
                  variant="outline" 
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
                  size="sm"
                  className="flex items-center gap-2 text-sm"
                  onClick={() => {
                    toast({
                      title: "All Orders",
                      description: "Showing all orders"
                    });
                    handleFilterChange({});
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
<<<<<<< HEAD

=======
            
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
            <div className="rounded-md border overflow-hidden">
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
                  {isLoading ? (
                    Array(5).fill(0).map((_, idx) => (
                      <TableRow key={`skeleton-${idx}`}>
                        <TableCell colSpan={10} className="h-16">
                          <div className="w-full h-full bg-gray-100 animate-pulse rounded"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : displayedOrders.length > 0 ? (
                    displayedOrders.map((order) => (
                      <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
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
                        <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                        <TableCell>{statusBadge(order.status)}</TableCell>
                        <TableCell>
                          <Badge variant={order.isOffline ? "outline" : "default"} className="text-xs">
                            {order.isOffline ? 'Offline' : 'Online'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
<<<<<<< HEAD
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
=======
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0" 
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewOrder(order);
                              }}
                            >
                              <span className="sr-only">View order</span>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {order.status !== 'cancelled' && order.status !== 'refunded' && (
<<<<<<< HEAD
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
=======
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0" 
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResendConfirmation(order);
                                }}
                              >
                                <span className="sr-only">Resend confirmation</span>
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
<<<<<<< HEAD
                            <Button
                              size="sm"
                              variant="ghost"
=======
                            <Button 
                              size="sm" 
                              variant="ghost" 
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddNote(order);
                              }}
                            >
                              <span className="sr-only">Add note</span>
                              <FileText className="h-4 w-4" />
                            </Button>
<<<<<<< HEAD
                            <Button
                              size="sm"
                              variant="ghost"
=======
                            <Button 
                              size="sm" 
                              variant="ghost" 
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast({
                                  title: "More Options",
                                  description: `Showing options for order #${order.id}`,
                                });
                              }}
                            >
                              <span className="sr-only">More options</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
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
<<<<<<< HEAD

=======
            
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
            <DataPagination
              totalItems={filteredOrders.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={setPageSize}
              showPageSizeSelector={true}
            />
          </div>
        </CardContent>
      </Card>
<<<<<<< HEAD

=======
      
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
      {/* Order Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details #{selectedOrder.id}</DialogTitle>
                <DialogDescription>
                  Complete information about this order
                </DialogDescription>
              </DialogHeader>
<<<<<<< HEAD

=======
              
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{selectedOrder.customer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span>{selectedOrder.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Order Date:</span>
                            <span>{selectedOrder.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Source:</span>
                            <Badge variant={selectedOrder.isOffline ? "outline" : "default"}>
                              {selectedOrder.isOffline ? 'Offline' : 'Online'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
<<<<<<< HEAD

=======
                  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Order Status</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Current Status:</span>
                            {statusBadge(selectedOrder.status)}
                          </div>
<<<<<<< HEAD

=======
                          
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
                          <div>
                            <h4 className="font-medium text-sm mb-2">Update Status</h4>
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                variant={selectedOrder.status === 'completed' ? 'default' : 'outline'}
                                className="text-xs h-8"
                                onClick={() => {
                                  toast({
                                    title: "Status Updated",
                                    description: `Order #${selectedOrder.id} status changed to Completed`,
                                  });
                                }}
                              >
                                Completed
                              </Button>
                              <Button
                                size="sm"
                                variant={selectedOrder.status === 'pending' ? 'default' : 'outline'}
                                className="text-xs h-8"
                                onClick={() => {
                                  toast({
                                    title: "Status Updated",
                                    description: `Order #${selectedOrder.id} status changed to Pending`,
                                  });
                                }}
                              >
                                Pending
                              </Button>
                              <Button
                                size="sm"
                                variant={selectedOrder.status === 'cancelled' ? 'default' : 'outline'}
                                className="text-xs h-8"
                                onClick={() => {
                                  toast({
                                    title: "Status Updated",
                                    description: `Order #${selectedOrder.id} status changed to Cancelled`,
                                  });
                                }}
                              >
                                Cancelled
                              </Button>
                              <Button
                                size="sm"
                                variant={selectedOrder.status === 'refunded' ? 'default' : 'outline'}
                                className="text-xs h-8"
                                onClick={() => {
                                  toast({
                                    title: "Status Updated",
                                    description: `Order #${selectedOrder.id} status changed to Refunded`,
                                  });
                                }}
                              >
                                Refunded
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
<<<<<<< HEAD

=======
                
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Event & Ticket Details</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Event:</span>
                            <span className="font-medium">{selectedOrder.eventName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ticket Type:</span>
                            <span>{selectedOrder.ticketType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Quantity:</span>
                            <span>{selectedOrder.tickets}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price per Ticket:</span>
                            <span>₹{(selectedOrder.amount / selectedOrder.tickets).toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
<<<<<<< HEAD

=======
                  
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span>₹{selectedOrder.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax (18%):</span>
                            <span>₹{(selectedOrder.amount * 0.18).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Total Amount:</span>
                            <span>₹{(selectedOrder.amount * 1.18).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment Method:</span>
                            <span>{selectedOrder.isOffline ? 'Cash/POS' : 'Credit Card'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
<<<<<<< HEAD

              <div className="flex justify-end gap-2 mt-4">
                <Button
=======
              
              <div className="flex justify-end gap-2 mt-4">
                <Button 
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    toast({
                      title: "Invoice Downloaded",
                      description: `Invoice for order #${selectedOrder.id} downloaded successfully`,
                    });
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download Invoice
                </Button>
                <Button
                  className="flex items-center gap-2"
                  onClick={() => {
                    toast({
                      title: "Email Sent",
                      description: `Confirmation email sent to ${selectedOrder.email}`,
                    });
                  }}
                >
                  <Mail className="h-4 w-4" />
                  Resend Email
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
<<<<<<< HEAD

=======
      
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
      {/* Add Note Modal */}
      <CustomModalForm
        title={`Add Note to Order #${selectedOrder?.id}`}
        description="Add a note to track important information about this order"
        fields={addNoteFields}
        onSubmit={handleAddNoteSubmit}
        submitText="Add Note"
        cancelText="Cancel"
<<<<<<< HEAD
        onOpenChange={setIsAddNoteModalOpen}
        width="md"
      />

=======
        open={isAddNoteModalOpen}
        onOpenChange={setIsAddNoteModalOpen}
        width="md"
      />
      
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
      {/* Export Orders Modal */}
      <CustomModalForm
        title="Export Orders"
        description="Choose the format and filters for your order export"
        fields={exportFields}
        onSubmit={handleExportOrders}
        submitText="Export"
        cancelText="Cancel"
<<<<<<< HEAD
=======
        open={isExportModalOpen}
>>>>>>> f42c2775e203697e0f88cdebef06d31b3fb7cb98
        onOpenChange={setIsExportModalOpen}
        width="md"
      />
    </div>
  );
};

export default Orders;
