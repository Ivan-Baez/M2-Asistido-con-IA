import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/app/components/ToastContainer';
import MainLayout from '@/app/components/MainLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cine M2 | Catálogo de Películas',
  description: 'Explora, descubre y gestiona tu colección de películas. Proyecto M2 - Next.js + Express + MongoDB',
  openGraph: {
    title: 'Cine M2',
    description: 'Tu catálogo personal de películas',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ToastProvider>
          <MainLayout>{children}</MainLayout>
        </ToastProvider>
      </body>
    </html>
  );
}