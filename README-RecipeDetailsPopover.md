# Recipe Details Popover Component

A reusable popover component for displaying detailed recipe information with accordion sections.

## Features

- **Radix UI Popover**: Built on Radix UI primitives for accessibility
- **Accordion Sections**: Collapsible sections for Ingredients, Nutrition, and Directions
- **Flexible Action Button**: Customizable action button with dynamic state
- **Responsive Design**: Follows the design system with proper spacing and colors
- **Type-Safe**: Full TypeScript support with exported Recipe interface

## Usage

### Basic Usage

```tsx
import { RecipeDetailsPopover } from '@/components/nutrition-plans/RecipeDetailsPopover';
import type { Recipe } from '@/components/nutrition-plans/RecipeDetailsPopover';

const recipe: Recipe = {
  id: 1,
  title: 'Roasted Tomato Chickpea Bowl',
  time: '50 mins',
  ingredients: 10,
  image: '/path/to/image.jpg',
  tags: ['Vegan', 'Mediterranean'],
  ingredientsList: [
    { amount: '1/2 Cup', name: 'Quinoa (dry, rinsed)' },
    { amount: '1 Cup', name: 'Cherry Tomatoes' },
  ],
  nutrition: {
    calories: 464,
    fat: 22,
    carbs: 54,
    protein: 17,
  },
  directions: [
    'Preheat the oven to 350ºF (175ºC).',
    'Cook the quinoa according to package directions.',
  ],
};

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  return (
    <RecipeDetailsPopover
      recipe={recipe}
      open={isOpen}
      onOpenChange={setIsOpen}
      onActionClick={(recipe) => {
        setIsAdded(!isAdded);
        console.log('Action clicked for:', recipe.title);
      }}
      actionLabel="Add"
      isActionActive={isAdded}
    >
      <button>View Recipe Details</button>
    </RecipeDetailsPopover>
  );
}
```

### With Recipe Cards

```tsx
<RecipeDetailsPopover
  recipe={recipe}
  open={openPopoverId === recipe.id}
  onOpenChange={(open) => setOpenPopoverId(open ? recipe.id : null)}
  onActionClick={(recipe) => handleAddRecipe(recipe.id)}
  isActionActive={selectedRecipes.includes(recipe.id)}
>
  <div className="recipe-card">
    <img src={recipe.image} alt={recipe.title} />
    <h3>{recipe.title}</h3>
  </div>
</RecipeDetailsPopover>
```

## Props

### RecipeDetailsPopoverProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `recipe` | `Recipe` | Yes | - | The recipe data to display |
| `open` | `boolean` | No | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | No | - | Callback when open state changes |
| `onActionClick` | `(recipe: Recipe) => void` | No | - | Callback when action button is clicked |
| `actionLabel` | `string` | No | `'Add'` | Label for the action button |
| `isActionActive` | `boolean` | No | `false` | Whether the action is in active state (shows "Added") |
| `children` | `React.ReactNode` | No | - | Trigger element for the popover |

### Recipe Interface

```typescript
interface Recipe {
  id: number;
  title: string;
  time: string;
  ingredients: number;
  image?: string;
  description?: string;
  servings?: number;
  tags?: string[];
  ingredientsList?: Array<{
    amount: string;
    name: string;
  }>;
  nutrition?: {
    calories?: number;
    fat?: number;
    carbs?: number;
    fiber?: number;
    sugar?: number;
    protein?: number;
    cholesterol?: number;
    sodium?: number;
  };
  directions?: string[];
}
```

## Accordion Sections

The component includes three accordion sections:

1. **Ingredients** (default open): Lists all ingredients with amounts
2. **Nutrition** (default closed): Shows nutrition information per serving
3. **Directions** (default closed): Step-by-step cooking instructions

## Customization

The component is designed to be reusable across different contexts:

- **Recipe Selection**: Use in recipe browsers with "Add" action
- **Recipe Management**: Use in saved recipes with "Remove" or other actions
- **View Only**: Omit `onActionClick` to display without action button

## Example: Different Use Cases

### Use Case 1: Recipe Selection (Step 4)
```tsx
<RecipeDetailsPopover
  recipe={recipe}
  onActionClick={(recipe) => toggleRecipeSelection(recipe.id)}
  actionLabel="Add"
  isActionActive={isSelected}
>
  <RecipeCard />
</RecipeDetailsPopover>
```

### Use Case 2: Meal Plan Viewer
```tsx
<RecipeDetailsPopover
  recipe={recipe}
  onActionClick={(recipe) => removeFromPlan(recipe.id)}
  actionLabel="Remove"
  isActionActive={false}
>
  <MealPlanRecipeCard />
</RecipeDetailsPopover>
```

### Use Case 3: Read-Only Recipe Library
```tsx
<RecipeDetailsPopover recipe={recipe}>
  <RecipeLibraryCard />
</RecipeDetailsPopover>
```

## Implementation in Step 4

The component has been integrated into [Step4ChooseRecipes.tsx](src/pages/wizard/Step4ChooseRecipes.tsx) where:
- Clicking a recipe card opens the popover
- The "Add" button in the popover adds/removes the recipe from selection
- The bottom "Add" button on the card also works independently
- Both Browse and Recipe Collection views use the same popover

## Files

- Component: [src/components/nutrition-plans/RecipeDetailsPopover.tsx](src/components/nutrition-plans/RecipeDetailsPopover.tsx)
- Popover Primitive: [src/components/ui/popover.tsx](src/components/ui/popover.tsx)
- Mock Data: [src/data/mockRecipes.ts](src/data/mockRecipes.ts)
- Usage Example: [src/pages/wizard/Step4ChooseRecipes.tsx](src/pages/wizard/Step4ChooseRecipes.tsx)
