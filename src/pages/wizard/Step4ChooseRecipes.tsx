import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagicWandIcon } from '@/components/icons/MagicWandIcon';
import { IngredientIcon } from '@/components/icons/IngredientIcon';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Search } from '@/components/ui/Search';
import { FiltersSideRail } from '@/components/layout/FiltersSideRail';
import type { FilterSection } from '@/components/layout/FiltersSideRail';

// Mock recipe data
const mockRecipes = [
  { id: 1, title: 'Roasted Tomato Chickpea Bowl', time: '50 mins', ingredients: 10, image: '/src/assets/Recipe Images/mediterranean-roasted-tomato-chickpea-bowl.jpg' },
  { id: 2, title: 'Salmon Cucumber Bites', time: '5 mins', ingredients: 4, image: '/src/assets/Recipe Images/salmon-cucumber-bites.jpg' },
  { id: 3, title: 'Muesli with Yoghurt & Berries', time: '10 mins', ingredients: 4, image: '/src/assets/Recipe Images/muesli-with-yogurt-blueberries.jpg' },
  { id: 4, title: 'Lentil & Feta Tabbouleh', time: '10 mins', ingredients: 9, image: '/src/assets/Recipe Images/lentil-feta-tabbouleh.jpg' },
  { id: 5, title: 'Yoghurt Berries', time: '5 mins', ingredients: 2, image: '/src/assets/Recipe Images/muesli-with-yogurt-blueberries.jpg' },
  { id: 6, title: 'Crackers Hummus', time: '5 mins', ingredients: 2, image: '/src/assets/Recipe Images/crackers-hummus.jpg' },
  { id: 7, title: 'Avocado Toast', time: '10 mins', ingredients: 5, image: '/src/assets/Recipe Images/hummus-toast-with-avocado.jpg' },
  { id: 8, title: 'Bruschetta', time: '15 mins', ingredients: 8, image: '/src/assets/Recipe Images/grilled-bruschetta-chicken.jpg' },
  { id: 9, title: 'Shakshuka', time: '25 mins', ingredients: 10, image: '/src/assets/Recipe Images/mediterranean-roasted-tomato-chickpea-bowl.jpg' },
];

