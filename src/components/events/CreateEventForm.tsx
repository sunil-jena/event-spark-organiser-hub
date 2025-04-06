import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { EventLocationSelector } from './EventLocationSelector';
import { EventDateTimeSelector, EventDateTime } from './EventDateTimeSelector';
import { TicketTypeSelector, TicketType } from './TicketTypeSelector';
import { EventMediaSelector } from './EventMediaSelector';
import { Check, ChevronRight } from 'lucide-react';

// Define the event categories
const EVENT_CATEGORIES = [
  { value: 'music', label: 'Music & Concerts' },
  { value: 'workshops', label: 'Workshops' },
  { value: 'business', label: 'Business' },
  { value: 'dance', label: 'Dance' },
  { value: 'comedy', label: 'Comedy Shows' },
  { value: 'film', label: 'Film Screenings' },
  { value: 'awards', label: 'Award Ceremonies' },
  { value: 'other', label: 'Other' },
];

// Create validation schemas for each step
const BasicDetailsSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  category: Yup.string()
    .required('Category is required'),
  description: Yup.string()
    .min(20, 'Description must be at least 20 characters')
    .required('Description is required'),
  organizerName: Yup.string()
    .required('Organizer name is required'),
  organizerEmail: Yup.string()
    .email('Invalid email address')
    .required('Organizer email is required'),
  organizerPhone: Yup.string()
    .matches(/^[0-9\+\-\(\) ]+$/, 'Invalid phone number')
    .required('Organizer phone is required'),
});

// Location validation handled in the component
// Date/time validation handled in the component
// Ticket validation handled in the component

// Define the form values interface
interface EventFormValues {
  title: string;
  category: string;
  description: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  additionalInfo?: string;
  terms?: string;
}

// Define locations structure
export interface EventLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
}

type StepStatus = 'incomplete' | 'current' | 'complete';

interface StepState {
  basicDetails: StepStatus;
  locations: StepStatus;
  dates: StepStatus;
  tickets: StepStatus;
  media: StepStatus;
  review: StepStatus;
}

