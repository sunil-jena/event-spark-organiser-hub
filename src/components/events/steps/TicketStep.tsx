
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChevronRight,
  PlusCircle,
  Trash2,
  CalendarRange,
  Tag,
  Clock,
  CircleDollarSign,
  ChevronsUpDown,
  Check,
  Info,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

// --- Type Definitions ---
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

export interface DateFormValues {
  id: string;
  startDate: Date;
  endDate?: Date;
  type: 'single' | 'range' | 'recurring';
  // … other fields as needed
}

export interface TimeSlotFormValues {
  id: string;
  startTime: string;
  endTime: string;
  dateId: string;
  // … other fields as needed
}

export interface VenueFormValues {
  id: string;
  name: string;
  city: string;
  tba?: boolean;
  // … other fields as needed
}

interface TicketConfiguratorProps {
  ticketTypes: TicketFormValues[];
  setTicketTypes: (types: TicketFormValues[]) => void;
  dates: DateFormValues[];
  timeSlots: TimeSlotFormValues[];
  venues: VenueFormValues[];
  onSubmit: (tickets: TicketFormValues[]) => void;
}

// --- Validation Schema for the New Ticket Form ---
const ticketValidationSchema = Yup.object().shape({
  name: Yup.string().required('Ticket name is required'),
  price: Yup.number().min(0, 'Price cannot be negative').required('Price is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  availableDateIds: Yup.array().when('isAllDates', {
    is: false,
    then: (schema) => schema.min(1, 'Please select at least one date'),
  }),
  availableTimeSlotIds: Yup.array().when('isAllTimeSlots', {
    is: false,
    then: (schema) => schema.min(1, 'Please select at least one time slot'),
  }),
  saleStartDate: Yup.date().when('isLimited', {
    is: true,
    then: (schema) => schema.required('Sale start date is required'),
  }),
  saleEndDate: Yup.date().when('isLimited', {
    is: true,
    then: (schema) => schema
      .required('Sale end date is required')
      .min(Yup.ref('saleStartDate'), 'Sale end date must be after sale start date'),
  }),
});

// --- Helper Function ---
const getTicketTypeLabel = (type: string) => {
  switch (type) {
    case 'standard': return 'Standard';
    case 'early-bird': return 'Early Bird';
    case 'vip': return 'VIP';
    case 'season-pass': return 'Season Pass';
    default: return type;
  }
};

const getTicketTypeDescription = (type: string) => {
  switch (type) {
    case 'standard': return 'Regular admission ticket';
    case 'early-bird': return 'Early access at a discounted price';
    case 'vip': return 'Premium access with special perks';
    case 'season-pass': return 'Full access for the entire season';
    default: return '';
  }
};

