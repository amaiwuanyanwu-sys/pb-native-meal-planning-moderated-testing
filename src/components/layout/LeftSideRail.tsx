import React from 'react';
import { useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import {
  MdOutlineRestaurant,
  MdOutlineDescription,
  MdOutlineMedication,
  MdOutlineShoppingCart
} from 'react-icons/md';
import { LeftRailListItem } from '@/components/ui/LeftRailListItem';
import { RailToggle } from '@/components/ui/RailToggle';
import { Tooltip } from '@/components/ui/Tooltip';

interface RecentItem {
  id: string;
  label: string;
  path: string;
}

interface LeftSideRailProps {
  recentItems?: RecentItem[];
  onRecentItemClick?: (item: RecentItem) => void;
  className?: string;
}

// Custom Nutrition Icon (not available in react-icons)
const NutritionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20.0005 10.0001C19.315 8.83021 18.2051 7.96957 16.9014 7.59708C15.5976 7.2246 14.2005 7.36892 13.0005 8.00005V3.00005H11.0005V8.00005C9.80048 7.36892 8.40336 7.2246 7.09966 7.59708C5.79595 7.96957 4.68597 8.83021 4.0005 10.0001C2.0005 13.0001 7.0005 22 9.0005 22C11.0005 22 11.0005 21 12.0005 21C13.0005 21 13.0005 22 15.0005 22C17.0005 22 22.0005 13.0001 20.0005 10.0001Z" fill="currentColor"/>
  </svg>
);

export const LeftSideRail: React.FC<LeftSideRailProps> = ({
  recentItems = [],
  className
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const location = useLocation();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { label: 'Nutrition Plans', icon: <NutritionIcon />, path: '/nutrition/plans' },
    { label: 'Recipes', icon: <MdOutlineRestaurant size={24} />, path: '/nutrition/recipes' },
    { label: 'Supplements', icon: <MdOutlineMedication size={24} />, path: '/nutrition/supplements' },
    { label: 'Food Database', icon: <MdOutlineShoppingCart size={24} />, path: '/nutrition/food-database' }
  ];

  const isMenuItemActive = (path: string) => {
    return location.pathname === path || (path === '/nutrition/plans' && location.pathname === '/nutrition');
  };

  return (
    <aside className={cn(
      'bg-white flex flex-col h-screen transition-all duration-300 border-r border-[#dfe3e4]',
      'shadow-[0px_2px_4px_0px_rgba(1,39,46,0.1)]',
      isCollapsed ? 'w-16' : 'w-60',
      className
    )}>
      {/* Collapsible Toggle */}
      <RailToggle
        isCollapsed={isCollapsed}
        onToggle={handleToggleCollapse}
        position="left"
      />

      {/* Menu Items Section */}
      <div className="border-b border-[#dfe3e4] w-full flex flex-col">
        {menuItems.map((item) => (
          isCollapsed ? (
            <div key={item.path} style={{ width: '100%' }}>
              <Tooltip content={item.label}>
                <div
                  style={{
                    padding: '8px 0',
                    background: isMenuItemActive(item.path) ? '#01272e' : 'transparent',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{
                    color: isMenuItemActive(item.path) ? 'white' : '#657a7e',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {item.icon}
                  </span>
                </div>
              </Tooltip>
            </div>
          ) : (
            <LeftRailListItem
              key={item.path}
              label={item.label}
              icon={item.icon}
              isActive={isMenuItemActive(item.path)}
            />
          )
        ))}
      </div>

      {/* Recents Section */}
      {recentItems.length > 0 && !isCollapsed && (
        <>
          <div className="px-4 pt-4 pb-1 w-full">
            <h3 className="text-sm font-semibold text-[#385459] leading-[1.4]">
              Recents
            </h3>
          </div>
          <div className="w-full">
            {recentItems.map((item) => (
              <LeftRailListItem
                key={item.id}
                label={item.label}
                icon={<MdOutlineDescription size={24} />}
                isActive={location.pathname === item.path}
              />
            ))}
          </div>
        </>
      )}

      {/* Recents Section - Collapsed */}
      {recentItems.length > 0 && isCollapsed && (
        <div className="w-full flex flex-col">
          {recentItems.map((item) => (
            <div key={item.id} style={{ width: '100%' }}>
              <Tooltip content={item.label}>
                <div
                  style={{
                    padding: '8px 0',
                    background: location.pathname === item.path ? '#01272e' : 'transparent',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{
                    color: location.pathname === item.path ? 'white' : '#657a7e',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <MdOutlineDescription size={24} />
                  </span>
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};
