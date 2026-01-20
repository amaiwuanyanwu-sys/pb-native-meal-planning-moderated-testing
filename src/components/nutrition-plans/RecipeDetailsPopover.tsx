import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from '@/components/ui/popover';
import { IngredientIcon } from '@/components/icons/IngredientIcon';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/utils';

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

export interface Recipe {
  id: number;
  title: string;
  time: string;
  ingredients: number;
  image?: string;
  description?: string;
  servings?: number;
  tags?: string[];
  ingredientsList?: Array<{
    amount: string;
    name: string;
  }>;
  nutrition?: {
    calories?: number;
    fat?: number;
    carbs?: number;
    fiber?: number;
    sugar?: number;
    protein?: number;
    cholesterol?: number;
    sodium?: number;
  };
  directions?: string[];
}

interface RecipeDetailsPopoverProps {
  recipe: Recipe;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onActionClick?: (recipe: Recipe) => void;
  actionLabel?: string;
  isActionActive?: boolean;
  children?: React.ReactNode;
  anchorElement?: HTMLElement | null;
}

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <div className="flex flex-col">
      <div className="bg-white flex h-10 items-center pl-4 pr-4 py-0 w-full">
        <span className="text-sm font-semibold text-[#385459]">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
};

export const RecipeDetailsPopover: React.FC<RecipeDetailsPopoverProps> = ({
  recipe,
  open,
  onOpenChange,
  onActionClick,
  actionLabel = 'Add',
  isActionActive = false,
  children,
  anchorElement,
}) => {

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      {children ? (
        <PopoverTrigger asChild>
          {children}
        </PopoverTrigger>
      ) : anchorElement ? (
        <PopoverAnchor virtualRef={{ current: anchorElement }} />
      ) : null}
      <PopoverContent
        className="w-[380px] p-0 overflow-y-auto max-h-[90vh] overscroll-contain"
        side="right"
        align="center"
        sideOffset={-20}
        collisionPadding={16}
      >
        <div className="relative">
          {/* Recipe Image */}
          {recipe.image && (
            <div className="w-full h-[180px] bg-[#F0F2F3] overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Top Section with Title and Action */}
          <div className="flex flex-col gap-3 px-4 py-4">
            {/* Title and Metadata */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-center w-full">
                <h3 className="flex-1 text-lg font-semibold text-[#244348] leading-[1.55]">
                  {recipe.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 items-center">
                <div className="flex gap-0.5 items-center">
                  <span className="material-icons-outlined text-[#657A7E]" style={{ fontSize: '16px' }}>
                    schedule
                  </span>
                  <span className="text-xs font-medium text-[#657A7E]">
                    {recipe.time}
                  </span>
                </div>
                <div className="flex gap-0.5 items-center">
                  <IngredientIcon className="text-[#657A7E]" />
                  <span className="text-xs font-medium text-[#657A7E]">
                    {recipe.ingredients} ingredients
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {recipe.tags && recipe.tags.filter(shouldShowTag).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {recipe.tags.filter(shouldShowTag).map((tag, index) => (
                  <Tag
                    key={index}
                    label={tag}
                    type="informational"
                    accentColor={getTagAccentColor(tag)}
                  />
                ))}
              </div>
            )}

            {/* Action Button */}
            {onActionClick && (
              <button
                onClick={() => onActionClick(recipe)}
                className={cn(
                  "border rounded flex items-center justify-center gap-1 px-4 py-2.5 h-10 transition-colors w-full",
                  isActionActive
                    ? "border-[#385459] bg-[#385459] text-white hover:bg-[#244348]"
                    : "border-[#96A5A8] bg-white text-[#385459] hover:bg-[#F0F2F3]"
                )}
              >
                <span className="material-icons text-2xl">
                  {isActionActive ? 'done' : 'add'}
                </span>
                <span className="text-sm font-semibold">
                  {isActionActive ? 'Added' : actionLabel}
                </span>
              </button>
            )}
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-1">
            {/* Ingredients Section */}
            {recipe.ingredientsList && recipe.ingredientsList.length > 0 && (
              <Section title="Ingredients">
                <div className="flex flex-col gap-1 px-1 py-2 pb-3">
                  {recipe.ingredientsList.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex gap-1 px-3 py-0 text-sm font-medium"
                    >
                      <span className="text-[#385459]">
                        {ingredient.name}
                      </span>
                      <span className="text-[#657A7E]">
                        {ingredient.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Nutrition Section */}
            {recipe.nutrition && (
              <Section title="Nutrition">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between px-4 py-0">
                    <span className="text-xs font-semibold text-[#657A7E]">
                      Amount per serving
                    </span>
                    <span className="text-xs font-semibold text-[#657A7E]">
                      % Daily Value (2000 cal diet)
                    </span>
                  </div>
                  <div className="flex flex-col overflow-clip pt-2 px-0 pb-0">
                    {Object.entries(recipe.nutrition).map(([key, value], index) => {
                      if (!value) return null;
                      const label = key.charAt(0).toUpperCase() + key.slice(1);
                      const unit = key === 'calories' ? 'cal' :
                                  key === 'sugar' || key === 'cholesterol' || key === 'sodium' || key === 'protein' ? 'mg' : 'g';

                      // Calculate % Daily Value based on FDA standards (2000 cal diet)
                      const dailyValues: Record<string, number> = {
                        calories: 2000,
                        fat: 78, // g
                        carbs: 275, // g
                        fiber: 28, // g
                        sugar: 50, // g (added sugars)
                        protein: 50, // g
                        cholesterol: 300, // mg
                        sodium: 2300, // mg
                      };

                      const dailyValue = dailyValues[key];
                      const percentage = dailyValue ? Math.round((value / dailyValue) * 100) : 0;

                      return (
                        <div
                          key={key}
                          className={cn(
                            "flex h-[30px] items-center justify-center px-1 py-0",
                            index % 2 === 0 ? "bg-white" : "bg-[#F8F9F9]"
                          )}
                        >
                          <div className="flex gap-4 items-center justify-between px-3 py-2 w-full">
                            <div className="flex gap-1 items-baseline">
                              <p className="text-sm font-semibold text-[#244348]">
                                {label}
                              </p>
                              <span className="text-xs font-semibold text-[#657A7E]">
                                {value} {unit}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1 items-end justify-center">
                              <span className="text-xs font-semibold text-[#244348] text-right">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Section>
            )}

            {/* Directions Section */}
            {recipe.directions && recipe.directions.length > 0 && (
              <Section title="Directions">
                <div className="bg-white flex flex-col gap-3 px-3 pr-4 pt-2 pb-0 text-sm font-medium text-[#244348]">
                  {recipe.directions.map((direction, index) => (
                    <div key={index} className="flex flex-col w-full">
                      <ol className="list-decimal" start={index + 1}>
                        <li className="ms-[21px]">
                          <span className="leading-[1.4]">{direction}</span>
                        </li>
                      </ol>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={() => onOpenChange?.(false)}
            className="absolute bg-white flex items-center justify-center p-2 right-[19px] rounded top-5 w-9 h-9 hover:bg-[#F0F2F3] transition-colors"
          >
            <span className="material-icons text-[20px]">close</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
