"use client";

import React, { useState, useEffect, useRef } from "react";
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

export default function NotificationDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className="relative p-2 text-primary dark:text-primary-fixed-dim hover:bg-primary-container/10 transition-colors rounded-full cursor-pointer"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface dark:border-on-background animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-surface-container-lowest border border-outline-variant shadow-lg rounded-xl overflow-hidden z-50 origin-top-right"
          >
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="font-headline text-lg font-bold text-on-surface">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-primary text-on-primary text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_off</span>
                  <p className="font-body-md">No notifications yet</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <div 
                      key={notif._id}
                      onClick={() => markAsRead(notif._id)}
                      className={`p-4 border-b border-outline-variant last:border-0 hover:bg-surface-container/50 transition-colors cursor-pointer flex gap-4 ${!notif.isRead ? 'bg-primary-container/10' : ''}`}
                    >
                      <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${!notif.isRead ? 'bg-primary/10 text-primary' : 'bg-surface-variant/30 text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-xl">{getIconForType(notif.type)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className={`text-sm font-semibold ${!notif.isRead ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-xs text-on-surface-variant whitespace-nowrap">
                            {formatTime(notif.createdAt)}
                          </span>
                        </div>
                        <p className={`text-sm ${!notif.isRead ? 'text-on-surface-variant' : 'text-on-surface-variant/70'}`}>
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
              <div className="p-3 bg-surface-container-low text-center border-t border-outline-variant">
                <button 
                  className="text-primary text-sm font-bold hover:underline"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
