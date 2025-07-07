
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export const BasicDetailsSchema = Yup.object().shape({
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

export interface BasicDetailsFormValues {
  title: string;
  category: string;
  description: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  additionalInfo?: string;
  terms?: string;
}

interface BasicDetailsStepProps {
  initialValues: BasicDetailsFormValues;
  onSubmit: (values: BasicDetailsFormValues) => void;
}

export const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({ initialValues, onSubmit }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <Formik
          initialValues={initialValues}
          validationSchema={BasicDetailsSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form>
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
                  type="submit"
                  className="flex items-center"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  Next: Venues <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};