const Step4ChooseRecipes: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([2, 6]); // Pre-select some recipes
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sections state
  const [filters, setFilters] = useState<FilterSection[]>([
    {
      id: 'dietary',
      label: 'Dietary',
      appliedCount: 2,
      expanded: true,
      options: ['anti-candida', 'auto-immune', 'elimination', 'vegetarian', 'vegan', 'ketogenic', 'low fodmap', 'mediterranean', 'paleo', 'pescetarian', 'pureed'],
      selectedOptions: ['low fodmap', 'mediterranean']
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
      id: 'mealTime',
      label: 'Meal time',
      appliedCount: 0,
      expanded: true,
      options: ['breakfast', 'lunch', 'dinner', 'snack', 'side', 'appetizer', 'dessert'],
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
      appliedCount: 1,
      expanded: false,
      options: [],
      selectedOptions: []
    },
    {
      id: 'cookingAppliance',
      label: 'Cooking appliance',
      appliedCount: 0,
      expanded: true,
      options: ['air fryer', 'barbecue', 'one-pan', 'freezer', 'slow cooker', 'pressure cooker'],
      selectedOptions: []
    }
  ]);

  const tabs = [
    { id: 'browse', label: 'Browse' },
    { id: 'recipebox', label: `Recipe Box (${selectedRecipes.length})` }
  ];

  const toggleRecipe = (recipeId: number) => {
    setSelectedRecipes(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
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

  const getTotalAppliedFilters = () => {
    return filters.reduce((sum, filter) => sum + filter.appliedCount, 0);
  };

  const handleCancel = () => {
    navigate('/nutrition');
  };

  const handleNext = () => {
    navigate('/wizard/step-5');
  };

  const handlePrevious = () => {
    navigate('/wizard/step-3');
  };

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

        {/* Content Area with Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto flex justify-center">
            <div className="w-full max-w-[900px] px-6 py-8 flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-[#01272E]">Choose recipes</h1>
                <p className="text-base font-medium text-[#657A7E]">
                  Pick at least 5 recipes to get started. We'll suggest similar ones to complete your plan.
                </p>
              </div>

              {/* Control Panel */}
              <div className="flex items-end justify-between">
                <div className="flex gap-2.5 items-center">
                  <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                  {getTotalAppliedFilters() > 0 && (
                    <div className="bg-[#FFFBEF] border border-[#A36624] rounded-full px-2 py-0.5">
                      <p className="text-xs font-medium text-[#A36624] leading-normal">Exclusions applied</p>
                    </div>
                  )}
                </div>
                <Search
                  placeholder="Search recipes"
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>

              {/* Recipe Grid */}
              {activeTab === 'browse' && (
                <div className="grid grid-cols-3 gap-4 pb-16">
                  {mockRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="bg-white border border-[#DFE3E4] rounded-lg overflow-hidden flex flex-col"
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
                        <button
                          onClick={() => toggleRecipe(recipe.id)}
                          className={`border rounded flex items-center justify-center gap-1 px-2 pr-3.5 py-1.5 transition-colors ${
                            selectedRecipes.includes(recipe.id)
                              ? 'border-[#385459] bg-[#385459] text-white'
                              : 'border-[#96A5A8] bg-white hover:bg-[#F0F2F3]'
                          }`}
                        >
                          <span className={`material-icons text-xl ${
                            selectedRecipes.includes(recipe.id) ? 'text-white' : 'text-[#385459]'
                          }`}>
                            {selectedRecipes.includes(recipe.id) ? 'done' : 'add'}
                          </span>
                          <span className={`text-sm font-semibold leading-[1.4] ${
                            selectedRecipes.includes(recipe.id) ? 'text-white' : 'text-[#385459]'
                          }`}>
                            {selectedRecipes.includes(recipe.id) ? 'Added' : 'Add'}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recipe Box View */}
              {activeTab === 'recipebox' && (
                <>
                  {selectedRecipes.length === 0 ? (
                    /* Empty State */
                    <div className="bg-white border border-[#C1C9CB] rounded-lg p-8 flex flex-col gap-4.5 items-center">
                      <div className="flex flex-col gap-1 items-center text-center">
                        <p className="text-base font-semibold text-[#244348] leading-normal">
                          Your recipe box is empty
                        </p>
                        <p className="text-sm font-medium text-[#657A7E] leading-[1.4]">
                          Choose recipes from Browse and they'll appear here.
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => setActiveTab('browse')}
                      >
                        Browse recipes
                      </Button>
                    </div>
                  ) : (
                    /* Recipe Grid */
                    <div className="grid grid-cols-3 gap-4 pb-16">
                      {mockRecipes
                        .filter(recipe => selectedRecipes.includes(recipe.id))
                        .map((recipe) => (
                          <div
                            key={recipe.id}
                            className="bg-white border border-[#DFE3E4] rounded-lg overflow-hidden flex flex-col"
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
                              <button
                                onClick={() => toggleRecipe(recipe.id)}
                                className="border border-[#385459] bg-[#385459] text-white rounded flex items-center justify-center gap-1 px-2 pr-3.5 py-1.5 transition-colors hover:bg-[#244348]"
                              >
                                <span className="material-icons text-xl text-white">done</span>
                                <span className="text-sm font-semibold text-white leading-[1.4]">Added</span>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Filters Sidebar */}
          <FiltersSideRail
            filters={filters}
            onToggleFilter={toggleFilterOption}
            onToggleExpanded={toggleFilterExpanded}
            onClearAll={clearAllFilters}
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
              <p className="text-sm font-semibold text-white">Next: Finalize plan</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4ChooseRecipes;
