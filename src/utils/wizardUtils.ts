/**
 * Clear all wizard-related data from localStorage
 */
export function clearWizardData(): void {
  localStorage.removeItem('wizard_completedSteps');
  localStorage.removeItem('wizard_selectedTags');
  localStorage.removeItem('wizard_allergens');
  localStorage.removeItem('wizard_allergensDescription');
  localStorage.removeItem('wizard_allExcludedIngredients');
  localStorage.removeItem('wizard_clientId');
  localStorage.removeItem('wizard_foodPreferences');
  localStorage.removeItem('wizard_favoriteFoods');
  localStorage.removeItem('wizard_selectedRecipes');
  localStorage.removeItem('wizard_createdPlan');
  localStorage.removeItem('wizard_step');
  localStorage.removeItem('wizard_step3_loaded');
}