// --- Main Component ---
const TicketStep: React.FC<TicketConfiguratorProps> = ({
  ticketTypes,
  setTicketTypes,
  dates,
  timeSlots,
  venues,
  onSubmit,
}) => {
  // Local state for all tickets and for advanced configuration
  const [ticketList, setTicketList] = useState<TicketFormValues[]>(ticketTypes || []);
  const [useAdvancedConfig, setUseAdvancedConfig] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [activeTicketId, setActiveTicketId] = useState<string>(
    ticketList.length > 0 ? ticketList[0].id : ''
  );

  // Set active ticket when ticket list changes
  useEffect(() => {
    if (ticketList.length > 0 && !ticketList.find(t => t.id === activeTicketId)) {
      setActiveTicketId(ticketList[0].id);
    }
  }, [ticketList, activeTicketId]);

  // useFormik hook for the "Add New Ticket" form.
  const formik = useFormik<TicketFormValues>({
    initialValues: {
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
      saleEndDate: undefined,
    },
    validationSchema: ticketValidationSchema,
    onSubmit: (values, { resetForm }) => {
      // If the ticket applies to all dates/time slots, populate the arrays.
      const ticket: TicketFormValues = { ...values, id: uuidv4() };
      if (ticket.isAllDates) {
        ticket.availableDateIds = dates.map((d) => d.id);
      }
      if (ticket.isAllTimeSlots) {
        ticket.availableTimeSlotIds = timeSlots.map((t) => t.id);
      }

      // Format dates if they exist
      if (ticket.saleStartDate && typeof ticket.saleStartDate === 'string') {
        ticket.saleStartDate = new Date(ticket.saleStartDate);
      }
      if (ticket.saleEndDate && typeof ticket.saleEndDate === 'string') {
        ticket.saleEndDate = new Date(ticket.saleEndDate);
      }

      const updated = [...ticketList, ticket];
      setTicketList(updated);
      setTicketTypes(updated);
      setActiveTicketId(ticket.id);
      resetForm();
      toast({
        title: "Ticket added",
        description: "The ticket has been added to your event.",
      });
    },
  });

  // Update a ticket from the advanced configuration section.
  const updateTicketType = (id: string, field: keyof TicketFormValues, value: any) => {
    const updated = ticketList.map(ticket =>
      ticket.id === id ? { ...ticket, [field]: value } : ticket
    );
    setTicketList(updated);
    setTicketTypes(updated);
  };

  // Toggle specific date selection for the active ticket.
  const toggleDateForTicket = (date: DateFormValues) => {
    const ticket = ticketList.find(t => t.id === activeTicketId);
    if (!ticket) return;
    const exists = ticket.availableDateIds.includes(date.id);
    updateTicketType(
      activeTicketId,
      'availableDateIds',
      exists
        ? ticket.availableDateIds.filter(id => id !== date.id)
        : [...ticket.availableDateIds, date.id]
    );
  };

  // Toggle specific venue selection for the active ticket.
  const toggleVenueForTicket = (venue: VenueFormValues) => {
    const ticket = ticketList.find(t => t.id === activeTicketId);
    if (!ticket) return;
    // Simulate venue selection with availableDateIds for now
    const exists = ticket.availableDateIds.includes(venue.id);
    updateTicketType(
      activeTicketId,
      'availableDateIds',
      exists
        ? ticket.availableDateIds.filter(id => id !== venue.id)
        : [...ticket.availableDateIds, venue.id]
    );
  };

  // Toggle specific time slot selection for the active ticket.
  const toggleTimeSlotForTicket = (timeSlotId: string) => {
    const ticket = ticketList.find(t => t.id === activeTicketId);
    if (!ticket) return;
    const exists = ticket.availableTimeSlotIds.includes(timeSlotId);
    updateTicketType(
      activeTicketId,
      'availableTimeSlotIds',
      exists
        ? ticket.availableTimeSlotIds.filter(id => id !== timeSlotId)
        : [...ticket.availableTimeSlotIds, timeSlotId]
    );
  };

  // Delete a ticket
  const deleteTicket = (id: string) => {
    const updatedList = ticketList.filter(t => t.id !== id);
    setTicketList(updatedList);
    setTicketTypes(updatedList);

    if (updatedList.length > 0 && id === activeTicketId) {
      setActiveTicketId(updatedList[0].id);
    }
  };

  const totalValue = ticketList.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );

  // --- The active ticket for advanced configuration
  const activeTicket = ticketList.find(t => t.id === activeTicketId);

  // Handle form validation errors display
  const getFieldError = (fieldName: string) => {
    return formik.touched[fieldName as keyof TicketFormValues] && formik.errors[fieldName as keyof TicketFormValues]
      ? String(formik.errors[fieldName as keyof TicketFormValues])
      : null;
  };

  return (
    <div className="space-y-6">
      <Card className="border-brand-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <div>
            <CardTitle className="text-2xl font-bold text-brand-500">Ticket Types</CardTitle>
            <CardDescription className="text-muted-foreground">
              Configure the tickets available for your event
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="advanced-config"
                checked={useAdvancedConfig}
                onCheckedChange={setUseAdvancedConfig}
              />
              <Label htmlFor="advanced-config" className="text-sm">
                Advanced Configuration
              </Label>
            </div>
            <Button
              type="button"
              onClick={() => formik.handleSubmit()}
              className="flex items-center bg-brand-500 hover:bg-brand-600"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Ticket
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* New Ticket Form */}
          {(ticketList.length === 0 || !useAdvancedConfig) && (
            <form onSubmit={formik.handleSubmit} className="mb-6 border rounded-lg p-6 bg-brand-50">
              <h3 className="text-lg font-semibold text-brand-600 mb-4">Add a New Ticket</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-brand-700">Ticket Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. General Admission"
                    className={getFieldError('name') ? "border-destructive" : ""}
                  />
                  {getFieldError('name') && (
                    <p className="text-destructive text-xs mt-1">{getFieldError('name')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticketType" className="text-brand-700">Ticket Type *</Label>
                  <Select
                    value={formik.values.ticketType}
                    onValueChange={(value) => formik.setFieldValue('ticketType', value)}
                  >
                    <SelectTrigger id="ticketType" className="w-full">
                      <SelectValue placeholder="Select ticket type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="early-bird">Early Bird</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="season-pass">Season Pass</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getTicketTypeDescription(formik.values.ticketType)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-brand-700">Price ($) *</Label>
                  <div className="relative">
                    <CircleDollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="0.00"
                      className={`pl-8 ${getFieldError('price') ? "border-destructive" : ""}`}
                    />
                  </div>
                  {getFieldError('price') && (
                    <p className="text-destructive text-xs mt-1">{getFieldError('price')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-brand-700">Quantity Available *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="100"
                    className={getFieldError('quantity') ? "border-destructive" : ""}
                  />
                  {getFieldError('quantity') && (
                    <p className="text-destructive text-xs mt-1">{getFieldError('quantity')}</p>
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description" className="text-brand-700">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    placeholder="Describe what this ticket includes..."
                    rows={3}
                  />
                </div>

                <div className="space-y-4 sm:col-span-2">
                  <Separator className="my-4" />
                  <h4 className="font-medium text-brand-600">Availability Settings</h4>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label className="flex items-center space-x-2 mb-2 text-brand-700">
                    <CalendarRange className="h-4 w-4 text-brand-400" />
                    <span>Date Availability</span>
                  </Label>
                  <div className="flex items-center space-x-2 mb-3">
                    <Switch
                      id="isAllDates"
                      checked={formik.values.isAllDates}
                      onCheckedChange={(checked) => formik.setFieldValue('isAllDates', checked)}
                    />
                    <Label htmlFor="isAllDates" className="cursor-pointer">
                      Apply to all dates
                    </Label>
                  </div>

                  {!formik.values.isAllDates && dates.length > 0 && (
                    <div className="pl-8 pt-2">
                      <div className="grid grid-cols-2 gap-2">
                        {dates.map((date) => (
                          <div key={date.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`date-${date.id}`}
                              checked={formik.values.availableDateIds.includes(date.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  formik.setFieldValue('availableDateIds', [...formik.values.availableDateIds, date.id]);
                                } else {
                                  formik.setFieldValue(
                                    'availableDateIds',
                                    formik.values.availableDateIds.filter(id => id !== date.id)
                                  );
                                }
                              }}
                            />
                            <Label htmlFor={`date-${date.id}`} className="text-sm">
                              {format(date.startDate, 'PPP')}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {getFieldError('availableDateIds') && (
                        <p className="text-destructive text-xs mt-1">{getFieldError('availableDateIds')}</p>
                      )}
                    </div>
                  )}

                  {!formik.values.isAllDates && dates.length === 0 && (
                    <div className="pl-8 pt-2">
                      <p className="text-amber-600 text-sm bg-amber-50 p-2 rounded">
                        You need to add event dates first to select specific dates.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label className="flex items-center space-x-2 mb-2 text-brand-700">
                    <Clock className="h-4 w-4 text-brand-400" />
                    <span>Time Slot Availability</span>
                  </Label>
                  <div className="flex items-center space-x-2 mb-3">
                    <Switch
                      id="isAllTimeSlots"
                      checked={formik.values.isAllTimeSlots}
                      onCheckedChange={(checked) => formik.setFieldValue('isAllTimeSlots', checked)}
                    />
                    <Label htmlFor="isAllTimeSlots" className="cursor-pointer">
                      Apply to all time slots
                    </Label>
                  </div>

                  {!formik.values.isAllTimeSlots && timeSlots.length > 0 && (
                    <div className="pl-8 pt-2">
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => {
                          const date = dates.find(d => d.id === slot.dateId);
                          const dateDisplay = date ? format(date.startDate, 'M/d/yyyy') : 'Unknown date';

                          return (
                            <div key={slot.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`slot-${slot.id}`}
                                checked={formik.values.availableTimeSlotIds.includes(slot.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    formik.setFieldValue('availableTimeSlotIds', [...formik.values.availableTimeSlotIds, slot.id]);
                                  } else {
                                    formik.setFieldValue(
                                      'availableTimeSlotIds',
                                      formik.values.availableTimeSlotIds.filter(id => id !== slot.id)
                                    );
                                  }
                                }}
                              />
                              <Label htmlFor={`slot-${slot.id}`} className="text-sm">
                                {dateDisplay} | {slot.startTime} - {slot.endTime}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                      {getFieldError('availableTimeSlotIds') && (
                        <p className="text-destructive text-xs mt-1">{getFieldError('availableTimeSlotIds')}</p>
                      )}
                    </div>
                  )}

                  {!formik.values.isAllTimeSlots && timeSlots.length === 0 && (
                    <div className="pl-8 pt-2">
                      <p className="text-amber-600 text-sm bg-amber-50 p-2 rounded">
                        You need to add time slots first to select specific time slots.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label className="flex items-center space-x-2 mb-2 text-brand-700">
                    <Tag className="h-4 w-4 text-brand-400" />
                    <span>Limited Time Offer</span>
                  </Label>
                  <div className="flex items-center space-x-2 mb-3">
                    <Switch
                      id="isLimited"
                      checked={formik.values.isLimited}
                      onCheckedChange={(checked) => formik.setFieldValue('isLimited', checked)}
                    />
                    <Label htmlFor="isLimited" className="cursor-pointer">
                      Set sale period
                    </Label>
                  </div>
                  {formik.values.isLimited && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                      <div className="space-y-2">
                        <Label htmlFor="saleStartDate">Sale Start Date</Label>
                        <Input
                          id="saleStartDate"
                          name="saleStartDate"
                          type="date"
                          value={formik.values.saleStartDate ? format(new Date(formik.values.saleStartDate), 'yyyy-MM-dd') : ''}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={getFieldError('saleStartDate') ? "border-destructive" : ""}
                        />
                        {getFieldError('saleStartDate') && (
                          <p className="text-destructive text-xs mt-1">{getFieldError('saleStartDate')}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="saleEndDate">Sale End Date</Label>
                        <Input
                          id="saleEndDate"
                          name="saleEndDate"
                          type="date"
                          value={formik.values.saleEndDate ? format(new Date(formik.values.saleEndDate), 'yyyy-MM-dd') : ''}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={getFieldError('saleEndDate') ? "border-destructive" : ""}
                        />
                        {getFieldError('saleEndDate') && (
                          <p className="text-destructive text-xs mt-1">{getFieldError('saleEndDate')}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 flex items-center"
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Ticket
                </Button>
              </div>
            </form>
          )}

          {/* If tickets have been added, show the ticket list and advanced configuration */}
          {ticketList.length > 0 && (
            <>
              {/* Simple table view */}
              {!useAdvancedConfig ? (
                <Card className="mt-6 border-brand-200">
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg font-semibold text-brand-500">Added Tickets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader className="bg-primary">
                        <TableRow>
                          <TableHead className="w-[40%] text-white">Name</TableHead>
                          <TableHead className="w-[20%] text-white">Price</TableHead>
                          <TableHead className="w-[20%] text-white">Quantity</TableHead>
                          <TableHead className="w-[15%] text-white">Value</TableHead>
                          <TableHead className="w-[5%] text-white"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ticketList.map(ticket => (
                          <TableRow key={ticket.id} className="hover:bg-brand-50/50">
                            <TableCell>
                              <div className="font-medium">{ticket.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {getTicketTypeLabel(ticket.ticketType)}
                              </div>
                            </TableCell>
                            <TableCell>${ticket.price.toFixed(2)}</TableCell>
                            <TableCell>{ticket.quantity}</TableCell>
                            <TableCell className="font-medium">
                              ${(ticket.price * ticket.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteTicket(ticket.id)}
                                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete this ticket</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow className="bg-brand-50/70">
                          <TableCell colSpan={3} className="text-right font-medium">
                            Total Value:
                          </TableCell>
                          <TableCell className="font-bold text-brand-700">
                            ${totalValue.toFixed(2)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                // Advanced configuration view for the active ticket
                <div className="mt-6 flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <h3 className="text-lg font-semibold text-primary mb-4">Ticket List</h3>
                    <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                      {ticketList.map(ticket => (
                        <div
                          key={ticket.id}
                          className={`flex justify-between items-center p-3 rounded-md cursor-pointer border transition-all ${ticket.id === activeTicketId
                            ? 'bg-brand-500  border-primary shadow-md'
                            : 'hover:bg-primary border-brand-100'
                            } text-primary`}
                          onClick={() => setActiveTicketId(ticket.id)}
                        >
                          <div>
                            <div className="font-medium">{ticket.name}</div>
                            <div className={`text-xs ${ticket.id === activeTicketId ? 'text-white/80' : 'text-muted-foreground'}`}>
                              {getTicketTypeLabel(ticket.ticketType)} · ${ticket.price} × {ticket.quantity}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-primary">
                            <Badge variant={ticket.id === activeTicketId ? "outline" : "secondary"} className="font-semibold">
                              ${(ticket.price * ticket.quantity).toFixed(2)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTicket(ticket.id);
                              }}
                              className={`h-7 w-7 p-0 ${ticket.id === activeTicketId
                                ? 'text-white/80 hover:text-white hover:bg-white/10'
                                : 'text-destructive hover:bg-destructive/10 hover:text-destructive'
                                }`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="w-full bg-brand-50 hover:bg-brand-100 border-brand-200 text-brand-700"
                        onClick={() => {
                          setUseAdvancedConfig(false);
                          formik.resetForm();
                        }}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Another Ticket
                      </Button>
                    </div>
                  </div>

                  {activeTicket && (
                    <div className="flex-1 border rounded-lg p-6 bg-white shadow-sm">
                      <h3 className="text-xl font-semibold text-brand-700 mb-4">
                        Edit {activeTicket.name}
                      </h3>
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="w-full mb-6 bg-gray-100">
                          <TabsTrigger value="general" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
                            General
                          </TabsTrigger>
                          <TabsTrigger value="dates" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
                            Dates
                          </TabsTrigger>
                          <TabsTrigger value="venues" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
                            Venues
                          </TabsTrigger>
                          <TabsTrigger value="timeslots" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
                            Time Slots
                          </TabsTrigger>
                        </TabsList>

                        {/* General Tab: Show current properties, allow editing via update functions */}
                        <TabsContent value="general" className="mt-0">
                          <div className="space-y-6 p-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="ticket-name-advanced" className="text-brand-700">Ticket Name</Label>
                                <Input
                                  id="ticket-name-advanced"
                                  value={activeTicket.name}
                                  onChange={(e) =>
                                    updateTicketType(activeTicket.id, 'name', e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="ticket-type-advanced" className="text-brand-700">Ticket Type</Label>
                                <Select
                                  value={activeTicket.ticketType}
                                  onValueChange={(value) =>
                                    updateTicketType(activeTicket.id, 'ticketType', value)
                                  }
                                >
                                  <SelectTrigger id="ticket-type-advanced">
                                    <SelectValue placeholder="Select ticket type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="standard">Standard</SelectItem>
                                    <SelectItem value="early-bird">Early Bird</SelectItem>
                                    <SelectItem value="vip">VIP</SelectItem>
                                    <SelectItem value="season-pass">Season Pass</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {getTicketTypeDescription(activeTicket.ticketType)}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="ticket-price-advanced" className="text-brand-700">Price</Label>
                                <div className="relative">
                                  <CircleDollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    id="ticket-price-advanced"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={activeTicket.price}
                                    onChange={(e) =>
                                      updateTicketType(activeTicket.id, 'price', parseFloat(e.target.value))
                                    }
                                    className="pl-8"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="ticket-quantity-advanced" className="text-brand-700">Quantity</Label>
                                <Input
                                  id="ticket-quantity-advanced"
                                  type="number"
                                  min="1"
                                  value={activeTicket.quantity}
                                  onChange={(e) =>
                                    updateTicketType(activeTicket.id, 'quantity', parseInt(e.target.value))
                                  }
                                />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="ticket-description-advanced" className="text-brand-700">Description</Label>
                                <Textarea
                                  id="ticket-description-advanced"
                                  value={activeTicket.description}
                                  onChange={(e) =>
                                    updateTicketType(activeTicket.id, 'description', e.target.value)
                                  }
                                  rows={3}
                                  placeholder="Describe what this ticket includes..."
                                />
                              </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                              <h4 className="font-medium text-brand-700 mb-4">Availability Settings</h4>

                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <CalendarRange className="h-4 w-4 text-brand-400" />
                                    <Label htmlFor="apply-all-dates" className="font-medium">
                                      Apply to all dates
                                    </Label>
                                  </div>
                                  <Switch
                                    id="apply-all-dates"
                                    checked={activeTicket.isAllDates}
                                    onCheckedChange={(checked) => {
                                      updateTicketType(activeTicket.id, 'isAllDates', checked);
                                      if (checked) {
                                        updateTicketType(
                                          activeTicket.id,
                                          'availableDateIds',
                                          dates.map(d => d.id)
                                        );
                                      }
                                    }}
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-brand-400" />
                                    <Label htmlFor="apply-all-timeslots" className="font-medium">
                                      Apply to all time slots
                                    </Label>
                                  </div>
                                  <Switch
                                    id="apply-all-timeslots"
                                    checked={activeTicket.isAllTimeSlots}
                                    onCheckedChange={(checked) => {
                                      updateTicketType(activeTicket.id, 'isAllTimeSlots', checked);
                                      if (checked) {
                                        updateTicketType(
                                          activeTicket.id,
                                          'availableTimeSlotIds',
                                          timeSlots.map(t => t.id)
                                        );
                                      }
                                    }}
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-brand-400" />
                                    <Label htmlFor="limited-time-offer" className="font-medium">
                                      Limited time offer
                                    </Label>
                                  </div>
                                  <Switch
                                    id="limited-time-offer"
                                    checked={activeTicket.isLimited}
                                    onCheckedChange={(checked) => {
                                      updateTicketType(activeTicket.id, 'isLimited', checked);
                                    }}
                                  />
                                </div>

                                {activeTicket.isLimited && (
                                  <div className="grid grid-cols-2 gap-4 pl-6 mt-2">
                                    <div className="space-y-2">
                                      <Label htmlFor="sale-start-date">Sale Start Date</Label>
                                      <Input
                                        id="sale-start-date"
                                        type="date"
                                        value={activeTicket.saleStartDate ? format(new Date(activeTicket.saleStartDate), 'yyyy-MM-dd') : ''}
                                        onChange={(e) => {
                                          updateTicketType(
                                            activeTicket.id,
                                            'saleStartDate',
                                            e.target.value ? new Date(e.target.value) : undefined
                                          );
                                        }}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="sale-end-date">Sale End Date</Label>
                                      <Input
                                        id="sale-end-date"
                                        type="date"
                                        value={activeTicket.saleEndDate ? format(new Date(activeTicket.saleEndDate), 'yyyy-MM-dd') : ''}
                                        onChange={(e) => {
                                          updateTicketType(
                                            activeTicket.id,
                                            'saleEndDate',
                                            e.target.value ? new Date(e.target.value) : undefined
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="border-t pt-4 flex justify-between items-center">
                              <div className="font-semibold text-brand-700">
                                Total Value: <span className="text-lg ml-1">${(activeTicket.price * activeTicket.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        {/* Applicable Dates Tab */}
                        <TabsContent value="dates" className="mt-0">
                          {dates.length === 0 ? (
                            <div className="bg-amber-50 text-amber-800 p-6 rounded-md flex items-center gap-3 border border-amber-200">
                              <Info className="h-5 w-5" />
                              <p>You need to add event dates first before you can select specific dates.</p>
                            </div>
                          ) : activeTicket.isAllDates ? (
                            <div className="bg-blue-50 text-blue-800 p-6 rounded-md flex items-center gap-3 border border-blue-200">
                              <Info className="h-5 w-5" />
                              <div>
                                <p className="font-medium">This ticket applies to all dates</p>
                                <p className="text-sm mt-1">Switch to the General tab and uncheck "Apply to all dates" to select specific dates.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2">
                              <p className="text-muted-foreground mb-4">Select the dates on which this ticket will be valid:</p>
                              <div className="flex flex-wrap gap-3">
                                {dates.map((date) => {
                                  const isSelected = activeTicket.availableDateIds.includes(date.id);
                                  return (
                                    <div
                                      key={date.id}
                                      onClick={() => toggleDateForTicket(date)}
                                      className={`px-4 py-3 rounded-md cursor-pointer border transition-all ${isSelected
                                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                                        : 'bg-background hover:bg-brand-50 border-input'
                                        }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <CalendarRange className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-brand-400'}`} />
                                        <div>
                                          <div className="font-medium">{format(date.startDate, 'EEEE')}</div>
                                          <div className={`text-sm ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                                            {format(date.startDate, 'MMMM d, yyyy')}
                                          </div>
                                        </div>
                                        {isSelected && <Check className="h-4 w-4 ml-2" />}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        {/* Applicable Venues Tab */}
                        <TabsContent value="venues" className="mt-0">
                          {venues.length === 0 ? (
                            <div className="bg-amber-50 text-amber-800 p-6 rounded-md flex items-center gap-3 border border-amber-200">
                              <Info className="h-5 w-5" />
                              <p>You need to add venues first before you can select specific venues.</p>
                            </div>
                          ) : activeTicket.isAllDates ? (
                            <div className="bg-blue-50 text-blue-800 p-6 rounded-md flex items-center gap-3 border border-blue-200">
                              <Info className="h-5 w-5" />
                              <div>
                                <p className="font-medium">This ticket applies to all venues</p>
                                <p className="text-sm mt-1">Switch to the General tab and uncheck "Apply to all dates" to select specific venues.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2">
                              <p className="text-muted-foreground mb-4">Select the venues where this ticket will be valid:</p>
                              <div className="flex flex-wrap gap-3">
                                {venues.map((venue) => {
                                  const isSelected = activeTicket.availableDateIds.includes(venue.id);
                                  return (
                                    <div
                                      key={venue.id}
                                      onClick={() => toggleVenueForTicket(venue)}
                                      className={`px-4 py-3 rounded-md cursor-pointer border transition-all ${isSelected
                                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                                        : 'bg-background hover:bg-brand-50 border-input'
                                        }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div>
                                          <div className="font-medium">{venue.name}</div>
                                          <div className={`text-sm ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                                            {venue.city}
                                          </div>
                                        </div>
                                        {isSelected && <Check className="h-4 w-4 ml-2" />}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        {/* Time Slots Tab */}
                        <TabsContent value="timeslots" className="mt-0">
                          {timeSlots.length === 0 ? (
                            <div className="bg-amber-50 text-amber-800 p-6 rounded-md flex items-center gap-3 border border-amber-200">
                              <Info className="h-5 w-5" />
                              <p>You need to add time slots first before you can select specific time slots.</p>
                            </div>
                          ) : activeTicket.isAllTimeSlots ? (
                            <div className="bg-blue-50 text-blue-800 p-6 rounded-md flex items-center gap-3 border border-blue-200">
                              <Info className="h-5 w-5" />
                              <div>
                                <p className="font-medium">This ticket applies to all time slots</p>
                                <p className="text-sm mt-1">Switch to the General tab and uncheck "Apply to all time slots" to select specific ones.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2">
                              <p className="text-muted-foreground mb-4">Select the time slots for which this ticket will be valid:</p>
                              <div className="flex flex-wrap gap-3">
                                {timeSlots.map((slot) => {
                                  const isSelected = activeTicket.availableTimeSlotIds.includes(slot.id);
                                  const date = dates.find(d => d.id === slot.dateId);
                                  const dateDisplay = date ? format(date.startDate, 'M/d/yyyy') : 'Unknown date';

                                  return (
                                    <div
                                      key={slot.id}
                                      onClick={() => toggleTimeSlotForTicket(slot.id)}
                                      className={`px-4 py-3 rounded-md cursor-pointer border transition-all ${isSelected
                                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                                        : 'bg-background hover:bg-brand-50 border-input'
                                        }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <Clock className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-brand-400'}`} />
                                        <div>
                                          <div className="font-medium">{slot.startTime} - {slot.endTime}</div>
                                          <div className={`text-sm ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                                            {dateDisplay}
                                          </div>
                                        </div>
                                        {isSelected && <Check className="h-4 w-4 ml-2" />}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-8 flex items-center justify-between">
                <div className="font-medium text-brand-700">
                  Total Tickets: <Badge variant="outline" className="ml-1 bg-brand-50">{ticketList.length}</Badge>
                  <span className="mx-2">|</span>
                  Total Value: <Badge variant="outline" className="ml-1 bg-brand-50">${totalValue.toFixed(2)}</Badge>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    if (ticketList.length === 0) {
                      toast({
                        title: "No tickets added",
                        description: "Please add at least one ticket for your event.",
                        variant: "destructive"
                      });
                      return;
                    }
                    // Pass the complete ticket list to the onSubmit prop.
                    onSubmit(ticketList);
                  }}
                  className="flex items-center bg-brand-500 hover:bg-brand-600"
                >
                  Next: Media <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { TicketStep };