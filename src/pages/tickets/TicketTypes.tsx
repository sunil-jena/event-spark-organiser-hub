import React, { useState } from 'react';
import {
  Ticket,
  Plus,
  Trash2,
  Edit,
  Copy,
  Filter,
  Search,
  EyeOff,
  ChevronDown,
  ArrowUpDown,
  Info,
  ArrowUp,
  ArrowDown,
  Loader2,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/ui/status-badge';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataPagination } from '@/components/ui/data-pagination';

interface TicketType {
  id: string;
  name: string;
  price: number;
  eventName: string;
  status: 'active' | 'sold_out' | 'inactive' | 'draft';
  totalQuantity: number;
  availableQuantity: number;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
}

const TicketTypes = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof TicketType>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    {
      id: '1',
      name: 'General Admission',
      price: 999,
      eventName: 'Summer Music Festival',
      status: 'active',
      totalQuantity: 500,
      availableQuantity: 234,
      description: 'Standard entry to the event',
      category: 'standard',
      startDate: '2025-04-15',
      endDate: '2025-04-15',
    },
    {
      id: '2',
      name: 'VIP Package',
      price: 2999,
      eventName: 'Summer Music Festival',
      status: 'active',
      totalQuantity: 100,
      availableQuantity: 42,
      description: 'VIP access with premium seating and backstage pass',
      category: 'premium',
      startDate: '2025-04-15',
      endDate: '2025-04-15',
    },
    {
      id: '3',
      name: 'Early Bird',
      price: 799,
      eventName: 'Tech Conference 2025',
      status: 'sold_out',
      totalQuantity: 200,
      availableQuantity: 0,
      description: 'Early bird discount tickets',
      category: 'discount',
      startDate: '2025-04-22',
      endDate: '2025-04-22',
    },
    {
      id: '4',
      name: 'Standard Entry',
      price: 1299,
      eventName: 'Tech Conference 2025',
      status: 'active',
      totalQuantity: 1000,
      availableQuantity: 456,
      description: 'Standard conference entry',
      category: 'standard',
      startDate: '2025-04-22',
      endDate: '2025-04-22',
    },
    {
      id: '5',
      name: 'Workshop Pass',
      price: 1999,
      eventName: 'Tech Conference 2025',
      status: 'active',
      totalQuantity: 100,
      availableQuantity: 27,
      description: 'Access to all workshops and sessions',
      category: 'premium',
      startDate: '2025-04-22',
      endDate: '2025-04-22',
    },
    {
      id: '6',
      name: 'Family Pack',
      price: 2499,
      eventName: 'Food & Wine Expo',
      status: 'active',
      totalQuantity: 300,
      availableQuantity: 182,
      description: 'Entry for 4 family members with tasting vouchers',
      category: 'group',
      startDate: '2025-05-10',
      endDate: '2025-05-10',
    },
    {
      id: '7',
      name: 'Premium Tasting',
      price: 1799,
      eventName: 'Food & Wine Expo',
      status: 'active',
      totalQuantity: 150,
      availableQuantity: 98,
      description: 'Premium wine and food tasting experience',
      category: 'premium',
      startDate: '2025-05-10',
      endDate: '2025-05-10',
    },
    {
      id: '8',
      name: 'Group Discount',
      price: 699,
      eventName: 'Comedy Night',
      status: 'inactive',
      totalQuantity: 50,
      availableQuantity: 50,
      description: 'Group discount for parties of 5+',
      category: 'group',
      startDate: '2025-05-25',
      endDate: '2025-05-25',
    },
    {
      id: '9',
      name: 'Front Row Seats',
      price: 1499,
      eventName: 'Comedy Night',
      status: 'draft',
      totalQuantity: 20,
      availableQuantity: 20,
      description: 'Premium front row seating',
      category: 'premium',
      startDate: '2025-05-25',
      endDate: '2025-05-25',
    },
    {
      id: '10',
      name: 'Student Discount',
      price: 499,
      eventName: 'Tech Workshop',
      status: 'active',
      totalQuantity: 100,
      availableQuantity: 73,
      description: 'Special pricing for students with valid ID',
      category: 'discount',
      startDate: '2025-06-05',
      endDate: '2025-06-05',
    },
    {
      id: '11',
      name: 'Basic Entry',
      price: 599,
      eventName: 'Art Exhibition',
      status: 'active',
      totalQuantity: 500,
      availableQuantity: 421,
      description: 'Standard gallery access',
      category: 'standard',
      startDate: '2025-06-15',
      endDate: '2025-06-20',
    },
    {
      id: '12',
      name: 'Guided Tour',
      price: 899,
      eventName: 'Art Exhibition',
      status: 'active',
      totalQuantity: 100,
      availableQuantity: 62,
      description: 'Gallery access with an expert guide',
      category: 'premium',
      startDate: '2025-06-15',
      endDate: '2025-06-20',
    },
  ]);

  const filteredTickets = ticketTypes.filter((ticket) => {
    const matchesSearch =
      ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.eventName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !filterStatus || ticket.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
      return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    }

    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = sortedTickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage);

  const toggleSort = (field: keyof TicketType) => {
    const newDirection =
      field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const handleEditTicket = (ticket: TicketType) => {
    setSelectedTicket(ticket);
    setEditModalOpen(true);
  };

  const handleDeleteTicket = (ticket: TicketType) => {
    setSelectedTicket(ticket);
    setDeleteModalOpen(true);
  };

  const saveTicket = () => {
    if (!selectedTicket) return;

    setIsLoading(true);

    setTimeout(() => {
      setTicketTypes((prev) =>
        prev.map((ticket) =>
          ticket.id === selectedTicket.id ? selectedTicket : ticket
        )
      );

      setEditModalOpen(false);
      setIsLoading(false);

      toast({
        title: 'Ticket updated',
        description: `Ticket "${selectedTicket.name}" has been updated successfully.`,
      });
    }, 1000);
  };

  const confirmDeleteTicket = () => {
    if (!selectedTicket) return;

    setIsLoading(true);

    setTimeout(() => {
      setTicketTypes((prev) =>
        prev.filter((ticket) => ticket.id !== selectedTicket.id)
      );
      setDeleteModalOpen(false);
      setIsLoading(false);

      toast({
        title: 'Ticket deleted',
        description: `Ticket "${selectedTicket.name}" has been deleted successfully.`,
      });
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <StatusBadge status='success' label='Active' />;
      case 'sold_out':
        return <StatusBadge status='error' label='Sold Out' />;
      case 'inactive':
        return <StatusBadge status='warning' label='Inactive' />;
      case 'draft':
        return <StatusBadge status='info' label='Draft' />;
      default:
        return <StatusBadge status='info' label={status} />;
    }
  };

  const handleDuplicateTicket = (ticket: TicketType) => {
    const duplicatedTicket: TicketType = {
      ...ticket,
      id: `${ticket.id}-copy-${Math.floor(Math.random() * 1000)}`,
      name: `${ticket.name} (Copy)`,
    };

    setTicketTypes((prev) => [...prev, duplicatedTicket]);

    toast({
      title: 'Ticket duplicated',
      description: `A copy of "${ticket.name}" has been created.`,
    });
  };

  const handleAddTicket = () => {
    const newTicket: TicketType = {
      id: `new-${Date.now()}`,
      name: 'New Ticket Type',
      price: 0,
      eventName: '',
      status: 'draft',
      totalQuantity: 0,
      availableQuantity: 0,
      description: '',
      category: 'standard',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    };

    setSelectedTicket(newTicket);
    setEditModalOpen(true);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold'>Ticket Types</h1>
          <p className='text-muted-foreground'>
            Manage ticket types for your events
          </p>
        </div>
        <Button onClick={handleAddTicket} className='flex items-center gap-2'>
          <Plus className='h-4 w-4' /> Add Ticket Type
        </Button>
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <CardTitle>All Ticket Types</CardTitle>
          <CardDescription>
            You have {filteredTickets.length} ticket types across all your
            events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row gap-4 mb-6'>
            <div className='relative flex-grow'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search ticket types or events...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>
            <Select
              value={filterStatus || ''}
              onValueChange={(value) => setFilterStatus(value || null)}
            >
              <SelectTrigger className='w-full sm:w-[180px]'>
                <div className='flex items-center gap-2'>
                  <Filter className='h-4 w-4' />
                  <span>
                    {filterStatus ? `Status: ${filterStatus}` : 'Filter status'}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=''>All statuses</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='sold_out'>Sold out</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
                <SelectItem value='draft'>Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='border rounded-md'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[250px]'>
                    <button
                      className='flex items-center gap-1 hover:text-primary'
                      onClick={() => toggleSort('name')}
                    >
                      Ticket Name
                      {sortField === 'name' &&
                        (sortDirection === 'asc' ? (
                          <ArrowUp className='h-3 w-3' />
                        ) : (
                          <ArrowDown className='h-3 w-3' />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className='flex items-center gap-1 hover:text-primary'
                      onClick={() => toggleSort('price')}
                    >
                      Price
                      {sortField === 'price' &&
                        (sortDirection === 'asc' ? (
                          <ArrowUp className='h-3 w-3' />
                        ) : (
                          <ArrowDown className='h-3 w-3' />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead className='hidden md:table-cell'>Event</TableHead>
                  <TableHead className='hidden lg:table-cell'>
                    <button
                      className='flex items-center gap-1 hover:text-primary'
                      onClick={() => toggleSort('availableQuantity')}
                    >
                      Available
                      {sortField === 'availableQuantity' &&
                        (sortDirection === 'asc' ? (
                          <ArrowUp className='h-3 w-3' />
                        ) : (
                          <ArrowDown className='h-3 w-3' />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTickets.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className='text-center py-8 text-gray-500'
                    >
                      No ticket types found. Try a different search or filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentTickets.map((ticket) => (
                    <TableRow key={ticket.id} className='table-row-hover'>
                      <TableCell className='font-medium'>
                        <div className='flex items-center gap-2'>
                          <Ticket className='h-4 w-4 text-primary' />
                          {ticket.name}
                        </div>
                      </TableCell>
                      <TableCell>₹{ticket.price.toLocaleString()}</TableCell>
                      <TableCell className='hidden md:table-cell'>
                        {ticket.eventName}
                      </TableCell>
                      <TableCell className='hidden lg:table-cell'>
                        {ticket.availableQuantity}/{ticket.totalQuantity}
                      </TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() => handleEditTicket(ticket)}
                            >
                              <Edit className='h-4 w-4 mr-2' /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicateTicket(ticket)}
                            >
                              <Copy className='h-4 w-4 mr-2' /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteTicket(ticket)}
                              className='text-red-600 focus:text-red-600'
                            >
                              <Trash2 className='h-4 w-4 mr-2' /> Delete
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
              totalItems={filteredTickets.length}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setItemsPerPage}
              showingText='tickets'
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>
              {selectedTicket?.id.startsWith('new-')
                ? 'Create New Ticket Type'
                : 'Edit Ticket Type'}
            </DialogTitle>
            <DialogDescription>
              {selectedTicket?.id.startsWith('new-')
                ? 'Add details for the new ticket type'
                : `Make changes to the "${selectedTicket?.name}" ticket type`}
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='ticketName'>Ticket Name</Label>
                  <Input
                    id='ticketName'
                    value={selectedTicket.name}
                    onChange={(e) =>
                      setSelectedTicket({
                        ...selectedTicket,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='ticketPrice'>Price (₹)</Label>
                  <Input
                    id='ticketPrice'
                    type='number'
                    value={selectedTicket.price}
                    onChange={(e) =>
                      setSelectedTicket({
                        ...selectedTicket,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='eventName'>Event</Label>
                  <Select
                    value={selectedTicket.eventName}
                    onValueChange={(value) =>
                      setSelectedTicket({ ...selectedTicket, eventName: value })
                    }
                  >
                    <SelectTrigger id='eventName'>
                      <SelectValue placeholder='Select event' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Summer Music Festival'>
                        Summer Music Festival
                      </SelectItem>
                      <SelectItem value='Tech Conference 2025'>
                        Tech Conference 2025
                      </SelectItem>
                      <SelectItem value='Food & Wine Expo'>
                        Food & Wine Expo
                      </SelectItem>
                      <SelectItem value='Comedy Night'>Comedy Night</SelectItem>
                      <SelectItem value='Tech Workshop'>
                        Tech Workshop
                      </SelectItem>
                      <SelectItem value='Art Exhibition'>
                        Art Exhibition
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='ticketStatus'>Status</Label>
                  <Select
                    value={selectedTicket.status}
                    onValueChange={(value: any) =>
                      setSelectedTicket({ ...selectedTicket, status: value })
                    }
                  >
                    <SelectTrigger id='ticketStatus'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='sold_out'>Sold Out</SelectItem>
                      <SelectItem value='inactive'>Inactive</SelectItem>
                      <SelectItem value='draft'>Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='totalQuantity'>Total Quantity</Label>
                  <Input
                    id='totalQuantity'
                    type='number'
                    value={selectedTicket.totalQuantity}
                    onChange={(e) =>
                      setSelectedTicket({
                        ...selectedTicket,
                        totalQuantity: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='availableQuantity'>Available Quantity</Label>
                  <Input
                    id='availableQuantity'
                    type='number'
                    value={selectedTicket.availableQuantity}
                    onChange={(e) =>
                      setSelectedTicket({
                        ...selectedTicket,
                        availableQuantity: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='startDate'>Start Date</Label>
                  <Input
                    id='startDate'
                    type='date'
                    value={selectedTicket.startDate}
                    onChange={(e) =>
                      setSelectedTicket({
                        ...selectedTicket,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='endDate'>End Date</Label>
                  <Input
                    id='endDate'
                    type='date'
                    value={selectedTicket.endDate}
                    onChange={(e) =>
                      setSelectedTicket({
                        ...selectedTicket,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='category'>Category</Label>
                <Select
                  value={selectedTicket.category}
                  onValueChange={(value) =>
                    setSelectedTicket({ ...selectedTicket, category: value })
                  }
                >
                  <SelectTrigger id='category'>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='standard'>Standard</SelectItem>
                    <SelectItem value='premium'>Premium</SelectItem>
                    <SelectItem value='discount'>Discount</SelectItem>
                    <SelectItem value='group'>Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  value={selectedTicket.description}
                  onChange={(e) =>
                    setSelectedTicket({
                      ...selectedTicket,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant='outline' onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTicket} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the ticket type "
              {selectedTicket?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={confirmDeleteTicket}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Deleting...
                </>
              ) : (
                'Delete Ticket'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketTypes;
