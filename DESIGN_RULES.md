# Design Rules

## Color Usage

**CRITICAL**: Always use the exact colors from Figma designs. Do NOT use generic Tailwind color names like `gray-50`, `gray-600`, etc.

### How to Find Colors

1. Select the element in Figma
2. Look at the design token names in the right panel (e.g., "Neutrals/600 - Slate: #657A7E")
3. Use the exact hex color values in your code

### Color Format

- Use hex colors with Tailwind's bracket notation: `text-[#657a7e]`
- For backgrounds: `bg-[#01272e]`
- For borders: `border-[#dfe3e4]`

### Common Project Colors

Based on the design system, here are frequently used colors:

- **Neutrals/900 - Slate**: `#01272e` - Active backgrounds, dark elements
- **Neutrals/800 - Slate**: `#244348` - Dark text, headers
- **Neutrals/700 - Slate**: `#385459` - Section headers, medium emphasis text
- **Neutrals/600 - Slate**: `#657a7e` - Default text, icons
- **Neutrals/300 - Slate**: `#dfe3e4` - Borders, dividers
- **White**: `white` or `#ffffff` - Backgrounds, light text

### Examples

#### ✅ Good - Using Figma colors
```tsx
<div className="bg-[#01272e] text-white border-[#dfe3e4]">
  <p className="text-[#657a7e]">Default text</p>
</div>
```

#### ❌ Bad - Using generic Tailwind colors
```tsx
<div className="bg-gray-900 text-white border-gray-200">
  <p className="text-gray-600">Default text</p>
</div>
```

## Typography

Always match font weights, sizes, and line heights from Figma:

- **Body/Paragraph 3 (Medium)**: `text-[14px] font-medium leading-[1.4]`
- **Body/Paragraph 3 (SemiBold)**: `text-[14px] font-semibold leading-[1.4]`

## Spacing

Use exact spacing values from Figma:
- Padding: `px-4 py-2` (16px horizontal, 8px vertical)
- Gap: `gap-2` (8px)

## Component States

When creating interactive components, ensure you capture all states from Figma:
1. **Default state** - Base appearance
2. **Hover state** - Mouse over interaction
3. **Active/Selected state** - Currently selected item
4. **Disabled state** (if applicable)

## Workflow

1. Select the component/element in Figma
2. Review all variants/states
3. Note exact colors, typography, spacing, and borders
4. Implement with exact values (no approximations)
5. Test all interactive states
