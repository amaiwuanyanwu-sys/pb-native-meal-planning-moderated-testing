import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  avatar?: {
    initials: string;
    color: string;
  };
}

export interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  required?: boolean;
  helpText?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
  required = false,
  helpText,
  placeholder,
  icon,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const hasValue = !!value;
  const shouldFloatLabel = hasValue || isFocused;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setIsFocused(!isOpen);
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setIsFocused(false);
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="relative" ref={selectRef}>
        {/* Select Button */}
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            'bg-white border rounded h-10 w-full flex items-center pl-3 pr-0 gap-2 transition-colors',
            isFocused ? 'border-[#385459]' : 'border-[#C1C9CB]',
            'hover:border-[#96A5A8]'
          )}
        >
          {/* Avatar if present */}
          {selectedOption?.avatar && (
            <div
              className="rounded-full size-6 flex items-center justify-center shrink-0"
              style={{ backgroundColor: selectedOption.avatar.color }}
            >
              <p className="text-xs font-semibold text-white">
                {selectedOption.avatar.initials}
              </p>
            </div>
          )}

          {/* Selected value */}
          <div className="flex-1 text-left">
            {hasValue && (
              <p className="text-sm font-medium text-[#244348]">
                {selectedOption?.label}
              </p>
            )}
          </div>

          {/* Right icons */}
          <div className="flex items-center shrink-0">
            {icon && (
              <div className="border-0 border-[#96A5A8] w-10 p-2 flex items-center justify-center">
                {icon}
              </div>
            )}
            <div className="border-0 border-[#96A5A8] w-10 p-2 flex items-center justify-center">
              <span
                className={cn(
                  'material-icons-outlined text-[#385459] transition-transform',
                  isOpen && 'rotate-180'
                )}
                style={{ fontSize: '24px' }}
              >
                keyboard_arrow_down
              </span>
            </div>
          </div>
        </button>

        {/* Floating Label */}
        <div
          className={cn(
            'absolute left-0 px-2 h-3 flex items-center transition-all pointer-events-none',
            shouldFloatLabel ? '-top-2' : 'top-1/2 -translate-y-1/2 left-3'
          )}
        >
          <div className={cn(
            'px-1 h-3 flex items-center transition-all',
            shouldFloatLabel ? 'bg-white' : 'bg-transparent'
          )}>
            <p className={cn(
              'font-semibold leading-none transition-all',
              shouldFloatLabel ? 'text-xs text-[#385459]' : 'text-sm text-[#657A7E]'
            )}>
              {label}
              {required && shouldFloatLabel && ' *'}
            </p>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#C1C9CB] rounded shadow-lg max-h-60 overflow-y-auto z-50">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors',
                  option.value === value
                    ? 'bg-[#F0F2F3]'
                    : 'hover:bg-[#F8F9F9]'
                )}
              >
                {option.avatar && (
                  <div
                    className="rounded-full size-6 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: option.avatar.color }}
                  >
                    <p className="text-xs font-semibold text-white">
                      {option.avatar.initials}
                    </p>
                  </div>
                )}
                <p className="text-sm font-medium text-[#244348]">
                  {option.label}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Help Text */}
      {helpText && (
        <div className="flex items-center px-3">
          <p className="text-xs font-medium text-[#657A7E]">
            {helpText}
          </p>
        </div>
      )}
    </div>
  );
};
