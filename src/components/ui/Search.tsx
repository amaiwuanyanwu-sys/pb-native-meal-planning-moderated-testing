import React from 'react';

interface SearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  variant?: 'default' | 'stretch';
  className?: string;
}

export const Search: React.FC<SearchProps> = ({
  placeholder = 'Search',
  value,
  onChange,
  variant = 'default',
  className = ''
}) => {
  return (
    <div
      className={`flex items-center gap-2 h-10 px-3 py-2 border border-[#96A5A8] rounded bg-white ${
        variant === 'stretch' ? 'w-full' : 'w-[294px]'
      } ${className}`}
    >
      <span className="material-icons text-2xl text-[#657A7E]">search</span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-sm font-medium text-[#01272E] placeholder-[#657A7E] bg-transparent border-none outline-none"
      />
    </div>
  );
};
