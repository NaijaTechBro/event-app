import EventForm from '@/components/EventForm';

export const metadata = {
  title: 'Create New Event | Event Platform',
  description: 'Create a new event on our platform'
};

export default function CreateEventPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
      <EventForm />
    </div>
  );
}