import React from 'react';
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
import { Input } from '@/components/ui/input';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DateFormValues, VenueFormValues, ArtistFormValues } from './types';

export interface TimeSlotFormValues {
  id: string;
  startTime: string;
  endTime: string;
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
  // dates: DateFormValues[];
  // venues: VenueFormValues[];
  // artists: ArtistFormValues[];
  onSubmit: (timeSlots: TimeSlotFormValues[]) => void;
  onBack: () => void;
}

// Generate time options every 30 minutes in the day.
const generateTimeOptions = () => {
  const options = [];
  for (let minutes = 0; minutes < 24 * 60; minutes += 30) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    options.push({
      value: `${hours.toString().padStart(2, '0')}:${formattedMins}`,
      label: `${formattedHours}:${formattedMins} ${period}`,
    });
  }
  return options;
};
const TIME_OPTIONS = generateTimeOptions();

// Yup validation schema for the new time slot form.
const timeSlotValidationSchema = Yup.object().shape({
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string()
    .required('End time is required')
    .test(
      'end-after-start',
      'End time must be after start time',
      function (value) {
        const { startTime } = this.parent;
        if (!startTime || !value) return false;
        // Convert times to minutes after midnight for comparison.
        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = value.split(':').map(Number);
        return endH * 60 + endM > startH * 60 + startM;
      }
    ),
  // dateId: Yup.string().required('Date is required'),
  // venueId: Yup.string().required('Venue is required'),
});

// const getDateDisplay = (dateId: string, dates: DateFormValues[]) => {
//   const date = dates.find(d => d.id === dateId);
//   return date ? format(date.startDate, 'PPP') : 'Unknown date';
// };

// const getVenueDisplay = (venueId: string, venues: VenueFormValues[]) => {
//   const venue = venues.find(v => v.id === venueId);
//   return venue ? (venue.tba ? `TBA Venue in ${venue.city}` : venue.name) : 'Unknown venue';
// };

