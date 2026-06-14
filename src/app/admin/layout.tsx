import React from "react";
import Link from "next/link";
import { headers } from "next/headers";

export const metadata = {
  title: "Admin Dashboard - PG Genie",
  description: "Administrative control panel for PG Genie.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background font-body overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-outline-variant">
          <Link href="/admin" className="font-display text-h3 font-extrabold text-primary">
            PG Genie <span className="text-on-surface-variant text-body-sm ml-1">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container transition-colors text-on-surface font-medium">
            <span className="material-symbols-outlined text-primary">dashboard</span>
            Dashboard
          </Link>
          <Link href="/admin/tickets" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container transition-colors text-on-surface font-medium">
            <span className="material-symbols-outlined text-secondary">support_agent</span>
            Support Tickets
          </Link>
          <Link href="/admin/pgs" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container transition-colors text-on-surface font-medium">
            <span className="material-symbols-outlined text-error">gpp_maybe</span>
            PG Moderation
          </Link>
        </nav>

        <div className="p-4 border-t border-outline-variant">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-on-surface-variant transition-colors text-sm">
            <span className="material-symbols-outlined">exit_to_app</span>
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-4 md:hidden">
          <Link href="/admin" className="font-display text-h3 font-extrabold text-primary">
            Admin Panel
          </Link>
          <Link href="/" className="text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </Link>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
