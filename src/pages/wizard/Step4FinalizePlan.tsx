import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagicWandIcon } from '@/components/icons/MagicWandIcon';
import { IconButton } from '@/components/ui/IconButton';
import { Tabs } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import type { SelectOption } from '@/components/ui/Select';
import { mockRecipes } from '@/data/mockRecipes';
import { mockUsers } from '@/data/mockUsers';

const Step4FinalizePlan: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('client');
  const [planStructure, setPlanStructure] = useState<'recipes' | 'simple' | 'structured'>('recipes');
  const [recipeVariety, setRecipeVariety] = useState<'low' | 'moderate' | 'high' | 'custom'>('moderate');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [templateName, setTemplateName] = useState('');

  // Load selected recipes from localStorage (from Step 4)
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<number[]>(() => {
    const stored = localStorage.getItem('wizard_selectedRecipes');
    return stored ? JSON.parse(stored) : [];
  });
  const selectedRecipes = mockRecipes.filter(r => selectedRecipeIds.includes(r.id));

  // Convert users to select options
  const userOptions: SelectOption[] = mockUsers.map(user => ({
    value: user.id,
    label: user.name,
    avatar: {
      initials: user.initials,
      color: user.avatarColor,
    },
  }));

  const tabs = [
    { id: 'client', label: 'Client plan' },
    { id: 'template', label: 'Template' },
  ];

  // Clear wizard data from localStorage
  const clearWizardData = () => {
    localStorage.removeItem('wizard_selectedRecipes');
    // Add more wizard-related keys here as needed
  };

  const handleCancel = () => {
    clearWizardData();
    navigate('/nutrition');
  };

  const handlePrevious = () => {
    navigate('/wizard/step-3');
  };

  const handleFinalize = () => {
    // TODO: Save the plan and navigate to the nutrition plans page
    clearWizardData();
    navigate('/nutrition');
  };

  return (
    <div className="flex h-screen bg-[#F8F9F9]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar - Nutrition Plan Assistant */}
        <div className="bg-[#F0F2F3] flex items-center justify-center px-6 py-2 border-b border-[#C1C9CB] sticky top-0 h-10">
          <div className="flex items-center gap-2.5">
            <MagicWandIcon className="text-[#657A7E]" />
            <p className="text-sm font-semibold text-[#244348]">Nutrition Plan Assistant</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto flex justify-center">
          <div className="w-full max-w-[678px] px-6 py-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-[#01272E]">Finalize nutrition plan</h1>
            </div>

            {/* Tabs */}
            <div>
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="default" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4">
              {/* Client Name Select (Client Plan tab) */}
              {activeTab === 'client' && (
                <Select
                  label="Client name"
                  value={selectedUserId}
                  options={userOptions}
                  onChange={setSelectedUserId}
                  required
                  helpText="Saved to client's profile. We won't share it until you're ready."
                />
              )}

              {/* Template Name Input (Template tab) */}
              {activeTab === 'template' && (
                <div className="flex flex-col gap-1 relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="bg-white border border-[#C1C9CB] rounded h-10 w-full pl-3 pr-3 text-sm font-medium text-[#244348] focus:outline-none focus:border-[#385459] peer"
                    />
                    <div className={`absolute left-0 px-2 h-3 flex items-center transition-all pointer-events-none ${
                      templateName ? '-top-2' : 'top-1/2 -translate-y-1/2 left-3'
                    }`}>
                      <div className={`px-1 h-3 flex items-center transition-all ${
                        templateName ? 'bg-white' : 'bg-transparent'
                      }`}>
                        <p className={`font-semibold leading-none transition-all ${
                          templateName ? 'text-xs text-[#385459]' : 'text-sm text-[#657A7E]'
                        }`}>
                          Template name *
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Plan Structure Section */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-[#244348]">Plan structure</p>
                <div className="flex gap-3">
                  {/* Recipes only */}
                  <button
                    onClick={() => setPlanStructure('recipes')}
                    className={`flex-1 flex flex-col gap-2 p-4 rounded overflow-hidden border-2 transition-colors ${
                      planStructure === 'recipes'
                        ? 'bg-white border-[#385459]'
                        : 'bg-white border-[#C1C9CB] hover:border-[#96A5A8]'
                    }`}
                  >
                    <div className="bg-[#F0F2F3] rounded p-1 size-10 flex items-center justify-center">
                      <span className="material-icons text-[#657A7E]" style={{ fontSize: '24px' }}>
                        room_service
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <p className="text-sm font-medium text-[#01272E]">Recipes only</p>
                      <p className="text-xs font-medium text-[#657A7E]">
                        Just your recipe box. Add a meal plan later if needed.
                      </p>
                    </div>
                  </button>

                  {/* Simple meal plan */}
                  <button
                    onClick={() => setPlanStructure('simple')}
                    className={`flex-1 flex flex-col gap-2 p-4 rounded overflow-hidden border transition-colors ${
                      planStructure === 'simple'
                        ? 'bg-white border-2 border-[#385459]'
                        : 'border border-[#C1C9CB] hover:border-[#96A5A8]'
                    }`}
                  >
                    <div className="bg-[#F0F2F3] rounded p-1 size-10 flex items-center justify-center">
                      <span className="material-icons text-[#657A7E]" style={{ fontSize: '24px' }}>
                        view_kanban
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <p className="text-sm font-medium text-[#01272E]">Simple meal plan</p>
                      <p className="text-xs font-medium text-[#657A7E]">
                        Recipes organized into groups.
                      </p>
                    </div>
                  </button>

                  {/* Structured meal plan */}
                  <button
                    onClick={() => setPlanStructure('structured')}
                    className={`flex-1 flex flex-col gap-2 p-4 rounded overflow-hidden border transition-colors ${
                      planStructure === 'structured'
                        ? 'bg-white border-2 border-[#385459]'
                        : 'border border-[#C1C9CB] hover:border-[#96A5A8]'
                    }`}
                  >
                    <div className="bg-[#F0F2F3] rounded p-1 size-10 flex items-center justify-center">
                      <span className="material-icons-outlined text-[#657A7E]" style={{ fontSize: '24px' }}>
                        calendar_view_week
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <p className="text-sm font-medium text-[#01272E]">Structured meal plan</p>
                      <p className="text-xs font-medium text-[#657A7E]">
                        A one-week meal plan. Add more weeks later.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recipe Variety Section */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-[#244348]">Recipe variety</p>
                <div className="bg-white border border-[#C1C9CB] rounded h-10 inline-flex items-center px-[3px] py-0.5 w-fit">
                  <button
                    onClick={() => setRecipeVariety('low')}
                    className={`h-[34px] rounded flex items-center justify-center px-4 py-2.5 transition-colors ${
                      recipeVariety === 'low'
                        ? 'bg-[#385459]'
                        : 'hover:bg-[#F0F2F3]'
                    }`}
                  >
                    <p className={`text-sm font-semibold whitespace-nowrap ${
                      recipeVariety === 'low' ? 'text-white' : 'text-[#385459]'
                    }`}>
                      Low
                    </p>
                  </button>
                  <button
                    onClick={() => setRecipeVariety('moderate')}
                    className={`h-[34px] rounded flex items-center justify-center px-4 py-2.5 transition-colors ${
                      recipeVariety === 'moderate'
                        ? 'bg-[#385459]'
                        : 'hover:bg-[#F0F2F3]'
                    }`}
                  >
                    <p className={`text-sm font-semibold whitespace-nowrap ${
                      recipeVariety === 'moderate' ? 'text-white' : 'text-[#385459]'
                    }`}>
                      Moderate
                    </p>
                  </button>
                  <button
                    onClick={() => setRecipeVariety('high')}
                    className={`h-[34px] rounded flex items-center justify-center px-4 py-2.5 transition-colors ${
                      recipeVariety === 'high'
                        ? 'bg-[#385459]'
                        : 'hover:bg-[#F0F2F3]'
                    }`}
                  >
                    <p className={`text-sm font-semibold whitespace-nowrap ${
                      recipeVariety === 'high' ? 'text-white' : 'text-[#385459]'
                    }`}>
                      High
                    </p>
                  </button>
                  <button
                    onClick={() => setRecipeVariety('custom')}
                    className={`h-[34px] rounded flex items-center justify-center px-4 py-2.5 transition-colors ${
                      recipeVariety === 'custom'
                        ? 'bg-[#385459]'
                        : 'hover:bg-[#F0F2F3]'
                    }`}
                  >
                    <p className={`text-sm font-semibold whitespace-nowrap ${
                      recipeVariety === 'custom' ? 'text-white' : 'text-[#385459]'
                    }`}>
                      Custom
                    </p>
                  </button>
                </div>
                <div className="flex items-center px-3">
                  <p className="text-xs font-medium text-[#657A7E]">
                    {`Some variety, manageable grocery list. We'll suggest recipes to fill any gaps.`}
                  </p>
                </div>
              </div>

              {/* Additional Instructions */}
              <div className="flex flex-col gap-1 min-h-[108px]">
                <div className="flex-1 pt-1.5 relative">
                  <textarea
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    placeholder="Additional instructions"
                    className="bg-white border border-[#C1C9CB] rounded px-3 py-2.5 w-full h-20 text-sm font-medium text-[#01272E] placeholder:text-[#657A7E] resize-none focus:outline-none focus:border-[#385459]"
                  />
                </div>
                <div className="flex items-center px-3">
                  <p className="text-xs font-medium text-[#657A7E]">
                    E.g. no smoothies, batch-cooking friendly, avoid repeating proteins
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-[#F8F9F9] border-t border-[#C1C9CB] px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="px-4 py-2.5 rounded hover:bg-[#DFE3E4] transition-colors"
          >
            <p className="text-sm font-semibold text-[#01272E]">Cancel</p>
          </button>

          <div className="flex items-center gap-2.5">
            <IconButton
              onClick={handlePrevious}
              variant="secondary"
              size="md"
              tooltip="Previous step"
              icon={<span className="material-icons text-2xl">keyboard_arrow_left</span>}
            />

            <button
              onClick={handleFinalize}
              className="bg-[#01272E] rounded h-10 flex items-center px-4 py-2.5 hover:bg-[#244348] transition-colors"
            >
              <p className="text-sm font-semibold text-white">Create plan</p>
            </button>
          </div>
        </div>
      </div>

      {/* Right Preview Panel */}
      <div className="bg-[#1E8754] flex flex-col w-[520px] shrink-0 p-12 overflow-clip">
        <div className="flex-1 flex flex-col gap-4 overflow-clip px-0 py-6 rounded-lg">
          {/* Info Alert */}
          <div className="bg-[#F2F8FB] border border-[#007CB2] flex items-start">
            <div className="bg-[#007CB2] w-2 self-stretch shrink-0" />
            <div className="flex-1 flex gap-3 items-center pl-3 pr-2 py-0">
              <span className="material-icons-outlined text-[#007CB2] shrink-0" style={{ fontSize: '24px' }}>
                info
              </span>
              <div className="flex items-center py-2.5">
                <p className="text-sm font-medium text-[#007CB2]">
                  Sample structure of your nutrition plan
                </p>
              </div>
            </div>
          </div>

          {/* Recipe Box Widget */}
          <div className="bg-white border border-[#DFE3E4] rounded-lg flex flex-col overflow-hidden">
            <div className="bg-[#F0F2F3] border-b border-[#DFE3E4] px-4 py-2 flex items-center">
              <div className="flex gap-2 items-center">
                <span className="material-icons-outlined text-[#657A7E]" style={{ fontSize: '24px' }}>
                  menu_book
                </span>
                <p className="text-sm font-semibold text-[#244348]">Recipe box</p>
                <div className="bg-[#DFE3E4] rounded-full px-2 py-0.5">
                  <p className="text-xs font-medium text-[#244348]">{selectedRecipes.length} {selectedRecipes.length === 1 ? 'recipe' : 'recipes'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white flex gap-3 p-4 overflow-x-auto">
              {selectedRecipes.slice(0, 7).map((recipe) => (
                <div key={recipe.id} className="flex flex-col gap-1 items-center shrink-0 w-[100px]">
                  <div className="border border-[#DFE3E4] rounded-xl h-[76px] w-full overflow-hidden">
                    {recipe.image && (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#385459] line-clamp-2 text-center w-full">
                    {recipe.title}
                  </p>
                </div>
              ))}
              <div className="bg-[#F8F9F9] border border-[#DFE3E4] rounded-lg h-24 w-[140px] flex items-center justify-center p-3 shrink-0">
                <p className="text-[10px] font-semibold text-[#244348] text-center leading-relaxed">
                  You can add more recipes to your plan. We'll also give you suggestions.
                </p>
              </div>
            </div>
          </div>

          {/* Meal Plan Widget */}
          <div className="bg-white border border-[#DFE3E4] rounded-lg flex flex-col overflow-hidden">
            <div className="bg-[#F0F2F3] border-b border-[#DFE3E4] px-4 py-2 flex items-center h-14">
              <div className="flex gap-2 items-center">
                <span className="material-icons-outlined text-[#657A7E]" style={{ fontSize: '24px' }}>
                  calendar_view_week
                </span>
                <p className="text-sm font-semibold text-[#244348]">Meal plan</p>
              </div>
            </div>

            {/* Meal Plan Content */}
            {planStructure === 'simple' ? (
              <div className="flex gap-3 p-4">
                {/* Breakfast Column */}
                <div className="border border-[#DFE3E4] rounded-lg flex flex-col gap-2 p-3 w-32 h-[250px]">
                  <p className="text-xs font-semibold text-[#385459]">Breakfast</p>
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                </div>

                {/* Lunch Column */}
                <div className="border border-[#DFE3E4] rounded-lg flex flex-col gap-2 p-3 w-32">
                  <p className="text-xs font-semibold text-[#385459]">Lunch</p>
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                </div>

                {/* Dinner Column */}
                <div className="border border-[#DFE3E4] rounded-lg flex flex-col gap-2 p-3 w-32 h-[250px]">
                  <p className="text-xs font-semibold text-[#385459]">Dinner</p>
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                </div>
              </div>
            ) : planStructure === 'structured' ? (
              <div className="flex h-[233px]">
                {/* Meal Types Column */}
                <div className="border-l border-[#DFE3E4] flex flex-col w-[84px] h-[250px]">
                  <div className="border-b border-[#DFE3E4] h-[30px]" />
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center h-[54px] px-3 py-1.5">
                    <p className="text-xs font-semibold text-[#385459]">Breakfast</p>
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center h-[54px] px-3 py-1.5">
                    <p className="text-xs font-semibold text-[#385459]">Lunch</p>
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center h-[54px] px-3 py-1.5">
                    <p className="text-xs font-semibold text-[#385459]">Dinner</p>
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center h-[54px] px-3 py-1.5">
                    <p className="text-xs font-semibold text-[#385459]">Snacks</p>
                  </div>
                </div>

                {/* Day 1 Column */}
                <div className="border-l border-[#DFE3E4] flex flex-col w-[106px] h-[250px]">
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center px-3 py-1.5">
                    <p className="text-xs font-semibold text-[#385459]">Day 1</p>
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                </div>

                {/* Day 2 Column */}
                <div className="border-l border-[#DFE3E4] flex flex-col w-[106px] h-[250px]">
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center px-3 py-1.5">
                    <p className="text-xs font-semibold text-[#385459]">Day 2</p>
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                </div>

                {/* Day 3 Column */}
                <div className="border-l border-[#DFE3E4] flex flex-col w-[106px] h-[250px]">
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center px-3 py-1.5">
                    <p className="text-xs font-semibold text-[#385459]">Day 3</p>
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                </div>

                {/* Day 4 Column */}
                <div className="border-l border-[#DFE3E4] flex flex-col w-[106px] h-[250px]">
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center px-3 py-1.5">
                    <p className="text-xs font-medium text-[#385459]">Day 4</p>
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                  <div className="border-b border-[#DFE3E4] flex items-center justify-center p-1.5">
                    <div className="bg-[#E1F5FC] h-[42px] rounded-lg flex-1" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start p-4">
                <p className="text-sm font-medium text-[#657A7E]">No meal plan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4FinalizePlan;
