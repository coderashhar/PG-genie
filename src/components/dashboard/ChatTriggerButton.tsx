'use client';

import React from 'react';

export default function ChatTriggerButton() {
  return (
    <button 
      onClick={() => {
        document.getElementById('chat-widget-fab')?.click();
      }}
      className="w-full bg-secondary text-on-secondary font-label-sm text-label-sm py-2 md:py-3 rounded-lg shadow-md hover:opacity-90 transition-opacity relative z-10 flex justify-center items-center gap-2 cursor-pointer"
    >
      <span className="material-symbols-outlined text-sm">magic_button</span> Get Recommendations
    </button>
  );
}
