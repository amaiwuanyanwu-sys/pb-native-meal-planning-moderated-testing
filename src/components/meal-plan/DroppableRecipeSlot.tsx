import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface DroppableRecipeSlotProps {
  day: number;
  mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner';
  children: React.ReactNode;
  className?: string;
  activeId?: string | null;
  onClick?: () => void;
}

export const DroppableRecipeSlot: React.FC<DroppableRecipeSlotProps> = ({
  day,
  mealTime,
  children,
  className,
  activeId,
  onClick
}) => {
  const dropId = `planner-${day}-${mealTime}`;
  const { setNodeRef, isOver } = useDroppable({
    id: dropId,
  });

  // Check if we're dragging from planner (swap) or recipe list (add as side)
  const isDraggingFromPlanner = activeId?.startsWith('planner-');
  const showSwapIndicator = isDraggingFromPlanner && isOver;
  const showSideIndicator = !isDraggingFromPlanner && isOver;

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        'bg-white border-r border-[#DFE3E4] border-b border-[#DFE3E4] transition-all relative cursor-pointer h-full min-h-30',
        isOver && 'ring-2 ring-[#007CB2] ring-inset',
        className
      )}
    >
      {children}

      {/* Swap indicator - full card highlight when dragging from planner */}
      {showSwapIndicator && (
        <div className="absolute inset-0 border-2 border-dashed border-[#007CB2] bg-[#F2F8FB] bg-opacity-50 flex items-center justify-center z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-1">
            <span className="material-icons text-xl text-[#007CB2]">swap_horiz</span>
            <p className="text-xs font-medium text-[#007CB2] leading-[1.5]">Swap</p>
          </div>
        </div>
      )}

      {/* Side dish drop zone indicator - small area when dragging from recipe list */}
      {showSideIndicator && (
        <div className="absolute top-2 right-2 w-17.25 h-18 border-2 border-dashed border-[#007CB2] rounded-md bg-[#F2F8FB] bg-opacity-50 flex items-center justify-center z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-1">
            <span className="material-icons text-xl text-[#007CB2]">add_circle</span>
            <p className="text-xs font-medium text-[#007CB2] leading-[1.5]">Side</p>
          </div>
        </div>
      )}
    </div>
  );
};
