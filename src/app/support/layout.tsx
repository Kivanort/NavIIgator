import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Поддержка',
  description: 'Поддержите проект NavIIgator — AI-гид по Яндекс Музею.',
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
