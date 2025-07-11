import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  ArrowUp,
  CalendarIcon,
  FileText,
  ImagePlus,
  MapPin,
  Ticket,
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import {
  EventCreationStep,
  EventData,
  TicketFormValues,
} from '@/components/events/steps/types';

// Import the step components
import { VenueStep } from '@/components/events/steps/VenueStep';
import { DateStep } from '@/components/events/steps/DateStep';
import { TimeSlotStep } from '@/components/events/steps/TimeSlotStep';
import { TicketStep } from '@/components/events/steps/TicketStep';
import { MediaStep } from '@/components/events/steps/MediaStep';
import { AdditionalInfoStep } from '@/components/events/steps/AdditionalInfoStep';
import { ReviewStep } from '@/components/events/steps/ReviewStep';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BasicDetailsStep } from '@/components/events/steps/BasicDetailsStep';
import { TicketAssignmentStep } from '@/components/events/steps/TicketAssignmentStep';
// import TicketTypes from '../tickets/TicketTypes';

const CreateEvent = () => {
  const {
    setActiveRoute,
    eventStepStatuses,
    setEventStepStatuses,
    setIsEditingEvent,
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
    assignments,
    setAssignments,
    currentStep: eventContextCurrentStep,
    setCurrentStep: setEventContextCurrentStep,
  } = useEventContext();

  // const navigate = useNavigate();
  const location = useLocation();
  const navigate = useNavigate();
  // Show scroll top button state
  // const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Current step tracking (synced with EventContext)
  const [currentStep, setCurrentStep] = useState<EventCreationStep>(
    eventContextCurrentStep
  );

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
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setShowScrollTop(window.scrollY > 300);
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  // Handle step change
  const handleStepClick = (step: EventCreationStep) => {
    if (eventStepStatuses[step].isClickable) {
      setCurrentStep(step);

      // Update URL hash without page reload
      // window.history.pushState(null, '', `#${step}`);

      // Update step statuses
      const updateStatuses = { ...eventStepStatuses };

      Object.keys(updateStatuses).forEach((key) => {
        const stepKey = key as EventCreationStep;
        if (stepKey === step) {
          updateStatuses[stepKey].status = 'current';
        } else if (updateStatuses[stepKey].status === 'current') {
          updateStatuses[stepKey].status = 'complete';
        }
      });

      navigate(`/events/create#${step}`);
      setEventStepStatuses(updateStatuses);
    }
  };

  // Mark current step as complete and move to next step
  const completeStep = (nextStep: EventCreationStep) => {
    // Update step statuses
    const updateStatuses = { ...eventStepStatuses };
    updateStatuses[currentStep] = {
      ...eventStepStatuses[currentStep],
      status: 'complete',
    };
    updateStatuses[nextStep] = {
      ...eventStepStatuses[nextStep],
      status: 'current',
      isClickable: true,
    };

    setEventStepStatuses(updateStatuses);

    // Update URL hash
    // window.history.pushState(null, '', `/events/create#${nextStep}`);
    navigate(`/events/create#${nextStep}`);
    setCurrentStep(nextStep);
  };

  // Enable all steps for reviewing or editing after event creation
  const enableAllSteps = () => {
    // Update step statuses
    const updateStatuses = { ...eventStepStatuses };

    Object.keys(updateStatuses).forEach((key) => {
      const stepKey = key as EventCreationStep;
      updateStatuses[stepKey].isClickable = true;
      if (updateStatuses[stepKey].status === 'incomplete') {
        updateStatuses[stepKey].status = 'complete';
      }
    });

    setEventStepStatuses(updateStatuses);

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
      type: date.dateType === 'multiple' ? 'single' : date.dateType,
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
    const updatedValues = values.map((t: any) => ({
      ...t,
      ticketType: t.ticketType || 'standard',
      isAllDates: t.isAllDates || false,
      availableDateIds: t.availableDateIds || [],
      isAllTimeSlots: t.isAllTimeSlots || false,
      availableTimeSlotIds: t.availableTimeSlotIds || [],
      isLimited: t.isLimited || false,
    }));

    setTickets(updatedValues);
    completeStep('assigntickets');
  };

  const handleTicketAssignSubmit = (values: any) => {
    // Add the required properties to match the TicketStep component's expectations
    const updatedValues = values.map((t: any) => ({
      ...t,
      ticketType: t.ticketType || 'standard',
      isAllDates: t.isAllDates || false,
      availableDateIds: t.availableDateIds || [],
      isAllTimeSlots: t.isAllTimeSlots || false,
      availableTimeSlotIds: t.availableTimeSlotIds || [],
      isLimited: t.isLimited || false,
    }));

    setAssignments(updatedValues);
    completeStep('media');
  };

  const handleMediaSubmit = (values: any) => {
    setMedia(values);
    completeStep('additionalInfo');
  };

  const handleAdditionalInfoSubmit = (values: any) => {
    // Ensure faqItems is a string if needed
    const updatedValues = {
      ...values,
      faqItems: values.faqItems,
    };

    setAdditionalInfo(updatedValues);
    completeStep('review');
  };

  const handleFinalSubmit = () => {
    // Prepare event data for submission
    const eventData: EventData = {
      basicDetails,
      venues,
      dates: dates.map((d) => ({
        ...d,
        type: d.dateType === 'multiple' ? 'single' : d.dateType,
      })),
      timeSlots,
      assigntickets: assignments,
      tickets: tickets.map((t) => ({
        ...t,
        ticketType: t.ticketType || 'standard',
        isAllDates: t.isAllDates || false,
        availableDateIds: t.availableDateIds || [],
        isAllTimeSlots: t.isAllTimeSlots || false,
        availableTimeSlotIds: t.availableTimeSlotIds || [],
        isLimited: t.isLimited || false,
      })) as TicketFormValues[],
      media,
      additionalInfo: {
        ...additionalInfo,
        faqItems: additionalInfo.faqItems,
      },
      artists,
    };

    // Simulate API call
    setTimeout(() => {
      console.log('Event data submitted:', eventData);

      toast({
        title: 'Success',
        description: 'Your event has been created successfully!',
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
            dates={dates.map((d) => ({
              ...d,
              type: d.dateType === 'multiple' ? 'single' : d.dateType,
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
            dates={dates.map((d) => ({
              ...d,
              dateType: d.dateType === 'multiple' ? 'single' : d.dateType,
            }))}
            venues={venues}
            // artists={artists}
            onSubmit={handleTimeSlotSubmit}
            onBack={() => handleStepClick('dates')}
          />
        );
      case 'tickets':
        return (
          <TicketStep
            // tickets={tickets}
            ticketTypes={tickets}
            setTicketTypes={setTickets}
            dates={dates}
            timeSlots={timeSlots}
            venues={venues}
            onSubmit={handleTicketSubmit}
            onBack={() => handleStepClick('times')}
          />
        );
      case 'assigntickets':
        return (
          <TicketAssignmentStep
            // tickets={tickets}
            tickets={tickets}
            dates={dates}
            timeSlots={timeSlots}
            venues={venues}
            assignments={assignments}
            setAssignments={setAssignments}
            onSubmit={handleTicketAssignSubmit}
            onBack={() => handleStepClick('tickets')}
          />
        );
      case 'media':
        return (
          <MediaStep
            initialValues={media}
            onSubmit={handleMediaSubmit}
            onBack={() => handleStepClick('assigntickets')}
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
              dates: dates.map((d) => ({
                ...d,
                type: d.dateType === 'multiple' ? 'single' : d.dateType,
              })),
              timeSlots,
              assigntickets: assignments,
              tickets: tickets.map((t) => ({
                ...t,
                ticketType: t.ticketType || 'standard',
                isAllDates: t.isAllDates || false,
                availableDateIds: t.availableDateIds || [],
                isAllTimeSlots: t.isAllTimeSlots || false,
                availableTimeSlotIds: t.availableTimeSlotIds || [],
                isLimited: t.isLimited || false,
              })) as TicketFormValues[],
              media,
              additionalInfo: {
                ...additionalInfo,
                faqItems: additionalInfo.faqItems,
              },
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
    <div className='max-w-7xl mx-auto pb-20 px-4 sm:px-6'>
      <h1 className='text-3xl font-bold mb-6'>Create Event</h1>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='lg:col-span-3'>{renderStepContent()}</div>
        {/* Step Content */}

        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-start gap-2'>
                <div className='bg-primary/10 p-2 rounded-full'>
                  <CalendarIcon className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <h4 className='text-sm font-medium'>Choose multiple dates</h4>
                  <p className='text-sm text-muted-foreground'>
                    Add multiple sessions for multi-day events.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-2'>
                <div className='bg-primary/10 p-2 rounded-full'>
                  <MapPin className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <h4 className='text-sm font-medium'>
                    Google Maps integration
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Find venues easily with location search.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-2'>
                <div className='bg-primary/10 p-2 rounded-full'>
                  <Ticket className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <h4 className='text-sm font-medium'>Multiple ticket types</h4>
                  <p className='text-sm text-muted-foreground'>
                    Create different pricing tiers for your event.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-2'>
                <div className='bg-primary/10 p-2 rounded-full'>
                  <ImagePlus className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <h4 className='text-sm font-medium'>
                    Upload multiple images
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Add banner, card, and gallery images.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-2'>
                <div className='bg-primary/10 p-2 rounded-full'>
                  <AlertCircle className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <h4 className='text-sm font-medium'>Prohibited Items</h4>
                  <p className='text-sm text-muted-foreground'>
                    Clearly list what attendees cannot bring.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-2'>
                <div className='bg-primary/10 p-2 rounded-full'>
                  <FileText className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <h4 className='text-sm font-medium'>Add FAQ section</h4>
                  <p className='text-sm text-muted-foreground'>
                    Answer common questions in advance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <p className='text-sm text-muted-foreground'>
                If you're having trouble creating your event, check out our
                resources:
              </p>
              <ul className='text-sm space-y-1'>
                <li className='text-primary hover:underline cursor-pointer'>
                  Event creation guide
                </li>
                <li className='text-primary hover:underline cursor-pointer'>
                  Best practices for event promotion
                </li>
                <li className='text-primary hover:underline cursor-pointer'>
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
