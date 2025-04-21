import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Check,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  FileImage,
  Info,
  ImagePlus,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EventData, TicketAssignmentValues } from './types';

// Helper function to format Indian price
const formatIndianPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Props for the review page
interface ReviewStepProps {
  eventData: EventData;
  onSubmit: (eventData: EventData) => void;
  onBack: () => void;
}

// Helper to get a friendly ticket type label
const getTicketTypeLabel = (type: string): string => {
  switch (type) {
    case 'standard':
      return 'Standard';
    case 'early-bird':
      return 'Early Bird';
    case 'vip':
      return 'VIP';
    case 'season-pass':
      return 'Season Pass';
    case 'free':
      return 'Free';
    case 'donation':
      return 'Donation';
    default:
      return type;
  }
};

// Helper function to safely create object URLs for image previews
const getImageUrl = (image: string | File | null | undefined): string => {
  if (!image) return '';
  return image instanceof File ? URL.createObjectURL(image) : image;
};

// Helper to convert a numeric date (ddMMyyyy) to a Date object
const convertNumberToDate = (num: number): Date => {
  const str = num.toString().padStart(8, '0');
  const day = parseInt(str.slice(0, 2), 10);
  const month = parseInt(str.slice(2, 4), 10) - 1;
  const year = parseInt(str.slice(4, 8), 10);
  return new Date(year, month, day);
};

