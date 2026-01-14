import React from 'react';

interface LeftRailListItemProps {
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export const LeftRailListItem: React.FC<LeftRailListItemProps> = ({
  label,
  icon,
  isActive = false
}) => {
  return (
    <div
      style={{
        padding: '8px 16px',
        background: isActive ? '#01272e' : 'transparent',
        color: isActive ? 'white' : '#244348',
        fontWeight: isActive ? 600 : 500,
        fontSize: '14px',
        lineHeight: 1.4,
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s',
        fontFamily: 'inherit'
      }}
    >
      {icon && (
        <span style={{ flexShrink: 0, color: isActive ? 'white' : '#657a7e', display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
      <span style={{
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {label}
      </span>
    </div>
  );
};