export const TimeSlotStep: React.FC<TimeSlotStepProps> = ({
  timeSlots,
  // dates,
  // venues,
  onSubmit,
  onBack
}) => {
  const [timeSlotList, setTimeSlotList] = React.useState<TimeSlotFormValues[]>(timeSlots);

  // Generate minute options from 1 to 59
  const minuteOptions = Array.from({ length: 59 }, (_, i) => i + 1);

  // Generate hour options from 1 to 4
  const hourOptions = [1, 2, 3, 4];
  // Formik hook to manage the new time slot form.
  const formik = useFormik<TimeSlotFormValues>({
    initialValues: {
      id: uuidv4(),
      startTime: '09:00',
      endTime: '17:00',
      gateOpensBeforeStart: false,
      gateOpenType: undefined,
      gateOpenDuration: undefined,
      artists: []
    },
    validationSchema: timeSlotValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setTimeSlotList([...timeSlotList, { ...values, id: uuidv4() }]);
      resetForm({
        values: {
          id: uuidv4(),
          startTime: '09:00',
          endTime: '17:00',
          gateOpensBeforeStart: false,
          gateOpenType: undefined,
          gateOpenDuration: undefined,
          artists: []
        }
      });
      toast({
        title: "Time slot added",
        description: "The time slot has been added to your event."
      });
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

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

  // Toggle gate opens option and set default values if enabled.
  const handleGateOpensChange = (checked: boolean) => {
    formik.setFieldValue('gateOpensBeforeStart', checked);
    if (checked) {
      formik.setFieldValue('gateOpenType', 'hour');
      formik.setFieldValue('gateOpenDuration', 1);
    } else {
      formik.setFieldValue('gateOpenType', undefined);
      formik.setFieldValue('gateOpenDuration', undefined);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Event Time Slots</h2>

        <form onSubmit={formik.handleSubmit} className="mb-6 border rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Add New Time Slot
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Select
                value={formik.values.startTime}
                onValueChange={(value) => formik.setFieldValue('startTime', value)}
              >
                <SelectTrigger id="startTime" className={formik.errors.startTime ? "border-red-500" : ""}>
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
              {formik.errors.startTime && <p className="text-red-500 text-sm">{formik.errors.startTime}</p>}
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Select
                value={formik.values.endTime}
                onValueChange={(value) => formik.setFieldValue('endTime', value)}
              >
                <SelectTrigger id="endTime" className={formik.errors.endTime ? "border-red-500" : ""}>
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
              {formik.errors.endTime && <p className="text-red-500 text-sm">{formik.errors.endTime}</p>}
            </div>

            {/* Date Selection */}
            {/* <div className="space-y-2">
              <Label htmlFor="dateId">Date</Label>
              <Select
                value={formik.values.dateId}
                onValueChange={(value) => formik.setFieldValue('dateId', value)}
              >
                <SelectTrigger id="dateId" className={formik.errors.dateId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {dates.map((date) => (
                    <SelectItem key={date.id} value={date.id}>
                      {date.isSingleDay ? 'Single: ' : date.isDateRange ? 'Range: ' : ''}
                      {format(date.startDate, 'M/d/yyyy')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.errors.dateId && <p className="text-red-500 text-sm">{formik.errors.dateId}</p>}
            </div> */}

            {/* Venue Selection */}
            {/* <div className="space-y-2">
              <Label htmlFor="venueId">Venue</Label>
              <Select
                value={formik.values.venueId}
                onValueChange={(value) => formik.setFieldValue('venueId', value)}
              >
                <SelectTrigger id="venueId" className={formik.errors.venueId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select venue" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {venues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.tba ? `TBA Venue in ${venue.city}` : venue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.errors.venueId && <p className="text-red-500 text-sm">{formik.errors.venueId}</p>}
            </div> */}
          </div>

          {/* Gate Opens Option */}
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gateOpens"
                checked={formik.values.gateOpensBeforeStart}
                onCheckedChange={handleGateOpensChange}
              />
              <Label htmlFor="gateOpens">Gate opens before start time</Label>
            </div>

            {formik.values.gateOpensBeforeStart && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="gateOpenType">Time Unit</Label>
                  <Select
                    value={formik.values.gateOpenType || ''}
                    onValueChange={(value: 'minute' | 'hour') =>
                      formik.setFieldValue('gateOpenType', value)}
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
                  {formik.values.gateOpenType === 'minute' ? (
                    <Select
                      value={formik.values.gateOpenDuration?.toString() || '15'}
                      onValueChange={(value) => formik.setFieldValue('gateOpenDuration', parseInt(value))}
                    >
                      <SelectTrigger id="gateOpenDuration">
                        <SelectValue placeholder="Select minutes" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {minuteOptions.map((minute) => (
                          <SelectItem key={`minute-${minute}`} value={minute.toString()}>
                            {minute} {minute === 1 ? 'minute' : 'minutes'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select
                      value={formik.values.gateOpenDuration?.toString() || '1'}
                      onValueChange={(value) => formik.setFieldValue('gateOpenDuration', parseInt(value))}
                    >
                      <SelectTrigger id="gateOpenDuration">
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                      <SelectContent>
                        {hourOptions.map((hour) => (
                          <SelectItem key={`hour-${hour}`} value={hour.toString()}>
                            {hour} {hour === 1 ? 'hour' : 'hours'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="mt-4 flex items-center" variant="secondary">
            <Plus className="h-4 w-4 mr-2" /> Add Time Slot
          </Button>
        </form>

        {timeSlotList.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-3">Added Time Slots</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {timeSlotList.map((slot) => {
                const startTimeOption = TIME_OPTIONS.find(t => t.value === slot.startTime);
                const endTimeOption = TIME_OPTIONS.find(t => t.value === slot.endTime);
                return (
                  <div key={slot.id} className="border rounded-lg p-3 bg-white flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        {startTimeOption?.label} - {endTimeOption?.label}
                      </h4>
                      {/* <p className="text-sm text-gray-600">{getDateDisplay(slot.dateId, dates)}</p>
                      <p className="text-xs text-gray-500">Venue: {getVenueDisplay(slot.venueId, venues)}</p> */}
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
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="button" onClick={handleSubmit} className="flex items-center">
            Next: Tickets <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlotStep;
