"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  // We need to determine if we should animate.
  // Animate if going to "/" or from "/"
  const isToHome = pathname === "/";
  const isFromHome = prevPathRef.current === "/";
  const shouldAnimate = isToHome || isFromHome;

  // Direction: 1 = to Right (App), -1 = to Left (Home)
  // When going TO Home, new page slides in from Left (-100%), old page slides out Right (100%)
  // When going FROM Home, new page slides in from Right (100%), old page slides out Left (-100%)
  const direction = isToHome ? -1 : 1;

  useEffect(() => {
    prevPathRef.current = pathname;
  }, [pathname]);

  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };

  const customData = { direction, shouldAnimate };

  const variants: Variants = {
    initial: ({ direction, shouldAnimate }: { direction: number; shouldAnimate: boolean }) => {
      if (!shouldAnimate) return { x: "0%", opacity: 1 };
      return { x: direction > 0 ? "100%" : "-100%", opacity: 1 };
    },
    animate: ({ shouldAnimate }: { shouldAnimate: boolean }) => {
      if (!shouldAnimate) return { x: "0%", opacity: 1, transition: { duration: 0 } };
      return { x: "0%", opacity: 1, transition };
    },
    exit: ({ direction, shouldAnimate }: { direction: number; shouldAnimate: boolean }) => {
      if (!shouldAnimate) return { x: "0%", opacity: 1, transition: { duration: 0 } };
      return { x: direction > 0 ? "-100%" : "100%", opacity: 1, transition };
    }
  };

  return (
    <div className="w-full relative overflow-hidden min-h-screen bg-background">
      {/* mode="popLayout" automatically pulls the exiting element out of the document flow (making it absolute) so the new element can take its place instantly and animate simultaneously! */}
      <AnimatePresence mode="popLayout" initial={false} custom={customData}>
        <motion.div
          key={pathname}
          custom={customData}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full bg-background min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
