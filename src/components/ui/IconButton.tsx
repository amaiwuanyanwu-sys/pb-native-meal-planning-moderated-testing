import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon: React.ReactNode;
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  tooltip,
  tooltipPosition = 'top',
  className,
  ...props
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const baseStyles = 'inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative';

  const variants = {
    primary: 'bg-[#01272E] text-white hover:bg-[#385459] focus:ring-[#01272E]',
    secondary: 'bg-white border border-[#01272E] text-[#01272E] hover:bg-[#F0F2F3] focus:ring-[#01272E]',
    ghost: 'bg-transparent hover:bg-[#F0F2F3] text-[#01272E]'
  };

  const sizes = {
    sm: 'h-8 w-8 rounded p-1.5',
    md: 'h-10 w-10 rounded p-2',
    lg: 'h-12 w-12 rounded p-2.5'
  };

  return (
    <div className="relative inline-block">
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        onMouseEnter={() => tooltip && setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        {...props}
      >
        {icon}
      </button>

      {tooltip && isTooltipVisible && (
        <div className={cn(
          "absolute px-2 py-1 bg-[#244348] text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none",
          tooltipPosition === 'top' && "left-1/2 -translate-x-1/2 bottom-full mb-2",
          tooltipPosition === 'bottom' && "left-1/2 -translate-x-1/2 top-full mt-2",
          tooltipPosition === 'left' && "right-full top-1/2 -translate-y-1/2 mr-2",
          tooltipPosition === 'right' && "left-full top-1/2 -translate-y-1/2 ml-2"
        )}>
          {tooltip}
          {/* Arrow */}
          <div className={cn(
            "absolute w-0 h-0",
            tooltipPosition === 'top' && "left-1/2 -translate-x-1/2 top-full border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#244348]",
            tooltipPosition === 'bottom' && "left-1/2 -translate-x-1/2 bottom-full border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-[#244348]",
            tooltipPosition === 'left' && "left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-[#244348]",
            tooltipPosition === 'right' && "right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-[#244348]"
          )} />
        </div>
      )}
    </div>
  );
};
