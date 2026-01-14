import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-[#01272E] text-white hover:bg-[#385459] focus:ring-[#01272E]',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
    link: 'bg-transparent text-gray-600 hover:text-gray-900 underline-offset-4 hover:underline'
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm rounded',
    md: 'h-10 px-4 py-2.5 text-sm rounded',
    lg: 'h-10 px-4 py-2.5 text-sm rounded'
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <span className="mr-1">{icon}</span>}
      <span className="leading-[1.4]">{children}</span>
    </button>
  );
};
