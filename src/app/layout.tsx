import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/lib/frappe/auth'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduSponsor - Transforming Education in Sri Lanka",
  description: "Connect passionate donors with deserving students through our innovative point-based sponsorship platform. Your $50 monthly donation becomes 50,000 points for educational resources, health insurance, and future investments.",
  keywords: ["EduSponsor", "education sponsorship", "Sri Lanka education", "student support", "donor platform", "educational funding", "scholarships", "point-based system"],
  authors: [{ name: "EduSponsor Team" }],
  openGraph: {
    title: "EduSponsor - Transforming Education in Sri Lanka",
    description: "Innovative platform connecting donors with students through transparent point-based sponsorship system",
    url: "https://edusponsor.com",
    siteName: "EduSponsor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduSponsor - Transforming Education in Sri Lanka",
    description: "Innovative platform connecting donors with students through transparent point-based sponsorship system",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
