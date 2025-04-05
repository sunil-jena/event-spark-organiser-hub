
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Check, 
  ChevronRight, 
  Clock, 
  Globe, 
  ImagePlus, 
  Loader2, 
  MapPin, 
  Plus, 
  Tags, 
  Ticket, 
  Trash2, 
  Upload, 
  Eye,
  X,
  Mic2,
  Users,
  AlertCircle,
  FileText,
  Video,
  Mail,
  Phone,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { VenueSelector } from '@/components/ui/venue-selector';
import { MultiDatePicker, DateTimeSlot } from '@/components/ui/multi-date-picker';
import { MultiImageUpload, ImageFile } from '@/components/ui/multi-image-upload';
import { TicketManager, TicketType } from '@/components/ui/ticket-manager';
import { ProhibitedItems } from '@/components/ui/prohibited-items';
import { Checkbox } from '@/components/ui/checkbox';

// Updated event schema with all new fields
const eventSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  shortDescription: z.string().max(150, { message: "Short description must be 150 characters or less" }).optional(),
  organizer: z.string().min(3, { message: "Organizer name is required" }),
  contactEmail: z.string().email({ message: "Invalid email address" }),
  contactPhone: z.string().min(10, { message: "Valid phone number is required" }),
  isPublic: z.boolean().default(true),
  termsAndConditions: z.string().optional(),
  whyAttend: z.string().optional(),
  faqItems: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional(),
  capacity: z.string().min(1, { message: "Capacity is required" }),
  hasTermsAgreed: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  isOnline: z.boolean().default(false),
  videoConferenceUrl: z.string().optional(),
  videoConferenceProvider: z.string().optional(),
  videoConferencePassword: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

