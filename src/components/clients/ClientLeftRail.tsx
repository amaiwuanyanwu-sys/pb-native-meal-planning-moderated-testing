import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  MdOutlineRestaurant,
  MdOutlineDescription,
  MdOutlineMedication,
  MdOutlineCalendarToday,
  MdOutlineNotes,
  MdOutlineHistory,
  MdOutlineEventNote,
  MdOutlinePayment,
  MdOutlinePerson,
  MdOutlineMonitorWeight,
  MdOutlineScience,
  MdOutlineArticle,
  MdOutlineCheckCircle,
  MdOutlineFolder,
  MdOutlineRecommend
} from 'react-icons/md';
import { LeftRailListItem } from '@/components/ui/LeftRailListItem';
import { RailToggle } from '@/components/ui/RailToggle';
import { Tooltip } from '@/components/ui/Tooltip';
import { mockUsers } from '@/data/mockUsers';
import { NutritionIcon } from '@/components/icons/NutritionIcon';

interface ClientLeftRailProps {
  clientId: string;
  className?: string;
  defaultCollapsed?: boolean;
}


export const ClientLeftRail: React.FC<ClientLeftRailProps> = ({
  clientId,
  className,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const location = useLocation();
  const navigate = useNavigate();

  const client = mockUsers.find(u => u.id === clientId);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { label: 'Recent Activity', icon: <MdOutlineHistory size={24} />, path: `/clients/${clientId}/recent-activity`, disabled: true },
    { label: 'Bookings & Packages', icon: <MdOutlineEventNote size={24} />, path: `/clients/${clientId}/bookings`, disabled: true },
    { label: 'Billing & Payments', icon: <MdOutlinePayment size={24} />, path: `/clients/${clientId}/billing`, disabled: true },
    { label: 'Basic Information', icon: <MdOutlinePerson size={24} />, path: `/clients/${clientId}/basic-info`, disabled: true },
    { label: 'Medical History', icon: <MdOutlineMedication size={24} />, path: `/clients/${clientId}/medical`, disabled: true },
    { label: 'Diet & Lifestyle', icon: <MdOutlineRestaurant size={24} />, path: `/clients/${clientId}/diet`, disabled: true },
    { label: 'Measurements & Vitals', icon: <MdOutlineMonitorWeight size={24} />, path: `/clients/${clientId}/measurements`, disabled: true },
    { label: 'Notes & Recordings', icon: <MdOutlineNotes size={24} />, path: `/clients/${clientId}/notes`, disabled: true },
    { label: 'Protocols', icon: <MdOutlineDescription size={24} />, path: `/clients/${clientId}/protocols`, disabled: true },
    { label: 'Forms & Waivers', icon: <MdOutlineArticle size={24} />, path: `/clients/${clientId}/forms`, disabled: true },
    { label: 'Labs', icon: <MdOutlineScience size={24} />, path: `/clients/${clientId}/labs`, disabled: true },
    { label: 'Journal', icon: <MdOutlineCalendarToday size={24} />, path: `/clients/${clientId}/journal`, disabled: true },
    { label: 'Nutrition Plan', icon: <NutritionIcon size={24} />, path: `/clients/${clientId}`, disabled: false },
    { label: 'Tasks', icon: <MdOutlineCheckCircle size={24} />, path: `/clients/${clientId}/tasks`, disabled: true },
    { label: 'Documents', icon: <MdOutlineFolder size={24} />, path: `/clients/${clientId}/documents`, disabled: true },
    { label: 'Lifestyle Recommendations', icon: <MdOutlineRecommend size={24} />, path: `/clients/${clientId}/lifestyle`, disabled: true }
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

      {/* Divider */}
      {/* Client Info Section with Action Icons */}
      {!isCollapsed && client && (
        <div
          className="px-4 py-2 border-b border-[#dfe3e4] cursor-pointer hover:bg-[#F8F9F9] transition-colors"
          onClick={() => navigate('/clients')}
        >
          <div className="flex-1 flex items-center gap-2">
            <span className="material-icons text-[#657a7e]">arrow_back</span>
            <p className="text-sm font-medium text-[#244348]">
              All clients
            </p>
          </div>
        </div>
      )}

      {/* Menu Items Section */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="px-4 text-xs font-semibold text-[#244348] pt-4 pb-2 ">
          Client details
        </div>

        {menuItems.slice(0, 12).map((item) => (
          isCollapsed ? (
            <div key={item.path} style={{ width: '100%' }}>
              <Tooltip content={item.label}>
                <div
                  onClick={() => !item.disabled && navigate(item.path)}
                  className={cn(
                    'py-2 w-full flex items-center justify-center transition-all',
                    isMenuItemActive(item.path) ? 'bg-[#01272e]' : 'bg-transparent',
                    !item.disabled && 'cursor-pointer hover:bg-[#F0F2F3]',
                    isMenuItemActive(item.path) && !item.disabled && 'hover:bg-[#01272e]',
                    item.disabled && 'cursor-default'
                  )}
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

        {/* Nutrition Plan - Highlighted */}
        {!isCollapsed && (
          <div className="bg-[#01272e] flex gap-2 items-center px-4 py-2 w-full shrink-0">
            <span className="text-white flex items-center shrink-0">
              <NutritionIcon size={24} />
            </span>
            <div className="flex h-6 items-center justify-center shrink-0">
              <div className="text-sm font-semibold text-white">
                Nutrition Plan
              </div>
            </div>
          </div>
        )}

        {menuItems.slice(13).map((item) => (
          isCollapsed ? (
            <div key={item.path} style={{ width: '100%' }}>
              <Tooltip content={item.label}>
                <div
                  onClick={() => !item.disabled && navigate(item.path)}
                  className={cn(
                    'py-2 w-full flex items-center justify-center transition-all',
                    isMenuItemActive(item.path) ? 'bg-[#01272e]' : 'bg-transparent',
                    !item.disabled && 'cursor-pointer hover:bg-[#F0F2F3]',
                    isMenuItemActive(item.path) && !item.disabled && 'hover:bg-[#01272e]',
                    item.disabled && 'cursor-default'
                  )}
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
    </aside>
  );
};
