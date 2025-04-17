/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { format, addDays, isAfter, isBefore, addWeeks } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Calendar,
  Plus,
  Trash2,
  Repeat,
  Edit as EditIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { v4 as uuidv4 } from 'uuid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DatePickerCalendar } from './DatePickerCalendar';
import { DateFormValues } from './types';

/**
 * Utility functions to convert between JavaScript Date and numeric format (ddMMyyyy).
 * For example, April 2, 1999 becomes 02041999.
 */
const formatDateNumber = (date: Date): number => {
  return Number(format(date, 'ddMMyyyy'));
};

const parseDateNumber = (dateNumber: number): Date => {
  const str = dateNumber.toString().padStart(8, '0');
  const day = parseInt(str.slice(0, 2), 10);
  const month = parseInt(str.slice(2, 4), 10) - 1; // Month is 0-indexed
  const year = parseInt(str.slice(4, 8), 10);
  return new Date(year, month, day);
};

interface DateStepProps {
  dates?: DateFormValues[];
  // For simplicity the venue type here includes basic fields.
  venues: { id: string; name: string; tba?: boolean; city?: string }[];
  onSubmit: (dates: DateFormValues[]) => void;
  onBack: () => void;
}

const validationSchema = Yup.object().shape({
  startDate: Yup.number()
    .required('Start date is required')
    .test('is-valid', 'Invalid date', (value) => {
      if (!value) return false;
      const d = parseDateNumber(value);
      return !isNaN(d.getTime());
    }),
  endDate: Yup.number().when('type', {
    is: 'range',
    then: (schema) =>
      schema
        .required('End date is required for date range')
        .test(
          'is-after',
          'End date must be after start date',
          function (value) {
            const { startDate } = this.parent;
            if (!startDate || !value) return false;
            return isAfter(parseDateNumber(value), parseDateNumber(startDate));
          }
        ),
  }),
  venueId: Yup.string().required('Venue is required'),
  recurringType: Yup.string().when('type', {
    is: 'recurring',
    then: (schema) =>
      schema.required('Please select how often the event repeats'),
  }),
  recurringUntil: Yup.number().when('type', {
    is: 'recurring',
    then: (schema) =>
      schema
        .required('Please specify when the recurring event ends')
        .test(
          'is-after',
          'Recurring until date must be after start date',
          function (value) {
            const { startDate } = this.parent;
            if (!startDate || !value) return false;
            return isAfter(parseDateNumber(value), parseDateNumber(startDate));
          }
        ),
  }),
});

