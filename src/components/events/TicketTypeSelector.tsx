
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Ticket, CreditCard, Trash2, Edit2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { EventLocation } from './CreateEventForm';
import { EventDateTime } from './EventDateTimeSelector';

export interface TicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  maxPerOrder?: number;
  saleStartDate?: Date;
  saleEndDate?: Date;
  dateTimeIds: string[]; // Associated date/time IDs
  locationIds: string[]; // Associated location IDs
  isEarlyBird?: boolean;
  isVIP?: boolean;
}

interface TicketTypeSelectorProps {
  value: TicketType[];
  onChange: (tickets: TicketType[]) => void;
  dateTimeList?: EventDateTime[];
  locations?: EventLocation[];
}

const initialTicketState: TicketType = {
  id: '',
  name: '',
  description: '',
  price: 0,
  currency: 'USD',
  quantity: 100,
  dateTimeIds: [],
  locationIds: [],
};

export const TicketTypeSelector: React.FC<TicketTypeSelectorProps> = ({ 
  value, 
  onChange,
  dateTimeList = [],
  locations = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTicket, setNewTicket] = useState<TicketType>({
    ...initialTicketState,
    id: uuidv4()
  });
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
  const [applyToAllDateTimes, setApplyToAllDateTimes] = useState(true);
  const [applyToAllLocations, setApplyToAllLocations] = useState(true);

  const resetForm = () => {
    setNewTicket({
      ...initialTicketState,
      id: uuidv4()
    });
    setApplyToAllDateTimes(true);
    setApplyToAllLocations(true);
  };

  const handleAddTicket = () => {
    // Validate ticket
    if (!newTicket.name || newTicket.price <= 0 || newTicket.quantity <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required ticket fields with valid values",
        variant: "destructive",
      });
      return;
    }

    // Apply to all date/times if selected, or validate that at least one is selected
    if (applyToAllDateTimes) {
      newTicket.dateTimeIds = dateTimeList.map(dt => dt.id);
    } else if (newTicket.dateTimeIds.length === 0 && dateTimeList.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one date/time for this ticket",
        variant: "destructive",
      });
      return;
    }

    // Apply to all locations if selected, or validate that at least one is selected
    if (applyToAllLocations) {
      newTicket.locationIds = locations.map(loc => loc.id);
    } else if (newTicket.locationIds.length === 0 && locations.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one location for this ticket",
        variant: "destructive",
      });
      return;
    }

    onChange([...value, newTicket]);
    resetForm();
    setIsOpen(false);
  };

  const handleUpdateTicket = () => {
    if (!editingTicket) return;
    
    // Validate ticket
    if (!editingTicket.name || editingTicket.price <= 0 || editingTicket.quantity <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required ticket fields with valid values",
        variant: "destructive",
      });
      return;
    }

    const updatedTickets = value.map(ticket => 
      ticket.id === editingTicket.id ? editingTicket : ticket
    );
    
    onChange(updatedTickets);
    setEditingTicket(null);
  };

  const removeTicket = (id: string) => {
    onChange(value.filter(ticket => ticket.id !== id));
  };

  const handleEditTicket = (ticket: TicketType) => {
    setEditingTicket(ticket);
  };

  // Format currency to display
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Format associated date/times for display
  const formatAssociatedDateTimes = (dateTimeIds: string[]) => {
    if (dateTimeIds.length === dateTimeList.length) {
      return 'All dates and times';
    }
    
    return `${dateTimeIds.length} date/time${dateTimeIds.length !== 1 ? 's' : ''}`;
  };

  // Format associated locations for display
  const formatAssociatedLocations = (locationIds: string[]) => {
    if (locationIds.length === locations.length) {
      return 'All locations';
    }
    
    return `${locationIds.length} location${locationIds.length !== 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Ticket Types</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              type="button" 
              className="flex items-center gap-2"
              disabled={dateTimeList.length === 0 || locations.length === 0}
            >
              <Ticket className="h-4 w-4" /> Add Ticket Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Ticket Type</DialogTitle>
              <DialogDescription>
                Create a new ticket type for your event.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticketName">Ticket Name *</Label>
                  <Input
                    id="ticketName"
                    value={newTicket.name}
                    onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                    placeholder="E.g., General Admission, VIP"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ticketPrice">Price *</Label>
                  <div className="flex gap-2">
                    <Select
                      value={newTicket.currency}
                      onValueChange={(value) => setNewTicket({ ...newTicket, currency: value })}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      id="ticketPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newTicket.price || ''}
                      onChange={(e) => setNewTicket({ ...newTicket, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ticketDescription">Description</Label>
                <Textarea
                  id="ticketDescription"
                  value={newTicket.description || ''}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Describe what this ticket includes..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticketQuantity">Quantity Available *</Label>
                  <Input
                    id="ticketQuantity"
                    type="number"
                    min="1"
                    value={newTicket.quantity || ''}
                    onChange={(e) => setNewTicket({ ...newTicket, quantity: parseInt(e.target.value) || 0 })}
                    placeholder="Number of tickets"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxPerOrder">Max Per Order</Label>
                  <Input
                    id="maxPerOrder"
                    type="number"
                    min="1"
                    value={newTicket.maxPerOrder || ''}
                    onChange={(e) => setNewTicket({ ...newTicket, maxPerOrder: parseInt(e.target.value) || undefined })}
                    placeholder="Leave blank for no limit"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isVIP" 
                    checked={newTicket.isVIP || false}
                    onCheckedChange={(checked) => 
                      setNewTicket({ ...newTicket, isVIP: checked === true })
                    }
                  />
                  <Label htmlFor="isVIP">VIP Ticket</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isEarlyBird" 
                    checked={newTicket.isEarlyBird || false}
                    onCheckedChange={(checked) => 
                      setNewTicket({ ...newTicket, isEarlyBird: checked === true })
                    }
                  />
                  <Label htmlFor="isEarlyBird">Early Bird Pricing</Label>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Date and Time Availability</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="applyToAllDateTimes" 
                      checked={applyToAllDateTimes}
                      onCheckedChange={(checked) => {
                        setApplyToAllDateTimes(checked === true);
                        if (checked) {
                          setNewTicket({ ...newTicket, dateTimeIds: dateTimeList.map(dt => dt.id) });
                        } else {
                          setNewTicket({ ...newTicket, dateTimeIds: [] });
                        }
                      }}
                    />
                    <Label htmlFor="applyToAllDateTimes">Apply to all dates and times</Label>
                  </div>
                  
                  {!applyToAllDateTimes && dateTimeList.length > 0 && (
                    <div className="pl-7 space-y-3">
                      {dateTimeList.map((dateTime) => (
                        <div key={dateTime.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`dateTime-${dateTime.id}`} 
                            checked={newTicket.dateTimeIds.includes(dateTime.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewTicket({ 
                                  ...newTicket, 
                                  dateTimeIds: [...newTicket.dateTimeIds, dateTime.id] 
                                });
                              } else {
                                setNewTicket({ 
                                  ...newTicket, 
                                  dateTimeIds: newTicket.dateTimeIds.filter(id => id !== dateTime.id) 
                                });
                              }
                            }}
                          />
                          <Label htmlFor={`dateTime-${dateTime.id}`} className="text-sm">
                            {format(dateTime.startDate, 'MMM d, yyyy')} {dateTime.startTime}-{dateTime.endTime}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-2">
                <h4 className="font-medium mb-2">Location Availability</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="applyToAllLocations" 
                      checked={applyToAllLocations}
                      onCheckedChange={(checked) => {
                        setApplyToAllLocations(checked === true);
                        if (checked) {
                          setNewTicket({ ...newTicket, locationIds: locations.map(loc => loc.id) });
                        } else {
                          setNewTicket({ ...newTicket, locationIds: [] });
                        }
                      }}
                    />
                    <Label htmlFor="applyToAllLocations">Apply to all locations</Label>
                  </div>
                  
                  {!applyToAllLocations && locations.length > 0 && (
                    <div className="pl-7 space-y-3">
                      {locations.map((location) => (
                        <div key={location.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`location-${location.id}`} 
                            checked={newTicket.locationIds.includes(location.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewTicket({ 
                                  ...newTicket, 
                                  locationIds: [...newTicket.locationIds, location.id] 
                                });
                              } else {
                                setNewTicket({ 
                                  ...newTicket, 
                                  locationIds: newTicket.locationIds.filter(id => id !== location.id) 
                                });
                              }
                            }}
                          />
                          <Label htmlFor={`location-${location.id}`} className="text-sm">
                            {location.name}, {location.city}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleAddTicket}>Add Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={!!editingTicket} onOpenChange={(open) => !open && setEditingTicket(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Ticket Type</DialogTitle>
            <DialogDescription>
              Update this ticket type for your event.
            </DialogDescription>
          </DialogHeader>
          
          {editingTicket && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editTicketName">Ticket Name *</Label>
                  <Input
                    id="editTicketName"
                    value={editingTicket.name}
                    onChange={(e) => setEditingTicket({ ...editingTicket, name: e.target.value })}
                    placeholder="E.g., General Admission, VIP"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editTicketPrice">Price *</Label>
                  <div className="flex gap-2">
                    <Select
                      value={editingTicket.currency}
                      onValueChange={(value) => setEditingTicket({ ...editingTicket, currency: value })}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      id="editTicketPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editingTicket.price || ''}
                      onChange={(e) => setEditingTicket({ ...editingTicket, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editTicketDescription">Description</Label>
                <Textarea
                  id="editTicketDescription"
                  value={editingTicket.description || ''}
                  onChange={(e) => setEditingTicket({ ...editingTicket, description: e.target.value })}
                  placeholder="Describe what this ticket includes..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editTicketQuantity">Quantity Available *</Label>
                  <Input
                    id="editTicketQuantity"
                    type="number"
                    min="1"
                    value={editingTicket.quantity || ''}
                    onChange={(e) => setEditingTicket({ ...editingTicket, quantity: parseInt(e.target.value) || 0 })}
                    placeholder="Number of tickets"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editMaxPerOrder">Max Per Order</Label>
                  <Input
                    id="editMaxPerOrder"
                    type="number"
                    min="1"
                    value={editingTicket.maxPerOrder || ''}
                    onChange={(e) => setEditingTicket({ ...editingTicket, maxPerOrder: parseInt(e.target.value) || undefined })}
                    placeholder="Leave blank for no limit"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="editIsVIP" 
                    checked={editingTicket.isVIP || false}
                    onCheckedChange={(checked) => 
                      setEditingTicket({ ...editingTicket, isVIP: checked === true })
                    }
                  />
                  <Label htmlFor="editIsVIP">VIP Ticket</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="editIsEarlyBird" 
                    checked={editingTicket.isEarlyBird || false}
                    onCheckedChange={(checked) => 
                      setEditingTicket({ ...editingTicket, isEarlyBird: checked === true })
                    }
                  />
                  <Label htmlFor="editIsEarlyBird">Early Bird Pricing</Label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleUpdateTicket}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Ticket Type List */}
      {value.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
          <Ticket className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-500">No ticket types added yet</p>
          <p className="text-sm text-gray-400 mt-1">Add at least one ticket type for your event</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {value.map((ticket) => (
            <Card key={ticket.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold flex items-center">
                        {ticket.name}
                        {ticket.isVIP && <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">VIP</span>}
                        {ticket.isEarlyBird && <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Early Bird</span>}
                      </h4>
                      <p className="text-lg font-bold text-primary mt-1">
                        {formatCurrency(ticket.price, ticket.currency)}
                      </p>
                      {ticket.description && (
                        <p className="text-sm text-gray-600 mt-2">{ticket.description}</p>
                      )}
                    </div>
                    <div className="text-sm text-right">
                      <span className="font-medium">{ticket.quantity}</span> available
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Dates:</span> {formatAssociatedDateTimes(ticket.dateTimeIds)}
                    </div>
                    <div>
                      <span className="font-medium">Locations:</span> {formatAssociatedLocations(ticket.locationIds)}
                    </div>
                  </div>
                </div>
                <div className="flex border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 rounded-none h-10"
                    onClick={() => handleEditTicket(ticket)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <div className="border-r" />
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 rounded-none h-10 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeTicket(ticket.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
