import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { DashboardIcon } from '@/components/icons/DashboardIcon';
import { Avatar } from '@/components/ui/Avatar';

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

interface LeftSideRailProps {
  recentItems?: RecentItem[];
  onRecentItemClick?: (item: RecentItem) => void;
  className?: string;
  defaultCollapsed?: boolean;
}

// Custom Nutrition Icon (not available in react-icons)
const NutritionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20.0005 10.0001C19.315 8.83021 18.2051 7.96957 16.9014 7.59708C15.5976 7.2246 14.2005 7.36892 13.0005 8.00005V3.00005H11.0005V8.00005C9.80048 7.36892 8.40336 7.2246 7.09966 7.59708C5.79595 7.96957 4.68597 8.83021 4.0005 10.0001C2.0005 13.0001 7.0005 22 9.0005 22C11.0005 22 11.0005 21 12.0005 21C13.0005 21 13.0005 22 15.0005 22C17.0005 22 22.0005 13.0001 20.0005 10.0001ZM18.2505 13.3801C17.6305 15.8501 16.4105 18.12 14.7005 20C14.5005 20 14.2705 19.9 14.1005 19.75C13.5061 19.2695 12.7649 19.0073 12.0005 19.0073C11.2361 19.0073 10.4949 19.2695 9.9005 19.75C9.7305 19.9 9.50051 20 9.30051 20C7.58689 18.1255 6.36688 15.8539 5.7505 13.3901C5.5005 12.6601 5.4505 11.8701 5.6605 11.1201C5.94513 10.6126 6.3563 10.1874 6.85398 9.88603C7.35167 9.58461 7.91891 9.41719 8.5005 9.40005C9.0605 9.41005 9.6105 9.54005 10.1105 9.79005L11.0005 10.2401H13.0005L13.8905 9.79005C14.3905 9.54005 14.9405 9.41005 15.5005 9.40005C16.6805 9.43005 17.7605 10.0801 18.3405 11.1101C18.5505 11.8601 18.5005 12.6501 18.2505 13.3801ZM11.0005 5.00005C5.38051 8.07005 4.11051 3.78005 4.11051 3.78005C4.11051 3.78005 6.7705 0.190051 11.0005 5.00005Z" fill="currentColor"/>
  </svg>
);

export const LeftSideRail: React.FC<LeftSideRailProps> = ({
  recentItems = [],
  onRecentItemClick,
  className,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const location = useLocation();
  const navigate = useNavigate();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { label: 'Nutrition Plans', icon: <NutritionIcon />, path: '/nutrition', disabled: false },
    { label: 'Recipes', icon: <MdOutlineRestaurant size={24} />, path: '/nutrition/recipes', disabled: true },
    // { label: 'Supplements', icon: <MdOutlineMedication size={24} />, path: '/nutrition/supplements', disabled: true },
    // { label: 'Food Database', icon: <MdOutlineShoppingCart size={24} />, path: '/nutrition/food-database', disabled: true }
  ];

  const isMenuItemActive = (path: string) => {
    return location.pathname === path;
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
                  onClick={() => !item.disabled && navigate(item.path)}
                  style={{
                    padding: '8px 0',
                    background: isMenuItemActive(item.path) ? '#01272e' : 'transparent',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    cursor: item.disabled ? 'default' : 'pointer'
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
              onClick={item.disabled ? undefined : () => navigate(item.path)}
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
            {recentItems.map((item) => {
              // Determine icon based on type
              const getIcon = () => {
                if (item.type === 'template') {
                  return (
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center"
                      style={{ backgroundColor: item.templateIconBgColor || '#CFF6DC' }}
                    >
                      <DashboardIcon
                        size={16}
                        color={item.templateIconColor || '#007820'}
                      />
                    </div>
                  );
                } else if (item.type === 'client' && item.avatarInitials) {
                  return (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: item.avatarBgColor || '#657A7E' }}
                    >
                      <Avatar
                        fillType="initials"
                        size="small"
                        initials={item.avatarInitials}
                        className="bg-transparent"
                      />
                    </div>
                  );
                }
                return <MdOutlineDescription size={24} />;
              };

              return (
                <LeftRailListItem
                  key={item.id}
                  label={item.label}
                  icon={getIcon()}
                  isActive={location.pathname === item.path || location.pathname.startsWith(item.path + '/')}
                  onClick={() => {
                    navigate(item.path);
                    onRecentItemClick?.(item);
                  }}
                />
              );
            })}
          </div>
        </>
      )}

      {/* Recents Section - Collapsed */}
      {recentItems.length > 0 && isCollapsed && (
        <div className="w-full flex flex-col">
          {recentItems.map((item) => {
            // Determine icon based on type for collapsed view
            const getCollapsedIcon = () => {
              if (item.type === 'template') {
                return (
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ backgroundColor: item.templateIconBgColor || '#CFF6DC' }}
                  >
                    <DashboardIcon
                      size={16}
                      color={item.templateIconColor || '#007820'}
                    />
                  </div>
                );
              } else if (item.type === 'client' && item.avatarInitials) {
                return (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: item.avatarBgColor || '#657A7E' }}
                  >
                    <Avatar
                      fillType="initials"
                      size="small"
                      initials={item.avatarInitials}
                      className="bg-transparent"
                    />
                  </div>
                );
              }
              return <MdOutlineDescription size={24} />;
            };

            return (
              <div key={item.id} style={{ width: '100%' }}>
                <Tooltip content={item.label}>
                  <div
                    onClick={() => {
                      navigate(item.path);
                      onRecentItemClick?.(item);
                    }}
                    style={{
                      padding: '8px 0',
                      background: (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) ? '#01272e' : 'transparent',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{
                      color: (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) ? 'white' : '#657a7e',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {getCollapsedIcon()}
                    </span>
                  </div>
                </Tooltip>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
};
