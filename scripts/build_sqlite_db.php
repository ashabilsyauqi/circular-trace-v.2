<?php
/**
 * Programmatic SQLite Database Builder for CCT
 * Creates public/data/cct_database.sqlite and seeds it automatically.
 */

$dbPath = __DIR__ . '/../public/data/cct_database.sqlite';
$htaccessPath = __DIR__ . '/../public/data/.htaccess';

if (!file_exists(dirname($dbPath))) {
    mkdir(dirname($dbPath), 0755, true);
}

// 1. Protect data directory from direct browser downloads
file_put_contents($htaccessPath, "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Deny from all\n</IfModule>\n");

// 2. Remove existing sqlite file to rebuild fresh
if (file_exists($dbPath)) {
    unlink($dbPath);
}

$pdo = new PDO('sqlite:' . $dbPath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

echo "Creating SQLite schema...\n";

$schema = <<<SQL
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  verifier_domain TEXT DEFAULT NULL,
  organization TEXT NOT NULL,
  location TEXT NOT NULL,
  avatar TEXT DEFAULT NULL,
  phone TEXT DEFAULT NULL,
  balance REAL DEFAULT 0.00,
  bio TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coffee_farms (
  id TEXT PRIMARY KEY,
  farmer_id TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  farm_name TEXT NOT NULL,
  location TEXT NOT NULL,
  province TEXT DEFAULT 'Jawa Barat',
  latitude REAL DEFAULT NULL,
  longitude REAL DEFAULT NULL,
  altitude_meters INTEGER DEFAULT 1400,
  altitude_display TEXT DEFAULT NULL,
  land_area_hectares REAL DEFAULT 1.00,
  total_trees_count INTEGER DEFAULT 1000,
  primary_varieties TEXT DEFAULT '[]',
  soil_type TEXT DEFAULT 'Andosol Vulkanik',
  shade_trees TEXT DEFAULT '[]',
  organic_status TEXT DEFAULT 'Transisi Menuju Organik',
  eudr_compliant INTEGER DEFAULT 1,
  weather_data TEXT DEFAULT '{}',
  plot_boundary TEXT DEFAULT NULL,
  patok_list TEXT DEFAULT '[]',
  photo_url TEXT DEFAULT NULL,
  established_year INTEGER DEFAULT 2015,
  notes TEXT DEFAULT NULL,
  verification_status TEXT DEFAULT 'verified',
  verification_stamp TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farmer_harvest_lots (
  id TEXT PRIMARY KEY,
  farmer_id TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  farm_id TEXT DEFAULT NULL,
  farm_name TEXT DEFAULT NULL,
  farm_location TEXT NOT NULL,
  altitude TEXT NOT NULL,
  variety TEXT NOT NULL,
  harvest_date DATE NOT NULL,
  picking_method TEXT NOT NULL,
  brix REAL DEFAULT 20.0,
  total_weight_kg REAL NOT NULL,
  available_weight_kg REAL NOT NULL,
  price_per_kg REAL NOT NULL,
  notes TEXT DEFAULT NULL,
  status TEXT DEFAULT 'available',
  photo_url TEXT DEFAULT NULL,
  weather_snapshot TEXT DEFAULT NULL,
  soil_type TEXT DEFAULT NULL,
  shade_trees TEXT DEFAULT NULL,
  verification_status TEXT DEFAULT 'verified',
  verification_stamp TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS processing_batches (
  id TEXT PRIMARY KEY,
  processor_id TEXT NOT NULL,
  processor_name TEXT NOT NULL,
  batch_code TEXT NOT NULL,
  source_cherry_lots TEXT DEFAULT '[]',
  process_method TEXT NOT NULL,
  current_stage TEXT DEFAULT 'intake_sorting',
  intake_log TEXT DEFAULT NULL,
  fermentation_log TEXT DEFAULT NULL,
  drying_log TEXT DEFAULT NULL,
  conditioning_log TEXT DEFAULT NULL,
  milling_log TEXT DEFAULT NULL,
  grading_qc_log TEXT DEFAULT NULL,
  closure_log TEXT DEFAULT NULL,
  total_cherry_input_kg REAL NOT NULL,
  estimated_green_bean_yield_kg REAL DEFAULT 0.00,
  actual_green_bean_yield_kg REAL DEFAULT NULL,
  yield_percentage REAL DEFAULT NULL,
  waste_management TEXT DEFAULT NULL,
  status TEXT DEFAULT 'in_progress',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS processed_green_bean_lots (
  id TEXT PRIMARY KEY,
  processor_id TEXT NOT NULL,
  processor_name TEXT NOT NULL,
  source_farmer_lot_id TEXT NOT NULL,
  source_farmer_name TEXT NOT NULL,
  source_origin TEXT NOT NULL,
  variety TEXT NOT NULL,
  altitude TEXT NOT NULL,
  process_method TEXT NOT NULL,
  fermentation_time_hours INTEGER DEFAULT 36,
  drying_method TEXT NOT NULL,
  moisture_content_percent REAL DEFAULT 11.5,
  water_activity_aw REAL DEFAULT 0.58,
  grade TEXT DEFAULT 'Specialty Grade 1',
  defect_count INTEGER DEFAULT 2,
  screen_size TEXT DEFAULT 'Size 16-18',
  green_bean_weight_kg REAL NOT NULL,
  available_weight_kg REAL NOT NULL,
  price_per_kg REAL NOT NULL,
  cupping_notes TEXT DEFAULT '[]',
  processed_date DATE NOT NULL,
  status TEXT DEFAULT 'available',
  photo_url TEXT DEFAULT NULL,
  waste_management TEXT DEFAULT NULL,
  verification_status TEXT DEFAULT 'verified',
  verification_stamp TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS warehouse_lots (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  warehouse_name TEXT NOT NULL,
  source_green_bean_id TEXT NOT NULL,
  source_processor_name TEXT NOT NULL,
  source_farmer_name TEXT NOT NULL,
  origin TEXT NOT NULL,
  variety TEXT NOT NULL,
  altitude TEXT NOT NULL,
  process_method TEXT NOT NULL,
  storage_location TEXT NOT NULL,
  temperature_celsius REAL DEFAULT 20.0,
  humidity_percent REAL DEFAULT 55.0,
  packaging_type TEXT NOT NULL,
  verified_sca_score REAL DEFAULT 85.00,
  weight_kg REAL NOT NULL,
  available_weight_kg REAL NOT NULL,
  purchase_price_per_kg REAL NOT NULL,
  price_per_kg REAL NOT NULL,
  stored_date DATE NOT NULL,
  grade_tier TEXT NOT NULL,
  defect_count INTEGER DEFAULT 2,
  screen_size TEXT NOT NULL,
  moisture_content_percent REAL DEFAULT 11.0,
  water_activity_aw REAL DEFAULT 0.56,
  target_market TEXT DEFAULT NULL,
  has_health_certificate INTEGER DEFAULT 0,
  health_certificate_number TEXT DEFAULT NULL,
  status TEXT DEFAULT 'available',
  qc_status TEXT DEFAULT 'passed',
  notes TEXT DEFAULT NULL,
  verification_status TEXT DEFAULT 'verified',
  verification_stamp TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roast_profiles (
  id TEXT PRIMARY KEY,
  roaster_id TEXT NOT NULL,
  profile_name TEXT NOT NULL,
  roast_level TEXT NOT NULL,
  charge_temp INTEGER NOT NULL,
  turning_point_temp INTEGER NOT NULL,
  first_crack_time TEXT NOT NULL,
  first_crack_temp INTEGER NOT NULL,
  drop_time TEXT NOT NULL,
  drop_temp INTEGER NOT NULL,
  development_time_ratio REAL NOT NULL,
  notes TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roasted_bean_lots (
  id TEXT PRIMARY KEY,
  roaster_id TEXT NOT NULL,
  roaster_name TEXT NOT NULL,
  source_warehouse_lot_id TEXT NOT NULL,
  origin TEXT NOT NULL,
  variety TEXT NOT NULL,
  altitude TEXT NOT NULL,
  process_method TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  roaster_machine TEXT NOT NULL,
  roast_level TEXT NOT NULL,
  agtron_number INTEGER DEFAULT 65,
  roast_date DATE NOT NULL,
  development_time_ratio REAL DEFAULT 14.5,
  tasting_notes TEXT DEFAULT '[]',
  sca_cupping_score REAL DEFAULT 87.00,
  package_weight_grams INTEGER DEFAULT 250,
  total_packs INTEGER NOT NULL,
  available_packs INTEGER NOT NULL,
  price_per_pack REAL NOT NULL,
  resting_recommendation_days INTEGER DEFAULT 7,
  recommended_brew TEXT DEFAULT '[]',
  status TEXT DEFAULT 'available',
  photo_url TEXT DEFAULT NULL,
  source_work_order_id TEXT DEFAULT NULL,
  verification_status TEXT DEFAULT 'verified',
  verification_stamp TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS qc_cupping_sessions (
  id TEXT PRIMARY KEY,
  sample_id TEXT DEFAULT NULL,
  session_date DATE NOT NULL,
  evaluator_name TEXT NOT NULL,
  fragrance_aroma REAL NOT NULL,
  flavor REAL NOT NULL,
  aftertaste REAL NOT NULL,
  acidity REAL NOT NULL,
  body REAL NOT NULL,
  balance REAL NOT NULL,
  uniformity REAL NOT NULL,
  clean_cup REAL NOT NULL,
  sweetness REAL NOT NULL,
  overall REAL NOT NULL,
  total_score REAL NOT NULL,
  tasting_notes TEXT DEFAULT '[]',
  defect_deduction REAL DEFAULT 0.00,
  notes TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cafe_inventory (
  id TEXT PRIMARY KEY,
  cafe_id TEXT NOT NULL,
  cafe_name TEXT NOT NULL,
  source_roasted_bean_id TEXT NOT NULL,
  bean_name TEXT NOT NULL,
  roaster_name TEXT NOT NULL,
  origin TEXT NOT NULL,
  variety TEXT NOT NULL,
  process_method TEXT NOT NULL,
  roast_level TEXT NOT NULL,
  tasting_notes TEXT DEFAULT '[]',
  sca_score REAL DEFAULT 85.00,
  pack_weight_grams INTEGER DEFAULT 1000,
  packs_in_stock INTEGER NOT NULL,
  purchase_date DATE NOT NULL,
  cost_per_pack REAL NOT NULL,
  lineage TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cafe_products (
  id TEXT PRIMARY KEY,
  cafe_id TEXT NOT NULL,
  cafe_name TEXT NOT NULL,
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  variety TEXT NOT NULL,
  roast_level TEXT NOT NULL,
  tasting_notes TEXT DEFAULT '[]',
  price REAL NOT NULL,
  package_unit TEXT NOT NULL,
  total_stock INTEGER NOT NULL,
  available_stock INTEGER NOT NULL,
  description TEXT DEFAULT NULL,
  photo_url TEXT DEFAULT NULL,
  verification_status TEXT DEFAULT 'verified',
  verification_stamp TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS supply_chain_transactions (
  id TEXT PRIMARY KEY,
  tx_date DATE NOT NULL,
  from_role TEXT NOT NULL,
  from_name TEXT NOT NULL,
  to_role TEXT NOT NULL,
  to_name TEXT NOT NULL,
  item_name TEXT NOT NULL,
  quantity TEXT NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT DEFAULT 'Selesai',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_stamps (
  id TEXT PRIMARY KEY,
  stamp_type TEXT NOT NULL,
  title TEXT NOT NULL,
  certificate_number TEXT NOT NULL,
  verifier_id TEXT NOT NULL,
  verifier_name TEXT NOT NULL,
  verifier_title TEXT NOT NULL,
  verifier_org TEXT NOT NULL,
  verified_at DATETIME NOT NULL,
  status TEXT DEFAULT 'verified',
  score_display TEXT DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  digital_signature_hash TEXT NOT NULL,
  cupping_evaluation TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
SQL;

$pdo->exec($schema);
echo "Schema created successfully.\n";

echo "Reading database/seed.sql...\n";
$seedSql = file_get_contents(__DIR__ . '/../database/seed.sql');
$lines = explode("\n", $seedSql);

$pdo->beginTransaction();
$count = 0;
foreach ($lines as $line) {
    $line = trim($line);
    if (!$line || str_starts_with($line, '--') || str_starts_with($line, 'SET FOREIGN_KEY_CHECKS')) {
        continue;
    }
    if (str_starts_with($line, 'INSERT INTO')) {
        // Replace with INSERT OR REPLACE INTO for idempotency
        $sqliteLine = preg_replace('/^INSERT INTO/i', 'INSERT OR REPLACE INTO', $line);
        try {
            $pdo->exec($sqliteLine);
            $count++;
        } catch (Exception $e) {
            echo "Error executing seed line: " . $e->getMessage() . "\n";
            echo "Line: " . substr($sqliteLine, 0, 100) . "...\n";
        }
    }
}
$pdo->commit();

echo "Seeded $count records into SQLite database successfully!\n";
echo "File created at: " . realpath($dbPath) . " (" . round(filesize($dbPath) / 1024, 1) . " KB)\n";
