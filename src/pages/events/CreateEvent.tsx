
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
  Upload 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Venue {
  id: string;
  city: string;
  venueName: string;
  address: string;
}

interface TimeSlot {
  id: string;
  venueId: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

interface Artist {
  id: string;
  name: string;
  image: string;
}

const CreateEvent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventTags, setEventTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [dateType, setDateType] = useState('single');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [rangeStartDate, setRangeStartDate] = useState<Date | undefined>(undefined);
  const [rangeEndDate, setRangeEndDate] = useState<Date | undefined>(undefined);
  const [recurrencePattern, setRecurrencePattern] = useState('daily');
  const [occurrences, setOccurrences] = useState(1);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [bannerImages, setBannerImages] = useState<string[]>(['https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3']);
  const [cardImage, setCardImage] = useState<string>('https://images.unsplash.com/photo-1508997449629-303059a039c0?ixlib=rb-4.0.3');
  const [ageRestriction, setAgeRestriction] = useState(5);
  const [languages, setLanguages] = useState<string[]>(['Hindi']);
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [eventType, setEventType] = useState('public');
  const [layout, setLayout] = useState('outdoor');
  const [seatingArrangement, setSeatingArrangement] = useState('standing');
  const [kidFriendly, setKidFriendly] = useState('Yes');
  const [petFriendly, setPetFriendly] = useState('No');
  const [gateOpensBeforeStart, setGateOpensBeforeStart] = useState(false);
  const [gateOpenType, setGateOpenType] = useState('minute');
  const [gateOpenDuration, setGateOpenDuration] = useState(30);
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [prohibitedItems, setProhibitedItems] = useState<string[]>([
    'Outside food and beverages',
    'Professional cameras',
    'Weapons of any kind'
  ]);
  const [currentProhibitedItem, setCurrentProhibitedItem] = useState('');
  const [notes, setNotes] = useState('');

  // Mock categories
  const categories = [
    { id: '1', name: 'Music & Concerts' },
    { id: '2', name: 'Workshops' },
    { id: '3', name: 'Business Events' },
    { id: '4', name: 'Dance Shows' },
    { id: '5', name: 'Comedy Shows' },
    { id: '6', name: 'Film Screenings' },
    { id: '7', name: 'Award Ceremonies' },
  ];

  // Add tag handler
  const handleAddTag = () => {
    if (currentTag && !eventTags.includes(currentTag)) {
      setEventTags([...eventTags, currentTag]);
      setCurrentTag('');
    }
  };

  // Remove tag handler
  const handleRemoveTag = (tagToRemove: string) => {
    setEventTags(eventTags.filter(tag => tag !== tagToRemove));
  };

  // Add language handler
  const handleAddLanguage = () => {
    if (currentLanguage && !languages.includes(currentLanguage)) {
      setLanguages([...languages, currentLanguage]);
      setCurrentLanguage('');
    }
  };

  // Remove language handler
  const handleRemoveLanguage = (languageToRemove: string) => {
    setLanguages(languages.filter(language => language !== languageToRemove));
  };

  // Add prohibited item handler
  const handleAddProhibitedItem = () => {
    if (currentProhibitedItem && !prohibitedItems.includes(currentProhibitedItem)) {
      setProhibitedItems([...prohibitedItems, currentProhibitedItem]);
      setCurrentProhibitedItem('');
    }
  };

  // Remove prohibited item handler
  const handleRemoveProhibitedItem = (itemToRemove: string) => {
    setProhibitedItems(prohibitedItems.filter(item => item !== itemToRemove));
  };

  // Add venue
  const handleAddVenue = () => {
    const newVenue: Venue = {
      id: `venue-${venues.length + 1}`,
      city: '',
      venueName: '',
      address: ''
    };
    setVenues([...venues, newVenue]);
  };

  // Remove venue
  const handleRemoveVenue = (venueId: string) => {
    setVenues(venues.filter(venue => venue.id !== venueId));
    // Also remove associated time slots
    setTimeSlots(timeSlots.filter(slot => slot.venueId !== venueId));
  };

  // Update venue
  const handleUpdateVenue = (id: string, field: keyof Venue, value: string) => {
    setVenues(venues.map(venue => 
      venue.id === id ? { ...venue, [field]: value } : venue
    ));
  };

  // Add time slot
  const handleAddTimeSlot = (venueId: string) => {
    const newSlot: TimeSlot = {
      id: `slot-${timeSlots.length + 1}`,
      venueId,
      date: selectedDate || new Date(),
      startTime: '19:00',
      endTime: '22:00'
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  // Remove time slot
  const handleRemoveTimeSlot = (slotId: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== slotId));
  };

