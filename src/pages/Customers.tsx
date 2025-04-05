import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Plus, 
  Mail, 
  MoreHorizontal, 
  Filter, 
  Download,
  UserPlus,
  Upload,
  Tag,
  MessageSquare,
  Phone,
  ExternalLink,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  X,
  Calendar
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { DataPagination } from '@/components/ui/data-pagination';
import { AdvancedSearch, Filter as SearchFilter } from '@/components/ui/advanced-search';
import { FilterDropdown, FilterGroup } from '@/components/ui/filter-dropdown';
import { useToast } from '@/hooks/use-toast';
import { CustomModalForm, FormField } from '@/components/ui/custom-modal-form';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
  'Patna', 'Surat', 'Agra', 'Coimbatore'
];

const generateCustomersData = (count: number): Customer[] => {
  // ... (rest of the code remains unchanged)
};

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  totalSpent: number;
  lastPurchase: string;
  avatar?: string;
  tags: string[];
  status: 'active' | 'inactive' | 'new';
}

interface Tag {
  id: string;
  label: string;
  colorClass: string;
}

const Customers = () => {
  const { toast } = useToast();
  const allCustomers = generateCustomersData(150);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [displayedCustomers, setDisplayedCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string | string[]>>({});
  
  const [tags] = useState<Tag[]>([
    { id: 'vip', label: 'VIP', colorClass: 'bg-purple-500' },
    { id: 'regular', label: 'Regular', colorClass: 'bg-blue-500' },
    { id: 'new', label: 'New', colorClass: 'bg-green-500' },
    { id: 'promoter', label: 'Promoter', colorClass: 'bg-orange-500' },
    { id: 'corporate', label: 'Corporate', colorClass: 'bg-indigo-500' },
    { id: 'student', label: 'Student', colorClass: 'bg-pink-500' },
    { id: 'senior', label: 'Senior', colorClass: 'bg-amber-500' }
  ]);
  
  const searchFilters = [
    {
      id: 'status',
      name: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'new', label: 'New' }
      ]
    },
    {
      id: 'city',
      name: 'City',
      type: 'select' as const,
      options: Array.from(new Set(allCustomers.map(customer => customer.city))).map(city => ({
        value: city,
        label: city
      }))
    },
    {
      id: 'tags',
      name: 'Tags',
      type: 'multiselect' as const,
      options: tags.map(tag => ({
        value: tag.id,
        label: tag.label
      }))
    },
    {
      id: 'orderValue',
      name: 'Order Value',
      type: 'select' as const,
      options: [
        { value: 'low', label: 'Less than ₹10,000' },
        { value: 'medium', label: '₹10,000 - ₹50,000' },
        { value: 'high', label: 'More than ₹50,000' }
      ]
    }
  ];
  
  const filterGroups: FilterGroup[] = [
    {
      id: 'status',
      label: 'Status',
      options: [
        { id: 'active', label: 'Active', colorClass: 'bg-green-500' },
        { id: 'inactive', label: 'Inactive', colorClass: 'bg-gray-500' },
        { id: 'new', label: 'New', colorClass: 'bg-blue-500' }
      ]
    },
    {
      id: 'orderCount',
      label: 'Orders',
      options: [
        { id: 'noOrders', label: 'No Orders' },
        { id: 'fewOrders', label: '1-5 Orders' },
        { id: 'manyOrders', label: '6+ Orders' }
      ]
    },
    {
      id: 'lastPurchase',
      label: 'Last Purchase',
      options: [
        { id: 'recent', label: 'Last 30 Days' },
        { id: 'month', label: '1-3 Months Ago' },
        { id: 'older', label: 'Older than 3 Months' }
      ]
    }
  ];
  
  const addCustomerFields: FormField[] = [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter full name',
      required: true,
      width: 'full'
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
      width: 'half'
    },
    {
      id: 'phone',
      label: 'Phone Number',
      type: 'text',
      placeholder: 'Enter phone number',
      required: true,
      width: 'half'
    },
    {
      id: 'city',
      label: 'City',
      type: 'text',
      placeholder: 'Enter city',
      width: 'half'
    },
    {
      id: 'status',
      label: 'Customer Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'new', label: 'New' }
      ],
      defaultValue: 'new',
      width: 'half'
    },
    {
      id: 'notes',
      label: 'Additional Notes',
      type: 'textarea',
      placeholder: 'Enter any additional notes about this customer',
      width: 'full'
    },
    {
      id: 'sendWelcomeEmail',
      label: 'Send Welcome Email',
      type: 'switch',
      defaultValue: true
    }
  ];
  
  const importCustomersFields: FormField[] = [
    {
      id: 'file',
      label: 'Import File',
      type: 'file',
      required: true,
      accept: '.csv, .xlsx, .xls',
      helperText: 'Accepted file formats: CSV, Excel (XLSX, XLS)'
    },
    {
      id: 'columnMapping',
      label: 'Column Mapping',
      type: 'select',
      options: [
        { value: 'auto', label: 'Auto-detect Columns' },
        { value: 'manual', label: 'Manual Mapping' }
      ],
      defaultValue: 'auto'
    },
    {
      id: 'sendWelcomeEmail',
      label: 'Send Welcome Email to New Customers',
      type: 'switch',
      defaultValue: false,
      helperText: 'Send a welcome email to newly imported customers'
    },
    {
      id: 'skipDuplicates',
      label: 'Skip Duplicate Entries',
      type: 'switch',
      defaultValue: true,
      helperText: 'Skip customers with duplicate email addresses'
    }
  ];
  
  const exportCustomersFields: FormField[] = [
    {
      id: 'format',
      label: 'Export Format',
      type: 'select',
      options: [
        { value: 'csv', label: 'CSV' },
        { value: 'excel', label: 'Excel (XLSX)' },
        { value: 'pdf', label: 'PDF' }
      ],
      defaultValue: 'csv',
      required: true
    },
    {
      id: 'includeFields',
      label: 'Fields to Include',
      type: 'select',
      options: [
        { value: 'all', label: 'All Fields' },
        { value: 'basic', label: 'Basic Info (Name, Email, Phone)' },
        { value: 'orders', label: 'Order Information' },
        { value: 'custom', label: 'Custom Selection' }
      ],
      defaultValue: 'all'
    },
    {
      id: 'applyFilters',
      label: 'Apply Current Filters',
      type: 'switch',
      defaultValue: true,
      helperText: 'Export only the currently filtered customers'
    }
  ];
  
  const addTagFields: FormField[] = [
    {
      id: 'tagName',
      label: 'Tag Name',
      type: 'text',
      placeholder: 'Enter tag name',
      required: true
    },
    {
      id: 'tagColor',
      label: 'Tag Color',
      type: 'select',
      options: [
        { value: 'purple', label: 'Purple' },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
        { value: 'orange', label: 'Orange' },
        { value: 'red', label: 'Red' },
        { value: 'pink', label: 'Pink' },
        { value: 'amber', label: 'Amber' }
      ],
      defaultValue: 'purple'
    },
    {
      id: 'applyToSelected',
      label: 'Apply to Selected Customer',
      type: 'switch',
      defaultValue: true,
      helperText: 'Apply this tag to the currently selected customer'
    }
  ];
  
  const contactCustomerFields: FormField[] = [
    {
      id: 'contactMethod',
      label: 'Contact Method',
      type: 'select',
      options: [
        { value: 'email', label: 'Email' },
        { value: 'sms', label: 'SMS' }
      ],
      defaultValue: 'email',
      required: true
    },
    {
      id: 'subject',
      label: 'Subject',
      type: 'text',
      placeholder: 'Enter message subject',
      required: true
    },
    {
      id: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Enter your message',
      required: true
    },
    {
      id: 'includePromoCode',
      label: 'Include Promo Code',
      type: 'switch',
      defaultValue: false
    },
    {
      id: 'trackEngagement',
      label: 'Track Engagement',
      type: 'switch',
      defaultValue: true,
      helperText: 'Track opens, clicks, and other engagement metrics'
    }
  ];
  
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };
  
  const getTagColorClass = (tagName: string) => {
    const tag = tags.find(t => t.label.toLowerCase() === tagName.toLowerCase());
    return tag ? tag.colorClass : 'bg-gray-500';
  };
  
  const getStatusBadge = (status: 'active' | 'inactive' | 'new') => {
    switch (status) {
      case 'active':
        return <StatusBadge status="success" label="Active" />;
      case 'inactive':
        return <StatusBadge status="error" label="Inactive" />;
      case 'new':
        return <StatusBadge status="info" label="New" />;
    }
  };
  
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      let results = [...allCustomers];
      
      const searchQuery = searchTerm.toLowerCase();
      
      if (typeof searchQuery === 'string') {
        results = results.filter(customer => 
          customer.name.toLowerCase().includes(searchQuery) ||
          customer.email.toLowerCase().includes(searchQuery) ||
          customer.phone.toLowerCase().includes(searchQuery) ||
          customer.city.toLowerCase().includes(searchQuery)
        );
      }
      
      if (activeFilters.length > 0) {
        activeFilters.forEach(filter => {
          if (filter.field === 'status' && filter.value) {
            results = results.filter(customer => customer.status === filter.value);
          }
          
          if (filter.field === 'city' && filter.value) {
            results = results.filter(customer => customer.city === filter.value);
          }
          
          if (filter.field === 'tags' && Array.isArray(filter.value) && filter.value.length > 0) {
            results = results.filter(customer => 
              customer.tags.some(tag => 
                filter.value.includes(tag.toLowerCase())
              )
            );
          }
          
          if (filter.field === 'orderValue' && filter.value) {
            switch (filter.value) {
              case 'low':
                results = results.filter(customer => customer.totalSpent < 10000);
                break;
              case 'medium':
                results = results.filter(customer => customer.totalSpent >= 10000 && customer.totalSpent <= 50000);
                break;
              case 'high':
                results = results.filter(customer => customer.totalSpent > 50000);
                break;
            }
          }
        });
      }
      
      if (Object.keys(selectedFilters).length > 0) {
        results = results.filter(customer => {
          if (selectedFilters.status) {
            return customer.status === selectedFilters.status;
          }
          
          if (selectedFilters.orderCount) {
            switch (selectedFilters.orderCount) {
              case 'noOrders':
                return customer.orders === 0;
                break;
              case 'fewOrders':
                return customer.orders >= 1 && customer.orders <= 5;
                break;
              case 'manyOrders':
                return customer.orders > 5;
                break;
            }
          }
          
          if (selectedFilters.lastPurchase) {
            const today = new Date();
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const threeMonthsAgo = new Date(today);
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            
            switch (selectedFilters.lastPurchase) {
              case 'recent':
                return customer.lastPurchase >= thirtyDaysAgo;
                break;
              case 'month':
                return customer.lastPurchase < thirtyDaysAgo && customer.lastPurchase >= threeMonthsAgo;
                break;
              case 'older':
                return customer.lastPurchase < threeMonthsAgo;
                break;
            }
          }
        });
      }
      
      results.sort((a, b) => b.totalSpent - a.totalSpent);
      
      setCustomers(results);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, activeFilters, selectedFilters, allCustomers]);
  
  useEffect(() => {
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    setDisplayedCustomers(customers.slice(startIdx, endIdx));
  }, [customers, currentPage, pageSize]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSearch = (query: string, filters: SearchFilter[]) => {
    setSearchTerm(query);
    setActiveFilters(filters);
    setCurrentPage(1);
  };
  
  const handleFilterChange = (newFilters: Record<string, string | string[]>) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1);
    
    if (Object.keys(newFilters).length > 0) {
      const filterDescriptions = Object.entries(newFilters).map(([key, value]) => {
        const group = filterGroups.find(g => g.id === key);
        if (!group) return '';
        
        const option = group.options.find(o => o.id === value);
        return option ? `${group.label}: ${option.label}` : '';
      }).filter(Boolean);
      
      if (filterDescriptions.length > 0) {
        toast({
          title: "Filters Applied",
          description: filterDescriptions.join(', ')
        });
      }
    }
  };
  
  const openCustomerDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
    setActiveTab('overview');
  };
  
  const handleDeleteCustomer = (customer: Customer | null) => {
    if (!customer) return;
    
    setIsDeleteModalOpen(false);
    
    setTimeout(() => {
      toast({
        title: "Customer Deleted",
        description: `${customer.name} has been deleted successfully.`,
      });
      
      setIsModalOpen(false);
    }, 500);
  };
  
  const handleAddCustomer = (data: Record<string, any>) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        toast({
          title: "Customer Added",
          description: `${data.name} has been added successfully.`,
        });
        
        if (data.sendWelcomeEmail) {
          toast({
            title: "Welcome Email Sent",
            description: `A welcome email has been sent to ${data.email}.`,
          });
        }
        
        resolve();
      }, 1000);
    });
  };
  
  const handleImportCustomers = (data: Record<string, any>) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        toast({
          title: "Customers Imported",
          description: "Customer data has been imported successfully.",
        });
        
        resolve();
      }, 1500);
    });
  };
  
  const handleExportCustomers = (data: Record<string, any>) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        toast({
          title: "Customers Exported",
          description: `Customer data has been exported as ${data.format.toUpperCase()}.`,
        });
        
        resolve();
      }, 1000);
    });
  };
  
  const handleAddTag = (data: Record<string, any>) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        toast({
          title: "Tag Created",
          description: `The tag "${data.tagName}" has been created.`,
        });
        
        if (data.applyToSelected && selectedCustomer) {
          toast({
            title: "Tag Applied",
            description: `The tag has been applied to ${selectedCustomer.name}.`,
          });
        }
        
        resolve();
      }, 800);
    });
  };
  
  const handleContactCustomer = (data: Record<string, any>) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        if (!selectedCustomer) {
          resolve();
          return;
        }
        
        const contactMethod = data.contactMethod === 'email' ? 'Email' : 'SMS';
        
        toast({
          title: `${contactMethod} Sent`,
          description: `Your message has been sent to ${selectedCustomer.name}.`,
        });
        
        if (data.includePromoCode) {
          toast({
            title: "Promo Code Included",
            description: "A promotion code was included in the message.",
          });
        }
        
        resolve();
      }, 1200);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage and view your customer details</p>
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
              Export
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Upload size={16} />
              Import
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button 
              className="flex items-center gap-1"
              onClick={() => setIsAddCustomerModalOpen(true)}
            >
              <UserPlus size={16} />
              Add Customer
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <AdvancedSearch
            placeholder="Search customers by name, email, phone or city..."
            filters={searchFilters}
            onSearch={handleSearch}
            showFilterButton={true}
          />
          
          <div className="flex flex-wrap gap-2">
            <FilterDropdown
              groups={filterGroups}
              onFilterChange={handleFilterChange}
              triggerClassName="text-sm"
            />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 text-sm"
              onClick={() => handleFilterChange({ status: 'active' })}
            >
              <Badge className="h-2 w-2 rounded-full bg-green-500" />
              Active
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 text-sm"
              onClick={() => handleFilterChange({ status: 'new' })}
            >
              <Badge className="h-2 w-2 rounded-full bg-blue-500" />
              New
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 text-sm"
              onClick={() => {
                handleFilterChange({ lastPurchase: 'recent' });
              }}
            >
              Recent Customers
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="text-sm"
              onClick={() => {
                setSelectedFilters({});
                setActiveFilters([]);
                setSearchTerm('');
                toast({
                  title: "Filters Cleared",
                  description: "Showing all customers"
                });
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Purchase</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`}>
                      <TableCell colSpan={9} className="h-16">
                        <div className="w-full h-full bg-gray-100 animate-pulse rounded"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : displayedCustomers.length > 0 ? (
                  displayedCustomers.map((customer) => (
                    <TableRow 
                      key={customer.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => openCustomerDetail(customer)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {customer.avatar ? (
                              <AvatarImage src={customer.avatar} />
                            ) : (
                              <AvatarFallback>
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">ID: #{customer.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{customer.email}</p>
                          <p className="text-xs text-muted-foreground">{customer.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{customer.city}</TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                      <TableCell>{formatDate(customer.lastPurchase)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {customer.tags.length > 0 ? (
                            customer.tags.map((tag, idx) => (
                              <Badge
                                key={idx}
                                className={`text-white ${getTagColorClass(tag)}`}
                              >
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No tags</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomer(customer);
                              setIsContactModalOpen(true);
                            }}
                          >
                            <span className="sr-only">Contact</span>
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomer(customer);
                              setIsAddTagModalOpen(true);
                            }}
                          >
                            <span className="sr-only">Add tag</span>
                            <Tag className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="sr-only">More options</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openCustomerDetail(customer);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCustomer(customer);
                                  setIsContactModalOpen(true);
                                }}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Contact
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast({
                                    title: "Edit Customer",
                                    description: `Editing ${customer.name}`,
                                  });
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCustomer(customer);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                      No customers found. Try adjusting your filters or create a new customer.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="border-t p-4">
            <DataPagination
              totalItems={customers.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={setPageSize}
              showPageSizeSelector={true}
            />
          </CardFooter>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0">
          {selectedCustomer && (
            <div className="flex flex-col h-full">
              <DialogHeader className="p-6 pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      {selectedCustomer.avatar ? (
                        <AvatarImage src={selectedCustomer.avatar} />
                      ) : (
                        <AvatarFallback className="text-xl">
                          {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <DialogTitle className="text-xl">
                        {selectedCustomer.name}
                        <div className="inline-flex ml-2">
                          {getStatusBadge(selectedCustomer.status)}
                        </div>
                      </DialogTitle>
                      <DialogDescription className="flex items-center mt-1">
                        <span>Customer ID: #{selectedCustomer.id}</span>
                        <span className="mx-2">•</span>
                        <span>{selectedCustomer.city}</span>
                      </DialogDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        setIsContactModalOpen(true);
                      }}
                    >
                      <Mail className="h-4 w-4" />
                      Contact
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          toast({
                            title: "Edit Customer",
                            description: `Editing ${selectedCustomer.name}`,
                          });
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsAddTagModalOpen(true)}>
                          <Tag className="h-4 w-4 mr-2" />
                          Add Tag
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => setIsDeleteModalOpen(true)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </DialogHeader>
              
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <div className="px-6">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
                    <TabsTrigger value="orders" className="text-sm">Orders</TabsTrigger>
                    <TabsTrigger value="activity" className="text-sm">Activity</TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex-1 overflow-auto">
                  <TabsContent value="overview" className="p-6 pt-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Contact Information</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-[120px_1fr] gap-2">
                                <span className="text-muted-foreground">Email:</span>
                                <span>{selectedCustomer.email}</span>
                                <span className="text-muted-foreground">Phone:</span>
                                <span>{selectedCustomer.phone}</span>
                                <span className="text-muted-foreground">City:</span>
                                <span>{selectedCustomer.city}</span>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => {
                                  setIsContactModalOpen(true);
                                }}>
                                  <Mail className="h-3.5 w-3.5" />
                                  Send Email
                                </Button>
                                <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => {
                                  toast({
                                    title: "SMS Sent",
                                    description: `SMS sent to ${selectedCustomer.phone}`,
                                  });
                                }}>
                                  <Phone className="h-3.5 w-3.5" />
                                  Send SMS
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between items-center text-base">
                              <span>Tags</span>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 px-2"
                                onClick={() => setIsAddTagModalOpen(true)}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Add Tag
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {selectedCustomer.tags.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {selectedCustomer.tags.map((tag, idx) => (
                                  <Badge
                                    key={idx}
                                    className={`text-white ${getTagColorClass(tag)}`}
                                  >
                                    {tag}
                                    <button
                                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                                      onClick={() => {
                                        toast({
                                          title: "Tag Removed",
                                          description: `The tag "${tag}" has been removed.`,
                                        });
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                      <span className="sr-only">Remove</span>
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">No tags have been added yet.</p>
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between items-center text-base">
                              <span>Notes</span>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 px-2"
                                onClick={() => {
                                  toast({
                                    title: "Add Note",
                                    description: "Adding a new note",
                                  });
                                }}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Add Note
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground text-sm">No notes have been added yet.</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="space-y-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Purchase Statistics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <Card>
                                <CardContent className="p-4">
                                  <p className="text-muted-foreground text-sm">Total Orders</p>
                                  <p className="text-2xl font-bold">{selectedCustomer.orders}</p>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4">
                                  <p className="text-muted-foreground text-sm">Total Spent</p>
                                  <p className="text-2xl font-bold">{formatCurrency(selectedCustomer.totalSpent)}</p>
                                </CardContent>
                              </Card>
                            </div>
                            <div className="mt-4">
                              <p className="text-sm text-muted-foreground">Last purchase on {formatDate(selectedCustomer.lastPurchase)}</p>
                              <p className="text-sm text-muted-foreground mt-1">Average order value: {formatCurrency(selectedCustomer.totalSpent / selectedCustomer.orders)}</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Recent Events Attended</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {selectedCustomer.orders > 0 ? (
                                <>
                                  <div className="flex justify-between items-center">
                                    <span>Summer Music Festival</span>
                                    <Badge variant="outline">2 Tickets</Badge>
                                  </div>
                                  {selectedCustomer.orders > 2 && (
                                    <div className="flex justify-between items-center">
                                      <span>Tech Conference 2025</span>
                                      <Badge variant="outline">1 Ticket</Badge>
                                    </div>
                                  )}
                                  {selectedCustomer.orders > 5 && (
                                    <div className="flex justify-between items-center">
                                      <span>Business Leadership Summit</span>
                                      <Badge variant="outline">3 Tickets</Badge>
                                    </div>
                                  )}
                                  <Button 
                                    variant="link" 
                                    className="p-0 h-auto"
                                    onClick={() => setActiveTab('orders')}
                                  >
                                    View all orders
                                  </Button>
                                </>
                              ) : (
                                <p className="text-muted-foreground text-sm">This customer hasn't attended any events yet.</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between items-center text-base">
                              <span>Communication Preferences</span>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 px-2"
                                onClick={() => {
                                  toast({
                                    title: "Edit Preferences",
                                    description: "Editing communication preferences",
                                  });
                                }}
                              >
                                <Edit className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Email Marketing:</span>
                                <span className="text-green-600 font-medium">Subscribed</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">SMS Notifications:</span>
                                <span className="text-green-600 font-medium">Subscribed</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Event Reminders:</span>
                                <span className="text-green-600 font-medium">Subscribed</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="orders" className="p-6 pt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Order History</CardTitle>
                        <CardDescription>View all orders placed by this customer</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedCustomer.orders > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Tickets</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({ length: Math.min(selectedCustomer.orders, 5) }).map((_, index) => {
                                const orderDate = new Date(selectedCustomer.lastPurchase);
                                orderDate.setDate(orderDate.getDate() - (index * 15)); // Spread out the dates
                                
                                const events = ['Summer Music Festival', 'Tech Conference 2025', 'Food & Wine Expo', 'Business Leadership Summit', 'Comedy Night Special'];
                                const event = events[index % events.length];
                                
                                const tickets = Math.floor(Math.random() * 3) + 1;
                                const amount = Math.floor(Math.random() * 5000) + 1000;
                                const statuses = ['completed', 'completed', 'completed', 'pending', 'cancelled'];
                                const status = statuses[index % statuses.length] as 'completed' | 'pending' | 'cancelled';
                                
                                return (
                                  <TableRow key={index}>
                                    <TableCell>#{1000 + index}</TableCell>
                                    <TableCell>{event}</TableCell>
                                    <TableCell>{orderDate.toLocaleDateString('en-IN')}</TableCell>
                                    <TableCell>{tickets}</TableCell>
                                    <TableCell>{formatCurrency(amount)}</TableCell>
                                    <TableCell>
                                      {status === 'completed' && <StatusBadge status="success" label="Completed" />}
                                      {status === 'pending' && <StatusBadge status="pending" label="Pending" />}
                                      {status === 'cancelled' && <StatusBadge status="error" label="Cancelled" />}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="h-8 p-0"
                                        onClick={() => {
                                          toast({
                                            title: "View Order",
                                            description: `Viewing order #${1000 + index}`,
                                          });
                                        }}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                        <span className="sr-only">View</span>
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-muted-foreground">This customer hasn't placed any orders yet.</p>
                            <Button 
                              className="mt-4"
                              onClick={() => {
                                toast({
                                  title: "Manual Order",
                                  description: "Creating a manual order for this customer",
                                });
                              }}
                            >
                              Create Manual Order
                            </Button>
                          </div>
                        )}
                      </CardContent>
                      {selectedCustomer.orders > 5 && (
                        <CardFooter className="flex justify-center border-t p-4">
                          <Button variant="outline" onClick={() => {
                            toast({
                              title: "All Orders",
                              description: "Viewing all orders for this customer",
                            });
                          }}>
                            View All Orders
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="activity" className="p-6 pt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Activity Log</CardTitle>
                        <CardDescription>Recent activity and interactions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border-l-2 border-muted pl-4 pb-1">
                            <p className="text-sm font-medium">Placed an order</p>
                            <p className="text-xs text-muted-foreground">{formatDate(selectedCustomer.lastPurchase)} at 2:30 PM</p>
                            <p className="text-sm mt-1">Purchased 2 tickets for Summer Music Festival</p>
                          </div>
                          
                          <div className="border-l-2 border-muted pl-4 pb-1">
                            <p className="text-sm font-medium">Email sent</p>
                            <p className="text-xs text-muted-foreground">{formatDate(selectedCustomer.lastPurchase)} at 2:31 PM</p>
                            <p className="text-sm mt-1">Order confirmation email sent</p>
                          </div>
                          
                          <div className="border-l-2 border-muted pl-4 pb-1">
                            <p className="text-sm font-medium">Viewed event page</p>
                            <p className="text-xs text-muted-foreground">{new Date(new Date(selectedCustomer.lastPurchase).getTime() - 3600000).toLocaleDateString('en-IN')} at 1:45 PM</p>
                            <p className="text-sm mt-1">Viewed Tech Conference 2025</p>
                          </div>
                          
                          <div className="border-l-2 border-muted pl-4 pb-1">
                            <p className="text-sm font-medium">Email opened</p>
                            <p className="text-xs text-muted-foreground">{new Date(new Date(selectedCustomer.lastPurchase).getTime() - 86400000).toLocaleDateString('en-IN')} at 10:12 AM</p>
                            <p className="text-sm mt-1">Opened promotional email "Upcoming Events"</p>
                          </div>
                          
                          <div className="border-l-2 border-muted pl-4 pb-1">
                            <p className="text-sm font-medium">Account created</p>
                            <p className="text-xs text-muted-foreground">{new Date(new Date(selectedCustomer.lastPurchase).getTime() - 7776000000).toLocaleDateString('en-IN')} at 5:20 PM</p>
                            <p className="text-sm mt-1">Created customer account</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-center border-t p-4">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Full Activity Log",
                              description: "Viewing complete activity history",
                            });
                          }}
                        >
                          View Full Activity Log
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2 p-6 pt-3 border-t">
                <Button 
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => {
                      toast({
                        title: "Edit Customer",
                        description: `Editing ${selectedCustomer.name}`,
                      });
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Customer
                  </Button>
                  <Button 
                    className="flex items-center gap-1"
                    onClick={() => {
                      setIsContactModalOpen(true);
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contact Customer
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleDeleteCustomer(selectedCustomer)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <CustomModalForm
        title="Add New Customer"
        description="Enter customer details to create a new account"
        fields={addCustomerFields}
        onSubmit={handleAddCustomer}
        submitText="Add Customer"
        cancelText="Cancel"
        isOpen={isAddCustomerModalOpen}
        onOpenChange={setIsAddCustomerModalOpen}
        width="lg"
      />
      
      <CustomModalForm
        title="Import Customers"
        description="Upload a file to import multiple customers"
        fields={importCustomersFields}
        onSubmit={handleImportCustomers}
        submitText="Import Customers"
        cancelText="Cancel"
        isOpen={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        width="md"
      />
      
      <CustomModalForm
        title="Export Customers"
        description="Choose export format and options"
        fields={exportCustomersFields}
        onSubmit={handleExportCustomers}
        submitText="Export"
        cancelText="Cancel"
        isOpen={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        width="md"
      />
      
      <CustomModalForm
        title="Add New Tag"
        description="Create a new tag and apply it to customers"
        fields={addTagFields}
        onSubmit={handleAddTag}
        submitText="Create Tag"
        cancelText="Cancel"
        isOpen={isAddTagModalOpen}
        onOpenChange={setIsAddTagModalOpen}
        width="sm"
      />
      
      <CustomModalForm
        title={`Contact ${selectedCustomer?.name || 'Customer'}`}
        description="Send a message to this customer"
        fields={contactCustomerFields}
        onSubmit={handleContactCustomer}
        submitText="Send Message"
        cancelText="Cancel"
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
        width="md"
      />
    </div>
  );
};

export default Customers;
