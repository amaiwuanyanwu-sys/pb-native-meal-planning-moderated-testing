import React from 'react';
import { Tooltip } from '@/components/ui/Tooltip';

export type StepStatus = 'inactive' | 'active' | 'completed';

interface StepperItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  status: StepStatus;
  isCollapsed: boolean;
  showConnector?: boolean;
  isLocked?: boolean;
  onEdit?: () => void;
}

export const StepperItem: React.FC<StepperItemProps> = ({
  icon,
  label,
  description,
  status,
  isCollapsed,
  showConnector = true,
  isLocked = false,
  onEdit
}) => {
  // Determine colors based on status
  const getIndicatorStyle = () => {
    switch (status) {
      case 'completed':
        return {
          background: '#385459', // Neutral 700
          border: 'none',
          iconColor: '#FFFFFF'
        };
      case 'active':
        return {
          background: '#FFFFFF',
          border: '1px solid #385459',
          iconColor: '#385459'
        };
      case 'inactive':
      default:
        return {
          background: '#DFE3E4', // Neutral 300
          border: 'none',
          iconColor: '#96A5A8' // Neutral 500
        };
    }
  };

  const getStepStyle = () => {
    switch (status) {
      case 'completed':
        return {
          background: '#FFFFFF',
          border: '#DFE3E4',
          titleColor: '#01272E',
          descriptionColor: '#657A7E'
        };
      case 'active':
        return {
          background: '#FFFFFF',
          border: '#657A7E',
          titleColor: '#01272E',
          descriptionColor: '#657A7E'
        };
      case 'inactive':
      default:
        return {
          background: '#F0F2F3', // Neutral 200
          border: '#F0F2F3',
          titleColor: '#657A7E',
          descriptionColor: '#657A7E'
        };
    }
  };

  const getConnectorStyle = () => {
    if (status === 'completed') {
      return {
        background: '#DFE3E4',
        fillColor: '#385459',
        showFill: true
      };
    }
    return {
      background: '#DFE3E4',
      fillColor: 'transparent',
      showFill: false
    };
  };

  const indicatorStyle = getIndicatorStyle();
  const stepStyle = getStepStyle();
  const connectorStyle = getConnectorStyle();

  return (
    <div
      className="flex gap-3 items-start pb-3 relative"
      style={{
        width: isCollapsed ? 'auto' : '100%',
        minHeight: isCollapsed ? '56px' : 'auto'
      }}
    >
      {/* Progress Connector */}
      {showConnector && (
        <div
          style={{
            position: 'absolute',
            left: '14px',
            top: '32px',
            bottom: '0',
            width: '4px',
            background: connectorStyle.background,
            display: 'flex',
            zIndex: 0
          }}
        >
          {connectorStyle.showFill && (
            <div
              style={{
                width: '4px',
                height: '100%',
                background: connectorStyle.fillColor
              }}
            />
          )}
        </div>
      )}

      {/* Indicator - Wrapped in Tooltip when collapsed */}
      {isCollapsed ? (
        <Tooltip content={label} position="right">
          <div
            onClick={status === 'completed' && onEdit ? onEdit : undefined}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '100px',
              background: indicatorStyle.background,
              border: indicatorStyle.border,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative',
              zIndex: 1,
              cursor: status === 'completed' && onEdit ? 'pointer' : 'default'
            }}
          >
            <div style={{ color: indicatorStyle.iconColor, display: 'flex', alignItems: 'center' }}>
              {icon}
            </div>
          </div>
        </Tooltip>
      ) : (
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '100px',
            background: indicatorStyle.background,
            border: indicatorStyle.border,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative',
            zIndex: 1
          }}
        >
          <div style={{ color: indicatorStyle.iconColor, display: 'flex', alignItems: 'center' }}>
            {icon}
          </div>
        </div>
      )}

      {/* Step Label (only visible when expanded) */}
      {!isCollapsed && (
        <div
          onClick={status === 'completed' && onEdit ? onEdit : undefined}
          style={{
            flex: 1,
            background: stepStyle.background,
            border: `1px solid ${stepStyle.border}`,
            borderRadius: '4px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: 0,
            cursor: status === 'completed' && onEdit ? 'pointer' : 'default',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            if (status === 'completed' && onEdit) {
              e.currentTarget.style.background = '#F8F9F9';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = stepStyle.background;
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: stepStyle.titleColor,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.4,
                marginBottom: description ? '2px' : 0
              }}
            >
              {label}
            </p>
            {description && (status === 'active' || status === 'completed') && (
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: stepStyle.descriptionColor,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: 1.5
                }}
              >
                {description}
              </p>
            )}
          </div>
          {status === 'completed' && onEdit && (
            <button
              onClick={onEdit}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                color: '#657A7E'
              }}
            >
              <span className="material-icons" style={{ fontSize: '20px' }}>edit</span>
            </button>
          )}
          {isLocked && status === 'inactive' && (
            <span className="material-icons" style={{ fontSize: '20px', color: '#96A5A8' }}>
              lock
            </span>
          )}
        </div>
      )}
    </div>
  );
};
