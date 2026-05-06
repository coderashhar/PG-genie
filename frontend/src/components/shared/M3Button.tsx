import React from 'react';

interface M3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function M3Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: M3ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.97]';

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-dark focus:ring-primary hover:shadow-[0_4px_16px_rgba(0,77,64,0.2)]',
    accent:
      'bg-accent text-primary hover:bg-accent-light focus:ring-accent hover:shadow-[0_4px_16px_rgba(255,193,7,0.25)]',
    outline:
      'border border-primary text-primary bg-transparent hover:bg-primary/5 focus:ring-primary',
    ghost:
      'text-primary bg-transparent hover:bg-primary/5 focus:ring-primary',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
