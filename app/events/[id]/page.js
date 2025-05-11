import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Header from '@/components/Header';
import { FavoritesProvider } from '@/context/FavoritesContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Event Platform Lite',
  description: 'A lightweight event platform built with Next.js for interview purpose',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FavoritesProvider>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </FavoritesProvider>
      </body>
    </html>
  );
}