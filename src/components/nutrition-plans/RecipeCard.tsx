import React from 'react';
import { IngredientIcon } from '@/components/icons/IngredientIcon';

export interface RecipeCardProps {
  recipe: {
    id: number;
    title: string;
    image?: string;
    time: string;
    ingredients: number;
  };
  isSelected?: boolean;
  onToggle?: (recipeId: number) => void;
  className?: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isSelected = false,
  onToggle,
  className = ''
}) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggle) {
      onToggle(recipe.id);
    }
  };

  return (
    <div className={`bg-white border border-[#DFE3E4] rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow ${className}`}>
      {/* Recipe Image */}
      <div className="w-full h-32 bg-[#F0F2F3] border-b border-[#DFE3E4] overflow-hidden">
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Recipe Content */}
      <div className="p-3 flex flex-col gap-2">
        {/* Content Area - Title and Metadata */}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-[#244348] leading-[1.4] line-clamp-2">
            {recipe.title}
          </p>
          <div className="flex flex-wrap gap-x-2 gap-y-1 items-center">
            <div className="flex gap-0.5 items-center">
              <span className="material-icons-outlined text-[#657A7E]" style={{ fontSize: '16px' }}>schedule</span>
              <span className="text-xs font-medium text-[#657A7E] leading-normal">
                {recipe.time}
              </span>
            </div>
            <div className="flex gap-0.5 items-center">
              <IngredientIcon className="text-[#657A7E]" />
              <span className="text-xs font-medium text-[#657A7E] leading-normal">
                {recipe.ingredients} ingredients
              </span>
            </div>
          </div>
        </div>
        {/* Action Area - Button */}
        {onToggle && (
          <button
            onClick={handleButtonClick}
            className={`border rounded flex items-center justify-center gap-1 px-2 pr-3.5 py-1.5 transition-colors ${
              isSelected
                ? 'border-[#385459] bg-[#385459] text-white'
                : 'border-[#96A5A8] bg-white hover:bg-[#F0F2F3]'
            }`}
          >
            <span className={`material-icons text-xl ${
              isSelected ? 'text-white' : 'text-[#385459]'
            }`}>
              {isSelected ? 'done' : 'add'}
            </span>
            <span className={`text-sm font-semibold leading-[1.4] ${
              isSelected ? 'text-white' : 'text-[#385459]'
            }`}>
              {isSelected ? 'Added' : 'Add'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
