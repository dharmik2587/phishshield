import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PhishShield – AI Phishing Detector',
  description: 'Real-time phishing domain detection for crypto wallets using Claude Haiku 4.5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