  // Update time slot
  const handleUpdateTimeSlot = (id: string, field: keyof TimeSlot, value: any) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  // Add ticket type
  const handleAddTicketType = () => {
    const newTicket: TicketType = {
      id: `ticket-${ticketTypes.length + 1}`,
      name: '',
      price: 0,
      quantity: 0,
      description: ''
    };
    setTicketTypes([...ticketTypes, newTicket]);
  };

  // Remove ticket type
  const handleRemoveTicketType = (ticketId: string) => {
    setTicketTypes(ticketTypes.filter(ticket => ticket.id !== ticketId));
  };

  // Update ticket type
  const handleUpdateTicketType = (id: string, field: keyof TicketType, value: any) => {
    setTicketTypes(ticketTypes.map(ticket => 
      ticket.id === id ? { ...ticket, [field]: value } : ticket
    ));
  };

  // Add artist
  const handleAddArtist = () => {
    const newArtist: Artist = {
      id: `artist-${artists.length + 1}`,
      name: '',
      image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    setArtists([...artists, newArtist]);
  };

  // Remove artist
  const handleRemoveArtist = (artistId: string) => {
    setArtists(artists.filter(artist => artist.id !== artistId));
  };

  // Update artist
  const handleUpdateArtist = (id: string, field: keyof Artist, value: string) => {
    setArtists(artists.map(artist => 
      artist.id === id ? { ...artist, [field]: value } : artist
    ));
  };

  // Save event
  const handleSaveEvent = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Event Created',
        description: 'Your event has been created successfully!',
      });
      setIsSubmitting(false);
      navigate('/events');
    }, 2000);
  };

  // Publish event
  const handlePublishEvent = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Event Published',
        description: 'Your event has been published successfully!',
      });
      setIsSubmitting(false);
      navigate('/events');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Create New Event</h1>
          <p className="text-gray-500 mt-1">Create and publish your next amazing event</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleSaveEvent}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : 'Save as Draft'}
          </Button>
          <Button 
            onClick={handlePublishEvent}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing
              </>
            ) : 'Publish Event'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">1</span>
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">2</span>
            Schedule
          </TabsTrigger>
          <TabsTrigger value="venue" className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">3</span>
            Venue
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">4</span>
            Tickets
          </TabsTrigger>
          <TabsTrigger value="artists" className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">5</span>
            Artists
          </TabsTrigger>
          <TabsTrigger value="additional" className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">6</span>
            Additional
          </TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="eventTitle">Event Title</Label>
                  <Input 
                    id="eventTitle" 
                    placeholder="Enter event title" 
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="form-field-focus"
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventDescription">Event Description</Label>
                  <Textarea 
                    id="eventDescription" 
                    placeholder="Enter event description" 
                    rows={5}
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    className="form-field-focus"
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventCategory">Category</Label>
                  <Select value={eventCategory} onValueChange={setEventCategory}>
                    <SelectTrigger id="eventCategory" className="form-field-focus">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="eventTags">Tags</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="eventTags" 
                      placeholder="Add tags" 
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="form-field-focus"
                    />
                    <Button type="button" size="sm" onClick={handleAddTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {eventTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {eventTags.map(tag => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          <Tags className="h-3 w-3" />
                          {tag}
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-4 w-4 p-0 ml-1" 
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label>Event Type</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Button
                      type="button"
                      variant={eventType === 'public' ? 'default' : 'outline'}
                      className="flex items-center justify-center gap-2"
                      onClick={() => setEventType('public')}
                    >
                      <Globe className="h-4 w-4" />
                      Public Event
                    </Button>
                    <Button
                      type="button"
                      variant={eventType === 'private' ? 'default' : 'outline'}
                      className="flex items-center justify-center gap-2"
                      onClick={() => setEventType('private')}
                    >
                      <Check className="h-4 w-4" />
                      Private Event
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="bannerImage">Banner Image</Label>
                    <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer">
                      <ImagePlus className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm">Upload banner image</p>
                      <p className="text-xs text-gray-500">Recommended size: 1920x1080 pixels</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardImage">Card Image</Label>
                    <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer">
                      <ImagePlus className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm">Upload card image</p>
                      <p className="text-xs text-gray-500">Recommended size: 800x600 pixels</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled>Back</Button>
              <Button variant="default" onClick={() => setActiveTab('schedule')}>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Event Schedule</CardTitle>
              <CardDescription>Set the date and time for your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Date Type</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <Button
                    type="button"
                    variant={dateType === 'single' ? 'default' : 'outline'}
                    onClick={() => setDateType('single')}
                    className="text-sm"
                  >
                    Single Date
                  </Button>
                  <Button
                    type="button"
                    variant={dateType === 'multiple' ? 'default' : 'outline'}
                    onClick={() => setDateType('multiple')}
                    className="text-sm"
                  >
                    Multiple Dates
                  </Button>
                  <Button
                    type="button"
                    variant={dateType === 'range' ? 'default' : 'outline'}
                    onClick={() => setDateType('range')}
                    className="text-sm"
                  >
                    Date Range
                  </Button>
                  <Button
                    type="button"
                    variant={dateType === 'recurring' ? 'default' : 'outline'}
                    onClick={() => setDateType('recurring')}
                    className="text-sm"
                  >
                    Recurring
                  </Button>
                </div>
              </div>

              {/* Single Date */}
              {dateType === 'single' && (
                <div>
                  <Label>Event Date</Label>
                  <div className="mt-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal form-field-focus"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}

              {/* Multiple Dates */}
              {dateType === 'multiple' && (
                <div>
                  <Label>Event Dates</Label>
                  <div className="mt-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal form-field-focus"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDates.length > 0 
                            ? `${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''} selected` 
                            : <span>Pick dates</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="multiple"
                          selected={selectedDates}
                          onSelect={setSelectedDates}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {selectedDates.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedDates.map((date, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {format(date, 'PP')}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Date Range */}
              {dateType === 'range' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <div className="mt-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal form-field-focus"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {rangeStartDate ? format(rangeStartDate, 'PPP') : <span>Pick start date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={rangeStartDate}
                            onSelect={setRangeStartDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <div className="mt-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal form-field-focus"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {rangeEndDate ? format(rangeEndDate, 'PPP') : <span>Pick end date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={rangeEndDate}
                            onSelect={setRangeEndDate}
                            disabled={(date) => (
                              date < new Date() || 
                              (rangeStartDate ? date < rangeStartDate : false)
                            )}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              )}

              {/* Recurring */}
              {dateType === 'recurring' && (
                <div className="space-y-4">
                  <div>
                    <Label>Start Date</Label>
                    <div className="mt-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal form-field-focus"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, 'PPP') : <span>Pick start date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Recurrence Pattern</Label>
                      <Select value={recurrencePattern} onValueChange={setRecurrencePattern}>
                        <SelectTrigger className="mt-2 form-field-focus">
                          <SelectValue placeholder="Select pattern" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Number of Occurrences</Label>
                      <Input 
                        type="number" 
                        min={1} 
                        max={50} 
                        value={occurrences} 
                        onChange={(e) => setOccurrences(parseInt(e.target.value) || 1)}
                        className="mt-2 form-field-focus"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <Label>Gate Opening Settings</Label>
                  <div className="flex items-center">
                    <Label htmlFor="gateOpens" className="mr-2 text-sm">Gate opens before start?</Label>
                    <input
                      type="checkbox"
                      id="gateOpens"
                      checked={gateOpensBeforeStart}
                      onChange={(e) => setGateOpensBeforeStart(e.target.checked)}
                      className="rounded text-primary focus:ring-primary"
                    />
                  </div>
                </div>
                
                {gateOpensBeforeStart && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Duration</Label>
                      <Input 
                        type="number" 
                        min={1} 
                        value={gateOpenDuration} 
                        onChange={(e) => setGateOpenDuration(parseInt(e.target.value) || 30)}
                        className="mt-2 form-field-focus"
                      />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Select value={gateOpenType} onValueChange={setGateOpenType}>
                        <SelectTrigger className="mt-2 form-field-focus">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minute">Minutes</SelectItem>
                          <SelectItem value="hour">Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('basic')}>Back</Button>
              <Button variant="default" onClick={() => setActiveTab('venue')}>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Venue Tab */}
        <TabsContent value="venue">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Venue Information</span>
                <Button onClick={handleAddVenue} size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add Venue
                </Button>
              </CardTitle>
              <CardDescription>Add venues where your event will be held</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {venues.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <MapPin className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No venues added yet. Click "Add Venue" to add a venue for your event.</p>
                </div>
              ) : (
                venues.map((venue, index) => (
                  <div key={venue.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">Venue {index + 1}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveVenue(venue.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`city-${venue.id}`}>City</Label>
                        <Input 
                          id={`city-${venue.id}`} 
                          value={venue.city}
                          onChange={(e) => handleUpdateVenue(venue.id, 'city', e.target.value)}
                          className="mt-1 form-field-focus"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`venueName-${venue.id}`}>Venue Name</Label>
                        <Input 
                          id={`venueName-${venue.id}`} 
                          value={venue.venueName}
                          onChange={(e) => handleUpdateVenue(venue.id, 'venueName', e.target.value)}
                          className="mt-1 form-field-focus"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label htmlFor={`address-${venue.id}`}>Address</Label>
                      <Textarea 
                        id={`address-${venue.id}`} 
                        value={venue.address}
                        onChange={(e) => handleUpdateVenue(venue.id, 'address', e.target.value)}
                        className="mt-1 form-field-focus"
                      />
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Time Slots</Label>
                        <Button 
                          onClick={() => handleAddTimeSlot(venue.id)} 
                          size="sm" 
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" /> Add Time Slot
                        </Button>
                      </div>
                      
                      {timeSlots.filter(slot => slot.venueId === venue.id).length === 0 ? (
                        <div className="text-center py-4 border border-dashed rounded-lg">
                          <Clock className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">No time slots added for this venue</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {timeSlots
                            .filter(slot => slot.venueId === venue.id)
                            .map((slot) => (
                              <div key={slot.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                <div className="flex-1">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" size="sm" className="w-full justify-start">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {format(slot.date, 'PP')}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={slot.date}
                                        onSelect={(date) => date && handleUpdateTimeSlot(slot.id, 'date', date)}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                                <div className="flex-1">
                                  <Input 
                                    type="time" 
                                    value={slot.startTime}
                                    onChange={(e) => handleUpdateTimeSlot(slot.id, 'startTime', e.target.value)}
                                  />
                                </div>
                                <div className="flex-1">
                                  <Input 
                                    type="time" 
                                    value={slot.endTime}
                                    onChange={(e) => handleUpdateTimeSlot(slot.id, 'endTime', e.target.value)}
                                  />
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleRemoveTimeSlot(slot.id)}
                                  className="text-red-500 hover:text-red-700 h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              <div className="mt-6">
                <Label>Venue Layout</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Button
                    type="button"
                    variant={layout === 'indoor' ? 'default' : 'outline'}
                    className="flex items-center justify-center gap-2"
                    onClick={() => setLayout('indoor')}
                  >
                    Indoor
                  </Button>
                  <Button
                    type="button"
                    variant={layout === 'outdoor' ? 'default' : 'outline'}
                    className="flex items-center justify-center gap-2"
                    onClick={() => setLayout('outdoor')}
                  >
                    Outdoor
                  </Button>
                </div>
              </div>

              <div>
                <Label>Seating Arrangement</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    type="button"
                    variant={seatingArrangement === 'seated' ? 'default' : 'outline'}
                    onClick={() => setSeatingArrangement('seated')}
                    className="text-sm"
                  >
                    Seated
                  </Button>
                  <Button
                    type="button"
                    variant={seatingArrangement === 'standing' ? 'default' : 'outline'}
                    onClick={() => setSeatingArrangement('standing')}
                    className="text-sm"
                  >
                    Standing
                  </Button>
                  <Button
                    type="button"
                    variant={seatingArrangement === 'mixed' ? 'default' : 'outline'}
                    onClick={() => setSeatingArrangement('mixed')}
                    className="text-sm"
                  >
                    Mixed
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('schedule')}>Back</Button>
              <Button variant="default" onClick={() => setActiveTab('tickets')}>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Ticket Information</span>
                <Button onClick={handleAddTicketType} size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add Ticket Type
                </Button>
              </CardTitle>
              <CardDescription>Create different ticket types for your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {ticketTypes.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Ticket className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No ticket types added yet. Click "Add Ticket Type" to add tickets for your event.</p>
                </div>
              ) : (
                ticketTypes.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">
                        {ticket.name || 'New Ticket Type'}
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveTicketType(ticket.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`ticketName-${ticket.id}`}>Ticket Name</Label>
                        <Input 
                          id={`ticketName-${ticket.id}`} 
                          value={ticket.name}
                          onChange={(e) => handleUpdateTicketType(ticket.id, 'name', e.target.value)}
                          placeholder="e.g. General Admission, VIP, Early Bird"
                          className="mt-1 form-field-focus"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`ticketPrice-${ticket.id}`}>Price (₹)</Label>
                        <Input 
                          id={`ticketPrice-${ticket.id}`} 
                          type="number"
                          min={0}
                          value={ticket.price}
                          onChange={(e) => handleUpdateTicketType(ticket.id, 'price', Number(e.target.value))}
                          className="mt-1 form-field-focus"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label htmlFor={`ticketQuantity-${ticket.id}`}>Quantity Available</Label>
                      <Input 
                        id={`ticketQuantity-${ticket.id}`} 
                        type="number"
                        min={0}
                        value={ticket.quantity}
                        onChange={(e) => handleUpdateTicketType(ticket.id, 'quantity', Number(e.target.value))}
                        className="mt-1 form-field-focus"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`ticketDescription-${ticket.id}`}>Description</Label>
                      <Textarea 
                        id={`ticketDescription-${ticket.id}`} 
                        value={ticket.description}
                        onChange={(e) => handleUpdateTicketType(ticket.id, 'description', e.target.value)}
                        placeholder="Describe what's included with this ticket type"
                        className="mt-1 form-field-focus"
                      />
                    </div>
                  </div>
                ))
              )}

              <div className="mt-6">
                <Label htmlFor="ageRestriction">Age Restriction</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input 
                    id="ageRestriction"
                    type="number" 
                    min={0} 
                    max={21} 
                    value={ageRestriction}
                    onChange={(e) => setAgeRestriction(Number(e.target.value))}
                    className="w-20 form-field-focus"
                  />
                  <span>years and above</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('venue')}>Back</Button>
              <Button variant="default" onClick={() => setActiveTab('artists')}>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Artists Tab */}
        <TabsContent value="artists">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Artists & Performers</span>
                <Button onClick={handleAddArtist} size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add Artist
                </Button>
              </CardTitle>
              <CardDescription>Add artists and performers for your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {artists.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Mic className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No artists added yet. Click "Add Artist" to add performers to your event.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {artists.map((artist) => (
                    <div key={artist.id} className="border border-gray-200 rounded-lg p-4 flex gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={artist.image} alt={artist.name} />
                        <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Label htmlFor={`artistName-${artist.id}`}>Artist Name</Label>
                        <Input
                          id={`artistName-${artist.id}`}
                          value={artist.name}
                          onChange={(e) => handleUpdateArtist(artist.id, 'name', e.target.value)}
                          placeholder="Artist name"
                          className="mt-1 mb-2 form-field-focus"
                        />
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs flex items-center gap-1"
                          >
                            <Upload className="h-3 w-3" /> Change Photo
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveArtist(artist.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6">
                <Label>Languages</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input 
                    placeholder="Add language" 
                    value={currentLanguage}
                    onChange={(e) => setCurrentLanguage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddLanguage();
                      }
                    }}
                    className="form-field-focus"
                  />
                  <Button type="button" size="sm" onClick={handleAddLanguage}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {languages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {languages.map(language => (
                      <Badge key={language} variant="secondary" className="flex items-center gap-1">
                        {language}
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-4 w-4 p-0 ml-1" 
                          onClick={() => handleRemoveLanguage(language)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('tickets')}>Back</Button>
              <Button variant="default" onClick={() => setActiveTab('additional')}>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Additional Tab */}
        <TabsContent value="additional">
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Add any additional details for your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Kid Friendly?</Label>
                  <Select value={kidFriendly} onValueChange={setKidFriendly}>
                    <SelectTrigger className="mt-2 form-field-focus">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Pet Friendly?</Label>
                  <Select value={petFriendly} onValueChange={setPetFriendly}>
                    <SelectTrigger className="mt-2 form-field-focus">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Prohibited Items</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input 
                    placeholder="Add prohibited item" 
                    value={currentProhibitedItem}
                    onChange={(e) => setCurrentProhibitedItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddProhibitedItem();
                      }
                    }}
                    className="form-field-focus"
                  />
                  <Button type="button" size="sm" onClick={handleAddProhibitedItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {prohibitedItems.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {prohibitedItems.map((item, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {item}
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-4 w-4 p-0 ml-1" 
                          onClick={() => handleRemoveProhibitedItem(item)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
                <Textarea 
                  id="termsAndConditions" 
                  placeholder="Enter terms and conditions" 
                  rows={5}
                  value={termsAndConditions}
                  onChange={(e) => setTermsAndConditions(e.target.value)}
                  className="mt-2 form-field-focus"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Any other details you'd like to add" 
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2 form-field-focus"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('artists')}>Back</Button>
              <Button variant="default" onClick={handlePublishEvent}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing
                  </>
                ) : 'Publish Event'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateEvent;
