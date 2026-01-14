import React from 'react';
import { useLocation } from 'react-router';
import { Avatar } from '@/components/ui/Avatar';
import { SideNavItem } from '@/components/ui/SideNavItem';
import { MdOutlineHome, MdOutlinePeople, MdOutlineBusiness, MdOutlineCalendarToday, MdOutlineMessage, MdOutlineRestaurantMenu, MdOutlineMoreHoriz } from 'react-icons/md';

interface NavItem {
  label: string;
  path: string;
  badge?: number;
}

const NavDivider: React.FC = () => (
  <div className="w-full px-1 py-0.5">
    <div className="h-px bg-[#385459]" />
  </div>
);

const navItems: NavItem[] = [
  { label: 'Home', path: '#' },
  { label: 'Clients', path: '#' },
  { label: 'Practice', path: '#' },
  { label: 'Schedule', path: '#' }
];

const bottomNavItems: NavItem[] = [
  { label: 'Messages', path: '#' },
  { label: 'Nutrition', path: '#' },
  { label: 'More', path: '#' }
];

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  'Home': MdOutlineHome,
  'Clients': MdOutlinePeople,
  'Practice': MdOutlineBusiness,
  'Schedule': MdOutlineCalendarToday,
  'Messages': MdOutlineMessage,
  'Nutrition': MdOutlineRestaurantMenu,
  'More': MdOutlineMoreHoriz
};

export const Sidebar: React.FC = () => {
  const location = useLocation();

  // Determine which items should be active based on the current route
  const isClientsActive = location.pathname.startsWith('/clients');

  const isActive = (label: string) => {
    if (label === 'Clients') return isClientsActive;
    if (label === 'Nutrition') return true; // Always active for prototype
    return false;
  };

  return (
    <aside className="w-20 bg-[#01272e] flex flex-col h-screen gap-1 px-1 py-2">
      {/* User Profile Section */}
      <div className="flex flex-col items-center justify-center gap-1 p-1 rounded h-12 w-[72px] relative">
        <div className="relative">
          <Avatar
            fillType="image"
            size="small"
            imageSrc="https://i.pravatar.cc/150?img=47"
            alt="Christina"
          />
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#5fe089] rounded-full flex items-center justify-center">
            <span className="text-[#244348] text-[10px] font-semibold leading-4">10</span>
          </div>
        </div>
        <p className="text-white text-[10px] font-semibold text-center w-full leading-[1.5]">
          Christina
        </p>
      </div>

      <NavDivider />

      {/* Main Navigation */}
      <nav className="flex flex-col items-center gap-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.label];
          return (
            <SideNavItem
              key={item.label}
              label={item.label}
              path={item.path}
              icon={<Icon />}
              isActive={isActive(item.label)}
            />
          );
        })}
      </nav>

      <NavDivider />

      {/* Bottom Navigation */}
      <nav className="flex flex-col items-center gap-1">
        {bottomNavItems.map((item) => {
          const Icon = iconMap[item.label];
          return (
            <SideNavItem
              key={item.label}
              label={item.label}
              path={item.path}
              icon={<Icon />}
              isActive={isActive(item.label)}
              badge={item.badge}
            />
          );
        })}
      </nav>
    </aside>
  );
};
