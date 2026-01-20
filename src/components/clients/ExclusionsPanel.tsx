import React, { useState, useMemo } from 'react';
import { masterIngredients, type Ingredient } from '@/data/masterIngredients';
import { Tag } from '@/components/ui/Tag';

interface ExclusionsPanelProps {
  excludedIngredients?: string[];
  onExclusionsChange?: (exclusions: string[]) => void;
}

export const ExclusionsPanel: React.FC<ExclusionsPanelProps> = ({
  excludedIngredients = [],
  onExclusionsChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localExclusions, setLocalExclusions] = useState<string[]>(excludedIngredients);

  // Filter ingredients based on search term
  const filteredIngredients = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    return masterIngredients
      .filter(ingredient => {
        const name = ingredient.Ingredients?.toLowerCase() || '';
        return name.includes(term);
      })
      .slice(0, 20); // Limit to 20 results
  }, [searchTerm]);

  const handleAddExclusion = (ingredientName: string) => {
    if (!localExclusions.includes(ingredientName)) {
      const newExclusions = [...localExclusions, ingredientName];
      setLocalExclusions(newExclusions);
      onExclusionsChange?.(newExclusions);
      setSearchTerm(''); // Clear search after adding
    }
  };

  const handleRemoveExclusion = (ingredientName: string) => {
    const newExclusions = localExclusions.filter(name => name !== ingredientName);
    setLocalExclusions(newExclusions);
    onExclusionsChange?.(newExclusions);
  };

  return (
    <div className="bg-white rounded-lg border border-[#DFE3E4] overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-[#DFE3E4] h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-icons text-[#657A7E] text-2xl">block</span>
          <h2 className="text-sm font-semibold text-[#244348] leading-[1.4]">
            Exclusions
          </h2>
          {localExclusions.length > 0 && (
            <span className="px-2 py-0.5 bg-[#DFE3E4] rounded-full text-xs font-medium text-[#244348] leading-[1.5]">
              {localExclusions.length}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-4">
        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-[#657A7E] text-xl">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ingredients to exclude..."
              className="w-full pl-10 pr-4 py-2 border border-[#C1C9CB] rounded-lg text-sm text-[#244348] placeholder:text-[#8A9799] focus:outline-none focus:ring-2 focus:ring-[#2B6C76] focus:border-transparent"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchTerm && filteredIngredients.length > 0 && (
            <div className="mt-2 border border-[#DFE3E4] rounded-lg shadow-lg max-h-[300px] overflow-y-auto bg-white">
              {filteredIngredients.map((ingredient, index) => {
                const isExcluded = localExclusions.includes(ingredient.Ingredients);
                return (
                  <button
                    key={index}
                    onClick={() => handleAddExclusion(ingredient.Ingredients)}
                    disabled={isExcluded}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F0F2F3] border-b border-[#DFE3E4] last:border-b-0 flex items-center justify-between ${
                      isExcluded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <span className="text-[#244348] font-medium">
                      {ingredient.Ingredients}
                    </span>
                    {isExcluded && (
                      <span className="text-xs text-[#657A7E]">Already excluded</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {searchTerm && filteredIngredients.length === 0 && (
            <div className="mt-2 p-4 border border-[#DFE3E4] rounded-lg bg-[#F8F9F9] text-center">
              <p className="text-sm text-[#657A7E]">No ingredients found matching "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Current Exclusions */}
        <div>
          {localExclusions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <span className="material-icons text-[#C1C9CB] text-5xl mb-2">block</span>
              <p className="text-sm text-[#657A7E]">No exclusions added</p>
              <p className="text-xs text-[#8A9799] mt-1">Search and add ingredients to exclude</p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold text-[#657A7E] uppercase tracking-wide mb-3">
                Excluded Ingredients
              </p>
              <div className="flex flex-wrap gap-2">
                {localExclusions.map((ingredientName) => (
                  <div
                    key={ingredientName}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F0F2F3] border border-[#DFE3E4] rounded-full"
                  >
                    <span className="text-sm text-[#244348]">{ingredientName}</span>
                    <button
                      onClick={() => handleRemoveExclusion(ingredientName)}
                      className="hover:bg-[#DFE3E4] rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${ingredientName}`}
                    >
                      <span className="material-icons text-[#657A7E] text-base">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
