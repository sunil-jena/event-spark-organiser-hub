
// This file defines the types used in event creation steps

export interface BasicDetailsFormValues {
  title: string;
  category: string;
  description: string;
  additionalInfo?: string;
  // terms?: string;
  eventType: "public" | "private";
  // aboutMessage: string;
  eventHighlights: string[];
  tags: string[];
  language: string[];
  ageGroup: number;
  ticketNeededForAges: number;
  layout: string;
  seatingArrangementOption: string;
  kidFriendly: string;
  petFriendly: string;
  termsAndConditions?: string;
  isOnline: boolean;
  videoConferenceProvider: string;
  videoConferenceUrl: string;
  videoConferencePassword: string;
}

export interface VenueFormValues {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  tba?: boolean; // To Be Determined flag
  isActiveLocation: boolean;
}

export interface DateFormValues {
  id: string;
  venueId: string,
  // This extra field comes from your context; for example, if you need to support multiple dates.
  dateType: 'single' | 'multiple' | 'range' | 'recurring';
  // For multiple dates (if needed), stored as numbers.
  dates: number[];
  // Main dates stored as numbers (ddMMyyyy).
  startDate: number;
  endDate?: number;
  // Additional flags you might need.
  isDateRange: boolean;
  isSingleDay: boolean;
  // Optional recurring details using numeric values.
  // recurring?: {
  //   startDate: number;
  //   recurrencePattern: 'daily' | 'weekly' | 'monthly';
  //   occurrences: number;
  //   generatedDates: number[];
  // };
  // // Simplified recurring fields for this step
  recurringType?: 'daily' | 'weekly' | 'monthly';
  recurringUntil?: number;
  recurringDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  // notes?: string;
}

export interface TimeSlotFormValues {
  id: string;
  dateId: string;
  venueId: string;
  startTime: string;
  endTime: string;
  capacity?: number;
  artists?: {
    artistId: string;
    bannerImage: string;
  }[];
  gateOpensBeforeStart: boolean;
  gateOpenType?: 'minute' | 'hour';
  gateOpenDuration?: number;
}

export interface TicketFormValues {
  id: string;
  name: string;
  description: string[];
  price: number;
  quantity: number;
  ticketType: "free" | "paid"; // Only free or paid tickets allowed
  ticketCategory: 'standard' | 'early-bird' | 'vip' | 'season-pass' | string;
  entryPerTicket: number;
  bookingPerTicket: number;
  ticketStatus:
  | "active"
  | "inactive"
  | "sold out"
  | "expired"
  | "filling fast"
  | "coming soon"
  | "few tickets left"
  | "offline sell";
  isAllDates: boolean;
  availableDateIds: string[];
  isAllTimeSlots: boolean;
  availableTimeSlotIds: string[];
  isAllVenues: boolean;
  venueIds: string[],
  isCombo: boolean
  dateIds: string[]; // Associated dates
  timeSlotIds?: string[]; // Optional associated time slots
  isLimited: boolean; // Required property
  saleStartDate?: Date;
  saleEndDate?: Date;
  // promoCodes?: {
  //   code: string;
  //   discountPercentage: number;
  //   validFrom: Date;
  //   validTo: Date;
  // }[];
}

export interface MediaFormValues {
  galleryImages: string[];
  eventcardImage?: string | null;
  eventVerticalCardImage?: string | null;
  eventBannerImage?: string[];
  eventVerticalBannerImage?: string[];
  eventVerticalVideo?: string;
  youtubeLink?: string;
}

// export interface AdditionalInfoFormValues {
//   eventRules?: string;
//   faq?: string;
//   terms?: string;
//   refundPolicy?: string;
//   accessibility?: string[];
//   sponsor?: {
//     brandName: string;
//     brandLogo: string;
//     priority: number;
//   }[];
//   // isPromoted?: {
//   //   isActive: boolean;
//   //   priority: number;
//   // };
//   // trendingShow?: {
//   //   isTrending: boolean;
//   //   priority: number;
//   // };
//   // bookingStatus?: 'open' | 'closed' | 'opening soon' | 'sold out' | 'filling fast';
//   // isFillingFast?: boolean;
// }

// Define artist type
export interface ArtistFormValues {
  id: string;
  name: string;
  bio?: string;
  image?: string;
  socialMedia?: {
    platform: string;
    url: string;
  }[];
}

export interface AdditionalInfoFormValues {
  termsAndConditions: string;
  prohibitedItems: string[];
  sponsors: Sponsor[];
  faqItems?: FaqItem[];
}

// Define an event data interface to include all form values
export interface EventData {
  basicDetails: BasicDetailsFormValues;
  venues: VenueFormValues[];
  dates: DateFormValues[];
  timeSlots: TimeSlotFormValues[];
  tickets: TicketFormValues[];
  media: MediaFormValues;
  additionalInfo: AdditionalInfoFormValues;
  artists?: ArtistFormValues[];
}

export interface ProhibitedItem {
  id: string;
  label: string;
}

export interface Sponsor {
  brandName: string;
  brandLogo: string;
  priority: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const COMMON_PROHIBITED_ITEMS: ProhibitedItem[] = [
  { id: 'weapons', label: 'Weapons of any kind' },
  { id: 'alcohol', label: 'Outside alcohol' },
  { id: 'drugs', label: 'Illegal substances' },
  { id: 'glass', label: 'Glass containers' },
  { id: 'cans', label: 'Cans or metal containers' },
  { id: 'bottles', label: 'Plastic bottles over 1L' },
  { id: 'food', label: 'Outside food and beverages' },
  { id: 'pets', label: 'Pets (except service animals)' },
  { id: 'cameras', label: 'Professional cameras without credentials' },
  { id: 'drones', label: 'Drones or aerial equipment' },
  { id: 'selfie', label: 'Selfie sticks' },
  { id: 'fireworks', label: 'Fireworks or explosives' },
  { id: 'lasers', label: 'Laser pointers' },
  { id: 'megaphone', label: 'Megaphones or sound amplifiers' },
  { id: 'flags', label: 'Large flags or banners' },
  { id: 'chairs', label: 'Chairs or furniture' },
  { id: 'skateboards', label: 'Skateboards, scooters, or bicycles' },
  { id: 'markers', label: 'Permanent markers or spray paint' },
  { id: 'instruments', label: 'Musical instruments' },
  { id: 'flammable', label: 'Flammable materials' }
];


export type EventCreationStep =
  | 'basicDetails'
  | 'venues'
  | 'dates'
  | 'times'
  | 'tickets'
  | 'media'
  | 'additionalInfo'
  | 'review';

export type StepStatus = {
  status: 'incomplete' | 'current' | 'complete';
  isClickable: boolean;
};

export type EventCreationStepStatus = Record<EventCreationStep, StepStatus>;

// interface CreateEventSidebarProps {
//   currentStep: EventCreationStep;
//   stepStatuses: Record<EventCreationStep, StepStatus>;
//   onStepClick: (step: EventCreationStep) => void;
// }