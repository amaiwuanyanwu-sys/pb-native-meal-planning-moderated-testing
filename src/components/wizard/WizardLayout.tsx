import React from 'react';
import { WizardStepper } from './WizardStepper';
import { useWizardStepper, type StepId } from '@/hooks/useWizardStepper';

export type { StepId };

interface WizardLayoutProps {
  currentStep: StepId;
  completedSteps?: StepId[];
  children: React.ReactNode;
}

/**
 * WizardLayout component that wraps wizard pages with the stepper sidebar
 *
 * Usage example:
 * ```tsx
 * <WizardLayout currentStep="food-preferences" completedSteps={[]}>
 *   <YourWizardStepContent />
 * </WizardLayout>
 * ```
 */
export const WizardLayout: React.FC<WizardLayoutProps> = ({
  currentStep,
  completedSteps = [],
  children
}) => {
  const { steps, isCollapsed, toggleCollapse } = useWizardStepper({
    currentStepId: currentStep,
    completedSteps
  });

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F8F9F9' }}>
      {/* Stepper Sidebar */}
      <WizardStepper
        steps={steps}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
};
