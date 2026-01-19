import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Tag } from '@/components/ui/Tag';
import { IconButton } from '../ui/IconButton';
import { DashboardIcon } from '@/components/icons/DashboardIcon';
import { LockIcon } from '@/components/icons/LockIcon';

interface PlanListItemProps {
  type: 'client' | 'template';
  title: string;
  metadata: string;
  avatarType?: 'initials' | 'icon' | 'image';
  avatarInitials?: string;
  avatarSrc?: string;
  avatarBgColor?: string;
  templateIconBgColor?: string;
  templateIconColor?: string;
  status?: 'private' | 'shared';
  author?: {
    initials?: string;
    imageSrc?: string;
    bgColor?: string;
  };
  onClick?: () => void;
  onDelete?: () => void;
}


export const PlanListItem: React.FC<PlanListItemProps> = ({
  type,
  title,
  metadata,
  avatarType = 'initials',
  avatarInitials,
  avatarSrc,
  avatarBgColor,
  templateIconBgColor,
  templateIconColor,
  status,
  author,
  onClick,
  onDelete,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the row onClick
    onDelete?.();
  };
  return (
    <div
      className="bg-white border-b border-[#DFE3E4] px-3 py-2 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
      onClick={onClick}
    >
      {/* Avatar/Icon */}
      <div className="flex-shrink-0">
        {type === 'template' ? (
          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ backgroundColor: templateIconBgColor || '#CFF6DC' }}
          >
            <DashboardIcon
              size={16}
              color={templateIconColor || '#007820'}
            />
          </div>
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
            style={avatarBgColor ? { backgroundColor: avatarBgColor } : undefined}
          >
            <Avatar
              fillType={avatarType}
              size="medium"
              initials={avatarInitials}
              imageSrc={avatarSrc}
              className={avatarBgColor ? 'bg-transparent' : undefined}
            />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-sm font-semibold text-[#244348] leading-[1.4] truncate">
          {title}
        </p>
        <p className="text-xs font-medium text-[#657A7E] leading-[1.5] truncate">
          {metadata}
        </p>
      </div>

      {/* Author avatar for templates */}
      {type === 'template' && author && (
        <div className="shrink-0">
          {author.bgColor ? (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: author.bgColor }}
            >
              <Avatar
                fillType="initials"
                size="small"
                initials={author.initials}
                className="bg-transparent"
              />
            </div>
          ) : (
            <Avatar
              fillType={author.imageSrc ? 'image' : 'initials'}
              size="small"
              initials={author.initials}
              imageSrc={author.imageSrc}
            />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Status Tag */}
        {status === 'private' && (
          <Tag
            label="Private"
            type="alert"
            alertVariant="info"
            icon={<LockIcon size={16} color="#007CB2" />}
          />
        )}
        {status === 'shared' && (
          <Tag label="Shared" type="alert" alertVariant="success" />
        )}

        {/* Delete button */}
        <IconButton
          size='sm'
          variant='ghost'
          onClick={handleDelete}
          icon={
            <span className="material-icons text-[#385459]" style={{ fontSize: '20px' }}>
              delete_outline
            </span>
          }
        />
      </div>
    </div>
  );
};
