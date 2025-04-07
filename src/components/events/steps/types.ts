
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
}

export interface DateFormValues {
  id: string;
  venueId: string;
  startDate: Date;
  endDate?: Date;
  isSingleDay: boolean;
  isDateRange: boolean;
}

export interface TimeSlotFormValues {
  id: string;
  dateId: string;
  startTime: string;
  endTime: string;
  capacity?: number;
}

export interface TicketFormValues {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  dateIds: string[]; // Associated dates
  timeSlotIds?: string[]; // Optional associated time slots
}

export interface MediaFormValues {
  galleryImages: string[] | File[];
  coverImage?: string | File;
  bannerImage?: string | File;
}

export interface AdditionalInfoFormValues {
  faq?: { question: string; answer: string }[];
  ageRestriction?: string;
  accessibility?: string[];
  tags?: string[];
  customFields?: { name: string; value: string }[];
}
