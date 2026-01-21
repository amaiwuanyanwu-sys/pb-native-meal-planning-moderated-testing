import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { LeftSideRail } from '@/components/layout/LeftSideRail';
import { RightSideRail } from '@/components/layout/RightSideRail';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { TemplateCard } from '@/components/nutrition-plans/TemplateCard';
import { Tag } from '@/components/ui/Tag';
import { loadPlans } from '@/data/mockNutritionPlans';
import type { NutritionPlan } from '@/data/mockNutritionPlans';
import { mockUsers } from '@/data/mockUsers';
import { mockRecipes } from '@/data/mockRecipes';

const NutritionPlanView: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<NutritionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'meal-plans' | 'recipe-collection'>('overview');
  const [isRightRailCollapsed, setIsRightRailCollapsed] = useState(true);
  const [rightRailTab, setRightRailTab] = useState<'recipes' | 'preferences' | 'assistant'>('preferences');

  // Recent items for the left sidebar - load from localStorage
  // Must be before early returns to satisfy Rules of Hooks
  const recentItems = React.useMemo(() => {
    const plans = loadPlans();

    // Filter to show only templates (exclude client plans), sort by most recently updated and take top 5
    return [...plans]
      .filter(p => p.type === 'template' && !p.clientId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(p => {
        return {
          id: p.id,
          label: p.templateName || 'Untitled Template',
          path: `/nutrition/plans/${p.id}`,
          type: p.type,
          templateIconBgColor: '#CFF6DC',
          templateIconColor: '#007820',
        };
      });
  }, [planId]); // Recalculate when planId changes

  // Load the plan data
  useEffect(() => {
    const plans = loadPlans();
    const foundPlan = plans.find(p => p.id === planId);

    if (!foundPlan) {
      // If plan not found, redirect to nutrition plans page
      navigate('/nutrition', { replace: true });
      return;
    }

    // If it's a client plan, redirect to the client detail page
    if (foundPlan.type === 'client' && foundPlan.clientId) {
      navigate(`/clients/${foundPlan.clientId}`, { replace: true });
      return;
    }

    // It's a template plan, load it
    setPlan(foundPlan);
    setIsLoading(false);
  }, [planId, navigate]);

  const handleRecentItemClick = (item: { id: string; label: string; path: string }) => {
    navigate(item.path);
  };

  // If plan hasn't loaded yet or is being redirected, don't render anything
  if (isLoading || !plan) {
    return null;
  }

  // Determine plan title based on plan type
  const planTitle = plan.type === 'client'
    ? (() => {
        const user = mockUsers.find(u => u.id === plan.clientId);
        return user ? `${user.name}'s Nutrition Plan` : 'Nutrition Plan';
      })()
    : (plan.templateName || 'Untitled Template');

  const isPrivate = true;

  // Load actual recipes from the plan's recipeIds
  const recipes = mockRecipes.filter(recipe => plan.recipeIds.includes(recipe.id));

  return (
    <div className="flex h-screen bg-[#F0F2F3]">
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
        <main className="flex-1 overflow-y-auto p-8 overflow-x-hidden">
          <div className="mx-auto" style={{ maxWidth: '976px' }}>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-[24px] font-semibold text-[#01272E] leading-tight">{planTitle}</h1>
                  {isPrivate && (
                    <Tag
                      label="Private"
                      type="alert"
                      alertVariant="info"
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C9.243 2 7 4.243 7 7V10H6C4.897 10 4 10.897 4 12V20C4 21.103 4.897 22 6 22H18C19.103 22 20 21.103 20 20V12C20 10.897 19.103 10 18 10H17V7C17 4.243 14.757 2 12 2ZM9 7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V10H9V7ZM18 20H6V12H18V20Z" fill="currentColor"/>
                        </svg>
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="md"
                    icon={<span className="material-icons text-xl">add</span>}
                  >
                    Add
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      setIsRightRailCollapsed(false);
                      setRightRailTab('preferences');
                    }}
                  >
                    Preferences
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    icon={<span className="material-icons text-xl">share</span>}
                  >
                    Share
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs
                tabs={[
                  { id: 'overview', label: 'Overview' },
                  { id: 'meal-plans', label: 'Meal plans' },
                  { id: 'recipe-collection', label: 'Recipe collection' }
                ]}
                activeTab={activeTab}
                onChange={(tabId) => setActiveTab(tabId as 'overview' | 'meal-plans' | 'recipe-collection')}
              />
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Recent meal plans section */}
                <div className="bg-white rounded-lg border border-[#DFE3E4] overflow-hidden">
                  {/* Widget Header */}
                  <div className="bg-white border-b border-[#DFE3E4] h-14 px-4 flex items-center">
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-[#657A7E] text-2xl">grid_view</span>
                      <h2 className="text-sm font-semibold text-[#244348] leading-[1.4]">
                        Recent meal plans
                      </h2>
                    </div>
                  </div>

                  {/* Widget Body */}
                  <div className="bg-white p-4 grid grid-cols-[repeat(auto-fill,240px)] gap-3">
                    <TemplateCard
                      size="sm"
                      title="Week 1"
                      duration="5 days"
                      recipeCount={recipes.length}
                      imageUrls={recipes.slice(0, 4).map(r => r.image).filter((img): img is string => !!img)}
                      tag="Draft"
                      onClick={() => navigate(`/nutrition/plans/${planId}/meal-plans/week-1`, { state: { plan } })}
                    />
                  </div>
                </div>

                {/* Two Column Layout - Recipe collection and Additional resources */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Recipe collection section */}
                  <div className="bg-white rounded-lg border border-[#DFE3E4] overflow-hidden">
                    {/* Widget Header */}
                    <div className="bg-white border-b border-[#DFE3E4] h-14 px-4 flex items-center">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-[#657A7E] text-2xl">restaurant</span>
                        <h2 className="text-sm font-semibold text-[#244348] leading-[1.4]">
                          Recipe collection
                        </h2>
                        <span className="px-2 py-0.5 bg-[#DFE3E4] rounded-full text-xs font-medium text-[#244348] leading-[1.5]">
                          {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
                        </span>
                      </div>
                    </div>

                    {/* Widget Body - Recipe Grid */}
                    <div className="bg-white p-4">
                      {recipes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <p className="text-sm text-[#657A7E]">No recipes added</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-3">
                          {recipes.slice(0, 6).map((recipe) => (
                            <div key={recipe.id} className="flex flex-col gap-1 cursor-pointer">
                              <div className="w-full h-[76px] rounded-xl border border-[#DFE3E4] overflow-hidden">
                                <img
                                  src={recipe.image}
                                  alt={recipe.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-xs font-semibold text-[#385459] leading-[1.5] overflow-hidden text-ellipsis">
                                {recipe.title}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Widget Footer */}
                    <button className="bg-[#F0F2F3] border-t border-[#DFE3E4] w-full flex items-center justify-center py-2.5 px-4 hover:bg-[#DFE3E4] transition-colors rounded-b-lg">
                      <div className="flex items-center">
                        <span className="text-sm font-semibold text-[#385459] leading-[1.4]">View all recipes</span>
                      </div>
                    </button>
                  </div>

                  {/* Additional resources section */}
                  <div className="bg-white rounded-lg border border-[#DFE3E4] overflow-hidden">
                    {/* Widget Header */}
                    <div className="bg-white border-b border-[#DFE3E4] h-14 px-4 flex items-center">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-[#657A7E] text-2xl">description</span>
                        <h2 className="text-sm font-semibold text-[#244348] leading-[1.4]">
                          Additional resources
                        </h2>
                      </div>
                    </div>

                    {/* Widget Body - Empty State */}
                    <div className="bg-white p-12 flex flex-col items-center justify-center min-h-75">
                      <p className="text-sm text-[#657A7E]">No resources added</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'meal-plans' && (
              <div className="mt-6">
                <p className="text-sm text-[#657A7E]">Meal plans tab content coming soon...</p>
              </div>
            )}

            {activeTab === 'recipe-collection' && (
              <div className="mt-6">
                <p className="text-sm text-[#657A7E]">Recipe collection tab content coming soon...</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Right Side Rail */}
      <RightSideRail
        defaultTab={rightRailTab}
        plan={plan}
        defaultCollapsed={isRightRailCollapsed}
        hideRecipesTab={true}
        onCollapsedChange={setIsRightRailCollapsed}
        onTabChange={setRightRailTab}
      />
    </div>
  );
};

export default NutritionPlanView;
