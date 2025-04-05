
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

const eventSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  venue: z.string().min(3, { message: "Venue must be at least 3 characters" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  pincode: z.string().min(5, { message: "Pincode must be at least 5 characters" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  isPublic: z.boolean().default(true),
  capacity: z.string().min(1, { message: "Capacity is required" }),
  organizer: z.string().min(3, { message: "Organizer name is required" }),
  contactEmail: z.string().email({ message: "Invalid email address" }),
  contactPhone: z.string().min(10, { message: "Valid phone number is required" }),
  ticketPrice: z.string().optional(),
  ticketType: z.string().optional(),
  tags: z.array(z.string()).optional(),
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [organizers, setOrganizers] = useState<Array<{ name: string; role: string; image?: string }>>([
    { name: "You (Primary)", role: "Owner" }
  ]);

  const defaultValues: Partial<EventFormValues> = {
    title: "",
    description: "",
    category: "",
    venue: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    isPublic: true,
    capacity: "",
    organizer: "",
    contactEmail: "",
    contactPhone: "",
    tags: [],
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
    { value: "other", label: "Other" },
  ];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      form.setValue('tags', [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const filteredTags = tags.filter(tag => tag !== tagToRemove);
    setTags(filteredTags);
    form.setValue('tags', filteredTags);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
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

  const updateOrganizer = (index: number, field: 'name' | 'role', value: string) => {
    const updatedOrganizers = [...organizers];
    updatedOrganizers[index][field] = value;
    setOrganizers(updatedOrganizers);
  };

  const onSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true);
    try {
      // Process form data - this would typically be sent to an API
      console.log("Form Data:", {
        ...data,
        tags,
        organizers,
        image: uploadedImage
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
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error Creating Event",
        description: "There was an error creating your event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="Event cover" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground mt-2">No image uploaded</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-primary/80 hover:bg-primary">{form.watch('category') ? eventCategories.find(c => c.value === form.watch('category'))?.label : 'Category'}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">{form.watch('title') || 'Event Title'}</h2>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {form.watch('startDate') ? format(form.watch('startDate'), 'PPP') : 'Start Date'} 
                        {form.watch('startTime') ? ` at ${form.watch('startTime')}` : ''}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {form.watch('venue') || 'Venue'}, 
                        {form.watch('city') ? ` ${form.watch('city')}` : ''}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Ticket className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{form.watch('ticketPrice') ? `₹${form.watch('ticketPrice')}` : 'Free'}</span>
                    </div>
                  </div>
                  <div className="prose max-w-none mb-6">
                    <p>{form.watch('description') || 'Event description will appear here...'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.length > 0 ? tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    )) : (
                      <Badge variant="secondary">Example Tag</Badge>
                    )}
                  </div>
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
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="details">
                        Basic Details
                      </TabsTrigger>
                      <TabsTrigger value="location">
                        Location & Time
                      </TabsTrigger>
                      <TabsTrigger value="organizers">
                        Organizers
                      </TabsTrigger>
                      <TabsTrigger value="tickets">
                        Tickets & Settings
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
                          
                          <div>
                            <Label>Event Image</Label>
                            <div className="mt-1.5 border-2 border-dashed rounded-lg p-6 text-center">
                              {uploadedImage ? (
                                <div className="space-y-3">
                                  <img 
                                    src={uploadedImage} 
                                    alt="Uploaded preview" 
                                    className="max-h-48 mx-auto object-contain"
                                  />
                                  <Button 
                                    variant="outline" 
                                    type="button"
                                    onClick={() => setUploadedImage(null)}
                                  >
                                    Remove Image
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Drag and drop an image, or click to browse
                                  </p>
                                  <Input 
                                    id="event-image" 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleImageUpload}
                                  />
                                  <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => document.getElementById('event-image')?.click()}
                                  >
                                    Select Image
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" onClick={() => navigate('/events')}>
                            Cancel
                          </Button>
                          <Button type="button" onClick={() => setActiveTab("location")}>
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="location" className="space-y-4 mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Location & Time</CardTitle>
                          <CardDescription>
                            Specify when and where your event will take place
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="venue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Venue Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter venue name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter street address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter city" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter state" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter country" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="pincode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Pincode / Zip Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter pincode" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="startDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Start Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                          date < new Date(new Date().setHours(0, 0, 0, 0))
                                        }
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="startTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Time</FormLabel>
                                  <FormControl>
                                    <Input type="time" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>End Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => {
                                          const startDate = form.getValues("startDate");
                                          return startDate ? date < startDate : date < new Date();
                                        }}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="endTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Time</FormLabel>
                                  <FormControl>
                                    <Input type="time" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
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
                            onClick={() => setActiveTab("organizers")}
                          >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="organizers" className="space-y-4 mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Event Organizers</CardTitle>
                          <CardDescription>
                            Add organizers and their contact information
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                  <FormControl>
                                    <Input placeholder="Enter contact email" {...field} />
                                  </FormControl>
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
                                  <FormControl>
                                    <Input placeholder="Enter contact phone" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
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
                              <div key={index} className="border rounded-md p-4 space-y-2">
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
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              </div>
                            ))}
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
                          <CardTitle>Tickets & Settings</CardTitle>
                          <CardDescription>
                            Set up ticket information and additional settings
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="capacity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Event Capacity</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="Enter maximum number of attendees" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Maximum number of attendees allowed
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="ticketType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ticket Type</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select ticket type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="free">Free</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="donation">Donation-based</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Type of tickets for your event
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('ticketType') === 'paid' && (
                            <FormField
                              control={form.control}
                              name="ticketPrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Ticket Price (₹)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="Enter ticket price" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Price per ticket in INR
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <FormField
                            control={form.control}
                            name="isPublic"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4 mt-1"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Public Event</FormLabel>
                                  <FormDescription>
                                    Make this event visible to everyone on the platform
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <div className="border rounded-md p-4 space-y-3">
                            <h3 className="text-sm font-medium">Event Features</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex items-start space-x-3">
                                <input
                                  type="checkbox"
                                  id="feature-food"
                                  className="h-4 w-4 mt-1"
                                />
                                <div className="space-y-1 leading-none">
                                  <Label htmlFor="feature-food">Food & Beverages</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Food and drinks will be available
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-3">
                                <input
                                  type="checkbox"
                                  id="feature-parking"
                                  className="h-4 w-4 mt-1"
                                />
                                <div className="space-y-1 leading-none">
                                  <Label htmlFor="feature-parking">Parking Available</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Parking facilities will be available
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-3">
                                <input
                                  type="checkbox"
                                  id="feature-accessible"
                                  className="h-4 w-4 mt-1"
                                />
                                <div className="space-y-1 leading-none">
                                  <Label htmlFor="feature-accessible">Wheelchair Accessible</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Venue is wheelchair accessible
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-3">
                                <input
                                  type="checkbox"
                                  id="feature-seating"
                                  className="h-4 w-4 mt-1"
                                />
                                <div className="space-y-1 leading-none">
                                  <Label htmlFor="feature-seating">Seating Available</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Seating will be provided
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-3">
                                <input
                                  type="checkbox"
                                  id="feature-speakers"
                                  className="h-4 w-4 mt-1"
                                />
                                <div className="space-y-1 leading-none">
                                  <Label htmlFor="feature-speakers">Guest Speakers</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Event will have guest speakers
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-3">
                                <input
                                  type="checkbox"
                                  id="feature-performance"
                                  className="h-4 w-4 mt-1"
                                />
                                <div className="space-y-1 leading-none">
                                  <Label htmlFor="feature-performance">Live Performance</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Event will have live performances
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            type="button"
                            onClick={() => setActiveTab("organizers")}
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
                  <h4 className="text-sm font-medium">Choose the right date & time</h4>
                  <p className="text-sm text-muted-foreground">
                    Avoid scheduling conflicts with similar events or holidays.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <ImagePlus className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Add compelling images</h4>
                  <p className="text-sm text-muted-foreground">
                    High-quality images attract more attendees.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mic2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Highlight special guests</h4>
                  <p className="text-sm text-muted-foreground">
                    Feature performers or speakers to generate interest.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Tags className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Use relevant tags</h4>
                  <p className="text-sm text-muted-foreground">
                    Tags help users discover your event more easily.
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
