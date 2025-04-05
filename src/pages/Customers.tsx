import React, { useState, useEffect } from 'react';
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
  Search,
  Plus,
  MoreHorizontal,
  RefreshCw,
  Mail,
  Phone,
  User,
  Users,
  Calendar as CalendarIcon,
  IdCard,
  CreditCard,
  MapPin,
  Badge as BadgeIcon,
  Package,
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  BarChart2,
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
import { StatusBadge } from '@/components/ui/status-badge';
import { DataPagination } from '@/components/ui/data-pagination';
import { AdvancedSearch, Filter } from '@/components/ui/advanced-search';
import { FilterDropdown, FilterGroup } from '@/components/ui/filter-dropdown';
import { useToast } from '@/hooks/use-toast';
import { CustomModalForm, FormField } from '@/components/ui/custom-modal-form';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  registrationDate: string;
  lastOrderDate: string;
  totalOrders: number;
  totalSpent: number;
  paymentMethod: string;
  loyaltyPoints: number;
  membershipTier: 'bronze' | 'silver' | 'gold';
}

const Customers = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const customersData: Customer[] = [
    {
      id: 'CUST-1001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '9876543210',
      address: '123, Main Street',
      city: 'Mumbai',
      country: 'India',
      registrationDate: '2024-01-15',
      lastOrderDate: '2024-04-01',
      totalOrders: 15,
      totalSpent: 4500,
      paymentMethod: 'Credit Card',
      loyaltyPoints: 450,
      membershipTier: 'silver',
    },
    {
      id: 'CUST-1002',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '8765432109',
      address: '456, Park Avenue',
      city: 'Delhi',
      country: 'India',
      registrationDate: '2024-02-20',
      lastOrderDate: '2024-04-05',
      totalOrders: 8,
      totalSpent: 2200,
      paymentMethod: 'UPI',
      loyaltyPoints: 220,
      membershipTier: 'bronze',
    },
    {
      id: 'CUST-1003',
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      phone: '7654321098',
      address: '789, MG Road',
      city: 'Bangalore',
      country: 'India',
      registrationDate: '2024-03-10',
      lastOrderDate: '2024-04-10',
      totalOrders: 20,
      totalSpent: 6000,
      paymentMethod: 'NetBanking',
      loyaltyPoints: 600,
      membershipTier: 'gold',
    },
    {
      id: 'CUST-1004',
      name: 'Anjali Reddy',
      email: 'anjali.reddy@example.com',
      phone: '6543210987',
      address: '101, Church Street',
      city: 'Chennai',
      country: 'India',
      registrationDate: '2024-04-01',
      lastOrderDate: '2024-04-15',
      totalOrders: 5,
      totalSpent: 1500,
      paymentMethod: 'Debit Card',
      loyaltyPoints: 150,
      membershipTier: 'bronze',
    },
    {
      id: 'CUST-1005',
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      phone: '5432109876',
      address: '222, Linking Road',
      city: 'Mumbai',
      country: 'India',
      registrationDate: '2023-12-25',
      lastOrderDate: '2024-04-20',
      totalOrders: 12,
      totalSpent: 3800,
      paymentMethod: 'Credit Card',
      loyaltyPoints: 380,
      membershipTier: 'silver',
    },
    {
      id: 'CUST-1006',
      name: 'Deepika Menon',
      email: 'deepika.menon@example.com',
      phone: '4321098765',
      address: '333, Brigade Road',
      city: 'Bangalore',
      country: 'India',
      registrationDate: '2024-01-01',
      lastOrderDate: '2024-04-25',
      totalOrders: 18,
      totalSpent: 5200,
      paymentMethod: 'UPI',
      loyaltyPoints: 520,
      membershipTier: 'gold',
    },
    {
      id: 'CUST-1007',
      name: 'Karthik Iyer',
      email: 'karthik.iyer@example.com',
      phone: '3210987654',
      address: '444, Anna Salai',
      city: 'Chennai',
      country: 'India',
      registrationDate: '2024-02-10',
      lastOrderDate: '2024-04-30',
      totalOrders: 7,
      totalSpent: 2000,
      paymentMethod: 'NetBanking',
      loyaltyPoints: 200,
      membershipTier: 'bronze',
    },
    {
      id: 'CUST-1008',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      phone: '2109876543',
      address: '555, Banjara Hills',
      city: 'Hyderabad',
      country: 'India',
      registrationDate: '2024-03-01',
      lastOrderDate: '2024-05-05',
      totalOrders: 14,
      totalSpent: 4200,
      paymentMethod: 'Debit Card',
      loyaltyPoints: 420,
      membershipTier: 'silver',
    },
    {
      id: 'CUST-1009',
      name: 'Gaurav Sharma',
      email: 'gaurav.sharma@example.com',
      phone: '1098765432',
      address: '666, Park Street',
      city: 'Kolkata',
      country: 'India',
      registrationDate: '2023-12-15',
      lastOrderDate: '2024-05-10',
      totalOrders: 22,
      totalSpent: 6500,
      paymentMethod: 'Credit Card',
      loyaltyPoints: 650,
      membershipTier: 'gold',
    },
    {
      id: 'CUST-1010',
      name: 'Aishwarya Nair',
      email: 'aishwarya.nair@example.com',
      phone: '9988776655',
      address: '777, MG Road',
      city: 'Pune',
      country: 'India',
      registrationDate: '2024-01-20',
      lastOrderDate: '2024-05-15',
      totalOrders: 9,
      totalSpent: 2500,
      paymentMethod: 'UPI',
      loyaltyPoints: 250,
      membershipTier: 'bronze',
    },
    {
      id: 'CUST-1011',
      name: 'Rohit Verma',
      email: 'rohit.verma@example.com',
      phone: '8877665544',
      address: '888, Linking Road',
      city: 'Mumbai',
      country: 'India',
      registrationDate: '2024-02-25',
      lastOrderDate: '2024-05-20',
      totalOrders: 16,
      totalSpent: 4800,
      paymentMethod: 'NetBanking',
      loyaltyPoints: 480,
      membershipTier: 'silver',
    },
    {
      id: 'CUST-1012',
      name: 'Shilpa Menon',
      email: 'shilpa.menon@example.com',
      phone: '7766554433',
      address: '999, Brigade Road',
      city: 'Bangalore',
      country: 'India',
      registrationDate: '2024-03-15',
      lastOrderDate: '2024-05-25',
      totalOrders: 11,
      totalSpent: 3200,
      paymentMethod: 'Debit Card',
      loyaltyPoints: 320,
      membershipTier: 'bronze',
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

  // Helper function for safe date comparison
  const safeDateCompare = (dateValue: string, compareDate: Date): boolean => {
    try {
      const valueDate = new Date(dateValue);
      return !isNaN(valueDate.getTime()) ? valueDate >= compareDate : false;
    } catch {
      return false;
    }
  };

  const filteredCustomers = customersData.filter(customer => {
    const matchesSearch = 
      safeIncludes(customer.name, searchQuery) ||
      safeIncludes(customer.email, searchQuery) ||
      safeIncludes(customer.phone, searchQuery) ||
      safeIncludes(customer.id, searchQuery);

    const matchesFilters = activeFilters.every(filter => {
      const value = customer[filter.field as keyof Customer];

      if (typeof value === 'string') {
        if (filter.operator === 'equals') {
          return value === filter.value;
        } else if (filter.operator === 'contains') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        } else if (filter.operator === 'startsWith') {
          return value.toLowerCase().startsWith(filter.value.toLowerCase());
        } else if (filter.operator === 'endsWith') {
          return value.toLowerCase().endsWith(filter.value.toLowerCase());
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
      } else if (filter.field === 'registrationDate' || filter.field === 'lastOrderDate') {
        if (filter.operator === 'after') {
          return safeDateCompare(value as string, new Date(filter.value));
        } else if (filter.operator === 'before') {
          return !safeDateCompare(value as string, new Date(filter.value));
        } else if (filter.operator === 'between') {
          const [startDateStr, endDateStr] = filter.value.split(',');
          const startDate = new Date(startDateStr.trim());
          const endDate = new Date(endDateStr.trim());
          const valueDate = new Date(value as string);
          return !isNaN(valueDate.getTime()) && valueDate >= startDate && valueDate < endDate;
        }
      }

      return true;
    });

    return matchesSearch && matchesFilters;
  });

  const totalCustomers = filteredCustomers.length;
  const totalPages = Math.ceil(totalCustomers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (query: string, filters: Filter[]) => {
    setSearchQuery(query);
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const filterOptions = [
    {
      name: 'Membership Tier',
      options: ['bronze', 'silver', 'gold'],
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
          field: filterName === 'Membership Tier' ? 'membershipTier' : 'paymentMethod',
          operator: 'equals',
          value: option
        }];
      } else {
        return prev.filter(filter => 
          !(filter.field === (filterName === 'Membership Tier' ? 'membershipTier' : 'paymentMethod') && 
          filter.value === option)
        );
      }
    });
    
    setCurrentPage(1);
  };

  const addCustomerFields: FormField[] = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter customer name',
      required: true,
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter customer email',
      required: true,
    },
    {
      id: 'phone',
      label: 'Phone',
      type: 'text',
      placeholder: 'Enter customer phone',
      required: true,
    },
    {
      id: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Enter customer address',
    },
    {
      id: 'city',
      label: 'City',
      type: 'text',
      placeholder: 'Enter customer city',
    },
    {
      id: 'country',
      label: 'Country',
      type: 'text',
      placeholder: 'Enter customer country',
    },
    {
      id: 'registrationDate',
      label: 'Registration Date',
      type: 'date',
    },
    {
      id: 'paymentMethod',
      label: 'Payment Method',
      type: 'select',
      options: [
        { value: 'Credit Card', label: 'Credit Card' },
        { value: 'Debit Card', label: 'Debit Card' },
        { value: 'UPI', label: 'UPI' },
        { value: 'NetBanking', label: 'NetBanking' },
      ],
    },
    {
      id: 'membershipTier',
      label: 'Membership Tier',
      type: 'select',
      options: [
        { value: 'bronze', label: 'Bronze' },
        { value: 'silver', label: 'Silver' },
        { value: 'gold', label: 'Gold' },
      ],
    },
  ];

  const handleAddCustomer = async (data: Record<string, any>) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Customer added successfully",
      description: `Added new customer: ${data.name}`,
    });
  };

  const editCustomerFields: FormField[] = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter customer name',
      required: true,
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter customer email',
      required: true,
    },
    {
      id: 'phone',
      label: 'Phone',
      type: 'text',
      placeholder: 'Enter customer phone',
      required: true,
    },
    {
      id: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Enter customer address',
    },
    {
      id: 'city',
      label: 'City',
      type: 'text',
      placeholder: 'Enter customer city',
    },
    {
      id: 'country',
      label: 'Country',
      type: 'text',
      placeholder: 'Enter customer country',
    },
    {
      id: 'registrationDate',
      label: 'Registration Date',
      type: 'date',
    },
    {
      id: 'paymentMethod',
      label: 'Payment Method',
      type: 'select',
      options: [
        { value: 'Credit Card', label: 'Credit Card' },
        { value: 'Debit Card', label: 'Debit Card' },
        { value: 'UPI', label: 'UPI' },
        { value: 'NetBanking', label: 'NetBanking' },
      ],
    },
    {
      id: 'membershipTier',
      label: 'Membership Tier',
      type: 'select',
      options: [
        { value: 'bronze', label: 'Bronze' },
        { value: 'silver', label: 'Silver' },
        { value: 'gold', label: 'Gold' },
      ],
    },
  ];

  const handleEditCustomer = async (data: Record<string, any>) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Customer updated successfully",
      description: `Updated customer: ${data.name}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer base</p>
        </div>
        <div className="flex flex-wrap gap-2">
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
                <Printer className="mr-2 h-4 w-4" /> Print Customers Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            Showing {filteredCustomers.length} customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex-grow w-full md:w-auto">
              <AdvancedSearch 
                onSearch={handleSearch} 
                placeholder="Search customers..." 
                fields={[
                  { name: 'name', label: 'Name' },
                  { name: 'email', label: 'Email' },
                  { name: 'phone', label: 'Phone' },
                  { name: 'address', label: 'Address' },
                  { name: 'city', label: 'City' },
                  { name: 'country', label: 'Country' },
                  { name: 'registrationDate', label: 'Registration Date', type: 'date' },
                  { name: 'lastOrderDate', label: 'Last Order Date', type: 'date' },
                  { name: 'totalOrders', label: 'Total Orders', type: 'number' },
                  { name: 'totalSpent', label: 'Total Spent', type: 'number' },
                  { name: 'paymentMethod', label: 'Payment Method' },
                  { name: 'loyaltyPoints', label: 'Loyalty Points', type: 'number' },
                  { name: 'membershipTier', label: 'Membership Tier' },
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
                      const field = filterGroup.name === 'Membership Tier' ? 'membershipTier' : 'paymentMethod';
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
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No customers found. Try a different search or filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map((customer) => (
                    <TableRow key={customer.id} className="table-row-hover">
                      <TableCell className="font-medium">{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{new Date(customer.registrationDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{customer.membershipTier}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedCustomer(customer);
                              setEditModalOpen(true);
                            }}>
                              <User className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: "Customer details" })}>
                              <IdCard className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: "Customer orders" })}>
                              <Package className="mr-2 h-4 w-4" /> View Orders
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: "Customer payments" })}>
                              <Wallet className="mr-2 h-4 w-4" /> View Payments
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toast({ title: "Customer support" })}>
                              <Mail className="mr-2 h-4 w-4" /> Contact Support
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
          
          <div className="mt-4">
            <DataPagination
              currentPage={currentPage}
              totalItems={filteredCustomers.length}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setItemsPerPage}
              showingText="customers"
            />
          </div>
        </CardContent>
      </Card>

      <CustomModalForm
        title="Add New Customer"
        description="Enter customer details"
        fields={addCustomerFields}
        onSubmit={handleAddCustomer}
        submitText="Add Customer"
        cancelText="Cancel"
        isOpen={addModalOpen}
        onOpenChange={setAddModalOpen}
        width="lg"
      />

      {selectedCustomer && (
        <CustomModalForm
          title="Edit Customer"
          description="Edit customer details"
          fields={editCustomerFields}
          onSubmit={handleEditCustomer}
          submitText="Update Customer"
          cancelText="Cancel"
          isOpen={editModalOpen}
          onOpenChange={setEditModalOpen}
          width="lg"
        />
      )}
    </div>
  );
};

export default Customers;
