import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import nlp from 'compromise';
import { IconButton } from '@/components/ui/IconButton';
import { Tabs } from '@/components/ui/Tabs';
import { Chip } from '@/components/ui/Chip';
import { SearchDropdown } from '@/components/ui/SearchDropdown';
import { WizardLayout } from '@/components/wizard/WizardLayout';
import { WizardHeader } from '@/components/wizard/WizardHeader';
import { masterIngredients } from '@/data/masterIngredients';
import { ALL_TAGS, INGREDIENT_TAGS, getIngredientsByTag, getIngredientTags, tagPatterns, type IngredientTag } from '@/data/ingredientTags';
import { clearWizardData } from '@/utils/wizardUtils';

const Step2AllergensExclusions: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search');

  // Convert master ingredients to a sorted array of ingredient names
  const allIngredients = useMemo(() => {
    return masterIngredients
      .map(ingredient => ingredient.Ingredients)
      .filter((name): name is string => typeof name === 'string' && name.length > 0)
      .sort((a, b) => a.localeCompare(b));
  }, []);

  // Load saved tags from localStorage
  const [selectedTags, setSelectedTags] = useState<IngredientTag[]>(() => {
    const stored = localStorage.getItem('wizard_selectedTags');
    if (!stored) {
      // If no saved tags, check Step 1 food preferences and auto-select matching allergen tags
      const foodPrefsStored = localStorage.getItem('wizard_foodPreferences');
      if (foodPrefsStored) {
        try {
          const foodPrefs = JSON.parse(foodPrefsStored);
          const autoSelectedTags: IngredientTag[] = [];

          // Map dietary preferences to allergen tags
          const dietaryToAllergenMap: Record<string, IngredientTag> = {
            'Dairy-free': INGREDIENT_TAGS.DAIRY,
            'Gluten-free': INGREDIENT_TAGS.GLUTEN,
            'Vegan': INGREDIENT_TAGS.DAIRY, // Vegan excludes dairy, eggs, and meat
            'Vegetarian': INGREDIENT_TAGS.MEAT, // Vegetarian excludes meat, poultry, fish, shellfish
            'Pescetarian': INGREDIENT_TAGS.MEAT, // Pescetarian excludes meat and poultry
          };

          // Check dietary preferences
          if (foodPrefs.dietary) {
            foodPrefs.dietary.forEach((pref: string) => {
              if (dietaryToAllergenMap[pref]) {
                autoSelectedTags.push(dietaryToAllergenMap[pref]);
              }
              // Special cases for multiple exclusions
              if (pref === 'Vegan') {
                autoSelectedTags.push(INGREDIENT_TAGS.EGGS, INGREDIENT_TAGS.MEAT, INGREDIENT_TAGS.POULTRY, INGREDIENT_TAGS.FISH, INGREDIENT_TAGS.SHELLFISH);
              }
              if (pref === 'Vegetarian') {
                autoSelectedTags.push(INGREDIENT_TAGS.POULTRY, INGREDIENT_TAGS.FISH, INGREDIENT_TAGS.SHELLFISH);
              }
              if (pref === 'Pescetarian') {
                autoSelectedTags.push(INGREDIENT_TAGS.POULTRY);
              }
            });
          }

          // Remove duplicates and save
          const uniqueTags = [...new Set(autoSelectedTags)];
          if (uniqueTags.length > 0) {
            localStorage.setItem('wizard_selectedTags', JSON.stringify(uniqueTags));
          }
          return uniqueTags;
        } catch {
          return [];
        }
      }
      return [];
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });

  // Load saved individual ingredients from localStorage
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(() => {
    const stored = localStorage.getItem('wizard_allergens');
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });

  // Load saved description from localStorage
  const [describeText, setDescribeText] = useState(() => {
    return localStorage.getItem('wizard_allergensDescription') || '';
  });

  // Loading state for apply button
  const [isApplying, setIsApplying] = useState(false);

  // Parse description text and update selections
  const parseDescription = async (text: string) => {
    if (!text.trim()) {
      return;
    }

    // Set loading state
    setIsApplying(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Use Compromise to extract nouns and important terms
    const doc = nlp(text);

    // Extract nouns (food items are typically nouns)
    const nouns = doc.nouns().out('array') as string[];

    // Extract terms after common food-related verbs/phrases
    const avoidTerms = doc.match('(avoid|exclude|no|without|allergic to|cant eat|cannot eat) #Noun+').out('array') as string[];

    // Combine all extracted terms
    const extractedTerms = [...nouns, ...avoidTerms].map(term => term.toLowerCase());

    // Also use the original normalized text for fallback matching
    const normalizedText = text
      .toLowerCase()
      .replace(/[,;]/g, ' ')
      .replace(/\band\b/g, ' ')
      .replace(/\bor\b/g, ' ');

    // Create word boundary regex for better matching
    const createWordBoundaryRegex = (term: string) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${escaped}s?\\b`, 'i');
    };

    const newTags = new Set<IngredientTag>();
    const newAllergens = new Set<string>();

    // Check for group matches using both extracted terms and normalized text
    ALL_TAGS.forEach(tag => {
      const patterns = tagPatterns[tag];
      const hasMatch = patterns.some(pattern => {
        const regex = createWordBoundaryRegex(pattern);
        // Check in normalized text
        if (regex.test(normalizedText)) return true;
        // Also check in extracted terms
        return extractedTerms.some(term => regex.test(term));
      });

      if (hasMatch) {
        newTags.add(tag);
      }
    });

    // Check for individual ingredient matches
    allIngredients.forEach(ingredient => {
      const regex = createWordBoundaryRegex(ingredient);
      const matchesInText = regex.test(normalizedText);
      const matchesInTerms = extractedTerms.some(term => regex.test(term));

      if (matchesInText || matchesInTerms) {
        // Check if ingredient belongs to a matched group
        const ingredientGroups = getIngredientTags(ingredient);
        const belongsToMatchedGroup = ingredientGroups.some(group => newTags.has(group));

        // Only add if not covered by a group
        if (!belongsToMatchedGroup) {
          newAllergens.add(ingredient);
        }
      }
    });

    // Update state and save to localStorage
    const updatedTags = Array.from(newTags);
    const updatedAllergens = Array.from(newAllergens);

    setSelectedTags(updatedTags);
    setSelectedAllergens(updatedAllergens);

    // Save to localStorage immediately
    localStorage.setItem('wizard_selectedTags', JSON.stringify(updatedTags));
    localStorage.setItem('wizard_allergens', JSON.stringify(updatedAllergens));

    // Clear the textarea
    setDescribeText('');

    // Reset loading state
    setIsApplying(false);
  };

  // Load completed steps from localStorage
  const [completedSteps] = useState<string[]>(() => {
    const stored = localStorage.getItem('wizard_completedSteps');
    return stored ? JSON.parse(stored) : [];
  });

  const tabs = [
    { id: 'search', label: 'Search' },
    { id: 'describe', label: 'List' }
  ];

  // Compute all excluded ingredients (from tags + individual selections)
  const allExcludedIngredients = useMemo(() => {
    const excluded = new Set<string>(selectedAllergens);

    // Add all ingredients from selected tags
    selectedTags.forEach(tag => {
      const ingredientsInTag = getIngredientsByTag(
        masterIngredients as Array<{ Ingredients: string }>,
        tag
      );
      ingredientsInTag.forEach(ingredient => excluded.add(ingredient));
    });

    return Array.from(excluded);
  }, [selectedAllergens, selectedTags]);

  const toggleTag = (tag: IngredientTag) => {
    const isCurrentlySelected = selectedTags.includes(tag);

    if (isCurrentlySelected) {
      // Remove tag
      setSelectedTags(prev => {
        const updated = prev.filter(t => t !== tag);
        localStorage.setItem('wizard_selectedTags', JSON.stringify(updated));
        return updated;
      });
    } else {
      // Add tag
      setSelectedTags(prev => {
        const updated = [...prev, tag];
        localStorage.setItem('wizard_selectedTags', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const toggleAllergen = (allergen: string) => {
    const isCurrentlySelected = selectedAllergens.includes(allergen);
    const ingredientGroups = getIngredientTags(allergen);
    const belongsToSelectedGroup = ingredientGroups.some(group => selectedTags.includes(group));

    if (isCurrentlySelected) {
      // Remove the individual ingredient
      setSelectedAllergens(prev => {
        const updated = prev.filter(a => a !== allergen);
        localStorage.setItem('wizard_allergens', JSON.stringify(updated));
        return updated;
      });
    } else if (belongsToSelectedGroup) {
      // If unchecking an ingredient that belongs to a selected group,
      // deselect the group and explicitly add all OTHER ingredients from that group
      const groupsToRemove = ingredientGroups.filter(group => selectedTags.includes(group));

      // Remove the groups
      setSelectedTags(prev => {
        const updated = prev.filter(tag => !groupsToRemove.includes(tag));
        localStorage.setItem('wizard_selectedTags', JSON.stringify(updated));
        return updated;
      });

      // Add all ingredients from those groups EXCEPT the one being unchecked
      const ingredientsToAdd = new Set<string>();
      groupsToRemove.forEach(group => {
        const ingredientsInGroup = getIngredientsByTag(
          masterIngredients as Array<{ Ingredients: string }>,
          group as IngredientTag
        );
        ingredientsInGroup.forEach(ingredient => {
          if (ingredient !== allergen) {
            ingredientsToAdd.add(ingredient);
          }
        });
      });

      setSelectedAllergens(prev => {
        const updated = [...new Set([...prev, ...ingredientsToAdd])];
        localStorage.setItem('wizard_allergens', JSON.stringify(updated));
        return updated;
      });
    } else {
      // Add the individual ingredient
      setSelectedAllergens(prev => {
        const updated = [...prev, allergen];
        localStorage.setItem('wizard_allergens', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleCancel = () => {
    // Clear all wizard-related data from localStorage
    clearWizardData();
    navigate('/nutrition');
  };

  const handleNext = () => {
    // Mark this step as completed
    const updatedCompleted = [...new Set([...completedSteps, 'allergens-exclusions'])];
    localStorage.setItem('wizard_completedSteps', JSON.stringify(updatedCompleted));

    // Save tags, individual allergens, and description to localStorage
    localStorage.setItem('wizard_selectedTags', JSON.stringify(selectedTags));
    localStorage.setItem('wizard_allergens', JSON.stringify(selectedAllergens));
    localStorage.setItem('wizard_allergensDescription', describeText);

    // Save computed list of all excluded ingredients
    localStorage.setItem('wizard_allExcludedIngredients', JSON.stringify(allExcludedIngredients));

    navigate('/wizard/step-3');
  };

  const handlePrevious = () => {
    navigate('/wizard/step-1');
  };

  // Memoize selected options array to prevent unnecessary re-renders
  const selectedOptions = useMemo(() => {
    return [...selectedAllergens, ...selectedTags];
  }, [selectedAllergens, selectedTags]);

  // Optimized helper function to get unique groups from a list of ingredients
  const getGroupsForIngredients = useMemo(() => {
    return (ingredients: string[]) => {
      const groupsSet = new Set<IngredientTag>();

      ingredients.forEach(ingredient => {
        const tags = getIngredientTags(ingredient);
        tags.forEach(tag => groupsSet.add(tag));
      });

      return Array.from(groupsSet);
    };
  }, []);

  // Function to check if an ingredient belongs to any selected group
  const isIngredientInSelectedGroup = useMemo(() => {
    return (ingredient: string) => {
      const ingredientGroups = getIngredientTags(ingredient);
      return ingredientGroups.some(group => selectedTags.includes(group));
    };
  }, [selectedTags]);

  // Get individual ingredients to display as chips (excluding those covered by selected groups)
  const individualIngredientsToDisplay = useMemo(() => {
    return selectedAllergens.filter(ingredient => !isIngredientInSelectedGroup(ingredient));
  }, [selectedAllergens, isIngredientInSelectedGroup]);

  return (
    <WizardLayout currentStep="allergens-exclusions" completedSteps={completedSteps as any}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <WizardHeader />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto flex justify-center">
          <div className="w-full max-w-[678px] px-6 py-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-[#01272E]">Exclude allergens or ingredients</h1>
              <p className="text-base font-medium text-[#657A7E]">
                We'll filter these out when showing recipes.
              </p>
            </div>

            {/* Tabs and Content */}
            <div className="flex flex-col gap-3">
              <div>
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
              </div>

              {/* Search Tab Content */}
              {activeTab === 'search' && (
                <div className="flex flex-col gap-4">
                  <div className="bg-white border border-[#DFE3E4] rounded p-3">
                    <SearchDropdown
                      placeholder="Search ingredients, allergens or food groups"
                      options={allIngredients}
                      selectedOptions={selectedOptions}
                      groups={ALL_TAGS}
                      onOptionToggle={(option) => {
                        // Check if it's a tag or individual ingredient
                        if (ALL_TAGS.includes(option as IngredientTag)) {
                          toggleTag(option as IngredientTag);
                        } else {
                          toggleAllergen(option);
                        }
                      }}
                      variant="stretch"
                      chipVariant="exclusion"
                      getGroupsForIngredients={getGroupsForIngredients}
                      isIngredientInSelectedGroup={isIngredientInSelectedGroup}
                    />
                  </div>

                  {/* Allergen Chips */}
                  <div className="flex flex-col gap-3">
                    {/* Groups */}
                    <div className="flex flex-wrap gap-3">
                      {ALL_TAGS.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          variant="exclusion"
                          selected={selectedTags.includes(tag)}
                          onClick={() => toggleTag(tag)}
                        />
                      ))}
                    </div>

                    {/* Individual Ingredients */}
                    {individualIngredientsToDisplay.length > 0 && (
                      <>
                        <div className="h-px bg-[#DFE3E4]" />
                        <div className="flex flex-wrap gap-3">
                          {individualIngredientsToDisplay.map((ingredient) => (
                            <Chip
                              key={ingredient}
                              label={ingredient}
                              variant="exclusion-removable"
                              selected={true}
                              onClick={() => toggleAllergen(ingredient)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Describe Tab Content */}
              {activeTab === 'describe' && (
                <div className="flex flex-col gap-4">
                  {/* Text Area */}
                  <div className="bg-white border border-[#DFE3E4] rounded flex flex-col focus-within:border-[#007CB2] focus-within:border-2">
                    <textarea
                      placeholder="e.g. Sesame, mustard, citrus, all seafood etc"
                      value={describeText}
                      onChange={(e) => setDescribeText(e.target.value)}
                      className={`h-20 p-4 text-sm font-medium placeholder-[#657A7E] bg-transparent border-none outline-none resize-none ${
                        describeText.trim() ? 'text-[#244348]' : 'text-[#657A7E]'
                      }`}
                    />
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[#DFE3E4]">
                      <button className="flex items-center gap-1 h-8 px-2 pr-3.5 py-1.5 border border-[#96A5A8] rounded bg-white hover:bg-[#F0F2F3] transition-colors">
                        <span className="material-icons text-xl text-[#385459]">attach_file</span>
                        <span className="text-sm font-medium text-[#01272E]">Upload file</span>
                      </button>
                      <button
                        onClick={() => parseDescription(describeText)}
                        disabled={!describeText.trim() || isApplying}
                        className="flex items-center justify-center gap-2 h-8 px-4 py-2 bg-white border border-[#01272E] text-[#01272E] rounded hover:bg-[#F0F2F3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                      >
                        {isApplying && (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        <span className="text-sm font-semibold">{isApplying ? 'Applying...' : 'Apply'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Allergen Chips */}
                  <div className="flex flex-col gap-3">
                    {/* Groups */}
                    <div className="flex flex-wrap gap-3">
                      {ALL_TAGS.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          variant="exclusion"
                          selected={selectedTags.includes(tag)}
                          onClick={() => toggleTag(tag)}
                        />
                      ))}
                    </div>

                    {/* Individual Ingredients */}
                    {individualIngredientsToDisplay.length > 0 && (
                      <>
                        <div className="h-px bg-[#DFE3E4]" />
                        <div className="flex flex-wrap gap-3">
                          {individualIngredientsToDisplay.map((ingredient) => (
                            <Chip
                              key={ingredient}
                              label={ingredient}
                              variant="exclusion-removable"
                              selected={true}
                              onClick={() => toggleAllergen(ingredient)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
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

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="bg-[#01272E] rounded h-10 flex items-center gap-1 px-2 pr-4 py-2.5 hover:bg-[#244348] transition-colors"
            >
              <span className="material-icons text-2xl text-white">keyboard_arrow_right</span>
              <p className="text-sm font-semibold text-white">Next: Choose recipes</p>
            </button>
          </div>
        </div>
      </div>
    </WizardLayout>
  );
};

export default Step2AllergensExclusions;
