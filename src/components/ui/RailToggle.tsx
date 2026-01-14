import React from 'react';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { Tooltip } from './Tooltip';

interface RailToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
  position: 'left' | 'right';
}

export const RailToggle: React.FC<RailToggleProps> = ({
  isCollapsed,
  onToggle,
  position
}) => {
  // Determine icon based on position and collapsed state
  const getIcon = () => {
    if (position === 'left') {
      // Left rail: open shows chevron pointing left, collapsed shows chevron pointing right
      return isCollapsed ? <MdKeyboardDoubleArrowRight size={20} /> : <MdKeyboardDoubleArrowLeft size={20} />;
    } else {
      // Right rail: open shows chevron pointing right, collapsed shows chevron pointing left
      return isCollapsed ? <MdKeyboardDoubleArrowLeft size={20} /> : <MdKeyboardDoubleArrowRight size={20} />;
    }
  };

  const tooltipText = isCollapsed ? 'Expand' : 'Collapse';

  return (
    <Tooltip content={tooltipText}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          height: '40px',
          width: '100%',
          border: 'none',
          borderBottom: '1px solid #dfe3e4',
          background: 'white',
          color: '#657a7e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : (position === 'left' ? 'flex-end' : 'flex-start'),
          padding: isCollapsed ? '0' : '0 16px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#f9fafb';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'white';
        }}
      >
        {getIcon()}
      </button>
    </Tooltip>
  );
};
