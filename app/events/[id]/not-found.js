import Link from 'next/link';

export default function EventNotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-16">
      <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
      <p className="text-gray-600 mb-8">
        The event you're looking for doesn't exist or has been removed.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
      >
        Browse All Events
      </Link>
    </div>
  );
}