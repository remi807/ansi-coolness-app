import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ansi — offiziell der coolste Boss der Welt',
  description:
    'Die vollkommen objektive Beweisführung, dass Ansi der coolste Boss der Welt ist.',
  applicationName: 'Ansi! Certified Cool',
  appleWebApp: {
    capable: true,
    title: 'Ansi!',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: './icon.svg',
    apple: './icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1646ff',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <head>
        <link rel="manifest" href="manifest.webmanifest" />
      </head>
      <body>{children}</body>
    </html>
  );
}
