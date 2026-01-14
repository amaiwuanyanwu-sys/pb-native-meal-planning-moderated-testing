import React from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'stretch';
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, variant = 'default' }) => {
  return (
    <div className={cn(
      'border-b border-[#C1C9CB]',
      variant === 'stretch' ? 'flex w-full gap-3' : 'inline-flex gap-3'
    )}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex flex-col items-center justify-center h-11 px-4 pb-0 ${
              variant === 'stretch' ? 'flex-1' : 'min-w-20'
            }`}
          >
            <p
              className={`text-base font-semibold leading-[1.5] ${
                isActive ? 'text-[#01272E]' : 'text-[#657A7E]'
              }`}
            >
              {tab.label}
            </p>
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#01272E]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
