"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "system" | "booking" | "message" | "offer";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export default function NotificationDropdown({ isHome }: { isHome?: boolean }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Polling interval for "real-time" updates (every 10 seconds)
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    // Optimistic update
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const markAsRead = async (id: string) => {
    const target = notifications.find(n => n._id === id);
    if (target?.isRead) return;

    // Optimistic update
    setNotifications(notifications.map(n => (n._id === id ? { ...n, isRead: true } : n)));

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "booking": return "calendar_month";
      case "message": return "chat";
      case "offer": return "local_offer";
      case "system":
      default: return "info";
    }
  };

  if (!session) return null;

  const colorClass = isHome ? "text-white hover:opacity-80" : "text-primary dark:text-primary-fixed-dim hover:bg-primary-container/10";

  const renderNotificationContent = () => (
    <>
      <div className="p-3 md:p-4 border-b border-outline-variant flex justify-between items-center bg-surface shrink-0">
        <h3 className="font-headline text-base md:text-lg font-bold text-on-surface">Notifications</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="bg-primary text-on-primary text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount} New
            </span>
          )}
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="md:hidden material-symbols-outlined text-on-surface-variant p-1 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors">close</button>
        </div>
      </div>

      <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto overscroll-contain">
        {notifications.length === 0 ? (
          <div className="p-6 md:p-8 text-center text-on-surface-variant flex flex-col items-center">
            <span className="material-symbols-outlined text-3xl md:text-4xl mb-2 opacity-50">notifications_off</span>
            <p className="font-body-md text-sm md:text-base">No notifications yet</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.map((notif) => (
              <div 
                key={notif._id}
                onClick={() => markAsRead(notif._id)}
                className={`p-3 md:p-4 border-b border-outline-variant last:border-0 hover:bg-surface-container/50 transition-colors cursor-pointer flex gap-3 md:gap-4 ${!notif.isRead ? 'bg-primary-container/10' : ''}`}
              >
                <div className={`mt-1 flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${!notif.isRead ? 'bg-primary/10 text-primary' : 'bg-surface-variant/30 text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-base md:text-xl">{getIconForType(notif.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className={`text-xs md:text-sm font-semibold truncate ${!notif.isRead ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] md:text-xs text-on-surface-variant whitespace-nowrap">
                      {formatTime(notif.createdAt)}
                    </span>
                  </div>
                  <p className={`text-[11px] md:text-sm leading-snug line-clamp-2 md:line-clamp-none ${!notif.isRead ? 'text-on-surface-variant' : 'text-on-surface-variant/70'}`}>
                    {notif.message}
                  </p>
                  {notif.link && (
                    <Link 
                      href={notif.link}
                      className="inline-block mt-2 text-xs font-bold text-primary hover:underline"
                      onClick={(e) => { e.stopPropagation(); markAsRead(notif._id); setIsOpen(false); }}
                    >
                      View details
                    </Link>
                  )}
                </div>
                {!notif.isRead && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="p-3 bg-surface-container-low text-center border-t border-outline-variant shrink-0">
          <button 
            className="text-primary text-sm font-bold hover:underline cursor-pointer"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className={`relative p-2 transition-colors rounded-full cursor-pointer ${colorClass}`}
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface dark:border-on-background animate-pulse" />
        )}
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999] pointer-events-none">
              <div className="absolute inset-0 pointer-events-auto bg-black/40 md:bg-transparent" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}></div>
              
              {/* Desktop Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="hidden md:flex flex-col absolute right-8 lg:right-16 top-16 mt-2 w-96 bg-surface-container-lowest border border-outline-variant shadow-lg rounded-xl overflow-hidden z-50 origin-top-right text-on-surface pointer-events-auto"
              >
                {renderNotificationContent()}
              </motion.div>

              {/* Mobile Top Sheet */}
              <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="md:hidden fixed top-0 left-0 right-0 bg-surface-container-lowest shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-b border-outline-variant/30 rounded-b-3xl overflow-hidden z-50 flex flex-col max-h-[85vh] text-on-surface pointer-events-auto"
              >
                {renderNotificationContent()}
                {/* Drag handle for aesthetics */}
                <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full mx-auto my-3 shrink-0" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
