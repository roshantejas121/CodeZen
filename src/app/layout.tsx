import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AIMentor } from "@/components/AIMentor";

export const metadata: Metadata = {
  title: "DevGrowth | Learning & Developer Productivity",
  description: "Become a stronger developer and get more work done in less time.",
};

import { Toaster } from 'sonner';
import { CommandPalette } from '@/components/CommandPalette';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0 }}>
        <Toaster position="top-right" richColors />
        <CommandPalette />
        <div className="dashboard-grid">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
        <AIMentor />
      </body>
    </html>
  );
}
