import React from 'react';

interface GridIconProps {
  className?: string;
  color?: string;
}

export const GridIcon: React.FC<GridIconProps> = ({ className, color = '#96A5A8' }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16.6667 2.5H3.33333C2.875 2.5 2.5 2.875 2.5 3.33333V16.6667C2.5 17.125 2.875 17.5 3.33333 17.5H16.6667C17.125 17.5 17.5 17.125 17.5 16.6667V3.33333C17.5 2.875 17.125 2.5 16.6667 2.5ZM8.33333 15.8333H4.16667V11.6667H8.33333V15.8333ZM8.33333 10H4.16667V5.83333H8.33333V10ZM15.8333 15.8333H11.6667V11.6667H15.8333V15.8333ZM15.8333 10H11.6667V5.83333H15.8333V10Z"
        fill={color}
      />
    </svg>
  );
};
