import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PG Genie | Step Into Home",
  description:
    "Seamless PG accommodations for students near VIT Bhopal. Connecting you directly with verified owners.",
};

import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <body className="font-sans antialiased text-[#181c20] bg-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
