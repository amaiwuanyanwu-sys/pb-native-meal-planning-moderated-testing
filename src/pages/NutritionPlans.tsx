import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { NutritionIcon } from '@/components/icons/NutritionIcon';

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
      '/assets/Recipe Images/coconut-turmeric-cauliflower-bowls.jpg',
      '/assets/Recipe Images/sweet-dijon-garden-salad.jpg',
      '/assets/Recipe Images/steamed-broccoli.jpg',
      '/assets/Recipe Images/tart-cherry-limeade.jpg'
    ]
  },
  {
    id: 2,
    title: 'Plant Based GLP-1 Support Diet',
    duration: '7 days',
    recipeCount: 22,
    imageUrls: [
      '/assets/Recipe Images/mediterranean-roasted-tomato-chickpea-bowl.jpg',
      '/assets/Recipe Images/lentil-feta-tabbouleh.jpg',
      '/assets/Recipe Images/overnight-oats-with-berries-walnuts.jpg',
      '/assets/Recipe Images/hummus-toast-with-avocado.jpg'
    ]
  },
  {
    id: 3,
    title: 'GLP-1 Support Diet',
    duration: '7 days',
    recipeCount: 22,
    imageUrls: [
      '/assets/Recipe Images/grilled-bruschetta-chicken.jpg',
      '/assets/Recipe Images/mediterranean-turkey-rice-bowl.jpg',
      '/assets/Recipe Images/salmon-cucumber-bites.jpg',
      '/assets/Recipe Images/greek-yogurt-almonds-cherries.jpg'
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
  const location = useLocation();
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');

  // Load saved plans from localStorage - initialize synchronously to prevent flicker
  const [savedPlans, setSavedPlans] = useState<NutritionPlan[]>(() => loadPlans());

  // Function to load plans (can be called on mount and after delete)
  const refreshPlans = () => {
    const plans = loadPlans();
    setSavedPlans(plans);

    // Populate recent items with only templates (up to 5) - exclude client plans
    const recentTemplates = [...plans]
      .filter(plan => plan.type === 'template' && !plan.clientId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(plan => {
        return {
          id: plan.id,
          label: plan.templateName || 'Untitled Template',
          path: `/nutrition/plans/${plan.id}`,
          type: plan.type,
          templateIconBgColor: '#CFF6DC',
          templateIconColor: '#007820',
        };
      });

    setRecentItems(recentTemplates);
  };

  // Initialize recent items on mount
  useEffect(() => {
    const plans = savedPlans;
    const recentTemplates = [...plans]
      .filter(plan => plan.type === 'template' && !plan.clientId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(plan => {
        return {
          id: plan.id,
          label: plan.templateName || 'Untitled Template',
          path: `/nutrition/plans/${plan.id}`,
          type: plan.type,
          templateIconBgColor: '#CFF6DC',
          templateIconColor: '#007820',
        };
      });
    setRecentItems(recentTemplates);
  }, []);

  // Refresh plans when navigating back to this page
  useEffect(() => {
    if (location.pathname === '/nutrition') {
      refreshPlans();
    }
  }, [location.pathname]);

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
    navigate(item.path);
  };

  const handleDeletePlan = (planId: string) => {
    deletePlan(planId);
    refreshPlans();
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'client-plans', label: 'Client plans' },
    { id: 'templates', label: 'Templates' },
  ];

  const filterOptions = activeTab === 'all'
    ? [
      { value: 'all', label: 'All plans' },
      { value: 'client-plans', label: 'Client plans' },
      { value: 'templates', label: 'Templates' },
    ]
    : activeTab === 'client-plans'
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
    <div className="flex h-screen bg-[#F8F9F9]">
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
                <NutritionIcon className="text-[#385459]" size={32} />
                <h1 className="text-2xl font-semibold text-[#01272E]">Nutrition Plans</h1>
              </div>

              {!!hasPlans && <Button
                icon={<span className="material-icons text-2xl">add</span>}
                variant="primary"
                size="md"
                onClick={() => navigate('/wizard/step-1')}
              >
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
                    {activeTab === 'all' ? (
                      // Show both client plans and templates
                      clientPlans.length > 0 || templates.length > 0 ? (
                        <>
                          {clientPlans.map((plan) => (
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
                          ))}
                          {templates.map((plan) => (
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
                          ))}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-6">
                          <div className="flex flex-col items-center gap-2 max-w-sm text-center">
                            <span className="material-icons text-[#96A5A8] text-5xl mb-2">folder_open</span>
                            <h3 className="text-base font-semibold text-[#244348]">No plans yet</h3>
                            <p className="text-sm font-medium text-[#657A7E]">
                              Create your first nutrition plan to get started
                            </p>
                          </div>
                        </div>
                      )
                    ) : activeTab === 'client-plans' ? (
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
