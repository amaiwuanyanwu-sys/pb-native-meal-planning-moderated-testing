import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WizardStep } from '@/components/wizard/WizardStepper';
import type { StepStatus } from '@/components/wizard/StepperItem';
import { PreferencesIcon } from '@/components/icons/PreferencesIcon';
import { RecipesIcon } from '@/components/icons/RecipesIcon';

export type StepId = 'food-preferences' | 'allergens-exclusions' | 'choose-recipes' | 'finalize-plan';

interface UseWizardStepperProps {
  currentStepId: StepId;
  completedSteps?: StepId[];
}

// Map step IDs to routes
const stepRoutes: Record<StepId, string> = {
  'food-preferences': '/wizard/step-1',
  'allergens-exclusions': '/wizard/step-2',
  'choose-recipes': '/wizard/step-3',
  'finalize-plan': '/wizard/step-4'
};

export const useWizardStepper = ({ currentStepId, completedSteps = [] }: UseWizardStepperProps) => {
  // Collapse by default on steps 3 and 4
  const [isCollapsed, setIsCollapsed] = useState(
    currentStepId === 'choose-recipes' || currentStepId === 'finalize-plan'
  );
  const navigate = useNavigate();

  // Define step order
  const stepOrder: StepId[] = [
    'food-preferences',
    'allergens-exclusions',
    'choose-recipes',
    'finalize-plan'
  ];

  // Get status for a step
  const getStepStatus = (stepId: StepId): StepStatus => {
    if (completedSteps.includes(stepId)) {
      return 'completed';
    }
    if (stepId === currentStepId) {
      return 'active';
    }
    return 'inactive';
  };

  // Check if a step is locked
  const isStepLocked = (stepId: StepId): boolean => {
    const stepIndex = stepOrder.indexOf(stepId);

    // A step is locked if it hasn't been completed and there are no completed steps after it
    // This allows users to go back to any previously completed step without locking future steps
    if (completedSteps.includes(stepId)) {
      return false; // Never lock a completed step
    }

    // Check if this step comes after the furthest completed step
    const furthestCompletedIndex = completedSteps.reduce((max, stepId) => {
      const index = stepOrder.indexOf(stepId);
      return index > max ? index : max;
    }, -1);

    // Lock if this step is more than one step ahead of the furthest completed step
    return stepIndex > furthestCompletedIndex + 1;
  };

  // Helper to get icon color based on status
  const getIconColor = (stepId: StepId) => {
    const status = getStepStatus(stepId);
    if (status === 'completed') return '#FFFFFF';
    if (status === 'active') return '#385459';
    return '#96A5A8';
  };

  // Generate steps with icons
  const steps: WizardStep[] = useMemo(() => {
    const createStep = (stepId: StepId, label: string, description: string, icon: React.ReactNode) => {
      const status = getStepStatus(stepId);
      return {
        id: stepId,
        label,
        description,
        icon,
        status,
        isLocked: isStepLocked(stepId),
        onEdit: status === 'completed' ? () => navigate(stepRoutes[stepId]) : undefined
      };
    };

    return [
      createStep(
        'food-preferences',
        'Food preferences',
        '',
        <PreferencesIcon color={getIconColor('food-preferences')} />
      ),
      createStep(
        'allergens-exclusions',
        'Allergens & exclusions',
        '',
        <span className="material-icons-outlined" style={{ fontSize: '20px', color: getIconColor('allergens-exclusions') }}>no_food</span>
      ),
      createStep(
        'choose-recipes',
        'Choose recipes',
        '',
        <RecipesIcon color={getIconColor('choose-recipes')} />
      ),
      createStep(
        'finalize-plan',
        'Customize plan',
        '',
        <span className="material-icons" style={{ fontSize: '20px', color: getIconColor('finalize-plan') }}>grid_on</span>
      )
    ];
  }, [currentStepId, completedSteps, navigate]);

  const toggleCollapse = () => setIsCollapsed(prev => !prev);

  return {
    steps,
    isCollapsed,
    toggleCollapse
  };
};
