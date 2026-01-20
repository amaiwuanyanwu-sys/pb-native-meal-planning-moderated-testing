import XLSX from 'xlsx';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the Excel file
const workbook = XLSX.readFile(join(__dirname, '../src/assets/master_ingredients.xlsx'));

// Get the first worksheet
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('Extracted ingredients:', data.length);
console.log('Sample data:', data.slice(0, 5));

// Write to a TypeScript file
const outputPath = join(__dirname, '../src/data/masterIngredients.ts');
const tsContent = `// Auto-generated from master_ingredients.xlsx
// Do not edit manually

export interface Ingredient {
  [key: string]: any;
}

export const masterIngredients: Ingredient[] = ${JSON.stringify(data, null, 2)};
`;

writeFileSync(outputPath, tsContent);
console.log(`\nWritten to ${outputPath}`);
