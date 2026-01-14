import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { LeftSideRail } from '@/components/layout/LeftSideRail';
import { EmptyStateCard } from '@/components/nutrition-plans/EmptyStateCard';
import { TemplateCard } from '@/components/nutrition-plans/TemplateCard';
import { Button } from '@/components/ui/Button';

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
          <div className="max-w-7xl mx-auto p-6">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-6">
              <button className="p-1 hover:bg-gray-200 rounded">
                <span className="material-icons text-gray-600">chevron_left</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="material-icons text-teal-700">restaurant</span>
                <h1 className="text-2xl font-bold text-gray-900">Nutrition Plans</h1>
              </div>
            </div>

            {/* Empty State Card */}
            <div className="mb-8">
              <EmptyStateCard />
            </div>

            {/* Templates Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-icons text-gray-700">grid_view</span>
                <h2 className="text-lg font-semibold text-gray-900">Browse our templates</h2>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    title={template.title}
                    duration={template.duration}
                    recipeCount={template.recipeCount}
                  />
                ))}
              </div>

              {/* View More Link */}
              <div className="text-center">
                <Button variant="link" className="text-gray-600">
                  View more templates
                  <span className="material-icons text-sm ml-1">chevron_right</span>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NutritionPlans;
