import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Tag } from '@/components/ui/Tag';
import type { Recipe } from '@/components/nutrition-plans/RecipeDetailsPopover';

interface CellDetailViewProps {
  day: number;
  mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner';
  mainRecipe?: Recipe | null;
  sideRecipe?: Recipe | null;
  mainIsLeftover?: boolean;
  sideIsLeftover?: boolean;
  mainIsFromLeftover?: boolean; // Whether main recipe was added from leftover list
  sideIsFromLeftover?: boolean; // Whether side recipe was added from leftover list
  mainPortion?: number;
  sidePortion?: number;
  mainServing?: number;
  sideServing?: number;
  onClose: () => void;
  onAddMain?: () => void;
  onAddSide?: () => void;
  onRemoveMain?: () => void;
  onRemoveSide?: () => void;
  onSwapMain?: () => void;
  onSwapSide?: () => void;
  onMainImageClick?: (anchorElement: HTMLElement) => void;
  onSideImageClick?: (anchorElement: HTMLElement) => void;
  onMainLeftoverChange?: (isLeftover: boolean) => void;
  onSideLeftoverChange?: (isLeftover: boolean) => void;
  onMainPortionChange?: (portion: number) => void;
  onSidePortionChange?: (portion: number) => void;
  onMainServingChange?: (serving: number) => void;
  onSideServingChange?: (serving: number) => void;
}

const getMealTimeLabel = (mealTime: string) => {
  return mealTime.charAt(0).toUpperCase() + mealTime.slice(1);
};

