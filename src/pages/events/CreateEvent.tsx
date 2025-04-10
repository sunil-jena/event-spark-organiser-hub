
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import { EventCreationStep, StepStatus } from '@/components/events/CreateEventSidebar';

// Import the step components
import { BasicDetailsStep } from '@/components/events/steps/BasicDetailsStep';
import { VenueStep } from '@/components/events/steps/VenueStep';
import { DateStep } from '@/components/events/steps/DateStep';
import { TimeSlotStep } from '@/components/events/steps/TimeSlotStep';
import { TicketStep } from '@/components/events/steps/TicketStep';
import { MediaStep } from '@/components/events/steps/MediaStep';
import { AdditionalInfoStep } from '@/components/events/steps/AdditionalInfoStep';
import { ReviewStep } from '@/components/events/steps/ReviewStep';

const CreateEvent = () => {
  const { 
    scrollToTop, 
    setActiveRoute, 
    eventStepStatuses, 
    setEventStepStatuses,
    setIsEditingEvent
  } = useAppContext();
  
  const {
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
    artists,
    setArtists,
    currentStep: eventContextCurrentStep,
    setCurrentStep: setEventContextCurrentStep,
  } = useEventContext();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Show scroll top button state
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Current step tracking (synced with EventContext)
  const [currentStep, setCurrentStep] = useState<EventCreationStep>(eventContextCurrentStep);
  
  // Update EventContext currentStep when local state changes
  useEffect(() => {
    setEventContextCurrentStep(currentStep);
  }, [currentStep, setEventContextCurrentStep]);
  
  // Set active route and extract hash for step navigation
  useEffect(() => {
    // Only set active route to /events/create, not any deeper
    setActiveRoute('/events/create');
    
    // Get the current step from URL hash if available
    const hash = location.hash.substring(1) as EventCreationStep;
    if (hash && Object.keys(eventStepStatuses).includes(hash)) {
      if (eventStepStatuses[hash].isClickable) {
        setCurrentStep(hash);
      }
    }
  }, [location.hash, setActiveRoute, eventStepStatuses]);
  
  // Handle scroll to detect when to show the scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle step change
  const handleStepClick = (step: EventCreationStep) => {
    if (eventStepStatuses[step].isClickable) {
      setCurrentStep(step);
      
      // Update URL hash without page reload
      window.history.pushState(null, '', `#${step}`);
      
      // Update step statuses
      setEventStepStatuses((prevStatuses) => {
        const newStatuses = { ...prevStatuses };
        
        Object.keys(newStatuses).forEach(key => {
          const stepKey = key as EventCreationStep;
          if (stepKey === step) {
            newStatuses[stepKey].status = 'current';
          } else if (newStatuses[stepKey].status === 'current') {
            newStatuses[stepKey].status = 'complete';
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
    // Update step statuses
    setEventStepStatuses((prevStatuses) => {
      const newStatuses = { ...prevStatuses };
      newStatuses[currentStep] = { ...prevStatuses[currentStep], status: 'complete' };
      newStatuses[nextStep] = { ...prevStatuses[nextStep], status: 'current', isClickable: true };
      return newStatuses;
    });
    
    // Update URL hash
    window.history.pushState(null, '', `#${nextStep}`);
    
    setCurrentStep(nextStep);
    scrollToTop();
  };
  
  // Enable all steps for reviewing or editing after event creation
  const enableAllSteps = () => {
    // Update step statuses
    setEventStepStatuses((prevStatuses) => {
      const newStatuses = { ...prevStatuses };
      
      Object.keys(newStatuses).forEach(key => {
        const stepKey = key as EventCreationStep;
        newStatuses[stepKey].isClickable = true;
        if (newStatuses[stepKey].status === 'incomplete') {
          newStatuses[stepKey].status = 'complete';
        }
      });
      
      return newStatuses;
    });
    
    // Set editing mode to true so all steps are accessible
    setIsEditingEvent(true);
  };
  
  // Handle form submissions for each step
  const handleBasicDetailsSubmit = (values: any) => {
    setBasicDetails(values);
    completeStep('venues');
  };
  
  const handleVenuesSubmit = (values: any) => {
    setVenues(values);
    completeStep('dates');
  };
  
  const handleDatesSubmit = (values: any) => {
    // Make sure the type property is set correctly for compatibility
    const updatedValues = values.map((date: any) => ({
      ...date,
      type: date.dateType === 'multiple' ? 'single' : date.dateType
    }));
    
    setDates(updatedValues);
    completeStep('times');
  };
  
  const handleTimeSlotSubmit = (values: any) => {
    setTimeSlots(values);
    completeStep('tickets');
  };
  
  const handleTicketSubmit = (values: any) => {
    // Add the required properties to match the TicketStep component's expectations
    const updatedValues = values.map((ticket: any) => ({
      ...ticket,
      ticketType: ticket.ticketType || 'standard',
      isAllDates: ticket.isAllDates || false,
      availableDateIds: ticket.availableDateIds || [],
      isAllTimeSlots: ticket.isAllTimeSlots || false,
      availableTimeSlotIds: ticket.availableTimeSlotIds || [],
      isLimited: ticket.isLimited || false
    }));
    
    setTickets(updatedValues);
    completeStep('media');
  };
  
  const handleMediaSubmit = (values: any) => {
    setMedia(values);
    completeStep('additionalInfo');
  };
  
  const handleAdditionalInfoSubmit = (values: any) => {
    // Ensure faq is a string if needed
    const updatedValues = {
      ...values,
      faq: typeof values.faq === 'object' ? JSON.stringify(values.faq) : values.faq
    };
    
    setAdditionalInfo(updatedValues);
    completeStep('review');
  };
  
  const handleFinalSubmit = () => {
    // Prepare event data for submission
    const eventData = {
      basicDetails,
      venues,
      dates: dates.map(d => ({
        ...d,
        type: d.dateType === 'multiple' ? 'single' : d.dateType
      })),
      timeSlots,
      tickets: tickets.map(t => ({
        ...t,
        ticketType: t.ticketType || 'standard',
        isAllDates: t.isAllDates || false,
        availableDateIds: t.availableDateIds || [],
        isAllTimeSlots: t.isAllTimeSlots || false,
        availableTimeSlotIds: t.availableTimeSlotIds || [],
        isLimited: t.isLimited || false
      })),
      media,
      additionalInfo: {
        ...additionalInfo,
        faq: typeof additionalInfo.faq === 'object' ? JSON.stringify(additionalInfo.faq) : additionalInfo.faq
      },
      artists
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
            dates={dates.map(d => ({ 
              ...d, 
              type: d.dateType === 'multiple' ? 'single' : d.dateType
            }))} 
            venues={venues}
            onSubmit={handleDatesSubmit}
            onBack={() => handleStepClick('venues')}
          />
        );
      case 'times':
        return (
          <TimeSlotStep 
            timeSlots={timeSlots} 
            dates={dates.map(d => ({ 
              ...d, 
              type: d.dateType === 'multiple' ? 'single' : d.dateType
            }))}
            venues={venues}
            artists={artists}
            onSubmit={handleTimeSlotSubmit}
            onBack={() => handleStepClick('dates')}
          />
        );
      case 'tickets':
        return (
          <TicketStep 
            tickets={tickets.map(t => ({
              ...t,
              ticketType: t.ticketType || 'standard',
              isAllDates: t.isAllDates || false,
              availableDateIds: t.availableDateIds || [],
              isAllTimeSlots: t.isAllTimeSlots || false,
              availableTimeSlotIds: t.availableTimeSlotIds || [],
              isLimited: t.isLimited || false
            }))}
            dates={dates.map(d => ({ 
              ...d, 
              type: d.dateType === 'multiple' ? 'single' : d.dateType
            }))}
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
              dates: dates.map(d => ({ 
                ...d, 
                type: d.dateType === 'multiple' ? 'single' : d.dateType 
              })),
              timeSlots,
              tickets: tickets.map(t => ({
                ...t,
                ticketType: t.ticketType || 'standard',
                isAllDates: t.isAllDates || false,
                availableDateIds: t.availableDateIds || [],
                isAllTimeSlots: t.isAllTimeSlots || false,
                availableTimeSlotIds: t.availableTimeSlotIds || [],
                isLimited: t.isLimited || false
              })),
              media,
              additionalInfo: {
                ...additionalInfo,
                faq: typeof additionalInfo.faq === 'object' ? JSON.stringify(additionalInfo.faq) : additionalInfo.faq
              },
              artists
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
      
      <div className="flex flex-col gap-6">
        {/* Step Content */}
        <div className="flex-1">
          {renderStepContent()}
        </div>
      </div>
      
      {/* Scroll to top button */}
      <Button
        variant="outline"
        size="icon"
        className={`fixed bottom-6 right-6 rounded-full shadow-lg transition-opacity duration-300 bg-primary text-white hover:bg-primary/90 z-10 ${
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
