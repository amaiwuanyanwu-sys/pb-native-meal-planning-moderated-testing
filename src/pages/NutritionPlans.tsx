import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { LeftSideRail } from '@/components/layout/LeftSideRail';
import { Tabs } from '@/components/ui/Tabs';
import { Search } from '@/components/ui/Search';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PlanListItem } from '@/components/nutrition-plans/PlanListItem';
import { EmptyStateCard } from '@/components/nutrition-plans/EmptyStateCard';
import { TemplateCard } from '@/components/nutrition-plans/TemplateCard';
import { loadPlans, deletePlan } from '@/data/mockNutritionPlans';
import type { NutritionPlan } from '@/data/mockNutritionPlans';
import { mockUsers } from '@/data/mockUsers';

const NutritionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M26.6674 13.3334C25.7534 11.7736 24.2735 10.6261 22.5352 10.1294C20.7968 9.63281 18.9340 9.82523 17.3340 10.6667V4.00005H14.6674V10.6667C13.0674 9.82523 11.2045 9.63281 9.46623 10.1294C7.72796 10.6261 6.24796 11.7736 5.33398 13.3334C2.66732 17.3334 9.33398 29.3334 12.0007 29.3334C14.6673 29.3334 14.6673 28.0001 16.0007 28.0001C17.334 28.0001 17.334 29.3334 20.0007 29.3334C22.6673 29.3334 29.334 17.3334 26.6674 13.3334ZM24.334 17.8401C23.5074 21.1334 21.8807 24.16 19.6007 26.6667C19.334 26.6667 19.0273 26.5334 18.8007 26.3334C18.0081 25.6927 17.0198 25.343 16.0007 25.343C14.9815 25.343 13.9932 25.6927 13.2007 26.3334C12.974 26.5334 12.6673 26.6667 12.4007 26.6667C10.1159 24.1674 8.48919 21.1385 7.66732 17.8534C7.33398 16.8801 7.26732 15.8267 7.54732 14.8267C7.92686 14.1501 8.47509 13.5832 9.13865 13.1814C9.80222 12.7795 10.5586 12.5562 11.334 12.5334C12.0807 12.5467 12.814 12.72 13.4807 13.0534L14.6674 13.6534H17.334L18.5207 13.0534C19.1873 12.72 19.9207 12.5467 20.6673 12.5334C22.2407 12.5734 23.6807 13.4401 24.454 14.8134C24.734 15.8134 24.6673 16.8667 24.334 17.8401ZM14.6674 6.66672C7.17398 10.76 5.48065 5.04005 5.48065 5.04005C5.48065 5.04005 9.02732 0.253384 14.6674 6.66672Z" fill="currentColor" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 14H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 14H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 14H16.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 18H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 18H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 18H16.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface ClientPlan {
  id: string;
  title: string;
  metadata: string;
  avatarType?: 'image' | 'initials';
  avatarSrc?: string;
  avatarInitials?: string;
  avatarBgColor?: string;
  status?: 'private' | 'shared';
}

interface Template {
  id: string;
  title: string;
  metadata: string;
  templateIconBgColor?: string;
  templateIconColor?: string;
  status?: 'private' | 'shared';
  author?: {
    initials?: string;
    imageSrc?: string;
    bgColor?: string;
  };
}

