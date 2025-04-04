
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Mail, MoreHorizontal, Filter, Download } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Customer type definition
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastPurchase: string;
  avatar?: string;
}

// Sample customer data
const customersData: Customer[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    orders: 8,
    totalSpent: 24500,
    lastPurchase: '2025-03-15',
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 87654 32109',
    orders: 5,
    totalSpent: 12800,
    lastPurchase: '2025-03-27',
    avatar: 'https://i.pravatar.cc/150?img=32'
  },
  {
    id: '3',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '+91 76543 21098',
    orders: 3,
    totalSpent: 8750,
    lastPurchase: '2025-04-01',
  },
  {
    id: '4',
    name: 'Ananya Reddy',
    email: 'ananya.reddy@example.com',
    phone: '+91 65432 10987',
    orders: 12,
    totalSpent: 35600,
    lastPurchase: '2025-03-30',
    avatar: 'https://i.pravatar.cc/150?img=29'
  },
  {
    id: '5',
    name: 'Deepak Gupta',
    email: 'deepak.gupta@example.com',
    phone: '+91 54321 09876',
    orders: 2,
    totalSpent: 4200,
    lastPurchase: '2025-02-18',
  },
  {
    id: '6',
    name: 'Kavita Joshi',
    email: 'kavita.joshi@example.com',
    phone: '+91 43210 98765',
    orders: 7,
    totalSpent: 19800,
    lastPurchase: '2025-03-12',
    avatar: 'https://i.pravatar.cc/150?img=44'
  },
  {
    id: '7',
    name: 'Arjun Kumar',
    email: 'arjun.kumar@example.com',
    phone: '+91 32109 87654',
    orders: 4,
    totalSpent: 12350,
    lastPurchase: '2025-03-25',
  },
];

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(customersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCustomerDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage and view your customer details</p>
        </div>
        <div className="flex gap-2">
          <Button className="flex items-center gap-1">
            <Download size={16} />
            Export
          </Button>
          <Button className="flex items-center gap-1">
            <Plus size={16} />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-1 self-start sm:self-auto">
          <Filter size={16} />
          Filters
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
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
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                  <TableCell>{formatDate(customer.lastPurchase)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={(e) => {
                      e.stopPropagation();
                      // Send email to customer
                    }}>
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => {
                      e.stopPropagation();
                      // Show more options
                    }}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle>Customer Details</DialogTitle>
                <DialogDescription>
                  View comprehensive information about this customer.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      {selectedCustomer.avatar ? (
                        <AvatarImage src={selectedCustomer.avatar} />
                      ) : (
                        <AvatarFallback className="text-lg">
                          {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                      <p className="text-muted-foreground">Customer ID: #{selectedCustomer.id}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Contact Information</h4>
                    <div className="grid grid-cols-[100px_1fr] gap-1">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{selectedCustomer.email}</span>
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{selectedCustomer.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Purchase Statistics</h4>
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
                  <div>
                    <p className="text-sm text-muted-foreground">Last purchase on {formatDate(selectedCustomer.lastPurchase)}</p>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
                <Button className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Contact Customer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
