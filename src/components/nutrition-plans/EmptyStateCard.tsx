import React from 'react';
import { Button } from '@/components/ui/Button';

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
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="flex items-start gap-6">
        {/* Illustration */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 relative">
            {/* Colorful food icons illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Orange/peach circle */}
                <circle cx="35" cy="30" r="22" fill="#FFA07A" opacity="0.9" />
                {/* Green circle */}
                <circle cx="70" cy="35" r="18" fill="#90EE90" opacity="0.9" />
                {/* White/cream circle with dot */}
                <circle cx="60" cy="60" r="20" fill="#F5F5DC" opacity="0.9" />
                <circle cx="60" cy="60" r="8" fill="#FFFFFF" />
                {/* Yellow circle */}
                <circle cx="35" cy="75" r="20" fill="#FFD700" opacity="0.9" />
                {/* Orange slice shape */}
                <circle cx="75" cy="75" r="18" fill="#FF8C00" opacity="0.9" />
                {/* Add some details to orange */}
                <path d="M75 57 L75 93 M63 69 L87 69 M68 63 L82 81 M68 81 L82 63" stroke="#FFFFFF" strokeWidth="2" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-icons text-gray-700">grid_view</span>
            <h2 className="text-lg font-semibold text-gray-900">
              Create your first nutrition plan
            </h2>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="material-icons text-gray-700 text-xl">{feature.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button variant="primary" size="lg" className="w-full">
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
};
