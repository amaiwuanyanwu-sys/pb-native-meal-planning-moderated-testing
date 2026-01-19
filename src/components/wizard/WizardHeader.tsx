import React from 'react';
import { MagicWandIcon } from '@/components/icons/MagicWandIcon';

export const WizardHeader: React.FC = () => {
  return (
    <div className="bg-[#F0F2F3] flex items-center justify-center px-6 py-2">
      <div className="flex items-center gap-2">
        <MagicWandIcon className="text-[#657A7E]" />
        <p className="text-sm font-semibold text-[#244348]">Nutrition Plan Assistant</p>
      </div>
    </div>
  );
};
