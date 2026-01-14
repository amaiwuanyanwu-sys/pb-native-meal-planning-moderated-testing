# Project Rules & Constraints

## Critical Requirements

### 1. Routing for Useberry Tracking
**MOST IMPORTANT**: Use separate routes for ALL view changes so Useberry can properly track user interactions and navigation.

- ✅ Opening a side panel → Use a route (e.g., `/plans/:planId/recipe/:recipeId`)
- ✅ Opening a modal with significant content → Use a route
- ✅ Navigating between pages → Use routes (already doing this)
- ❌ Don't rely on state-only view changes for major UI transitions
- ❌ Don't use hash-based routing or URL fragments for navigation

**Why**: Useberry needs distinct URLs to track user flows through the prototype.

---

## Technology Stack

### Framework & Tools
- **React 19.2.0** with TypeScript 5.9 (strict mode)
- **React Router 7.12.0** for all routing
- **Vite** as build tool
- **Tailwind CSS 4.1.18** for styling
- **ESLint** for code quality

### Component Strategy
- **Custom components** built from scratch in `src/components/`
- **shadcn/ui components** imported selectively for complex interactions:
  - Popovers
  - Dialogs/Modals
  - Calendar
  - Form components (if needed)
- All shadcn/ui components must be **styled to match our design system**

---

## Design System

### Color Palette
- **Primary palette**: Gray tones
- Background: `bg-gray-50`
- Primary text: `text-gray-900`
- Secondary text: `text-gray-600`
- Primary buttons: `bg-gray-900 text-white`
- Secondary buttons: `bg-gray-200 text-gray-900`

### Styling Approach
- **Tailwind utility-first** for all styling
- Consistent spacing and typography
- Hover/focus states for all interactive elements
- Reference Figma designs for exact specifications

---

## Development Workflow

### Step-by-Step Process (Per Page/Feature)
1. **Review Figma design** - Use Figma MCP to get design details
2. **Plan components** - List all components needed for the page
3. **Build components individually** - Create each component in isolation with TypeScript
4. **Assemble page** - Put components together
5. **Test & refine** - Verify functionality and design alignment
6. **Add routes** - Ensure proper routing for Useberry tracking

### Key Principles
- Build components in **isolation** before assembly
- Match **Figma designs closely**
- Use **TypeScript** for all components (with proper type definitions)
- Keep components **reusable and composable**
- Add **proper error handling and loading states**

---

## Claude API Integration

### Where AI Features Are Needed
1. **Plan optimization** - Rebalance nutrition across week
2. **Making exclusions** - Handle dietary restrictions
3. **Editing plans** - Adding, swapping, optimizing meals
4. **Meal suggestions** - Suggest meals based on existing plan

### Implementation Notes
- API calls should be wrapped in custom hooks
- Add loading states for all API calls
- Add error handling for failed requests
- Store API key in environment variables (never commit)

---

## Code Quality Standards

### TypeScript
- Use strict mode (already configured)
- Define proper interfaces for all data structures
- Use type definitions for props, state, and API responses
- Avoid `any` types

### Component Structure
```typescript
// Preferred component structure
import React from 'react';

interface ComponentProps {
  // Props with proper types
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic

  return (
    // JSX with Tailwind classes
  );
};
```

### File Organization
```
src/
├── api/              # API client wrappers
├── assets/           # Static assets
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Layout components
│   ├── forms/       # Form components
│   ├── meal-planner/# Planner-specific components
│   └── wizard/      # Wizard-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── pages/           # Page components (route handlers)
└── types/           # TypeScript type definitions
```

---

## Don'ts (Anti-patterns to Avoid)

❌ **Don't** use state-only navigation for major view changes
❌ **Don't** use hash-based routing
❌ **Don't** commit API keys or secrets
❌ **Don't** use `any` types in TypeScript
❌ **Don't** build everything in one component (keep it modular)
❌ **Don't** skip TypeScript interfaces for props
❌ **Don't** forget hover/focus states on interactive elements
❌ **Don't** deviate from the gray color palette without approval
❌ **Don't** install unnecessary dependencies

---

## Testing & Verification

### After Each Implementation
1. Run development server: `npm run dev`
2. Visual inspection against Figma designs
3. Test all navigation and routing
4. Test interactions (buttons, forms, modals)
5. Check responsive design
6. Test API calls (when implemented)

### Before Useberry Integration
- Verify all major UI transitions use routes
- Test all links and navigation paths
- Ensure no state-only view changes
- Confirm side panels/modals use routes where appropriate

---

## Environment Setup

### Required Files
- `.env` - Environment variables (not committed)
- `.env.example` - Example environment variables (committed)
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration

### Environment Variables
```
VITE_CLAUDE_API_KEY=your_api_key_here
```

---

## Quick Reference

### Current Project State
- ✅ React + TypeScript with Vite
- ✅ React Router configured
- ✅ Tailwind CSS partially integrated
- ✅ 4 page stubs created
- ❌ No reusable components yet
- ❌ No API integration yet
- ❌ No Tailwind config file yet

### Next Steps
Follow user guidance on which page/feature to build next, always starting with Figma design review.
