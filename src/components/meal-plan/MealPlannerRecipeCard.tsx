import React from 'react';
import { cn } from '@/lib/utils';

interface MealPlannerRecipeCardProps {
  title: string;
  sideName?: string; // e.g., "Steamed broccoli" - will be displayed as "with {sideName}"
  images?: string[];
  calories?: number;
  protein?: number;
  hasSide?: boolean;
  mainIsLeftover?: boolean;
  sideIsLeftover?: boolean;
  onMainClick?: () => void;
  onSideClick?: () => void;
  className?: string;
}

export const MealPlannerRecipeCard: React.FC<MealPlannerRecipeCardProps> = ({
  title,
  sideName,
  images = [],
  calories,
  protein,
  hasSide = false,
  mainIsLeftover = false,
  sideIsLeftover = false,
  onMainClick,
  onSideClick,
  className
}) => {
  // Show up to 2 images
  const displayImages = images.slice(0, 2);

  return (
    <div
      className={cn(
        'bg-white flex flex-col gap-2 overflow-hidden p-2',
        className
      )}
    >
      {/* Images Section */}
      <div className="relative w-full bg-white border border-[#C1C9CB] rounded-md flex gap-px overflow-hidden">
        {displayImages.length > 0 ? (
          <>
            {/* Main Image - larger, takes flex-1 */}
            <div
              className="relative flex-1 h-18 overflow-hidden cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                onMainClick?.();
              }}
            >
              <img
                src={displayImages[0]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
              {mainIsLeftover && (
                <div className="absolute bg-[#E4C57E] bottom-0 left-0 flex items-center justify-center p-1.5 rounded-tr size-6 z-10">
                  <span className="material-icons text-[#244348]" style={{ fontSize: '16px' }}>
                    kitchen
                  </span>
                </div>
              )}
            </div>

            {/* Side Image - smaller, fixed width */}
            {displayImages.length > 1 && (
              <div
                className="relative w-17.25 h-18 overflow-hidden shrink-0 cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  onSideClick?.();
                }}
              >
                <img
                  src={displayImages[1]}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                {sideIsLeftover && (
                  <div className="absolute bg-[#E4C57E] bottom-0 left-0 flex items-center justify-center p-1.5 rounded-tr size-6 z-10">
                    <span className="material-icons text-[#244348]" style={{ fontSize: '16px' }}>
                      kitchen
                    </span>
                  </div>
                )}
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
          <p className="text-xs font-semibold text-[#244348] leading-normal overflow-hidden text-ellipsis line-clamp-2">
            {title}
          </p>
          {sideName && (
            <p className="text-[10px] font-semibold text-[#1E8754] leading-normal overflow-hidden text-ellipsis whitespace-nowrap">
              with {sideName}
            </p>
          )}
        </div>

        {/* Nutrition Info */}
        {(calories !== undefined || protein !== undefined) && (
          <div className="flex gap-1 items-center">
            {calories !== undefined && (
              <>
                <span className="text-xs font-medium text-[#657A7E] leading-[1.5]">
                  {calories} cal
                </span>
                {protein !== undefined && (
                  <span className="text-xs font-medium text-[#657A7E] leading-[1.5]">•</span>
                )}
              </>
            )}
            {protein !== undefined && (
              <span className="text-xs font-medium text-[#657A7E] leading-[1.5]">
                {protein}g pro
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