export const CreateEventForm = () => {
  const [step, setStep] = useState<keyof StepState>('basicDetails');
  const [stepStatus, setStepStatus] = useState<StepState>({
    basicDetails: 'current',
    locations: 'incomplete',
    dates: 'incomplete',
    tickets: 'incomplete',
    media: 'incomplete',
    review: 'incomplete'
  });

  const [locations, setLocations] = useState<EventLocation[]>([]);
  const [dateTimeList, setDateTimeList] = useState<EventDateTime[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const initialValues: EventFormValues = {
    title: '',
    category: '',
    description: '',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    additionalInfo: '',
    terms: '',
  };

  const moveToStep = (nextStep: keyof StepState) => {
    // Mark current step as complete
    setStepStatus(prev => ({
      ...prev,
      [step]: 'complete',
      [nextStep]: 'current'
    }));
    setStep(nextStep);
  };

  const validateStep = (currentStep: keyof StepState): boolean => {
    switch (currentStep) {
      case 'locations': 
        return locations.length > 0;
      case 'dates':
        return dateTimeList.length > 0;
      case 'tickets':
        return ticketTypes.length > 0;
      case 'media':
        return true; // Media is optional
      default:
        return true;
    }
  };

  const handleSubmit = (values: EventFormValues) => {
    // Combine all data
    const eventData = {
      ...values,
      locations,
      dateTimeList,
      ticketTypes,
      // mediaFiles will be handled separately in a real implementation
    };

    // Simulate API call
    setTimeout(() => {
      console.log('Event data submitted:', eventData);
      
      toast({
        title: "Success",
        description: "Your event has been created successfully",
      });
      
      // Reset the form state
      setStep('basicDetails');
      setStepStatus({
        basicDetails: 'current',
        locations: 'incomplete',
        dates: 'incomplete',
        tickets: 'incomplete',
        media: 'incomplete',
        review: 'incomplete'
      });
      setLocations([]);
      setDateTimeList([]);
      setTicketTypes([]);
      setMediaFiles([]);
    }, 1000);
  };

  const renderBasicDetails = (formik: any) => (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Event Details</h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Field
              as={Input}
              id="title"
              name="title"
              placeholder="Enter event title"
              className={formik.errors.title && formik.touched.title ? "border-red-500" : ""}
            />
            <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formik.values.category}
              onValueChange={(value) => formik.setFieldValue('category', value)}
            >
              <SelectTrigger id="category" className={formik.errors.category && formik.touched.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Field
              as={Textarea}
              id="description"
              name="description"
              placeholder="Describe your event"
              rows={5}
              className={formik.errors.description && formik.touched.description ? "border-red-500" : ""}
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 mt-6">Organizer Information</h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="organizerName">Organizer Name</Label>
            <Field
              as={Input}
              id="organizerName"
              name="organizerName"
              placeholder="Enter organizer name"
              className={formik.errors.organizerName && formik.touched.organizerName ? "border-red-500" : ""}
            />
            <ErrorMessage name="organizerName" component="div" className="text-red-500 text-sm" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="organizerEmail">Email</Label>
            <Field
              as={Input}
              id="organizerEmail"
              name="organizerEmail"
              placeholder="Enter email address"
              type="email"
              className={formik.errors.organizerEmail && formik.touched.organizerEmail ? "border-red-500" : ""}
            />
            <ErrorMessage name="organizerEmail" component="div" className="text-red-500 text-sm" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="organizerPhone">Phone</Label>
            <Field
              as={Input}
              id="organizerPhone"
              name="organizerPhone"
              placeholder="Enter phone number"
              className={formik.errors.organizerPhone && formik.touched.organizerPhone ? "border-red-500" : ""}
            />
            <ErrorMessage name="organizerPhone" component="div" className="text-red-500 text-sm" />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            type="button"
            onClick={() => {
              if (formik.isValid && formik.dirty) {
                moveToStep('locations');
              } else {
                formik.validateForm();
              }
            }}
            className="flex items-center"
          >
            Next: Locations <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderLocations = () => (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Event Locations</h2>
        
        <EventLocationSelector
          value={locations}
          onChange={setLocations}
        />

        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setStep('basicDetails')}
          >
            Back
          </Button>
          <Button 
            type="button"
            onClick={() => {
              if (validateStep('locations')) {
                moveToStep('dates');
              } else {
                toast({
                  title: "Validation Error",
                  description: "Please add at least one event location",
                  variant: "destructive",
                });
              }
            }}
            className="flex items-center"
          >
            Next: Dates <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderDates = () => (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Event Dates and Times</h2>
        
        <EventDateTimeSelector
          value={dateTimeList}
          onChange={setDateTimeList}
          locations={locations}
        />

        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setStep('locations')}
          >
            Back
          </Button>
          <Button 
            type="button"
            onClick={() => {
              if (validateStep('dates')) {
                moveToStep('tickets');
              } else {
                toast({
                  title: "Validation Error",
                  description: "Please add at least one event date and time",
                  variant: "destructive",
                });
              }
            }}
            className="flex items-center"
          >
            Next: Tickets <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderTickets = () => (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Ticket Information</h2>
        
        <TicketTypeSelector
          value={ticketTypes}
          onChange={setTicketTypes}
          dateTimeList={dateTimeList}
          locations={locations}
        />

        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setStep('dates')}
          >
            Back
          </Button>
          <Button 
            type="button"
            onClick={() => {
              if (validateStep('tickets')) {
                moveToStep('media');
              } else {
                toast({
                  title: "Validation Error",
                  description: "Please add at least one ticket type",
                  variant: "destructive",
                });
              }
            }}
            className="flex items-center"
          >
            Next: Media <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderMedia = () => (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Event Media</h2>
        
        <EventMediaSelector
          value={mediaFiles}
          onChange={setMediaFiles}
        />

        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setStep('tickets')}
          >
            Back
          </Button>
          <Button 
            type="button"
            onClick={() => moveToStep('review')}
            className="flex items-center"
          >
            Next: Review <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderReview = (values: EventFormValues) => (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Review Your Event</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Basic Details</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p><strong>Title:</strong> {values.title}</p>
              <p><strong>Category:</strong> {EVENT_CATEGORIES.find(c => c.value === values.category)?.label}</p>
              <p><strong>Organizer:</strong> {values.organizerName}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Locations ({locations.length})</h3>
            <div className="bg-gray-50 p-4 rounded-md max-h-40 overflow-y-auto">
              {locations.map((loc, index) => (
                <div key={loc.id} className="mb-2 pb-2 border-b">
                  <p><strong>{index + 1}. {loc.name}</strong></p>
                  <p className="text-sm">{loc.address}, {loc.city}, {loc.state}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Dates and Times ({dateTimeList.length})</h3>
            <div className="bg-gray-50 p-4 rounded-md max-h-40 overflow-y-auto">
              {dateTimeList.map((dt, index) => (
                <div key={dt.id} className="mb-2 pb-2 border-b">
                  <p>
                    <strong>{index + 1}. </strong>
                    {dt.startDate.toLocaleDateString()} {dt.startTime} - {dt.endDate?.toLocaleDateString()} {dt.endTime}
                  </p>
                  <p className="text-sm">
                    Location: {locations.find(l => l.id === dt.locationId)?.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Tickets ({ticketTypes.length})</h3>
            <div className="bg-gray-50 p-4 rounded-md max-h-40 overflow-y-auto">
              {ticketTypes.map((ticket, index) => (
                <div key={ticket.id} className="mb-2 pb-2 border-b">
                  <p>
                    <strong>{index + 1}. {ticket.name}</strong> - ${ticket.price}
                  </p>
                  <p className="text-sm">Quantity: {ticket.quantity}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Media Files ({mediaFiles.length})</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              {mediaFiles.length > 0 ? (
                <ul>
                  {mediaFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No media files uploaded</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setStep('media')}
          >
            Back
          </Button>
          <Button 
            type="submit"
            className="flex items-center"
          >
            Create Event <Check className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="hidden sm:block mb-8">
        <div className="flex justify-between">
          <div className={`flex-1 mx-2 ${stepStatus.basicDetails !== 'incomplete' ? 'text-primary' : 'text-gray-400'}`}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                stepStatus.basicDetails === 'complete' ? 'bg-primary text-white border-primary' : 
                stepStatus.basicDetails === 'current' ? 'border-primary text-primary' : 'border-gray-300'
              }`}>
                {stepStatus.basicDetails === 'complete' ? <Check className="h-4 w-4" /> : 1}
              </div>
              <span className="mt-1 text-sm">Details</span>
            </div>
          </div>
          <div className={`flex-1 mx-2 ${stepStatus.locations !== 'incomplete' ? 'text-primary' : 'text-gray-400'}`}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                stepStatus.locations === 'complete' ? 'bg-primary text-white border-primary' : 
                stepStatus.locations === 'current' ? 'border-primary text-primary' : 'border-gray-300'
              }`}>
                {stepStatus.locations === 'complete' ? <Check className="h-4 w-4" /> : 2}
              </div>
              <span className="mt-1 text-sm">Locations</span>
            </div>
          </div>
          <div className={`flex-1 mx-2 ${stepStatus.dates !== 'incomplete' ? 'text-primary' : 'text-gray-400'}`}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                stepStatus.dates === 'complete' ? 'bg-primary text-white border-primary' : 
                stepStatus.dates === 'current' ? 'border-primary text-primary' : 'border-gray-300'
              }`}>
                {stepStatus.dates === 'complete' ? <Check className="h-4 w-4" /> : 3}
              </div>
              <span className="mt-1 text-sm">Dates</span>
            </div>
          </div>
          <div className={`flex-1 mx-2 ${stepStatus.tickets !== 'incomplete' ? 'text-primary' : 'text-gray-400'}`}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                stepStatus.tickets === 'complete' ? 'bg-primary text-white border-primary' : 
                stepStatus.tickets === 'current' ? 'border-primary text-primary' : 'border-gray-300'
              }`}>
                {stepStatus.tickets === 'complete' ? <Check className="h-4 w-4" /> : 4}
              </div>
              <span className="mt-1 text-sm">Tickets</span>
            </div>
          </div>
          <div className={`flex-1 mx-2 ${stepStatus.media !== 'incomplete' ? 'text-primary' : 'text-gray-400'}`}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                stepStatus.media === 'complete' ? 'bg-primary text-white border-primary' : 
                stepStatus.media === 'current' ? 'border-primary text-primary' : 'border-gray-300'
              }`}>
                {stepStatus.media === 'complete' ? <Check className="h-4 w-4" /> : 5}
              </div>
              <span className="mt-1 text-sm">Media</span>
            </div>
          </div>
          <div className={`flex-1 mx-2 ${stepStatus.review !== 'incomplete' ? 'text-primary' : 'text-gray-400'}`}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                stepStatus.review === 'complete' ? 'bg-primary text-white border-primary' : 
                stepStatus.review === 'current' ? 'border-primary text-primary' : 'border-gray-300'
              }`}>
                {stepStatus.review === 'complete' ? <Check className="h-4 w-4" /> : 6}
              </div>
              <span className="mt-1 text-sm">Review</span>
            </div>
          </div>
        </div>
        <div className="relative flex items-center justify-center mt-2">
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-gray-200"></div>
        </div>
      </div>

      {/* Mobile step indicator */}
      <div className="block sm:hidden mb-4">
        <Select
          value={step}
          onValueChange={(value) => setStep(value as keyof StepState)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select step" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basicDetails">1. Basic Details</SelectItem>
            <SelectItem value="locations">2. Locations</SelectItem>
            <SelectItem value="dates">3. Dates & Times</SelectItem>
            <SelectItem value="tickets">4. Tickets</SelectItem>
            <SelectItem value="media">5. Media</SelectItem>
            <SelectItem value="review">6. Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={BasicDetailsSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <Form>
            {step === 'basicDetails' && renderBasicDetails(formikProps)}
            {step === 'locations' && renderLocations()}
            {step === 'dates' && renderDates()}
            {step === 'tickets' && renderTickets()}
            {step === 'media' && renderMedia()}
            {step === 'review' && renderReview(formikProps.values)}
          </Form>
        )}
      </Formik>
    </div>
  );
};
