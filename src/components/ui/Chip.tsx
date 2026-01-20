import React from 'react';
import { cn } from '@/lib/utils';

interface ChipProps {
  label: string;
  selected?: boolean;
  variant?: 'default' | 'removable' | 'no-icon' | 'dropdown' | 'exclusion' | 'exclusion-removable'; // 'no-icon' has no icons, 'dropdown' shows chevron on right, 'exclusion' shows block icon, 'exclusion-removable' shows block on left and close on right
  size?: 'md' | 'sm'; // 'md' is 32px (h-8), 'sm' is also 32px but with smaller padding
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  rightIcon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  variant = 'default',
  size = 'md',
  onClick,
  className,
  rightIcon
}) => {
  const iconSize = size === 'sm' ? '16px' : '16px';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-1 rounded-full transition-colors',
        size === 'sm' ? 'h-[22px] px-2' : 'h-8 px-3',
        selected
          ? 'bg-[#385459] text-white'
          : 'bg-[#DFE3E4] text-[#244348] hover:bg-[#C1C9CB]',
        className
      )}
    >
      {variant === 'default' && (
        <span className="material-icons" style={{ fontSize: iconSize }}>
          {selected ? 'done' : 'add'}
        </span>
      )}
      {variant === 'exclusion' && (
        <span className="material-icons" style={{ fontSize: iconSize }}>
          {selected ? 'block' : 'add'}
        </span>
      )}
      {variant === 'exclusion-removable' && (
        <span className="material-icons" style={{ fontSize: iconSize }}>
          block
        </span>
      )}
      <span className="text-sm font-medium leading-[1.4]">{label}</span>
      {variant === 'removable' && (
        <span className="material-icons" style={{ fontSize: iconSize }}>close</span>
      )}
      {variant === 'exclusion-removable' && (
        <span className="material-icons" style={{ fontSize: iconSize }}>close</span>
      )}
      {variant === 'dropdown' && (
        rightIcon || (
          <span className="material-icons" style={{ fontSize: iconSize }}>keyboard_arrow_down</span>
        )
      )}
    </button>
  );
};
