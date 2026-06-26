import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from '@/components/ui/sonner';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Chez l'Impératrice | Premium Bar Management",
  description: 'Luxury bar and restaurant management system for premium hospitality',
  openGraph: {
    title: "Chez l'Impératrice | Premium Bar Management",
    description: 'Luxury bar and restaurant management system for premium hospitality',
    images: [{ url: 'https://images.unsplash.com/photo-1470337455729-039a2a9c6448?w=1200' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: 'https://images.unsplash.com/photo-1470337455729-039a2a9c6448?w=1200' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
