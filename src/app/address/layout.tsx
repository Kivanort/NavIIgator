import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Адрес и часы работы',
  description: 'Как добраться до Яндекс Музея: адрес, часы работы и проезд.',
};

export default function AddressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
