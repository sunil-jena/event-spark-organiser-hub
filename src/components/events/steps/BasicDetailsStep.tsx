
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight, X, Globe, Lock, Users, Tag, Calendar, Video, MessageCircle, Star, MapPin, Baby, Dog } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from '@/components/ui/badge';
import { BasicDetailsFormValues } from './types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Checkbox } from '@/components/ui/checkbox';

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

// Define age groups
const AGE_GROUPS = [
  { value: 0, label: 'All Ages' },
  { value: 5, label: '5+' },
  { value: 9, label: '9+' },
  { value: 12, label: '12+' },
  { value: 16, label: '16+' },
  { value: 18, label: '18+' },
  { value: 21, label: '21+' },
];

// Define language options with Indian languages
const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Bengali', label: 'Bengali' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'Tamil', label: 'Tamil' },
  { value: 'Urdu', label: 'Urdu' },
  { value: 'Gujarati', label: 'Gujarati' },
  { value: 'Kannada', label: 'Kannada' },
  { value: 'Odia', label: 'Odia' },
  { value: 'Punjabi', label: 'Punjabi' },
  { value: 'Malayalam', label: 'Malayalam' },
  { value: 'Assamese', label: 'Assamese' },
  { value: 'Maithili', label: 'Maithili' },
  { value: 'Sanskrit', label: 'Sanskrit' },
  { value: 'Kashmiri', label: 'Kashmiri' },
  { value: 'Nepali', label: 'Nepali' },
  { value: 'Konkani', label: 'Konkani' },
  { value: 'Sindhi', label: 'Sindhi' },
  { value: 'Bodo', label: 'Bodo' },
  { value: 'Santali', label: 'Santali' },
  { value: 'Dogri', label: 'Dogri' },
  // Add other international languages
  // { value: 'Spanish', label: 'Spanish' },
  // { value: 'French', label: 'French' },
  // { value: 'German', label: 'German' },
  // { value: 'Chinese', label: 'Chinese' },
  // { value: 'Japanese', label: 'Japanese' },
  // { value: 'Korean', label: 'Korean' },
  // { value: 'Arabic', label: 'Arabic' },
  // { value: 'Portuguese', label: 'Portuguese' },
];

// Define seating arrangements
const SEATING_ARRANGEMENTS = [
  { value: 'seating', label: 'Seating' },
  { value: 'standing', label: 'Standing' },
  { value: 'both', label: 'Seating & Standing' },
];

// Define video conferencing providers
const VIDEO_PROVIDERS = [
  { value: 'zoom', label: 'Zoom' },
  { value: 'teams', label: 'Microsoft Teams' },
  { value: 'meet', label: 'Google Meet' },
  { value: 'webex', label: 'Cisco Webex' },
  { value: 'other', label: 'Other' },
];

// Define options for yes/no
const YES_NO_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'limited', label: 'Limited/Partially' },
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
  videoConferenceUrl: Yup.string()
    .when('isOnline', {
      is: true,
      then: (schema) => schema.url('Please enter a valid URL').required('Video conference URL is required for online events'),
    }),
});

interface BasicDetailsStepProps {
  initialValues: BasicDetailsFormValues;
  onSubmit: (values: BasicDetailsFormValues) => void;
}

