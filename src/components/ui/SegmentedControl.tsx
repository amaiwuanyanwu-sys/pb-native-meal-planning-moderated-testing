import React from 'react';

interface SegmentedControlOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-[#C1C9CB] rounded h-10 inline-flex items-center px-[3px] py-0.5 ${className}`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`h-[34px] rounded flex items-center justify-center px-4 py-2.5 transition-colors ${
              isSelected
                ? 'bg-[#385459]'
                : 'hover:bg-[#F0F2F3]'
            }`}
          >
            <p className={`text-sm font-semibold whitespace-nowrap ${
              isSelected ? 'text-white' : 'text-[#385459]'
            }`}>
              {option.label}
            </p>
          </button>
        );
      })}
    </div>
  );
};
