import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagicWandIcon } from '@/components/icons/MagicWandIcon';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { Search } from '@/components/ui/Search';
import { RecipeDetailsPopover } from '@/components/nutrition-plans/RecipeDetailsPopover';
import { Chip } from '@/components/ui/Chip';
import { RecipeCard } from '@/components/nutrition-plans/RecipeCard';
import { mockRecipes } from '@/data/mockRecipes';
import { FiltersSideRail } from '@/components/layout/FiltersSideRail';
import type { FilterSection } from '@/components/layout/FiltersSideRail';
import { clearWizardData } from '@/utils/wizardUtils';
import { AnimatedFruits } from '@/components/ui/AnimatedFruits';
import { Tabs } from '@/components/ui/Tabs';
import { Tag } from '@/components/ui/Tag';
import { WizardLayout } from '@/components/wizard/WizardLayout';
import { WizardHeader } from '@/components/wizard/WizardHeader';

const Step3ChooseRecipes: React.FC = () => {
  const navigate = useNavigate();
  // Check if recipes have already been loaded (skip loading animation if returning to this step)
  const [isLoading, setIsLoading] = useState(() => {
    const hasLoaded = localStorage.getItem('wizard_step3_loaded');
    return !hasLoaded;
  });
  const [loadingMessage, setLoadingMessage] = useState('Analyzing preferences...');
  // Load selected recipes from localStorage or use default
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>(() => {
    const stored = localStorage.getItem('wizard_selectedRecipes');
    return stored ? JSON.parse(stored) : [];
  });
  // Load completed steps from localStorage
  const [completedSteps] = useState<string[]>(() => {
    const stored = localStorage.getItem('wizard_completedSteps');
    return stored ? JSON.parse(stored) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'best-matches' | 'added'>('best-matches');
  const [isFiltersSideRailCollapsed, setIsFiltersSideRailCollapsed] = useState(true);

  // Filter sidebar state - initialize with Step 1 cultural preferences
  const [filters, setFilters] = useState<FilterSection[]>(() => {
    // Load cultural preferences from Step 1
    const foodPrefsStored = localStorage.getItem('wizard_foodPreferences');
    let culturalPreSelected: string[] = [];

    if (foodPrefsStored) {
      try {
        const foodPrefs = JSON.parse(foodPrefsStored);
        if (foodPrefs.cultural) {
          // Convert Step 1 cultural preferences to lowercase to match Step 3 filter options
          culturalPreSelected = foodPrefs.cultural.map((c: string) => c.toLowerCase());
        }
      } catch {
        // Ignore errors
      }
    }

    return [
      // {
      //   id: 'dietary',
      //   label: 'Dietary',
      //   appliedCount: 0,
      //   expanded: true,
      //   options: ['anti-candida', 'auto-immune', 'elimination', 'vegetarian', 'vegan', 'ketogenic', 'low fodmap', 'mediterranean', 'paleo', 'pescetarian', 'pureed'],
      //   selectedOptions: []
      // },
      {
        id: 'mealTime',
        label: 'Meal time',
        appliedCount: 0,
        expanded: true,
        options: ['breakfast', 'lunch', 'dinner', 'snack', 'side', 'appetizer', 'dessert'],
        selectedOptions: []
      },
      {
        id: 'mealType',
        label: 'Meal type',
        appliedCount: 0,
        expanded: true,
        options: ['burger', 'cookie', 'dressing', 'drink', 'juice', 'meal prep', 'muffin', 'pancake', 'pasta', 'salad'],
        selectedOptions: []
      },
      {
        id: 'protein',
        label: 'Protein',
        appliedCount: 0,
        expanded: true,
        options: ['beef', 'chicken', 'meat', 'pork', 'seafood', 'eggs'],
        selectedOptions: []
      },
      {
        id: 'cultural',
        label: 'Cultural',
        appliedCount: culturalPreSelected.length,
        expanded: culturalPreSelected.length > 0,
        options: ['asian', 'italian', 'mexican', 'greek', 'indian', 'thai', 'french', 'spanish'],
        selectedOptions: culturalPreSelected
      },
      {
        id: 'cookingAppliance',
        label: 'Cooking appliance',
        appliedCount: 0,
        expanded: true,
        options: ['air fryer', 'barbecue', 'one-pan', 'freezer', 'slow cooker', 'pressure cooker'],
        selectedOptions: []
      }
    ];
  });

  // Simulate loading delay for mock data with progress messages
  useEffect(() => {
    // Only run loading animation if we haven't loaded before
    if (!isLoading) return;

    const messages = [
      'Analyzing your preferences...',
      'Filtering recipes...',
      'Matching nutritional requirements...',
      'Finding the best options...'
    ];

    let currentIndex = 0;
    const messageTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length;
      setLoadingMessage(messages[currentIndex]);
    }, 2500); // Change message every 2.5 seconds

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      // Mark that we've loaded step 3
      localStorage.setItem('wizard_step3_loaded', 'true');
    }, 5000); // 10 second delay

    return () => {
      clearInterval(messageTimer);
      clearTimeout(loadingTimer);
    };
  }, [isLoading]);

  // Persist selected recipes to localStorage
  useEffect(() => {
    localStorage.setItem('wizard_selectedRecipes', JSON.stringify(selectedRecipes));
  }, [selectedRecipes]);

  // Meal time filter options (shown as chips) - synced with sidebar filter
  const mealTimeOptions = [
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
    { label: 'Snack', value: 'snack' },
    { label: 'Side', value: 'side' },
    { label: 'Appetizer', value: 'appetizer' },
    { label: 'Dessert', value: 'dessert' }
  ];

  const toggleRecipe = (recipeId: number) => {
    setSelectedRecipes(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const toggleMealTime = (mealTimeValue: string) => {
    // Update the mealTime filter in the filters sidebar
    setFilters(prev => prev.map(filter => {
      if (filter.id === 'mealTime') {
        const isSelected = filter.selectedOptions.includes(mealTimeValue);
        const newSelectedOptions = isSelected
          ? filter.selectedOptions.filter(o => o !== mealTimeValue)
          : [...filter.selectedOptions, mealTimeValue];
        return {
          ...filter,
          selectedOptions: newSelectedOptions,
          appliedCount: newSelectedOptions.length
        };
      }
      return filter;
    }));
  };

  const toggleFilterOption = (filterId: string, option: string) => {
    setFilters(prev => prev.map(filter => {
      if (filter.id === filterId) {
        const isSelected = filter.selectedOptions.includes(option);
        const newSelectedOptions = isSelected
          ? filter.selectedOptions.filter(o => o !== option)
          : [...filter.selectedOptions, option];
        return {
          ...filter,
          selectedOptions: newSelectedOptions,
          appliedCount: newSelectedOptions.length
        };
      }
      return filter;
    }));
  };

  const toggleFilterExpanded = (filterId: string) => {
    setFilters(prev => prev.map(filter =>
      filter.id === filterId ? { ...filter, expanded: !filter.expanded } : filter
    ));
  };

  const clearAllFilters = () => {
    setFilters(prev => prev.map(filter => ({
      ...filter,
      selectedOptions: [],
      appliedCount: 0
    })));
  };

  const handleCancel = () => {
    clearWizardData();
    navigate('/nutrition');
  };

  const handleNext = () => {
    // Mark this step as completed
    const updatedCompleted = [...new Set([...completedSteps, 'choose-recipes'])];
    localStorage.setItem('wizard_completedSteps', JSON.stringify(updatedCompleted));
    navigate('/wizard/step-4');
  };

  const handlePrevious = () => {
    navigate('/wizard/step-2');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#F8F9F9]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar - Nutrition Plan Assistant */}
          <div className="bg-[#F0F2F3] flex items-center justify-center px-6 py-2 border-b border-[#C1C9CB]">
            <div className="flex items-center gap-2">
              <MagicWandIcon className="text-[#657A7E]" />
              <p className="text-sm font-semibold text-[#244348]">Nutrition Plan Assistant</p>
            </div>
          </div>

          {/* Loading Content */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 px-6 py-8">
              <AnimatedFruits className="w-32 h-36" />
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-2xl font-bold text-[#01272E]">Finding recipes</h1>
                <p className="text-base font-medium text-[#657A7E]">{loadingMessage}</p>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-[#F8F9F9] border-t border-[#C1C9CB] px-6 py-4 flex items-center justify-between">
            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 rounded hover:bg-[#DFE3E4] transition-colors"
            >
              <p className="text-sm font-semibold text-[#01272E]">Cancel</p>
            </button>

            {/* Right Actions */}
            <div className="flex items-center gap-2.5">
              {/* Previous Button */}
              <IconButton
                onClick={handlePrevious}
                variant="secondary"
                size="md"
                tooltip="Previous step"
                icon={<span className="material-icons text-2xl">keyboard_arrow_left</span>}
              />

              {/* Next Button - Disabled during loading */}
              <button
                disabled
                className="bg-[#657A7E] rounded h-10 flex items-center gap-1 px-2 pr-4 py-2.5 cursor-not-allowed opacity-60"
              >
                <span className="material-icons text-2xl text-white">keyboard_arrow_right</span>
                <p className="text-sm font-semibold text-white">Next: Choose recipes</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WizardLayout currentStep="choose-recipes" completedSteps={completedSteps as any}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <WizardHeader />

        {/* Content Area with Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto flex justify-center">
            <div className="w-full max-w-225 px-6 py-8 flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-[#01272E]">Add recipes to collection</h1>
                <p className="text-base font-medium text-[#657A7E]">
                  You can turn them into a plan in the next step or add more later.
                </p>
              </div>

              {/* Tabs and Search Row */}
              <div className="flex items-end justify-between">
                <div className="flex items-end gap-2">
                  <Tabs
                    tabs={[
                      { id: 'best-matches', label: 'Best matches' },
                      { id: 'added', label: `Added to collection (${selectedRecipes.length})` }
                    ]}
                    activeTab={activeTab}
                    onChange={(tabId) => setActiveTab(tabId as 'best-matches' | 'added')}
                  />
                  {/* Exclusions Applied Tag */}
                  <div className="mb-0.5">
                    <Tag label="Exclusions applied" type="alert" alertVariant="warning" />
                  </div>
                </div>

                <Search
                  placeholder="Search recipes"
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>

              {/* Filter Chips Row */}
              <div className="flex items-center gap-2">
                {/* Meal Time Chips */}
                {mealTimeOptions.map((mealTime) => {
                  const mealTimeFilter = filters.find(f => f.id === 'mealTime');
                  const isSelected = mealTimeFilter?.selectedOptions.includes(mealTime.value) || false;

                  return (
                    <Chip
                      key={mealTime.value}
                      label={mealTime.label}
                      variant="no-icon"
                      selected={isSelected}
                      onClick={() => toggleMealTime(mealTime.value)}
                    />
                  );
                })}

                {/* More filters button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFiltersSideRailCollapsed(!isFiltersSideRailCollapsed)}
                  className="focus:ring-0 focus:ring-offset-0"
                >
                  {isFiltersSideRailCollapsed ? 'All filters' : 'Hide filters'}
                </Button>
              </div>

              {/* Recipe Grid */}
              <div className="flex flex-col gap-6 pb-16">
                {(() => {
                  const filteredRecipes = mockRecipes.filter(recipe => {
                    // Filter by active tab
                    if (activeTab === 'added') {
                      return selectedRecipes.includes(recipe.id);
                    }

                    // Get selected meal time filters from sidebar
                    const mealTimeFilter = filters.find(f => f.id === 'mealTime');
                    const selectedMealTimes = mealTimeFilter?.selectedOptions || [];

                    // Apply meal time filters if any selected
                    if (selectedMealTimes.length > 0) {
                      const matchesMealTime = selectedMealTimes.some(mealTime =>
                        recipe.tags?.some(tag => tag.toLowerCase().includes(mealTime.toLowerCase()))
                      );
                      if (!matchesMealTime) return false;
                    }

                    // Apply search query
                    if (searchQuery) {
                      const query = searchQuery.toLowerCase();
                      return recipe.title.toLowerCase().includes(query);
                    }

                    return true;
                  });

                  if (filteredRecipes.length === 0) {
                    // Empty state
                    return (
                      <div className="flex items-center justify-center py-16">
                        <div className="bg-white border border-[#C1C9CB] rounded-lg flex flex-col gap-[18px] items-center p-8 max-w-md">
                          <div className="flex flex-col gap-1 items-center text-center">
                            <h3 className="text-base font-semibold text-[#244348] leading-[1.5]">
                              {activeTab === 'added'
                                ? 'Your recipe box is empty'
                                : searchQuery
                                  ? 'No recipes found'
                                  : 'No recipes match your filters'}
                            </h3>
                            <p className="text-sm font-medium text-[#657A7E] leading-[1.4]">
                              {activeTab === 'added'
                                ? "Choose recipes from Browse and they'll appear here."
                                : searchQuery
                                  ? `No recipes match "${searchQuery}". Try different keywords or filters.`
                                  : 'Try adjusting your filter selections to see more recipes.'}
                            </p>
                          </div>
                          {activeTab === 'added' && (
                            <button
                              onClick={() => setActiveTab('best-matches')}
                              className="bg-white border border-[#96A5A8] rounded h-10 px-4 py-2.5 flex items-center justify-center hover:bg-[#F0F2F3] transition-colors"
                            >
                              <span className="text-sm font-semibold text-[#385459] leading-[1.4]">
                                Browse recipes
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-3 gap-4">
                      {filteredRecipes.map((recipe) => (
                        <RecipeDetailsPopover
                          key={recipe.id}
                          recipe={recipe}
                          open={openPopoverId === recipe.id}
                          onOpenChange={(open) => setOpenPopoverId(open ? recipe.id : null)}
                        >
                          <RecipeCard
                            recipe={{
                              ...recipe,
                              calories: recipe.nutrition?.calories,
                              tags: recipe.tags
                            }}
                            isSelected={selectedRecipes.includes(recipe.id)}
                            onToggle={toggleRecipe}
                            showCalories={false}
                          />
                        </RecipeDetailsPopover>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Filters Sidebar */}
          <FiltersSideRail
            filters={filters}
            onToggleFilter={toggleFilterOption}
            onToggleExpanded={toggleFilterExpanded}
            onClearAll={clearAllFilters}
            isCollapsed={isFiltersSideRailCollapsed}
            onToggleCollapse={() => setIsFiltersSideRailCollapsed(!isFiltersSideRailCollapsed)}
          />
        </div>

        {/* Bottom Navigation */}
        <div className="bg-[#F8F9F9] border-t border-[#C1C9CB] px-6 py-4 flex items-center justify-between">
          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="px-4 py-2.5 rounded hover:bg-[#DFE3E4] transition-colors"
          >
            <p className="text-sm font-semibold text-[#01272E]">Cancel</p>
          </button>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Previous Button */}
            <IconButton
              onClick={handlePrevious}
              variant="secondary"
              size="md"
              tooltip="Previous step"
              icon={<span className="material-icons text-2xl">keyboard_arrow_left</span>}
            />

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="bg-[#01272E] rounded h-10 flex items-center gap-1 px-2 pr-4 py-2.5 hover:bg-[#244348] transition-colors"
            >
              <span className="material-icons text-2xl text-white">keyboard_arrow_right</span>
              <p className="text-sm font-semibold text-white">Next: Customize plan</p>
            </button>
          </div>
        </div>
      </div>
    </WizardLayout>
  );
};

export default Step3ChooseRecipes;
