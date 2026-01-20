import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Search } from '@/components/ui/Search';
import { RecipeCard } from '@/components/meal-plan/RecipeCard';
import type { Recipe } from '@/components/nutrition-plans/RecipeDetailsPopover';

interface RecipeSelectionViewProps {
  day: number;
  mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner';
  type: 'main' | 'side';
  recipes: Recipe[];
  leftovers?: Map<number, { portions: number; serving: number }>;
  isReplacing?: boolean; // Whether we're replacing an existing recipe (swap mode)
  onClose: () => void;
  onSelectRecipe: (recipeId: number) => void;
  onRecipeClick?: (recipe: Recipe, anchorElement: HTMLElement) => void;
}

export const RecipeSelectionView: React.FC<RecipeSelectionViewProps> = ({
  day,
  type,
  recipes,
  leftovers = new Map(),
  isReplacing = false,
  onClose,
  onSelectRecipe,
  onRecipeClick,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const recipeCardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Filter recipes based on search
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Filter leftovers based on search
  const filteredLeftovers = Array.from(leftovers.entries())
    .map(([recipeId, data]) => {
      const recipe = recipes.find(r => r.id === recipeId);
      return recipe ? { recipe, portions: data.portions, serving: data.serving } : null;
    })
    .filter((item): item is { recipe: Recipe; portions: number; serving: number } =>
      item !== null && item.recipe.title.toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <aside className="bg-white flex flex-col h-screen w-80 border-l border-[#DFE3E4] shadow-[-2px_0px_4px_0px_rgba(1,39,46,0.1)]">
      {/* Header */}
      <div className="border-b border-[#C1C9CB] flex gap-2.5 h-11 items-center px-4 py-2.5">
        <button
          onClick={onClose}
          className="flex items-center justify-center p-1 -ml-1 hover:bg-[#F0F2F3] rounded transition-colors"
        >
          <span className="material-icons text-xl text-[#385459]">arrow_back</span>
        </button>
        <div className="flex-1 flex flex-col justify-center font-semibold text-sm text-[#244348] leading-[1.4]">
          {isReplacing ? `Swap ${type}` : `Select ${type}`}
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex flex-col justify-center font-semibold text-sm text-[#385459] leading-[1.4]">
            Day {day}
          </div>
          <span className="material-icons text-xl text-[#385459]">keyboard_arrow_down</span>
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-[#DFE3E4] px-4 py-3">
        <div className="flex gap-3 items-start w-full">
          <Search
            placeholder="Search recipes"
            value={searchValue}
            onChange={setSearchValue}
            variant="stretch"
          />
          <button className="bg-white border border-[#96A5A8] rounded flex items-center justify-center w-10 h-10 p-2">
            <span className="material-icons text-xl text-[#657A7E]">filter_list</span>
          </button>
        </div>
      </div>

      {/* Recipe List */}
      <div className="flex-1 flex flex-col gap-3 px-4 py-3 overflow-y-auto">
        {/* Leftovers Section */}
        {filteredLeftovers.length > 0 && (
          <>
            {filteredLeftovers.map(({ recipe, portions }) => (
              <div
                key={`leftover-${recipe.id}`}
                ref={(el) => {
                  if (el) {
                    recipeCardRefs.current.set(recipe.id, el);
                  } else {
                    recipeCardRefs.current.delete(recipe.id);
                  }
                }}
              >
                <RecipeCard
                  title={recipe.title}
                  image={recipe.image}
                  time={recipe.time}
                  ingredients={recipe.ingredients || 0}
                  onClick={() => {
                    const element = recipeCardRefs.current.get(recipe.id);
                    if (element) {
                      onRecipeClick?.(recipe, element);
                    }
                  }}
                  recipeId={recipe.id}
                  draggable={false}
                  isLeftover={true}
                  leftoverPortions={portions}
                  actionButton={{
                    label: isReplacing ? 'Swap with this' : `Add ${type}`,
                    onClick: (e) => {
                      e.stopPropagation();
                      onSelectRecipe(recipe.id);
                    }
                  }}
                />
              </div>
            ))}
          </>
        )}

        {/* Regular Recipes */}
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            ref={(el) => {
              if (el) {
                recipeCardRefs.current.set(recipe.id, el);
              } else {
                recipeCardRefs.current.delete(recipe.id);
              }
            }}
          >
            <RecipeCard
              title={recipe.title}
              image={recipe.image}
              time={recipe.time}
              ingredients={recipe.ingredients || 0}
              onClick={() => {
                const element = recipeCardRefs.current.get(recipe.id);
                if (element) {
                  onRecipeClick?.(recipe, element);
                }
              }}
              recipeId={recipe.id}
              draggable={false}
              actionButton={{
                label: isReplacing ? `Replace ${type}` : `Add ${type}`,
                onClick: (e) => {
                  e.stopPropagation();
                  onSelectRecipe(recipe.id);
                }
              }}
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-[#C1C9CB] flex gap-3 items-center justify-end px-4 py-3">
        <Button variant="primary" size="md" onClick={onClose} className="w-full">
          Done
        </Button>
      </div>
    </aside>
  );
};
