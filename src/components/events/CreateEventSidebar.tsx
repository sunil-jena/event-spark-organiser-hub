
import React from 'react';
import {
  CheckCircle,
  CircleAlert,
  Calendar,
  FileImage,
  Info,
  MapPin,
  Settings,
  Ticket,
  User,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type EventCreationStep = 
  | 'basicDetails'
  | 'venues'
  | 'dates'
  | 'times' 
  | 'tickets'
  | 'media'
  | 'additionalInfo'
  | 'review';

export interface StepStatus {
  status: 'incomplete' | 'current' | 'complete' | 'error';
  isClickable: boolean;
}

interface CreateEventSidebarProps {
  currentStep: EventCreationStep;
  stepStatuses: Record<EventCreationStep, StepStatus>;
  onStepClick: (step: EventCreationStep) => void;
  minimized?: boolean;
}

export const stepConfig: Record<EventCreationStep, { label: string; icon: React.ReactNode }> = {
  basicDetails: {
    label: 'Basic Details',
    icon: <User className="h-5 w-5" />
  },
  venues: {
    label: 'Venues',
    icon: <MapPin className="h-5 w-5" />
  },
  dates: {
    label: 'Dates',
    icon: <Calendar className="h-5 w-5" />
  },
  times: {
    label: 'Time Slots',
    icon: <Clock className="h-5 w-5" />
  },
  tickets: {
    label: 'Tickets',
    icon: <Ticket className="h-5 w-5" />
  },
  media: {
    label: 'Media',
    icon: <FileImage className="h-5 w-5" />
  },
  additionalInfo: {
    label: 'Additional Info',
    icon: <Info className="h-5 w-5" />
  },
  review: {
    label: 'Review',
    icon: <CheckCircle className="h-5 w-5" />
  }
};

export const CreateEventSidebar: React.FC<CreateEventSidebarProps> = ({ 
  currentStep, 
  stepStatuses, 
  onStepClick,
  minimized = false
}) => {
  const steps: EventCreationStep[] = [
    'basicDetails',
    'venues',
    'dates',
    'times',
    'tickets',
    'media',
    'additionalInfo',
    'review'
  ];

  const getStepIcon = (step: EventCreationStep, status: StepStatus['status']) => {
    if (status === 'error') {
      return <CircleAlert className="h-5 w-5 text-red-500" />;
    }
    return stepConfig[step].icon;
  };

  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 shadow-md transition-all duration-300",
      minimized ? "w-16 p-2" : "w-full md:w-64 p-4"
    )}>
      <h2 className={cn(
        "font-semibold text-gray-800 mb-4",
        minimized ? "text-center text-sm" : "text-lg"
      )}>
        {minimized ? "Steps" : "Create Event"}
      </h2>
      <div className="space-y-1">
        {steps.map((step) => {
          const status = stepStatuses[step];
          
          return (
            <button
              key={step}
              onClick={() => status.isClickable && onStepClick(step)}
              disabled={!status.isClickable}
              className={cn(
                "flex items-center gap-3 rounded-md text-sm transition-colors w-full",
                minimized ? "justify-center py-3 px-2" : "px-3 py-2",
                status.isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-70",
                status.status === 'current' && "bg-primary text-white",
                status.status === 'complete' && "bg-green-50 text-green-700",
                status.status === 'error' && "bg-red-50 text-red-700",
                status.status === 'incomplete' && status.isClickable && "hover:bg-gray-100 text-gray-700",
                status.status === 'incomplete' && !status.isClickable && "text-gray-400"
              )}
              title={minimized ? stepConfig[step].label : undefined}
            >
              <div className="flex-shrink-0">
                {getStepIcon(step, status.status)}
              </div>
              
              {!minimized && (
                <>
                  <span className="truncate">{stepConfig[step].label}</span>
                  
                  {status.status === 'complete' && (
                    <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
