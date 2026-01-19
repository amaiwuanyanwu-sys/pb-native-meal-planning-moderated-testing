import React from 'react';

interface MoreHorizontalIconProps {
  className?: string;
  color?: string;
  size?: number;
}

export const MoreHorizontalIcon: React.FC<MoreHorizontalIconProps> = ({
  className,
  color = 'currentColor',
  size = 20
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10.0007 9.16675C9.54041 9.16675 9.16732 9.53984 9.16732 10.0001C9.16732 10.4604 9.54041 10.8334 10.0007 10.8334C10.4609 10.8334 10.834 10.4604 10.834 10.0001C10.834 9.53984 10.4609 9.16675 10.0007 9.16675Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.834 9.16675C15.3737 9.16675 15.0007 9.53984 15.0007 10.0001C15.0007 10.4604 15.3737 10.8334 15.834 10.8334C16.2943 10.8334 16.6673 10.4604 16.6673 10.0001C16.6673 9.53984 16.2943 9.16675 15.834 9.16675Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.16732 9.16675C3.70708 9.16675 3.33398 9.53984 3.33398 10.0001C3.33398 10.4604 3.70708 10.8334 4.16732 10.8334C4.62756 10.8334 5.00065 10.4604 5.00065 10.0001C5.00065 9.53984 4.62756 9.16675 4.16732 9.16675Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
