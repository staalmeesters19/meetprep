import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeetPrep — AI Meeting Voorbereiding",
  description:
    "Ken je gesprekspartners voordat je binnenloopt. AI-powered meeting voorbereiding in 30 seconden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${geist.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen font-[family-name:var(--font-geist)]">
        {children}
      </body>
    </html>
  );
}
