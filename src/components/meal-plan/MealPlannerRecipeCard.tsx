import React, { useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/Tooltip';

interface MealPlannerRecipeCardProps {
  title: string;
  sideName?: string; // e.g., "Steamed broccoli" - will be displayed as "with {sideName}"
  images?: string[];
  calories?: number; // Main recipe calories
  protein?: number; // Main recipe protein
  fiber?: number; // Main recipe fiber
  sideCalories?: number; // Side recipe calories
  sideProtein?: number; // Side recipe protein
  sideFiber?: number; // Side recipe fiber
  hasSide?: boolean;
  mainIsLeftover?: boolean;
  sideIsLeftover?: boolean;
  mainHasBulk?: boolean; // Whether main recipe has bulk (leftover) enabled
  sideHasBulk?: boolean; // Whether side recipe has bulk (leftover) enabled
  mainPortion?: number;
  sidePortion?: number;
  mainServing?: number; // Serving multiplier for main recipe
  sideServing?: number; // Serving multiplier for side recipe
  onMainClick?: (anchorElement: HTMLElement) => void;
  onSideClick?: (anchorElement: HTMLElement) => void;
  onMainDelete?: () => void;
  onSideDelete?: () => void;
  onMainSwap?: () => void;
  onSideSwap?: () => void;
  className?: string;
  recipeId?: number;
  day?: number;
  mealTime?: string;
  draggable?: boolean;
  isPreview?: boolean;
  isSelected?: boolean;
}

export const MealPlannerRecipeCard: React.FC<MealPlannerRecipeCardProps> = ({
  title,
  sideName,
  images = [],
  calories,
  protein,
  sideCalories,
  sideProtein,
  hasSide = false,
  mainIsLeftover = false,
  sideIsLeftover = false,
  mainHasBulk = false,
  sideHasBulk = false,
  mainPortion = 1,
  sidePortion = 1,
  mainServing = 1,
  sideServing = 1,
  onMainClick,
  onSideClick,
  onMainDelete,
  onSideDelete,
  onMainSwap,
  onSideSwap,
  className,
  day,
  mealTime,
  draggable = false,
  isPreview = false,
  isSelected = false
}) => {
  // Show up to 2 images
  const displayImages = images.slice(0, 2);

  // Use @dnd-kit draggable hook
  const dragId = draggable && day !== undefined && mealTime ? `planner-${day}-${mealTime}` : null;
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
    pointerDown.current = null;
  };

  const dragListeners = draggable ? {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
  } : {};

  return (
    <div
      ref={setNodeRef}
      {...dragListeners}
      {...(draggable ? attributes : {})}
      className={cn(
        'flex flex-col gap-2 overflow-hidden p-2 transition-all h-full',
        isPreview ? 'bg-[#CFF6DC]' : isSelected ? 'bg-[#F2F8FB]' : 'bg-white hover:bg-[#F2F8FB]',
        draggable && 'cursor-pointer active:cursor-grabbing',
        isDragging && 'opacity-50 scale-95',
        className
      )}
      style={{
        ...(isSelected && {
          outline: '2px dashed #007CB2',
          outlineOffset: '-2px'
        })
      }}
    >
      {/* Images Section */}
      <div
        className="relative w-full bg-white border border-[#C1C9CB] rounded-md flex gap-px overflow-hidden"
      >
        {displayImages.length > 0 ? (
          <>
            {/* Main Image */}
            <div className="relative flex-1 h-18 overflow-hidden group">
              <img
                src={displayImages[0]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              {mainIsLeftover && (
                <div className="absolute bg-[#E4C57E] bottom-0 left-0 flex items-center justify-center p-1.5 rounded-tr size-6 z-5">
                  <span className="material-icons text-[#244348]" style={{ fontSize: '16px' }}>
                    kitchen
                  </span>
                </div>
              )}
              {!mainIsLeftover && mainHasBulk && mainPortion > 1 && (
                <div className="absolute bg-[#E4C2F0] bottom-0 left-0 flex items-center gap-0.5 px-1.5 py-1 rounded-tr z-5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8H21V17C21 17.8333 20.7083 18.5417 20.125 19.125C19.5417 19.7083 18.8333 20 18 20H6C5.16667 20 4.45833 19.7083 3.875 19.125C3.29167 18.5417 3 17.8333 3 17V8ZM5 10V17C5 17.2833 5.09583 17.5208 5.2875 17.7125C5.47917 17.9042 5.71667 18 6 18H18C18.2833 18 18.5208 17.9042 18.7125 17.7125C18.9042 17.5208 19 17.2833 19 17V10H5ZM3 7V5H9V4C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4V5H21V7H3Z" fill="#244348"/>
                  </svg>
                  <span className="text-xs font-semibold text-[#244348] leading-none">×{mainPortion}</span>
                </div>
              )}
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-5 flex gap-1">
                {onMainClick && (
                  <Tooltip content="View recipe" position="top">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMainClick(e.currentTarget);
                      }}
                      className="bg-white rounded flex items-center justify-center size-5 hover:bg-[#F0F2F3]"
                    >
                      <span className="material-icons-outlined text-[#385459]" style={{ fontSize: '16px' }}>
                        info
                      </span>
                    </button>
                  </Tooltip>
                )}
                {onMainSwap && (
                  <Tooltip content="Swap recipe" position="top">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMainSwap();
                      }}
                      className="bg-white rounded flex items-center justify-center size-5 hover:bg-[#F0F2F3]"
                    >
                      <span className="material-icons text-[#385459]" style={{ fontSize: '16px' }}>
                        compare_arrows
                      </span>
                    </button>
                  </Tooltip>
                )}
                {onMainDelete && (
                  <Tooltip content="Delete main" position="top">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMainDelete();
                      }}
                      className="bg-white rounded flex items-center justify-center size-5 hover:bg-[#F0F2F3]"
                    >
                      <span className="material-icons text-[#385459]" style={{ fontSize: '16px' }}>
                        close
                      </span>
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Side Image */}
            {displayImages.length > 1 && (
              <div className="relative flex-1 h-18 overflow-hidden group">
                <img
                  src={displayImages[1]}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {sideIsLeftover && (
                  <div className="absolute bg-[#E4C57E] bottom-0 left-0 flex items-center justify-center p-1.5 rounded-tr size-6 z-5">
                    <span className="material-icons text-[#244348]" style={{ fontSize: '16px' }}>
                      kitchen
                    </span>
                  </div>
                )}
                {!sideIsLeftover && sideHasBulk && sidePortion > 1 && (
                  <div className="absolute bg-[#E4C2F0] bottom-0 left-0 flex items-center gap-0.5 px-1.5 py-1 rounded-tr z-5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8H21V17C21 17.8333 20.7083 18.5417 20.125 19.125C19.5417 19.7083 18.8333 20 18 20H6C5.16667 20 4.45833 19.7083 3.875 19.125C3.29167 18.5417 3 17.8333 3 17V8ZM5 10V17C5 17.2833 5.09583 17.5208 5.2875 17.7125C5.47917 17.9042 5.71667 18 6 18H18C18.2833 18 18.5208 17.9042 18.7125 17.7125C18.9042 17.5208 19 17.2833 19 17V10H5ZM3 7V5H9V4C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4V5H21V7H3Z" fill="#244348"/>
                    </svg>
                    <span className="text-xs font-semibold text-[#244348] leading-none">×{sidePortion}</span>
                  </div>
                )}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-5 flex gap-1">
                  {onSideClick && (
                    <Tooltip content="View details" position="top">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSideClick(e.currentTarget);
                        }}
                        className="bg-white rounded flex items-center justify-center size-5 hover:bg-[#F0F2F3]"
                      >
                        <span className="material-icons-outlined text-[#385459]" style={{ fontSize: '16px' }}>
                          info
                        </span>
                      </button>
                    </Tooltip>
                  )}
                  {onSideSwap && (
                    <Tooltip content="Swap recipe" position="top">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSideSwap();
                        }}
                        className="bg-white rounded flex items-center justify-center size-5 hover:bg-[#F0F2F3]"
                      >
                        <span className="material-icons text-[#385459]" style={{ fontSize: '16px' }}>
                          compare_arrows
                        </span>
                      </button>
                    </Tooltip>
                  )}
                  {onSideDelete && (
                    <Tooltip content="Delete side" position="top">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSideDelete();
                        }}
                        className="bg-white rounded flex items-center justify-center size-5 hover:bg-[#F0F2F3]"
                      >
                        <span className="material-icons text-[#385459]" style={{ fontSize: '16px' }}>
                          close
                        </span>
                      </button>
                    </Tooltip>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-18 bg-[#F0F2F3] flex items-center justify-center">
            <span className="material-icons text-[#96A5A8] text-[40px]">restaurant</span>
          </div>
        )}

        {/* Icons Overlay */}
        {(hasSide) && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {hasSide && (
              <div className="w-6 h-6 bg-[#FFF5E6] border border-[#E5A839] rounded flex items-center justify-center">
                <span className="material-icons text-[#E5A839]" style={{ fontSize: '16px' }}>
                  swap_horiz
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-0.5">
        {/* Title and Side Name */}
        <div className="flex flex-col gap-0.5">
          <p className={cn(
            "text-xs font-semibold text-[#244348] leading-normal overflow-hidden text-ellipsis",
            sideName ? "line-clamp-1" : "line-clamp-2"
          )}>
            {title}
          </p>
          {sideName && (
            <p className="text-[10px] font-semibold text-[#1E8754] leading-normal overflow-hidden text-ellipsis whitespace-nowrap">
              with {sideName}
            </p>
          )}
        </div>

        {/* Nutrition Info */}
        {(calories !== undefined || protein !== undefined || sideCalories !== undefined || sideProtein !== undefined) && (
          <div className="flex gap-1 items-center">
            {(calories !== undefined || sideCalories !== undefined) && (
              <>
                <span className="text-xs font-medium text-[#657A7E] leading-[1.5]">
                  {Math.round(
                    (calories || 0) * mainServing +
                    (sideCalories || 0) * sideServing
                  )} cal
                </span>
                {(protein !== undefined || sideProtein !== undefined) && (
                  <span className="text-xs font-medium text-[#657A7E] leading-[1.5]">•</span>
                )}
              </>
            )}
            {(protein !== undefined || sideProtein !== undefined) && (
              <span className="text-xs font-medium text-[#657A7E] leading-[1.5]">
                {Math.round(
                  (protein || 0) * mainServing +
                  (sideProtein || 0) * sideServing
                )}g pro
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
