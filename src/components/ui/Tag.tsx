import React from 'react';
import { cn } from '@/lib/utils';

type AlertVariant = 'warning' | 'success' | 'info' | 'error';
type AccentColor = 'default' | 'plum' | 'lavender' | 'lake' | 'seafoam' | 'spring' | 'gold' | 'tangerine' | 'creamsicle' | 'rose' | 'paprika';

interface TagProps {
  label: string;
  type?: 'alert' | 'informational';
  alertVariant?: AlertVariant;
  accentColor?: AccentColor;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  label,
  type = 'informational',
  alertVariant = 'info',
  accentColor = 'default',
  className,
}) => {
  // Alert variant styles - using complete class strings for Tailwind detection
  const alertStyles: Record<AlertVariant, string> = {
    success: 'bg-[#F5FEF8] border-[#1E8754] text-[#1E8754]',
    error: 'bg-[#FFF3F3] border-[#D42B1E] text-[#D42B1E]',
    warning: 'bg-[#FFFBEF] border-[#A36624] text-[#A36624]',
    info: 'bg-[#F2F8FB] border-[#007CB2] text-[#007CB2]',
  };

  // Informational (accent color) styles - using 100 shades for lighter, more pastel look
  const accentStyles: Record<AccentColor, string> = {
    default: 'bg-[#DFE3E4] text-[#244348]',
    plum: 'bg-[#e7e7f2] text-[#244348]',
    lavender: 'bg-[#c3c2df] text-[#244348]',
    lake: 'bg-[#b4e7f6] text-[#244348]',
    seafoam: 'bg-[#b9dbeb] text-[#244348]',
    spring: 'bg-[#c0f1cd] text-[#244348]',
    gold: 'bg-[#f8f1e0] text-[#244348]',
    tangerine: 'bg-[#ffdfb1] text-[#244348]',
    creamsicle: 'bg-[#ffc6b2] text-[#244348]',
    rose: 'bg-[#febac6] text-[#244348]',
    paprika: 'bg-[#f1bae3] text-[#244348]',
  };

  const styleClasses = type === 'alert' ? alertStyles[alertVariant] : accentStyles[accentColor];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium leading-[1.5]',
        styleClasses,
        className
      )}
      style={type === 'alert' ? { borderWidth: '1px' } : undefined}
    >
      {label}
    </span>
  );
};
