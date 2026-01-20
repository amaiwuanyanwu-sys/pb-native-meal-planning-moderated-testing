import React from 'react';
import { cn } from '@/lib/utils';

interface LeftRailListItemProps {
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export const LeftRailListItem: React.FC<LeftRailListItemProps> = ({
  label,
  icon,
  isActive = false,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'px-4 py-2 w-full text-left flex items-center gap-2 transition-all',
        isActive ? 'bg-[#01272E] text-white font-semibold' : 'bg-transparent text-[#244348] font-medium',
        onClick && 'cursor-pointer hover:bg-[#F0F2F3]',
        isActive && onClick && 'hover:bg-[#01272E]'
      )}
    >
      {icon && (
        <span className={cn(
          'shrink-0 flex items-center',
          isActive ? 'text-white' : 'text-[#657A7E]'
        )}>
          {icon}
        </span>
      )}
      <span className="flex-1 min-w-0 h-6 flex items-center text-sm leading-[1.4]">
        <span className="truncate">{label}</span>
      </span>
    </div>
  );
};