export const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({ initialValues, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      ...initialValues,
      tags: [],
      eventHighlights: [],
      language: [],
      tagInput: '', // Helper field for tag input
      highlightInput: '', // Helper field for event highlights
    },
    validationSchema: BasicDetailsSchema,
    onSubmit: (values) => {
      // Extract helper fields before submission
      const { tagInput, highlightInput, ...formData } = values;
      toast.success("Basic details saved successfully!");
      onSubmit(formData);
    },
  });

  // Tag handling functions
  const addTag = () => {
    const newTag = formik?.values?.tagInput?.trim();
    if (newTag && !formik?.values?.tags?.includes(newTag)) {
      formik.setFieldValue('tags', [...formik.values.tags, newTag]);
      formik.setFieldValue('tagInput', '');
    }
  };

  const removeTag = (tagToRemove: string) => {
    formik.setFieldValue('tags', formik.values.tags.filter(tag => tag !== tagToRemove));
  };

  // Highlight handling functions
  const addHighlight = () => {
    const newHighlight = formik?.values?.highlightInput.trim();
    if (newHighlight && !formik?.values?.eventHighlights?.includes(newHighlight)) {
      formik.setFieldValue('eventHighlights', [...formik.values.eventHighlights, newHighlight]);
      formik.setFieldValue('highlightInput', '');
    }
  };

  const removeHighlight = (highlightToRemove: string) => {
    formik.setFieldValue('eventHighlights', formik.values.eventHighlights.filter(h => h !== highlightToRemove));
  };

  const addLanguage = (lang: string) => {
    if (!formik.values.language.includes(lang)) {
      formik.setFieldValue('language', [...formik.values.language, lang]);
    }
  };

  const removeLanguage = (langToRemove: string) => {
    formik.setFieldValue('language', formik.values.language.filter(lang => lang !== langToRemove));
  };

  const [categoryOpen, setCategoryOpen] = useState<boolean>(false);

  return (
    <Card className="shadow-lg border-gray-200">
      <CardContent className="pt-6">
        <form onSubmit={formik.handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-primary">Basic Event Details</h2>

          {/* Main Information Section */}
          <div className="grid gap-6 sm:grid-cols-2 mb-8">
            {/* Event Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Event Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter captivating event title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`transition-all ${formik.errors.title && formik.touched.title ? "border-red-500 focus:ring-red-500" : "focus:ring-primary"}`}
              />
              {formik.errors.title && formik.touched.title && (
                <div className="text-red-500 text-sm">{formik.errors.title}</div>
              )}
            </div>

            {/* Category - Now with search functionality */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </Label>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={categoryOpen}
                    className={`w-full justify-between ${formik.errors.category && formik.touched.category ? "border-red-500" : ""}`}
                  >
                    {formik.values.category
                      ? EVENT_CATEGORIES.find((category) => category.value === formik.values.category)?.label
                      : "Select event category"}
                    <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {EVENT_CATEGORIES.map((category) => (
                        <CommandItem
                          key={category.value}
                          value={category.value}
                          onSelect={(currentValue) => {
                            formik.setFieldValue('category', currentValue);
                            setCategoryOpen(false);
                          }}
                        >
                          <span>{category.label}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {formik.errors.category && formik.touched.category && (
                <div className="text-red-500 text-sm">{formik.errors.category}</div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Event Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your event in detail. What can attendees expect?"
                rows={5}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`transition-all ${formik.errors.description && formik.touched.description ? "border-red-500 focus:ring-red-500" : "focus:ring-primary"}`}
              />
              {formik.errors.description && formik.touched.description && (
                <div className="text-red-500 text-sm">{formik.errors.description}</div>
              )}
              <p className="text-muted-foreground text-xs">
                Minimum 20 characters. Provide detailed information to attract attendees.
              </p>
            </div>

            {/* About Message */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="aboutMessage" className="text-sm font-medium">
                About Message <span className="text-muted-foreground text-xs">(Optional)</span>
              </Label>
              <Textarea
                id="aboutMessage"
                name="aboutMessage"
                placeholder="Share additional information about the event organizer or special notes"
                rows={3}
                value={formik.values.aboutMessage}
                onChange={formik.handleChange}
                className="focus:ring-primary"
              />
              <p className="text-muted-foreground text-xs">
                This message will appear in the "About" section of your event page.
              </p>
            </div>
          </div>

          {/* Event Type Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-primary">Event Configuration</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Event Type - Public/Private - Improved for mobile */}
              <div className="space-y-3 sm:col-span-2">
                <Label className="text-sm font-medium">Event Visibility</Label>
                <RadioGroup
                  className="flex flex-col sm:flex-row gap-4"
                  value={formik.values.eventType}
                  onValueChange={(value) => formik.setFieldValue('eventType', value)}
                >
                  <div className="flex items-center space-x-2 bg-secondary/30 hover:bg-secondary/50 transition-colors p-3 rounded-lg flex-1 cursor-pointer" style={{ borderColor: "#24005b20" }}>
                    <RadioGroupItem value="public" id="eventTypePublic" style={{ color: "#24005b" }} />
                    <Label htmlFor="eventTypePublic" className="flex items-center cursor-pointer">
                      <Globe className="h-5 w-5 mr-2" style={{ color: "#24005b" }} />
                      <div>
                        <div className="font-medium">Public</div>
                        <p className="text-xs text-muted-foreground">Visible to anyone on the platform</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-secondary/30 hover:bg-secondary/50 transition-colors p-3 rounded-lg flex-1 cursor-pointer" style={{ borderColor: "#24005b20" }}>
                    <RadioGroupItem value="private" id="eventTypePrivate" style={{ color: "#24005b" }} />
                    <Label htmlFor="eventTypePrivate" className="flex items-center cursor-pointer">
                      <Lock className="h-5 w-5 mr-2" style={{ color: "#24005b" }} />
                      <div>
                        <div className="font-medium">Private</div>
                        <p className="text-xs text-muted-foreground">Only visible to invited attendees</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Is Online */}
              <div className="space-y-3 sm:col-span-2">
                <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-md">
                  <Checkbox
                    id="isOnline"
                    checked={formik.values.isOnline}
                    onCheckedChange={(checked) => formik.setFieldValue('isOnline', checked)}
                    className="data-[state=checked]:bg-[#24005b]"
                  />
                  <div className="ml-2">
                    <Label htmlFor="isOnline" className="text-sm font-medium">
                      This is an online event
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Virtual events use video conferencing platforms instead of physical venues
                    </p>
                  </div>
                </div>
              </div>

              {/* Online Event Details - Only show if isOnline is true */}
              {formik.values.isOnline && (
                <div className="space-y-6 p-6 border border-gray-200 rounded-md sm:col-span-2">
                  <h3 className="text-lg font-semibold">Online Event Details</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="videoConferenceProvider" className="text-sm font-medium">
                        Video Conference Provider
                      </Label>
                      <Select
                        value={formik.values.videoConferenceProvider}
                        onValueChange={value => formik.setFieldValue('videoConferenceProvider', value)}
                      >
                        <SelectTrigger id="videoConferenceProvider" className="w-full">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {VIDEO_PROVIDERS.map((provider) => (
                            <SelectItem key={provider.value} value={provider.value}>
                              {provider.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videoConferenceUrl" className="text-sm font-medium">
                        Meeting URL <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="videoConferenceUrl"
                        name="videoConferenceUrl"
                        placeholder="https://..."
                        value={formik.values.videoConferenceUrl}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`transition-all ${formik.errors.videoConferenceUrl && formik.touched.videoConferenceUrl ? "border-red-500" : ""}`}
                      />
                      {formik.errors.videoConferenceUrl && formik.touched.videoConferenceUrl && (
                        <div className="text-red-500 text-sm">{formik.errors.videoConferenceUrl}</div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        This will be shared with attendees before the event
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videoConferencePassword" className="text-sm font-medium">
                        Meeting Password <span className="text-muted-foreground text-xs">(Optional)</span>
                      </Label>
                      <Input
                        id="videoConferencePassword"
                        name="videoConferencePassword"
                        placeholder="Enter password if required"
                        value={formik.values.videoConferencePassword}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Only show physical venue related fields if not an online event */}
              {!formik.values.isOnline && (
                <>
                  {/* Layout */}
                  <div className="space-y-2">
                    <Label htmlFor="layout" className="text-sm font-medium">Event Layout</Label>
                    <Select
                      value={formik.values.layout}
                      onValueChange={value => formik.setFieldValue('layout', value)}
                    >
                      <SelectTrigger id="layout" className="w-full">
                        <SelectValue placeholder="Select venue layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indoor">Indoor</SelectItem>
                        <SelectItem value="outdoor">Outdoor</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Indoor & Outdoor)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      <MapPin className="inline h-3 w-3 mr-1" />
                      Select the physical arrangement of your event venue
                    </p>
                  </div>

                  {/* Seating Arrangement */}
                  <div className="space-y-2">
                    <Label htmlFor="seatingArrangementOption" className="text-sm font-medium">
                      Seating Arrangement
                    </Label>
                    <Select
                      value={formik.values.seatingArrangementOption}
                      onValueChange={value => formik.setFieldValue('seatingArrangementOption', value)}
                    >
                      <SelectTrigger id="seatingArrangementOption" className="w-full">
                        <SelectValue placeholder="How will attendees be seated?" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEATING_ARRANGEMENTS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Kid Friendly */}
                  <div className="space-y-2">
                    <Label htmlFor="kidFriendly" className="text-sm font-medium">
                      Kid Friendly
                    </Label>
                    <Select
                      value={formik.values.kidFriendly}
                      onValueChange={value => formik.setFieldValue('kidFriendly', value)}
                    >
                      <SelectTrigger id="kidFriendly" className="w-full">
                        <SelectValue placeholder="Is the event kid friendly?" />
                      </SelectTrigger>
                      <SelectContent>
                        {YES_NO_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      <Baby className="inline h-3 w-3 mr-1" />
                      Specify if the event is suitable for children
                    </p>
                  </div>

                  {/* Pet Friendly */}
                  <div className="space-y-2">
                    <Label htmlFor="petFriendly" className="text-sm font-medium">
                      Pet Friendly
                    </Label>
                    <Select
                      value={formik.values.petFriendly}
                      onValueChange={value => formik.setFieldValue('petFriendly', value)}
                    >
                      <SelectTrigger id="petFriendly" className="w-full">
                        <SelectValue placeholder="Are pets allowed?" />
                      </SelectTrigger>
                      <SelectContent>
                        {YES_NO_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      <Dog className="inline h-3 w-3 mr-1" />
                      Specify if attendees can bring pets
                    </p>
                  </div>
                </>
              )}

              {/* Age Group - Always show regardless of online/offline */}
              <div className="space-y-2">
                <Label htmlFor="ageGroup" className="text-sm font-medium">Minimum Age Requirement</Label>
                <Select
                  value={formik?.values?.ageGroup?.toString()}
                  onValueChange={value => formik.setFieldValue('ageGroup', parseInt(value))}
                >
                  <SelectTrigger id="ageGroup" className="w-full">
                    <SelectValue placeholder="Select minimum age" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_GROUPS.map((age) => (
                      <SelectItem key={age.value} value={age.value.toString()}>
                        {age.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  <Users className="inline h-3 w-3 mr-1" />
                  Specify the minimum age for attendees
                </p>
              </div>

              {/* Ticket Needed For Ages - Always show regardless of online/offline */}
              <div className="space-y-2">
                <Label htmlFor="ticketNeededForAges" className="text-sm font-medium">
                  Ticket Required From Age
                </Label>
                <Select
                  value={formik?.values?.ticketNeededForAges?.toString()}
                  onValueChange={value => formik.setFieldValue('ticketNeededForAges', parseInt(value))}
                >
                  <SelectTrigger id="ticketNeededForAges" className="w-full">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_GROUPS.map((age) => (
                      <SelectItem key={age.value} value={age.value.toString()}>
                        {age.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  From what age is a ticket required?
                </p>
              </div>
            </div>
          </div>

          {/* Tags and Highlights Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-primary">Tags and Highlights</h3>
            <div className="grid-rows-3 gap-6 sm:grid-cols-1">
              {/* Event Tags */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Tag className="h-4 w-4 mr-1" style={{ color: "#24005b" }} />
                  Event Tags
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={formik.values.tagInput}
                    onChange={e => formik.setFieldValue('tagInput', e.target.value)}
                    placeholder="Add relevant tags (e.g., music, outdoor, family-friendly)"
                    className="flex-1 "
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="secondary"
                    size="sm"
                    style={{ backgroundColor: "#24005b20" }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formik.values.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 py-1 px-2 bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                  {formik.values.tags.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">
                      No tags added yet. Tags help attendees find your event.
                    </p>
                  )}
                </div>
              </div>

              {/* Event Highlights */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1" style={{ color: "#24005b" }} />
                  Event Highlights
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={formik.values.highlightInput}
                    onChange={e => formik.setFieldValue('highlightInput', e.target.value)}
                    placeholder="Add key highlights of your event"
                    className="flex-1"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHighlight();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addHighlight}
                    variant="secondary"
                    size="sm"
                    style={{ backgroundColor: "#24005b20" }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formik.values.eventHighlights.map((highlight, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 py-1 px-2 bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      {highlight}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => removeHighlight(highlight)}
                      />
                    </Badge>
                  ))}
                  {formik.values.eventHighlights.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">
                      No highlights added yet. Highlights showcase what makes your event special.
                    </p>
                  )}
                </div>
              </div>


              {/* Language Selection - now with Indian languages */}
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-sm font-medium flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" style={{ color: "#24005b" }} />
                  Event Languages
                </Label>
                <Select
                  value=""
                  onValueChange={(value) => {
                    addLanguage(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select languages" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {LANGUAGES.map((lang) => (
                      <SelectItem
                        key={lang.value}
                        value={lang.value}
                        disabled={formik?.values?.language?.includes(lang.value)}
                      >
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formik?.values?.language?.map((lang, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 py-1 px-2 bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      {lang}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500 transition-colors"
                        onClick={() => removeLanguage(lang)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-primary"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Next: Venues <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
