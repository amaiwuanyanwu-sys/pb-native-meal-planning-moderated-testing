import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface DroppableSlotProps {
  day: number;
  mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner';
  onDrop: (day: number, mealTime: string, recipeId: number) => void;
  className?: string;
}

export const DroppableSlot: React.FC<DroppableSlotProps> = ({
  day,
  mealTime,
  onDrop,
  className
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
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
        onDrop(day, mealTime, data.recipeId);
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
        'bg-[#F0F2F3] border-r border-[#DFE3E4] border-b border-[#DFE3E4] p-3 flex flex-col gap-1 items-center justify-center transition-colors',
        isDragOver && 'bg-[#E6F7FF] border-[#34B9E0] border-2',
        className
      )}
    >
      {isDragOver ? (
        <>
          <span className="material-icons text-xl text-[#34B9E0]">add_circle</span>
          <p className="text-xs font-medium text-[#34B9E0] leading-[1.5]">Drop here</p>
        </>
      ) : (
        <>
          <span className="material-icons text-xl text-[#96A5A8]">add</span>
          <p className="text-xs font-medium text-[#96A5A8] leading-[1.5]">Add</p>
        </>
      )}
    </div>
  );
};
