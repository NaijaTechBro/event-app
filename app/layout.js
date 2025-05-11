import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import { FavoritesProvider } from '@/context/FavoritesContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Event Platform Lite',
  description: 'A platform for discovering and creating events',
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