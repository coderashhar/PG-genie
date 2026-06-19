"use client";
import Link from "next/link";
import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function BottomNav() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleAuthRequiredClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!session) {
      e.preventDefault();
      toast.error("Please sign in or login to continue");
      router.push(`/login?callbackUrl=${encodeURIComponent(path)}`);
    }
  };

  const isOwner = (session?.user as any)?.role === "owner";
  if (pathname === "/login" || pathname.startsWith("/admin")) return null;

  // Active state logic
  const isHomeActive = pathname === "/";
  const isSearchActive = pathname.startsWith("/pgs");
  const isProfileActive = pathname === "/dashboard" && searchParams?.get("tab") === "profile";
  const isDashboardActive = pathname === "/dashboard" && !isProfileActive;
  const isSavedActive = pathname === "/dashboard" && !isProfileActive; // For regular users, saved is their default dashboard view

  const ownerNavItems = [
    { id: 'home', label: 'Home', icon: 'home', href: '/', isActive: isHomeActive },
    { id: 'search', label: 'Search', icon: 'search', href: '/pgs', isActive: isSearchActive },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/dashboard', isActive: isDashboardActive },
    { id: 'profile', label: 'Profile', icon: 'person', href: '/dashboard?tab=profile', isActive: isProfileActive, onClick: (e: any) => handleAuthRequiredClick(e, '/dashboard?tab=profile') }
  ];

  const regularNavItems = [
    { id: 'home', label: 'Home', icon: 'home', href: '/', isActive: isHomeActive },
    { id: 'search', label: 'Search', icon: 'search', href: '/pgs', isActive: isSearchActive },
    { id: 'saved', label: 'Saved', icon: 'favorite', href: '/dashboard', isActive: isSavedActive, onClick: (e: any) => handleAuthRequiredClick(e, '/dashboard') },
    { id: 'profile', label: 'Profile', icon: 'person', href: '/dashboard?tab=profile', isActive: isProfileActive, onClick: (e: any) => handleAuthRequiredClick(e, '/dashboard?tab=profile') }
  ];

  const items = isOwner ? ownerNavItems : regularNavItems;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-surface-container dark:bg-surface-container-low shadow-[0px_-4px_20px_rgba(76,29,149,0.05)] border-t border-outline-variant/20 md:hidden">
      {items.map(item => (
        <Link
          key={item.id}
          href={item.href}
          onClick={item.onClick}
          className={`flex flex-col items-center justify-center cursor-pointer min-w-[72px] py-1.5 relative transition-colors ${item.isActive ? 'text-on-primary-container dark:text-on-primary-fixed' : 'text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim'}`}
        >
          {item.isActive && (
            <motion.div
              layoutId="bottom-nav-pill"
              className="absolute inset-0 bg-primary-container dark:bg-primary-fixed-dim rounded-full"
              transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.8 }}
            />
          )}
          <span className="material-symbols-outlined mb-1 text-[24px] relative z-10" style={{ fontVariationSettings: item.isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
          <span className={`font-label-sm text-[10px] relative z-10 transition-colors ${item.isActive ? 'font-semibold' : ''}`}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
