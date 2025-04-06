
import React, { useState } from 'react';
import { PlusCircle, Trash2, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  type: 'paid' | 'free' | 'donation';
  isFeatured: boolean;
}

interface TicketTypeSelectorProps {
  value: TicketType[];
  onChange: (value: TicketType[]) => void;
}

export const TicketTypeSelector: React.FC<TicketTypeSelectorProps> = ({
  value,
  onChange
}) => {
  const [ticketName, setTicketName] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketType, setTicketType] = useState<'paid' | 'free' | 'donation'>('paid');
  const [isFeatured, setIsFeatured] = useState(false);

  const generateId = () => `ticket-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const handleAddTicket = () => {
    if (!ticketName || !ticketQuantity) return;

    const price = ticketType === 'free' ? 0 : parseFloat(ticketPrice) || 0;

    const newTicket: TicketType = {
      id: generateId(),
      name: ticketName,
      price,
      quantity: parseInt(ticketQuantity, 10),
      description: ticketDescription,
      type: ticketType,
      isFeatured
    };

    onChange([...value, newTicket]);

    // Reset form
    setTicketName('');
    setTicketPrice('');
    setTicketQuantity('');
    setTicketDescription('');
    setTicketType('paid');
    setIsFeatured(false);
  };

  const handleRemoveTicket = (id: string) => {
    onChange(value.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Ticket Types</h3>
      
      {/* Add new ticket form */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ticket-name">Ticket Name</Label>
              <Input
                id="ticket-name"
                placeholder="e.g. General Admission"
                value={ticketName}
                onChange={(e) => setTicketName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticket-type">Ticket Type</Label>
              <Select 
                value={ticketType} 
                onValueChange={(value) => setTicketType(value as 'paid' | 'free' | 'donation')}
              >
                <SelectTrigger id="ticket-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {ticketType !== 'free' && (
              <div className="space-y-2">
                <Label htmlFor="ticket-price">Price ($)</Label>
                <Input
                  id="ticket-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="ticket-quantity">Quantity Available</Label>
              <Input
                id="ticket-quantity"
                type="number"
                min="1"
                placeholder="100"
                value={ticketQuantity}
                onChange={(e) => setTicketQuantity(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ticket-description">Description (Optional)</Label>
              <Textarea
                id="ticket-description"
                placeholder="Describe what's included with this ticket"
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                id="featured-ticket"
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
              />
              <Label htmlFor="featured-ticket">Featured Ticket</Label>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleAddTicket}
                disabled={!ticketName || !ticketQuantity || (ticketType !== 'free' && !ticketPrice)}
                className="mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Ticket Type
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Display added tickets */}
      {value.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500">Added Ticket Types</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {value.map((ticket) => (
              <Card key={ticket.id} className={cn(
                "overflow-hidden",
                ticket.isFeatured && "border-primary"
              )}>
                <CardContent className="p-0">
                  <div className={cn(
                    "p-3 border-b flex justify-between items-center",
                    ticket.isFeatured ? "bg-primary/10" : "bg-gray-50"
                  )}>
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4" />
                      <div className="font-medium">{ticket.name}</div>
                      {ticket.isFeatured && (
                        <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveTicket(ticket.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Price:</span>
                      <span className="font-medium">
                        {ticket.type === 'free' ? 'Free' : 
                         ticket.type === 'donation' ? 'Donation' : 
                         `$${ticket.price.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Quantity:</span>
                      <span className="font-medium">{ticket.quantity}</span>
                    </div>
                    {ticket.description && (
                      <div className="text-sm text-gray-600 mt-2 border-t pt-2">
                        {ticket.description}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for managing className concatenation
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
