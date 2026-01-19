import React from 'react';

interface MealPlanCardProps {
  weekNumber: number;
  days: number;
  recipeCount: number;
  status: 'draft' | 'published';
  recipeImages?: string[];
}

export const MealPlanCard: React.FC<MealPlanCardProps> = ({
  weekNumber,
  days,
  recipeCount,
  status,
  recipeImages = []
}) => {
  // Default placeholder images if not enough recipe images are provided
  const defaultImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=200&fit=crop'
  ];

  // Ensure we always have exactly 4 images
  const images = [...recipeImages, ...defaultImages].slice(0, 4);

  return (
    <div className="bg-white rounded-lg border border-[#C1C9CB] overflow-hidden hover:shadow-md transition-shadow cursor-pointer" style={{ width: '280px' }}>
      {/* Image Grid - 2x2 */}
      <div className="w-full h-[140px] bg-gray-200 overflow-hidden grid grid-cols-2 grid-rows-2 gap-0.5">
        {images.map((imageUrl, index) => (
          <div key={index} className="w-full h-full overflow-hidden">
            <img
              src={imageUrl}
              alt={`Recipe ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="text-sm font-semibold text-[#244348]">
          Week {weekNumber}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-[#657A7E]">
          <div className="flex items-center gap-1">
            <span className="material-icons text-base">calendar_today</span>
            <span>{days} days</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-icons text-base">restaurant</span>
            <span>{recipeCount} recipes</span>
          </div>
        </div>

        {/* Status Badge */}
        {status === 'draft' && (
          <div className="inline-flex items-center px-2 py-1 rounded-full bg-[#E8F8FF] border border-[#34B9E0] text-[#0C7791] text-xs font-semibold">
            Draft
          </div>
        )}
      </div>
    </div>
  );
};
