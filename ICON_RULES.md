# Icon Usage Rules

## Icon Systems

This project uses the following icon systems:

### 1. React Icons (Primary)
- **Library**: `react-icons` (specifically Material Design icons from `react-icons/md`)
- **When to use**: For all standard UI icons
- **Style**: Use **outlined** icons only (e.g., `MdOutlineHome`, `MdOutlineDescription`, etc.)
- **Import pattern**: `import { MdOutlineIconName } from 'react-icons/md'`

### 2. Custom SVG Icons (Fallback)
- **When to use**: Only when an icon doesn't exist in the react-icons library
- **Pattern**: Create as a React component that accepts `className` prop
- **Example**:
  ```tsx
  const CustomIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="..." fill="currentColor"/>
    </svg>
  );
  ```
- **Key requirements**:
  - Use `fill="currentColor"` or `stroke="currentColor"` to inherit text color
  - Accept `className` prop for styling flexibility
  - Keep viewBox consistent (typically "0 0 24 24")

### 3. Material Icons (Legacy - Avoid in New Code)
- **Pattern**: `<span className="material-icons">icon_name</span>`
- **Status**: Currently used in some older components but should be migrated to React Icons

## Guidelines

1. **Always prefer outlined icons** from `react-icons/md` over filled or other variants
2. **Check react-icons first** before creating custom SVG icons
3. **If you can't find the right outlined icon, ASK THE USER** - Don't guess or use a filled icon. The user can provide a custom SVG icon if needed.
4. **Maintain consistency** - if an icon exists in react-icons, don't create a custom version
5. **Custom icons should match the style** of Material Design outlined icons
6. **Use currentColor** for fills/strokes to allow color inheritance from parent text color

## Examples

### ✅ Good - Using React Icons (Outlined)
```tsx
import { MdOutlineHome, MdOutlineDescription, MdOutlineShoppingCart } from 'react-icons/md';

<MdOutlineHome size={24} />
<MdOutlineDescription size={24} />
```

### ✅ Good - Custom Icon (when not available in library)
```tsx
const NutritionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="..." fill="currentColor"/>
  </svg>
);

<NutritionIcon />
```

### ❌ Bad - Using filled icons
```tsx
import { MdHome } from 'react-icons/md'; // Not outlined
```

### ❌ Bad - Creating custom icon when one exists in react-icons
```tsx
// Don't create custom home icon when MdOutlineHome exists
const HomeIcon = () => <svg>...</svg>;
```

## Icon Size Standards

- **Default size**: 24px for most UI elements
- **Small icons**: 20px for compact areas
- **Large icons**: 32px or more for emphasis

## Color Handling

Icons should inherit color from their parent element's text color:
- Use `className` to apply text color classes
- Icons use `currentColor` to inherit the color
- Example: `<MdOutlineHome className="text-gray-600" />`
