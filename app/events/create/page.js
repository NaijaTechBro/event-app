import EventForm from '@/components/EventForm';

export const metadata = {
  title: 'Create Event | Event Platform Lite',
  description: 'Create a new event on our platform.',
};

export default function CreateEventPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
      <EventForm />
    </div>
  );
}