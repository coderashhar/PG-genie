import React from 'react';

interface M3CardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 0 | 1 | 2 | 3;
  variant?: 'outlined' | 'filled' | 'elevated';
}

export function M3Card({
  children,
  className = '',
  elevation = 1,
  variant = 'outlined',
}: M3CardProps) {
  const baseStyles = 'rounded-[24px] overflow-hidden transition-all duration-400';

  const variants = {
    outlined: 'bg-white border border-outline',
    filled: 'bg-surface-dim border border-transparent',
    elevated: 'bg-white border border-transparent',
  };

  const elevations = {
    0: '',
    1: 'shadow-m3',
    2: 'shadow-[0_8px_30px_rgba(0,77,64,0.06)]',
    3: 'shadow-m3-hover',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${elevations[elevation]} ${className}`}>
      {children}
    </div>
  );
}
