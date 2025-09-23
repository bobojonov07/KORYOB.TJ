import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import { JobProvider } from '@/lib/job-context';
import { AuthProvider } from '@/lib/auth-context';
import { MessageProvider } from '@/lib/message-context';
import FooterNav from '@/components/layout/footer-nav';

export const metadata: Metadata = {
  title: 'KORYOB TJ',
  description: 'Платформаи муосири ҷустуҷӯи кор дар Тоҷикистон.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tg" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <JobProvider>
            <MessageProvider>
              <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <main className="flex-grow pb-24 md:pb-0">{children}</main>
                <FooterNav />
              </div>
              <Toaster />
            </MessageProvider>
          </JobProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
