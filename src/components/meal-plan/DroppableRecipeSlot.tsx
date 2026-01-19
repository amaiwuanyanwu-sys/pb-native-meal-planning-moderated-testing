import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface DroppableRecipeSlotProps {
  day: number;
  mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner';
  onDrop: (day: number, mealTime: string, recipeId: number, sourceDay?: number, sourceMealTime?: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const DroppableRecipeSlot: React.FC<DroppableRecipeSlotProps> = ({
  day,
  mealTime,
  onDrop,
  children,
  className
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.recipeId) {
        // Check if it's from the planner (has source location) or from the recipe list
        if (data.isFromPlanner && data.sourceDay !== undefined && data.sourceMealTime) {
          onDrop(day, mealTime, data.recipeId, data.sourceDay, data.sourceMealTime);
        } else {
          onDrop(day, mealTime, data.recipeId);
        }
      }
    } catch (error) {
      console.error('Failed to parse drop data:', error);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'bg-white border-r border-[#DFE3E4] border-b border-[#DFE3E4] transition-all',
        isDragOver && 'ring-2 ring-[#34B9E0] ring-inset',
        className
      )}
    >
      {children}
    </div>
  );
};
