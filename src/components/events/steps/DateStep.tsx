import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, Plus, Trash2, Repeat } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { v4 as uuidv4 } from 'uuid';
import { format, addDays, isAfter, isBefore, addWeeks } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { VenueFormValues } from './VenueStep';

export interface DateFormValues {
  id: string;
  type: 'single' | 'range' | 'recurring';
  startDate: Date;
  endDate?: Date;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  recurringUntil?: Date;
  recurringDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  venueId?: string;
  notes?: string;
}

interface DateStepProps {
  dates: DateFormValues[];
  venues: VenueFormValues[];
  onSubmit: (dates: DateFormValues[]) => void;
  onBack: () => void;
}

export const DateStep: React.FC<DateStepProps> = ({ dates, venues, onSubmit, onBack }) => {
  const [dateList, setDateList] = useState<DateFormValues[]>(dates);
  const [dateType, setDateType] = useState<'single' | 'range' | 'recurring'>('single');
  const [newDate, setNewDate] = useState<DateFormValues>({
    id: uuidv4(),
    type: 'single',
    startDate: new Date(),
    venueId: venues.length > 0 ? venues[0].id : undefined
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateDate = (date: DateFormValues) => {
    const newErrors: Record<string, string> = {};
    
    if (!date.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (date.type === 'range' && !date.endDate) {
      newErrors.endDate = 'End date is required for date range';
    }
    
    if (date.type === 'range' && date.startDate && date.endDate && 
        isAfter(date.startDate, date.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (date.type === 'recurring' && !date.recurringType) {
      newErrors.recurringType = 'Please select how often the event repeats';
    }
    
    if (date.type === 'recurring' && !date.recurringUntil) {
      newErrors.recurringUntil = 'Please specify when the recurring event ends';
    }
    
    return newErrors;
  };

  const handleAddDate = () => {
    // Make sure the date type matches the currently selected tab
    const dateToAdd = { ...newDate, type: dateType };
    
    const validationErrors = validateDate(dateToAdd);
    
    if (Object.keys(validationErrors).length === 0) {
      setDateList([...dateList, dateToAdd]);
      
      // Reset form but keep venue selection
      setNewDate({
        id: uuidv4(),
        type: dateType,
        startDate: new Date(),
        venueId: dateToAdd.venueId
      });
      
      setErrors({});
      
      toast({
        title: "Date added",
        description: "Your event date has been added."
      });
    } else {
      setErrors(validationErrors);
    }
  };

  const handleRemoveDate = (id: string) => {
    setDateList(dateList.filter(date => date.id !== id));
    
    toast({
      title: "Date removed",
      description: "The date has been removed from your event."
    });
  };

  const handleSubmit = () => {
    if (dateList.length === 0) {
      toast({
        title: "No dates added",
        description: "Please add at least one date for your event.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(dateList);
  };

  const handleDateTypeChange = (value: string) => {
    const newType = value as 'single' | 'range' | 'recurring';
    setDateType(newType);
    
    // Reset the date object to match the new type
    setNewDate({
      id: uuidv4(),
      type: newType,
      startDate: new Date(),
      endDate: newType === 'range' ? addDays(new Date(), 3) : undefined,
      recurringType: newType === 'recurring' ? 'weekly' : undefined,
      recurringUntil: newType === 'recurring' ? addWeeks(new Date(), 8) : undefined,
      recurringDays: newType === 'recurring' ? [1, 3, 5] : undefined, // Mon, Wed, Fri
      venueId: newDate.venueId
    });
    
    // Clear errors
    setErrors({});
  };

  const formatDateDisplay = (date: DateFormValues) => {
    const venueName = venues.find(v => v.id === date.venueId)?.name || 'No venue selected';
    
    switch (date.type) {
      case 'single':
        return `${format(date.startDate, 'MMMM d, yyyy')} at ${venueName}`;
      case 'range':
        return `${format(date.startDate, 'MMM d')} - ${format(date.endDate!, 'MMM d, yyyy')} at ${venueName}`;
      case 'recurring':
        const frequencyText = date.recurringType === 'daily' ? 'Daily' : 
                              date.recurringType === 'weekly' ? 'Weekly' : 'Monthly';
        return `${frequencyText} from ${format(date.startDate, 'MMM d')} until ${format(date.recurringUntil!, 'MMM d, yyyy')} at ${venueName}`;
      default:
        return 'Unknown date format';
    }
  };

  const weekDays = [
    { value: '0', label: 'Sun' },
    { value: '1', label: 'Mon' },
    { value: '2', label: 'Tue' },
    { value: '3', label: 'Wed' },
    { value: '4', label: 'Thu' },
    { value: '5', label: 'Fri' },
    { value: '6', label: 'Sat' },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Event Dates</h2>
        
        <Tabs defaultValue="single" onValueChange={handleDateTypeChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="single">Single Date</TabsTrigger>
            <TabsTrigger value="range">Date Range</TabsTrigger>
            <TabsTrigger value="recurring">Recurring Dates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single" className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Add Single Date
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Event Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={format(newDate.startDate, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    if (e.target.value) {
                      setNewDate({...newDate, startDate: new Date(e.target.value)});
                    }
                  }}
                  className={errors.startDate ? "border-red-500" : ""}
                />
                {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="venueId">Venue</Label>
                <Select
                  value={newDate.venueId}
                  onValueChange={(value) => setNewDate({...newDate, venueId: value})}
                >
                  <SelectTrigger id="venueId">
                    <SelectValue placeholder="Select venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.tbd ? `TBD Venue in ${venue.city}` : venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={newDate.notes || ''}
                  onChange={(e) => setNewDate({...newDate, notes: e.target.value})}
                  placeholder="Add any notes about this date"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="range" className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Add Date Range
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rangeStartDate">Start Date</Label>
                <Input
                  id="rangeStartDate"
                  type="date"
                  value={format(newDate.startDate, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    if (e.target.value) {
                      const newStartDate = new Date(e.target.value);
                      setNewDate({
                        ...newDate, 
                        startDate: newStartDate,
                        // If end date exists and is before the new start date, update it
                        endDate: newDate.endDate && isBefore(newDate.endDate, newStartDate) ? 
                                addDays(newStartDate, 1) : newDate.endDate
                      });
                    }
                  }}
                  className={errors.startDate ? "border-red-500" : ""}
                />
                {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rangeEndDate">End Date</Label>
                <Input
                  id="rangeEndDate"
                  type="date"
                  value={newDate.endDate ? format(newDate.endDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setNewDate({...newDate, endDate: new Date(e.target.value)});
                    }
                  }}
                  className={errors.endDate ? "border-red-500" : ""}
                />
                {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rangeVenueId">Venue</Label>
                <Select
                  value={newDate.venueId}
                  onValueChange={(value) => setNewDate({...newDate, venueId: value})}
                >
                  <SelectTrigger id="rangeVenueId">
                    <SelectValue placeholder="Select venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.tbd ? `TBD Venue in ${venue.city}` : venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rangeNotes">Notes (Optional)</Label>
                <Input
                  id="rangeNotes"
                  value={newDate.notes || ''}
                  onChange={(e) => setNewDate({...newDate, notes: e.target.value})}
                  placeholder="Add any notes about this date range"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recurring" className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-3 flex items-center">
              <Repeat className="h-4 w-4 mr-2" />
              Add Recurring Dates
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="recurringStartDate">First Event Date</Label>
                <Input
                  id="recurringStartDate"
                  type="date"
                  value={format(newDate.startDate, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    if (e.target.value) {
                      setNewDate({...newDate, startDate: new Date(e.target.value)});
                    }
                  }}
                  className={errors.startDate ? "border-red-500" : ""}
                />
                {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recurringType">Repeats</Label>
                <Select
                  value={newDate.recurringType}
                  onValueChange={(value: any) => setNewDate({...newDate, recurringType: value})}
                >
                  <SelectTrigger id="recurringType" className={errors.recurringType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                {errors.recurringType && <p className="text-red-500 text-sm">{errors.recurringType}</p>}
              </div>
              
              {newDate.recurringType === 'weekly' && (
                <div className="space-y-2 sm:col-span-2">
                  <Label>Repeats On</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {weekDays.map((day) => (
                      <Button
                        key={day.value}
                        type="button"
                        variant={newDate.recurringDays?.includes(parseInt(day.value)) ? "default" : "outline"}
                        className="h-10 w-10 p-0 rounded-full"
                        onClick={() => {
                          const dayNum = parseInt(day.value);
                          const currentDays = newDate.recurringDays || [];
                          
                          if (currentDays.includes(dayNum)) {
                            setNewDate({
                              ...newDate, 
                              recurringDays: currentDays.filter(d => d !== dayNum)
                            });
                          } else {
                            setNewDate({
                              ...newDate,
                              recurringDays: [...currentDays, dayNum].sort()
                            });
                          }
                        }}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="recurringUntil">Repeats Until</Label>
                <Input
                  id="recurringUntil"
                  type="date"
                  value={newDate.recurringUntil ? format(newDate.recurringUntil, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setNewDate({...newDate, recurringUntil: new Date(e.target.value)});
                    }
                  }}
                  className={errors.recurringUntil ? "border-red-500" : ""}
                />
                {errors.recurringUntil && <p className="text-red-500 text-sm">{errors.recurringUntil}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recurringVenueId">Venue</Label>
                <Select
                  value={newDate.venueId}
                  onValueChange={(value) => setNewDate({...newDate, venueId: value})}
                >
                  <SelectTrigger id="recurringVenueId">
                    <SelectValue placeholder="Select venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.tbd ? `TBD Venue in ${venue.city}` : venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="recurringNotes">Notes (Optional)</Label>
                <Input
                  id="recurringNotes"
                  value={newDate.notes || ''}
                  onChange={(e) => setNewDate({...newDate, notes: e.target.value})}
                  placeholder="Add any notes about these recurring dates"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Button
          onClick={handleAddDate}
          className="mt-4 flex items-center"
          variant="secondary"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Date
        </Button>
        
        {dateList.length > 0 && (
          <div className="mb-6 mt-6">
            <h3 className="font-medium mb-3">Added Dates</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {dateList.map((date) => (
                <div key={date.id} className="border rounded-lg p-3 bg-white flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{formatDateDisplay(date)}</h4>
                    {date.notes && <p className="text-sm text-gray-600">{date.notes}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveDate(date.id)}
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
            Next: Time Slots <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
