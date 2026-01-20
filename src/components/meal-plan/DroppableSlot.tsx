import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface DroppableSlotProps {
  day: number;
  mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner';
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const DroppableSlot: React.FC<DroppableSlotProps> = ({
  day,
  mealTime,
  className,
  onClick,
  isSelected = false
}) => {
  const dropId = `planner-${day}-${mealTime}`;
  const { setNodeRef, isOver } = useDroppable({
    id: dropId,
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        'bg-[#F0F2F3] hover:bg-[#F2F8FB] border-r border-[#DFE3E4] border-b border-[#DFE3E4] p-2 flex flex-col gap-1 items-center justify-center transition-colors relative cursor-pointer h-full min-h-30',
        isOver && 'bg-[#F2F8FB]',
        isSelected && 'border-2 border-dashed border-[#007CB2]',
        className
      )}
    >
      {isOver ? (
        <>
          {/* Main recipe drop zone indicator - full width */}
          <div className="absolute inset-0 border-2 border-dashed border-[#007CB2] bg-[#F2F8FB] bg-opacity-50 flex flex-col items-center justify-center gap-1 pointer-events-none">
            <span className="material-icons text-xl text-[#007CB2]">add_circle</span>
            <p className="text-xs font-medium text-[#007CB2] leading-normal">Main</p>
          </div>
        </>
      ) : (
        <>
          <span className="material-icons text-xl text-[#96A5A8]">add</span>
          <p className="text-xs font-medium text-[#96A5A8] leading-normal">Add</p>
        </>
      )}
    </div>
  );
};