export const DateStep: React.FC<DateStepProps> = ({
  venues,
  dates = [],
  onSubmit,
  onBack,
}) => {
  const { toast } = useToast();
  const [dateList, setDateList] = React.useState<DateFormValues[]>([...dates]);
  // This state tracks whether we are editing an existing date; otherwise null.
  const [editingDateId, setEditingDateId] = React.useState<string | null>(null);
  const [dateType, setDateType] = React.useState<
    'single' | 'range' | 'recurring'
  >('single');
  const [showStartCalendar, setShowStartCalendar] = React.useState(false);
  const [showEndCalendar, setShowEndCalendar] = React.useState(false);
  const [showUntilCalendar, setShowUntilCalendar] = React.useState(false);

  // Set initial form values (with dates stored as numbers)
  const initialValues: DateFormValues = {
    id: uuidv4(),
    venueId: '',
    dateType: 'single',
    dates: [],
    startDate: formatDateNumber(new Date()),
    isDateRange: false,
    isSingleDay: true,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {
      // If we are editing an existing date, update it; otherwise add new.
      if (editingDateId) {
        const updatedDate: DateFormValues = { ...formik.values, dateType };
        setDateList(
          dateList.map((date) =>
            date.id === editingDateId ? updatedDate : date
          )
        );
        toast({
          title: 'Date updated',
          description: 'Your event date has been updated.',
        });
        setEditingDateId(null);
      } else {
        const dateToAdd: DateFormValues = { ...formik.values, dateType };
        setDateList([...dateList, dateToAdd]);
        toast({
          title: 'Date added',
          description: 'Your event date has been added.',
        });
      }
      // Reset the form while preserving the venue selection.
      const venueId = formik.values.venueId;
      formik.resetForm({
        values: {
          id: uuidv4(),
          venueId,
          dateType: dateType,
          dates: [],
          startDate: formatDateNumber(new Date()),
          endDate:
            dateType === 'range'
              ? formatDateNumber(addDays(new Date(), 3))
              : undefined,
          isDateRange: dateType === 'range',
          isSingleDay: dateType === 'single',
          recurringType: dateType === 'recurring' ? 'weekly' : undefined,
          recurringUntil:
            dateType === 'recurring'
              ? formatDateNumber(addWeeks(new Date(), 8))
              : undefined,
          recurringDays: dateType === 'recurring' ? [1, 3, 5] : undefined,
        },
      });
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  // When the date type changes, reset the form but keep the venue.
  useEffect(() => {
    const venueId = formik.values.venueId;
    formik.resetForm({
      values: {
        id: uuidv4(),
        venueId,
        dateType: dateType,
        dates: [],
        startDate: formatDateNumber(new Date()),
        endDate:
          dateType === 'range'
            ? formatDateNumber(addDays(new Date(), 3))
            : undefined,
        isDateRange: dateType === 'range',
        isSingleDay: dateType === 'single',
        recurringType: dateType === 'recurring' ? 'weekly' : undefined,
        recurringUntil:
          dateType === 'recurring'
            ? formatDateNumber(addWeeks(new Date(), 8))
            : undefined,
        recurringDays: dateType === 'recurring' ? [1, 3, 5] : undefined,
      },
    });
  }, [dateType]);

  const handleDateTypeChange = (value: string) => {
    const newType = value as 'single' | 'range' | 'recurring';
    setDateType(newType);
  };

  // When an added date is edited, populate form with that value and set editingDateId.
  const handleEditDate = (date: DateFormValues) => {
    setEditingDateId(date.id);
    formik.setValues(date);
  };

  const handleRemoveDate = (id: string) => {
    setDateList(dateList.filter((date) => date.id !== id));
    toast({
      title: 'Date removed',
      description: 'The date has been removed from your event.',
    });
    // If we were editing the removed date, cancel editing.
    if (editingDateId === id) {
      setEditingDateId(null);
      formik.resetForm({
        values: {
          id: uuidv4(),
          venueId: '',
          dateType: dateType,
          dates: [],
          startDate: formatDateNumber(new Date()),
          endDate:
            dateType === 'range'
              ? formatDateNumber(addDays(new Date(), 3))
              : undefined,
          isDateRange: dateType === 'range',
          isSingleDay: dateType === 'single',
          recurringType: dateType === 'recurring' ? 'weekly' : undefined,
          recurringUntil:
            dateType === 'recurring'
              ? formatDateNumber(addWeeks(new Date(), 8))
              : undefined,
          recurringDays: dateType === 'recurring' ? [1, 3, 5] : undefined,
        },
      });
    }
  };

  const handleSubmit = () => {
    if (dateList.length === 0) {
      toast({
        title: 'No dates added',
        description: 'Please add at least one date for your event.',
        variant: 'destructive',
      });
      return;
    }
    onSubmit(dateList);
  };

  // Calendar selection handlers.
  const handleStartDateSelect = (date: Date) => {
    formik.setFieldValue('startDate', formatDateNumber(date));
    setShowStartCalendar(false);
    if (
      formik.values.endDate &&
      isBefore(parseDateNumber(formik.values.endDate), date)
    ) {
      formik.setFieldValue('endDate', formatDateNumber(addDays(date, 1)));
    }
  };

  const handleEndDateSelect = (date: Date) => {
    formik.setFieldValue('endDate', formatDateNumber(date));
    setShowEndCalendar(false);
  };

  const handleUntilDateSelect = (date: Date) => {
    formik.setFieldValue('recurringUntil', formatDateNumber(date));
    setShowUntilCalendar(false);
  };

  // Helper to format the display string based on date type.
  const formatDateDisplay = (date: DateFormValues) => {
    switch (date.dateType) {
      case 'single':
        return `${format(parseDateNumber(date.startDate), 'MMMM d, yyyy')}`;
      case 'range':
        return `${format(parseDateNumber(date.startDate), 'MMM d')} - ${format(
          parseDateNumber(date.endDate!),
          'MMM d, yyyy'
        )}`;
      case 'recurring': {
        const frequencyText =
          date.recurringType === 'daily'
            ? 'Daily'
            : date.recurringType === 'weekly'
              ? 'Weekly'
              : 'Monthly';
        return `${frequencyText} from ${format(
          parseDateNumber(date.startDate),
          'MMM d'
        )} until ${format(parseDateNumber(date.recurringUntil!), 'MMM d, yyyy')}`;
      }
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
    <Card className='shadow-md'>
      <CardContent className='pt-6'>
        <h2 className='text-xl font-semibold mb-4 text-[#24005b]'>
          Event Dates
        </h2>
        <Tabs defaultValue='single' onValueChange={handleDateTypeChange}>
          <TabsList className='mb-4 bg-[#24005b]/10'>
            <TabsTrigger
              value='single'
              className='data-[state=active]:bg-[#24005b] data-[state=active]:text-white'
            >
              Single Date
            </TabsTrigger>
            <TabsTrigger
              value='range'
              className='data-[state=active]:bg-[#24005b] data-[state=active]:text-white'
            >
              Date Range
            </TabsTrigger>
            <TabsTrigger
              value='recurring'
              className='data-[state=active]:bg-[#24005b] data-[state=active]:text-white'
            >
              Recurring Dates
            </TabsTrigger>
          </TabsList>

          {/* SINGLE DATE TAB */}
          <TabsContent
            value='single'
            className='border rounded-lg p-4 bg-gray-50'
          >
            <h3 className='font-medium mb-3 flex items-center text-[#24005b]'>
              <Calendar className='h-4 w-4 mr-2' />
              Add Single Date
            </h3>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2 relative'>
                <Label htmlFor='startDate'>Event Date</Label>
                <div className='relative'>
                  <Input
                    id='startDate'
                    value={format(
                      parseDateNumber(formik.values.startDate),
                      'MMMM dd, yyyy'
                    )}
                    onClick={() => setShowStartCalendar(!showStartCalendar)}
                    readOnly
                    className={`cursor-pointer ${formik.errors.startDate ? 'border-red-500' : ''}`}
                  />
                  <Calendar
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[#24005b] pointer-events-none'
                    size={16}
                  />
                </div>
                {formik.errors.startDate && (
                  <p className='text-red-500 text-sm'>
                    {formik.errors.startDate as string}
                  </p>
                )}
                {showStartCalendar && (
                  <div className='relative z-10 mt-1'>
                    <DatePickerCalendar
                      selected={parseDateNumber(formik.values.startDate)}
                      onSelect={handleStartDateSelect}
                      onClose={() => setShowStartCalendar(false)}
                    />
                  </div>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='venueId'>Venue</Label>
                <Select
                  value={formik.values.venueId}
                  onValueChange={(value) =>
                    formik.setFieldValue('venueId', value)
                  }
                >
                  <SelectTrigger id='venueId' className='border bg-white'>
                    <SelectValue placeholder='Select venue' />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.tba ? `TBA Venue in ${venue.city}` : venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* DATE RANGE TAB */}
          <TabsContent
            value='range'
            className='border rounded-lg p-4 bg-gray-50'
          >
            <h3 className='font-medium mb-3 flex items-center text-[#24005b]'>
              <Calendar className='h-4 w-4 mr-2' />
              Add Date Range
            </h3>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2 relative'>
                <Label htmlFor='rangeStartDate'>Start Date</Label>
                <div className='relative'>
                  <Input
                    id='rangeStartDate'
                    value={format(
                      parseDateNumber(formik.values.startDate),
                      'MMMM dd, yyyy'
                    )}
                    onClick={() => setShowStartCalendar(!showStartCalendar)}
                    readOnly
                    className={`cursor-pointer ${formik.errors.startDate ? 'border-red-500' : ''}`}
                  />
                  <Calendar
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[#24005b] pointer-events-none'
                    size={16}
                  />
                </div>
                {formik.errors.startDate && (
                  <p className='text-red-500 text-sm'>
                    {formik.errors.startDate as string}
                  </p>
                )}
                {showStartCalendar && (
                  <div className='relative z-10 mt-1'>
                    <DatePickerCalendar
                      selected={parseDateNumber(formik.values.startDate)}
                      onSelect={handleStartDateSelect}
                      onClose={() => setShowStartCalendar(false)}
                    />
                  </div>
                )}
              </div>
              <div className='space-y-2 relative'>
                <Label htmlFor='rangeEndDate'>End Date</Label>
                <div className='relative'>
                  <Input
                    id='rangeEndDate'
                    value={
                      formik.values.endDate
                        ? format(
                            parseDateNumber(formik.values.endDate),
                            'MMMM dd, yyyy'
                          )
                        : ''
                    }
                    onClick={() => setShowEndCalendar(!showEndCalendar)}
                    readOnly
                    className={`cursor-pointer ${formik.errors.endDate ? 'border-red-500' : ''}`}
                  />
                  <Calendar
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[#24005b] pointer-events-none'
                    size={16}
                  />
                </div>
                {formik.errors.endDate && (
                  <p className='text-red-500 text-sm'>
                    {formik.errors.endDate as string}
                  </p>
                )}
                {showEndCalendar && (
                  <div className='relative z-10 mt-1'>
                    <DatePickerCalendar
                      selected={
                        formik.values.endDate
                          ? parseDateNumber(formik.values.endDate)
                          : addDays(parseDateNumber(formik.values.startDate), 1)
                      }
                      onSelect={handleEndDateSelect}
                      onClose={() => setShowEndCalendar(false)}
                      minDate={addDays(
                        parseDateNumber(formik.values.startDate),
                        1
                      )}
                    />
                  </div>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='rangeVenueId'>Venue</Label>
                <Select
                  value={formik.values.venueId}
                  onValueChange={(value) =>
                    formik.setFieldValue('venueId', value)
                  }
                >
                  <SelectTrigger id='rangeVenueId' className='border bg-white'>
                    <SelectValue placeholder='Select venue' />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.tba ? `TBA Venue in ${venue.city}` : venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* RECURRING DATES TAB */}
          <TabsContent
            value='recurring'
            className='border rounded-lg p-4 bg-gray-50'
          >
            <h3 className='font-medium mb-3 flex items-center text-[#24005b]'>
              <Repeat className='h-4 w-4 mr-2' />
              Add Recurring Dates
            </h3>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2 relative'>
                <Label htmlFor='recurringStartDate'>First Event Date</Label>
                <div className='relative'>
                  <Input
                    id='recurringStartDate'
                    value={format(
                      parseDateNumber(formik.values.startDate),
                      'MMMM dd, yyyy'
                    )}
                    onClick={() => setShowStartCalendar(!showStartCalendar)}
                    readOnly
                    className={`cursor-pointer ${formik.errors.startDate ? 'border-red-500' : ''}`}
                  />
                  <Calendar
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[#24005b] pointer-events-none'
                    size={16}
                  />
                </div>
                {formik.errors.startDate && (
                  <p className='text-red-500 text-sm'>
                    {formik.errors.startDate as string}
                  </p>
                )}
                {showStartCalendar && (
                  <div className='relative z-10 mt-1'>
                    <DatePickerCalendar
                      selected={parseDateNumber(formik.values.startDate)}
                      onSelect={handleStartDateSelect}
                      onClose={() => setShowStartCalendar(false)}
                    />
                  </div>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='recurringType'>Repeats</Label>
                <Select
                  value={formik.values.recurringType as string}
                  onValueChange={(value: any) =>
                    formik.setFieldValue('recurringType', value)
                  }
                >
                  <SelectTrigger
                    id='recurringType'
                    className={`border bg-white ${formik.errors.recurringType ? 'border-red-500' : ''}`}
                  >
                    <SelectValue placeholder='Select frequency' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='daily'>Daily</SelectItem>
                    <SelectItem value='weekly'>Weekly</SelectItem>
                    <SelectItem value='monthly'>Monthly</SelectItem>
                  </SelectContent>
                </Select>
                {formik.errors.recurringType && (
                  <p className='text-red-500 text-sm'>
                    {formik.errors.recurringType as string}
                  </p>
                )}
              </div>
              {formik.values.recurringType === 'weekly' && (
                <div className='space-y-2 sm:col-span-2'>
                  <Label>Repeats On</Label>
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {weekDays.map((day) => (
                      <Button
                        key={day.value}
                        type='button'
                        variant={
                          formik.values.recurringDays?.includes(
                            parseInt(day.value)
                          )
                            ? 'default'
                            : 'outline'
                        }
                        className={`h-10 w-10 p-0 rounded-full ${
                          formik.values.recurringDays?.includes(
                            parseInt(day.value)
                          )
                            ? 'bg-[#24005b] hover:bg-[#24005b]/90'
                            : 'hover:bg-[#24005b]/10'
                        }`}
                        onClick={() => {
                          const dayNum = parseInt(day.value);
                          const currentDays = formik.values.recurringDays || [];
                          if (currentDays.includes(dayNum)) {
                            formik.setFieldValue(
                              'recurringDays',
                              currentDays.filter((d) => d !== dayNum)
                            );
                          } else {
                            formik.setFieldValue(
                              'recurringDays',
                              [...currentDays, dayNum].sort()
                            );
                          }
                        }}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div className='space-y-2 relative'>
                <Label htmlFor='recurringUntil'>Repeats Until</Label>
                <div className='relative'>
                  <Input
                    id='recurringUntil'
                    value={
                      formik.values.recurringUntil
                        ? format(
                            parseDateNumber(formik.values.recurringUntil),
                            'MMMM dd, yyyy'
                          )
                        : ''
                    }
                    onClick={() => setShowUntilCalendar(!showUntilCalendar)}
                    readOnly
                    className={`cursor-pointer ${formik.errors.recurringUntil ? 'border-red-500' : ''}`}
                  />
                  <Calendar
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[#24005b] pointer-events-none'
                    size={16}
                  />
                </div>
                {formik.errors.recurringUntil && (
                  <p className='text-red-500 text-sm'>
                    {formik.errors.recurringUntil as string}
                  </p>
                )}
                {showUntilCalendar && (
                  <div className='relative z-10 mt-1'>
                    <DatePickerCalendar
                      selected={
                        formik.values.recurringUntil
                          ? parseDateNumber(formik.values.recurringUntil)
                          : addWeeks(
                              parseDateNumber(formik.values.startDate),
                              4
                            )
                      }
                      onSelect={handleUntilDateSelect}
                      onClose={() => setShowUntilCalendar(false)}
                      minDate={addDays(
                        parseDateNumber(formik.values.startDate),
                        1
                      )}
                    />
                  </div>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='recurringVenueId'>Venue</Label>
                <Select
                  value={formik.values.venueId}
                  onValueChange={(value) =>
                    formik.setFieldValue('venueId', value)
                  }
                >
                  <SelectTrigger
                    id='recurringVenueId'
                    className='border bg-white'
                  >
                    <SelectValue placeholder='Select venue' />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.tba ? `TBA Venue in ${venue.city}` : venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className='flex items-center'>
          <Button
            onClick={() => formik.handleSubmit()}
            className='mt-4 flex items-center bg-[#24005b] hover:bg-[#24005b]/90'
            variant='default'
          >
            <Plus className='h-4 w-4 mr-2' />{' '}
            {editingDateId ? 'Update Date' : 'Add Date'}
          </Button>
          {editingDateId && (
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                setEditingDateId(null);
                formik.resetForm({
                  values: {
                    id: uuidv4(),
                    venueId: '',
                    dateType: dateType,
                    dates: [],
                    startDate: formatDateNumber(new Date()),
                    endDate:
                      dateType === 'range'
                        ? formatDateNumber(addDays(new Date(), 3))
                        : undefined,
                    isDateRange: dateType === 'range',
                    isSingleDay: dateType === 'single',
                    recurringType:
                      dateType === 'recurring' ? 'weekly' : undefined,
                    recurringUntil:
                      dateType === 'recurring'
                        ? formatDateNumber(addWeeks(new Date(), 8))
                        : undefined,
                    recurringDays:
                      dateType === 'recurring' ? [1, 3, 5] : undefined,
                  },
                });
              }}
              className='mt-4 ms-2'
            >
              Cancel Edit
            </Button>
          )}
        </div>

        {dateList.length > 0 && (
          <div className='mb-6 mt-6'>
            <h3 className='font-medium mb-3 text-[#24005b]'>Added Dates</h3>
            <div className='space-y-3 max-h-60 overflow-y-auto pr-2'>
              {dateList.map((date) => {
                // Look up the selected venue.
                const selectedVenue = venues.find((v) => v.id === date.venueId);
                return (
                  <div
                    key={date.id}
                    className='border rounded-lg p-3 bg-white flex justify-between items-start shadow-sm hover:shadow-md transition-shadow'
                  >
                    <div>
                      <h4 className='font-medium text-[#24005b]'>
                        {formatDateDisplay(date)}
                      </h4>
                      <p className='text-sm text-gray-600'>
                        {selectedVenue
                          ? `${selectedVenue.name}${selectedVenue.city ? ` (${selectedVenue.city})` : ''}`
                          : 'No venue selected'}
                      </p>
                    </div>
                    <div className='flex space-x-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleEditDate(date)}
                        className='text-purple-950'
                      >
                        <EditIcon className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleRemoveDate(date.id)}
                        className='text-purple-950 '
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className='flex justify-between mt-6'>
          <Button
            type='button'
            variant='outline'
            onClick={onBack}
            className='border-[#24005b]/30 text-[#24005b] hover:bg-[#24005b]/10'
          >
            Back
          </Button>
          <Button
            type='button'
            onClick={handleSubmit}
            className='flex items-center bg-[#24005b] hover:bg-[#24005b]/90'
          >
            Next: Time Slots <ChevronRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateStep;