// Helper to format a 24-hour time (HH:mm) into a 12-hour format with AM/PM.
const formatTime = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Main ReviewStep component
export const ReviewStep: React.FC<ReviewStepProps> = ({
  eventData,
  onSubmit,
  onBack,
}) => {
  // -----------------------------
  // Banner section
  // -----------------------------
  // Use the first banner image if available; otherwise, fallback to the card image.
  const bannerImage =
    eventData.media.eventBannerImage &&
    eventData.media.eventBannerImage.length > 0
      ? eventData.media.eventBannerImage[0]
      : eventData.media.eventcardImage;

  // -----------------------------
  // Basic Details
  // -----------------------------
  const { basicDetails } = eventData;

  // -----------------------------
  // Event Highlights & Languages
  // -----------------------------
  const highlights = basicDetails.eventHighlights || [];
  const languages = basicDetails.language || [];

  // -----------------------------
  // Venues
  // -----------------------------
  const venues = eventData.venues || [];

  // Build lookup maps
  const venueMap = new Map(venues.map((v) => [v.id, v]));
  const dateMap = new Map(eventData.dates.map((d) => [d.id, d]));
  const slotMap = new Map(eventData.timeSlots.map((s) => [s.id, s]));
  const ticketMap = new Map(eventData.tickets.map((t) => [t.id, t]));

  // Group assigned tickets by ticket name
  const grouped: Record<string, TicketAssignmentValues[]> = {};
  eventData.assigntickets.forEach((a: TicketAssignmentValues) => {
    const ticket = ticketMap.get(a.ticketId);
    const name = ticket ? ticket.name : 'Unknown';
    if (!grouped[name]) grouped[name] = [];
    grouped[name].push(a);
  });
  // -----------------------------
  // Dates & Time Slots
  // -----------------------------
  const renderDatesAndTimeSlots = () => {
    if (!eventData.dates || eventData.dates.length === 0) {
      return <p className='text-sm text-gray-500'>No dates set</p>;
    }
    return eventData.dates.map((date) => {
      const start = format(convertNumberToDate(date.startDate), 'PPP');
      const end = date.endDate
        ? format(convertNumberToDate(date.endDate), 'PPP')
        : null;
      const slots = eventData.timeSlots.filter(
        (slot) => slot.dateId === date.id
      );
      return (
        <div key={date.id} className='border p-3 rounded-md mb-4'>
          <p className='font-medium'>
            {date.dateType === 'single'
              ? start
              : end
                ? `${start} - ${end}`
                : start}
          </p>
          {/* {date.notes && <p className="text-sm text-gray-500">{date.notes}</p>} */}
          {slots.length > 0 ? (
            <div className='mt-2 space-y-1'>
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className='flex items-center gap-2 text-sm text-gray-600'
                >
                  <Clock className='h-4 w-4' />
                  <span>
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </span>
                  <span></span>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-sm text-gray-500'>No time slots</p>
          )}
        </div>
      );
    });
  };

  // -----------------------------
  // Tickets
  // -----------------------------
  const renderTickets = () => {
    if (!eventData.tickets || eventData.tickets.length === 0) {
      return <p className='text-sm text-gray-500'>No tickets created</p>;
    }
    return (
      <table className='w-full border-collapse'>
        <thead>
          <tr className='border-b'>
            <th className='p-2 text-left'>Name</th>
            <th className='p-2 text-left'>Type</th>
            <th className='p-2 text-left'>Price</th>
            <th className='p-2 text-left'>Quantity</th>
            <th className='p-2 text-left'>Status</th>
          </tr>
        </thead>
        <tbody>
          {eventData.tickets.map((ticket) => (
            <tr key={ticket.id} className='border-b'>
              <td className='p-2'>{ticket.name}</td>
              <td className='p-2'>{getTicketTypeLabel(ticket.ticketType)}</td>
              <td className='p-2'>
                {ticket.ticketType === 'free'
                  ? 'Free'
                  : formatIndianPrice(ticket.price)}
              </td>
              <td className='p-2'>{ticket.quantity}</td>
              <td className='p-2'>{ticket.ticketStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // -----------------------------
  // Media
  // -----------------------------
  const { media } = eventData;

  // -----------------------------
  // Additional Information
  // -----------------------------
  const { additionalInfo } = eventData;

  // -----------------------------
  // Artists (if available)
  // -----------------------------
  const artists = eventData.artists || [];

  // -----------------------------
  // Submit handler
  // -----------------------------
  const handleSubmit = () => {
    toast({
      title: 'Processing Event',
      description: 'Creating your event...',
    });
    onSubmit(eventData);
  };

  return (
    <Card>
      <CardContent className='p-0'>
        {/* Banner Section */}
        <div className='relative'>
          <div className='h-64 bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center'>
            {bannerImage ? (
              <img
                src={getImageUrl(bannerImage)}
                alt='Event Banner'
                className='h-full w-full object-contain'
              />
            ) : (
              <div className='flex flex-col items-center justify-center'>
                <ImagePlus className='h-12 w-12 text-gray-400' />
                <p className='mt-2 text-gray-500'>No banner image uploaded</p>
              </div>
            )}
          </div>
          <div className='absolute bottom-4 left-4 flex gap-2'>
            <Badge className='bg-primary/80 text-white'>
              {basicDetails.category || 'Category'}
            </Badge>
            {basicDetails.isOnline && (
              <Badge variant='outline' className='bg-blue-500/80 text-white'>
                Online Event
              </Badge>
            )}
          </div>
        </div>

        <div className='p-6 space-y-6'>
          {/* Basic Details Section */}
          <div>
            <h2 className='text-2xl font-bold'>
              {basicDetails.title || 'Event Title'}
            </h2>
            <p className='mt-4'>{basicDetails.description}</p>

            {basicDetails.aboutMessage && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>About the Event</h3>
                <p>{basicDetails.aboutMessage}</p>
              </div>
            )}

            {basicDetails.eventHighlights &&
              basicDetails.eventHighlights.length > 0 && (
                <div className='mt-4'>
                  <h3 className='text-lg font-semibold'>Event Highlights</h3>
                  <ul className='list-disc list-inside'>
                    {basicDetails.eventHighlights.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

            {basicDetails.language && basicDetails.language.length > 0 && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Languages</h3>
                <div className='flex flex-wrap gap-2'>
                  {basicDetails.language.map((lang, idx) => (
                    <Badge key={idx} variant='secondary'>
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {basicDetails.tags && basicDetails.tags.length > 0 && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Tags</h3>
                <div className='flex flex-wrap gap-2'>
                  {basicDetails.tags.map((tag, idx) => (
                    <Badge key={idx} variant='secondary'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Venues Section */}
          <div>
            <h3 className='text-2xl font-bold mb-4'>Venues</h3>
            {venues.length > 0 ? (
              <div className='grid sm:grid-cols-2 gap-4'>
                {venues.map((venue) => (
                  <div key={venue.id} className='border p-3 rounded-md'>
                    <h4 className='font-medium'>{venue.name}</h4>
                    <p className='text-sm text-gray-600'>
                      {venue.address}, {venue.city}, {venue.state}{' '}
                      {venue.zipCode}
                    </p>
                    {venue.capacity && (
                      <p className='text-xs text-gray-500 mt-1'>
                        Capacity: {venue.capacity}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-gray-500'>No venues added</p>
            )}
          </div>

          {/* Dates & Time Slots Section */}
          <div>
            <h3 className='text-2xl font-bold mb-4'>Event Schedule</h3>
            {renderDatesAndTimeSlots()}
          </div>

          {/* Tickets Section */}
          <div>
            <h3 className='text-2xl font-bold mb-4'>Tickets</h3>
            {renderTickets()}
          </div>
          <div className='p-6'>
            <h3 className='text-2xl font-bold mb-4'>Assigned Tickets</h3>
            {Object.keys(grouped).length === 0 ? (
              <p className='text-sm text-gray-500'>No assigned tickets</p>
            ) : (
              Object.entries(grouped).map(([ticketName, assigns]) => (
                <div key={ticketName} className='mb-4'>
                  <h4 className='text-xl font-semibold'>{ticketName}</h4>
                  <ul className='list-disc list-inside'>
                    {assigns.map((a, idx) => {
                      const venue = venueMap.get(a.venueId);
                      const dateObj = dateMap.get(a.dateId);
                      const slot = slotMap.get(a.timeSlotId);
                      const dateStr = dateObj
                        ? format(convertNumberToDate(dateObj.startDate), 'PPP')
                        : 'Unknown date';
                      const timeStr = slot
                        ? `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`
                        : 'Unknown time';
                      return (
                        <li key={idx} className='text-sm text-gray-700'>
                          {venue ? venue.name : 'Unknown venue'} — {dateStr},{' '}
                          {timeStr}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>

          {/* Media Section */}
          <div>
            <h3 className='text-2xl font-bold mb-4'>Media</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {media.eventcardImage && (
                <div>
                  <h4 className='text-sm font-medium text-gray-500 mb-2'>
                    Card Image
                  </h4>
                  <img
                    src={getImageUrl(media.eventcardImage)}
                    alt='Card'
                    className='w-full h-32 object-contain rounded-md border'
                  />
                </div>
              )}
              {media.eventVerticalCardImage && (
                <div>
                  <h4 className='text-sm font-medium text-gray-500 mb-2'>
                    Vertical Card Image
                  </h4>
                  <img
                    src={getImageUrl(media.eventVerticalCardImage)}
                    alt='Vertical Card'
                    className='w-full h-32 object-contain rounded-md border'
                  />
                </div>
              )}
            </div>
            {media.eventBannerImage && media.eventBannerImage.length > 0 && (
              <div className='mt-4'>
                <h4 className='text-sm font-medium text-gray-500 mb-2'>
                  Banner Image
                </h4>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
                  {media.eventBannerImage.map((image, index) => (
                    <div
                      key={index}
                      className='relative group rounded-md overflow-hidden border'
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`Banner Image ${index + 1}`}
                        className='w-full h-40 object-contain'
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {media.youtubeLink && (
              <div className='mt-4'>
                <h4 className='text-sm font-medium text-gray-500 mb-2'>
                  YouTube Video
                </h4>
                <div className='flex items-center border p-2 rounded-md justify-between'>
                  <p className='text-sm truncate'>{media.youtubeLink}</p>
                  <Button
                    type='button'
                    size='sm'
                    variant='ghost'
                    onClick={() => window.open(media.youtubeLink, '_blank')}
                  >
                    <ExternalLink className='h-3 w-3' />
                  </Button>
                </div>
              </div>
            )}
            {media.galleryImages && media.galleryImages.length > 0 && (
              <div className='mt-6'>
                <h3 className='text-2xl font-bold mb-4'>Gallery</h3>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
                  {media.galleryImages.map((image: any, index: number) => (
                    <img
                      key={image?.id || index}
                      src={getImageUrl(image)}
                      alt={`Gallery Image ${index + 1}`}
                      className='w-full h-20 object-cover rounded-md border'
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Information Section */}
          <div>
            <h3 className='text-2xl font-bold mb-4'>Additional Information</h3>
            {additionalInfo ? (
              <div className='space-y-4'>
                {additionalInfo.termsAndConditions && (
                  <div>
                    <h4 className='text-lg font-medium text-gray-500 mb-1'>
                      Terms & Conditions
                    </h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: additionalInfo.termsAndConditions,
                      }}
                    ></div>
                    {/* <p className='text-sm whitespace-pre-wrap'>
                      {additionalInfo.termsAndConditions}
                    </p> */}
                  </div>
                )}
                {additionalInfo?.faqItems &&
                  additionalInfo?.faqItems?.length > 0 && (
                    <div>
                      <h4 className='text-lg font-medium text-gray-500 mb-1'>
                        FAQ
                      </h4>
                      {additionalInfo?.faqItems?.map((faq, index) => (
                        <div key={index} className='mb-2'>
                          <p className='font-medium'>{faq.question}</p>
                          <p className='text-sm'>{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                {additionalInfo.prohibitedItems &&
                  additionalInfo.prohibitedItems.length > 0 && (
                    <div>
                      <h4 className='text-lg font-medium text-gray-500 mb-1'>
                        Prohibited Items
                      </h4>
                      <div className='flex flex-wrap gap-2'>
                        {additionalInfo.prohibitedItems.map((item, index) => (
                          <Badge
                            key={index}
                            variant='outline'
                            className='bg-red-50 text-red-500 border-red-200'
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <p className='text-sm text-gray-500'>
                No additional information provided.
              </p>
            )}
          </div>

          {/* Artists Section */}
          {eventData.artists && eventData.artists.length > 0 && (
            <div className='mt-6 border-t pt-4'>
              <h3 className='text-2xl font-bold mb-4'>Artists</h3>
              <div className='flex flex-wrap gap-4'>
                {eventData.artists.map((artist) => (
                  <div key={artist.id} className='flex items-center gap-2'>
                    <Avatar>
                      <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium'>{artist.name}</p>
                      {artist.bio && (
                        <p className='text-sm text-gray-500'>{artist.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardContent className='p-6'>
        <div className='flex justify-between'>
          <Button type='button' variant='outline' onClick={onBack}>
            Back
          </Button>
          <Button
            type='button'
            onClick={() => {
              toast({
                title: 'Processing Event',
                description: 'Creating your event...',
              });
              onSubmit(eventData);
            }}
            className='flex items-center'
          >
            Create Event <Check className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
