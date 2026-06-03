"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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

  // The exact Codrops "Move to left / from right" easing and duration
  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };

  const variants = {
    initial: (d: number) => ({
      x: d > 0 ? "100%" : "-100%",
    }),
    animate: {
      x: "0%",
      transition
    },
    exit: (d: number) => ({
      x: d > 0 ? "-100%" : "100%",
      transition
    })
  };

  const noAnimVariants = {
    initial: { x: 0, opacity: 1 },
    animate: { x: 0, opacity: 1, transition: { duration: 0 } },
    exit: { x: 0, opacity: 1, transition: { duration: 0 } }
  };

  return (
    <div className="w-full relative overflow-hidden min-h-screen bg-background">
      {/* mode="popLayout" automatically pulls the exiting element out of the document flow (making it absolute) so the new element can take its place instantly and animate simultaneously! */}
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={pathname}
          custom={direction}
          variants={shouldAnimate ? variants : noAnimVariants}
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
