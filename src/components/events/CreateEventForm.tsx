
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
import { EventDateTimeSelector, EventDateTime } from './EventDateTimeSelector';
import { TicketTypeSelector, TicketType } from './TicketTypeSelector';

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

// Define form validation schema
const EventSchema = Yup.object().shape({
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

// Define the form values interface
interface EventFormValues {
  title: string;
  category: string;
  description: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
}

export const CreateEventForm = () => {
  const [dateTimeList, setDateTimeList] = useState<EventDateTime[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);

  const initialValues: EventFormValues = {
    title: '',
    category: '',
    description: '',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
  };

  const handleSubmit = (values: EventFormValues, { setSubmitting, resetForm }: any) => {
    // Validate that we have at least one date/time
    if (dateTimeList.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one event date and time",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    // Validate that we have at least one ticket type
    if (ticketTypes.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one ticket type",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    // Combine all data
    const eventData = {
      ...values,
      dateTimeList,
      ticketTypes,
    };

    // Simulate API call
    setTimeout(() => {
      console.log('Event data submitted:', eventData);
      
      toast({
        title: "Success",
        description: "Your event has been created successfully",
      });
      
      // Reset the form
      resetForm();
      setDateTimeList([]);
      setTicketTypes([]);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={EventSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, setFieldValue, values }) => (
        <Form className="space-y-8">
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
                    className={errors.title && touched.title ? "border-red-500" : ""}
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={values.category}
                    onValueChange={(value) => setFieldValue('category', value)}
                  >
                    <SelectTrigger id="category" className={errors.category && touched.category ? "border-red-500" : ""}>
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
                    className={errors.description && touched.description ? "border-red-500" : ""}
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Organizer Information</h2>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="organizerName">Organizer Name</Label>
                  <Field
                    as={Input}
                    id="organizerName"
                    name="organizerName"
                    placeholder="Enter organizer name"
                    className={errors.organizerName && touched.organizerName ? "border-red-500" : ""}
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
                    className={errors.organizerEmail && touched.organizerEmail ? "border-red-500" : ""}
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
                    className={errors.organizerPhone && touched.organizerPhone ? "border-red-500" : ""}
                  />
                  <ErrorMessage name="organizerPhone" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <EventDateTimeSelector
                value={dateTimeList}
                onChange={setDateTimeList}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <TicketTypeSelector
                value={ticketTypes}
                onChange={setTicketTypes}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button" 
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
