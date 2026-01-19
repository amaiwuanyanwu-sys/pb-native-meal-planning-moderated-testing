import React from 'react';
import { cn } from '@/lib/utils';

interface NutrientSummaryItem {
  label: string;
  value: string;
  color: string;
}

interface DayHeaderProps {
  day: string;
  totalCalories: number;
  targetCalories?: number;
  compact?: boolean;
  nutrients?: NutrientSummaryItem[];
  className?: string;
}

const NutrientSummary: React.FC<{ nutrients: NutrientSummaryItem[] }> = ({ nutrients }) => {
  return (
    <div className="flex flex-1 flex-col gap-2 px-3 py-1 pt-1 pb-2">
      {nutrients.map((nutrient, index) => (
        <div key={index} className="flex gap-2 items-center w-full">
          <div className="flex-1 flex gap-1 items-center">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: nutrient.color }}
            />
            <span className="text-xs font-semibold text-[#244348] leading-[1.5]">
              {nutrient.label}
            </span>
          </div>
          <span className="text-xs font-medium text-[#657A7E] leading-[1.5]">
            {nutrient.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const DayHeader: React.FC<DayHeaderProps> = ({
  day,
  totalCalories,
  targetCalories = 2000,
  compact = true,
  nutrients = [],
  className
}) => {
  // Determine status based on calories
  const getStatus = () => {
    if (totalCalories === 0) return 'nil';
    const percentage = (totalCalories / targetCalories) * 100;
    if (percentage < 90) return 'below';
    if (percentage > 110) return 'exceeded';
    return 'optimal';
  };

  const status = getStatus();
  const caloriePercentage = Math.min((totalCalories / targetCalories) * 100, 100);

  // Segment colors for the progress bar
  const getProgressBarSegments = () => {
    if (totalCalories === 0) return null;

    // For compact mode with data, show three macro segments
    // The segments should fill proportionally to the calorie percentage
    if (compact && totalCalories > 0) {
      return (
        <div className="flex gap-px" style={{ width: `${caloriePercentage}%` }}>
          <div className="bg-[#219EC4] h-full w-6" />
          <div className="bg-[#FFA081] h-full w-7" />
          <div className="bg-[#5FE089] h-full flex-1" />
        </div>
      );
    }

    // For expanded mode, show single filled segment for calories only
    return (
      <div className="flex w-full">
        <div
          className="bg-[#1E8754] h-full"
          style={{ width: `${caloriePercentage}%` }}
        />
      </div>
    );
  };

  return (
    <div
      className={cn(
        'bg-white flex flex-col relative',
        compact ? 'border border-l-0 border-[#DFE3E4] gap-2' : 'border-r border-[#DFE3E4]',
        className
      )}
    >
      {/* Header Section */}
      <div
        className={cn(
          'flex flex-col gap-1 w-full items-end',
          compact ? 'p-3' : 'px-3 pt-3 pb-2'
        )}
      >
        <p className="text-sm font-semibold text-[#244348] leading-[1.4] w-full">
          {day}
        </p>
        <p
          className={cn(
            'text-xs leading-[1.5] w-full',
            status === 'exceeded'
              ? 'font-semibold text-[#A36624]'
              : 'font-medium text-[#657A7E]'
          )}
        >
          {totalCalories.toLocaleString()} Cals
        </p>

        {/* Progress Bar */}
        <div className="bg-[#DFE3E4] h-[6px] rounded w-full overflow-hidden flex">
          {getProgressBarSegments()}
        </div>
      </div>

      {/* Nutrient Summary (only in expanded mode) */}
      {!compact && nutrients.length > 0 && (
        <NutrientSummary nutrients={nutrients} />
      )}
    </div>
  );
};
