
import React from 'react';
import {
  CheckCircle,
  CircleAlert,
  Clock,
  FileImage,
  Info,
  MapPin,
  Settings,
  Ticket,
  User
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
    icon: <Settings className="h-5 w-5" />
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
  onStepClick 
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
    <div className="bg-white rounded-lg border border-gray-200 p-4 w-64 shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Create Event</h2>
      <div className="space-y-1">
        {steps.map((step) => {
          const status = stepStatuses[step];
          
          return (
            <button
              key={step}
              onClick={() => status.isClickable && onStepClick(step)}
              disabled={!status.isClickable}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                status.isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-70",
                status.status === 'current' && "bg-primary text-white",
                status.status === 'complete' && "bg-green-50 text-green-700",
                status.status === 'error' && "bg-red-50 text-red-700",
                status.status === 'incomplete' && status.isClickable && "hover:bg-gray-100 text-gray-700",
                status.status === 'incomplete' && !status.isClickable && "text-gray-400"
              )}
            >
              <div className="flex-shrink-0">
                {getStepIcon(step, status.status)}
              </div>
              <span className="truncate">{stepConfig[step].label}</span>
              
              {status.status === 'complete' && (
                <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