// Helper function to format relative dates
const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHrs < 1) return 'just now';
  if (diffHrs < 24) return `${diffHrs} hrs ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

const browsableTemplates = [
  {
    id: 1,
    title: 'Lung Health Support Program',
    duration: '7 days',
    recipeCount: 22,
    imageUrls: [
      '/src/assets/Recipe Images/coconut-turmeric-cauliflower-bowls.jpg',
      '/src/assets/Recipe Images/sweet-dijon-garden-salad.jpg',
      '/src/assets/Recipe Images/steamed-broccoli.jpg',
      '/src/assets/Recipe Images/tart-cherry-limeade.jpg'
    ]
  },
  {
    id: 2,
    title: 'Plant Based GLP-1 Support Diet',
    duration: '7 days',
    recipeCount: 22,
    imageUrls: [
      '/src/assets/Recipe Images/mediterranean-roasted-tomato-chickpea-bowl.jpg',
      '/src/assets/Recipe Images/lentil-feta-tabbouleh.jpg',
      '/src/assets/Recipe Images/overnight-oats-with-berries-walnuts.jpg',
      '/src/assets/Recipe Images/hummus-toast-with-avocado.jpg'
    ]
  },
  {
    id: 3,
    title: 'GLP-1 Support Diet',
    duration: '7 days',
    recipeCount: 22,
    imageUrls: [
      '/src/assets/Recipe Images/grilled-bruschetta-chicken.jpg',
      '/src/assets/Recipe Images/mediterranean-turkey-rice-bowl.jpg',
      '/src/assets/Recipe Images/salmon-cucumber-bites.jpg',
      '/src/assets/Recipe Images/greek-yogurt-almonds-cherries.jpg'
    ]
  }
];

interface RecentItem {
  id: string;
  label: string;
  path: string;
  type?: 'client' | 'template';
  avatarInitials?: string;
  avatarBgColor?: string;
  templateIconBgColor?: string;
  templateIconColor?: string;
}

const NutritionPlans: React.FC = () => {
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [activeTab, setActiveTab] = useState('client-plans');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');

  // Load saved plans from localStorage
  const [savedPlans, setSavedPlans] = useState<NutritionPlan[]>([]);

  // Function to load plans (can be called on mount and after delete)
  const refreshPlans = () => {
    const plans = loadPlans();
    setSavedPlans(plans);

    // Populate recent items with the most recently updated plans (up to 5)
    const recentPlans = [...plans]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(plan => {
        const user = mockUsers.find(u => u.id === plan.clientId);
        const label = plan.type === 'client'
          ? (user ? `${user.name}'s Nutrition Plan` : 'Nutrition Plan')
          : (plan.templateName || 'Untitled Template');

        return {
          id: plan.id,
          label,
          path: `/nutrition/plans/${plan.id}`,
          type: plan.type,
          ...(plan.type === 'client' && user ? {
            avatarInitials: user.initials,
            avatarBgColor: user.avatarColor,
          } : {}),
          ...(plan.type === 'template' ? {
            templateIconBgColor: '#CFF6DC',
            templateIconColor: '#007820',
          } : {}),
        };
      });

    setRecentItems(recentPlans);
  };

  useEffect(() => {
    refreshPlans();
  }, []);

  // Check if user has created any plans
  const hasPlans = savedPlans.length > 0;

  // Transform saved plans to match PlanListItem props
  const clientPlans: ClientPlan[] = savedPlans
    .filter(plan => plan.type === 'client')
    .map(plan => {
      const user = mockUsers.find(u => u.id === plan.clientId);
      const recipeCount = plan.recipeIds.length;
      const mealPlans = plan.mealPlan.includesMealPlan ? 1 : 0;

      return {
        id: plan.id,
        title: user ? `${user.name}'s Nutrition Plan` : 'Nutrition Plan',
        metadata: `You edited ${formatDate(plan.updatedAt)} • ${recipeCount} recipes${mealPlans > 0 ? ` • ${mealPlans} meal plan${mealPlans > 1 ? 's' : ''}` : ''}`,
        avatarType: 'initials' as const,
        avatarInitials: user?.initials || '??',
        avatarBgColor: user?.avatarColor || '#657A7E',
        status: 'private' as const,
      };
    });

  const templates: Template[] = savedPlans
    .filter(plan => plan.type === 'template')
    .map(plan => {
      const recipeCount = plan.recipeIds.length;
      const mealPlans = plan.mealPlan.includesMealPlan ? 1 : 0;

      return {
        id: plan.id,
        title: plan.templateName || 'Untitled Template',
        metadata: `Created by you • ${recipeCount} recipes${mealPlans > 0 ? ` • ${mealPlans} meal plan${mealPlans > 1 ? 's' : ''}` : ''}`,
        templateIconBgColor: '#CFF6DC',
        templateIconColor: '#007820',
        status: 'private' as const,
        author: {
          initials: 'CM',
          imageSrc: 'https://i.pravatar.cc/150?img=47',
        },
      };
    });

  const handleRecentItemClick = (item: RecentItem) => {
    console.log('Recent item clicked:', item);
  };

  const handleDeletePlan = (planId: string) => {
    deletePlan(planId);
    refreshPlans();
  };

  const tabs = [
    { id: 'client-plans', label: 'Client plans' },
    { id: 'templates', label: 'Templates' },
  ];

  const filterOptions = activeTab === 'client-plans'
    ? [
      { value: 'all', label: 'All plans' },
      { value: 'recent', label: 'Shared plans' },
      { value: 'archived', label: 'Private plans' },
    ]
    : [
      { value: 'all', label: 'All templates' },
      { value: 'my-templates', label: 'My templates' },
      { value: 'shared', label: 'Shared templates' },
    ];

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
              <div className="flex flex-1 items-center gap-2">
                <div className="w-8 h-8">
                  <NutritionIcon className="text-[#385459] w-full h-full" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Nutrition Plans</h1>
              </div>

              {!!hasPlans && <Button icon={<span className="material-icons text-2xl">add</span>} variant="primary" size="md">
                New nutrition plan
              </Button>}

            </div>

            {/* Conditional Rendering: Empty State or Plans View */}
            {!hasPlans ? (
              <>
                {/* Empty State Card */}
                <div className="mb-8">
                  <EmptyStateCard />
                </div>

                {/* Templates Widget */}
                <div className="bg-white rounded-lg border border-[#C1C9CB] overflow-hidden">
                  {/* Widget Header */}
                  <div className="bg-white border-b border-[#DFE3E4] px-4 py-2 h-14 flex items-center">
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-[#244348] text-2xl">dashboard</span>
                      <h2 className="text-sm font-semibold text-[#244348]">
                        Browse our templates
                      </h2>
                    </div>
                  </div>

                  {/* Widget Body - Templates Grid */}
                  <div className="bg-white p-4 grid grid-cols-3 gap-4">
                    {browsableTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        title={template.title}
                        duration={template.duration}
                        recipeCount={template.recipeCount}
                        imageUrls={template.imageUrls}
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
              </>
            ) : (
              <>
                {/* Tabs and Content */}
                <div className="flex flex-col gap-3">
                  {/* Tabs */}
                  <div>
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                  </div>

                  {/* Search and Filter */}
                  <div className="flex gap-3">
                    <Search
                      placeholder="Search"
                      value={searchQuery}
                      onChange={setSearchQuery}
                      variant="stretch"
                    />
                    <div className="w-[216px] flex-shrink-0">
                      <Select
                        label="Filter by"
                        value={filterValue}
                        onChange={setFilterValue}
                        options={filterOptions}
                        icon={<CalendarIcon className="w-6 h-6 text-[#385459]" />}
                      />
                    </div>
                  </div>

                  {/* Plans List */}
                  <div className="border border-[#DFE3E4] rounded overflow-hidden">
                    {activeTab === 'client-plans' ? (
                      clientPlans.length > 0 ? (
                        clientPlans.map((plan) => (
                          <PlanListItem
                            key={plan.id}
                            type="client"
                            title={plan.title}
                            metadata={plan.metadata}
                            avatarType={plan.avatarType}
                            avatarInitials={plan.avatarInitials}
                            avatarSrc={plan.avatarSrc}
                            avatarBgColor={plan.avatarBgColor}
                            status={plan.status}
                            onClick={() => navigate(`/nutrition/plans/${plan.id}`)}
                            onDelete={() => handleDeletePlan(plan.id)}
                          />
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-6">
                          <div className="flex flex-col items-center gap-2 max-w-sm text-center">
                            <span className="material-icons text-[#96A5A8] text-5xl mb-2">person_outline</span>
                            <h3 className="text-base font-semibold text-[#244348]">No client plans yet</h3>
                            <p className="text-sm font-medium text-[#657A7E]">
                              Create your first client nutrition plan to get started
                            </p>
                          </div>
                        </div>
                      )
                    ) : (
                      templates.length > 0 ? (
                        templates.map((plan) => (
                          <PlanListItem
                            key={plan.id}
                            type="template"
                            title={plan.title}
                            metadata={plan.metadata}
                            templateIconBgColor={plan.templateIconBgColor}
                            templateIconColor={plan.templateIconColor}
                            status={plan.status}
                            author={plan.author}
                            onClick={() => navigate(`/nutrition/plans/${plan.id}`)}
                            onDelete={() => handleDeletePlan(plan.id)}
                          />
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-6">
                          <div className="flex flex-col items-center gap-2 max-w-sm text-center">
                            <span className="material-icons text-[#96A5A8] text-5xl mb-2">dashboard_customize</span>
                            <h3 className="text-base font-semibold text-[#244348]">No templates yet</h3>
                            <p className="text-sm font-medium text-[#657A7E]">
                              Create your first nutrition plan template to reuse across clients
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NutritionPlans;
