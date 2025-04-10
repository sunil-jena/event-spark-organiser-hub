
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CircleCheck, CircleDashed, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Define step types
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

interface CreateEventSidebarProps {
  currentStep: EventCreationStep;
  stepStatuses: Record<EventCreationStep, StepStatus>;
  onStepClick: (step: EventCreationStep) => void;
}

export const CreateEventSidebar: React.FC<CreateEventSidebarProps> = ({
  currentStep,
  stepStatuses,
  onStepClick
}) => {
  const isMobile = useIsMobile();

  // Status icon mapping
  const getStepIcon = (status: 'incomplete' | 'current' | 'complete') => {
    switch (status) {
      case 'incomplete':
        return <CircleDashed className="h-5 w-5 text-gray-400" />;
      case 'current':
        return <CircleDot className="h-5 w-5 text-primary" />;
      case 'complete':
        return <CircleCheck className="h-5 w-5 text-green-500" />;
    }
  };

  // Step labels
  const steps: { id: EventCreationStep; title: string }[] = [
    { id: 'basicDetails', title: 'Basic Details' },
    { id: 'venues', title: 'Venues' },
    { id: 'dates', title: 'Dates' },
    { id: 'times', title: 'Times' },
    { id: 'tickets', title: 'Tickets' },
    { id: 'media', title: 'Media' },
    { id: 'additionalInfo', title: 'Additional Info' },
    { id: 'review', title: 'Review' },
  ];

  const sidebarContent = (
    <Card className="h-full">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Create Event</h3>
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="space-y-1">
            {steps.map(step => {
              const status = stepStatuses[step.id].status;
              const isClickable = stepStatuses[step.id].isClickable;
              
              return (
                <button
                  key={step.id}
                  className={cn(
                    "w-full flex items-center p-2 rounded-md text-left",
                    status === 'current' ? "bg-primary/10 text-primary" : "",
                    status === 'complete' ? "text-gray-900" : "text-gray-600",
                    status === 'incomplete' && !isClickable ? "opacity-60" : "",
                    isClickable ? "hover:bg-gray-100 cursor-pointer" : "cursor-not-allowed",
                  )}
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                >
                  <span className="mr-2">
                    {getStepIcon(status)}
                  </span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  // For mobile, use a drawer that can be toggled
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" className="mb-4">
            <Menu className="h-4 w-4 mr-2" />
            Event Steps
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-4 max-h-[80vh]">
            {sidebarContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // For desktop, render the sidebar directly
  return sidebarContent;
};
