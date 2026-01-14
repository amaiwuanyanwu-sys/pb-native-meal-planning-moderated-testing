import React from 'react';
import { cn } from '@/lib/utils';

interface ChipProps {
  label: string;
  selected?: boolean;
  variant?: 'default' | 'removable'; // 'removable' shows X on right, no icon on left
  size?: 'md' | 'sm'; // 'md' is 32px (h-8), 'sm' is also 32px but with smaller padding
  onClick?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  variant = 'default',
  size = 'md',
  onClick,
  className
}) => {
  const iconSize = size === 'sm' ? '16px' : '22px';

  return (
    <button
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
      <span className="text-sm font-medium leading-[1.4]">{label}</span>
      {variant === 'removable' && (
        <span className="material-icons" style={{ fontSize: iconSize }}>close</span>
      )}
    </button>
  );
};
