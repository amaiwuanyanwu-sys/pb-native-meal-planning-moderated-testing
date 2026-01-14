import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  fillType?: 'initials' | 'icon' | 'image';
  size?: 'small' | 'medium' | 'large';
  initials?: string;
  imageSrc?: string;
  alt?: string;
  className?: string;
}

const PersonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path
      d="M13.3333 14V12.6667C13.3333 11.9594 13.0524 11.2811 12.5523 10.781C12.0522 10.281 11.3739 10 10.6667 10H5.33333C4.62609 10 3.94781 10.281 3.44772 10.781C2.94762 11.2811 2.66667 11.9594 2.66667 12.6667V14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 7.33333C9.47276 7.33333 10.6667 6.13943 10.6667 4.66667C10.6667 3.19391 9.47276 2 8 2C6.52724 2 5.33333 3.19391 5.33333 4.66667C5.33333 6.13943 6.52724 7.33333 8 7.33333Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Avatar: React.FC<AvatarProps> = ({
  fillType = 'initials',
  size = 'small',
  initials = 'CM',
  imageSrc,
  alt = 'Avatar',
  className
}) => {
  const sizeClasses = {
    small: 'size-[24px]',
    medium: 'size-[32px]',
    large: 'size-[64px]'
  };

  const textSizeClasses = {
    small: 'text-[12px]',
    medium: 'text-[12px]',
    large: 'text-[18px]'
  };

  const iconSizeClasses = {
    small: 'size-[16px]',
    medium: 'size-[16px]',
    large: 'size-[32px]'
  };

  const isImageType = fillType === 'image';
  const isIconType = fillType === 'icon';
  const isInitialsType = fillType === 'initials';

  return (
    <div
      className={cn(
        'relative rounded-full flex items-center justify-center overflow-hidden',
        sizeClasses[size],
        !isImageType && 'bg-[#b24ccd]',
        className
      )}
    >
      {isInitialsType && (
        <span
          className={cn(
            'font-semibold text-white text-center',
            textSizeClasses[size]
          )}
        >
          {initials}
        </span>
      )}

      {isIconType && (
        <PersonIcon
          className={cn('text-white', iconSizeClasses[size])}
        />
      )}

      {isImageType && imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
};
