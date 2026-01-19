import React from 'react';
import { Tag } from '@/components/ui/Tag';

interface TemplateCardProps {
  title: string;
  duration: string;
  recipeCount: number;
  imageUrls?: string[];
  tag?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  title,
  duration,
  recipeCount,
  imageUrls = [],
  tag,
  size = 'md',
  onClick
}) => {
  const renderImages = () => {
    // No images - show placeholder grid
    if (imageUrls.length === 0) {
      return (
        <>
          <div className="bg-gray-200" />
          <div className="bg-gray-300" />
          <div className="bg-gray-300" />
          <div className="bg-gray-200" />
        </>
      );
    }

    // 1 image - full grid
    if (imageUrls.length === 1) {
      return (
        <img
          src={imageUrls[0]}
          alt={title}
          className="w-full h-full object-cover col-span-2 row-span-2"
        />
      );
    }

    // 2 images - side by side
    if (imageUrls.length === 2) {
      return (
        <>
          <img
            src={imageUrls[0]}
            alt={`${title} - Image 1`}
            className="w-full h-full object-cover col-span-1 row-span-2"
          />
          <img
            src={imageUrls[1]}
            alt={`${title} - Image 2`}
            className="w-full h-full object-cover col-span-1 row-span-2"
          />
        </>
      );
    }

    // 3 images - 2 on top, 1 on bottom
    if (imageUrls.length === 3) {
      return (
        <>
          <img
            src={imageUrls[0]}
            alt={`${title} - Image 1`}
            className="w-full h-full object-cover"
          />
          <img
            src={imageUrls[1]}
            alt={`${title} - Image 2`}
            className="w-full h-full object-cover"
          />
          <img
            src={imageUrls[2]}
            alt={`${title} - Image 3`}
            className="w-full h-full object-cover col-span-2"
          />
        </>
      );
    }

    // 4 images - 2x2 grid
    return (
      <>
        {imageUrls.slice(0, 4).map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`${title} - Image ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ))}
      </>
    );
  };

  const imageHeight = size === 'sm' ? 'h-[120px]' : 'h-43';
  const titleSize = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div
      className="bg-white rounded-lg border border-[#DFE3E4] overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Image Grid - 2x2 */}
      <div className={`${imageHeight} border-b border-[#DFE3E4] grid grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden`}>
        {renderImages()}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className={`${titleSize} font-semibold text-[#244348] mb-1 leading-normal`}>
          {title}
        </h3>
        <div className="flex items-center gap-2 text-xs font-medium text-[#657A7E]">
          <div className="flex items-center gap-0.5">
            <span className="material-icons" style={{ fontSize: '16px' }}>event</span>
            <span className="leading-normal">{duration}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="material-icons" style={{ fontSize: '16px' }}>restaurant</span>
            <span className="leading-normal">{recipeCount} recipes</span>
          </div>
        </div>
        {tag && (
          <div className="mt-2">
            <Tag label={tag} type="informational" accentColor="lake" />
          </div>
        )}
      </div>
    </div>
  );
};
