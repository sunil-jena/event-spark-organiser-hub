/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

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
});

export interface BasicDetailsFormValues {
  title: string;
  category: string;
  description: string;
  tga?: any[]
  additionalInfo?: string;
  terms?: string;
}

interface BasicDetailsStepProps {
  initialValues: BasicDetailsFormValues;
  onSubmit: (values: BasicDetailsFormValues) => void;
}

export const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({ initialValues, onSubmit }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };


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
                <div >
                  <Label>Event Tags</Label>
                  <div className="flex items-center mt-1.5 space-x-2">
                    <Input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      placeholder="Add tags (press Enter)"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
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
