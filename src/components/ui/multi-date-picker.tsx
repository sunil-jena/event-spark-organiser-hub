
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from './calendar';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { CalendarIcon, Clock, Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DateTimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface MultiDatePickerProps {
  value: DateTimeSlot[];
  onChange: (dates: DateTimeSlot[]) => void;
}

export function MultiDatePicker({ value, onChange }: MultiDatePickerProps) {
  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);
  const [currentStartTime, setCurrentStartTime] = useState<string>('');
  const [currentEndTime, setCurrentEndTime] = useState<string>('');

  const addDateTimeSlot = () => {
    if (!currentDate || !currentStartTime || !currentEndTime) return;

    const newSlot: DateTimeSlot = {
      id: crypto.randomUUID(),
      date: currentDate,
      startTime: currentStartTime,
      endTime: currentEndTime
    };

    onChange([...value, newSlot]);
    
    // Reset for next entry
    setCurrentDate(undefined);
    setCurrentStartTime('');
    setCurrentEndTime('');
  };

  const removeDateTimeSlot = (id: string) => {
    onChange(value.filter(slot => slot.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label>Event Dates & Times</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !currentDate && "text-muted-foreground"
                  )}
                >
                  {currentDate ? (
                    format(currentDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={setCurrentDate}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label className="text-xs">Start Time</Label>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <Input
                type="time"
                value={currentStartTime}
                onChange={(e) => setCurrentStartTime(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label className="text-xs">End Time</Label>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <Input
                type="time"
                value={currentEndTime}
                onChange={(e) => setCurrentEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="mt-2 self-start"
          onClick={addDateTimeSlot}
          disabled={!currentDate || !currentStartTime || !currentEndTime}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Date & Time
        </Button>
      </div>
      
      {value.length > 0 && (
        <div className="space-y-2 border rounded-md p-3">
          <Label className="text-sm font-medium">Scheduled Times:</Label>
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {value.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{format(slot.date, "PPP")}</span>
                  <span>•</span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{slot.startTime} - {slot.endTime}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => removeDateTimeSlot(slot.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
