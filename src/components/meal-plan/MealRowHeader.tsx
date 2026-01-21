import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export interface MealOption {
  label: string;
  icon: string;
}

interface MealRowHeaderProps {
  label: string;
  icon: string;
  mealOptions?: MealOption[];
  onMealChange?: (meal: MealOption) => void;
  className?: string;
}

const defaultMealOptions: MealOption[] = [
  { label: 'Breakfast', icon: 'coffee' },
  { label: 'Snack', icon: 'fastfood' },
  { label: 'Lunch', icon: 'restaurant' },
  { label: 'Dinner', icon: 'bedtime' },
  { label: 'Dessert', icon: 'cake' },
];

export const MealRowHeader: React.FC<MealRowHeaderProps> = ({
  label,
  icon,
  mealOptions = defaultMealOptions,
  onMealChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 2,
        left: rect.left
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMealSelect = (meal: MealOption) => {
    onMealChange?.(meal);
    setIsOpen(false);
  };

  return (
    <div className={cn(
      'bg-[#F8F9F9] border-r border-[#C1C9CB] border-b border-[#DFE3E4] flex items-center px-2 h-full',
      className
    )}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 h-8 px-2 py-2.5 rounded transition-colors hover:bg-white hover:border hover:border-[#C1C9CB] focus:bg-white focus:border-2 focus:border-[#007CB2] focus:outline-none"
      >
        <span className="material-icons-outlined text-[#385459]" style={{ fontSize: '20px' }}>{icon}</span>
        <span className="text-sm font-semibold text-[#385459] leading-[1.4]">{label}</span>
      </button>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed bg-white border border-[#C1C9CB] rounded shadow-lg z-[9999] min-w-[160px]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          {mealOptions.map((meal, index) => (
            <button
              key={index}
              onClick={() => handleMealSelect(meal)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#F0F2F3] transition-colors',
                meal.label === label && 'bg-[#F2F8FB]'
              )}
            >
              <span className="material-icons-outlined text-[#657A7E]" style={{ fontSize: '20px' }}>{meal.icon}</span>
              <span className="text-sm font-medium text-[#385459]">{meal.label}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};
