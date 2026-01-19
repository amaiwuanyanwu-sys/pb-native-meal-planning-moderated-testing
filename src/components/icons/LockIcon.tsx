import React from 'react';

interface LockIconProps {
  className?: string;
  color?: string;
  size?: number;
}

export const LockIcon: React.FC<LockIconProps> = ({
  className,
  color = 'currentColor',
  size = 16
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.6667 5.33333H12V4C12 2.16 10.5067 0.666667 8.66667 0.666667H7.33333C5.49333 0.666667 4 2.16 4 4V5.33333H3.33333C2.6 5.33333 2 5.93333 2 6.66667V14C2 14.7333 2.6 15.3333 3.33333 15.3333H12.6667C13.4 15.3333 14 14.7333 14 14V6.66667C14 5.93333 13.4 5.33333 12.6667 5.33333ZM5.33333 4C5.33333 2.89333 6.22667 2 7.33333 2H8.66667C9.77333 2 10.6667 2.89333 10.6667 4V5.33333H5.33333V4ZM12.6667 14H3.33333V6.66667H12.6667V14ZM8 11.3333C8.73638 11.3333 9.33333 10.7364 9.33333 10C9.33333 9.26362 8.73638 8.66667 8 8.66667C7.26362 8.66667 6.66667 9.26362 6.66667 10C6.66667 10.7364 7.26362 11.3333 8 11.3333Z"
        fill={color}
      />
    </svg>
  );
};
