import React from 'react';
import { cn } from '@/lib/utils';
import { RailToggle } from '@/components/ui/RailToggle';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';

export interface FilterSection {
  id: string;
  label: string;
  appliedCount: number;
  expanded: boolean;
  options: string[];
  selectedOptions: string[];
}

interface FiltersSideRailProps {
  filters: FilterSection[];
  onToggleFilter: (filterId: string, option: string) => void;
  onToggleExpanded: (filterId: string) => void;
  onClearAll: () => void;
  className?: string;
}

export const FiltersSideRail: React.FC<FiltersSideRailProps> = ({
  filters,
  onToggleFilter,
  onToggleExpanded,
  onClearAll,
  className
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getTotalAppliedFilters = () => {
    return filters.reduce((sum, filter) => sum + filter.appliedCount, 0);
  };

  const hasActiveFilters = getTotalAppliedFilters() > 0;

  return (
    <aside className={cn(
      'bg-white flex flex-col h-full transition-all duration-300 border-l border-[#dfe3e4]',
      'shadow-[0px_2px_4px_0px_rgba(1,39,46,0.1)]',
      isCollapsed ? 'w-16' : 'w-80',
      className
    )}>
      {/* Collapsible Toggle */}
      <RailToggle
        isCollapsed={isCollapsed}
        onToggle={handleToggleCollapse}
        position="right"
      />

      {isCollapsed ? (
        // Collapsed State - Show filter icon
        <div className="w-full flex justify-center py-1">
          <IconButton
            onClick={handleToggleCollapse}
            variant="ghost"
            size="md"
            tooltip={hasActiveFilters ? `${getTotalAppliedFilters()} filters active` : 'Filters'}
            tooltipPosition="left"
            icon={
              <span className={cn(
                'material-icons text-2xl',
                hasActiveFilters ? 'text-[#007CB2]' : 'text-[#657A7E]'
              )}>
                {hasActiveFilters ? 'filter_alt' : 'filter_alt_off'}
              </span>
            }
          />
        </div>
      ) : (
        // Expanded State - Show full filters
        <>
          {/* Filters Header */}
          <div className="flex items-center justify-between px-4 py-1">
            <div className="flex items-center gap-2">
              <span className={cn(
                'material-icons text-xl',
                hasActiveFilters ? 'text-[#007CB2]' : 'text-[#657A7E]'
              )}>
                {hasActiveFilters ? 'filter_alt' : 'filter_alt_off'}
              </span>
              <h3 className="text-base font-semibold text-[#244348] leading-[1.3]">Filters</h3>
            </div>
            <Button
              onClick={onClearAll}
              variant="ghost"
              size="sm"
            >
              Clear
            </Button>
          </div>

          {/* Filters Content */}
          <div className="flex-1 overflow-y-auto">
            {filters.map((filter, index) => (
              <div
                key={filter.id}
                className="border-b border-[#DFE3E4]"
              >
                {/* Filter Header */}
                <button
                  onClick={() => onToggleExpanded(filter.id)}
                  className="w-full h-10 flex items-center justify-between pl-4 pr-0 hover:bg-[#F0F2F3] transition-colors"
                >
                  <span className="text-sm font-semibold text-[#385459] leading-[1.4]">
                    {filter.label}
                  </span>
                  <div className="flex items-center gap-0">
                    {filter.appliedCount > 0 && (
                      <span className="text-xs font-semibold text-[#657A7E] leading-normal">
                        {filter.appliedCount} applied
                      </span>
                    )}
                    <div className="w-10 h-10 flex items-center justify-center">
                      <span className="material-icons text-2xl text-[#657A7E]">
                        {filter.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Filter Options */}
                {filter.expanded && filter.options.length > 0 && (
                  <div className="px-4 pb-4 flex flex-wrap gap-2">
                    {filter.options.map((option) => (
                      <Chip
                        key={option}
                        label={option}
                        selected={filter.selectedOptions.includes(option)}
                        onClick={() => onToggleFilter(filter.id, option)}
                        size="sm"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};
