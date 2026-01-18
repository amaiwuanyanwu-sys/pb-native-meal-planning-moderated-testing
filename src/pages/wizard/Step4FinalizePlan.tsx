import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagicWandIcon } from '@/components/icons/MagicWandIcon';
import { IconButton } from '@/components/ui/IconButton';
import { Tabs } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import type { SelectOption } from '@/components/ui/Select';
import { InfoBanner } from '@/components/ui/InfoBanner';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { AnimatedFruits } from '@/components/ui/AnimatedFruits';
import { mockRecipes } from '@/data/mockRecipes';
import { mockUsers } from '@/data/mockUsers';

const Step4FinalizePlan: React.FC = () => {
  const navigate = useNavigate();
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [activeTab, setActiveTab] = useState('client');
  const [mealPlanChoice, setMealPlanChoice] = useState<'no' | 'yes'>('no');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [templateName, setTemplateName] = useState('');

  // Meal plan structure state
  const [mealPlanStructure, setMealPlanStructure] = useState<'structured' | 'simple'>('structured');

  // Daily nutrition targets state
  const [calories, setCalories] = useState('2,000');
  const [protein, setProtein] = useState('110');
  const [carbs, setCarbs] = useState('120');
  const [fat, setFat] = useState('65');
  const [fiber, setFiber] = useState('30');

  // What's most important state
  const [importance, setImportance] = useState<'grocery' | 'variety' | 'other'>('grocery');

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
    setIsCreatingPlan(true);
    setLoadingStep(1); // Start at step 1 immediately
  };

  // Handle loading progression
  useEffect(() => {
    if (!isCreatingPlan) return;

    const loadingSteps = [
      { duration: 2000, step: 2 }, // Building your meal plan
      { duration: 2000, step: 3 }, // Generating grocery list
      { duration: 1500, step: 4 }, // Making some final touches
    ];

    let currentStepIndex = 0;

    const progressToNextStep = () => {
      if (currentStepIndex < loadingSteps.length) {
        const { duration, step } = loadingSteps[currentStepIndex];
        setTimeout(() => {
          setLoadingStep(step);
          currentStepIndex++;
          if (currentStepIndex < loadingSteps.length) {
            progressToNextStep();
          } else {
            // All steps complete, navigate to nutrition plans
            setTimeout(() => {
              clearWizardData();
              navigate('/nutrition');
            }, 1500);
          }
        }, duration);
      }
    };

    progressToNextStep();
  }, [isCreatingPlan, navigate]);

  // Loading state - Creating nutrition plan
  if (isCreatingPlan) {
    const steps = [
      'Analyzing your recipes',
      'Building your meal plan',
      'Generating grocery list',
      'Making some final touches'
    ];

    return (
      <div className="flex h-screen bg-[#F8F9F9]">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="bg-[#F0F2F3] flex items-center justify-center px-6 py-2 h-10">
            <div className="flex items-center gap-2.5">
              <MagicWandIcon className="text-[#657A7E]" />
              <p className="text-sm font-semibold text-[#244348]">Nutrition Plan Assistant</p>
            </div>
          </div>

          {/* Loading Content */}
          <div className="flex-1 flex items-center justify-center px-0 py-10">
            <div className="flex flex-col gap-4 items-center justify-center px-6 py-8 w-[461px]">
              {/* Animated Fruits */}
              <AnimatedFruits className="w-32 h-36" />

              {/* Header */}
              <div className="flex gap-6 items-start px-0 py-0 w-[348px]">
                <div className="flex flex-col gap-1 items-start w-full">
                  <div className="flex gap-2.5 items-start w-full">
                    <h1 className="text-2xl font-bold text-[#01272E]">
                      Creating your nutrition plan
                    </h1>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex flex-col items-start w-[392px]">
                {steps.map((step, index) => {
                  const stepNumber = index + 1;
                  const isActive = loadingStep === stepNumber;
                  const isCompleted = loadingStep > stepNumber;
                  const isWaiting = loadingStep < stepNumber;

                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-start w-full ${isWaiting ? 'opacity-50' : ''}`}
                    >
                      <div className="flex gap-4 items-center px-3 py-0 w-full">
                        <div className="flex gap-3 items-center flex-1">
                          {/* Icon */}
                          <div className="flex items-center justify-center overflow-clip p-2 rounded w-10">
                            {isCompleted ? (
                              <span className="material-icons text-2xl text-[#1E8754]">
                                check_circle
                              </span>
                            ) : isActive ? (
                              <span className="material-icons text-2xl text-[#244348] animate-spin">
                                autorenew
                              </span>
                            ) : (
                              <span className="material-icons-outlined text-2xl text-[#657A7E]">
                                hourglass_empty
                              </span>
                            )}
                          </div>

                          {/* Text */}
                          <div className="flex flex-col gap-1 items-start flex-1">
                            <p className="text-sm font-semibold text-[#244348]">
                              {step}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-[#01272E]">Customize nutrition plan</h1>
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
                  icon={
                    <span className="material-icons text-[#657A7E]" style={{ fontSize: '24px' }}>
                      person
                    </span>
                  }
                />
              )}

              {/* Template Name Input (Template tab) */}
              {activeTab === 'template' && (
                <div className="flex flex-col gap-1 relative">
                  <div className="relative">
                    <div className="relative flex items-center">
                      {!templateName && (
                        <span className="material-icons text-[#657A7E] absolute left-3 pointer-events-none z-10" style={{ fontSize: '24px' }}>
                          dashboard
                        </span>
                      )}
                      <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        className={`bg-white border border-[#C1C9CB] rounded h-10 w-full pr-3 text-sm font-medium text-[#244348] focus:outline-none focus:border-[#385459] peer ${
                          templateName ? 'pl-3' : 'pl-11'
                        }`}
                      />
                    </div>
                    <div className={`absolute h-3 flex items-center transition-all pointer-events-none z-20 ${
                      templateName ? 'left-0 px-2 -top-2' : 'left-11 top-1/2 -translate-y-1/2'
                    }`}>
                      <div className={`h-3 flex items-center transition-all ${
                        templateName ? 'bg-white px-1' : 'bg-transparent'
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

              {/* Do you want a meal plan? Section */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-[#244348]">Do you want a meal plan?</p>
                <SegmentedControl
                  options={[
                    { value: 'no', label: 'No, only recipe collection' },
                    { value: 'yes', label: 'Yes, add a meal plan' },
                  ]}
                  value={mealPlanChoice}
                  onChange={(value) => setMealPlanChoice(value as 'no' | 'yes')}
                  className="w-fit"
                />
              </div>

              {/* Conditional sections when meal plan is selected */}
              {mealPlanChoice === 'yes' && (
                <>
                  {/* Choose a meal plan structure */}
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-[#244348]">Choose a meal plan structure</p>
                    <div className="flex gap-3">
                      {/* Structured meal plan */}
                      <button
                        onClick={() => setMealPlanStructure('structured')}
                        className={`flex-1 flex flex-col gap-2 p-4 rounded overflow-hidden border transition-colors ${
                          mealPlanStructure === 'structured'
                            ? 'bg-white border-2 border-[#385459]'
                            : 'bg-white border border-[#C1C9CB] hover:border-[#96A5A8]'
                        }`}
                      >
                        <div className="flex gap-3 items-start text-left">
                          <span className="material-icons-outlined text-[#657A7E]" style={{ fontSize: '24px' }}>
                            grid_on
                          </span>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-[#01272E]">Structured meal plan</p>
                            <p className="text-xs font-medium text-[#657A7E]">
                              We'll create a 5 day plan with the recipe collection.
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Simple meal plan */}
                      <button
                        onClick={() => setMealPlanStructure('simple')}
                        className={`flex-1 flex flex-col gap-2 p-4 rounded overflow-hidden border transition-colors ${
                          mealPlanStructure === 'simple'
                            ? 'bg-white border-2 border-[#385459]'
                            : 'bg-white border border-[#C1C9CB] hover:border-[#96A5A8]'
                        }`}
                      >
                        <div className="flex gap-3 items-start text-left">
                          <span className="material-icons-outlined text-[#657A7E]" style={{ fontSize: '24px' }}>
                            view_kanban
                          </span>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-[#01272E]">Simple meal plan</p>
                            <p className="text-xs font-medium text-[#657A7E]">
                              We'll organize recipes in the collection into groups
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Daily nutrition targets */}
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-[#244348]">Daily nutrition targets</p>
                    <div className="grid grid-cols-3 gap-3">
                      {/* Calories */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-[#657A7E]">Calories (kcal)</label>
                        <input
                          type="text"
                          value={calories}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow empty string, numbers, and commas
                            if (value === '' || /^[\d,]+$/.test(value)) {
                              setCalories(value);
                            }
                          }}
                          className="bg-white border border-[#C1C9CB] rounded h-10 px-3 text-sm font-medium text-[#244348] focus:outline-none focus:border-[#385459]"
                        />
                      </div>

                      {/* Protein */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-[#657A7E]">Protein (g)</label>
                        <input
                          type="text"
                          value={protein}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow numbers
                            if (value === '' || /^\d+$/.test(value)) {
                              setProtein(value);
                            }
                          }}
                          className="bg-white border border-[#C1C9CB] rounded h-10 px-3 text-sm font-medium text-[#244348] focus:outline-none focus:border-[#385459]"
                        />
                      </div>

                      {/* Carbs */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-[#657A7E]">Carb (g)</label>
                        <input
                          type="text"
                          value={carbs}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow numbers
                            if (value === '' || /^\d+$/.test(value)) {
                              setCarbs(value);
                            }
                          }}
                          className="bg-white border border-[#C1C9CB] rounded h-10 px-3 text-sm font-medium text-[#244348] focus:outline-none focus:border-[#385459]"
                        />
                      </div>

                      {/* Fat */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-[#657A7E]">Fat (g)</label>
                        <input
                          type="text"
                          value={fat}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow numbers
                            if (value === '' || /^\d+$/.test(value)) {
                              setFat(value);
                            }
                          }}
                          className="bg-white border border-[#C1C9CB] rounded h-10 px-3 text-sm font-medium text-[#244348] focus:outline-none focus:border-[#385459]"
                        />
                      </div>

                      {/* Fiber */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-[#657A7E]">Fiber (g)</label>
                        <input
                          type="text"
                          value={fiber}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow numbers
                            if (value === '' || /^\d+$/.test(value)) {
                              setFiber(value);
                            }
                          }}
                          className="bg-white border border-[#C1C9CB] rounded h-10 px-3 text-sm font-medium text-[#244348] focus:outline-none focus:border-[#385459]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* What's most important */}
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-[#244348]">What's most important for this plan?</p>
                    <div className="bg-white border border-[#C1C9CB] rounded flex flex-col">
                      {/* Small grocery list */}
                      <button
                        onClick={() => setImportance('grocery')}
                        className="flex items-center gap-3 px-4 py-3 border-b border-[#DFE3E4] hover:bg-[#F8F9F9] transition-colors"
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          importance === 'grocery'
                            ? 'border-[#385459]'
                            : 'border-[#C1C9CB]'
                        }`}>
                          {importance === 'grocery' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#385459]" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-[#244348]">Small grocery list</p>
                      </button>

                      {/* More recipe variety */}
                      <button
                        onClick={() => setImportance('variety')}
                        className="flex items-center gap-3 px-4 py-3 border-b border-[#DFE3E4] hover:bg-[#F8F9F9] transition-colors"
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          importance === 'variety'
                            ? 'border-[#385459]'
                            : 'border-[#C1C9CB]'
                        }`}>
                          {importance === 'variety' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#385459]" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-[#244348]">More recipe variety</p>
                      </button>

                      {/* Something else */}
                      <button
                        onClick={() => setImportance('other')}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F9F9] transition-colors"
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          importance === 'other'
                            ? 'border-[#385459]'
                            : 'border-[#C1C9CB]'
                        }`}>
                          {importance === 'other' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#385459]" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-[#244348]">Something else...</p>
                      </button>
                    </div>
                  </div>
                </>
              )}
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
          <InfoBanner message="Sample structure of your nutrition plan" />

          {/* Recipe Book Widget */}
          <div className="bg-white border border-[#DFE3E4] rounded-lg flex flex-col overflow-hidden">
            <div className="bg-[#F0F2F3] border-b border-[#DFE3E4] px-4 py-2 flex items-center">
              <div className="flex gap-2 items-center">
                <span className="material-icons-outlined text-[#657A7E]" style={{ fontSize: '24px' }}>
                  menu_book
                </span>
                <p className="text-sm font-semibold text-[#244348]">Recipe book</p>
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
            {mealPlanChoice === 'yes' && mealPlanStructure === 'simple' ? (
              <div className="flex gap-3 p-4">
                {/* Breakfast Column */}
                <div className="border border-[#DFE3E4] rounded-lg flex flex-col gap-2 p-3 flex-1">
                  <p className="text-xs font-semibold text-[#385459]">Breakfast</p>
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                </div>

                {/* Lunch Column */}
                <div className="border border-[#DFE3E4] rounded-lg flex flex-col gap-2 p-3 flex-1">
                  <p className="text-xs font-semibold text-[#385459]">Lunch</p>
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                </div>

                {/* Dinner Column */}
                <div className="border border-[#DFE3E4] rounded-lg flex flex-col gap-2 p-3 flex-1">
                  <p className="text-xs font-semibold text-[#385459]">Dinner</p>
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                  <div className="bg-[#E1F5FC] h-[42px] rounded-lg" />
                </div>
              </div>
            ) : mealPlanChoice === 'yes' && mealPlanStructure === 'structured' ? (
              <div className="p-4 overflow-x-auto">
                <div className="inline-flex flex-col min-w-full border border-[#DFE3E4] rounded-lg overflow-hidden">
                  {/* Header Row with Days */}
                  <div className="flex border-b border-[#DFE3E4] bg-[#F8F9F9]">
                    <div className="w-20 shrink-0 border-r border-[#DFE3E4]" />
                    <div className="flex flex-1">
                      <div className="flex-1 min-w-[90px] border-r border-[#DFE3E4] px-2 py-2 flex items-center justify-center">
                        <p className="text-xs font-semibold text-[#385459]">Day 1</p>
                      </div>
                      <div className="flex-1 min-w-[90px] border-r border-[#DFE3E4] px-2 py-2 flex items-center justify-center">
                        <p className="text-xs font-semibold text-[#385459]">Day 2</p>
                      </div>
                      <div className="flex-1 min-w-[90px] px-2 py-2 flex items-center justify-center">
                        <p className="text-xs font-semibold text-[#385459]">Day 3</p>
                      </div>
                    </div>
                  </div>

                  {/* Breakfast Row */}
                  <div className="flex border-b border-[#DFE3E4]">
                    <div className="w-20 shrink-0 border-r border-[#DFE3E4] px-2 py-2 flex items-center bg-[#F8F9F9]">
                      <p className="text-xs font-semibold text-[#385459]">Breakfast</p>
                    </div>
                    <div className="flex flex-1">
                      <div className="bg-[#E1F5FC] h-12 flex-1 min-w-[90px] border-r border-[#DFE3E4]" />
                      <div className="bg-[#E1F5FC] h-12 flex-1 min-w-[90px] border-r border-[#DFE3E4]" />
                      <div className="bg-[#E1F5FC] h-12 flex-1 min-w-[90px]" />
                    </div>
                  </div>

                  {/* Lunch Row */}
                  <div className="flex border-b border-[#DFE3E4]">
                    <div className="w-20 shrink-0 border-r border-[#DFE3E4] px-2 py-2 flex items-center bg-[#F8F9F9]">
                      <p className="text-xs font-semibold text-[#385459]">Lunch</p>
                    </div>
                    <div className="flex flex-1">
                      <div className="bg-[#E1F5FC] h-12 flex-1 min-w-[90px] border-r border-[#DFE3E4]" />
                      <div className="bg-[#E1F5FC] h-12 flex-1 min-w-[90px] border-r border-[#DFE3E4]" />
                      <div className="bg-[#E1F5FC] h-12 flex-1 min-w-[90px]" />
                    </div>
                  </div>

                  {/* Dinner Row */}
                  <div className="flex border-b border-[#DFE3E4]">
                    <div className="w-20 shrink-0 border-r border-[#DFE3E4] px-2 py-2 flex items-center bg-[#F8F9F9]">
                      <p className="text-xs font-semibold text-[#385459]">Dinner</p>
                    </div>
                    <div className="flex flex-1">
                      <div className="bg-[#E1F5FC] h-12 flex-1 min-w-[90px] border-r border-[#DFE3E4]" />
                      <div className="bg-[#E1F5FC] h-12 flex-1 min-w-[90px] border-r border-[#DFE3E4]" />
                      <div className="bg-[#E1F5FC] h-12 flex-1 min-w-[90px]" />
                    </div>
                  </div>

                  {/* Snacks Row */}
                  <div className="flex">
                    <div className="w-20 shrink-0 border-r border-[#DFE3E4] px-2 py-2 flex items-center bg-[#F8F9F9]">
                      <p className="text-xs font-semibold text-[#385459]">Snacks</p>
                    </div>
                    <div className="flex flex-1">
                      <div className="bg-[#E1F5FC] h-12 flex-1 min-w-[90px] border-r border-[#DFE3E4]" />
                      <div className="bg-[#E1F5FC] h-12 flex-1 min-w-[90px] border-r border-[#DFE3E4]" />
                      <div className="bg-[#E1F5FC] h-12 flex-1 min-w-[90px]" />
                    </div>
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
