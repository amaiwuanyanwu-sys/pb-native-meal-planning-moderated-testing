import React from 'react';
import { useLocation } from 'react-router';
import { Avatar } from '@/components/ui/Avatar';
import { SideNavItem } from '@/components/ui/SideNavItem';
import { MdOutlineHome, MdOutlinePeople, MdOutlineBusiness, MdOutlineCalendarToday, MdOutlineMessage, MdOutlineMoreHoriz } from 'react-icons/md';

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

const NutritionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20.0005 10.0001C19.315 8.83021 18.2051 7.96957 16.9014 7.59708C15.5976 7.2246 14.2005 7.36892 13.0005 8.00005V3.00005H11.0005V8.00005C9.80048 7.36892 8.40336 7.2246 7.09966 7.59708C5.79595 7.96957 4.68597 8.83021 4.0005 10.0001C2.0005 13.0001 7.0005 22 9.0005 22C11.0005 22 11.0005 21 12.0005 21C13.0005 21 13.0005 22 15.0005 22C17.0005 22 22.0005 13.0001 20.0005 10.0001ZM18.2505 13.3801C17.6305 15.8501 16.4105 18.12 14.7005 20C14.5005 20 14.2705 19.9 14.1005 19.75C13.5061 19.2695 12.7649 19.0073 12.0005 19.0073C11.2361 19.0073 10.4949 19.2695 9.9005 19.75C9.7305 19.9 9.50051 20 9.30051 20C7.58689 18.1255 6.36688 15.8539 5.7505 13.3901C5.5005 12.6601 5.4505 11.8701 5.6605 11.1201C5.94513 10.6126 6.3563 10.1874 6.85398 9.88603C7.35167 9.58461 7.91891 9.41719 8.5005 9.40005C9.0605 9.41005 9.6105 9.54005 10.1105 9.79005L11.0005 10.2401H13.0005L13.8905 9.79005C14.3905 9.54005 14.9405 9.41005 15.5005 9.40005C16.6805 9.43005 17.7605 10.0801 18.3405 11.1101C18.5505 11.8601 18.5005 12.6501 18.2505 13.3801ZM11.0005 5.00005C5.38051 8.07005 4.11051 3.78005 4.11051 3.78005C4.11051 3.78005 6.7705 0.190051 11.0005 5.00005Z" fill="currentColor"/>
  </svg>
);

const navItems: NavItem[] = [
  { label: 'Home', path: '#' },
  { label: 'Clients', path: '/clients' },
  { label: 'Practice', path: '#' },
  { label: 'Schedule', path: '#' }
];

const bottomNavItems: NavItem[] = [
  { label: 'Messages', path: '#' },
  { label: 'Nutrition', path: '/nutrition' },
  { label: 'More', path: '#' }
];

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  'Home': MdOutlineHome,
  'Clients': MdOutlinePeople,
  'Practice': MdOutlineBusiness,
  'Schedule': MdOutlineCalendarToday,
  'Messages': MdOutlineMessage,
  'Nutrition': NutritionIcon,
  'More': MdOutlineMoreHoriz
};

export const Sidebar: React.FC = () => {
  const location = useLocation();

  // Determine which items should be active based on the current route
  const isClientsActive = location.pathname.startsWith('/clients');
  const isNutritionActive = location.pathname.startsWith('/nutrition') || location.pathname.startsWith('/wizard');

  const isActive = (label: string) => {
    if (label === 'Clients') return isClientsActive;
    if (label === 'Nutrition') return isNutritionActive;
    return false;
  };

  return (
    <aside className="w-20 bg-[#01272e] flex flex-col h-screen gap-1 px-1 py-2">
      {/* User Profile Section */}
      <div className="flex flex-col items-center justify-center gap-1 p-1 rounded h-12 w-[72px] relative">
        <Avatar
          fillType="image"
          size="small"
          imageSrc="https://i.pravatar.cc/150?img=47"
          alt="Christina"
        />
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
