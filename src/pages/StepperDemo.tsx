import React, { useState } from 'react';
import { WizardStepper } from '@/components/wizard/WizardStepper';
import { MagicWandIcon } from '@/components/icons/MagicWandIcon';
import { PreferencesIcon } from '@/components/icons/PreferencesIcon';
import { RecipesIcon } from '@/components/icons/RecipesIcon';
import type { WizardStep } from '@/components/wizard/WizardStepper';

const StepperDemo: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedStepsIndices, setCompletedStepsIndices] = useState<number[]>([]);

  const getStepStatus = (stepIdx: number) => {
    if (stepIdx === currentStepIndex) return 'active';
    if (completedStepsIndices.includes(stepIdx)) return 'completed';
    return 'inactive';
  };

  const isStepLocked = (stepIdx: number) => {
    // Never lock completed steps
    if (completedStepsIndices.includes(stepIdx)) return false;

    // Find furthest completed step
    const furthestCompleted = completedStepsIndices.length > 0
      ? Math.max(...completedStepsIndices)
      : -1;

    // Lock if more than one step ahead
    return stepIdx > furthestCompleted + 1;
  };

  const getIconColor = (stepIdx: number) => {
    const status = getStepStatus(stepIdx);
    if (status === 'completed') return '#FFFFFF';
    if (status === 'active') return '#385459';
    return '#96A5A8';
  };

  // Demo steps with different states
  const steps: WizardStep[] = [
    {
      id: 'food-preferences',
      label: 'Food preferences',
      description: 'Dietary preferences & cooking effort',
      icon: <PreferencesIcon color={getIconColor(0)} />,
      status: getStepStatus(0),
      isLocked: isStepLocked(0),
      onEdit: getStepStatus(0) === 'completed' ? () => setCurrentStepIndex(0) : undefined
    },
    {
      id: 'allergens-exclusions',
      label: 'Allergens & Exclusions',
      description: 'Food allergies & dietary restrictions',
      icon: <span className="material-icons-outlined" style={{ fontSize: '20px', color: getIconColor(1) }}>no_food</span>,
      status: getStepStatus(1),
      isLocked: isStepLocked(1),
      onEdit: getStepStatus(1) === 'completed' ? () => setCurrentStepIndex(1) : undefined
    },
    {
      id: 'choose-recipes',
      label: 'Choose recipes',
      description: 'Select recipes for your plan',
      icon: <RecipesIcon color={getIconColor(2)} />,
      status: getStepStatus(2),
      isLocked: isStepLocked(2),
      onEdit: getStepStatus(2) === 'completed' ? () => setCurrentStepIndex(2) : undefined
    },
    {
      id: 'finalize-plan',
      label: 'Finalize plan',
      description: 'Review and finalize your nutrition plan',
      icon: <span className="material-icons" style={{ fontSize: '20px', color: getIconColor(3) }}>grid_on</span>,
      status: getStepStatus(3),
      isLocked: isStepLocked(3),
      onEdit: getStepStatus(3) === 'completed' ? () => setCurrentStepIndex(3) : undefined
    }
  ];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      // Mark current step as completed when moving forward
      if (!completedStepsIndices.includes(currentStepIndex)) {
        setCompletedStepsIndices([...completedStepsIndices, currentStepIndex]);
      }
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setCompletedStepsIndices([]);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F8F9F9' }}>
      {/* Stepper Sidebar */}
      <WizardStepper
        steps={steps}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <div
          style={{
            background: '#F0F2F3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 24px',
            borderBottom: '1px solid #C1C9CB'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MagicWandIcon className="text-[#657A7E]" />
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#244348' }}>
              Nutrition Plan Assistant - Stepper Demo
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto'
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              padding: '32px',
              textAlign: 'center'
            }}
          >
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#01272E', marginBottom: '16px' }}>
              Step {currentStepIndex + 1}: {steps[currentStepIndex].label}
            </h1>
            <p style={{ fontSize: '16px', color: '#657A7E', marginBottom: '32px' }}>
              This is a demo page to preview the wizard stepper component. Use the buttons below to navigate
              through steps and see how the stepper updates.
            </p>

            {/* Demo Controls */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
                style={{
                  padding: '10px 16px',
                  background: currentStepIndex === 0 ? '#DFE3E4' : '#01272E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                Previous Step
              </button>
              <button
                onClick={handleNext}
                disabled={currentStepIndex === steps.length - 1}
                style={{
                  padding: '10px 16px',
                  background: currentStepIndex === steps.length - 1 ? '#DFE3E4' : '#01272E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentStepIndex === steps.length - 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                Next Step
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: '10px 16px',
                  background: '#657A7E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                Reset
              </button>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                  padding: '10px 16px',
                  background: '#96A5A8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                Toggle Stepper
              </button>
            </div>

            {/* Status Info */}
            <div
              style={{
                marginTop: '32px',
                padding: '16px',
                background: '#F0F2F3',
                borderRadius: '8px',
                textAlign: 'left'
              }}
            >
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#01272E', marginBottom: '8px' }}>
                Current State:
              </h3>
              <ul style={{ fontSize: '14px', color: '#657A7E', lineHeight: 1.6, paddingLeft: '20px' }}>
                <li>Current Step: {currentStepIndex + 1} of {steps.length}</li>
                <li>Stepper: {isCollapsed ? 'Collapsed (64px)' : 'Expanded (320px)'}</li>
                <li>Completed Steps: {completedStepsIndices.length} (indices: {completedStepsIndices.join(', ') || 'none'})</li>
                <li>Locked Steps: {steps.filter(s => s.isLocked).length}</li>
                <li>✨ Try going to step 3, then clicking step 1 to go back - step 3 stays unlocked!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepperDemo;
