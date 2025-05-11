import Link from 'next/link';

export default function EventNotFound() {
  return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
      <p className="text-gray-600 mb-6">
        We couldn't find the event you're looking for. It may have been removed or you might have followed an incorrect link.
      </p>
      <Link href="/" className="btn btn-primary">
        Return to Events
      </Link>
    </div>
  );
}