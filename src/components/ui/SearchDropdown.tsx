import React, { useState, useRef, useEffect } from 'react';
import { Chip } from './Chip';

interface SearchDropdownProps {
  placeholder?: string;
  options: string[];
  selectedOptions: string[];
  suggestedOptions?: string[]; // Options to show as suggestions initially
  onOptionToggle: (option: string) => void;
  variant?: 'default' | 'stretch';
  className?: string;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  placeholder = 'Search',
  options,
  selectedOptions,
  suggestedOptions = [],
  onOptionToggle,
  variant = 'default',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setSearchQuery(''); // Clear search when closing
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  const handleSearchClick = () => {
    setIsExpanded(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${variant === 'stretch' ? 'w-full' : 'w-auto'} ${className}`}
    >
      {/* Search Input - Always visible */}
      <div
        className={`flex items-center gap-2 h-10 px-3 py-2 border border-[#96A5A8] rounded bg-white cursor-text ${
          variant === 'stretch' ? 'w-full' : 'w-[294px]'
        }`}
        onClick={handleSearchClick}
      >
        <span className="material-icons text-2xl text-[#657A7E]">search</span>
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={handleSearchClick}
          className="flex-1 text-sm font-medium text-[#01272E] placeholder-[#657A7E] bg-transparent border-none outline-none"
        />
      </div>

      {/* Chips below search - Always visible when collapsed */}
      {!isExpanded && (
        <div className="mt-3 flex flex-wrap gap-3">
          {/* Show all suggested chips in original order, with selected state */}
          {suggestedOptions.map((option) => {
            const isSelected = selectedOptions.includes(option);
            return (
              <Chip
                key={option}
                label={option}
                selected={isSelected}
                onClick={() => onOptionToggle(option)}
              />
            );
          })}
        </div>
      )}

      {/* Dropdown - Appears when expanded */}
      {isExpanded && (
        <div
          className={`absolute top-full left-0 mt-2 bg-white border border-[#DFE3E4] rounded shadow-lg z-50 ${
            variant === 'stretch' ? 'w-full' : 'w-[294px]'
          }`}
        >
          <div className="p-3 flex flex-col gap-3 max-h-[320px] overflow-y-auto">
            {/* Selected chips at top of dropdown */}
            {selectedOptions.length > 0 && (
              <>
                <div className="flex flex-wrap gap-2">
                  {selectedOptions.map((option) => (
                    <Chip
                      key={option}
                      label={option}
                      selected={true}
                      variant="removable"
                      size="sm"
                      onClick={() => onOptionToggle(option)}
                    />
                  ))}
                </div>
                <div className="h-px bg-[#DFE3E4]" />
              </>
            )}

            {/* Full searchable list with checkboxes */}
            {filteredOptions.length > 0 ? (
              <div className="flex flex-col gap-1">
                {filteredOptions.map((option) => {
                  const isSelected = selectedOptions.includes(option);
                  // Don't show already selected items again in the list
                  if (isSelected) return null;

                  return (
                    <label
                      key={option}
                      className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#F0F2F3] cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => onOptionToggle(option)}
                        className="w-4 h-4 rounded border-[#96A5A8] text-[#01272E] focus:ring-2 focus:ring-[#01272E] cursor-pointer"
                      />
                      <span className="text-sm font-medium text-[#01272E]">{option}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[#657A7E] text-center py-2">
                {searchQuery ? 'No results found' : 'Start typing to search'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
