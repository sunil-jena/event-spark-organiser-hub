
import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

// Import the sidebar and step components
import { CreateEventSidebar, EventCreationStep, StepStatus } from '@/components/events/CreateEventSidebar';
import { BasicDetailsStep, BasicDetailsFormValues } from '@/components/events/steps/BasicDetailsStep';
import { VenueStep, VenueFormValues } from '@/components/events/steps/VenueStep';
import { DateStep, DateFormValues } from '@/components/events/steps/DateStep';
import { TimeSlotStep, TimeSlotFormValues } from '@/components/events/steps/TimeSlotStep';
import { TicketStep, TicketFormValues } from '@/components/events/steps/TicketStep';
import { MediaStep, MediaFormValues } from '@/components/events/steps/MediaStep';
import { AdditionalInfoStep, AdditionalInfoFormValues } from '@/components/events/steps/AdditionalInfoStep';
import { ReviewStep } from '@/components/events/steps/ReviewStep';

// Initialize default form values
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

const CreateEvent = () => {
  const { scrollToTop } = useAppContext();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Current step and completed steps tracking
  const [currentStep, setCurrentStep] = useState<EventCreationStep>('basicDetails');
  const [stepStatuses, setStepStatuses] = useState<Record<EventCreationStep, StepStatus>>({
    basicDetails: { status: 'current', isClickable: true },
    venues: { status: 'incomplete', isClickable: false },
    dates: { status: 'incomplete', isClickable: false },
    times: { status: 'incomplete', isClickable: false },
    tickets: { status: 'incomplete', isClickable: false },
    media: { status: 'incomplete', isClickable: false },
    additionalInfo: { status: 'incomplete', isClickable: false },
    review: { status: 'incomplete', isClickable: false },
  });
  
  // Form data for each step
  const [basicDetails, setBasicDetails] = useState<BasicDetailsFormValues>(initialBasicDetails);
  const [venues, setVenues] = useState<VenueFormValues[]>([]);
  const [dates, setDates] = useState<DateFormValues[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlotFormValues[]>([]);
  const [tickets, setTickets] = useState<TicketFormValues[]>([]);
  const [media, setMedia] = useState<MediaFormValues>(initialMedia);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoFormValues>(initialAdditionalInfo);
  
  // Handle step change
  const handleStepClick = (step: EventCreationStep) => {
    if (stepStatuses[step].isClickable) {
      setCurrentStep(step);
      
      // Mark clicked step as current and others based on their status
      setStepStatuses(prev => {
        const newStatuses = { ...prev };
        
        Object.keys(newStatuses).forEach(key => {
          if (key === step) {
            newStatuses[key as EventCreationStep].status = 'current';
          } else if (newStatuses[key as EventCreationStep].status === 'current') {
            newStatuses[key as EventCreationStep].status = 'complete';
          }
        });
        
        return newStatuses;
      });
      
      // Scroll to top when changing steps
      scrollToTop();
    }
  };
  
  // Mark current step as complete and move to next step
  const completeStep = (nextStep: EventCreationStep) => {
    setStepStatuses(prev => ({
      ...prev,
      [currentStep]: { ...prev[currentStep], status: 'complete' },
      [nextStep]: { ...prev[nextStep], status: 'current', isClickable: true }
    }));
    
    setCurrentStep(nextStep);
    scrollToTop();
  };
  
  // Enable all steps for reviewing or editing after event creation
  const enableAllSteps = () => {
    setStepStatuses(prev => {
      const newStatuses = { ...prev };
      
      Object.keys(newStatuses).forEach(key => {
        newStatuses[key as EventCreationStep].isClickable = true;
        if (newStatuses[key as EventCreationStep].status === 'incomplete') {
          newStatuses[key as EventCreationStep].status = 'complete';
        }
      });
      
      return newStatuses;
    });
  };
  
  // Handle form submissions for each step
  const handleBasicDetailsSubmit = (values: BasicDetailsFormValues) => {
    setBasicDetails(values);
    completeStep('venues');
  };
  
  const handleVenuesSubmit = (values: VenueFormValues[]) => {
    setVenues(values);
    completeStep('dates');
  };
  
  const handleDatesSubmit = (values: DateFormValues[]) => {
    setDates(values);
    completeStep('times');
  };
  
  const handleTimeSlotSubmit = (values: TimeSlotFormValues[]) => {
    setTimeSlots(values);
    completeStep('tickets');
  };
  
  const handleTicketSubmit = (values: TicketFormValues[]) => {
    setTickets(values);
    completeStep('media');
  };
  
  const handleMediaSubmit = (values: MediaFormValues) => {
    setMedia(values);
    completeStep('additionalInfo');
  };
  
  const handleAdditionalInfoSubmit = (values: AdditionalInfoFormValues) => {
    setAdditionalInfo(values);
    completeStep('review');
  };
  
  const handleFinalSubmit = () => {
    // Prepare event data for submission
    const eventData = {
      basicDetails,
      venues,
      dates,
      timeSlots,
      tickets,
      media,
      additionalInfo
    };
    
    // Simulate API call
    setTimeout(() => {
      console.log('Event data submitted:', eventData);
      
      toast({
        title: "Success",
        description: "Your event has been created successfully!",
      });
      
      // Enable all steps for review or editing
      enableAllSteps();
      
      // Could redirect to event details page here
      // navigate(`/events/${eventId}`);
    }, 1500);
  };
  
  // Handle scroll to detect when to show the scroll-to-top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'basicDetails':
        return (
          <BasicDetailsStep 
            initialValues={basicDetails} 
            onSubmit={handleBasicDetailsSubmit} 
          />
        );
      case 'venues':
        return (
          <VenueStep 
            venues={venues} 
            onSubmit={handleVenuesSubmit}
            onBack={() => handleStepClick('basicDetails')}
          />
        );
      case 'dates':
        return (
          <DateStep 
            dates={dates} 
            venues={venues}
            onSubmit={handleDatesSubmit}
            onBack={() => handleStepClick('venues')}
          />
        );
      case 'times':
        return (
          <TimeSlotStep 
            timeSlots={timeSlots} 
            dates={dates}
            venues={venues}
            onSubmit={handleTimeSlotSubmit}
            onBack={() => handleStepClick('dates')}
          />
        );
      case 'tickets':
        return (
          <TicketStep 
            tickets={tickets} 
            dates={dates}
            timeSlots={timeSlots}
            venues={venues}
            onSubmit={handleTicketSubmit}
            onBack={() => handleStepClick('times')}
          />
        );
      case 'media':
        return (
          <MediaStep 
            media={media} 
            onSubmit={handleMediaSubmit}
            onBack={() => handleStepClick('tickets')}
          />
        );
      case 'additionalInfo':
        return (
          <AdditionalInfoStep 
            additionalInfo={additionalInfo} 
            onSubmit={handleAdditionalInfoSubmit}
            onBack={() => handleStepClick('media')}
          />
        );
      case 'review':
        return (
          <ReviewStep 
            eventData={{
              basicDetails,
              venues,
              dates,
              timeSlots,
              tickets,
              media,
              additionalInfo
            }} 
            onSubmit={handleFinalSubmit}
            onBack={() => handleStepClick('additionalInfo')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Step Sidebar (Hidden on mobile) */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <CreateEventSidebar
              currentStep={currentStep}
              stepStatuses={stepStatuses}
              onStepClick={handleStepClick}
            />
          </div>
        </div>
        
        {/* Step Content */}
        <div className="flex-1">
          {renderStepContent()}
        </div>
      </div>
      
      {/* Scroll to top button */}
      <Button
        variant="outline"
        size="icon"
        className={`fixed bottom-6 right-6 rounded-full shadow-lg transition-opacity duration-300 bg-primary text-white hover:bg-primary/90 ${
          showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={scrollToTop}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CreateEvent;
