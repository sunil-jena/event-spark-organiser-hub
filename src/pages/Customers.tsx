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

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  lastActive: string;
  totalSpent: number;
  ordersCount: number;
  status: 'active' | 'inactive' | 'new';
  tags: string[];
}

const Customers = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const customers: Customer[] = [
    {
      id: 'CUST-1122',
      name: 'Raj Patel',
      email: 'raj.patel@example.com',
      phone: '9876543210',
      address: '123, Main Street, Mumbai',
      joinDate: '2023-01-15',
      lastActive: '2023-04-01',
      totalSpent: 12500,
      ordersCount: 5,
      status: 'active',
      tags: ['vip', 'regular'],
    },
    {
      id: 'CUST-1123',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '8765432109',
      address: '456, Linking Road, Bandra',
      joinDate: '2023-02-20',
      lastActive: '2023-04-02',
      totalSpent: 8750,
      ordersCount: 3,
      status: 'active',
      tags: ['regular'],
    },
    {
      id: 'CUST-1124',
      name: 'Anil Kumar',
      email: 'anil.kumar@example.com',
      phone: '7654321098',
      address: '789, MG Road, Bangalore',
      joinDate: '2023-03-10',
      lastActive: '2023-03-25',
      totalSpent: 5000,
      ordersCount: 2,
      status: 'inactive',
      tags: [],
    },
    {
      id: 'CUST-1125',
      name: 'Sunita Reddy',
      email: 'sunita.reddy@example.com',
      phone: '6543210987',
      address: '101, Brigade Road, Bangalore',
      joinDate: '2023-03-15',
      lastActive: '2023-04-03',
      totalSpent: 15000,
      ordersCount: 4,
      status: 'active',
      tags: ['vip'],
    },
    {
      id: 'CUST-1126',
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      phone: '5432109876',
      address: '222, Park Street, Kolkata',
      joinDate: '2023-01-05',
      lastActive: '2023-02-15',
      totalSpent: 3500,
      ordersCount: 1,
      status: 'inactive',
      tags: [],
    },
    {
      id: 'CUST-1127',
      name: 'Neha Verma',
      email: 'neha.verma@example.com',
      phone: '4321098765',
      address: '333, Camac Street, Kolkata',
      joinDate: '2023-03-25',
      lastActive: '2023-04-04',
      totalSpent: 7500,
      ordersCount: 2,
      status: 'active',
      tags: ['regular'],
    },
    {
      id: 'CUST-1128',
      name: 'Rahul Gupta',
      email: 'rahul.gupta@example.com',
      phone: '3210987654',
      address: '444, Central Avenue, Chennai',
      joinDate: '2023-04-01',
      lastActive: '2023-04-05',
      totalSpent: 2000,
      ordersCount: 1,
      status: 'new',
      tags: [],
    },
    {
      id: 'CUST-1129',
      name: 'Anjali Das',
      email: 'anjali.das@example.com',
      phone: '2109876543',
      address: '555, Mount Road, Chennai',
      joinDate: '2023-04-02',
      lastActive: '2023-04-05',
      totalSpent: 1500,
      ordersCount: 1,
      status: 'new',
      tags: [],
    },
    {
      id: 'CUST-1130',
      name: 'Sanjay Joshi',
      email: 'sanjay.joshi@example.com',
      phone: '1098765432',
      address: '666, Anna Salai, Chennai',
      joinDate: '2023-02-10',
      lastActive: '2023-03-20',
      totalSpent: 9000,
      ordersCount: 3,
      status: 'active',
      tags: ['regular'],
    },
    {
      id: 'CUST-1131',
      name: 'Kavita Nair',
      email: 'kavita.nair@example.com',
      phone: '9988776655',
      address: '777, T Nagar, Chennai',
      joinDate: '2023-01-20',
      lastActive: '2023-04-03',
      totalSpent: 18000,
      ordersCount: 6,
      status: 'active',
      tags: ['vip', 'regular'],
    },
    {
      id: 'CUST-1132',
      name: 'Mohammed Khan',
      email: 'mohammed.khan@example.com',
      phone: '8877665544',
      address: '888, Nungambakkam, Chennai',
      joinDate: '2023-03-05',
      lastActive: '2023-04-04',
      totalSpent: 6500,
      ordersCount: 2,
      status: 'active',
      tags: ['regular'],
    },
    {
      id: 'CUST-1133',
      name: 'Lakshmi Pillai',
      email: 'lakshmi.pillai@example.com',
      phone: '7766554433',
      address: '999, Adyar, Chennai',
      joinDate: '2023-04-03',
      lastActive: '2023-04-05',
      totalSpent: 1000,
      ordersCount: 1,
      status: 'new',
      tags: [],
    },
  ];

  // Helper function to safely check if a value includes a search string
  const safeIncludes = (
    value: string | number | boolean | string[],
    search: string
  ): boolean => {
    if (typeof value === 'string') {
      return value.toLowerCase().includes(search.toLowerCase());
    } else if (
      Array.isArray(value) &&
      value.every((item) => typeof item === 'string')
    ) {
      return value.some((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      );
    }
    return String(value).includes(search);
  };

  const matchesDateFilter = (
    customerDate: string,
    operator: string,
    filterValue: string
  ): boolean => {
    // Convert both dates to Date objects for comparison
    const dateToCheck = new Date(customerDate);
    const filterDate = new Date(filterValue);

    // Check if both dates are valid
    if (isNaN(dateToCheck.getTime()) || isNaN(filterDate.getTime())) {
      return false;
    }

    // Now compare dates based on operator
    if (operator === 'equals') {
      return dateToCheck.toDateString() === filterDate.toDateString();
    } else if (operator === 'greaterThan' || operator === 'after') {
      return dateToCheck > filterDate;
    } else if (operator === 'lessThan' || operator === 'before') {
      return dateToCheck < filterDate;
    } else if (operator === 'between') {
      // For between operator, we expect filterValue to be in format "start,end"
      const [start, end] = filterValue
        .split(',')
        .map((d) => new Date(d.trim()));
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return false;
      }
      return dateToCheck >= start && dateToCheck <= end;
    }

    return false;
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      safeIncludes(customer.id, searchQuery) ||
      safeIncludes(customer.name, searchQuery) ||
      safeIncludes(customer.email, searchQuery) ||
      safeIncludes(customer.phone, searchQuery);

    const matchesFilters = activeFilters.every((filter) => {
      const field = filter.field as keyof Customer;
      const value = customer[field];

      if (field === 'joinDate' || field === 'lastActive') {
        return matchesDateFilter(
          value as string,
          filter.operator,
          filter.value
        );
      }

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
      } else if (Array.isArray(value)) {
        return value.includes(filter.value);
      }

      return true;
    });

    return matchesSearch && matchesFilters;
  });

  const totalCustomers = filteredCustomers.length;
  const totalPages = Math.ceil(totalCustomers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <StatusBadge status='success' label='Active' />;
      case 'inactive':
        return <StatusBadge status='warning' label='Inactive' />;
      case 'new':
        return <StatusBadge status='info' label='New' />;
      default:
        return <StatusBadge status='default' label={status} />;
    }
  };

  const filterOptions = [
    {
      name: 'Status',
      options: ['active', 'inactive', 'new'],
    },
    {
      name: 'Tags',
      options: ['vip', 'regular'],
    },
  ];

  const handleFilterChange = (
    filterName: string,
    option: string,
    isSelected: boolean
  ) => {
    setActiveFilters((prev) => {
      if (isSelected) {
        return [
          ...prev,
          {
            field: filterName === 'Status' ? 'status' : 'tags',
            operator: filterName === 'Status' ? 'equals' : 'contains',
            value: option,
          },
        ];
      } else {
        return prev.filter(
          (filter) =>
            !(
              filter.field === (filterName === 'Status' ? 'status' : 'tags') &&
              filter.value === option
            )
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

  const handleOpenDetailsModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDetailsModalOpen(true);
  };

  const handleSubmitDetails = async (data: Record<string, any>) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: 'Customer updated',
      description: `Customer ${selectedCustomer?.name} has been updated successfully`,
    });

    setDetailsModalOpen(false);
  };

  const customerDetailFields: FormField[] = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter customer name',
      defaultValue: selectedCustomer?.name || '',
      required: true,
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter customer email',
      defaultValue: selectedCustomer?.email || '',
      required: true,
    },
    {
      id: 'phone',
      label: 'Phone',
      type: 'text',
      placeholder: 'Enter customer phone',
      defaultValue: selectedCustomer?.phone || '',
    },
    {
      id: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Enter customer address',
      defaultValue: selectedCustomer?.address || '',
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'new', label: 'New' },
      ],
      defaultValue: selectedCustomer?.status || 'active',
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>Customers</h1>
          <p className='text-muted-foreground'>Manage your customer database</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className='w-[160px]'>
              <Calendar className='mr-2 h-4 w-4' />
              <SelectValue placeholder='Select range' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='today'>Today</SelectItem>
              <SelectItem value='yesterday'>Yesterday</SelectItem>
              <SelectItem value='7d'>Last 7 days</SelectItem>
              <SelectItem value='30d'>Last 30 days</SelectItem>
              <SelectItem value='90d'>Last 90 days</SelectItem>
              <SelectItem value='year'>This year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Add Customer
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>
                <Download className='mr-2 h-4 w-4' />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => toast({ title: 'Exporting PDF' })}
              >
                <FileText className='mr-2 h-4 w-4' /> Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast({ title: 'Exporting CSV' })}
              >
                <FileText className='mr-2 h-4 w-4' /> Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast({ title: 'Exporting Excel' })}
              >
                <FileText className='mr-2 h-4 w-4' /> Export as Excel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => toast({ title: 'Print initiated' })}
              >
                <Printer className='mr-2 h-4 w-4' /> Print Customer List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <CardTitle>Customer Database</CardTitle>
          <CardDescription>
            Showing {filteredCustomers.length} customers for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
            <div className='flex-grow w-full md:w-auto'>
              <AdvancedSearch
                onSearch={handleSearch}
                placeholder='Search customers...'
                fields={[
                  { name: 'id', label: 'Customer ID' },
                  { name: 'name', label: 'Name' },
                  { name: 'email', label: 'Email' },
                  { name: 'phone', label: 'Phone' },
                  { name: 'status', label: 'Status' },
                  { name: 'joinDate', label: 'Join Date' },
                  { name: 'lastActive', label: 'Last Active' },
                  { name: 'totalSpent', label: 'Total Spent' },
                  { name: 'ordersCount', label: 'Orders Count' },
                ]}
              />
            </div>
            <div className='flex gap-2 flex-wrap'>
              {filterOptions.map((filterGroup) => (
                <FilterDropdown
                  key={filterGroup.name}
                  triggerText={filterGroup.name}
                  icon={<FilterIcon className='h-4 w-4' />}
                >
                  <FilterGroup>
                    {filterGroup.options.map((option) => {
                      const field =
                        filterGroup.name === 'Status' ? 'status' : 'tags';
                      const isActive = activeFilters.some(
                        (f) => f.field === field && f.value === option
                      );

                      return (
                        <div
                          key={option}
                          className='flex items-center space-x-2'
                        >
                          <input
                            type='checkbox'
                            id={`filter-${filterGroup.name}-${option}`}
                            checked={isActive}
                            onChange={(e) =>
                              handleFilterChange(
                                filterGroup.name,
                                option,
                                e.target.checked
                              )
                            }
                            className='rounded text-primary focus:ring-primary'
                          />
                          <Label
                            htmlFor={`filter-${filterGroup.name}-${option}`}
                            className='text-sm cursor-pointer'
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
                variant='ghost'
                size='icon'
                onClick={() => {
                  setActiveFilters([]);
                  setSearchQuery('');
                }}
                disabled={activeFilters.length === 0 && searchQuery === ''}
                title='Clear filters'
              >
                <RefreshCw className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <div className='border rounded-md'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className='text-center py-8 text-gray-500'
                    >
                      No customers found. Try a different search or filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map((customer) => (
                    <TableRow key={customer.id} className='table-row-hover'>
                      <TableCell className='font-medium'>
                        {customer.id}
                      </TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        {new Date(customer.joinDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        ₹{customer.totalSpent.toLocaleString()}
                      </TableCell>
                      <TableCell>{customer.ordersCount}</TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreHorizontal className='h-4 w-4' />
                              <span className='sr-only'>Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() => handleOpenDetailsModal(customer)}
                            >
                              <User className='mr-2 h-4 w-4' /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className='mr-2 h-4 w-4' /> Edit Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className='mr-2 h-4 w-4' /> Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='text-red-600'>
                              <X className='mr-2 h-4 w-4' /> Delete Customer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className='mt-4'>
            <DataPagination
              currentPage={currentPage}
              totalItems={filteredCustomers.length}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setItemsPerPage}
              showingText='customers'
            />
          </div>
        </CardContent>
      </Card>

      <CustomModalForm
        title='Customer Details'
        description='View and edit customer information'
        fields={customerDetailFields}
        onSubmit={handleSubmitDetails}
        submitText='Update Customer'
        cancelText='Close'
        isOpen={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        width='lg'
      >
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <h3 className='text-lg font-semibold'>Customer Information</h3>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <User className='h-4 w-4 text-muted-foreground' />
                  <span>{selectedCustomer?.name}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                  <span>{selectedCustomer?.email}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='h-4 w-4 text-muted-foreground' />
                  <span>{selectedCustomer?.phone}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <MapPin className='h-4 w-4 text-muted-foreground' />
                  <span>{selectedCustomer?.address}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold'>Account Information</h3>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <CalendarIcon className='h-4 w-4 text-muted-foreground' />
                  <span>
                    Joined:{' '}
                    {new Date(
                      selectedCustomer?.joinDate || ''
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <CalendarIcon className='h-4 w-4 text-muted-foreground' />
                  <span>
                    Last Active:{' '}
                    {new Date(
                      selectedCustomer?.lastActive || ''
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <DollarSign className='h-4 w-4 text-muted-foreground' />
                  <span>
                    Total Spent: ₹
                    {selectedCustomer?.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <ShoppingCart className='h-4 w-4 text-muted-foreground' />
                  <span>Orders: {selectedCustomer?.ordersCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold'>Tags</h3>
            <div className='flex flex-wrap gap-2 mt-2'>
              {selectedCustomer?.tags.length === 0 ? (
                <span className='text-muted-foreground'>No tags</span>
              ) : (
                selectedCustomer?.tags.map((tag) => (
                  <Badge key={tag} variant='secondary'>
                    {tag}
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold'>Recent Orders</h3>
            <div className='border rounded-md mt-2'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='text-center py-4 text-gray-500'
                    >
                      No recent orders to display
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CustomModalForm>
    </div>
  );
};

export default Customers;
