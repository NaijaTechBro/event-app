'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-gray-400">
          Event Platform Lite
        </Link>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                href="/" 
                className={`hover:text-gray-400 ${pathname === '/' ? 'font-bold' : ''}`}
              >
                Events
              </Link>
            </li>
            <li>
              <Link 
                href="/events/create" 
                className={`hover:text-gray-400 ${pathname === '/events/create' ? 'font-bold' : ''}`}
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