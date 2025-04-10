
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { VenueFormValues } from './steps/types';

export interface EventDateTime {
  id: string;
  startDate: Date;
  endDate?: Date;
  startTime: string;
  endTime: string;
  locationId: string;
  capacity?: number;
  isRecurring?: boolean;
  recurringPattern?: string;
  recurringEndDate?: Date;
}

interface EventDateTimeSelectorProps {
  value: EventDateTime[];
  onChange: (dateTimes: EventDateTime[]) => void;
  locations: VenueFormValues[];
}

type DateType = 'single' | 'multi' | 'range' | 'recurring';

export const EventDateTimeSelector: React.FC<EventDateTimeSelectorProps> = ({ 
  value,
  onChange,
  locations = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateType, setDateType] = useState<DateType>('single');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('22:00');
  const [locationId, setLocationId] = useState<string>('');
  const [multiDates, setMultiDates] = useState<Date[]>([]);
  const [recurringPattern, setRecurringPattern] = useState('weekly');
  const [recurringEndDate, setRecurringEndDate] = useState<Date | undefined>(undefined);
  const [editingDateTime, setEditingDateTime] = useState<EventDateTime | null>(null);

  const resetForm = () => {
    setDateType('single');
    setStartDate(new Date());
    setEndDate(undefined);
    setStartTime('19:00');
    setEndTime('22:00');
    setLocationId('');
    setMultiDates([]);
    setRecurringPattern('weekly');
    setRecurringEndDate(undefined);
  };

  const handleAddDateTime = () => {
    if (!locationId) {
      toast({
        title: "Validation Error",
        description: "Please select a location",
        variant: "destructive",
      });
      return;
    }

    let newDateTimes: EventDateTime[] = [];

    switch (dateType) {
      case 'single':
        newDateTimes = [{
          id: uuidv4(),
          startDate,
          startTime,
          endTime,
          locationId
        }];
        break;
      
      case 'multi':
        if (multiDates.length === 0) {
          toast({
            title: "Validation Error",
            description: "Please select at least one date",
            variant: "destructive",
          });
          return;
        }
        
        newDateTimes = multiDates.map(date => ({
          id: uuidv4(),
          startDate: date,
          startTime,
          endTime,
          locationId
        }));
        break;
      
      case 'range':
        if (!endDate) {
          toast({
            title: "Validation Error",
            description: "Please select an end date",
            variant: "destructive",
          });
          return;
        }
        
        newDateTimes = [{
          id: uuidv4(),
          startDate,
          endDate,
          startTime,
          endTime,
          locationId
        }];
        break;
      
      case 'recurring':
        if (!recurringEndDate) {
          toast({
            title: "Validation Error",
            description: "Please select an end date for recurring events",
            variant: "destructive",
          });
          return;
        }
        
        newDateTimes = [{
          id: uuidv4(),
          startDate,
          startTime,
          endTime,
          locationId,
          isRecurring: true,
          recurringPattern,
          recurringEndDate
        }];
        break;
    }

    onChange([...value, ...newDateTimes]);
    resetForm();
    setIsOpen(false);
  };

  const handleUpdateDateTime = () => {
    if (!editingDateTime) return;
    
    const updatedDateTimes = value.map(dt => 
      dt.id === editingDateTime.id ? editingDateTime : dt
    );
    
    onChange(updatedDateTimes);
    setEditingDateTime(null);
  };

  const removeDateTime = (id: string) => {
    onChange(value.filter(dt => dt.id !== id));
  };

  const handleEditDateTime = (datetime: EventDateTime) => {
    setEditingDateTime(datetime);
  };

  const renderDateTimeCard = (datetime: EventDateTime, index: number) => {
    const location = locations.find(loc => loc.id === datetime.locationId);
    
    return (
      <Card key={datetime.id} className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-semibold">
                  {format(datetime.startDate, 'MMMM d, yyyy')}
                  {datetime.endDate && ` - ${format(datetime.endDate, 'MMMM d, yyyy')}`}
                </h4>
                <p className="text-sm mt-1">
                  {datetime.startTime} - {datetime.endTime}
                </p>
                {datetime.isRecurring && (
                  <p className="text-sm text-indigo-600 mt-1">
                    Recurring {datetime.recurringPattern}, until {datetime.recurringEndDate && format(datetime.recurringEndDate, 'MMM d, yyyy')}
                  </p>
                )}
              </div>
              <div className="bg-gray-100 rounded-md py-1 px-2 text-xs">
                {index + 1}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Location:</span> {location?.name || 'Unknown location'}
            </p>
          </div>
          <div className="flex border-t">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 rounded-none h-10"
              onClick={() => handleEditDateTime(datetime)}
            >
              Edit
            </Button>
            <div className="border-r" />
            <Button
              type="button"
              variant="ghost"
              className="flex-1 rounded-none h-10 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => removeDateTime(datetime.id)}
            >
              Remove
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Event Dates and Times</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button type="button" disabled={locations.length === 0}>
              Add Date/Time
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Event Date & Time</DialogTitle>
              <DialogDescription>
                Set when your event will take place.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Date Type</Label>
                <Tabs defaultValue="single" value={dateType} onValueChange={(value) => setDateType(value as DateType)}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="single">Single</TabsTrigger>
                    <TabsTrigger value="multi">Multiple</TabsTrigger>
                    <TabsTrigger value="range">Range</TabsTrigger>
                    <TabsTrigger value="recurring">Recurring</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="single" className="pt-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto">
                          <CalendarComponent
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => date && setStartDate(date)}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="multi" className="pt-4">
                    <div className="space-y-2">
                      <Label>Select Multiple Dates</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              multiDates.length === 0 && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {multiDates.length > 0 
                              ? `${multiDates.length} date${multiDates.length > 1 ? 's' : ''} selected` 
                              : <span>Pick dates</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto">
                          <CalendarComponent
                            mode="multiple"
                            selected={multiDates}
                            onSelect={setMultiDates}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      
                      {multiDates.length > 0 && (
                        <div className="mt-2 text-sm">
                          <p>Selected dates:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {multiDates.map((date, i) => (
                              <div key={i} className="bg-primary/10 rounded px-2 py-1">
                                {format(date, 'MMM d, yyyy')}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="range" className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !startDate && "text-muted-foreground"
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, 'PPP') : <span>Start date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 pointer-events-auto">
                              <CalendarComponent
                                mode="single"
                                selected={startDate}
                                onSelect={(date) => date && setStartDate(date)}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !endDate && "text-muted-foreground"
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, 'PPP') : <span>End date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 pointer-events-auto">
                              <CalendarComponent
                                mode="single"
                                selected={endDate}
                                onSelect={(date) => date && setEndDate(date)}
                                disabled={(date) => date < startDate}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recurring" className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !startDate && "text-muted-foreground"
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, 'PPP') : <span>Start date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 pointer-events-auto">
                              <CalendarComponent
                                mode="single"
                                selected={startDate}
                                onSelect={(date) => date && setStartDate(date)}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Recurring Pattern</Label>
                          <Select value={recurringPattern} onValueChange={setRecurringPattern}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select pattern" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Bi-weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>End Recurring On</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !recurringEndDate && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {recurringEndDate ? format(recurringEndDate, 'PPP') : <span>End date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 pointer-events-auto">
                            <CalendarComponent
                              mode="single"
                              selected={recurringEndDate}
                              onSelect={(date) => date && setRecurringEndDate(date)}
                              disabled={(date) => date < startDate}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={locationId} onValueChange={setLocationId}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.length > 0 ? (
                      locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name} ({location.city}, {location.state})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No locations available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleAddDateTime}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={!!editingDateTime} onOpenChange={(open) => !open && setEditingDateTime(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Event Date & Time</DialogTitle>
            <DialogDescription>
              Update when your event will take place.
            </DialogDescription>
          </DialogHeader>
          
          {editingDateTime && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(editingDateTime.startDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <CalendarComponent
                      mode="single"
                      selected={editingDateTime.startDate}
                      onSelect={(date) => date && setEditingDateTime({...editingDateTime, startDate: date})}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {editingDateTime.endDate && (
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(editingDateTime.endDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <CalendarComponent
                        mode="single"
                        selected={editingDateTime.endDate}
                        onSelect={(date) => date && setEditingDateTime({...editingDateTime, endDate: date})}
                        disabled={(date) => date < editingDateTime.startDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStartTime">Start Time</Label>
                  <Input
                    id="editStartTime"
                    type="time"
                    value={editingDateTime.startTime}
                    onChange={(e) => setEditingDateTime({...editingDateTime, startTime: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editEndTime">End Time</Label>
                  <Input
                    id="editEndTime"
                    type="time"
                    value={editingDateTime.endTime}
                    onChange={(e) => setEditingDateTime({...editingDateTime, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editLocation">Location</Label>
                <Select 
                  value={editingDateTime.locationId} 
                  onValueChange={(value) => setEditingDateTime({...editingDateTime, locationId: value})}
                >
                  <SelectTrigger id="editLocation">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name} ({location.city}, {location.state})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleUpdateDateTime}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Date/Time List */}
      {value.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
          <Calendar className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-500">No dates or times added yet</p>
          <p className="text-sm text-gray-400 mt-1">Add at least one date and time for your event</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {value.map((datetime, index) => renderDateTimeCard(datetime, index))}
        </div>
      )}
    </div>
  );
};
