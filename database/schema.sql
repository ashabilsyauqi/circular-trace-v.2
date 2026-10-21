-- ==============================================================================
-- Circular Coffee Trace (sangrAI) - Database Schema DDL
-- Target Engine: MySQL 8.0+ / MariaDB 10.5+ (cPanel Compatible)
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `verification_stamps`;
DROP TABLE IF EXISTS `supply_chain_transactions`;
DROP TABLE IF EXISTS `cafe_products`;
DROP TABLE IF EXISTS `cafe_inventory`;
DROP TABLE IF EXISTS `qc_cupping_sessions`;
DROP TABLE IF EXISTS `roasted_bean_lots`;
DROP TABLE IF EXISTS `roast_profiles`;
DROP TABLE IF EXISTS `warehouse_lots`;
DROP TABLE IF EXISTS `processed_green_bean_lots`;
DROP TABLE IF EXISTS `processing_batches`;
DROP TABLE IF EXISTS `farmer_harvest_lots`;
DROP TABLE IF EXISTS `coffee_farms`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. USERS & STAKEHOLDER ACCOUNTS
-- -----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('petani', 'pengolah', 'gudang', 'roaster', 'cafe', 'verifikator') NOT NULL,
  `verifier_domain` VARCHAR(50) DEFAULT NULL,
  `organization` VARCHAR(200) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `avatar` TEXT DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `balance` DECIMAL(15,2) DEFAULT 0.00,
  `bio` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. COFFEE FARMS (Kebun & Geolocation Petani)
