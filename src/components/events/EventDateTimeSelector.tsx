
import React, { useState } from 'react';
import { PlusCircle, Trash2, MapPin, CalendarClock } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface EventDateTime {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
}

interface EventDateTimeSelectorProps {
  value: EventDateTime[];
  onChange: (value: EventDateTime[]) => void;
}

export const EventDateTimeSelector: React.FC<EventDateTimeSelectorProps> = ({
  value,
  onChange
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');

  const generateId = () => `datetime-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const handleAddDateTime = () => {
    if (!selectedDate || !startTime || !endTime || !location) return;

    const newDateTime: EventDateTime = {
      id: generateId(),
      date: selectedDate,
      startTime,
      endTime,
      location
    };

    onChange([...value, newDateTime]);

    // Reset form
    setSelectedDate(undefined);
    setStartTime('');
    setEndTime('');
    setLocation('');
  };

  const handleRemoveDateTime = (id: string) => {
    onChange(value.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Event Dates, Times & Locations</h3>
      
      {/* Add new date/time form */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="event-date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="event-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarClock className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddDateTime}
                  disabled={!selectedDate || !startTime || !endTime || !location}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Display added dates */}
      {value.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500">Added Sessions</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {value.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                    <div className="font-medium">{format(item.date, 'EEE, MMM d, yyyy')}</div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveDateTime(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <span>Time:</span>
                      <span className="font-medium text-gray-700">{item.startTime} - {item.endTime}</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="font-medium text-gray-700">{item.location}</span>
                    </div>
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
