
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Clock, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DateFormValues } from './types';
import { VenueFormValues } from './types';
import { ArtistFormValues } from './types';
import { Input } from '@/components/ui/input';

export interface TimeSlotFormValues {
  id: string;
  startTime: string;
  endTime: string;
  dateId: string;
  venueId: string;
  gateOpensBeforeStart: boolean;
  gateOpenType?: 'minute' | 'hour';
  gateOpenDuration?: number;
  artists?: {
    artistId: string;
    bannerImage: string;
  }[];
}

interface TimeSlotStepProps {
  timeSlots: TimeSlotFormValues[];
  dates: DateFormValues[];
  venues: VenueFormValues[];
  artists: ArtistFormValues[];
  onSubmit: (timeSlots: TimeSlotFormValues[]) => void;
  onBack: () => void;
}

// Generate time options for select (every 30 minutes)
const generateTimeOptions = () => {
  const options = [];
  const totalMinutesInDay = 24 * 60;
  
  for (let minutes = 0; minutes < totalMinutesInDay; minutes += 30) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    
    options.push({
      value: `${hours.toString().padStart(2, '0')}:${formattedMins}`,
      label: `${formattedHours}:${formattedMins} ${period}`
    });
  }
  
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

export const TimeSlotStep: React.FC<TimeSlotStepProps> = ({ 
  timeSlots, 
  dates,
  venues,
  artists,
  onSubmit, 
  onBack 
}) => {
  const [timeSlotList, setTimeSlotList] = useState<TimeSlotFormValues[]>(timeSlots);
  const [newTimeSlot, setNewTimeSlot] = useState<TimeSlotFormValues>({
    id: uuidv4(),
    startTime: '09:00',
    endTime: '17:00',
    dateId: dates.length > 0 ? dates[0].id : '',
    venueId: venues.length > 0 ? venues[0].id : '',
    gateOpensBeforeStart: false,
    artists: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateTimeSlot = (timeSlot: TimeSlotFormValues) => {
    const newErrors: Record<string, string> = {};
    
    if (!timeSlot.startTime) newErrors.startTime = 'Start time is required';
    if (!timeSlot.endTime) newErrors.endTime = 'End time is required';
    if (!timeSlot.dateId) newErrors.dateId = 'Date is required';
    if (!timeSlot.venueId) newErrors.venueId = 'Venue is required';
    
    // Check if end time is after start time
    if (timeSlot.startTime && timeSlot.endTime) {
      const [startHours, startMinutes] = timeSlot.startTime.split(':').map(Number);
      const [endHours, endMinutes] = timeSlot.endTime.split(':').map(Number);
      
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      
      if (endTotalMinutes <= startTotalMinutes) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    return newErrors;
  };

  const handleAddTimeSlot = () => {
    const validationErrors = validateTimeSlot(newTimeSlot);
    
    if (Object.keys(validationErrors).length === 0) {
      setTimeSlotList([...timeSlotList, newTimeSlot]);
      setNewTimeSlot({
        id: uuidv4(),
        startTime: '09:00',
        endTime: '17:00',
        dateId: dates.length > 0 ? dates[0].id : '',
        venueId: venues.length > 0 ? venues[0].id : '',
        gateOpensBeforeStart: false,
        artists: []
      });
      setErrors({});
      
      toast({
        title: "Time slot added",
        description: "The time slot has been added to your event."
      });
    } else {
      setErrors(validationErrors);
    }
  };

  const handleRemoveTimeSlot = (id: string) => {
    setTimeSlotList(timeSlotList.filter(slot => slot.id !== id));
    
    toast({
      title: "Time slot removed",
      description: "The time slot has been removed from your event."
    });
  };

  const handleSubmit = () => {
    if (timeSlotList.length === 0) {
      toast({
        title: "No time slots added",
        description: "Please add at least one time slot for your event.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(timeSlotList);
  };

  const getDateDisplay = (dateId: string) => {
    const date = dates.find(d => d.id === dateId);
    if (!date) return 'Unknown date';
    
    if (date.isSingleDay) {
      return format(date.startDate, 'PPP');
    } else if (date.isDateRange) {
      return `${format(date.startDate, 'PPP')} to ${format(date.endDate!, 'PPP')}`;
    }
    
    return '';
  };

  const getVenueForDate = (dateId: string) => {
    const date = dates.find(d => d.id === dateId);
    if (!date) return 'Unknown venue';
    
    const venue = venues.find(v => v.id === date.venueId);
    return venue ? venue.name : 'Unknown venue';
  };

  // Helper to toggle gate opens before start
  const handleGateOpensChange = (checked: boolean) => {
    setNewTimeSlot({
      ...newTimeSlot,
      gateOpensBeforeStart: checked,
      gateOpenType: checked ? 'hour' : undefined,
      gateOpenDuration: checked ? 1 : undefined
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Event Time Slots</h2>
        
        <div className="mb-6 border rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Add New Time Slot
          </h3>
          
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Select
                value={newTimeSlot.startTime}
                onValueChange={(value) => setNewTimeSlot({...newTimeSlot, startTime: value})}
              >
                <SelectTrigger id="startTime" className={errors.startTime ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {TIME_OPTIONS.map((time) => (
                    <SelectItem key={`start-${time.value}`} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Select
                value={newTimeSlot.endTime}
                onValueChange={(value) => setNewTimeSlot({...newTimeSlot, endTime: value})}
              >
                <SelectTrigger id="endTime" className={errors.endTime ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {TIME_OPTIONS.map((time) => (
                    <SelectItem key={`end-${time.value}`} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeSlotDate">Date</Label>
              <Select
                value={newTimeSlot.dateId}
                onValueChange={(value) => setNewTimeSlot({...newTimeSlot, dateId: value})}
              >
                <SelectTrigger id="timeSlotDate" className={errors.dateId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {dates.map((date) => (
                    <SelectItem key={date.id} value={date.id}>
                      {date.isSingleDay ? 'Single: ' : 
                       date.isDateRange ? 'Range: ' : ''}
                      {format(date.startDate, 'M/d/yyyy')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dateId && <p className="text-red-500 text-sm">{errors.dateId}</p>}
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="gateOpens" 
                checked={newTimeSlot.gateOpensBeforeStart}
                onCheckedChange={handleGateOpensChange}
              />
              <Label htmlFor="gateOpens">Gate opens before start time</Label>
            </div>
            
            {newTimeSlot.gateOpensBeforeStart && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="gateOpenType">Time Unit</Label>
                  <Select
                    value={newTimeSlot.gateOpenType}
                    onValueChange={(value: 'minute' | 'hour') => 
                      setNewTimeSlot({...newTimeSlot, gateOpenType: value})}
                  >
                    <SelectTrigger id="gateOpenType">
                      <SelectValue placeholder="Select time unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minute">Minutes</SelectItem>
                      <SelectItem value="hour">Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gateOpenDuration">Duration</Label>
                  <Input
                    id="gateOpenDuration"
                    type="number"
                    min="1"
                    value={newTimeSlot.gateOpenDuration || 1}
                    onChange={(e) => setNewTimeSlot({
                      ...newTimeSlot, 
                      gateOpenDuration: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
            )}
          </div>
          
          <Button
            onClick={handleAddTimeSlot}
            className="mt-4 flex items-center"
            variant="secondary"
            disabled={dates.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Time Slot
          </Button>
          
          {dates.length === 0 && (
            <p className="text-red-500 text-sm mt-2">Please add dates before adding time slots.</p>
          )}
        </div>
        
        {timeSlotList.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-3">Added Time Slots</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {timeSlotList.map((slot) => {
                // Convert 24h format to 12h AM/PM for display
                const startTimeOption = TIME_OPTIONS.find(t => t.value === slot.startTime);
                const endTimeOption = TIME_OPTIONS.find(t => t.value === slot.endTime);
                
                return (
                  <div key={slot.id} className="border rounded-lg p-3 bg-white flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        {startTimeOption?.label} - {endTimeOption?.label}
                      </h4>
                      <p className="text-sm text-gray-600">{getDateDisplay(slot.dateId)}</p>
                      <p className="text-xs text-gray-500">Venue: {getVenueForDate(slot.dateId)}</p>
                      {slot.gateOpensBeforeStart && (
                        <p className="text-xs text-gray-500">
                          Gate opens {slot.gateOpenDuration} {slot.gateOpenType === 'hour' ? 'hour(s)' : 'minute(s)'} before start
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTimeSlot(slot.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
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
            Next: Tickets <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
