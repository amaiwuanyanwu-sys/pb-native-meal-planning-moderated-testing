import React, { useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { IngredientIcon } from '@/components/icons/IngredientIcon';
import { Button } from '@/components/ui/Button';

interface RecipeCardProps {
  title: string;
  image?: string;
  time: string;
  ingredients: number;
  onClick?: () => void;
  className?: string;
  recipeId?: number;
  draggable?: boolean;
  usageCount?: number; // Number of times this recipe is used in the meal plan
  isLeftover?: boolean; // Whether this is a leftover recipe
  leftoverPortions?: number; // Number of portions remaining for leftovers
  actionButton?: {
    label: string;
    onClick: (e: React.MouseEvent) => void;
  };
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  image,
  time,
  ingredients,
  onClick,
  className,
  recipeId,
  draggable = false,
  usageCount = 0,
  isLeftover = false,
  leftoverPortions = 0,
  actionButton
}) => {
  // Use @dnd-kit draggable hook - use "leftover-" prefix for leftovers
  const dragId = draggable && recipeId
    ? (isLeftover ? `leftover-${recipeId}` : `recipe-${recipeId}`)
    : null;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dragId || 'disabled',
    disabled: !draggable || !dragId,
  });

  // Track pointer position to detect if it's a click vs drag
  const pointerDown = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDown.current = { x: e.clientX, y: e.clientY };
    if (draggable && listeners?.onPointerDown) {
      listeners.onPointerDown(e as any);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggable && listeners?.onPointerUp) {
      listeners.onPointerUp(e as any);
    }

    // Check if pointer moved less than 8px - if so, it's a click
    if (pointerDown.current && onClick) {
      const dx = Math.abs(e.clientX - pointerDown.current.x);
      const dy = Math.abs(e.clientY - pointerDown.current.y);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 8) {
        onClick();
      }
    }

    pointerDown.current = null;
  };

  const dragListeners = draggable ? {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
  } : {};

  return (
    <div
      ref={setNodeRef}
      onClick={!draggable ? onClick : undefined}
      {...dragListeners}
      {...(draggable ? attributes : {})}
      className={cn(
        'bg-white border border-[#DFE3E4] rounded-lg flex items-start overflow-hidden cursor-pointer hover:border-[#C1C9CB] transition-all',
        draggable && 'cursor-pointer active:cursor-grabbing',
        isDragging && 'opacity-50 scale-95',
        className
      )}
    >
      {/* Image */}
      <div className="border-r border-[#DFE3E4] flex flex-col items-start min-w-[96px] w-[120px] self-stretch shrink-0 overflow-hidden">
        <div className="flex-1 flex items-start w-full min-h-0 relative">
          {image ? (
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-[#F0F2F3] flex items-center justify-center">
              <span className="material-icons text-[#96A5A8] text-2xl">restaurant</span>
            </div>
          )}
          {isLeftover && leftoverPortions > 0 && (
            <div className="absolute bg-[#E4C57E] bottom-0 left-0 flex items-center gap-1 px-2 py-1.5 rounded-tr z-10">
              <span className="material-icons text-[#244348]" style={{ fontSize: '16px' }}>
                kitchen
              </span>
              <span className="text-xs font-semibold text-[#244348] leading-[1.5]">
               {leftoverPortions} Leftover
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-3 min-w-0 self-stretch items-end">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-[#244348] leading-[1.4] overflow-hidden text-ellipsis line-clamp-2">
              {title}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center w-full" style={{ gap: '4px 4px' }}>


            {/* Time */}
            <div className="flex gap-0.5 items-center">
              <span className="material-icons-outlined text-[#657A7E]" style={{ fontSize: '16px' }}>schedule</span>
              <span className="text-xs font-medium text-[#657A7E] leading-[1.5]">
                {time}
              </span>
            </div>

            {/* Ingredients */}
            <div className="flex gap-0.5 items-center">
              <IngredientIcon className="text-[#657A7E]" />
              <span className="text-xs font-medium text-[#657A7E] leading-[1.5]">
                {ingredients} {ingredients === 1 ? 'ingredient' : 'ingredients'}
              </span>
            </div>
          </div>

          {/* Action Button */}
          {actionButton && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                actionButton.onClick(e);
              }}
              className="w-full"
            >
              {actionButton.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
