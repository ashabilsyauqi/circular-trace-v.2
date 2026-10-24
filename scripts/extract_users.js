import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectDir = path.resolve(__dirname, '..');

const mockDataPath = path.join(projectDir, 'src', 'data', 'mockData.ts');
const content = fs.readFileSync(mockDataPath, 'utf-8');

const startIdx = content.indexOf('export const MOCK_USERS: AppUser[] = [');
const endIdx = content.indexOf('export const INITIAL_COFFEE_FARMS: CoffeeFarm[] = [');

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find boundaries');
  process.exit(1);
}

let arrayBlock = content.slice(startIdx + 'export const MOCK_USERS: AppUser[] = ['.length - 1, endIdx);
arrayBlock = arrayBlock.trim();
if (arrayBlock.endsWith(';')) {
  arrayBlock = arrayBlock.slice(0, -1).trim();
}

// Remove only comment lines (lines where // is after optional whitespace)
const noComments = arrayBlock.replace(/^\s*\/\/.*$/gm, '');

// Evaluate safely
const users = new Function(`return ${noComments}`)();

const dataDir = path.join(projectDir, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const outputPath = path.join(dataDir, 'users.json');
fs.writeFileSync(outputPath, JSON.stringify(users, null, 2), 'utf-8');
console.log(`Successfully wrote ${users.length} users to ${outputPath}`);
