import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { IngredientIcon } from '@/components/icons/IngredientIcon';
import { DirectionsIcon } from '@/components/icons/DirectionsIcon';
import { cn } from '@/lib/utils';

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
}

const AccordionSection: React.FC<{
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ title, icon, children, isExpanded, onToggle }) => {
  return (
    <div className="flex flex-col">
      <button
        onClick={onToggle}
        className="bg-white flex h-10 items-center justify-between pl-4 pr-0 py-0 w-full hover:bg-[#F8F9F9] transition-colors"
      >
        <div className="flex gap-2 items-center">
          {icon}
          <span className="text-sm font-semibold text-[#385459]">
            {title}
          </span>
        </div>
        <div className="flex items-center justify-end">
          <div className="flex items-center justify-center p-2 rounded w-10">
            <span
              className={cn(
                "material-icons-outlined text-2xl text-[#657A7E] transition-transform",
                isExpanded ? "" : "rotate-180"
              )}
            >
              keyboard_arrow_up
            </span>
          </div>
        </div>
      </button>
      {isExpanded && children}
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
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('ingredients');

  const toggleSection = (sectionId: string) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-[380px] p-0 overflow-y-auto max-h-[90vh] overscroll-contain"
        side="right"
        align="start"
        sideOffset={8}
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
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#CFF6DC] text-[#244348] text-xs font-medium px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
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

          {/* Accordion Sections */}
          <div className="flex flex-col gap-1">
            {/* Ingredients Section */}
            {recipe.ingredientsList && recipe.ingredientsList.length > 0 && (
              <AccordionSection
                id="ingredients"
                title="Ingredients"
                icon={
                  <div className="w-6 h-6 flex items-center justify-center">
                    <IngredientIcon className="text-[#657A7E] w-6 h-6" />
                  </div>
                }
                isExpanded={expandedSection === 'ingredients'}
                onToggle={() => toggleSection('ingredients')}
              >
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
              </AccordionSection>
            )}

            {/* Nutrition Section */}
            {recipe.nutrition && (
              <AccordionSection
                id="nutrition"
                title="Nutrition"
                icon={
                  <span className="material-icons-outlined text-2xl text-[#657A7E]">
                    receipt
                  </span>
                }
                isExpanded={expandedSection === 'nutrition'}
                onToggle={() => toggleSection('nutrition')}
              >
                <div className="flex flex-col">
                  <div className="flex flex-col gap-1 items-end px-4 py-0">
                    <span className="text-xs font-semibold text-[#657A7E] text-right">
                      Amount per serving
                    </span>
                  </div>
                  <div className="flex flex-col overflow-clip pt-2 px-0 pb-0">
                    {Object.entries(recipe.nutrition).map(([key, value], index) => {
                      if (!value) return null;
                      const label = key.charAt(0).toUpperCase() + key.slice(1);
                      const unit = key === 'calories' ? 'cal' :
                                  key === 'sugar' || key === 'cholesterol' || key === 'sodium' || key === 'protein' ? 'mg' : 'g';

                      return (
                        <div
                          key={key}
                          className={cn(
                            "flex h-[30px] items-center justify-center px-1 py-0",
                            index % 2 === 0 ? "bg-white" : "bg-[#F8F9F9]"
                          )}
                        >
                          <div className="flex gap-4 items-center px-3 py-2 w-full">
                            <div className="flex-1 flex flex-col gap-1 items-start">
                              <p className="text-sm font-semibold text-[#244348]">
                                {label}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1 items-end justify-center">
                              <span className="text-xs font-semibold text-[#657A7E] text-right">
                                {value} {unit}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AccordionSection>
            )}

            {/* Directions Section */}
            {recipe.directions && recipe.directions.length > 0 && (
              <AccordionSection
                id="directions"
                title="Directions"
                icon={
                  <div className="w-6 h-6 flex items-center justify-center">
                    <DirectionsIcon className="text-[#657A7E]" />
                  </div>
                }
                isExpanded={expandedSection === 'directions'}
                onToggle={() => toggleSection('directions')}
              >
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
              </AccordionSection>
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
