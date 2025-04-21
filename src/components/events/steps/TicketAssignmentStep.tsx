import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Check,
  ChevronRight,
  Tag,
  Edit,
  Trash2,
  GripVertical,
  Trash,
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import {
  DateFormValues,
  TicketAssignmentValues,
  TicketFormValues,
  TimeSlotFormValues,
  VenueFormValues,
} from './types';

const formatIndianPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

const getTicketCategoryLabel = (category: string): string => {
  switch (category) {
    case 'standard':
      return 'Standard';
    case 'early-bird':
      return 'Early Bird';
    case 'vip':
      return 'VIP';
    case 'season-pass':
      return 'Season Pass';
    default:
      return category;
  }
};

const formatEventDate = (dateNumber: number): Date => {
  const str = dateNumber.toString().padStart(8, '0');
  const day = parseInt(str.slice(0, 2), 10);
  const month = parseInt(str.slice(2, 4), 10) - 1;
  const year = parseInt(str.slice(4, 8), 10);
  return new Date(year, month, day);
};

export const TicketAssignmentStep: React.FC<{
  tickets: TicketFormValues[];
  dates: DateFormValues[];
  timeSlots: TimeSlotFormValues[];
  venues: VenueFormValues[];
  assignments: TicketAssignmentValues[];
  setAssignments: (assignments: TicketAssignmentValues[]) => void;
  onBack: () => void;
  onSubmit: (assignments: TicketAssignmentValues[]) => void;
}> = ({
  tickets,
  dates,
  timeSlots,
  venues,
  assignments,
  setAssignments,
  onBack,
  onSubmit,
}) => {
  const { toast } = useToast();
  const [selectedTickets, setSelectedTickets] = useState<string[]>(
    tickets.map((t) => t.id)
  );
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(
    timeSlots.map((t) => t.id)
  );
  const [selectAllTimeSlots, setSelectAllTimeSlots] = useState<boolean>(true);

  const [editingAssignment, setEditingAssignment] =
    useState<TicketAssignmentValues | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    description: string[];
    price: number;
    quantity: number;
    ticketType: 'free' | 'paid';
    ticketCategory: 'standard' | 'early-bird' | 'vip' | 'season-pass' | string;
    entryPerTicket: number;
    bookingPerTicket: number;
    ticketStatus:
      | 'active'
      | 'inactive'
      | 'sold out'
      | 'expired'
      | 'filling fast'
      | 'coming soon'
      | 'few tickets left'
      | 'offline sell';
    isCombo: boolean;
    isLimited: boolean;
  }>({
    name: '',
    description: [''],
    price: 0,
    quantity: 0,
    ticketType: 'paid',
    ticketCategory: 'standard',
    entryPerTicket: 1,
    bookingPerTicket: 1,
    ticketStatus: 'active',
    isCombo: false,
    isLimited: true,
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    assignmentId: string | null;
  }>({
    isOpen: false,
    assignmentId: null,
  });
  // New state for group deletion
  const [groupDeleteConfirmation, setGroupDeleteConfirmation] = useState<{
    isOpen: boolean;
    ticketId: string | null;
  }>({ isOpen: false, ticketId: null });

  const getVenueById = (id: string) => venues.find((v) => v.id === id);
  const getDateById = (id: string) => dates.find((d) => d.id === id);
  const getTicketById = (id: string) => tickets.find((t) => t.id === id);

  const groupedAssignments = assignments.reduce(
    (acc, curr) => {
      const ticket = getTicketById(curr.ticketId);
      if (!ticket) return acc;
      if (!acc[curr.ticketId]) {
        acc[curr.ticketId] = {
          ticketId: curr.ticketId,
          ticketName: ticket.name,
          assignments: [],
        };
      }
      acc[curr.ticketId].assignments.push(curr);
      return acc;
    },
    {} as Record<
      string,
      {
        ticketId: string;
        ticketName: string;
        assignments: TicketAssignmentValues[];
      }
    >
  );

  Object.values(groupedAssignments).forEach((group: any) => {
    group.assignments.sort(
      (a, b) => b.quantity * b.price - a.quantity * a.price
    );
  });

  const [ticketOrder, setTicketOrder] = useState<string[]>(() =>
    Object.keys(groupedAssignments)
  );

  useEffect(() => {
    setTicketOrder((prev) => {
      const currentTickets = Object.keys(groupedAssignments);
      const newTickets = currentTickets.filter((t) => !prev.includes(t));
      const validPrevTickets = prev.filter((t) => currentTickets.includes(t));
      return [...validPrevTickets, ...newTickets];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAssignAllTickets = () => {
    if (selectedTickets.length === 0) {
      toast({
        title: 'No tickets selected',
        description: 'Please select at least one ticket to assign',
        variant: 'destructive',
      });
      return;
    }
    const newAssignments: TicketAssignmentValues[] = [];
    selectedTickets.forEach((ticketId) => {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (!ticket) return;
      selectedTimeSlots.forEach((timeSlotId) => {
        const timeSlot = timeSlots.find((ts) => ts.id === timeSlotId);
        if (!timeSlot) return;
        const existingAssignment = assignments.find(
          (a) =>
            a.ticketId === ticketId &&
            a.timeSlotId === timeSlotId &&
            a.venueId === timeSlot.venueId &&
            a.dateId === timeSlot.dateId
        );
        if (!existingAssignment) {
          newAssignments.push({
            id: uuidv4(),
            ticketId,
            timeSlotId,
            venueId: timeSlot.venueId,
            dateId: timeSlot.dateId,
            quantity: ticket.quantity,
            name: ticket.name,
            description: Array.isArray(ticket.description)
              ? ticket.description
              : [ticket.description].filter(Boolean),
            price: ticket.price,
            ticketType: ticket.ticketType,
            ticketCategory: ticket.ticketCategory,
            entryPerTicket: ticket.entryPerTicket,
            bookingPerTicket: ticket.bookingPerTicket,
            ticketStatus: ticket.ticketStatus as
              | 'active'
              | 'inactive'
              | 'sold out'
              | 'expired'
              | 'filling fast'
              | 'coming soon'
              | 'few tickets left'
              | 'offline sell',
            isCombo: ticket.isCombo,
            isLimited: ticket.isLimited,
            saleStartDate: ticket.saleStartDate,
            saleEndDate: ticket.saleEndDate,
          });
        }
      });
    });

    if (newAssignments.length === 0) {
      toast({
        title: 'No new assignments',
        description:
          'Selected tickets are already assigned to these time slots',
        variant: 'default',
      });
      return;
    }

    setAssignments([...assignments, ...newAssignments]);
    toast({
      title: 'Tickets assigned',
      description: `Successfully assigned ${selectedTickets.length} tickets to ${selectedTimeSlots.length} time slots`,
      variant: 'default',
    });
  };

  const handleToggleTimeSlot = (slotId: string) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );

    const allTimeSlotIds = timeSlots.map((ts) => ts.id);
    const updatedSelection = selectedTimeSlots.includes(slotId)
      ? selectedTimeSlots.filter((id) => id !== slotId)
      : [...selectedTimeSlots, slotId];

    setSelectAllTimeSlots(
      allTimeSlotIds.every((id) => updatedSelection.includes(id))
    );
  };

  const handleSelectAllTimeSlots = (checked: boolean) => {
    setSelectAllTimeSlots(checked);
    if (checked) {
      setSelectedTimeSlots(timeSlots.map((ts) => ts.id));
    } else {
      setSelectedTimeSlots([]);
    }
  };

  const handleEditAssignment = (assignment: TicketAssignmentValues) => {
    setEditingAssignment(assignment);
    setEditFormData({
      name: assignment.name,
      description: assignment.description,
      price: assignment.price,
      quantity: assignment.quantity,
      ticketType: assignment.ticketType,
      ticketCategory: assignment.ticketCategory,
      entryPerTicket: assignment.entryPerTicket,
      bookingPerTicket: assignment.bookingPerTicket,
      ticketStatus: assignment.ticketStatus,
      isCombo: assignment.isCombo,
      isLimited: assignment.isLimited || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingAssignment) return;

    const updatedAssignments = assignments.map((a) =>
      a.id === editingAssignment.id
        ? {
            ...a,
            ...editFormData,
            id: a.id,
            ticketId: a.ticketId,
            timeSlotId: a.timeSlotId,
            venueId: a.venueId,
            dateId: a.dateId,
          }
        : a
    );

    setAssignments(updatedAssignments);
    setIsEditDialogOpen(false);
    setEditingAssignment(null);

    toast({
      title: 'Assignment updated',
      description: 'Successfully updated ticket assignment details',
      variant: 'default',
    });
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    setDeleteConfirmation({
      isOpen: true,
      assignmentId,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation.assignmentId) {
      const updatedAssignments = assignments.filter(
        (a) => a.id !== deleteConfirmation.assignmentId
      );
      setAssignments(updatedAssignments);
      toast({
        title: 'Assignment deleted',
        description: 'Successfully removed ticket assignment',
        variant: 'default',
      });
    }
    setDeleteConfirmation({ isOpen: false, assignmentId: null });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(ticketOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTicketOrder(items);
  };

  // Handler to initiate group deletion
  const handleDeleteGroupInit = (ticketId: string) => {
    setGroupDeleteConfirmation({ isOpen: true, ticketId });
  };

  // Confirm and perform group deletion
  const handleConfirmDeleteGroup = () => {
    if (groupDeleteConfirmation.ticketId) {
      const updated = assignments.filter(
        (a) => a.ticketId !== groupDeleteConfirmation.ticketId
      );
      setAssignments(updated);
      toast({
        title: 'Assignments deleted',
        description: 'All assignments for this ticket have been removed',
        variant: 'destructive',
      });
    }
    setGroupDeleteConfirmation({ isOpen: false, ticketId: null });
  };

  return (
    <div className='space-y-6'>
      <Card className='border-[#24005b]/10 shadow-md hover:shadow-lg transition-shadow duration-300'>
        <CardHeader className='flex flex-row items-center justify-between pb-2 border-b bg-gradient-to-r from-[#E5DEFF] to-[#F9F7FF]'>
          <div>
            <CardTitle className='text-2xl font-bold text-[#24005b]'>
              Assign Tickets
            </CardTitle>
            <CardDescription className='text-[#24005b]/70'>
              Select tickets and assign them to time slots
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='pt-6'>
          <div className='space-y-4 mb-8'>
            <h3 className='font-semibold text-[#24005b] flex items-center gap-2'>
              <Ticket className='h-5 w-5' />
              Available Tickets
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    selectedTickets.includes(ticket.id)
                      ? 'border-[#24005b] bg-[#F9F7FF]'
                      : 'border-gray-200'
                  }`}
                >
                  <div className='flex items-center space-x-4'>
                    <Checkbox
                      checked={selectedTickets.includes(ticket.id)}
                      onCheckedChange={(checked) => {
                        setSelectedTickets((prev) =>
                          checked
                            ? [...prev, ticket.id]
                            : prev.filter((id) => id !== ticket.id)
                        );
                      }}
                      className='data-[state=checked]:bg-[#24005b] data-[state=checked]:border-[#24005b]'
                    />
                    <div>
                      <p className='font-medium'>{ticket.name}</p>
                      <div className='flex items-center space-x-2 text-sm'>
                        <Badge
                          variant='outline'
                          className='bg-[#F9F7FF] text-[#24005b]'
                        >
                          {getTicketCategoryLabel(ticket.ticketCategory)}
                        </Badge>
                        <Badge
                          variant={
                            ticket.ticketType === 'free' ? 'outline' : 'default'
                          }
                        >
                          {ticket.ticketType === 'free'
                            ? 'Free'
                            : formatIndianPrice(ticket.price)}
                        </Badge>
                        <span className='text-gray-500'>
                          Qty: {ticket.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='space-y-4 mb-8'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold text-[#24005b] flex items-center gap-2'>
                <Clock className='h-5 w-5' />
                Available Time Slots
              </h3>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='time-slot'
                  name='time-slot'
                  checked={selectAllTimeSlots}
                  onCheckedChange={(checked) =>
                    handleSelectAllTimeSlots(!!checked)
                  }
                  className='data-[state=checked]:bg-[#24005b] data-[state=checked]:border-[#24005b]'
                />
                <Label htmlFor='time-slot' className='text-sm font-medium'>
                  Select All
                </Label>
              </div>
            </div>
            {!selectAllTimeSlots && (
              <div className='space-y-4'>
                {dates.map((date) => {
                  const dateSlotsIds = timeSlots
                    .filter((slot) => slot.dateId === date.id)
                    .map((slot) => slot.id);

                  return (
                    <div key={date.id} className='space-y-2'>
                      <div className='flex items-center space-x-2 text-[#24005b]'>
                        <Calendar className='h-4 w-4' />
                        <span className='font-medium'>
                          {format(
                            formatEventDate(date.startDate),
                            'MMMM d, yyyy'
                          )}
                        </span>
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pl-6'>
                        {timeSlots
                          .filter((slot) => slot.dateId === date.id)
                          .map((slot) => {
                            const venue = getVenueById(slot.venueId);
                            return (
                              <div
                                key={slot.id}
                                className={`p-3 rounded-lg border cursor-pointer ${
                                  selectedTimeSlots.includes(slot.id)
                                    ? 'border-[#24005b] bg-[#F9F7FF]'
                                    : 'border-gray-200'
                                }`}
                                onClick={() => handleToggleTimeSlot(slot.id)}
                              >
                                <div className='flex items-start'>
                                  <div className='ml-2'>
                                    <p className='font-medium text-[#24005b]'>
                                      {slot.startTime} - {slot.endTime}
                                    </p>
                                    <div className='flex items-center text-sm text-gray-500 mt-1'>
                                      <MapPin className='h-3 w-3 mr-1' />
                                      {venue?.name}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className='flex justify-end mb-8'>
            <Button
              onClick={handleAssignAllTickets}
              className='bg-[#24005b] hover:bg-[#24005b]/90'
            >
              <Check className='mr-2 h-4 w-4' />
              Assign Selected Tickets to Time Slots
            </Button>
          </div>

          <div className='space-y-4'>
            <h3 className='font-semibold text-[#24005b] flex items-center gap-2'>
              <Tag className='h-5 w-5' />
              Ticket Assignments
            </h3>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId='droppable-tickets'>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className='w-full'
                  >
                    <Accordion
                      type='single'
                      collapsible
                      className='w-full space-y-4'
                    >
                      {ticketOrder
                        .filter((ticketId) => groupedAssignments[ticketId])
                        .map((ticketId, index) => {
                          const ticketGroup = groupedAssignments[ticketId];
                          const ticket = getTicketById(ticketId);
                          if (!ticket || !ticketGroup) return null;

                          const totalAssigned = ticketGroup.assignments.reduce(
                            (sum, a) => sum + a.quantity,
                            0
                          );
                          const totalValue = ticketGroup.assignments.reduce(
                            (sum, a) => sum + a.quantity * a.price,
                            0
                          );

                          return (
                            <Draggable
                              key={ticketId}
                              draggableId={ticketId}
                              index={index}
                            >
                              {(provided) => (
                                <AccordionItem
                                  value={ticketId}
                                  className='border rounded-lg overflow-hidden w-full'
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                >
                                  <div className='flex items-center w-full'>
                                    <div
                                      className='p-2 cursor-move hover:text-white/90'
                                      {...provided.dragHandleProps}
                                    >
                                      <GripVertical className='h-5 w-5' />
                                    </div>
                                    <AccordionTrigger className='flex-1 hover:no-underline w-full'>
                                      <div className='flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-[#24005b] to-[#3a1a6f] rounded-md text-white space-x-4'>
                                        <div className='flex items-center gap-3 flex-grow'>
                                          <Badge className='bg-white/20 text-white border-none'>
                                            {ticket.name}
                                          </Badge>
                                          <Badge
                                            variant='outline'
                                            className='bg-transparent text-white/90 border-white/30'
                                          >
                                            {getTicketCategoryLabel(
                                              ticket.ticketCategory
                                            )}
                                          </Badge>
                                          <span className='text-sm text-white/70 ml-auto'>
                                            {
                                              assignments.filter(
                                                (a) => a.ticketId === ticket.id
                                              ).length
                                            }{' '}
                                            slots assigned
                                          </span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                          <span className='text-lg font-semibold whitespace-nowrap'>
                                            {ticket.ticketType === 'free'
                                              ? 'Free'
                                              : formatIndianPrice(
                                                  ticket.price *
                                                    ticket.quantity *
                                                    assignments.filter(
                                                      (a) =>
                                                        a.ticketId === ticket.id
                                                    ).length
                                                )}
                                          </span>
                                          <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteGroupInit(ticketId);
                                            }}
                                          >
                                            <Trash2 className='h-4 w-4 ' />
                                          </Button>
                                        </div>
                                      </div>
                                    </AccordionTrigger>
                                  </div>
                                  <AccordionContent className='p-4 bg-white'>
                                    <div className='border rounded-lg'>
                                      <Table>
                                        <TableHeader className='bg-gray-50'>
                                          <TableRow>
                                            <TableHead>Date & Time</TableHead>
                                            <TableHead>Venue</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead className='text-right'>
                                              Value
                                            </TableHead>
                                            <TableHead className='text-right'>
                                              Actions
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {ticketGroup.assignments.map(
                                            (assignment) => {
                                              const timeSlot = timeSlots.find(
                                                (ts) =>
                                                  ts.id ===
                                                  assignment.timeSlotId
                                              );
                                              const date = getDateById(
                                                assignment.dateId
                                              );
                                              const venue = getVenueById(
                                                assignment.venueId
                                              );

                                              return (
                                                <TableRow
                                                  key={assignment.id}
                                                  className='hover:bg-[#F9F7FF]/50'
                                                >
                                                  <TableCell>
                                                    <div className='font-medium'>
                                                      {date &&
                                                        format(
                                                          formatEventDate(
                                                            date.startDate
                                                          ),
                                                          'MMM d, yyyy'
                                                        )}
                                                    </div>
                                                    <div className='text-sm text-gray-500'>
                                                      {timeSlot?.startTime} -{' '}
                                                      {timeSlot?.endTime}
                                                    </div>
                                                  </TableCell>
                                                  <TableCell>
                                                    {venue?.name}
                                                  </TableCell>
                                                  <TableCell>
                                                    {assignment.quantity}
                                                  </TableCell>
                                                  <TableCell className='text-right'>
                                                    {formatIndianPrice(
                                                      ticket.price *
                                                        assignment.quantity
                                                    )}
                                                  </TableCell>
                                                  <TableCell className='text-right'>
                                                    <div className='flex justify-end space-x-2'>
                                                      <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() =>
                                                          handleEditAssignment(
                                                            assignment
                                                          )
                                                        }
                                                      >
                                                        <Edit className='h-4 w-4 text-[#24005b]' />
                                                      </Button>
                                                      <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() =>
                                                          handleDeleteAssignment(
                                                            assignment.id
                                                          )
                                                        }
                                                      >
                                                        <Trash2 className='h-4 w-4 text-red-500' />
                                                      </Button>
                                                    </div>
                                                  </TableCell>
                                                </TableRow>
                                              );
                                            }
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              )}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </Accordion>
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {Object.keys(groupedAssignments).length === 0 && (
              <div className='text-center py-12 bg-gray-50 rounded-lg border border-dashed'>
                <Tag className='h-12 w-12 mx-auto text-gray-400 mb-3' />
                <p className='text-gray-600'>
                  No tickets have been assigned yet
                </p>
                <p className='text-sm text-gray-500 mt-1'>
                  Select tickets and time slots above to make assignments
                </p>
              </div>
            )}
          </div>

          <div className='mt-8 flex items-center justify-between'>
            <Button
              onClick={onBack}
              variant='outline'
              className='hover:bg-[#E5DEFF] transition-colors'
            >
              <ChevronRight className='mr-2 h-4 w-4 rotate-180' />
              Back
            </Button>

            <Button
              onClick={() => {
                if (assignments.length === 0) {
                  toast({
                    title: 'No assignments',
                    description:
                      'Please assign at least one ticket before proceeding',
                    variant: 'destructive',
                  });
                  return;
                }
                onSubmit(assignments);
              }}
              className='bg-[#24005b] hover:bg-[#24005b]/90'
            >
              Next Step
              <ChevronRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='sm:max-w-[600px] max-h-[100vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Ticket Assignment</DialogTitle>
            <DialogDescription>
              Update the details for this ticket assignment. Time slot, venue,
              and date cannot be modified.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Ticket Name</Label>
                <Input
                  id='name'
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='price'>Price</Label>
                <Input
                  id='price'
                  type='number'
                  value={editFormData.price}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={editFormData.description.join('\n')}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value.split('\n'),
                  })
                }
                rows={3}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='quantity'>Quantity</Label>
                <Input
                  id='quantity'
                  type='number'
                  value={editFormData.quantity}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='ticketType'>Ticket Type</Label>
                <Select
                  value={editFormData.ticketType}
                  onValueChange={(value: 'free' | 'paid') =>
                    setEditFormData({
                      ...editFormData,
                      ticketType: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='free'>Free</SelectItem>
                    <SelectItem value='paid'>Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='ticketCategory'>Category</Label>
                <Select
                  value={editFormData.ticketCategory}
                  onValueChange={(value) =>
                    setEditFormData({
                      ...editFormData,
                      ticketCategory: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='standard'>Standard</SelectItem>
                    <SelectItem value='early-bird'>Early Bird</SelectItem>
                    <SelectItem value='vip'>VIP</SelectItem>
                    <SelectItem value='season-pass'>Season Pass</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='ticketStatus'>Status</Label>
                <Select
                  value={editFormData.ticketStatus}
                  onValueChange={(
                    value:
                      | 'active'
                      | 'inactive'
                      | 'sold out'
                      | 'expired'
                      | 'filling fast'
                      | 'coming soon'
                      | 'few tickets left'
                      | 'offline sell'
                  ) =>
                    setEditFormData({
                      ...editFormData,
                      ticketStatus: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='inactive'>Inactive</SelectItem>
                    <SelectItem value='sold out'>Sold Out</SelectItem>
                    <SelectItem value='expired'>Expired</SelectItem>
                    <SelectItem value='filling fast'>Filling Fast</SelectItem>
                    <SelectItem value='coming soon'>Coming Soon</SelectItem>
                    <SelectItem value='few tickets left'>
                      Few Tickets Left
                    </SelectItem>
                    <SelectItem value='offline sell'>Offline Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='entryPerTicket'>Entries Per Ticket</Label>
                <Input
                  id='entryPerTicket'
                  type='number'
                  value={editFormData.entryPerTicket}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      entryPerTicket: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='bookingPerTicket'>Bookings Per Ticket</Label>
                <Input
                  id='bookingPerTicket'
                  type='number'
                  value={editFormData.bookingPerTicket}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      bookingPerTicket: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='isCombo'
                  checked={editFormData.isCombo}
                  onCheckedChange={(checked) =>
                    setEditFormData({
                      ...editFormData,
                      isCombo: checked as boolean,
                    })
                  }
                />
                <Label htmlFor='isCombo'>Combo Ticket</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='isLimited'
                  checked={editFormData.isLimited}
                  onCheckedChange={(checked) =>
                    setEditFormData({
                      ...editFormData,
                      isLimited: checked as boolean,
                    })
                  }
                />
                <Label htmlFor='isLimited'>Limited Availability</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteConfirmation.isOpen}
        onOpenChange={(isOpen) =>
          setDeleteConfirmation({ isOpen, assignmentId: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              ticket assignment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className='bg-red-500 text-white hover:bg-red-600'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Group deletion dialog: DELETE ALL assignments for a ticket */}
      <AlertDialog
        open={groupDeleteConfirmation.isOpen}
        onOpenChange={(isOpen) =>
          setGroupDeleteConfirmation({
            isOpen,
            ticketId: groupDeleteConfirmation.ticketId,
          })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Assignments?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>all</strong> assignments for
              this ticket.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteGroup}
              className='bg-red-500 text-white hover:bg-red-600'
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
