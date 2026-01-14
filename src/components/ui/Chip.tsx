import React from 'react';
import { cn } from '@/lib/utils';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  className
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-1 h-8 px-3 rounded-full transition-colors',
        selected
          ? 'bg-[#244348] text-white'
          : 'bg-[#DFE3E4] text-[#244348] hover:bg-[#C1C9CB]',
        className
      )}
    >
      <span className="material-icons text-xl">
        {selected ? 'done' : 'add'}
      </span>
      <span className="text-sm font-medium leading-[1.4]">{label}</span>
    </button>
  );
};
