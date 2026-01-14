import React from 'react';
import { Link, useLocation } from 'react-router';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: string;
  path: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Home', icon: 'home', path: '/' },
  { label: 'Clients', icon: 'people', path: '/clients' },
  { label: 'Practice', icon: 'work', path: '/practice' },
  { label: 'Schedule', icon: 'event', path: '/schedule' },
  { label: 'Messages', icon: 'message', path: '/messages', badge: '0' },
  { label: 'Tasks', icon: 'check_circle', path: '/tasks' },
  { label: 'More', icon: 'more_horiz', path: '/more' }
];

const subNavItems: NavItem[] = [
  { label: 'Nutrition Plans', icon: 'restaurant', path: '/nutrition-plans' },
  { label: 'Recipes', icon: 'book', path: '/recipes' },
  { label: 'Supplements', icon: 'medication', path: '/supplements' },
  { label: 'Food Database', icon: 'database', path: '/food-database' }
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">CH</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Christina</p>
          </div>
          <span className="material-icons text-gray-400 text-sm">expand_more</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
              isActive(item.path)
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <span className="material-icons text-xl">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}

        {/* Sub Navigation for Practice */}
        {(location.pathname.startsWith('/nutrition-plans') ||
          location.pathname.startsWith('/recipes') ||
          location.pathname.startsWith('/supplements') ||
          location.pathname.startsWith('/food-database')) && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            {subNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
                  isActive(item.path)
                    ? 'bg-[#1e3a3a] text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <span className={cn(
                  "material-icons text-xl",
                  isActive(item.path) ? 'text-white' : ''
                )}>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Bottom section with additional user profiles */}
      <div className="border-t border-gray-200 p-2">
        <div className="flex flex-col gap-1">
          <button className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-semibold mx-2">
            MP
          </button>
          <button className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-semibold mx-2">
            RL
          </button>
          <button className="w-8 h-8 rounded-full bg-pink-400 text-white flex items-center justify-center text-xs font-semibold mx-2">
            JD
          </button>
          <button className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-semibold mx-2">
            AB
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-xs font-semibold mx-2">
            +3
          </button>
          <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center mx-2 hover:bg-gray-50">
            <span className="material-icons text-gray-500 text-sm">location_on</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
