'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// Quick action chips the user can tap
// ---------------------------------------------------------------------------

const QUICK_ACTIONS = [
  { label: '🔍 Find a PG', prompt: 'Help me find a PG near VIT campus' },
  { label: '💰 Compare prices', prompt: 'Compare PG prices in Kothri area' },
  { label: '📋 Amenities guide', prompt: 'What amenities should I look for in a good PG?' },
  { label: '📅 Book a visit', prompt: 'How do I book a visit to a PG on this platform?' },
];

// ---------------------------------------------------------------------------
// Simple markdown-ish renderer (bold, bullets, links)
// ---------------------------------------------------------------------------

function renderMessageContent(content: string) {
  // Split into lines for processing
  const lines = content.split('\n');

  return lines.map((line, i) => {
    // Bullet points
    if (line.match(/^[\-\*]\s/)) {
      const text = line.replace(/^[\-\*]\s/, '');
      return (
        <li key={i} className="ml-4 list-disc text-inherit">
          {renderInline(text)}
        </li>
      );
    }

    // Numbered list
    if (line.match(/^\d+\.\s/)) {
      const text = line.replace(/^\d+\.\s/, '');
      return (
        <li key={i} className="ml-4 list-decimal text-inherit">
          {renderInline(text)}
        </li>
      );
    }

    // Headers (## or ###)
    if (line.startsWith('### ')) {
      return (
        <p key={i} className="font-semibold text-sm mt-2 mb-1">
          {renderInline(line.replace('### ', ''))}
        </p>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <p key={i} className="font-bold text-sm mt-2 mb-1">
          {renderInline(line.replace('## ', ''))}
        </p>
      );
    }

    // Empty lines → spacer
    if (line.trim() === '') {
      return <br key={i} />;
    }

    // Normal paragraph
    return (
      <p key={i} className="text-inherit">
        {renderInline(line)}
      </p>
    );
  });
}

/** Render inline bold and links */
function renderInline(text: string): React.ReactNode {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// ---------------------------------------------------------------------------
// Chat Widget Component
// ---------------------------------------------------------------------------

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Restore messages from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('pg-genie-chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(
          parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
        );
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist messages to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('pg-genie-chat', JSON.stringify(messages));
    }
  }, [messages]);

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setShowPulse(false);
    }
  }, [isOpen]);

  // Handle sending a message
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput('');
      setIsStreaming(true);

      // Create placeholder for assistant response
      const assistantId = `model-${Date.now()}`;
      const assistantMessage: Message = {
        id: assistantId,
        role: 'model',
        content: '',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      try {
        // Prepare messages for API (exclude empty assistant placeholder)
        const apiMessages = updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        // Read SSE stream
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error('No response body');

        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE events
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: m.content + parsed.text }
                        : m
                    )
                  );
                }
                if (parsed.error) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? {
                          ...m,
                          content:
                            "I'm sorry, I encountered an error. Please try again.",
                        }
                        : m
                    )
                  );
                }
              } catch {
                // Ignore JSON parse errors for incomplete chunks
              }
            }
          }
        }
      } catch (error) {
        console.error('[ChatWidget] Error:', error);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                ...m,
                content:
                  "I'm sorry, I couldn't connect to the server. Please check your connection and try again.",
              }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, isStreaming]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  const clearChat = () => {
    setMessages([]);
    sessionStorage.removeItem('pg-genie-chat');
  };

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed z-[9998] transition-all duration-300 ease-out ${isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-[100%] md:translate-y-4 pointer-events-none'
          } inset-0 md:inset-auto md:bottom-24 md:right-6 w-full md:w-[400px] h-[100dvh] md:h-auto max-h-[100dvh] md:max-h-[600px] flex flex-col rounded-none md:rounded-2xl overflow-hidden shadow-2xl border-0 md:border md:border-outline-variant/20`}
        style={{
          background: 'var(--color-surface-container-lowest)',
          boxShadow:
            '0 25px 50px -12px rgba(52, 0, 117, 0.25), 0 0 0 1px rgba(52, 0, 117, 0.05)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2 flex-shrink-0 bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
            </div>
            <div>
              <h3 className="text-primary font-semibold text-sm">
                Genie
              </h3>
              <p className="text-primary/80 text-xs">
                {isStreaming ? 'Typing...' : 'Your AI PG assistant'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                title="Clear chat"
              >
                <span className="material-symbols-outlined text-[18px]">
                  delete
                </span>
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor:
              'var(--color-outline-variant) transparent',
          }}
        >
          {messages.length === 0 ? (
            // Welcome state
            <div className="flex flex-col items-center justify-center h-full py-2 md:py-6 text-center">
              <div
                className="hidden md:flex w-16 h-16 rounded-2xl items-center justify-center mb-4 shadow-lg"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)',
                }}
              >
                <span className="material-symbols-outlined text-white text-3xl">auto_awesome</span>
              </div>
              <h4 className="font-semibold text-on-surface text-base mb-1">
                Hi there! I&apos;m Genie ✨
              </h4>
              <p className="text-on-surface-variant text-sm mb-3 md:mb-5 max-w-[280px]">
                Your personal PG search assistant. Ask me anything about PGs near VIT!
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="bg-primary/5 text-primary border border-primary/15 px-3 py-1 rounded-full text-xs font-medium hover:bg-primary/10 hover:border-primary/30 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Chat messages
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mr-2 mt-1"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)',
                    }}
                  >
                    <span className="material-symbols-outlined text-white text-[14px]">auto_awesome</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-primary text-on-primary rounded-br-md'
                    : 'bg-surface-container text-on-surface rounded-bl-md'
                    }`}
                >
                  {msg.role === 'model' && msg.content === '' && isStreaming ? (
                    // Typing indicator
                    <div className="flex items-center gap-1 py-1">
                      <span
                        className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {renderMessageContent(msg.content)}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="flex-shrink-0 px-4 py-3 flex items-end gap-2"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Auto-resize
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask about PGs..."
            rows={1}
            className="flex-1 bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
            style={{ maxHeight: '100px' }}
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{
              background: input.trim()
                ? 'var(--color-primary)'
                : 'var(--color-surface-container)',
              color: input.trim()
                ? 'var(--color-on-primary)'
                : 'var(--color-on-surface-variant)',
            }}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isStreaming ? 'progress_activity' : 'send'}
            </span>
          </button>
        </form>
      </div>

      {/* Floating Action Button */}
      <button
        id="chat-widget-fab"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-[9999] bottom-20 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full items-center justify-center shadow-xl transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 ${isOpen ? 'hidden md:flex rotate-0' : 'flex rotate-0'
          }`}
        style={{
          background:
            'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)',
          boxShadow:
            '0 8px 32px rgba(52, 0, 117, 0.3), 0 0 0 3px rgba(52, 0, 117, 0.1)',
        }}
      >
        <span
          className={`material-symbols-outlined text-white text-[22px] md:text-[26px] transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'
            }`}
        >
          {isOpen ? 'close' : 'auto_awesome'}
        </span>

        {/* Pulse animation for attention */}
        {showPulse && !isOpen && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ background: 'var(--color-primary)' }}
          />
        )}
      </button>
    </>
  );
}