export const CellDetailView: React.FC<CellDetailViewProps> = ({
  day,
  mealTime,
  mainRecipe,
  sideRecipe,
  mainIsLeftover: initialMainIsLeftover = false,
  sideIsLeftover: initialSideIsLeftover = false,
  mainIsFromLeftover = false,
  sideIsFromLeftover = false,
  mainPortion: initialMainPortion = 1,
  sidePortion: initialSidePortion = 1,
  mainServing: initialMainServing = 1,
  sideServing: initialSideServing = 1,
  onClose,
  onAddMain,
  onAddSide,
  onRemoveMain,
  onRemoveSide,
  onSwapMain,
  onSwapSide,
  onMainImageClick,
  onSideImageClick,
  onMainLeftoverChange,
  onSideLeftoverChange,
  onMainPortionChange,
  onSidePortionChange,
  onMainServingChange,
  onSideServingChange,
}) => {
  const [mainServing, setMainServing] = useState(initialMainServing);
  const [mainPortion, setMainPortion] = useState(initialMainPortion);
  const [mainIsLeftover, setMainIsLeftover] = useState(initialMainIsLeftover);

  const [sideServing, setSideServing] = useState(initialSideServing);
  const [sidePortion, setSidePortion] = useState(initialSidePortion);
  const [sideIsLeftover, setSideIsLeftover] = useState(initialSideIsLeftover);

  // Track whether the component has just mounted to avoid auto-enabling on initial load
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Sync local state with props when they change (e.g., when switching between different cells)
  React.useEffect(() => {
    setMainServing(initialMainServing);
    setMainPortion(initialMainPortion);
    setMainIsLeftover(initialMainIsLeftover);
    setSideServing(initialSideServing);
    setSidePortion(initialSidePortion);
    setSideIsLeftover(initialSideIsLeftover);
    // Mark as initial mount when props change (switching cells)
    setIsInitialMount(true);
  }, [initialMainServing, initialMainPortion, initialMainIsLeftover, initialSideServing, initialSidePortion, initialSideIsLeftover]);

  // Clear initial mount flag after first render
  React.useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
    }
  }, [isInitialMount]);

  // Auto-enable "Has leftover" when portion > 1, but only when user changes portion (not on mount/cell switch)
  React.useEffect(() => {
    if (!isInitialMount && mainPortion > 1 && !mainIsFromLeftover && !mainIsLeftover) {
      setMainIsLeftover(true);
      onMainLeftoverChange?.(true);
    }
  }, [mainPortion, mainIsFromLeftover, isInitialMount, mainIsLeftover, onMainLeftoverChange]);

  React.useEffect(() => {
    if (!isInitialMount && sidePortion > 1 && !sideIsFromLeftover && !sideIsLeftover) {
      setSideIsLeftover(true);
      onSideLeftoverChange?.(true);
    }
  }, [sidePortion, sideIsFromLeftover, isInitialMount, sideIsLeftover, onSideLeftoverChange]);

  const formatNutrition = (recipe: Recipe, serving: number) => {
    const parts = [];
    if (recipe.nutrition?.calories) parts.push(`Calories ${Math.round(recipe.nutrition.calories * serving)}`);
    if (recipe.nutrition?.fat) parts.push(`Fat ${Math.round(recipe.nutrition.fat * serving)}g`);
    if (recipe.nutrition?.carbs) parts.push(`Carbs ${Math.round(recipe.nutrition.carbs * serving)}g`);
    if (recipe.nutrition?.protein) parts.push(`Protein ${Math.round(recipe.nutrition.protein * serving)}g`);
    return parts.join(' · ');
  };

  const getDynamicTags = (recipe: Recipe, serving: number) => {
    const tags: string[] = [];
    const adjustedProtein = (recipe.nutrition?.protein || 0) * serving;
    const adjustedFiber = (recipe.nutrition?.fiber || 0) * serving;
    const adjustedCalories = (recipe.nutrition?.calories || 0) * serving;

    // High protein: 30g or more
    if (adjustedProtein >= 30) {
      tags.push('High protein');
    }

    // High fiber: 10g or more
    if (adjustedFiber >= 10) {
      tags.push('High fiber');
    }

    // High calorie: 600 or more
    if (adjustedCalories >= 600) {
      tags.push('High calorie');
    }

    return tags;
  };

  return (
    <aside className="bg-white flex flex-col h-screen w-80 border-l border-[#DFE3E4] shadow-[-2px_0px_4px_0px_rgba(1,39,46,0.1)]">
      {/* Header */}
      <div className="border-b border-[#C1C9CB] flex gap-2.5 h-11 items-center px-4 py-2.5 shrink-0">
        <button
          onClick={onClose}
          className="flex items-center justify-center p-1 -ml-1 hover:bg-[#F0F2F3] rounded transition-colors"
        >
          <span className="material-icons text-xl text-[#385459]">arrow_back</span>
        </button>
        <div className="flex-1 flex flex-col justify-center font-semibold text-sm text-[#244348] leading-[1.4]">
          Day {day} {getMealTimeLabel(mealTime)}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col gap-3 px-4 py-3 overflow-y-auto min-h-0">
        {/* Main Section */}
        <div className="flex flex-col justify-center font-semibold text-sm text-[#244348] leading-[1.4]">
          Main
        </div>

        {mainRecipe ? (
          <div className="bg-white border border-[#DFE3E4] rounded-lg overflow-hidden cursor-pointer group/card">
            {/* Recipe Image */}
            <div
              className="h-[135px] w-full border-b border-[#DFE3E4] relative overflow-visible"
              onClick={(e) => {
                // Only trigger if not clicking on a button
                if (!(e.target as HTMLElement).closest('button')) {
                  onMainImageClick?.(e.currentTarget);
                }
              }}
            >
              <img
                src={mainRecipe.image}
                alt={mainRecipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover/card:opacity-20 transition-opacity" />
              {mainIsFromLeftover && (
                <div className="absolute bg-[#E4C57E] bottom-0 left-0 flex items-center gap-1 px-2 py-1.5 rounded-tr z-10">
                  <span className="material-icons text-[#244348]" style={{ fontSize: '16px' }}>
                    kitchen
                  </span>
                  <span className="text-xs font-semibold text-[#244348] leading-[1.5]">
                    Leftover
                  </span>
                </div>
              )}
              {!mainIsFromLeftover && mainIsLeftover && mainPortion > 1 && (
                <div className="absolute bg-[#E4C2F0] bottom-0 left-0 flex items-center gap-1 px-2 py-1.5 rounded-tr z-10">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8H21V17C21 17.8333 20.7083 18.5417 20.125 19.125C19.5417 19.7083 18.8333 20 18 20H6C5.16667 20 4.45833 19.7083 3.875 19.125C3.29167 18.5417 3 17.8333 3 17V8ZM5 10V17C5 17.2833 5.09583 17.5208 5.2875 17.7125C5.47917 17.9042 5.71667 18 6 18H18C18.2833 18 18.5208 17.9042 18.7125 17.7125C18.9042 17.5208 19 17.2833 19 17V10H5ZM3 7V5H9V4C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4V5H21V7H3Z" fill="#244348"/>
                  </svg>
                  <span className="text-xs font-semibold text-[#244348] leading-[1.5]">
                    Bulk ({mainPortion} {mainPortion === 1 ? 'portion' : 'portions'})
                  </span>
                </div>
              )}
              <div className="absolute top-[15px] right-[15px] flex gap-1.5">
                <IconButton
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwapMain?.();
                  }}
                  icon={<span className="material-icons text-xl text-[#385459]">compare_arrows</span>}
                  className="bg-white"
                  tooltip='Swap recipe'
                  tooltipPosition='bottom'
                />
                <IconButton
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveMain?.();
                  }}
                  icon={
                    <span className="material-icons text-[#385459]" style={{ fontSize: '20px' }}>
                      delete_outline
                    </span>
                  }
                  className="bg-white"
                  tooltip='Remove recipe'
                  tooltipPosition='bottom'
                />
              </div>
            </div>

            {/* Recipe Details */}
            <div
              className="flex flex-col gap-3 p-4 cursor-pointer"
              onClick={(e) => {
                // Only trigger if not clicking on a button or interactive element or serving/portion controls
                const target = e.target as HTMLElement;

                // Check if clicking on a button or input
                if (target.closest('button, input, select')) {
                  return;
                }

                // Check if clicking within serving/portion controls by checking for the background color class
                let element: HTMLElement | null = target;
                while (element && element !== e.currentTarget) {
                  if (element.classList.contains('bg-[#F0F2F3]')) {
                    return;
                  }
                  element = element.parentElement;
                }

                onMainImageClick?.(e.currentTarget);
              }}
            >
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-base text-[#244348] leading-[1.5] line-clamp-2">
                  {mainRecipe.title}
                </p>
                <p className="font-medium text-xs text-[#657A7E] leading-[1.5]">
                  {formatNutrition(mainRecipe, mainServing)}
                </p>
                {/* Dynamic Tags */}
                {getDynamicTags(mainRecipe, mainServing).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {getDynamicTags(mainRecipe, mainServing).map((tag) => (
                      <Tag
                        key={tag}
                        label={tag}
                        type="informational"
                        accentColor="creamsicle"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Serving and Portion Controls */}
              <div className="flex gap-3">
                {/* Serving */}
                <div className="flex-1 flex flex-col gap-1 pt-1.5 relative">
                  <div className="relative">
                    <div className="rounded flex gap-1 h-10 items-center justify-center bg-[#F0F2F3] px-1 py-1">
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!mainIsFromLeftover) {
                            const newServing = Math.max(1, mainServing - 1);
                            setMainServing(newServing);
                            onMainServingChange?.(newServing);
                          }
                        }}
                        disabled={mainIsFromLeftover}
                        icon={<span className="material-icons text-xl">remove</span>}
                      />
                      <div className={cn(
                        "flex-1 flex flex-col justify-center font-medium text-sm leading-[1.4] text-center",
                        mainIsFromLeftover ? "text-[#96A5A8]" : "text-[#244348]"
                      )}>
                        {mainServing}
                      </div>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!mainIsFromLeftover) {
                            const newServing = mainServing + 1;
                            setMainServing(newServing);
                            onMainServingChange?.(newServing);
                          }
                        }}
                        disabled={mainIsFromLeftover}
                        icon={<span className="material-icons text-xl">add</span>}
                      />
                    </div>
                    <div className="absolute left-0 px-2 -top-1.5 h-3 flex items-center pointer-events-none">
                      <div className="bg-[#F0F2F3] px-1 h-3 flex items-center">
                        <p className="text-xs font-semibold text-[#385459] leading-none">
                          Serving
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Portion */}
                <div className="flex-1 flex flex-col gap-1 pt-1.5 relative">
                  <div className="relative">
                    <div className="rounded flex gap-1 h-10 items-center justify-center bg-[#F0F2F3] px-1 py-1">
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!mainIsFromLeftover) {
                            const newPortion = Math.max(1, mainPortion - 1);
                            setMainPortion(newPortion);
                            onMainPortionChange?.(newPortion);
                          }
                        }}
                        disabled={mainIsFromLeftover}
                        icon={<span className="material-icons text-xl">remove</span>}
                      />
                      <div className={cn(
                        "flex-1 flex flex-col justify-center font-medium text-sm leading-[1.4] text-center",
                        mainIsFromLeftover ? "text-[#96A5A8]" : "text-[#244348]"
                      )}>
                        {mainPortion}
                      </div>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!mainIsFromLeftover) {
                            const newPortion = mainPortion + 1;
                            setMainPortion(newPortion);
                            onMainPortionChange?.(newPortion);
                          }
                        }}
                        disabled={mainIsFromLeftover}
                        icon={<span className="material-icons text-xl">add</span>}
                      />
                    </div>
                    <div className="absolute left-0 px-2 -top-1.5 h-3 flex items-center pointer-events-none">
                      <div className="bg-[#F0F2F3] px-1 h-3 flex items-center">
                        <p className="text-xs font-semibold text-[#385459] leading-none">
                          Portion
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Has Leftover Checkbox - Only show if not from leftover and portion > 1 */}
              {!mainIsFromLeftover && mainPortion > 1 && (
                <button
                  onClick={() => {
                    const newValue = !mainIsLeftover;
                    setMainIsLeftover(newValue);
                    onMainLeftoverChange?.(newValue);
                  }}
                  className="flex gap-1 items-center px-0 py-1"
                >
                  <span className={cn(
                    "material-icons text-xl",
                    mainIsLeftover ? "text-[#007CB2]" : "text-[#96A5A8]"
                  )}>
                    {mainIsLeftover ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <span className="font-semibold text-xs text-[#385459] leading-normal">
                    Has leftover
                  </span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={onAddMain}
            className="border border-dashed border-[#C1C9CB] rounded-lg flex gap-2 items-center justify-center py-1.5 w-full"
          >
            <span className="material-icons text-xl text-[#657A7E]">add</span>
            <span className="font-semibold text-sm text-[#385459] leading-[1.4]">Add main</span>
          </button>
        )}

        {/* Sides Section */}
        <div className="flex flex-col justify-center font-semibold text-sm text-[#244348] leading-[1.4]">
          Side
        </div>

        {sideRecipe ? (
          <div className="bg-white border border-[#DFE3E4] rounded-lg overflow-hidden cursor-pointer group/card">
            {/* Recipe Image */}
            <div
              className="h-[135px] w-full border-b border-[#DFE3E4] relative overflow-visible"
              onClick={(e) => {
                // Only trigger if not clicking on a button
                if (!(e.target as HTMLElement).closest('button')) {
                  onSideImageClick?.(e.currentTarget);
                }
              }}
            >
              <img
                src={sideRecipe.image}
                alt={sideRecipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover/card:opacity-20 transition-opacity" />
              {sideIsFromLeftover && (
                <div className="absolute bg-[#E4C57E] bottom-0 left-0 flex items-center gap-1 px-2 py-1.5 rounded-tr z-10">
                  <span className="material-icons text-[#244348]" style={{ fontSize: '16px' }}>
                    kitchen
                  </span>
                  <span className="text-xs font-semibold text-[#244348] leading-[1.5]">
                    Leftover
                  </span>
                </div>
              )}
              {!sideIsFromLeftover && sideIsLeftover && sidePortion > 1 && (
                <div className="absolute bg-[#E4C2F0] bottom-0 left-0 flex items-center gap-1 px-2 py-1.5 rounded-tr z-10">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8H21V17C21 17.8333 20.7083 18.5417 20.125 19.125C19.5417 19.7083 18.8333 20 18 20H6C5.16667 20 4.45833 19.7083 3.875 19.125C3.29167 18.5417 3 17.8333 3 17V8ZM5 10V17C5 17.2833 5.09583 17.5208 5.2875 17.7125C5.47917 17.9042 5.71667 18 6 18H18C18.2833 18 18.5208 17.9042 18.7125 17.7125C18.9042 17.5208 19 17.2833 19 17V10H5ZM3 7V5H9V4C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4V5H21V7H3Z" fill="#244348"/>
                  </svg>
                  <span className="text-xs font-semibold text-[#244348] leading-[1.5]">
                    Bulk ({sidePortion} {sidePortion === 1 ? 'portion' : 'portions'})
                  </span>
                </div>
              )}
              <div className="absolute top-[15px] right-[15px] flex gap-1.5">
                <IconButton
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwapSide?.();
                  }}
                  icon={<span className="material-icons text-xl text-[#385459]">compare_arrows</span>}
                  className="bg-white"
                  tooltip='Swap recipe'
                  tooltipPosition='bottom'
                />
                <IconButton
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSide?.();
                  }}
                  icon={
                    <span className="material-icons text-[#385459]" style={{ fontSize: '20px' }}>
                      delete_outline
                    </span>
                  }
                  className="bg-white"
                  tooltip='Remove recipe'
                  tooltipPosition='bottom'
                />
              </div>
            </div>

            {/* Recipe Details */}
            <div
              className="flex flex-col gap-3 p-4 cursor-pointer"
              onClick={(e) => {
                // Only trigger if not clicking on a button or interactive element or serving/portion controls
                const target = e.target as HTMLElement;

                // Check if clicking on a button or input
                if (target.closest('button, input, select')) {
                  return;
                }

                // Check if clicking within serving/portion controls by checking for the background color class
                let element: HTMLElement | null = target;
                while (element && element !== e.currentTarget) {
                  if (element.classList.contains('bg-[#F0F2F3]')) {
                    return;
                  }
                  element = element.parentElement;
                }

                onSideImageClick?.(e.currentTarget);
              }}
            >
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-base text-[#244348] leading-[1.5] line-clamp-2">
                  {sideRecipe.title}
                </p>
                <p className="font-medium text-xs text-[#657A7E] leading-[1.5]">
                  {formatNutrition(sideRecipe, sideServing)}
                </p>
                {/* Dynamic Tags */}
                {getDynamicTags(sideRecipe, sideServing).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {getDynamicTags(sideRecipe, sideServing).map((tag) => (
                      <Tag
                        key={tag}
                        label={tag}
                        type="informational"
                        accentColor="creamsicle"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Serving and Portion Controls */}
              <div className="flex gap-3">
                {/* Serving */}
                <div className="flex-1 flex flex-col gap-1 pt-1.5 relative">
                  <div className="relative">
                    <div className="rounded flex gap-1 h-10 items-center justify-center bg-[#F0F2F3] px-1 py-1">
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!sideIsFromLeftover) {
                            const newServing = Math.max(1, sideServing - 1);
                            setSideServing(newServing);
                            onSideServingChange?.(newServing);
                          }
                        }}
                        disabled={sideIsFromLeftover}
                        icon={<span className="material-icons text-xl">remove</span>}
                      />
                      <div className={cn(
                        "flex-1 flex flex-col justify-center font-medium text-sm leading-[1.4] text-center",
                        sideIsFromLeftover ? "text-[#96A5A8]" : "text-[#244348]"
                      )}>
                        {sideServing}
                      </div>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!sideIsFromLeftover) {
                            const newServing = sideServing + 1;
                            setSideServing(newServing);
                            onSideServingChange?.(newServing);
                          }
                        }}
                        disabled={sideIsFromLeftover}
                        icon={<span className="material-icons text-xl">add</span>}
                      />
                    </div>
                    <div className="absolute left-0 px-2 -top-1.5 h-3 flex items-center pointer-events-none">
                      <div className="bg-[#F0F2F3] px-1 h-3 flex items-center">
                        <p className="text-xs font-semibold text-[#385459] leading-none">
                          Serving
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Portion */}
                <div className="flex-1 flex flex-col gap-1 pt-1.5 relative">
                  <div className="relative">
                    <div className="rounded flex gap-1 h-10 items-center justify-center bg-[#F0F2F3] px-1 py-1">
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!sideIsFromLeftover) {
                            const newPortion = Math.max(1, sidePortion - 1);
                            setSidePortion(newPortion);
                            onSidePortionChange?.(newPortion);
                          }
                        }}
                        disabled={sideIsFromLeftover}
                        icon={<span className="material-icons text-xl">remove</span>}
                      />
                      <div className={cn(
                        "flex-1 flex flex-col justify-center font-medium text-sm leading-[1.4] text-center",
                        sideIsFromLeftover ? "text-[#96A5A8]" : "text-[#244348]"
                      )}>
                        {sidePortion}
                      </div>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!sideIsFromLeftover) {
                            const newPortion = sidePortion + 1;
                            setSidePortion(newPortion);
                            onSidePortionChange?.(newPortion);
                          }
                        }}
                        disabled={sideIsFromLeftover}
                        icon={<span className="material-icons text-xl">add</span>}
                      />
                    </div>
                    <div className="absolute left-0 px-2 -top-1.5 h-3 flex items-center pointer-events-none">
                      <div className="bg-[#F0F2F3] px-1 h-3 flex items-center">
                        <p className="text-xs font-semibold text-[#385459] leading-none">
                          Portion
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Has Leftover Checkbox - Only show if not from leftover and portion > 1 */}
              {!sideIsFromLeftover && sidePortion > 1 && (
                <button
                  onClick={() => {
                    const newValue = !sideIsLeftover;
                    setSideIsLeftover(newValue);
                    onSideLeftoverChange?.(newValue);
                  }}
                  className="flex gap-1 items-center px-0 py-1"
                >
                  <span className={cn(
                    "material-icons text-xl",
                    sideIsLeftover ? "text-[#007CB2]" : "text-[#96A5A8]"
                  )}>
                    {sideIsLeftover ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <span className="font-semibold text-xs text-[#385459] leading-normal">
                    Has leftover
                  </span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={onAddSide}
            className="border border-dashed border-[#C1C9CB] rounded-lg flex gap-2 items-center justify-center py-1.5 w-full"
          >
            <span className="material-icons text-xl text-[#657A7E]">add</span>
            <span className="font-semibold text-sm text-[#385459] leading-[1.4]">Add side</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-[#C1C9CB] flex gap-3 items-center justify-end px-4 py-3 shrink-0">
        <Button variant="primary" size="md" onClick={onClose} className="w-full">
          Done
        </Button>
      </div>
    </aside>
  );
};
