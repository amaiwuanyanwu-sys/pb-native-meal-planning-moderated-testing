import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'block', width: '100%' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            ...(position === 'right' ? { left: '100%', marginLeft: '8px' } : { right: '100%', marginRight: '8px' }),
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '4px 8px',
            background: '#244348',
            color: 'white',
            fontSize: '12px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          {content}
          <div
            style={{
              position: 'absolute',
              ...(position === 'right' ? { right: '100%' } : { left: '100%' }),
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '4px solid transparent',
              borderBottom: '4px solid transparent',
              ...(position === 'right'
                ? { borderRight: '4px solid #244348' }
                : { borderLeft: '4px solid #244348' }
              )
            }}
          />
        </div>
      )}
    </div>
  );
};
