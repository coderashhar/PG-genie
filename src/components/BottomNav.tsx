"use client";
import Link from "next/link";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function BottomNav() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleAuthRequiredClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!session) {
      e.preventDefault();
      toast.error("Please sign in or login to continue");
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  };

  const isOwner = (session?.user as any)?.role === "owner";

  if (pathname === "/login") return null;

  if (isOwner) {
    return (
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface-container dark:bg-surface-container-low shadow-[0px_-4px_20px_rgba(76,29,149,0.05)] rounded-t-xl md:hidden">
        <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim cursor-pointer" href="/">
          <span className="material-symbols-outlined mb-1">home</span>
          <span className="font-label-sm text-label-sm mt-1">Home</span>
        </Link>
        <Link className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container dark:bg-primary-fixed-dim dark:text-on-primary-fixed rounded-full px-5 py-1 scale-90 transition-all duration-200" href="/dashboard">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-sm text-label-sm mt-1">Dashboard</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim cursor-pointer" href="/dashboard?tab=profile" onClick={(e) => handleAuthRequiredClick(e, "/dashboard?tab=profile")}>
          <span className="material-symbols-outlined mb-1">person</span>
          <span className="font-label-sm text-label-sm mt-1">Profile</span>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface-container dark:bg-surface-container-low shadow-[0px_-4px_20px_rgba(76,29,149,0.05)] rounded-t-xl md:hidden">
      <Link className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container dark:bg-primary-fixed-dim dark:text-on-primary-fixed rounded-full px-5 py-1 scale-90 transition-all duration-200" href="/pgs">
        <span className="material-symbols-outlined">search</span>
        <span className="font-label-sm text-label-sm mt-1">Search</span>
      </Link>
      <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim cursor-pointer" href="/dashboard" onClick={(e) => handleAuthRequiredClick(e, "/dashboard")}>
        <span className="material-symbols-outlined mb-1">favorite</span>
        <span className="font-label-sm text-label-sm mt-1">Saved</span>
      </Link>
      <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim cursor-pointer" href="/dashboard" onClick={(e) => handleAuthRequiredClick(e, "/dashboard")}>
        <span className="material-symbols-outlined mb-1">receipt_long</span>
        <span className="font-label-sm text-label-sm mt-1">Bookings</span>
      </Link>
      <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim cursor-pointer" href="/dashboard?tab=profile" onClick={(e) => handleAuthRequiredClick(e, "/dashboard?tab=profile")}>
        <span className="material-symbols-outlined mb-1">person</span>
        <span className="font-label-sm text-label-sm mt-1">Profile</span>
      </Link>
    </nav>
  );
}
