import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagicWandIcon } from '@/components/icons/MagicWandIcon';
import { IconButton } from '@/components/ui/IconButton';

const nutritionGoals = [
  'Lose weight',
  'Improve energy',
  'Build muscle',
  'Manage blood sugar',
  'Improve gut health',
  'Maintain healthy eating',
  'Reduce inflammation',
  'Other'
];

const Step1NutritionGoals: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
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
              <h1 className="text-2xl font-bold text-[#01272E]">Select nutrition goals</h1>
              <p className="text-base font-medium text-[#657A7E]">
                We'll use this to guide preferences for the plan and recipe suggestions.
              </p>
            </div>

            {/* Goals List */}
            <div className="bg-white border border-[#C1C9CB] rounded-lg overflow-hidden">
              {nutritionGoals.map((goal, index) => {
                const isSelected = selectedGoals.includes(goal);
                const isEven = index % 2 === 0;

                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`w-full flex items-center gap-1 p-1 rounded transition-colors ${
                      isEven ? 'bg-white' : 'bg-[#F8F9F9]'
                    } hover:bg-[#DFE3E4]`}
                  >
                    <div className="flex items-center justify-center p-2 w-10 h-10 shrink-0">
                      <span className="material-icons text-xl">
                        {isSelected ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </div>
                    <div className="flex-1 text-left py-2 pr-2">
                      <p className="text-sm font-semibold text-[#244348]">{goal}</p>
                    </div>
                  </button>
                );
              })}
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
              <p className="text-sm font-semibold text-white">Next: Dietary preferences</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1NutritionGoals;
