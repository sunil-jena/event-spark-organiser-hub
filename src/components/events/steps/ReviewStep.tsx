
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, MapPin, Calendar, Clock, Ticket, FileImage, Info } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BasicDetailsFormValues } from './BasicDetailsStep';
import { VenueFormValues } from './VenueStep';
import { DateFormValues } from './DateStep';
import { TimeSlotFormValues } from './TimeSlotStep';
import { TicketFormValues } from './TicketStep';
import { MediaFormValues } from './MediaStep';
import { AdditionalInfoFormValues } from './AdditionalInfoStep';

interface EventData {
  basicDetails: BasicDetailsFormValues;
  venues: VenueFormValues[];
  dates: DateFormValues[];
  timeSlots: TimeSlotFormValues[];
  tickets: TicketFormValues[];
  media: MediaFormValues;
  additionalInfo: AdditionalInfoFormValues;
}

interface ReviewStepProps {
  eventData: EventData;
  onSubmit: (eventData: EventData) => void;
  onBack: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ eventData, onSubmit, onBack }) => {
  const handleSubmit = () => {
    toast({
      title: "Processing Event",
      description: "Creating your event...",
    });
    
    // Submit the complete event data
    onSubmit(eventData);
  };

  const getTicketTypeLabel = (type: string) => {
    switch(type) {
      case 'standard': return 'Standard';
      case 'early-bird': return 'Early Bird';
      case 'vip': return 'VIP';
      case 'season-pass': return 'Season Pass';
      default: return type;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Review Your Event</h2>
        
        <div className="space-y-6">
          <Accordion type="multiple" defaultValue={["basicDetails"]}>
            {/* Basic Details */}
            <AccordionItem value="basicDetails">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Basic Details
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Event Title</h4>
                      <p className="text-base">{eventData.basicDetails.title}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Category</h4>
                      <p className="text-base">{eventData.basicDetails.category}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                    <p className="text-base whitespace-pre-wrap">{eventData.basicDetails.description}</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Organizer</h4>
                      <p className="text-base">{eventData.basicDetails.organizerName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p className="text-base">{eventData.basicDetails.organizerEmail}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                      <p className="text-base">{eventData.basicDetails.organizerPhone}</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Venues */}
            <AccordionItem value="venues">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Venues ({eventData.venues.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {eventData.venues.map((venue) => (
                    <div key={venue.id} className="border p-3 rounded-md">
                      <h4 className="text-base font-medium">{venue.name}</h4>
                      <p className="text-sm text-gray-600">
                        {venue.address}, {venue.city}, {venue.state} {venue.zipCode}
                      </p>
                      {venue.capacity && (
                        <p className="text-sm text-gray-500 mt-1">Capacity: {venue.capacity}</p>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Dates */}
            <AccordionItem value="dates">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Dates ({eventData.dates.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {eventData.dates.map((date) => {
                    const venue = eventData.venues.find(v => v.id === date.venueId);
                    
                    let dateDisplay = '';
                    if (date.type === 'single') {
                      dateDisplay = format(date.startDate, 'PPP');
                    } else if (date.type === 'range') {
                      dateDisplay = `${format(date.startDate, 'PPP')} to ${format(date.endDate!, 'PPP')}`;
                    } else if (date.type === 'recurring') {
                      dateDisplay = `Recurring from ${format(date.startDate, 'PPP')} to ${format(date.endDate!, 'PPP')}`;
                    }
                    
                    return (
                      <div key={date.id} className="border p-3 rounded-md">
                        <h4 className="text-base font-medium">{dateDisplay}</h4>
                        <p className="text-sm text-gray-600">
                          Type: {date.type.charAt(0).toUpperCase() + date.type.slice(1)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Venue: {venue?.name || 'Unknown venue'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Time Slots */}
            <AccordionItem value="timeSlots">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Time Slots ({eventData.timeSlots.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {eventData.timeSlots.map((slot) => {
                    const date = eventData.dates.find(d => d.id === slot.dateId);
                    let dateDisplay = date ? format(date.startDate, 'PPP') : 'Unknown date';
                    
                    // Convert 24h format to 12h AM/PM for display
                    const formatTimeToDisplay = (time24h: string) => {
                      const [hours, minutes] = time24h.split(':').map(Number);
                      const period = hours >= 12 ? 'PM' : 'AM';
                      const hours12 = hours % 12 || 12;
                      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
                    };
                    
                    return (
                      <div key={slot.id} className="border p-3 rounded-md">
                        <h4 className="text-base font-medium">
                          {formatTimeToDisplay(slot.startTime)} - {formatTimeToDisplay(slot.endTime)}
                        </h4>
                        <p className="text-sm text-gray-600">Date: {dateDisplay}</p>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Tickets */}
            <AccordionItem value="tickets">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center">
                  <Ticket className="h-5 w-5 mr-2" />
                  Tickets ({eventData.tickets.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {eventData.tickets.map((ticket) => (
                    <div key={ticket.id} className="border p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base font-medium">{ticket.name}</h4>
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                          {getTicketTypeLabel(ticket.ticketType)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">${ticket.price.toFixed(2)} • {ticket.quantity} available</p>
                      {ticket.description && (
                        <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                      )}
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Available for: {ticket.isAllDates ? 'All dates' : `${ticket.availableDateIds.length} selected dates`}</p>
                        <p>Time slots: {ticket.isAllTimeSlots ? 'All time slots' : `${ticket.availableTimeSlotIds.length} selected time slots`}</p>
                        {ticket.isLimited && ticket.saleStartDate && ticket.saleEndDate && (
                          <p>
                            On sale: {format(ticket.saleStartDate, 'M/d/yyyy')} to {format(ticket.saleEndDate, 'M/d/yyyy')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Media */}
            <AccordionItem value="media">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center">
                  <FileImage className="h-5 w-5 mr-2" />
                  Media
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {eventData.media.cardImage && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Card Image</h4>
                        <img
                          src={URL.createObjectURL(eventData.media.cardImage)}
                          alt="Card"
                          className="w-full h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                    
                    {eventData.media.bannerImage && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Banner Image</h4>
                        <img
                          src={URL.createObjectURL(eventData.media.bannerImage)}
                          alt="Banner"
                          className="w-full h-24 object-cover rounded-md border"
                        />
                      </div>
                    )}
                  </div>
                  
                  {eventData.media.youtubeLink && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">YouTube Video</h4>
                      <div className="border p-2 rounded-md">
                        <p className="text-sm truncate">{eventData.media.youtubeLink}</p>
                      </div>
                    </div>
                  )}
                  
                  {eventData.media.galleryImages.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Gallery Images ({eventData.media.galleryImages.length})
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {eventData.media.galleryImages.map((image, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-20 object-cover rounded-md border"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Additional Info */}
            <AccordionItem value="additionalInfo">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Additional Information
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {eventData.additionalInfo.eventRules && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Event Rules & Guidelines</h4>
                      <p className="text-sm whitespace-pre-wrap">{eventData.additionalInfo.eventRules}</p>
                    </div>
                  )}
                  
                  {eventData.additionalInfo.faq && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">FAQ</h4>
                      <p className="text-sm whitespace-pre-wrap">{eventData.additionalInfo.faq}</p>
                    </div>
                  )}
                  
                  {eventData.additionalInfo.terms && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Terms & Conditions</h4>
                      <p className="text-sm whitespace-pre-wrap">{eventData.additionalInfo.terms}</p>
                    </div>
                  )}
                  
                  {eventData.additionalInfo.refundPolicy && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Refund Policy</h4>
                      <p className="text-sm whitespace-pre-wrap">{eventData.additionalInfo.refundPolicy}</p>
                    </div>
                  )}
                  
                  {!eventData.additionalInfo.eventRules && 
                   !eventData.additionalInfo.faq && 
                   !eventData.additionalInfo.terms && 
                   !eventData.additionalInfo.refundPolicy && (
                    <p className="text-sm text-gray-500">No additional information provided.</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit}
            className="flex items-center"
          >
            Create Event <Check className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
