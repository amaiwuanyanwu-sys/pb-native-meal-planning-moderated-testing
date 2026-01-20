// Ingredient food group tags
export const INGREDIENT_TAGS = {
  DAIRY: 'Dairy',
  ALLIUMS: 'Alliums',
  TREE_NUTS: 'Tree nuts',
  PEANUTS: 'Peanuts',
  FISH: 'Fish',
  SHELLFISH: 'Shellfish',
  SOY: 'Soy',
  MEAT: 'Meat',
  POULTRY: 'Poultry',
  EGGS: 'Eggs',
  GLUTEN: 'Gluten',
  GRAINS: 'Grains',
  LEGUMES: 'Legumes',
  NIGHTSHADES: 'Nightshades',
  SEEDS: 'Seeds',
  COCONUT: 'Coconut',
} as const;

export type IngredientTag = typeof INGREDIENT_TAGS[keyof typeof INGREDIENT_TAGS];

// Mapping of ingredient name patterns to tags
// Using lowercase for case-insensitive matching
export const tagPatterns: Record<IngredientTag, string[]> = {
  [INGREDIENT_TAGS.DAIRY]: [
    'milk', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt', 'whey', 'casein',
    'lactose', 'ghee', 'paneer', 'ricotta', 'mozzarella', 'cheddar', 'parmesan',
    'feta', 'goat cheese', 'dairy', 'kefir', 'cottage cheese', 'sour cream'
  ],
  [INGREDIENT_TAGS.ALLIUMS]: [
    'onion', 'garlic', 'leek', 'shallot', 'scallion', 'chive', 'green onion'
  ],
  [INGREDIENT_TAGS.TREE_NUTS]: [
    'almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'macadamia', 'hazelnut',
    'brazil nut', 'pine nut', 'chestnut'
  ],
  [INGREDIENT_TAGS.PEANUTS]: [
    'peanut', 'peanut butter'
  ],
  [INGREDIENT_TAGS.FISH]: [
    'salmon', 'tuna', 'cod', 'tilapia', 'trout', 'halibut', 'mackerel', 'sardine',
    'anchovy', 'bass', 'fish', 'haddock', 'pollock', 'catfish', 'flounder', 'seafood'
  ],
  [INGREDIENT_TAGS.SHELLFISH]: [
    'shrimp', 'crab', 'lobster', 'clam', 'mussel', 'oyster', 'scallop', 'crawfish',
    'prawn', 'shellfish', 'seafood'
  ],
  [INGREDIENT_TAGS.SOY]: [
    'soy', 'tofu', 'tempeh', 'edamame', 'soy sauce', 'tamari', 'miso', 'soybean'
  ],
  [INGREDIENT_TAGS.MEAT]: [
    'beef', 'pork', 'lamb', 'veal', 'bacon', 'ham', 'sausage', 'steak', 'ground beef',
    'ground pork', 'brisket', 'ribs', 'meat'
  ],
  [INGREDIENT_TAGS.POULTRY]: [
    'chicken', 'turkey', 'duck', 'goose', 'quail', 'poultry', 'chicken breast',
    'ground chicken', 'ground turkey'
  ],
  [INGREDIENT_TAGS.EGGS]: [
    'egg', 'eggs'
  ],
  [INGREDIENT_TAGS.GLUTEN]: [
    'wheat', 'barley', 'rye', 'flour', 'bread', 'pasta', 'couscous', 'bulgur',
    'seitan', 'spelt', 'farro', 'graham', 'semolina', 'durum'
  ],
  [INGREDIENT_TAGS.GRAINS]: [
    'rice', 'quinoa', 'oat', 'corn', 'millet', 'sorghum', 'buckwheat', 'amaranth',
    'teff', 'grain', 'cereal', 'wheat', 'barley', 'rye', 'popcorn'
  ],
  [INGREDIENT_TAGS.LEGUMES]: [
    'bean', 'lentil', 'chickpea', 'pea', 'pinto', 'kidney bean', 'black bean',
    'navy bean', 'lima bean', 'garbanzo', 'split pea', 'legume'
  ],
  [INGREDIENT_TAGS.NIGHTSHADES]: [
    'tomato', 'potato', 'pepper', 'eggplant', 'paprika', 'cayenne', 'bell pepper',
    'jalapeño', 'chili', 'nightshade', 'goji'
  ],
  [INGREDIENT_TAGS.SEEDS]: [
    'sesame', 'sunflower seed', 'pumpkin seed', 'chia', 'flax', 'hemp seed',
    'poppy seed', 'seed'
  ],
  [INGREDIENT_TAGS.COCONUT]: [
    'coconut'
  ]
};

/**
 * Get tags for an ingredient based on its name
 */
export function getIngredientTags(ingredientName: string): IngredientTag[] {
  const lowerName = ingredientName.toLowerCase();
  const tags: IngredientTag[] = [];

  for (const [tag, patterns] of Object.entries(tagPatterns)) {
    for (const pattern of patterns) {
      if (lowerName.includes(pattern)) {
        tags.push(tag as IngredientTag);
        break; // Found a match for this tag, move to next tag
      }
    }
  }

  return tags;
}

/**
 * Get all ingredients that match a specific tag
 */
export function getIngredientsByTag(ingredients: Array<{ Ingredients: string }>, tag: IngredientTag): string[] {
  return ingredients
    .filter(ingredient => {
      const tags = getIngredientTags(ingredient.Ingredients);
      return tags.includes(tag);
    })
    .map(ingredient => ingredient.Ingredients);
}

/**
 * All available tags in display order
 */
export const ALL_TAGS: IngredientTag[] = [
  INGREDIENT_TAGS.DAIRY,
  INGREDIENT_TAGS.ALLIUMS,
  INGREDIENT_TAGS.TREE_NUTS,
  INGREDIENT_TAGS.PEANUTS,
  INGREDIENT_TAGS.FISH,
  INGREDIENT_TAGS.SHELLFISH,
  INGREDIENT_TAGS.SOY,
  INGREDIENT_TAGS.MEAT,
  INGREDIENT_TAGS.POULTRY,
  INGREDIENT_TAGS.EGGS,
  INGREDIENT_TAGS.GLUTEN,
  INGREDIENT_TAGS.GRAINS,
  INGREDIENT_TAGS.LEGUMES,
  INGREDIENT_TAGS.NIGHTSHADES,
  INGREDIENT_TAGS.SEEDS,
  INGREDIENT_TAGS.COCONUT,
];
