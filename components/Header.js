'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Event Platform
        </Link>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                href="/" 
                className={`hover:text-blue-600 ${pathname === '/' ? 'text-blue-600 font-medium' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/events/create" 
                className={`hover:text-blue-600 ${pathname === '/events/create' ? 'text-blue-600 font-medium' : ''}`}
              >
                Create Event
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}