-- -----------------------------------------------------------------------------
CREATE TABLE `coffee_farms` (
  `id` VARCHAR(64) NOT NULL,
  `farmer_id` VARCHAR(64) NOT NULL,
  `farmer_name` VARCHAR(150) NOT NULL,
  `farm_name` VARCHAR(200) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `province` VARCHAR(100) DEFAULT 'Jawa Barat',
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(11, 8) DEFAULT NULL,
  `altitude_meters` INT DEFAULT 1400,
  `altitude_display` VARCHAR(100) DEFAULT NULL,
  `land_area_hectares` DECIMAL(8, 2) DEFAULT 1.00,
  `total_trees_count` INT DEFAULT 1000,
  `primary_varieties` JSON DEFAULT NULL,
  `soil_type` VARCHAR(100) DEFAULT 'Andosol Vulkanik',
  `shade_trees` JSON DEFAULT NULL,
  `organic_status` VARCHAR(100) DEFAULT 'Transisi Menuju Organik',
  `eudr_compliant` TINYINT(1) DEFAULT 1,
  `weather_data` JSON DEFAULT NULL,
  `plot_boundary` JSON DEFAULT NULL,
  `patok_list` JSON DEFAULT NULL,
  `photo_url` TEXT DEFAULT NULL,
  `established_year` INT DEFAULT 2015,
  `notes` TEXT DEFAULT NULL,
  `verification_status` ENUM('unverified', 'pending', 'verified', 'rejected') DEFAULT 'verified',
  `verification_stamp` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_farms_farmer_id` (`farmer_id`),
  CONSTRAINT `fk_farms_farmer` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. FARMER HARVEST LOTS (Lot Panen Ceri Merah Petani)
-- -----------------------------------------------------------------------------
CREATE TABLE `farmer_harvest_lots` (
  `id` VARCHAR(64) NOT NULL,
  `farmer_id` VARCHAR(64) NOT NULL,
  `farmer_name` VARCHAR(150) NOT NULL,
  `farm_id` VARCHAR(64) DEFAULT NULL,
  `farm_name` VARCHAR(200) DEFAULT NULL,
  `farm_location` VARCHAR(255) NOT NULL,
  `altitude` VARCHAR(100) NOT NULL,
  `variety` VARCHAR(150) NOT NULL,
  `harvest_date` DATE NOT NULL,
  `picking_method` VARCHAR(100) NOT NULL,
  `brix` DECIMAL(4, 1) DEFAULT 20.0,
  `total_weight_kg` DECIMAL(10, 2) NOT NULL,
  `available_weight_kg` DECIMAL(10, 2) NOT NULL,
  `price_per_kg` DECIMAL(12, 2) NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `status` ENUM('available', 'sold', 'partial') DEFAULT 'available',
  `photo_url` TEXT DEFAULT NULL,
  `weather_snapshot` JSON DEFAULT NULL,
  `soil_type` VARCHAR(100) DEFAULT NULL,
  `shade_trees` JSON DEFAULT NULL,
  `verification_status` ENUM('unverified', 'pending', 'verified', 'rejected') DEFAULT 'verified',
  `verification_stamp` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_harvest_farmer_id` (`farmer_id`),
  KEY `idx_harvest_farm_id` (`farm_id`),
  KEY `idx_harvest_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. PROCESSING BATCHES (Proses Pascapanen & Fermentasi)
-- -----------------------------------------------------------------------------
CREATE TABLE `processing_batches` (
  `id` VARCHAR(64) NOT NULL,
  `processor_id` VARCHAR(64) NOT NULL,
  `processor_name` VARCHAR(150) NOT NULL,
  `batch_code` VARCHAR(100) NOT NULL,
  `source_cherry_lots` JSON DEFAULT NULL,
  `process_method` VARCHAR(100) NOT NULL,
  `current_stage` VARCHAR(50) DEFAULT 'intake_sorting',
  `intake_log` JSON DEFAULT NULL,
  `fermentation_log` JSON DEFAULT NULL,
  `drying_log` JSON DEFAULT NULL,
  `conditioning_log` JSON DEFAULT NULL,
  `milling_log` JSON DEFAULT NULL,
  `grading_qc_log` JSON DEFAULT NULL,
  `closure_log` JSON DEFAULT NULL,
  `total_cherry_input_kg` DECIMAL(10, 2) NOT NULL,
  `estimated_green_bean_yield_kg` DECIMAL(10, 2) DEFAULT 0.00,
  `actual_green_bean_yield_kg` DECIMAL(10, 2) DEFAULT NULL,
  `yield_percentage` DECIMAL(5, 2) DEFAULT NULL,
  `waste_management` JSON DEFAULT NULL,
  `status` ENUM('in_progress', 'completed', 'canceled') DEFAULT 'in_progress',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_batches_processor_id` (`processor_id`),
  KEY `idx_batches_batch_code` (`batch_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. PROCESSED GREEN BEAN LOTS (Green Bean Hasil Olahan Mill)
-- -----------------------------------------------------------------------------
CREATE TABLE `processed_green_bean_lots` (
  `id` VARCHAR(64) NOT NULL,
  `processor_id` VARCHAR(64) NOT NULL,
  `processor_name` VARCHAR(150) NOT NULL,
  `source_farmer_lot_id` VARCHAR(64) NOT NULL,
  `source_farmer_name` VARCHAR(150) NOT NULL,
  `source_origin` VARCHAR(255) NOT NULL,
  `variety` VARCHAR(150) NOT NULL,
  `altitude` VARCHAR(100) NOT NULL,
  `process_method` VARCHAR(100) NOT NULL,
  `fermentation_time_hours` INT DEFAULT 36,
  `drying_method` VARCHAR(100) NOT NULL,
  `moisture_content_percent` DECIMAL(4, 1) DEFAULT 11.5,
  `water_activity_aw` DECIMAL(3, 2) DEFAULT 0.58,
  `grade` VARCHAR(50) DEFAULT 'Specialty Grade 1',
  `defect_count` INT DEFAULT 2,
  `screen_size` VARCHAR(100) DEFAULT 'Size 16-18',
  `green_bean_weight_kg` DECIMAL(10, 2) NOT NULL,
  `available_weight_kg` DECIMAL(10, 2) NOT NULL,
  `price_per_kg` DECIMAL(12, 2) NOT NULL,
  `cupping_notes` JSON DEFAULT NULL,
  `processed_date` DATE NOT NULL,
  `status` ENUM('available', 'sold', 'in_warehouse') DEFAULT 'available',
  `photo_url` TEXT DEFAULT NULL,
  `waste_management` JSON DEFAULT NULL,
  `verification_status` ENUM('unverified', 'pending', 'verified', 'rejected') DEFAULT 'verified',
  `verification_stamp` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_processed_processor_id` (`processor_id`),
  KEY `idx_processed_source_farmer_lot` (`source_farmer_lot_id`),
  KEY `idx_processed_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. WAREHOUSE LOTS (Lot Penyimpanan & QA Gudang / Eksportir)
-- -----------------------------------------------------------------------------
CREATE TABLE `warehouse_lots` (
  `id` VARCHAR(64) NOT NULL,
  `warehouse_id` VARCHAR(64) NOT NULL,
  `warehouse_name` VARCHAR(150) NOT NULL,
  `source_green_bean_id` VARCHAR(64) NOT NULL,
  `source_processor_name` VARCHAR(150) NOT NULL,
  `source_farmer_name` VARCHAR(150) NOT NULL,
  `origin` VARCHAR(255) NOT NULL,
  `variety` VARCHAR(150) NOT NULL,
  `altitude` VARCHAR(100) NOT NULL,
  `process_method` VARCHAR(100) NOT NULL,
  `storage_location` VARCHAR(150) NOT NULL,
  `temperature_celsius` DECIMAL(4, 1) DEFAULT 20.0,
  `humidity_percent` DECIMAL(4, 1) DEFAULT 55.0,
  `packaging_type` VARCHAR(100) NOT NULL,
  `verified_sca_score` DECIMAL(4, 2) DEFAULT 85.00,
  `weight_kg` DECIMAL(10, 2) NOT NULL,
  `available_weight_kg` DECIMAL(10, 2) NOT NULL,
  `purchase_price_per_kg` DECIMAL(12, 2) NOT NULL,
  `price_per_kg` DECIMAL(12, 2) NOT NULL,
  `stored_date` DATE NOT NULL,
  `grade_tier` VARCHAR(100) NOT NULL,
  `defect_count` INT DEFAULT 2,
  `screen_size` VARCHAR(100) NOT NULL,
  `moisture_content_percent` DECIMAL(4, 1) DEFAULT 11.0,
  `water_activity_aw` DECIMAL(3, 2) DEFAULT 0.56,
  `target_market` VARCHAR(150) DEFAULT NULL,
  `has_health_certificate` TINYINT(1) DEFAULT 0,
  `health_certificate_number` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('available', 'sold', 'partial') DEFAULT 'available',
  `qc_status` ENUM('pending_qc', 'passed', 'rejected') DEFAULT 'passed',
  `notes` TEXT DEFAULT NULL,
  `verification_status` ENUM('unverified', 'pending', 'verified', 'rejected') DEFAULT 'verified',
  `verification_stamp` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_warehouse_id` (`warehouse_id`),
  KEY `idx_warehouse_source_green_bean` (`source_green_bean_id`),
  KEY `idx_warehouse_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. ROAST PROFILES (Master Profil Sangrai)
-- -----------------------------------------------------------------------------
CREATE TABLE `roast_profiles` (
  `id` VARCHAR(64) NOT NULL,
  `roaster_id` VARCHAR(64) NOT NULL,
  `profile_name` VARCHAR(150) NOT NULL,
  `roast_level` VARCHAR(50) NOT NULL,
  `charge_temp` INT NOT NULL,
  `turning_point_temp` INT NOT NULL,
  `first_crack_time` VARCHAR(20) NOT NULL,
  `first_crack_temp` INT NOT NULL,
  `drop_time` VARCHAR(20) NOT NULL,
  `drop_temp` INT NOT NULL,
  `development_time_ratio` DECIMAL(4, 1) NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_profiles_roaster_id` (`roaster_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. ROASTED BEAN LOTS (Biji Sangrai Siap Seduh)
-- -----------------------------------------------------------------------------
CREATE TABLE `roasted_bean_lots` (
  `id` VARCHAR(64) NOT NULL,
  `roaster_id` VARCHAR(64) NOT NULL,
  `roaster_name` VARCHAR(150) NOT NULL,
  `source_warehouse_lot_id` VARCHAR(64) NOT NULL,
  `origin` VARCHAR(255) NOT NULL,
  `variety` VARCHAR(150) NOT NULL,
  `altitude` VARCHAR(100) NOT NULL,
  `process_method` VARCHAR(100) NOT NULL,
  `farmer_name` VARCHAR(150) NOT NULL,
  `roaster_machine` VARCHAR(100) NOT NULL,
  `roast_level` VARCHAR(50) NOT NULL,
  `agtron_number` INT DEFAULT 65,
  `roast_date` DATE NOT NULL,
  `development_time_ratio` DECIMAL(4, 1) DEFAULT 14.5,
  `tasting_notes` JSON DEFAULT NULL,
  `sca_cupping_score` DECIMAL(4, 2) DEFAULT 87.00,
  `package_weight_grams` INT DEFAULT 250,
  `total_packs` INT NOT NULL,
  `available_packs` INT NOT NULL,
  `price_per_pack` DECIMAL(12, 2) NOT NULL,
  `resting_recommendation_days` INT DEFAULT 7,
  `recommended_brew` JSON DEFAULT NULL,
  `status` ENUM('available', 'sold', 'partial') DEFAULT 'available',
  `photo_url` TEXT DEFAULT NULL,
  `source_work_order_id` VARCHAR(64) DEFAULT NULL,
  `verification_status` ENUM('unverified', 'pending', 'verified', 'rejected') DEFAULT 'verified',
  `verification_stamp` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_roasted_roaster_id` (`roaster_id`),
  KEY `idx_roasted_source_wh_lot` (`source_warehouse_lot_id`),
  KEY `idx_roasted_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. QC CUPPING SESSIONS (Evaluasi Sensori 10 Atribut SCA)
-- -----------------------------------------------------------------------------
CREATE TABLE `qc_cupping_sessions` (
  `id` VARCHAR(64) NOT NULL,
  `sample_id` VARCHAR(64) DEFAULT NULL,
  `session_date` DATE NOT NULL,
  `evaluator_name` VARCHAR(150) NOT NULL,
  `fragrance_aroma` DECIMAL(4, 2) NOT NULL,
  `flavor` DECIMAL(4, 2) NOT NULL,
  `aftertaste` DECIMAL(4, 2) NOT NULL,
  `acidity` DECIMAL(4, 2) NOT NULL,
  `body` DECIMAL(4, 2) NOT NULL,
  `balance` DECIMAL(4, 2) NOT NULL,
  `uniformity` DECIMAL(4, 2) NOT NULL,
  `clean_cup` DECIMAL(4, 2) NOT NULL,
  `sweetness` DECIMAL(4, 2) NOT NULL,
  `overall` DECIMAL(4, 2) NOT NULL,
  `total_score` DECIMAL(5, 2) NOT NULL,
  `tasting_notes` JSON DEFAULT NULL,
  `defect_deduction` DECIMAL(4, 2) DEFAULT 0.00,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cupping_sample_id` (`sample_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. CAFE INVENTORY & RETAIL PRODUCTS
-- -----------------------------------------------------------------------------
CREATE TABLE `cafe_inventory` (
  `id` VARCHAR(64) NOT NULL,
  `cafe_id` VARCHAR(64) NOT NULL,
  `cafe_name` VARCHAR(150) NOT NULL,
  `source_roasted_bean_id` VARCHAR(64) NOT NULL,
  `bean_name` VARCHAR(150) NOT NULL,
  `roaster_name` VARCHAR(150) NOT NULL,
  `origin` VARCHAR(255) NOT NULL,
  `variety` VARCHAR(150) NOT NULL,
  `process_method` VARCHAR(100) NOT NULL,
  `roast_level` VARCHAR(50) NOT NULL,
  `tasting_notes` JSON DEFAULT NULL,
  `sca_score` DECIMAL(4, 2) DEFAULT 85.00,
  `pack_weight_grams` INT DEFAULT 1000,
  `packs_in_stock` INT NOT NULL,
  `purchase_date` DATE NOT NULL,
  `cost_per_pack` DECIMAL(12, 2) NOT NULL,
  `lineage` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cafe_inv_cafe_id` (`cafe_id`),
  KEY `idx_cafe_inv_roasted_id` (`source_roasted_bean_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cafe_products` (
  `id` VARCHAR(64) NOT NULL,
  `cafe_id` VARCHAR(64) NOT NULL,
  `cafe_name` VARCHAR(150) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `origin` VARCHAR(255) NOT NULL,
  `variety` VARCHAR(150) NOT NULL,
  `roast_level` VARCHAR(50) NOT NULL,
  `tasting_notes` JSON DEFAULT NULL,
  `price` DECIMAL(12, 2) NOT NULL,
  `package_unit` VARCHAR(100) NOT NULL,
  `total_stock` INT NOT NULL,
  `available_stock` INT NOT NULL,
  `description` TEXT DEFAULT NULL,
  `photo_url` TEXT DEFAULT NULL,
  `verification_status` ENUM('unverified', 'pending', 'verified', 'rejected') DEFAULT 'verified',
  `verification_stamp` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cafe_prod_cafe_id` (`cafe_id`),
  KEY `idx_cafe_prod_available` (`available_stock`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. SUPPLY CHAIN TRANSACTIONS (Buku Besar Transaksi Rantai Pasok)
-- -----------------------------------------------------------------------------
CREATE TABLE `supply_chain_transactions` (
  `id` VARCHAR(64) NOT NULL,
  `tx_date` DATE NOT NULL,
  `from_role` ENUM('petani', 'pengolah', 'gudang', 'roaster', 'cafe', 'verifikator') NOT NULL,
  `from_name` VARCHAR(150) NOT NULL,
  `to_role` ENUM('petani', 'pengolah', 'gudang', 'roaster', 'cafe', 'verifikator') NOT NULL,
  `to_name` VARCHAR(150) NOT NULL,
  `item_name` VARCHAR(255) NOT NULL,
  `quantity` VARCHAR(100) NOT NULL,
  `total_amount` DECIMAL(15, 2) NOT NULL,
  `status` ENUM('Selesai', 'Diproses', 'Terkirim') DEFAULT 'Selesai',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tx_date` (`tx_date`),
  KEY `idx_tx_from_role` (`from_role`),
  KEY `idx_tx_to_role` (`to_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 12. VERIFICATION STAMPS (Stempel & Log Audit Verifikator)
-- -----------------------------------------------------------------------------
CREATE TABLE `verification_stamps` (
  `id` VARCHAR(64) NOT NULL,
  `stamp_type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `certificate_number` VARCHAR(100) NOT NULL,
  `verifier_id` VARCHAR(64) NOT NULL,
  `verifier_name` VARCHAR(150) NOT NULL,
  `verifier_title` VARCHAR(150) NOT NULL,
  `verifier_org` VARCHAR(200) NOT NULL,
  `verified_at` DATETIME NOT NULL,
  `status` ENUM('verified', 'rejected') DEFAULT 'verified',
  `score_display` VARCHAR(50) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `digital_signature_hash` VARCHAR(255) NOT NULL,
  `cupping_evaluation` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_stamps_verifier_id` (`verifier_id`),
  KEY `idx_stamps_cert_num` (`certificate_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

