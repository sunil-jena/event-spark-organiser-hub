
import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Switch } from './switch';
import { Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  type: 'free' | 'paid' | 'donation';
  maxPerOrder: number;
  startSaleDate?: Date;
  endSaleDate?: Date;
  hideWhenUnavailable: boolean;
}

interface TicketManagerProps {
  tickets: TicketType[];
  onChange: (tickets: TicketType[]) => void;
}

export function TicketManager({ tickets, onChange }: TicketManagerProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const addTicketType = () => {
    const newTicket: TicketType = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      type: 'free',
      maxPerOrder: 10,
      hideWhenUnavailable: false
    };
    
    const updatedTickets = [...tickets, newTicket];
    onChange(updatedTickets);
    
    // Auto-expand the new ticket
    setExpanded({...expanded, [newTicket.id]: true});
  };

  const updateTicket = (id: string, field: keyof TicketType, value: any) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === id) {
        return { ...ticket, [field]: value };
      }
      return ticket;
    });
    
    onChange(updatedTickets);
  };

  const removeTicket = (id: string) => {
    onChange(tickets.filter(ticket => ticket.id !== id));
  };

  const toggleExpand = (id: string) => {
    setExpanded({...expanded, [id]: !expanded[id]});
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base">Ticket Types</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addTicketType}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Ticket Type
        </Button>
      </div>
      
      {tickets.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-md">
          <p className="text-muted-foreground">No ticket types added yet</p>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={addTicketType}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Ticket Type
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="border rounded-md shadow-sm overflow-hidden">
              <div 
                className="p-3 bg-muted flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(ticket.id)}
              >
                <div>
                  <h4 className="font-medium">
                    {ticket.name || "Untitled Ticket"}
                    {ticket.type === 'free' && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Free</span>}
                    {ticket.type === 'paid' && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">₹{ticket.price}</span>}
                    {ticket.type === 'donation' && <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Donation</span>}
                  </h4>
                  {ticket.quantity > 0 && (
                    <p className="text-sm text-muted-foreground">{ticket.quantity} tickets available</p>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTicket(ticket.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              
              {expanded[ticket.id] && (
                <div className="p-4 space-y-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`ticket-name-${ticket.id}`}>Ticket Name</Label>
                      <Input
                        id={`ticket-name-${ticket.id}`}
                        value={ticket.name}
                        onChange={(e) => updateTicket(ticket.id, 'name', e.target.value)}
                        placeholder="e.g. General Admission"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`ticket-type-${ticket.id}`}>Ticket Type</Label>
                      <Select
                        value={ticket.type}
                        onValueChange={(value) => updateTicket(ticket.id, 'type', value)}
                      >
                        <SelectTrigger id={`ticket-type-${ticket.id}`}>
                          <SelectValue placeholder="Select ticket type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="donation">Donation-based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`ticket-desc-${ticket.id}`}>Description</Label>
                    <Textarea
                      id={`ticket-desc-${ticket.id}`}
                      value={ticket.description}
                      onChange={(e) => updateTicket(ticket.id, 'description', e.target.value)}
                      placeholder="Describe what's included with this ticket"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ticket.type === 'paid' && (
                      <div>
                        <Label htmlFor={`ticket-price-${ticket.id}`}>Price (₹)</Label>
                        <Input
                          id={`ticket-price-${ticket.id}`}
                          type="number"
                          min="0"
                          value={ticket.price}
                          onChange={(e) => updateTicket(ticket.id, 'price', parseFloat(e.target.value))}
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor={`ticket-quantity-${ticket.id}`}>Quantity Available</Label>
                      <Input
                        id={`ticket-quantity-${ticket.id}`}
                        type="number"
                        min="0"
                        value={ticket.quantity}
                        onChange={(e) => updateTicket(ticket.id, 'quantity', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`ticket-max-${ticket.id}`}>Maximum Tickets Per Order</Label>
                    <Input
                      id={`ticket-max-${ticket.id}`}
                      type="number"
                      min="1"
                      value={ticket.maxPerOrder}
                      onChange={(e) => updateTicket(ticket.id, 'maxPerOrder', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`ticket-hide-${ticket.id}`}
                      checked={ticket.hideWhenUnavailable}
                      onCheckedChange={(checked) => updateTicket(ticket.id, 'hideWhenUnavailable', checked)}
                    />
                    <Label htmlFor={`ticket-hide-${ticket.id}`}>Hide when sold out</Label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
