import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AIMentor } from "@/components/AIMentor";

export const metadata: Metadata = {
  title: "CodeZen | Elite Engineering Hub",
  description: "Elite engineering guidance, cognitive friction drills, and developer productivity.",
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
      <head>
        <script src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"></script>
      </head>
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
