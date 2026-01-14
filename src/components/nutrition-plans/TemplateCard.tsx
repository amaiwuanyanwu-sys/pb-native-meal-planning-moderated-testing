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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      {/* Image Grid - 2x2 placeholder */}
      <div className="aspect-[4/3] bg-gray-100 grid grid-cols-2 gap-0.5 p-0.5">
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
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span className="material-icons text-sm">event</span>
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-icons text-sm">restaurant</span>
            <span>{recipeCount} recipes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
