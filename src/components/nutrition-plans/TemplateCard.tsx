import React from 'react';

interface TemplateCardProps {
  title: string;
  duration: string;
  recipeCount: number;
  imageUrl?: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  title,
  duration,
  recipeCount,
  imageUrl
}) => {
  return (
    <div className="bg-white rounded-lg border border-[#DFE3E4] overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex-1 min-w-62.5">
      {/* Image Grid - 2x2 */}
      <div className="h-43 border-b border-[#DFE3E4] grid grid-cols-2 grid-rows-2 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover col-span-2 row-span-2" />
        ) : (
          <>
            <div className="bg-gray-200" />
            <div className="bg-gray-300" />
            <div className="bg-gray-300" />
            <div className="bg-gray-200" />
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-[#244348] mb-1 leading-normal">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-xs font-medium text-[#657A7E]">
          <div className="flex items-center gap-0.5">
            <span className="material-icons text-[16px]">event</span>
            <span className="leading-normal">{duration}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="material-icons text-[16px]">restaurant</span>
            <span className="leading-normal">{recipeCount} recipes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
