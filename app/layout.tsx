import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sawariya Event | Event Management & Hotel Booking',
  description: 'Discover premium stays and plan memorable events with Sawariya Event.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
