import React, { useState, useRef, useEffect } from 'react';
import { Chip } from './Chip';

interface SearchDropdownProps {
  placeholder?: string;
  options: string[];
  selectedOptions: string[];
  groups?: string[]; // Food groups/tags to show in separate section
  onOptionToggle: (option: string) => void;
  variant?: 'default' | 'stretch';
  chipVariant?: 'default' | 'exclusion'; // Variant for chip icons
  className?: string;
  getGroupsForIngredients?: (ingredients: string[]) => string[]; // Function to get groups that match ingredients
  isIngredientInSelectedGroup?: (ingredient: string) => boolean; // Function to check if ingredient belongs to a selected group
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  placeholder = 'Search',
  options,
  selectedOptions,
  groups = [],
  onOptionToggle,
  variant = 'default',
  chipVariant = 'default',
  className = '',
  getGroupsForIngredients,
  isIngredientInSelectedGroup
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search query and limit to 15 results
  const filteredOptions = options
    .filter(option =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 15);

  // Filter groups based on:
  // 1. Group name matches the search query, OR
  // 2. At least one filtered ingredient belongs to that group
  const filteredGroups = groups.filter(group => {
    // Check if group name matches search query
    const groupNameMatches = group.toLowerCase().includes(searchQuery.toLowerCase());

    // Check if any filtered ingredient belongs to this group
    const hasMatchingIngredients = getGroupsForIngredients
      ? getGroupsForIngredients(filteredOptions).includes(group)
      : false;

    return groupNameMatches || hasMatchingIngredients;
  });

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
        className={`flex items-center gap-2 h-10 px-3 py-2 border border-[#96A5A8] rounded bg-white cursor-text focus-within:border-[#007CB2] focus-within:border-2 ${
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

      {/* Dropdown - Appears when expanded and user has typed something */}
      {isExpanded && searchQuery && (
        <div
          className={`absolute top-full left-0 mt-2 bg-white border border-[#DFE3E4] rounded shadow-lg z-50 ${
            variant === 'stretch' ? 'w-full' : 'w-[294px]'
          }`}
        >
          <div className="p-3 flex flex-col gap-3 max-h-[320px] overflow-y-auto">
            {/* Groups Section */}
            {filteredGroups.length > 0 && (
              <>
                <div>
                  <p className="text-xs font-semibold text-[#657A7E] uppercase tracking-wide mb-2 px-2">
                    Groups
                  </p>
                  <div className="flex flex-wrap gap-2 px-2">
                    {filteredGroups.map((group) => {
                      const isSelected = selectedOptions.includes(group);
                      return (
                        <Chip
                          key={group}
                          label={group}
                          variant={chipVariant}
                          selected={isSelected}
                          onClick={(e) => {
                            e?.stopPropagation();
                            onOptionToggle(group);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="h-px bg-[#DFE3E4]" />
              </>
            )}

            {/* Ingredients Section */}
            {filteredOptions.length > 0 ? (
              <div>
                <p className="text-xs font-semibold text-[#657A7E] uppercase tracking-wide mb-2 px-2">
                  Ingredients
                </p>
                <div className="flex flex-col gap-1">
                  {filteredOptions.map((option) => {
                    // Check if ingredient is directly selected OR belongs to a selected group
                    const isDirectlySelected = selectedOptions.includes(option);
                    const isInSelectedGroup = isIngredientInSelectedGroup ? isIngredientInSelectedGroup(option) : false;
                    const isSelected = isDirectlySelected || isInSelectedGroup;

                    return (
                      <label
                        key={option}
                        className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#F0F2F3] cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onOptionToggle(option)}
                          className="w-4 h-4 rounded border-[#96A5A8] text-[#01272E] focus:ring-2 focus:ring-[#01272E] cursor-pointer"
                        />
                        <span className="text-sm font-medium text-[#01272E]">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : (
              filteredGroups.length === 0 && (
                <p className="text-sm text-[#657A7E] text-center py-2">
                  {searchQuery ? 'No results found' : 'Start typing to search'}
                </p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
