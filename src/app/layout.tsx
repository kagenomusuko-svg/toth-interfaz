import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Toth',
  description: 'Análisis de documentos en el navegador',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
