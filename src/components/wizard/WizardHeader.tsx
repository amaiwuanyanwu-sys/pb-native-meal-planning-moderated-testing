import React from 'react';
import { MagicWandIcon } from '@/components/icons/MagicWandIcon';
import { Avatar } from '@/components/ui/Avatar';
import { mockUsers } from '@/data/mockUsers';

export const WizardHeader: React.FC = () => {
  // Check if we're in client context
  const wizardClientId = localStorage.getItem('wizard_clientId');
  const client = wizardClientId ? mockUsers.find(u => u.id === wizardClientId) : null;

  const headerText = client
    ? `${client.name}'s Nutrition Plan`
    : 'Nutrition Plan Assistant';

  return (
    <div className="bg-[#F0F2F3] flex items-center justify-center px-6 py-2">
      <div className="flex items-center gap-2">
        {client ? (
          <div
            className="size-[24px] rounded-full flex items-center justify-center"
            style={{ backgroundColor: client.avatarColor }}
          >
            <span className="text-[12px] font-semibold text-white">
              {client.initials}
            </span>
          </div>
        ) : (
          <MagicWandIcon className="text-[#657A7E]" />
        )}
        <p className="text-sm font-semibold text-[#244348]">{headerText}</p>
      </div>
    </div>
  );
};
