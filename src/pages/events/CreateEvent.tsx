
import React from 'react';
import { CreateEventForm } from '@/components/events/CreateEventForm';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const CreateEvent = () => {
  const { scrollToTop } = useAppContext();
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  // Handle scroll to detect when to show the scroll-to-top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>
      <CreateEventForm />
      
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
