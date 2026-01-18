import React from 'react';
import { IngredientIcon } from '@/components/icons/IngredientIcon';
import { Tag } from '@/components/ui/Tag';

export interface RecipeCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  recipe: {
    id: number;
    title: string;
    image?: string;
    time: string;
    ingredients: number;
    calories?: number;
    tags?: string[];
  };
  isSelected?: boolean;
  onToggle?: (recipeId: number) => void;
  showCalories?: boolean;
  className?: string;
}

// Helper function to determine accent color based on tag type
const getTagAccentColor = (tag: string): 'spring' | 'lake' | 'creamsicle' | 'default' => {
  const lowerTag = tag.toLowerCase();

  // Check for high/low tags first (use creamsicle)
  if (lowerTag.includes('high') || lowerTag.includes('low')) {
    return 'creamsicle';
  }

  // Dietary tags (use spring)
  const dietaryTags = [
    'vegan', 'vegetarian', 'pescetarian', 'gluten-free',
    'anti-inflammatory', 'ketogenic', 'paleo', 'mediterranean',
    'anti-candida', 'auto-immune', 'elimination', 'fodmap'
  ];

  // Effort/convenience tags (use lake)
  const effortTags = [
    'quick & easy', 'quick and easy', 'one-pan', 'meal prep',
    'baked', 'grilled'
  ];

  if (dietaryTags.some(dietary => lowerTag.includes(dietary))) {
    return 'spring';
  }

  if (effortTags.some(effort => lowerTag.includes(effort))) {
    return 'lake';
  }

  return 'default';
};

// Helper function to filter out meal time and cuisine tags
const shouldShowTag = (tag: string): boolean => {
  const lowerTag = tag.toLowerCase();
  const excludedTags = [
    // Meal time tags
    'breakfast', 'lunch', 'dinner', 'snack', 'snacks', 'dessert',
    'appetizer', 'side', 'side dish', 'beverage', 'drink',
    // Cuisine/food type tags
    'italian', 'pasta', 'mexican', 'chinese', 'japanese', 'thai', 'indian',
    'american', 'french', 'greek', 'spanish', 'korean', 'vietnamese',
    'mediterranean', 'asian', 'european', 'latin', 'middle eastern',
    'pizza', 'sandwich', 'salad', 'soup', 'stew', 'curry', 'stir-fry',
    'casserole', 'bowl', 'wrap', 'taco', 'burger', 'noodles', 'rice'
  ];
  // Check if tag contains any excluded words
  return !excludedTags.some(excluded => lowerTag === excluded || lowerTag.includes(excluded));
};

export const RecipeCard = React.forwardRef<HTMLDivElement, RecipeCardProps>(({
  recipe,
  isSelected = false,
  onToggle,
  showCalories = false,
  className = '',
  ...props
}, ref) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggle) {
      onToggle(recipe.id);
    }
  };

  // Filter tags to show only relevant ones
  const visibleTags = recipe.tags?.filter(shouldShowTag).slice(0, 2) || [];

  return (
    <div
      ref={ref}
      className={`bg-white border border-[#DFE3E4] rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow ${className}`}
      role="button"
      tabIndex={0}
      {...props}
    >
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
      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Content Area - Title and Metadata */}
        <div className="flex flex-col gap-1 flex-1">
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
            {showCalories && recipe.calories !== undefined && (
              <div className="flex gap-0.5 items-center">
                <span className="material-icons-outlined text-[#657A7E]" style={{ fontSize: '16px' }}>local_fire_department</span>
                <span className="text-xs font-medium text-[#657A7E] leading-normal">
                  {recipe.calories} cal
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {visibleTags.map((tag, index) => (
                <Tag
                  key={index}
                  label={tag}
                  type="informational"
                  accentColor={getTagAccentColor(tag)}
                />
              ))}
            </div>
          )}
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
});

RecipeCard.displayName = 'RecipeCard';
