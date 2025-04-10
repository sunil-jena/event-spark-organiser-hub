
// This file defines the types used in event creation steps

export interface BasicDetailsFormValues {
  title: string;
  category: string;
  description: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  additionalInfo?: string;
  terms?: string;
  eventType: "public" | "private";
  aboutMessage: string;
  eventHighlights: string[];
  tags: string[];
  language: string[];
  ageGroup: number;
  ticketNeededForAges: number;
  layout: string;
  seatingArrangementOption: string;
  kidFriendly: string;
  petFriendly: string;
  termsAndConditions: string;
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
  isTBD?: boolean; // To Be Determined flag
  venueToBeAnnounced: boolean;
  isActiveLocation: boolean;
}

export interface DateFormValues {
  id: string;
  venueId: string;
  type: 'single' | 'multiple' | 'range' | 'recurring';  // Added this required property
  dateType: 'single' | 'multiple' | 'range' | 'recurring';
  dates: Date[];
  startDate: Date;
  endDate?: Date;
  isDateRange: boolean;
  isSingleDay: boolean;
  recurring?: {
    startDate: Date;
    recurrencePattern: 'daily' | 'weekly' | 'monthly';
    occurrences: number;
    generatedDates: Date[];
  };
  range?: {
    startDate: Date;
    endDate: Date;
  };
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
  description: string;
  price: number;
  quantity: number;
  // Adding required properties based on error messages
  ticketType: string;
  isAllDates: boolean;
  availableDateIds: string[];
  isAllTimeSlots: boolean;
  availableTimeSlotIds: string[];
  dateIds: string[]; // Associated dates
  timeSlotIds?: string[]; // Optional associated time slots
  promoCodes?: {
    code: string;
    discountPercentage: number;
    validFrom: Date;
    validTo: Date;
  }[];
}

export interface MediaFormValues {
  galleryImages: (string | File)[];
  cardImage?: File;
  coverImage?: string | File;
  bannerImage?: File; // Changed to match component's expectation
  verticalBannerImage?: File;
  eventVerticalCardImage?: string | File;
  eventBannerImage?: (string | File)[];
  eventVerticalBannerImage?: (string | File)[];
  eventVerticalVideo?: string;
  eventMediaLink?: string;
  youtubeLink?: string;
}

export interface AdditionalInfoFormValues {
  eventRules?: string;
  faq?: string; // Changed to match component's expectation
  terms?: string;
  refundPolicy?: string;
  ageRestriction?: string;
  accessibility?: string[];
  tags?: string[];
  customFields?: { name: string; value: string }[];
  sponsor?: {
    brandName: string;
    brandLogo: string;
    priority: number;
  }[];
  isPromoted?: {
    isActive: boolean;
    priority: number;
  };
  trendingShow?: {
    isTrending: boolean;
    priority: number;
  };
  bookingStatus?: 'open' | 'closed' | 'opening soon' | 'sold out' | 'filling fast';
  isFillingFast?: boolean;
}

// Define artist type
export interface ArtistFormValues {
  id: string;
  name: string;
  bio?: string;
  image?: string | File;
  socialMedia?: {
    platform: string;
    url: string;
  }[];
}
