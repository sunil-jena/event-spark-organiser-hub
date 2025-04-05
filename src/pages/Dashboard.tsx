
import React from 'react';
import { StatsCard } from '@/components/ui/stats-card';
import { EventCard, Event } from '@/components/ui/event-card';
import { Button } from '@/components/ui/button';
import { Calendar, ChartBar, Ticket, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for the dashboard
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
  }
];

const Dashboard = () => {
  const { toast } = useToast();
  
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button className="bg-primary hover:bg-primary/90">
          + Create Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Revenue" 
          value="$15,250" 
          icon={<ChartBar className="h-8 w-8" />} 
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard 
          title="Tickets Sold" 
          value="1,520" 
          icon={<Ticket className="h-8 w-8" />} 
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard 
          title="Active Events" 
          value="5" 
          icon={<Calendar className="h-8 w-8" />} 
        />
        <StatsCard 
          title="Total Attendees" 
          value="1,250" 
          icon={<Users className="h-8 w-8" />} 
          trend={{ value: 3.1, isPositive: false }}
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <Button variant="link" className="text-primary">
            View All Events
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
            <Calendar className="h-8 w-8 mb-2" />
            <span>Create Event</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
            <Ticket className="h-8 w-8 mb-2" />
            <span>Manage Tickets</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
            <ChartBar className="h-8 w-8 mb-2" />
            <span>View Analytics</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
            <Users className="h-8 w-8 mb-2" />
            <span>View Attendees</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
