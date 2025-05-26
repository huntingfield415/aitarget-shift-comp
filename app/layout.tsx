// app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css'; // ← この行は削除してもOK（中身にTailwindが含まれているなら削除推奨）

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shift Project',
  description: '保育園向けシフト管理SaaS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head />
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
