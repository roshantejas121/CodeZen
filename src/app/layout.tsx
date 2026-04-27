import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AIMentor } from "@/components/AIMentor";
import { Toaster } from 'sonner';
import { CommandPalette } from '@/components/CommandPalette';
import { UserProvider } from '@/context/UserContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://codezen-live-rho.vercel.app'),
  title: "CodeZen | Elite Engineering Hub",
  description: "Elite engineering guidance, cognitive friction drills, and developer productivity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0 }}>
        <UserProvider>
          <Toaster position="top-right" richColors />
          <CommandPalette />
          <div className="dashboard-grid">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
          <AIMentor />
        </UserProvider>
      </body>
    </html>
  );
}
