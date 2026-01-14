import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { LeftSideRail } from '@/components/layout/LeftSideRail';
import { EmptyStateCard } from '@/components/nutrition-plans/EmptyStateCard';
import { TemplateCard } from '@/components/nutrition-plans/TemplateCard';

const NutritionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20.0005 10.0001C19.315 8.83021 18.2051 7.96957 16.9014 7.59708C15.5976 7.2246 14.2005 7.36892 13.0005 8.00005V3.00005H11.0005V8.00005C9.80048 7.36892 8.40336 7.2246 7.09966 7.59708C5.79595 7.96957 4.68597 8.83021 4.0005 10.0001C2.0005 13.0001 7.0005 22 9.0005 22C11.0005 22 11.0005 21 12.0005 21C13.0005 21 13.0005 22 15.0005 22C17.0005 22 22.0005 13.0001 20.0005 10.0001ZM18.2505 13.3801C17.6305 15.8501 16.4105 18.12 14.7005 20C14.5005 20 14.2705 19.9 14.1005 19.75C13.5061 19.2695 12.7649 19.0073 12.0005 19.0073C11.2361 19.0073 10.4949 19.2695 9.9005 19.75C9.7305 19.9 9.50051 20 9.30051 20C7.58689 18.1255 6.36688 15.8539 5.7505 13.3901C5.5005 12.6601 5.4505 11.8701 5.6605 11.1201C5.94513 10.6126 6.3563 10.1874 6.85398 9.88603C7.35167 9.58461 7.91891 9.41719 8.5005 9.40005C9.0605 9.41005 9.6105 9.54005 10.1105 9.79005L11.0005 10.2401H13.0005L13.8905 9.79005C14.3905 9.54005 14.9405 9.41005 15.5005 9.40005C16.6805 9.43005 17.7605 10.0801 18.3405 11.1101C18.5505 11.8601 18.5005 12.6501 18.2505 13.3801ZM11.0005 5.00005C5.38051 8.07005 4.11051 3.78005 4.11051 3.78005C4.11051 3.78005 6.7705 0.190051 11.0005 5.00005Z" fill="currentColor"/>
  </svg>
);

const templates = [
  {
    id: 1,
    title: 'Lung Health Support Program',
    duration: '7 days',
    recipeCount: 22
  },
  {
    id: 2,
    title: 'Plant Based GLP-1 Support Diet',
    duration: '7 days',
    recipeCount: 22
  },
  {
    id: 3,
    title: 'GLP-1 Support Diet',
    duration: '7 days',
    recipeCount: 22
  }
];

const NutritionPlans: React.FC = () => {
  const [recentItems, setRecentItems] = React.useState<Array<{ id: string; label: string; path: string }>>([]);

  const handleRecentItemClick = (item: { id: string; label: string; path: string }) => {
    // Handle recent item click if needed
    console.log('Recent item clicked:', item);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Left Side Rail */}
      <LeftSideRail
        recentItems={recentItems}
        onRecentItemClick={handleRecentItemClick}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto p-8" style={{ maxWidth: '976px' }}>
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8">
                  <NutritionIcon className="text-[#385459] w-full h-full" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Nutrition Plans</h1>
              </div>
            </div>

            {/* Empty State Card */}
            <div className="mb-8">
              <EmptyStateCard />
            </div>

            {/* Templates Widget */}
            <div className="bg-white rounded-lg border border-[#C1C9CB] overflow-hidden">
              {/* Widget Header */}
              <div className="bg-white border-b border-[#DFE3E4] px-4 py-2 h-14 flex items-center">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-[#244348] text-2xl">grid_view</span>
                  <h2 className="text-sm font-semibold text-[#244348]">
                    Browse our templates
                  </h2>
                </div>
              </div>

              {/* Widget Body - Templates Grid */}
              <div className="bg-white p-4 flex gap-4">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    title={template.title}
                    duration={template.duration}
                    recipeCount={template.recipeCount}
                  />
                ))}
              </div>

              {/* Widget Footer - View More Button */}
              <button className="bg-[#F0F2F3] border-t border-[#C1C9CB] w-full flex items-center justify-center py-2.5 px-4 hover:bg-[#DFE3E4] transition-colors">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-[#385459] leading-[1.4]">View more templates</span>
                  <span className="material-icons text-[#385459] text-xl">keyboard_arrow_right</span>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NutritionPlans;
