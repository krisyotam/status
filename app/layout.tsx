import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://status.krisyotam.com'),
  title: 'Service Status · krisyotam.com',
  description: 'Live availability and incident history for krisyotam.com services.',
  icons: { icon: '/favicon.png' },
  openGraph: {
    title: 'Service Status · krisyotam.com',
    description: 'Live availability and incident history for krisyotam.com services.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Service Status · krisyotam.com',
    description: 'Live availability and incident history for krisyotam.com services.',
  },
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfbfa' },
    { media: '(prefers-color-scheme: dark)', color: '#121313' },
  ],
};

const themeScript = `
  try {
    const saved = localStorage.getItem('status-theme');
    const theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch (_) {}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>{children}</body>
    </html>
  );
}
