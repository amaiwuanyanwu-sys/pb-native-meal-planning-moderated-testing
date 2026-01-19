import React from 'react';
import { cn } from '@/lib/utils';
import { IngredientIcon } from '@/components/icons/IngredientIcon';

interface RecipeCardProps {
  title: string;
  image?: string;
  time: string;
  ingredients: number;
  onClick?: () => void;
  className?: string;
  recipeId?: number;
  draggable?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  image,
  time,
  ingredients,
  onClick,
  className,
  recipeId,
  draggable = false
}) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (draggable && recipeId) {
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('application/json', JSON.stringify({
        recipeId,
        title,
        image
      }));
      setIsDragging(true);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      onClick={onClick}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        'bg-white border border-[#DFE3E4] rounded-lg flex items-start overflow-hidden cursor-pointer hover:border-[#C1C9CB] transition-all',
        draggable && 'cursor-grab active:cursor-grabbing',
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
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-3 min-w-0 self-stretch items-end">
        <div className="flex flex-col gap-1 w-full">
          <p className="text-sm font-semibold text-[#244348] leading-[1.4] overflow-hidden text-ellipsis line-clamp-2">
            {title}
          </p>

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
        </div>
      </div>
    </div>
  );
};
