import React from 'react';
import { Avatar } from '@/components/ui/Avatar';

interface ClientListItemProps {
  name: string;
  email: string;
  avatarInitials: string;
  avatarBgColor: string;
  onClick?: () => void;
}

export const ClientListItem: React.FC<ClientListItemProps> = ({
  name,
  email,
  avatarInitials,
  avatarBgColor,
  onClick,
}) => {
  return (
    <div
      className="bg-white border-b border-[#DFE3E4] px-3 py-2 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: avatarBgColor }}
        >
          <Avatar
            fillType="initials"
            size="medium"
            initials={avatarInitials}
            className="bg-transparent"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-sm font-semibold text-[#244348] leading-[1.4] truncate">
          {name}
        </p>
        <p className="text-xs font-medium text-[#657A7E] leading-[1.5] truncate">
          {email}
        </p>
      </div>
    </div>
  );
};
