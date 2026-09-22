import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kaksha.ai — AI-Powered Academic ERP & Teaching Platform',
  description:
    'Research any topic. Build the entire lesson. Teach with AI assistance. Give students a personalized learning environment with grounded AI tutoring and assessments.',
  keywords: ['Academic ERP', 'AI Lesson Planner', 'Gemini API', 'Google Search Grounding', 'Google Workspace'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fbf9f5] text-[#181c24] selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
