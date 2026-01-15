import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagicWandIcon } from '@/components/icons/MagicWandIcon';
import { IconButton } from '@/components/ui/IconButton';
import { Chip } from '@/components/ui/Chip';

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
    'African',
    'Asian',
    'Caribbean',
    'Indian',
    'Latin American',
    'Middle eastern'
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

const Step1FoodPreferences: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const togglePreference = (preference: string) => {
    setSelectedPreferences(prev =>
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const handleCancel = () => {
    navigate('/nutrition');
  };

  const handleNext = () => {
    navigate('/wizard/step-2');
  };

  const handlePrevious = () => {
    navigate('/nutrition');
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto flex justify-center">
          <div className="w-full max-w-[678px] px-6 py-8 flex flex-col gap-6">
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
              <p className="text-sm font-semibold text-white">Next: Allergies & exclusions</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1FoodPreferences;
