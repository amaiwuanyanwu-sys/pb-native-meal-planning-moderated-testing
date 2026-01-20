import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@/components/ui/IconButton';
import { Chip } from '@/components/ui/Chip';
import { WizardLayout } from '@/components/wizard/WizardLayout';
import { WizardHeader } from '@/components/wizard/WizardHeader';
import { clearWizardData } from '@/utils/wizardUtils';
import { getIngredientTags, INGREDIENT_TAGS } from '@/data/ingredientTags';

const foodPreferences = {
  dietary: [
    'Anti-candida',
    'Auto-immune',
    'Dairy-free',
    'Gluten-free',
    'High fiber',
    'High protein',
    'Ketogenic',
    'Low carb',
    'Low fodmap',
    'Mediterranean',
    'Pescetarian',
    'Paleo',
    'Pureed',
    'Vegan',
    'Vegetarian'
  ],
  cultural: [
    'Asian',
    'Italian',
    'Mexican',
    'Greek',
    'Indian',
    'Thai'
  ],
  effort: [
    'Quick (under 10 mins)',
    'Under 45 mins',
    'One-pan',
    'Slow cooker',
    'Minimal prep',
    'Batch-friendly',
    'Freezer-friendly',
    'Few ingredients',
    'No special equipment'
  ]
};

// Common favorite foods from master ingredients
const baseFavoriteFoods = [
  'Chicken',
  'Salmon',
  'Beef',
  'Tofu',
  'Eggs',
  'Rice',
  'Broccoli',
  'Avocado',
  'Sweet Potato',
  'Greek Yogurt'
];

