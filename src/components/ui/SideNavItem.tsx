import React from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

interface SideNavItemProps {
  label: string;
  path: string;
  icon: React.ReactNode;
  isActive?: boolean;
  badge?: number;
  className?: string;
}

export const SideNavItem: React.FC<SideNavItemProps> = ({
  label,
  path,
  icon,
  isActive = false,
  badge,
  className
}) => {
  const isDisabled = path === '#';

  const baseClassName = cn(
    'relative flex flex-col items-center justify-center h-[42px] w-[72px] rounded gap-0 px-1 transition-colors group',
    isActive ? 'bg-[#385459]' : !isDisabled && 'hover:bg-[#385459]/50',
    isDisabled && 'cursor-default',
    className
  );

  const content = (
    <>
      {/* Icon */}
      {React.cloneElement(icon as React.ReactElement, {
        className: cn(
          'transition-colors',
          isActive
            ? 'text-white group-hover:text-[#5fe089]'
            : 'text-[#c1c9cb] group-hover:text-[#5fe089]'
        ),
        size: 20
      })}

      {/* Label */}
      <span
        className={cn(
          'text-[10px] font-semibold text-center w-full leading-[1.5] transition-colors',
          isActive
            ? 'text-white group-hover:text-[#5fe089]'
            : 'text-[#c1c9cb] group-hover:text-[#5fe089]'
        )}
      >
        {label}
      </span>

      {/* Badge Counter */}
      {badge !== undefined && badge > 0 && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-[#5fe089] rounded-full flex items-center justify-center">
          <span className="text-[#244348] text-[10px] font-semibold leading-4">
            {badge}
          </span>
        </div>
      )}
    </>
  );

  if (isDisabled) {
    return <div className={baseClassName}>{content}</div>;
  }

  return (
    <Link to={path} className={baseClassName}>
      {content}
    </Link>
  );
};