const CreateEvent: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [organizers, setOrganizers] = useState<Array<{ name: string; role: string; email?: string; phone?: string; image?: string }>>([
    { name: "You (Primary)", role: "Owner" }
  ]);
  const [dateTimeSlots, setDateTimeSlots] = useState<DateTimeSlot[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [prohibitedItems, setProhibitedItems] = useState<string[]>([]);
  const [venues, setVenues] = useState<Array<{
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    lat: number;
    lng: number;
  }>>([]);
  const [faqItems, setFaqItems] = useState<Array<{ question: string; answer: string }>>([
    { question: "", answer: "" }
  ]);

  const defaultValues: Partial<EventFormValues> = {
    title: "",
    description: "",
    category: "",
    shortDescription: "",
    organizer: "",
    contactEmail: "",
    contactPhone: "",
    isPublic: true,
    capacity: "",
    termsAndConditions: "",
    whyAttend: "",
    isOnline: false,
    hasTermsAgreed: false,
  };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues,
    mode: "onChange",
  });

  const eventCategories = [
    { value: "concert", label: "Concert" },
    { value: "conference", label: "Conference" },
    { value: "workshop", label: "Workshop" },
    { value: "exhibition", label: "Exhibition" },
    { value: "seminar", label: "Seminar" },
    { value: "sports", label: "Sports" },
    { value: "comedy", label: "Comedy" },
    { value: "festival", label: "Festival" },
    { value: "networking", label: "Networking" },
    { value: "charity", label: "Charity" },
    { value: "food", label: "Food & Drink" },
    { value: "arts", label: "Arts & Culture" },
    { value: "health", label: "Health & Wellness" },
    { value: "education", label: "Education" },
    { value: "family", label: "Family & Kids" },
    { value: "other", label: "Other" },
  ];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addOrganizer = () => {
    setOrganizers([...organizers, { name: "", role: "" }]);
  };

  const removeOrganizer = (index: number) => {
    if (index === 0) return; // Don't remove the primary organizer
    const updatedOrganizers = [...organizers];
    updatedOrganizers.splice(index, 1);
    setOrganizers(updatedOrganizers);
  };

  const updateOrganizer = (index: number, field: 'name' | 'role' | 'email' | 'phone', value: string) => {
    const updatedOrganizers = [...organizers];
    updatedOrganizers[index][field] = value;
    setOrganizers(updatedOrganizers);
  };

  const addVenue = (venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    lat: number;
    lng: number;
  }) => {
    setVenues([...venues, venue]);
  };

  const removeVenue = (index: number) => {
    const updatedVenues = [...venues];
    updatedVenues.splice(index, 1);
    setVenues(updatedVenues);
  };

  const addFaqItem = () => {
    setFaqItems([...faqItems, { question: "", answer: "" }]);
  };

  const removeFaqItem = (index: number) => {
    const updatedFaqItems = [...faqItems];
    updatedFaqItems.splice(index, 1);
    setFaqItems(updatedFaqItems);
  };

  const updateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqItems = [...faqItems];
    updatedFaqItems[index][field] = value;
    setFaqItems(updatedFaqItems);
  };
  
  const onSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true);
    try {
      // Process form data - this would typically be sent to an API
      console.log("Form Data:", {
        ...data,
        tags,
        organizers,
        venues,
        dateTimeSlots,
        images: uploadedImages,
        ticketTypes,
        prohibitedItems,
        faqItems: faqItems.filter(item => item.question.trim() !== "" && item.answer.trim() !== "")
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Event Created Successfully",
        description: "Your event has been created and is now visible to users.",
      });
      
      setTimeout(() => {
        navigate('/events');
      }, 1000);

      return true;
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error Creating Event",
        description: "There was an error creating your event. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOnlineEvent = form.watch('isOnline');

  return (
    <div className="container mx-auto py-6 mb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Create New Event</h1>
          <p className="text-muted-foreground">Fill out the details to create your new event</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? (
              <>
                <Eye className="mr-2 h-4 w-4" /> Exit Preview
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" /> Preview
              </>
            )}
          </Button>
          
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              <>
                Create Event
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {previewMode ? (
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <div className="h-64 bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center">
                    {uploadedImages.find(img => img.type === 'banner') ? (
                      <img 
                        src={uploadedImages.find(img => img.type === 'banner')?.preview} 
                        alt="Event banner" 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="text-center">
                        <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground mt-2">No banner image uploaded</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <Badge className="bg-primary/80 hover:bg-primary">
                      {form.watch('category') ? eventCategories.find(c => c.value === form.watch('category'))?.label : 'Category'}
                    </Badge>
                    {form.watch('isOnline') && (
                      <Badge variant="outline" className="bg-blue-500/80 text-white hover:bg-blue-600">
                        Online Event
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{form.watch('title') || 'Event Title'}</h2>
                  {form.watch('shortDescription') && (
                    <p className="text-muted-foreground mb-4">{form.watch('shortDescription')}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    {dateTimeSlots.length > 0 ? (
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div>{format(dateTimeSlots[0].date, 'PPP')}</div>
                          <div className="text-sm text-muted-foreground">
                            {dateTimeSlots.length > 1 ? `+${dateTimeSlots.length - 1} more dates` : `${dateTimeSlots[0].startTime} - ${dateTimeSlots[0].endTime}`}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>No dates set</span>
                      </div>
                    )}
                    
                    {isOnlineEvent ? (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Online Event</span>
                      </div>
                    ) : venues.length > 0 ? (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div>{venues[0].name}</div>
                          <div className="text-sm text-muted-foreground">
                            {venues.length > 1 ? `+${venues.length - 1} more locations` : `${venues[0].city}, ${venues[0].state}`}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>No venue selected</span>
                      </div>
                    )}
                    
                    {ticketTypes.length > 0 ? (
                      <div className="flex items-center">
                        <Ticket className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div>
                            {ticketTypes[0].type === 'free' ? 'Free' : 
                             ticketTypes[0].type === 'donation' ? 'Donation' : 
                             `₹${ticketTypes[0].price}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {ticketTypes.length > 1 ? `+${ticketTypes.length - 1} more ticket types` : ticketTypes[0].name}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Ticket className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>No tickets created</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="prose max-w-none mb-6">
                    <h3 className="text-lg font-medium mb-2">About this event</h3>
                    <p>{form.watch('description') || 'Event description will appear here...'}</p>
                  </div>
                  
                  {form.watch('whyAttend') && (
                    <div className="prose max-w-none mb-6">
                      <h3 className="text-lg font-medium mb-2">Why you should attend</h3>
                      <p>{form.watch('whyAttend')}</p>
                    </div>
                  )}
                  
                  {uploadedImages.filter(img => img.type === 'gallery').length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Gallery</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {uploadedImages
                          .filter(img => img.type === 'gallery')
                          .map((image) => (
                            <img 
                              key={image.id}
                              src={image.preview} 
                              alt="Gallery" 
                              className="rounded-md object-cover h-32 w-full"
                            />
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {prohibitedItems.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Prohibited Items</h3>
                      <div className="flex flex-wrap gap-2">
                        {prohibitedItems.map((item) => (
                          <Badge key={item} variant="outline" className="bg-red-50 text-red-500 border-red-200">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.length > 0 ? tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    )) : (
                      <Badge variant="secondary">Example Tag</Badge>
                    )}
                  </div>
                  
                  {faqItems.filter(item => item.question && item.answer).length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Frequently Asked Questions</h3>
                      <div className="space-y-3">
                        {faqItems
                          .filter(item => item.question && item.answer)
                          .map((faq, index) => (
                            <div key={index} className="border rounded-md p-3">
                              <h4 className="font-medium">{faq.question}</h4>
                              <p className="text-muted-foreground text-sm mt-1">{faq.answer}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Organizers</h3>
                    <div className="flex flex-wrap gap-4">
                      {organizers.map((organizer, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Avatar>
                            <AvatarFallback>{organizer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{organizer.name}</p>
                            <p className="text-sm text-muted-foreground">{organizer.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-6 w-full">
                      <TabsTrigger value="details">
                        Basic Details
                      </TabsTrigger>
                      <TabsTrigger value="dates">
                        Dates & Times
                      </TabsTrigger>
                      <TabsTrigger value="location">
                        Location
                      </TabsTrigger>
                      <TabsTrigger value="media">
                        Media
                      </TabsTrigger>
                      <TabsTrigger value="tickets">
                        Tickets
                      </TabsTrigger>
                      <TabsTrigger value="additional">
                        Additional Info
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-4 mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Basic Details</CardTitle>
                          <CardDescription>
                            Provide the basic information about your event
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Event Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter event title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="shortDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Short Description</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Brief description (150 chars max)" 
                                    {...field} 
                                    maxLength={150}
                                  />
                                </FormControl>
                                <FormDescription>
                                  A short summary that appears in event listings
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Event Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe your event" 
                                    className="min-h-32" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {eventCategories.map((category) => (
                                      <SelectItem key={category.value} value={category.value}>
                                        {category.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div>
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
                          
                          <FormField
                            control={form.control}
                            name="isOnline"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>This is an online event</FormLabel>
                                  <FormDescription>
                                    Virtual events use video conferencing platforms instead of physical venues
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('isOnline') && (
                            <div className="space-y-4 p-4 border rounded-md">
                              <h3 className="font-medium">Online Event Details</h3>
                              
                              <div>
                                <Label htmlFor="videoProvider">Video Conference Provider</Label>
                                <Select 
                                  onValueChange={(value) => form.setValue('videoConferenceProvider', value)}
                                >
                                  <SelectTrigger id="videoProvider">
                                    <SelectValue placeholder="Select provider" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="zoom">Zoom</SelectItem>
                                    <SelectItem value="teams">Microsoft Teams</SelectItem>
                                    <SelectItem value="meet">Google Meet</SelectItem>
                                    <SelectItem value="webex">Cisco Webex</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor="videoUrl">Meeting URL</Label>
                                <Input 
                                  id="videoUrl"
                                  placeholder="https://..."
                                  onChange={(e) => form.setValue('videoConferenceUrl', e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                  This will be shared with attendees before the event
                                </p>
                              </div>
                              
                              <div>
                                <Label htmlFor="videoPassword">Meeting Password (optional)</Label>
                                <Input 
                                  id="videoPassword"
                                  placeholder="Password"
                                  onChange={(e) => form.setValue('videoConferencePassword', e.target.value)}
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" onClick={() => navigate('/events')}>
                            Cancel
                          </Button>
                          <Button type="button" onClick={() => setActiveTab("dates")}>
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="dates" className="space-y-4 mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Dates & Times</CardTitle>
                          <CardDescription>
                            Set when your event will take place
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <MultiDatePicker 
                            value={dateTimeSlots}
                            onChange={setDateTimeSlots}
                          />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            type="button"
                            onClick={() => setActiveTab("details")}
                          >
                            Previous
                          </Button>
                          <Button 
                            type="button"
                            onClick={() => setActiveTab("location")}
                          >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="location" className="space-y-4 mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Event Location</CardTitle>
                          <CardDescription>
                            {isOnlineEvent 
                              ? "Online events don't need a physical location"
                              : "Specify where your event will take place"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {!isOnlineEvent && (
                            <>
                              <div className="space-y-2">
                                <Label>Search for a venue</Label>
                                <VenueSelector onSelectVenue={(venue) => addVenue(venue)} />
                              </div>
                              
                              {venues.length > 0 && (
                                <div className="space-y-3 mt-4">
                                  <Label>Selected Venues</Label>
                                  <div className="space-y-2">
                                    {venues.map((venue, index) => (
                                      <div key={index} className="flex justify-between items-start border rounded-md p-3">
                                        <div>
                                          <h4 className="font-medium">{venue.name}</h4>
                                          <p className="text-sm text-muted-foreground">{venue.address}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {venue.city}, {venue.state}, {venue.country} {venue.postalCode}
                                          </p>
                                        </div>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => removeVenue(index)}
                                        >
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Venue Capacity</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        placeholder="Maximum attendees" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Maximum number of attendees allowed at the venue
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </>
                          )}
                          
                          {isOnlineEvent && (
                            <div className="py-8 text-center">
                              <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                              <h3 className="text-lg font-medium">This is an online event</h3>
                              <p className="text-muted-foreground mt-1">
                                You've configured this as a virtual event. There's no need to specify a physical location.
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                className="mt-4"
                                onClick={() => form.setValue('isOnline', false)}
                              >
                                Switch to In-Person Event
                              </Button>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            type="button"
                            onClick={() => setActiveTab("dates")}
                          >
                            Previous
                          </Button>
                          <Button 
                            type="button"
                            onClick={() => setActiveTab("media")}
                          >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="media" className="space-y-4 mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Event Media</CardTitle>
                          <CardDescription>
                            Upload images and videos for your event
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <MultiImageUpload
                            images={uploadedImages}
                            onChange={setUploadedImages}
                            maxFiles={20}
                          />
                          
                          <div className="mt-6 space-y-2">
                            <Label>Video URL (optional)</Label>
                            <Input 
                              placeholder="e.g. https://youtube.com/watch?v=..."
                            />
                            <p className="text-sm text-muted-foreground">
                              Add a YouTube or Vimeo video to showcase your event
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            type="button"
                            onClick={() => setActiveTab("location")}
                          >
                            Previous
                          </Button>
                          <Button 
                            type="button"
                            onClick={() => setActiveTab("tickets")}
                          >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="tickets" className="space-y-4 mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Tickets & Registration</CardTitle>
                          <CardDescription>
                            Set up ticket types, pricing, and availability
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <TicketManager
                            tickets={ticketTypes}
                            onChange={setTicketTypes}
                          />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            type="button"
                            onClick={() => setActiveTab("media")}
                          >
                            Previous
                          </Button>
                          <Button 
                            type="button"
                            onClick={() => setActiveTab("additional")}
                          >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="additional" className="space-y-4 mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Additional Information</CardTitle>
                          <CardDescription>
                            Provide more details about your event
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <h3 className="text-base font-medium">Why Attend</h3>
                            <FormField
                              control={form.control}
                              name="whyAttend"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Explain why people should attend your event" 
                                      className="min-h-24" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Highlight the unique benefits of attending your event
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-base font-medium">FAQ</h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addFaqItem}
                              >
                                <Plus className="h-4 w-4 mr-2" /> Add Question
                              </Button>
                            </div>
                            
                            <div className="space-y-3">
                              {faqItems.map((faq, index) => (
                                <div key={index} className="space-y-2 border rounded-md p-3">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium">FAQ Item {index + 1}</h4>
                                    {index > 0 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFaqItem(index)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    )}
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor={`faq-question-${index}`}>Question</Label>
                                    <Input
                                      id={`faq-question-${index}`}
                                      value={faq.question}
                                      onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                                      placeholder="e.g. What should I bring?"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                                    <Textarea
                                      id={`faq-answer-${index}`}
                                      value={faq.answer}
                                      onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                                      placeholder="Provide a clear answer"
                                      rows={2}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <ProhibitedItems
                            selectedItems={prohibitedItems}
                            onChange={setProhibitedItems}
                          />
                          
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="termsAndConditions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Terms & Conditions</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Enter terms and conditions for attendees" 
                                      className="min-h-24" 
                                      {...field} 
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="text-base font-medium">Contact Information</h3>
                            
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="organizer"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Main Organizer Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter organizer name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="contactEmail"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Contact Email</FormLabel>
                                      <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <FormControl>
                                          <Input placeholder="Enter contact email" {...field} />
                                        </FormControl>
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="contactPhone"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Contact Phone</FormLabel>
                                      <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <FormControl>
                                          <Input placeholder="Enter contact phone" {...field} />
                                        </FormControl>
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium">Additional Organizers</h3>
                                <Button 
                                  type="button" 
                                  size="sm" 
                                  variant="outline"
                                  onClick={addOrganizer}
                                >
                                  <Plus className="h-4 w-4 mr-1" /> Add Organizer
                                </Button>
                              </div>
                              
                              {organizers.map((organizer, index) => (
                                <div key={index} className="border rounded-md p-4 space-y-3">
                                  <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-medium">
                                      {index === 0 ? 'Primary Organizer' : `Co-Organizer ${index}`}
                                    </h4>
                                    {index !== 0 && (
                                      <Button 
                                        type="button" 
                                        size="icon" 
                                        variant="ghost" 
                                        onClick={() => removeOrganizer(index)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    )}
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <Label htmlFor={`organizer-name-${index}`}>Name</Label>
                                      <Input
                                        id={`organizer-name-${index}`}
                                        value={organizer.name}
                                        onChange={(e) => updateOrganizer(index, 'name', e.target.value)}
                                        placeholder="Organizer name"
                                        disabled={index === 0}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`organizer-role-${index}`}>Role</Label>
                                      <Input
                                        id={`organizer-role-${index}`}
                                        value={organizer.role}
                                        onChange={(e) => updateOrganizer(index, 'role', e.target.value)}
                                        placeholder="e.g. Host, Speaker, DJ"
                                        disabled={index === 0}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <Label htmlFor={`organizer-email-${index}`}>Email</Label>
                                      <Input
                                        id={`organizer-email-${index}`}
                                        value={organizer.email || ''}
                                        onChange={(e) => updateOrganizer(index, 'email', e.target.value)}
                                        placeholder="Email address"
                                        disabled={index === 0}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`organizer-phone-${index}`}>Phone</Label>
                                      <Input
                                        id={`organizer-phone-${index}`}
                                        value={organizer.phone || ''}
                                        onChange={(e) => updateOrganizer(index, 'phone', e.target.value)}
                                        placeholder="Phone number"
                                        disabled={index === 0}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="hasTermsAgreed"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>I agree to the terms and conditions</FormLabel>
                                  <FormDescription>
                                    By creating this event, you agree to our terms of service and privacy policy.
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            type="button"
                            onClick={() => setActiveTab("tickets")}
                          >
                            Previous
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" /> Create Event
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </form>
            </Form>
          )}
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Choose multiple dates</h4>
                  <p className="text-sm text-muted-foreground">
                    Add multiple sessions for multi-day events.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Google Maps integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Find venues easily with location search.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Ticket className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Multiple ticket types</h4>
                  <p className="text-sm text-muted-foreground">
                    Create different pricing tiers for your event.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <ImagePlus className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Upload multiple images</h4>
                  <p className="text-sm text-muted-foreground">
                    Add banner, card, and gallery images.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <AlertCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Prohibited Items</h4>
                  <p className="text-sm text-muted-foreground">
                    Clearly list what attendees cannot bring.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Add FAQ section</h4>
                  <p className="text-sm text-muted-foreground">
                    Answer common questions in advance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                If you're having trouble creating your event, check out our resources:
              </p>
              <ul className="text-sm space-y-1">
                <li className="text-primary hover:underline cursor-pointer">
                  Event creation guide
                </li>
                <li className="text-primary hover:underline cursor-pointer">
                  Best practices for event promotion
                </li>
                <li className="text-primary hover:underline cursor-pointer">
                  Contact customer support
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
