
import React, { useState } from 'react';
import { EventCard, Event } from '@/components/ui/event-card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock events data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'A three-day music festival featuring top artists from around the world.',
    date: '2025-06-15',
    location: 'Central Park, New York',
    ticketsSold: 750,
    totalTickets: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1740'
  },
  {
    id: '2',
    title: 'Tech Conference 2025',
    description: 'Annual conference for tech professionals and enthusiasts.',
    date: '2025-07-22',
    location: 'Convention Center, San Francisco',
    ticketsSold: 350,
    totalTickets: 500
  },
  {
    id: '3',
    title: 'Food & Wine Expo',
    description: 'Explore the finest cuisines and wines from around the globe.',
    date: '2025-05-10',
    location: 'Harbor Plaza, Seattle',
    ticketsSold: 420,
    totalTickets: 600,
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1740'
  },
  {
    id: '4',
    title: 'Business Leadership Summit',
    description: 'Connect with industry leaders and learn about the latest business trends.',
    date: '2025-08-12',
    location: 'Grand Hotel, Chicago',
    ticketsSold: 180,
    totalTickets: 300
  },
  {
    id: '5',
    title: 'Wellness Retreat',
    description: 'A weekend of yoga, meditation, and wellness workshops.',
    date: '2025-09-05',
    location: 'Mountain Spa Resort, Colorado',
    ticketsSold: 65,
    totalTickets: 100,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1740'
  }
];

type EventFilter = 'all' | 'upcoming' | 'past';

const Events = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<EventFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (event: Event) => {
    toast({
      title: "Edit Event",
      description: `You are editing ${event.title}`,
    });
  };

  const handleDelete = (event: Event) => {
    toast({
      title: "Delete Event",
      description: `You requested to delete ${event.title}`,
      variant: "destructive",
    });
  };

  const filteredEvents = mockEvents.filter(event => {
    // Apply search filter
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    const eventDate = new Date(event.date);
    const today = new Date();
    
    if (filter === 'upcoming' && eventDate < today) {
      return false;
    }
    
    if (filter === 'past' && eventDate >= today) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button className="bg-primary hover:bg-primary/90">
          + Create Event
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex space-x-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            className={filter === 'all' ? 'bg-primary hover:bg-primary/90' : ''}
            onClick={() => setFilter('all')}
          >
            All Events
          </Button>
          <Button 
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            className={filter === 'upcoming' ? 'bg-primary hover:bg-primary/90' : ''}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button 
            variant={filter === 'past' ? 'default' : 'outline'}
            className={filter === 'past' ? 'bg-primary hover:bg-primary/90' : ''}
            onClick={() => setFilter('past')}
          >
            Past
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="search"
            placeholder="Search events..."
            className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No events found</h3>
          <p className="text-gray-500">Try changing your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Events;
