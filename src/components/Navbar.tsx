"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function Navbar({ className, hideHome }: { className?: string, hideHome?: boolean }) {
  const pathname = usePathname() || "";
  const isHome = pathname === "/";

  const getActiveClass = (path: string) => {
    const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);
    return isActive ? "border-b-2 border-current pb-1" : "";
  };

  return (
    <nav className={`w-full z-50 transition-all duration-300 py-6 ${className || "fixed top-0 mix-blend-difference text-white"}`}>
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto">
        <span className="font-display text-[28px] font-semibold tracking-tight cursor-default">
          PG Genie
        </span>
        <div className="flex items-center gap-6">
          {!isHome && (
            <>
              <Link href="/" className={`hover:opacity-70 transition-opacity font-body-md font-medium ${getActiveClass("/")}`}>
                Home
              </Link>
              <Link href="/pgs" className={`hover:opacity-70 transition-opacity font-body-md font-medium hidden md:block ${getActiveClass("/pgs")}`}>
                Search
              </Link>
              <Link href="/dashboard" className={`hover:opacity-70 transition-opacity font-body-md font-medium hidden md:block ${getActiveClass("/dashboard")}`}>
                Saved
              </Link>
            </>
          )}
          <button className="hover:opacity-70 transition-opacity">
            <span className="material-symbols-outlined text-[28px]">notifications</span>
          </button>
          <Link href="/login" className="hover:opacity-70 transition-opacity">
            <span className="material-symbols-outlined text-[28px]">account_circle</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
