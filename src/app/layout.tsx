import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AppProvider } from '@/context/AppContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'NavIIgator — AI-гид по Яндекс Музею',
    template: '%s | NavIIgator',
  },
  description: 'Интерактивный AI-гид по Яндекс Музею. Персонализированные маршруты, квизы и награды. Выучи историю технологий с ИИ-проводником.',
  keywords: ['музей', 'AI гид', 'Яндекс Музей', 'технологии', 'интерактивный тур', 'NavIIgator'],
  authors: [{ name: 'NavIIgator' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'NavIIgator',
    title: 'NavIIgator — AI-гид по Яндекс Музею',
    description: 'Интерактивный AI-гид по Яндекс Музею. Персонализированные маршруты, квизы и награды.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NavIIgator — AI-гид по Яндекс Музею',
    description: 'Интерактивный AI-гид по Яндекс Музею. Персонализированные маршруты, квизы и награды.',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NavIIgator',
  description: 'Интерактивный AI-гид по Яндекс Музею',
  url: 'https://naviigator.ru',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <AppProvider>
              <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg transition-colors duration-300">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </AppProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
