import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { ClientLeftRail } from '@/components/clients/ClientLeftRail';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Tag } from '@/components/ui/Tag';
import { EmptyStateCard } from '@/components/nutrition-plans/EmptyStateCard';
import { TemplateCard } from '@/components/nutrition-plans/TemplateCard';
import { loadPlans } from '@/data/mockNutritionPlans';
import type { NutritionPlan } from '@/data/mockNutritionPlans';
import { mockUsers } from '@/data/mockUsers';
import { mockRecipes } from '@/data/mockRecipes';
import { NutritionIcon } from '@/components/icons/NutritionIcon';

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

const ClientDetail: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<NutritionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'meal-plans' | 'recipe-collection'>('overview');

  const client = mockUsers.find(u => u.id === clientId);

  // Load plan for this specific client
  useEffect(() => {
    const allPlans = loadPlans();
    const clientPlan = allPlans.find(p => p.type === 'client' && p.clientId === clientId);
    setPlan(clientPlan || null);
    setIsLoading(false);
  }, [clientId]);

  if (!client) {
    return (
      <div className="flex h-screen bg-[#F8F9F9]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#244348] mb-2">Client not found</h2>
            <Button onClick={() => navigate('/clients')} variant="secondary">
              Back to Clients
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#F0F2F3] items-center justify-center">
        <p className="text-sm text-[#657A7E]">Loading...</p>
      </div>
    );
  }

  // If no plan exists, show empty state
  if (!plan) {
    return (
      <div className="flex h-screen bg-[#F8F9F9]">
        <Sidebar />
        <ClientLeftRail clientId={clientId!} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Client Info Bar */}
          <div className="bg-[#F0F2F3] border-b border-[#DFE3E4] flex items-center justify-center px-6 py-2">
            <div className="flex items-center gap-2">
              <div
                className="size-[24px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: client.avatarColor }}
              >
                <span className="text-[12px] font-semibold text-white">
                  {client.initials}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#244348]">{client.name}</p>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto p-8" style={{ maxWidth: '976px' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex flex-1 items-center gap-2">
                  <div className="w-8 h-8">
                    <NutritionIcon className="text-[#385459] w-full h-full" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Nutrition Plan</h1>
                </div>
              </div>

              <div className="mb-8">
                <EmptyStateCard clientId={clientId} />
              </div>

              <div className="bg-white rounded-lg border border-[#C1C9CB] overflow-hidden">
                <div className="bg-white border-b border-[#DFE3E4] px-4 py-2 h-14 flex items-center">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-[#244348] text-2xl">dashboard</span>
                    <h2 className="text-sm font-semibold text-[#244348]">
                      Browse our templates
                    </h2>
                  </div>
                </div>

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
  }

  // Client has a plan - show the plan content
  const recipes = mockRecipes.filter(recipe => plan.recipeIds.includes(recipe.id));
  const planTitle = 'Nutrition Plan';
  const isPrivate = true;

  const handleBackToClients = () => {
    navigate('/clients');
  };

  return (
    <div className="flex h-screen bg-[#F8F9F9]">
      <Sidebar />
      <ClientLeftRail clientId={clientId!} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Client Info Bar */}
        <div className="bg-[#F0F2F3] border-b border-[#DFE3E4] flex items-center justify-center px-6 py-2">
          <div className="flex items-center gap-2">
            <div
              className="size-[24px] rounded-full flex items-center justify-center"
              style={{ backgroundColor: client.avatarColor }}
            >
              <span className="text-[12px] font-semibold text-white">
                {client.initials}
              </span>
            </div>
            <p className="text-sm font-semibold text-[#244348]">{client.name}</p>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-8 overflow-x-hidden">
          <div className="mx-auto" style={{ maxWidth: '976px' }}>
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
                    variant="primary"
                    size="md"
                    icon={<span className="material-icons text-xl">share</span>}
                  >
                    Share
                  </Button>
                </div>
              </div>

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
                <div className="bg-white rounded-lg border border-[#DFE3E4] overflow-hidden">
                  <div className="bg-white border-b border-[#DFE3E4] h-14 px-4 flex items-center">
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-[#657A7E] text-2xl">grid_view</span>
                      <h2 className="text-sm font-semibold text-[#244348] leading-[1.4]">
                        Recent meal plans
                      </h2>
                    </div>
                  </div>

                  <div className="bg-white p-4 grid grid-cols-[repeat(auto-fill,240px)] gap-3">
                    <TemplateCard
                      size="sm"
                      title="Week 1"
                      duration="5 days"
                      recipeCount={recipes.length}
                      imageUrls={recipes.slice(0, 4).map(r => r.image).filter((img): img is string => !!img)}
                      tag="Draft"
                      onClick={() => navigate(`/nutrition/plans/${plan.id}/meal-plans/week-1`, { state: { plan } })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg border border-[#DFE3E4] overflow-hidden">
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
                  </div>

                  <div className="bg-white rounded-lg border border-[#DFE3E4] overflow-hidden">
                    <div className="bg-white border-b border-[#DFE3E4] h-14 px-4 flex items-center">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-[#657A7E] text-2xl">description</span>
                        <h2 className="text-sm font-semibold text-[#244348] leading-[1.4]">
                          Additional resources
                        </h2>
                      </div>
                    </div>

                    <div className="bg-white p-4">
                      <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-sm text-[#657A7E]">No resources added</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'meal-plans' && (
              <div className="text-center py-12">
                <p className="text-sm text-[#657A7E]">Meal plans view</p>
              </div>
            )}

            {activeTab === 'recipe-collection' && (
              <div className="text-center py-12">
                <p className="text-sm text-[#657A7E]">Recipe collection view</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDetail;
