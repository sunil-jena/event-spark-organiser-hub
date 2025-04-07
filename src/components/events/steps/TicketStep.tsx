
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Ticket, Plus, Trash2, CalendarRange, Tag, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DateFormValues } from './DateStep';
import { TimeSlotFormValues } from './TimeSlotStep';
import { VenueFormValues } from './VenueStep';

export interface TicketFormValues {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  ticketType: 'standard' | 'early-bird' | 'vip' | 'season-pass';
  isAllDates: boolean;
  availableDateIds: string[];
  isAllTimeSlots: boolean;
  availableTimeSlotIds: string[];
  isLimited: boolean;
  saleStartDate?: Date;
  saleEndDate?: Date;
}

interface TicketStepProps {
  tickets: TicketFormValues[];
  dates: DateFormValues[];
  timeSlots: TimeSlotFormValues[];
  venues: VenueFormValues[];
  onSubmit: (tickets: TicketFormValues[]) => void;
  onBack: () => void;
}

export const TicketStep: React.FC<TicketStepProps> = ({ 
  tickets, 
  dates,
  timeSlots,
  venues,
  onSubmit, 
  onBack 
}) => {
  const [ticketList, setTicketList] = useState<TicketFormValues[]>(tickets);
  const [newTicket, setNewTicket] = useState<TicketFormValues>({
    id: uuidv4(),
    name: '',
    description: '',
    price: 0,
    quantity: 100,
    ticketType: 'standard',
    isAllDates: true,
    availableDateIds: [],
    isAllTimeSlots: true,
    availableTimeSlotIds: [],
    isLimited: false,
    saleStartDate: new Date(),
    saleEndDate: undefined
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateTicket = (ticket: TicketFormValues) => {
    const newErrors: Record<string, string> = {};
    
    if (!ticket.name) newErrors.name = 'Ticket name is required';
    if (ticket.price < 0) newErrors.price = 'Price cannot be negative';
    if (ticket.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    
    if (!ticket.isAllDates && ticket.availableDateIds.length === 0) {
      newErrors.availableDateIds = 'Please select at least one date';
    }
    
    if (!ticket.isAllTimeSlots && ticket.availableTimeSlotIds.length === 0) {
      newErrors.availableTimeSlotIds = 'Please select at least one time slot';
    }
    
    if (ticket.isLimited) {
      if (!ticket.saleStartDate) newErrors.saleStartDate = 'Sale start date is required';
      if (!ticket.saleEndDate) newErrors.saleEndDate = 'Sale end date is required';
      
      if (ticket.saleStartDate && ticket.saleEndDate && 
          ticket.saleEndDate < ticket.saleStartDate) {
        newErrors.saleEndDate = 'Sale end date must be after start date';
      }
    }
    
    return newErrors;
  };

  const handleAddTicket = () => {
    const validationErrors = validateTicket(newTicket);
    
    if (Object.keys(validationErrors).length === 0) {
      // If isAllDates is true, include all date ids
      const ticket = { ...newTicket };
      if (ticket.isAllDates) {
        ticket.availableDateIds = dates.map(d => d.id);
      }
      
      // If isAllTimeSlots is true, include all time slot ids
      if (ticket.isAllTimeSlots) {
        ticket.availableTimeSlotIds = timeSlots.map(t => t.id);
      }
      
      setTicketList([...ticketList, ticket]);
      setNewTicket({
        id: uuidv4(),
        name: '',
        description: '',
        price: 0,
        quantity: 100,
        ticketType: 'standard',
        isAllDates: true,
        availableDateIds: [],
        isAllTimeSlots: true,
        availableTimeSlotIds: [],
        isLimited: false,
        saleStartDate: new Date(),
        saleEndDate: undefined
      });
      setErrors({});
      
      toast({
        title: "Ticket added",
        description: "The ticket has been added to your event."
      });
    } else {
      setErrors(validationErrors);
      
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveTicket = (id: string) => {
    setTicketList(ticketList.filter(ticket => ticket.id !== id));
    
    toast({
      title: "Ticket removed",
      description: "The ticket has been removed from your event."
    });
  };

  const handleSubmit = () => {
    if (ticketList.length === 0) {
      toast({
        title: "No tickets added",
        description: "Please add at least one ticket for your event.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(ticketList);
  };

  const getTicketTypeLabel = (type: string) => {
    switch(type) {
      case 'standard': return 'Standard';
      case 'early-bird': return 'Early Bird';
      case 'vip': return 'VIP';
      case 'season-pass': return 'Season Pass';
      default: return type;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Event Tickets</h2>
        
        <div className="mb-6 border rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium mb-3 flex items-center">
            <Ticket className="h-4 w-4 mr-2" />
            Add New Ticket
          </h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ticketName">Ticket Name</Label>
              <Input
                id="ticketName"
                value={newTicket.name}
                onChange={(e) => setNewTicket({...newTicket, name: e.target.value})}
                placeholder="e.g. General Admission"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticketType">Ticket Type</Label>
              <Select
                value={newTicket.ticketType}
                onValueChange={(value: any) => setNewTicket({...newTicket, ticketType: value})}
              >
                <SelectTrigger id="ticketType">
                  <SelectValue placeholder="Select ticket type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="early-bird">Early Bird</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="season-pass">Season Pass</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticketPrice">Price ($)</Label>
              <Input
                id="ticketPrice"
                type="number"
                min="0"
                step="0.01"
                value={newTicket.price}
                onChange={(e) => setNewTicket({...newTicket, price: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticketQuantity">Quantity Available</Label>
              <Input
                id="ticketQuantity"
                type="number"
                min="1"
                value={newTicket.quantity}
                onChange={(e) => setNewTicket({...newTicket, quantity: parseInt(e.target.value) || 0})}
                placeholder="100"
                className={errors.quantity ? "border-red-500" : ""}
              />
              {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ticketDescription">Description (Optional)</Label>
              <Textarea
                id="ticketDescription"
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                placeholder="Describe what this ticket includes..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label className="flex items-center space-x-2 mb-2">
                <CalendarRange className="h-4 w-4" />
                <span>Date Availability</span>
              </Label>
              
              <div className="flex items-center space-x-2 mb-3">
                <Switch
                  checked={newTicket.isAllDates}
                  onCheckedChange={(checked) => setNewTicket({...newTicket, isAllDates: checked})}
                  id="allDates"
                />
                <Label htmlFor="allDates" className="cursor-pointer">
                  Available for all dates
                </Label>
              </div>
              
              {!newTicket.isAllDates && (
                <>
                  <div className="border rounded p-3 bg-white">
                    <Label className="mb-2 block">Select specific dates:</Label>
                    {dates.length > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {dates.map((date) => (
                          <div key={date.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`date-${date.id}`}
                              checked={newTicket.availableDateIds.includes(date.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewTicket({
                                    ...newTicket,
                                    availableDateIds: [...newTicket.availableDateIds, date.id]
                                  });
                                } else {
                                  setNewTicket({
                                    ...newTicket,
                                    availableDateIds: newTicket.availableDateIds.filter(id => id !== date.id)
                                  });
                                }
                              }}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor={`date-${date.id}`} className="cursor-pointer text-sm">
                              {date.type === 'single' ? format(date.startDate, 'PPP') :
                               date.type === 'range' ? `${format(date.startDate, 'PPP')} - ${format(date.endDate!, 'PPP')}` :
                               `Recurring from ${format(date.startDate, 'PPP')}`}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No dates available. Please add event dates first.</p>
                    )}
                  </div>
                  {errors.availableDateIds && <p className="text-red-500 text-sm mt-1">{errors.availableDateIds}</p>}
                </>
              )}
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4" />
                <span>Time Slot Availability</span>
              </Label>
              
              <div className="flex items-center space-x-2 mb-3">
                <Switch
                  checked={newTicket.isAllTimeSlots}
                  onCheckedChange={(checked) => setNewTicket({...newTicket, isAllTimeSlots: checked})}
                  id="allTimeSlots"
                />
                <Label htmlFor="allTimeSlots" className="cursor-pointer">
                  Available for all time slots
                </Label>
              </div>
              
              {!newTicket.isAllTimeSlots && (
                <>
                  <div className="border rounded p-3 bg-white">
                    <Label className="mb-2 block">Select specific time slots:</Label>
                    {timeSlots.length > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {timeSlots.map((slot) => {
                          const date = dates.find(d => d.id === slot.dateId);
                          const dateDisplay = date ? format(date.startDate, 'M/d/yyyy') : 'Unknown date';
                          
                          return (
                            <div key={slot.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`slot-${slot.id}`}
                                checked={newTicket.availableTimeSlotIds.includes(slot.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewTicket({
                                      ...newTicket,
                                      availableTimeSlotIds: [...newTicket.availableTimeSlotIds, slot.id]
                                    });
                                  } else {
                                    setNewTicket({
                                      ...newTicket,
                                      availableTimeSlotIds: newTicket.availableTimeSlotIds.filter(id => id !== slot.id)
                                    });
                                  }
                                }}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <Label htmlFor={`slot-${slot.id}`} className="cursor-pointer text-sm">
                                {dateDisplay} | {slot.startTime} - {slot.endTime}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No time slots available. Please add time slots first.</p>
                    )}
                  </div>
                  {errors.availableTimeSlotIds && <p className="text-red-500 text-sm mt-1">{errors.availableTimeSlotIds}</p>}
                </>
              )}
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label className="flex items-center space-x-2 mb-2">
                <Tag className="h-4 w-4" />
                <span>Limited Time Offer</span>
              </Label>
              
              <div className="flex items-center space-x-2 mb-3">
                <Switch
                  checked={newTicket.isLimited}
                  onCheckedChange={(checked) => setNewTicket({...newTicket, isLimited: checked})}
                  id="limitedOffer"
                />
                <Label htmlFor="limitedOffer" className="cursor-pointer">
                  Set ticket sale period
                </Label>
              </div>
              
              {newTicket.isLimited && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="saleStartDate">Sale Start Date</Label>
                    <input
                      type="date"
                      id="saleStartDate"
                      value={newTicket.saleStartDate ? format(newTicket.saleStartDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setNewTicket({
                            ...newTicket,
                            saleStartDate: new Date(e.target.value)
                          });
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded ${errors.saleStartDate ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.saleStartDate && <p className="text-red-500 text-sm">{errors.saleStartDate}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="saleEndDate">Sale End Date</Label>
                    <input
                      type="date"
                      id="saleEndDate"
                      value={newTicket.saleEndDate ? format(newTicket.saleEndDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setNewTicket({
                            ...newTicket,
                            saleEndDate: new Date(e.target.value)
                          });
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded ${errors.saleEndDate ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.saleEndDate && <p className="text-red-500 text-sm">{errors.saleEndDate}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Button
            onClick={handleAddTicket}
            className="mt-4 flex items-center"
            variant="secondary"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Ticket
          </Button>
        </div>
        
        {ticketList.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-3">Added Tickets</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {ticketList.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-3 bg-white flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{ticket.name}</h4>
                      <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                        {getTicketTypeLabel(ticket.ticketType)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">${ticket.price.toFixed(2)} • {ticket.quantity} available</p>
                    <p className="text-xs text-gray-500">
                      {ticket.isAllDates ? 'All dates' : `${ticket.availableDateIds.length} selected dates`} • 
                      {ticket.isAllTimeSlots ? ' All time slots' : ` ${ticket.availableTimeSlotIds.length} selected time slots`}
                    </p>
                    {ticket.isLimited && ticket.saleStartDate && ticket.saleEndDate && (
                      <p className="text-xs text-gray-500">
                        On sale: {format(ticket.saleStartDate, 'M/d/yyyy')} to {format(ticket.saleEndDate, 'M/d/yyyy')}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveTicket(ticket.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit}
            className="flex items-center"
          >
            Next: Media <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
