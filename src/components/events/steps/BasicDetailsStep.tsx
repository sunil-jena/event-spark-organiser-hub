
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { useFormik } from 'formik';
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
import { BasicDetailsFormValues } from './types';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

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

interface BasicDetailsStepProps {
  initialValues: BasicDetailsFormValues;
  onSubmit: (values: BasicDetailsFormValues) => void;
}

export const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({ initialValues, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      ...initialValues,
      tagInput: '', // Helper field for tag input
    },
    validationSchema: BasicDetailsSchema,
    onSubmit: (values) => {
      // Extract helper fields before submission
      const { tagInput, ...formData } = values;
      onSubmit(formData);
    },
  });

  const addTag = () => {
    const newTag = formik.values.tagInput.trim();
    if (newTag && !formik.values.tags.includes(newTag)) {
      formik.setFieldValue('tags', [...formik.values.tags, newTag]);
      formik.setFieldValue('tagInput', '');
    }
  };

  const removeTag = (tagToRemove: string) => {
    formik.setFieldValue('tags', formik.values.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={formik.handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter event title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.title && formik.touched.title ? "border-red-500" : ""}
              />
              {formik.errors.title && formik.touched.title && (
                <div className="text-red-500 text-sm">{formik.errors.title}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formik.values.category}
                onValueChange={value => formik.setFieldValue('category', value)}
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
              {formik.errors.category && formik.touched.category && (
                <div className="text-red-500 text-sm">{formik.errors.category}</div>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your event"
                rows={5}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.description && formik.touched.description ? "border-red-500" : ""}
              />
              {formik.errors.description && formik.touched.description && (
                <div className="text-red-500 text-sm">{formik.errors.description}</div>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Event Type</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="eventTypePublic"
                    name="eventType"
                    value="public"
                    checked={formik.values.eventType === 'public'}
                    onChange={() => formik.setFieldValue('eventType', 'public')}
                    className="h-4 w-4 text-primary"
                  />
                  <Label htmlFor="eventTypePublic" className="cursor-pointer">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="eventTypePrivate"
                    name="eventType"
                    value="private"
                    checked={formik.values.eventType === 'private'}
                    onChange={() => formik.setFieldValue('eventType', 'private')}
                    className="h-4 w-4 text-primary"
                  />
                  <Label htmlFor="eventTypePrivate" className="cursor-pointer">Private</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="layout">Layout</Label>
              <Select
                value={formik.values.layout}
                onValueChange={value => formik.setFieldValue('layout', value)}
              >
                <SelectTrigger id="layout">
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indoor">Indoor</SelectItem>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageGroup">Minimum Age Group</Label>
              <Input
                id="ageGroup"
                name="ageGroup"
                type="number"
                min="0"
                value={formik.values.ageGroup}
                onChange={formik.handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Event Tags</Label>
              <div className="flex items-center mt-1.5 space-x-2">
                <Input
                  value={formik.values.tagInput}
                  onChange={e => formik.setFieldValue('tagInput', e.target.value)}
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
                {formik.values.tags.map((tag, index) => (
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
        </form>
      </CardContent>
    </Card>
  );
};
