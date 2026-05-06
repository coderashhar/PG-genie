'use client';

import React, { useState, useCallback } from 'react';

/**
 * Hero3DVisual — A large, intricate, organic geometric 3D form composed of
 * translucent Midnight Emerald glass panes. On interaction, it "unfurls" to
 * reveal a miniature bed, Wi-Fi icon, and WhatsApp-style "Direct Connect" chat.
 */
export function Hero3DVisual() {
  const [isUnfurled, setIsUnfurled] = useState(false);

  const handleInteract = useCallback(() => {
    setIsUnfurled((prev) => !prev);
  }, []);

  return (
    <div
      className="hero-3d-container relative w-full h-full flex items-center justify-center cursor-pointer select-none"
      onClick={handleInteract}
      onMouseEnter={() => setIsUnfurled(true)}
      onMouseLeave={() => setIsUnfurled(false)}
      role="presentation"
    >
      {/* Ambient glow behind the form */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-primary/[0.04] blur-[80px]" />
        <div className="absolute top-[30%] right-[10%] w-[200px] h-[200px] rounded-full bg-accent/[0.06] blur-[60px]" />
      </div>

      {/* 3D Form */}
      <div className={`hero-3d-form relative w-[340px] h-[380px] md:w-[420px] md:h-[460px] ${isUnfurled ? 'is-unfurled' : ''}`}>
        {/* Pane 1 — Large back pane (asymmetric) */}
        <div
          className="pane-1 glass-pane glass-pane-glow absolute"
          style={{
            width: '85%',
            height: '75%',
            top: '5%',
            left: '8%',
            transform: 'translateZ(-20px)',
            borderRadius: '24px 16px 32px 20px',
          }}
        />

        {/* Pane 2 — Medium right pane (angled) */}
        <div
          className="pane-2 glass-pane glass-pane-glow absolute"
          style={{
            width: '55%',
            height: '60%',
            top: '15%',
            right: '2%',
            transform: 'translateZ(10px) rotateY(-8deg)',
            borderRadius: '20px 28px 16px 24px',
          }}
        />

        {/* Pane 3 — Small floating accent pane */}
        <div
          className="pane-3 glass-pane glass-pane-glow absolute"
          style={{
            width: '40%',
            height: '35%',
            bottom: '8%',
            left: '5%',
            transform: 'translateZ(25px) rotateY(5deg)',
            borderRadius: '18px 22px 26px 14px',
          }}
        />

        {/* Pane 4 — Decorative thin strip */}
        <div
          className="glass-pane absolute"
          style={{
            width: '30%',
            height: '8%',
            top: '2%',
            right: '15%',
            transform: 'translateZ(15px)',
            borderRadius: '12px',
            opacity: 0.5,
          }}
        />

        {/* Geometric accent dots */}
        <div
          className="absolute w-3 h-3 rounded-full bg-accent/60"
          style={{ top: '12%', right: '12%', animation: 'parallaxSlow 4s ease-in-out infinite' }}
        />
        <div
          className="absolute w-2 h-2 rounded-full bg-primary/30"
          style={{ bottom: '20%', left: '15%', animation: 'parallaxFast 3.5s ease-in-out infinite' }}
        />
        <div
          className="absolute w-2 h-2 rounded-full bg-accent/40"
          style={{ top: '45%', left: '3%', animation: 'parallaxSlow 5s ease-in-out infinite 0.5s' }}
        />

        {/* Revealed inner content (bed + icons) */}
        <div
          className={`reveal-content absolute inset-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-700 ${
            isUnfurled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Miniature bed with gold pillow */}
          <div className="relative reveal-icon" style={{ animationDelay: '0.2s' }}>
            <svg width="80" height="56" viewBox="0 0 80 56" fill="none">
              {/* Bed frame */}
              <rect x="4" y="28" width="72" height="20" rx="6" fill="#004D40" opacity="0.85" />
              {/* Mattress */}
              <rect x="8" y="22" width="64" height="12" rx="4" fill="#E0F2F1" />
              {/* Gold pillow */}
              <rect x="14" y="18" width="20" height="10" rx="5" fill="#FFC107" />
              <rect x="14" y="18" width="20" height="5" rx="3" fill="#FFD54F" opacity="0.6" />
              {/* Headboard */}
              <rect x="4" y="10" width="8" height="24" rx="3" fill="#004D40" />
              {/* Legs */}
              <rect x="8" y="46" width="4" height="8" rx="1" fill="#004D40" opacity="0.6" />
              <rect x="68" y="46" width="4" height="8" rx="1" fill="#004D40" opacity="0.6" />
            </svg>
          </div>

          {/* Floating icons row */}
          <div className="flex items-center gap-6">
            {/* Wi-Fi icon */}
            <div className="reveal-icon flex flex-col items-center gap-1" style={{ animationDelay: '0s' }}>
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#004D40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <circle cx="12" cy="20" r="1" fill="#004D40" />
                </svg>
              </div>
            </div>

            {/* Chat / Direct Connect */}
            <div className="reveal-icon flex flex-col items-center gap-1.5" style={{ animationDelay: '0.4s' }}>
              <div className="w-11 h-11 rounded-full bg-[#25D366]/15 flex items-center justify-center relative">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fillRule="evenodd" />
                </svg>
                {/* Shimmer overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%] animate-shimmer" />
              </div>
              <span className="text-[10px] font-semibold text-primary tracking-wider uppercase">
                Direct Connect
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Click/hover hint */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-on-surface/50 font-medium tracking-wide transition-opacity duration-500 ${
          isUnfurled ? 'opacity-0' : 'opacity-100'
        }`}
      >
        hover to discover ✦
      </div>
    </div>
  );
}
