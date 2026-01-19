import React from 'react';

interface ExclusionsIconProps {
  className?: string;
  color?: string;
}

export const ExclusionsIcon: React.FC<ExclusionsIconProps> = ({ className, color = '#96A5A8' }) => {
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
        d="M10 1.66663C5.39763 1.66663 1.66667 5.39758 1.66667 9.99996C1.66667 14.6023 5.39763 18.3333 10 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39758 14.6024 1.66663 10 1.66663ZM3.33333 9.99996C3.33333 6.31806 6.31811 3.33329 10 3.33329C11.4944 3.33329 12.8676 3.8428 13.9584 4.69579L4.69579 13.9584C3.8428 12.8676 3.33333 11.4944 3.33333 9.99996ZM10 16.6666C8.50561 16.6666 7.13242 16.1572 6.04159 15.3042L15.3042 6.04159C16.1572 7.13242 16.6667 8.50561 16.6667 9.99996C16.6667 13.6819 13.6819 16.6666 10 16.6666Z"
        fill={color}
      />
    </svg>
  );
};
