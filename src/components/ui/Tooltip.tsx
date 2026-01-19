import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + rect.height / 2,
        left: position === 'right' ? rect.right + 8 : rect.left - 8
      });
    }
  }, [isVisible, position]);

  return (
    <>
      <div
        ref={containerRef}
        style={{ position: 'relative', display: 'block', width: '100%' }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            left: position === 'right' ? tooltipPosition.left : 'auto',
            right: position === 'left' ? `calc(100vw - ${tooltipPosition.left}px)` : 'auto',
            top: tooltipPosition.top,
            transform: 'translateY(-50%)',
            padding: '4px 8px',
            background: '#244348',
            color: 'white',
            fontSize: '12px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            zIndex: 9999,
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
    </>
  );
};
