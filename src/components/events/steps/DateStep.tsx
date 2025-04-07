
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, Plus, Trash2, RotateCcw, CalendarRange } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { v4 as uuidv4 } from 'uuid';
import { format, addDays, isBefore, isAfter, eachDayOfInterval } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { VenueFormValues } from './VenueStep';

export interface DateFormValues {
  id: string;
  type: 'single' | 'range' | 'recurring';
  startDate: Date;
  endDate?: Date;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate: Date;
    daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
  };
  venueId: string;
}

interface DateStepProps {
  dates: DateFormValues[];
  venues: VenueFormValues[];
  onSubmit: (dates: DateFormValues[]) => void;
  onBack: () => void;
}

// Days of the week for recurring options
const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

export const DateStep: React.FC<DateStepProps> = ({ dates, venues, onSubmit, onBack }) => {
  const [dateList, setDateList] = useState<DateFormValues[]>(dates);
  const [dateType, setDateType] = useState<'single' | 'range' | 'recurring'>('single');
  
  // Single date
  const [singleDate, setSingleDate] = useState<Date | undefined>(new Date());
  const [singleVenueId, setSingleVenueId] = useState<string>(venues.length > 0 ? venues[0].id : '');
  
  // Date range
  const [rangeStartDate, setRangeStartDate] = useState<Date | undefined>(new Date());
  const [rangeEndDate, setRangeEndDate] = useState<Date | undefined>(addDays(new Date(), 3));
  const [rangeVenueId, setRangeVenueId] = useState<string>(venues.length > 0 ? venues[0].id : '');
  
  // Recurring dates
  const [recurringStartDate, setRecurringStartDate] = useState<Date | undefined>(new Date());
  const [recurringEndDate, setRecurringEndDate] = useState<Date | undefined>(addDays(new Date(), 30));
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [recurringInterval, setRecurringInterval] = useState<number>(1);
  const [recurringDaysOfWeek, setRecurringDaysOfWeek] = useState<number[]>([]);
  const [recurringVenueId, setRecurringVenueId] = useState<string>(venues.length > 0 ? venues[0].id : '');

  const validateSingleDate = () => {
    if (!singleDate) return "Please select a date";
    if (!singleVenueId) return "Please select a venue";
    return null;
  };

  const validateDateRange = () => {
    if (!rangeStartDate) return "Please select a start date";
    if (!rangeEndDate) return "Please select an end date";
    if (isBefore(rangeEndDate, rangeStartDate)) return "End date must be after start date";
    if (!rangeVenueId) return "Please select a venue";
    return null;
  };

  const validateRecurringDate = () => {
    if (!recurringStartDate) return "Please select a start date";
    if (!recurringEndDate) return "Please select an end date";
    if (isBefore(recurringEndDate, recurringStartDate)) return "End date must be after start date";
    if (recurringFrequency === 'weekly' && recurringDaysOfWeek.length === 0) {
      return "Please select at least one day of the week";
    }
    if (!recurringVenueId) return "Please select a venue";
    return null;
  };

  const handleAddDate = () => {
    let error = null;
    let newDate: DateFormValues | null = null;
    
    if (dateType === 'single') {
      error = validateSingleDate();
      if (!error && singleDate) {
        newDate = {
          id: uuidv4(),
          type: 'single',
          startDate: singleDate,
          venueId: singleVenueId
        };
      }
    } else if (dateType === 'range') {
      error = validateDateRange();
      if (!error && rangeStartDate && rangeEndDate) {
        newDate = {
          id: uuidv4(),
          type: 'range',
          startDate: rangeStartDate,
          endDate: rangeEndDate,
          venueId: rangeVenueId
        };
      }
    } else if (dateType === 'recurring') {
      error = validateRecurringDate();
      if (!error && recurringStartDate && recurringEndDate) {
        newDate = {
          id: uuidv4(),
          type: 'recurring',
          startDate: recurringStartDate,
          endDate: recurringEndDate,
          recurringPattern: {
            frequency: recurringFrequency,
            interval: recurringInterval,
            endDate: recurringEndDate,
            ...(recurringFrequency === 'weekly' && { daysOfWeek: recurringDaysOfWeek })
          },
          venueId: recurringVenueId
        };
      }
    }
    
    if (error) {
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive"
      });
      return;
    }
    
    if (newDate) {
      setDateList([...dateList, newDate]);
      
      // Reset form after adding
      if (dateType === 'single') {
        setSingleDate(new Date());
      } else if (dateType === 'range') {
        setRangeStartDate(new Date());
        setRangeEndDate(addDays(new Date(), 3));
      } else if (dateType === 'recurring') {
        setRecurringStartDate(new Date());
        setRecurringEndDate(addDays(new Date(), 30));
        setRecurringFrequency('weekly');
        setRecurringInterval(1);
        setRecurringDaysOfWeek([]);
      }
      
      toast({
        title: "Date added",
        description: "The date has been added to your event."
      });
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

  const formatDateRange = (date: DateFormValues) => {
    if (date.type === 'single') {
      return format(date.startDate, 'PPP');
    } else if (date.type === 'range') {
      return `${format(date.startDate, 'PPP')} to ${format(date.endDate!, 'PPP')}`;
    } else if (date.type === 'recurring') {
      const pattern = date.recurringPattern!;
      let recurrenceText = '';
      
      if (pattern.frequency === 'daily') {
        recurrenceText = pattern.interval === 1 ? 'Daily' : `Every ${pattern.interval} days`;
      } else if (pattern.frequency === 'weekly') {
        if (pattern.daysOfWeek && pattern.daysOfWeek.length > 0) {
          const days = pattern.daysOfWeek.map(day => DAYS_OF_WEEK.find(d => d.value === day)?.label).join(', ');
          recurrenceText = pattern.interval === 1 
            ? `Weekly on ${days}` 
            : `Every ${pattern.interval} weeks on ${days}`;
        } else {
          recurrenceText = pattern.interval === 1 ? 'Weekly' : `Every ${pattern.interval} weeks`;
        }
      } else if (pattern.frequency === 'monthly') {
        recurrenceText = pattern.interval === 1 ? 'Monthly' : `Every ${pattern.interval} months`;
      }
      
      return `${recurrenceText} from ${format(date.startDate, 'PPP')} until ${format(pattern.endDate, 'PPP')}`;
    }
    
    return '';
  };

  const getVenueName = (venueId: string) => {
    const venue = venues.find(v => v.id === venueId);
    return venue ? venue.name : 'Unknown venue';
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Event Dates</h2>
        
        <Tabs defaultValue="single" value={dateType} onValueChange={(v) => setDateType(v as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="single" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Single Date
            </TabsTrigger>
            <TabsTrigger value="range" className="flex items-center">
              <CalendarRange className="h-4 w-4 mr-2" />
              Date Range
            </TabsTrigger>
            <TabsTrigger value="recurring" className="flex items-center">
              <RotateCcw className="h-4 w-4 mr-2" />
              Recurring
            </TabsTrigger>
          </TabsList>
          
          <div className="border rounded-lg p-4 bg-gray-50 mb-6">
            <TabsContent value="single">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <div className="border rounded-md bg-white">
                    <CalendarComponent
                      mode="single"
                      selected={singleDate}
                      onSelect={setSingleDate}
                      className="rounded-md"
                      disabled={(date) => isBefore(date, new Date())}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="singleVenue">Venue</Label>
                  <Select value={singleVenueId} onValueChange={setSingleVenueId}>
                    <SelectTrigger id="singleVenue">
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="range">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="border rounded-md bg-white">
                    <CalendarComponent
                      mode="range"
                      selected={{
                        from: rangeStartDate,
                        to: rangeEndDate
                      }}
                      onSelect={(range) => {
                        setRangeStartDate(range?.from);
                        setRangeEndDate(range?.to);
                      }}
                      className="rounded-md"
                      disabled={(date) => isBefore(date, new Date())}
                      numberOfMonths={2}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rangeVenue">Venue</Label>
                  <Select value={rangeVenueId} onValueChange={setRangeVenueId}>
                    <SelectTrigger id="rangeVenue">
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recurring">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recurringStart">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {recurringStartDate ? format(recurringStartDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={recurringStartDate}
                        onSelect={setRecurringStartDate}
                        initialFocus
                        disabled={(date) => isBefore(date, new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recurringEnd">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {recurringEndDate ? format(recurringEndDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={recurringEndDate}
                        onSelect={setRecurringEndDate}
                        initialFocus
                        disabled={(date) => recurringStartDate ? isBefore(date, recurringStartDate) : false}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recurringFrequency">Frequency</Label>
                  <Select value={recurringFrequency} onValueChange={(value) => setRecurringFrequency(value as any)}>
                    <SelectTrigger id="recurringFrequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recurringInterval">Every</Label>
                  <Select
                    value={recurringInterval.toString()}
                    onValueChange={(value) => setRecurringInterval(parseInt(value))}
                  >
                    <SelectTrigger id="recurringInterval">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((interval) => (
                        <SelectItem key={interval} value={interval.toString()}>
                          {interval} {recurringFrequency === 'daily' ? 'day(s)' : 
                                      recurringFrequency === 'weekly' ? 'week(s)' : 'month(s)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {recurringFrequency === 'weekly' && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Days of Week</Label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <Button
                          key={day.value}
                          type="button"
                          variant={recurringDaysOfWeek.includes(day.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (recurringDaysOfWeek.includes(day.value)) {
                              setRecurringDaysOfWeek(recurringDaysOfWeek.filter(d => d !== day.value));
                            } else {
                              setRecurringDaysOfWeek([...recurringDaysOfWeek, day.value]);
                            }
                          }}
                        >
                          {day.label.substring(0, 3)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="recurringVenue">Venue</Label>
                  <Select value={recurringVenueId} onValueChange={setRecurringVenueId}>
                    <SelectTrigger id="recurringVenue">
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <Button
              onClick={handleAddDate}
              className="mt-4 flex items-center"
              variant="secondary"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Date
            </Button>
          </div>
        </Tabs>
        
        {dateList.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-3">Added Dates</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {dateList.map((date) => (
                <div key={date.id} className="border rounded-lg p-3 bg-white flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{date.type === 'single' ? 'Single Date' : 
                                                date.type === 'range' ? 'Date Range' : 'Recurring'}</h4>
                    <p className="text-sm text-gray-600">{formatDateRange(date)}</p>
                    <p className="text-xs text-gray-500">Venue: {getVenueName(date.venueId)}</p>
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
