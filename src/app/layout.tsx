import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Caveat } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ChatWidgetWrapper from "@/components/ChatWidgetWrapper";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "PG Genie - Find your perfect PG near VIT Bhopal",
  description: "The smartest way for students to discover, compare, and book verified accommodations. Your digital concierge to student living.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${playfairDisplay.variable} ${caveat.variable} font-sans`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;icon_names=ac_unit,account_circle,add_home,add_photo_alternate,admin_panel_settings,apartment,arrow_back,arrow_forward,assignment,auto_awesome,badge,bathtub,battery_charging_full,bolt,business,calendar_month,call,cancel,chair,chat,check,check_circle,chevron_left,chevron_right,close,cloud_upload,dashboard,delete,delete_forever,directions,downloading,edit,error,event_available,event_busy,exit_to_app,expand_more,favorite,favorite_border,fitness_center,forum,gpp_maybe,group,heat_pump,home,inbox,info,local_laundry_service,local_offer,local_parking,location_off,location_on,lock,logout,magic_button,mail,map,mark_email_unread,menu_book,my_location,notifications,notifications_off,open_in_new,password,pending_actions,person,pets,photo_library,progress_activity,receipt_long,restaurant,school,search,search_off,send,star,star_half,store,support_agent,swap_vert,trending_flat,trending_up,tune,verified,videocam,visibility,visibility_off,water_drop,wifi&amp;display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface-container-lowest text-on-background font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col relative">
        <SessionProvider>
          <Toaster position="top-center" containerStyle={{ zIndex: 999999 }} />
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <PageTransition>
            {children}
          </PageTransition>
          <Suspense fallback={null}>
            <BottomNav />
          </Suspense>
          <Suspense fallback={null}>
            <ChatWidgetWrapper />
          </Suspense>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </SessionProvider>
      </body>
    </html>
  );
}