const Step1FoodPreferences: React.FC = () => {
  const navigate = useNavigate();

  // Load saved preferences from localStorage
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(() => {
    const stored = localStorage.getItem('wizard_foodPreferences');
    if (!stored) return [];
    try {
      const prefs = JSON.parse(stored);
      return [...prefs.dietary, ...prefs.cultural, ...prefs.effort];
    } catch {
      return [];
    }
  });

  // Load completed steps from localStorage
  const [completedSteps] = useState<string[]>(() => {
    const stored = localStorage.getItem('wizard_completedSteps');
    return stored ? JSON.parse(stored) : [];
  });

  // Load selected favorite foods from localStorage
  const [selectedFavoriteFoods, setSelectedFavoriteFoods] = useState<string[]>(() => {
    const stored = localStorage.getItem('wizard_favoriteFoods');
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      // Handle both old format (object with selected/custom) and new format (array)
      if (Array.isArray(parsed)) {
        return parsed;
      } else if (parsed && typeof parsed === 'object' && parsed.selected) {
        return parsed.selected;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Compute filtered favorite foods based on dietary preferences
  const filteredFavoriteFoods = useMemo(() => {
    // Map dietary preferences to tags that should be excluded
    const excludedTags = new Set<string>();

    selectedPreferences.forEach(pref => {
      if (pref === 'Dairy-free') {
        excludedTags.add(INGREDIENT_TAGS.DAIRY);
      } else if (pref === 'Gluten-free') {
        excludedTags.add(INGREDIENT_TAGS.GLUTEN);
      } else if (pref === 'Vegan') {
        excludedTags.add(INGREDIENT_TAGS.DAIRY);
        excludedTags.add(INGREDIENT_TAGS.EGGS);
        excludedTags.add(INGREDIENT_TAGS.MEAT);
        excludedTags.add(INGREDIENT_TAGS.POULTRY);
        excludedTags.add(INGREDIENT_TAGS.FISH);
        excludedTags.add(INGREDIENT_TAGS.SHELLFISH);
      } else if (pref === 'Vegetarian') {
        excludedTags.add(INGREDIENT_TAGS.MEAT);
        excludedTags.add(INGREDIENT_TAGS.POULTRY);
        excludedTags.add(INGREDIENT_TAGS.FISH);
        excludedTags.add(INGREDIENT_TAGS.SHELLFISH);
      } else if (pref === 'Pescetarian') {
        excludedTags.add(INGREDIENT_TAGS.MEAT);
        excludedTags.add(INGREDIENT_TAGS.POULTRY);
      }
    });

    // Filter out foods that belong to excluded tags
    return baseFavoriteFoods.filter(food => {
      const tags = getIngredientTags(food);
      return !tags.some(tag => excludedTags.has(tag));
    });
  }, [selectedPreferences]);

  const togglePreference = (preference: string) => {
    setSelectedPreferences(prev => {
      const updated = prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference];

      // Save to localStorage immediately
      localStorage.setItem('wizard_foodPreferences', JSON.stringify({
        dietary: updated.filter(p => foodPreferences.dietary.includes(p)),
        cultural: updated.filter(p => foodPreferences.cultural.includes(p)),
        effort: updated.filter(p => foodPreferences.effort.includes(p)),
      }));

      return updated;
    });
  };

  const toggleFavoriteFood = (food: string) => {
    setSelectedFavoriteFoods(prev => {
      const updated = prev.includes(food)
        ? prev.filter(f => f !== food)
        : [...prev, food];

      // Save to localStorage immediately
      localStorage.setItem('wizard_favoriteFoods', JSON.stringify(updated));

      return updated;
    });
  };

  const handleCancel = () => {
    clearWizardData();
    navigate('/nutrition');
  };

  const handleNext = () => {
    // Mark this step as completed
    const updatedCompleted = [...new Set([...completedSteps, 'food-preferences'])];
    localStorage.setItem('wizard_completedSteps', JSON.stringify(updatedCompleted));

    // Save food preferences to localStorage
    localStorage.setItem('wizard_foodPreferences', JSON.stringify({
      dietary: selectedPreferences.filter(p => foodPreferences.dietary.includes(p)),
      cultural: selectedPreferences.filter(p => foodPreferences.cultural.includes(p)),
      effort: selectedPreferences.filter(p => foodPreferences.effort.includes(p)),
    }));

    // Save favorite foods to localStorage
    localStorage.setItem('wizard_favoriteFoods', JSON.stringify(selectedFavoriteFoods));

    navigate('/wizard/step-2');
  };

  const handlePrevious = () => {
    navigate('/nutrition');
  };

  return (
    <WizardLayout currentStep="food-preferences" completedSteps={completedSteps as any}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <WizardHeader />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto flex justify-center">
          <div className="w-full max-w-[678px] px-6 py-8 pb-24 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-[#01272E]">Set food preferences</h1>
              <p className="text-base font-medium text-[#657A7E]">
                We'll use this to recommend the right recipes.
              </p>
            </div>

            {/* Preferences Sections */}
            <div className="flex flex-col gap-6">
              {/* Dietary Section */}
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-[#385459]">Dietary</h2>
                <div className="flex flex-wrap gap-3">
                  {foodPreferences.dietary.map((preference) => (
                    <Chip
                      key={preference}
                      label={preference}
                      selected={selectedPreferences.includes(preference)}
                      onClick={() => togglePreference(preference)}
                    />
                  ))}
                </div>
              </div>

              {/* Cultural Section */}
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-[#385459]">Cultural</h2>
                <div className="flex flex-wrap gap-3">
                  {foodPreferences.cultural.map((preference) => (
                    <Chip
                      key={preference}
                      label={preference}
                      selected={selectedPreferences.includes(preference)}
                      onClick={() => togglePreference(preference)}
                    />
                  ))}
                </div>
              </div>

              {/* Effort Section */}
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-[#385459]">Effort</h2>
                <div className="flex flex-wrap gap-3">
                  {foodPreferences.effort.map((preference) => (
                    <Chip
                      key={preference}
                      label={preference}
                      selected={selectedPreferences.includes(preference)}
                      onClick={() => togglePreference(preference)}
                    />
                  ))}
                </div>
              </div>

              {/* Favorite Foods Section */}
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-[#385459]">Favorite foods</h2>
                <div className="flex flex-wrap gap-3">
                  {filteredFavoriteFoods.map((food) => (
                    <Chip
                      key={food}
                      label={food}
                      selected={selectedFavoriteFoods.includes(food)}
                      onClick={() => toggleFavoriteFood(food)}
                    />
                  ))}
                </div>
              </div>
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
              disabled={true}
            />

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="bg-[#01272E] rounded h-10 flex items-center gap-1 px-2 pr-4 py-2.5 hover:bg-[#244348] transition-colors"
            >
              <span className="material-icons text-2xl text-white">keyboard_arrow_right</span>
              <p className="text-sm font-semibold text-white">Next: Allergies & exclusions</p>
            </button>
          </div>
        </div>
      </div>
    </WizardLayout>
  );
};

export default Step1FoodPreferences;
