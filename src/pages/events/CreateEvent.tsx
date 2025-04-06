
import React from 'react';
import { CreateEventForm } from '@/components/events/CreateEventForm';

const CreateEvent = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>
      <CreateEventForm />
    </div>
  );
};

export default CreateEvent;
