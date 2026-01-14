import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagicWandIcon } from '@/components/icons/MagicWandIcon';
import { IconButton } from '@/components/ui/IconButton';
import { Tabs } from '@/components/ui/Tabs';
import { Chip } from '@/components/ui/Chip';
import { SearchDropdown } from '@/components/ui/SearchDropdown';

const allergens = ['Dairy', 'Alliums', 'Tree nuts', 'Fish', 'Soy', 'Meat', 'Onions', 'Leeks'];

const Step3AllergensExclusions: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [describeText, setDescribeText] = useState('');

  const tabs = [
    { id: 'search', label: 'Search' },
    { id: 'describe', label: 'Describe' }
  ];

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens(prev =>
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const handleCancel = () => {
    navigate('/nutrition');
  };

  const handleNext = () => {
    navigate('/wizard/step-4');
  };

  const handlePrevious = () => {
    navigate('/wizard/step-2');
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
                <div className="bg-white border border-[#DFE3E4] rounded p-3">
                  <SearchDropdown
                    placeholder="Search ingredients, allergens or food groups"
                    options={allergens}
                    selectedOptions={selectedAllergens}
                    suggestedOptions={allergens}
                    onOptionToggle={toggleAllergen}
                    variant="stretch"
                  />
                </div>
              )}

              {/* Describe Tab Content */}
              {activeTab === 'describe' && (
                <div className="flex flex-col gap-4">
                  {/* Text Area */}
                  <div className="bg-white border border-[#DFE3E4] rounded flex flex-col">
                    <textarea
                      placeholder="What should we avoid?"
                      value={describeText}
                      onChange={(e) => setDescribeText(e.target.value)}
                      className="h-20 p-4 text-sm font-medium text-[#657A7E] placeholder-[#657A7E] bg-transparent border-none outline-none resize-none"
                    />
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[#DFE3E4]">
                      <button className="flex items-center gap-1 h-8 px-2 pr-3.5 py-1.5 border border-[#96A5A8] rounded bg-white hover:bg-[#F0F2F3] transition-colors">
                        <span className="material-icons text-xl text-[#385459]">attach_file</span>
                        <span className="text-sm font-medium text-[#01272E]">Upload file</span>
                      </button>
                      <button className="flex items-center justify-center w-8 h-8 p-2 border border-[#96A5A8] rounded bg-white hover:bg-[#F0F2F3] transition-colors">
                        <span className="material-icons text-xl text-[#385459]">arrow_upward</span>
                      </button>
                    </div>
                  </div>

                  {/* Allergen Chips */}
                  <div className="flex flex-wrap gap-3">
                    {allergens.map((allergen) => (
                      <Chip
                        key={allergen}
                        label={allergen}
                        selected={selectedAllergens.includes(allergen)}
                        onClick={() => toggleAllergen(allergen)}
                      />
                    ))}
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
    </div>
  );
};

export default Step3AllergensExclusions;
