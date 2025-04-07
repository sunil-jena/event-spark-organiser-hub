
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  BasicDetailsFormValues,
  VenueFormValues,
  DateFormValues,
  TimeSlotFormValues,
  TicketFormValues,
  MediaFormValues,
  AdditionalInfoFormValues
} from '@/components/events/steps/types';
import { EventCreationStep, StepStatus } from '@/components/events/CreateEventSidebar';

// Define initial form values
const initialBasicDetails: BasicDetailsFormValues = {
  title: '',
  category: '',
  description: '',
  organizerName: '',
  organizerEmail: '',
  organizerPhone: '',
  additionalInfo: '',
  terms: '',
};

const initialMedia: MediaFormValues = {
  galleryImages: [],
};

const initialAdditionalInfo: AdditionalInfoFormValues = {};

// Define default step statuses
const defaultEventStepStatuses: Record<EventCreationStep, StepStatus> = {
  basicDetails: { status: 'current', isClickable: true },
  venues: { status: 'incomplete', isClickable: false },
  dates: { status: 'incomplete', isClickable: false },
  times: { status: 'incomplete', isClickable: false },
  tickets: { status: 'incomplete', isClickable: false },
  media: { status: 'incomplete', isClickable: false },
  additionalInfo: { status: 'incomplete', isClickable: false },
  review: { status: 'incomplete', isClickable: false },
};

// Define the context state interface
interface EventContextState {
  // Form data
  basicDetails: BasicDetailsFormValues;
  setBasicDetails: (data: BasicDetailsFormValues) => void;
  venues: VenueFormValues[];
  setVenues: (data: VenueFormValues[]) => void;
  dates: DateFormValues[];
  setDates: (data: DateFormValues[]) => void;
  timeSlots: TimeSlotFormValues[];
  setTimeSlots: (data: TimeSlotFormValues[]) => void;
  tickets: TicketFormValues[];
  setTickets: (data: TicketFormValues[]) => void;
  media: MediaFormValues;
  setMedia: (data: MediaFormValues) => void;
  additionalInfo: AdditionalInfoFormValues;
  setAdditionalInfo: (data: AdditionalInfoFormValues) => void;
  
  // Helper functions
  resetEventData: () => void;
  getEventData: () => any;
  
  // Current step
  currentStep: EventCreationStep;
  setCurrentStep: (step: EventCreationStep) => void;
}

// Create the context
const EventContext = createContext<EventContextState | undefined>(undefined);

// Create the provider component
export const EventContextProvider = ({ children }: { children: ReactNode }) => {
  // Form data state
  const [basicDetails, setBasicDetails] = useState<BasicDetailsFormValues>(() => {
    const saved = localStorage.getItem('event_basicDetails');
    return saved ? JSON.parse(saved) : initialBasicDetails;
  });
  
  const [venues, setVenues] = useState<VenueFormValues[]>(() => {
    const saved = localStorage.getItem('event_venues');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [dates, setDates] = useState<DateFormValues[]>(() => {
    const saved = localStorage.getItem('event_dates');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [timeSlots, setTimeSlots] = useState<TimeSlotFormValues[]>(() => {
    const saved = localStorage.getItem('event_timeSlots');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [tickets, setTickets] = useState<TicketFormValues[]>(() => {
    const saved = localStorage.getItem('event_tickets');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [media, setMedia] = useState<MediaFormValues>(() => {
    const saved = localStorage.getItem('event_media');
    return saved ? JSON.parse(saved) : initialMedia;
  });
  
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoFormValues>(() => {
    const saved = localStorage.getItem('event_additionalInfo');
    return saved ? JSON.parse(saved) : initialAdditionalInfo;
  });
  
  // Current step state
  const [currentStep, setCurrentStep] = useState<EventCreationStep>(() => {
    const saved = localStorage.getItem('event_currentStep');
    return saved ? saved as EventCreationStep : 'basicDetails';
  });
  
  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('event_basicDetails', JSON.stringify(basicDetails));
  }, [basicDetails]);
  
  useEffect(() => {
    localStorage.setItem('event_venues', JSON.stringify(venues));
  }, [venues]);
  
  useEffect(() => {
    localStorage.setItem('event_dates', JSON.stringify(dates));
  }, [dates]);
  
  useEffect(() => {
    localStorage.setItem('event_timeSlots', JSON.stringify(timeSlots));
  }, [timeSlots]);
  
  useEffect(() => {
    localStorage.setItem('event_tickets', JSON.stringify(tickets));
  }, [tickets]);
  
  useEffect(() => {
    localStorage.setItem('event_media', JSON.stringify(media));
  }, [media]);
  
  useEffect(() => {
    localStorage.setItem('event_additionalInfo', JSON.stringify(additionalInfo));
  }, [additionalInfo]);
  
  useEffect(() => {
    localStorage.setItem('event_currentStep', currentStep);
  }, [currentStep]);
  
  // Function to reset all event data
  const resetEventData = () => {
    setBasicDetails(initialBasicDetails);
    setVenues([]);
    setDates([]);
    setTimeSlots([]);
    setTickets([]);
    setMedia(initialMedia);
    setAdditionalInfo(initialAdditionalInfo);
    setCurrentStep('basicDetails');
    
    // Clear localStorage
    localStorage.removeItem('event_basicDetails');
    localStorage.removeItem('event_venues');
    localStorage.removeItem('event_dates');
    localStorage.removeItem('event_timeSlots');
    localStorage.removeItem('event_tickets');
    localStorage.removeItem('event_media');
    localStorage.removeItem('event_additionalInfo');
    localStorage.removeItem('event_currentStep');
  };
  
  // Function to get all event data
  const getEventData = () => {
    return {
      basicDetails,
      venues,
      dates,
      timeSlots,
      tickets,
      media,
      additionalInfo
    };
  };
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue: EventContextState = {
    basicDetails,
    setBasicDetails,
    venues,
    setVenues,
    dates,
    setDates,
    timeSlots,
    setTimeSlots,
    tickets,
    setTickets,
    media,
    setMedia,
    additionalInfo,
    setAdditionalInfo,
    resetEventData,
    getEventData,
    currentStep,
    setCurrentStep
  };
  
  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

// Create a custom hook to use the event context
export const useEventContext = (): EventContextState => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEventContext must be used within an EventContextProvider');
  }
  return context;
};

// Define the types for step components
export type { 
  BasicDetailsFormValues,
  VenueFormValues,
  DateFormValues,
  TimeSlotFormValues,
  TicketFormValues,
  MediaFormValues,
  AdditionalInfoFormValues
};
