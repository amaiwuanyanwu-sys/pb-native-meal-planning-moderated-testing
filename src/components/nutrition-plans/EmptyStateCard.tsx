import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import nutritionIllustration from '@/assets/nutriton.svg';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: 'auto_awesome',
    title: 'Assisted nutrition planning',
    description: 'Our nutrition plan assistant guides you so you\'re never stuck.'
  },
  {
    icon: 'restaurant',
    title: '7000+ recipes',
    description: 'Choose from a thousands of recipes with easy to use filters.'
  },
  {
    icon: 'calendar_view_month',
    title: 'Multi-week meal plans',
    description: 'Easily create plans that span multiple weeks.'
  }
];

export const EmptyStateCard: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/wizard/step-1');
  };

  return (
    <div className="bg-white rounded-lg border border-[#C1C9CB] overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-[#DFE3E4] px-4 py-2 h-14 flex items-center">
        <div className="flex items-center gap-2">
          <span className="material-icons text-[#244348] text-2xl">grid_view</span>
          <h2 className="text-sm font-semibold text-[#244348]">
            Create your first nutrition plan
          </h2>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white px-4 py-4 flex items-center gap-6">
        {/* Illustration */}
        <div className="shrink-0">
          <div className="w-32 h-50 flex items-center justify-center">
            <img src={nutritionIllustration} alt="Nutrition plan illustration" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Features */}
          <div className="flex flex-col">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 py-2">
                <div className="bg-[#F0F2F3] p-2 rounded flex items-center justify-center w-10 h-10 shrink-0">
                  <span className="material-icons text-[#244348] text-2xl">{feature.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#244348] leading-[1.4]">
                    {feature.title}
                  </h3>
                  <p className="text-xs font-medium text-[#657A7E] leading-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button variant="primary" size="lg" className="w-full h-10" onClick={handleGetStarted}>
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
};
