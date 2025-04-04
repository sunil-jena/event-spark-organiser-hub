
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar, Edit, Trash } from 'lucide-react';
import React from 'react';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  ticketsSold: number;
  totalTickets: number;
  imageUrl?: string;
}

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  className?: string;
  currency?: string;
}

export function EventCard({
  event,
  onEdit,
  onDelete,
  className,
  currency = "₹",
}: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const soldPercentage = (event.ticketsSold / event.totalTickets) * 100;

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 animate-fade-in",
      className
    )}>
      <div className="relative h-40 bg-gray-200 dark:bg-gray-700">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <Calendar className="h-12 w-12 text-primary" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {event.location}
        </p>
        
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Tickets sold</span>
            <span className="font-medium">
              {event.ticketsSold}/{event.totalTickets}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-light h-2 rounded-full"
              style={{ width: `${soldPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex mt-4 space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit?.(event)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete?.(event)}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
