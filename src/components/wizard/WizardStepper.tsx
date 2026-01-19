import React from 'react';
import { RailToggle } from '@/components/ui/RailToggle';
import { StepperItem, type StepStatus } from './StepperItem';

export type { StepStatus };

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  status: StepStatus;
  isLocked?: boolean;
  onEdit?: () => void;
}

interface WizardStepperProps {
  steps: WizardStep[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({
  steps,
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <div
      style={{
        width: isCollapsed ? '64px' : '320px',
        height: '100vh',
        background: '#FFFFFF',
        borderRight: '1px solid #DFE3E4',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 2px 4px 0px rgba(1, 39, 46, 0.1)',
        transition: 'width 0.3s ease',
        position: 'relative'
      }}
    >
      {/* Header with Toggle */}
      <RailToggle
        isCollapsed={isCollapsed}
        onToggle={onToggleCollapse}
        position="left"
      />

      {/* Stepper Content */}
      <div
        style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          overflowX: 'visible'
        }}
      >
        {steps.map((step, index) => (
          <StepperItem
            key={step.id}
            icon={step.icon}
            label={step.label}
            description={step.description}
            status={step.status}
            isCollapsed={isCollapsed}
            showConnector={index < steps.length - 1}
            isLocked={step.isLocked}
            onEdit={step.onEdit}
          />
        ))}
      </div>
    </div>
  );
};
