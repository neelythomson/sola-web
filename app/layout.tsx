import type { Metadata } from 'next';
import '@fontsource/eb-garamond/400.css';
import '@fontsource/eb-garamond/500.css';
import '@fontsource/eb-garamond/600.css';
import '@fontsource/eb-garamond/400-italic.css';
import '@fontsource/eb-garamond/500-italic.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'SOLA — A softer place to land',
  description:
    'A therapeutic toolkit for neurodivergent brains. Designed by Leah Hunter, MA. A Generational Healing Co project.',
  themeColor: '#0A0A0F',
  viewport: { width: 'device-width', initialScale: 1, maximumScale: 1, userScalable: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
