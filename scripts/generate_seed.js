import fs from 'fs';
import path from 'path';

// Helper to escape SQL string
function sqlVal(val) {
  if (val === undefined || val === null) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  if (typeof val === 'object') {
    return "'" + JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  }
  return "'" + String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

async function run() {
  console.log('Generating database/seed.sql from compiled TypeScript mockData...');
}
run();
