import fs from 'fs';
import path from 'path';
import {
  MOCK_USERS,
  INITIAL_COFFEE_FARMS,
  INITIAL_FARMER_LOTS,
  INITIAL_PROCESSED_LOTS,
  INITIAL_WAREHOUSE_LOTS,
  INITIAL_ROASTED_LOTS,
  INITIAL_CAFE_ITEMS,
  INITIAL_CAFE_PRODUCTS,
  INITIAL_TRANSACTIONS,
} from '../src/data/mockData.ts';
import {
  INITIAL_PROCESSING_BATCHES,
} from '../src/data/mockProcessorErpData.ts';
import {
  INITIAL_MASTER_PROFILES,
  INITIAL_QC_SESSIONS,
} from '../src/data/mockRoasterErpData.ts';

function esc(val: any): string {
  if (val === undefined || val === null) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (typeof val === 'object') {
    return "'" + JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  }
  return "'" + String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

const lines: string[] = [
  '-- ==============================================================================',
  '-- Circular Coffee Trace (sangrAI) - Initial Seed Data',
  '-- Populates relational tables with realistic specialty coffee supply chain data',
  '-- ==============================================================================',
  '',
  'SET FOREIGN_KEY_CHECKS = 0;',
  '',
];

// 1. Users
lines.push('-- 1. USERS');
for (const u of MOCK_USERS) {
  lines.push(`INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password\`, \`role\`, \`verifier_domain\`, \`organization\`, \`location\`, \`avatar\`, \`phone\`, \`balance\`, \`bio\`) VALUES (` +
    [esc(u.id), esc(u.name), esc(u.email || (u.id + '@cct.id')), esc(u.password || 'password123'), esc(u.role), esc(u.verifierDomain || null), esc(u.organization), esc(u.location), esc(u.avatar), esc(u.phone), esc(u.balance || 0), esc(u.bio || '')].join(', ') +
    `);`
  );
}
lines.push('');

// 2. Coffee Farms
lines.push('-- 2. COFFEE FARMS');
for (const f of INITIAL_COFFEE_FARMS) {
  lines.push(`INSERT INTO \`coffee_farms\` (\`id\`, \`farmer_id\`, \`farmer_name\`, \`farm_name\`, \`location\`, \`province\`, \`latitude\`, \`longitude\`, \`altitude_meters\`, \`altitude_display\`, \`land_area_hectares\`, \`total_trees_count\`, \`primary_varieties\`, \`soil_type\`, \`shade_trees\`, \`organic_status\`, \`eudr_compliant\`, \`weather_data\`, \`plot_boundary\`, \`patok_list\`, \`photo_url\`, \`established_year\`, \`notes\`, \`verification_status\`, \`verification_stamp\`) VALUES (` +
    [
      esc(f.id), esc(f.farmerId), esc(f.farmerName), esc(f.farmName), esc(f.location), esc(f.province || 'Jawa Barat'),
      esc(f.coordinates?.latitude || null), esc(f.coordinates?.longitude || null),
      esc(f.altitudeMeters || 1500), esc(f.altitudeDisplay), esc(f.landAreaHectares || 1.0),
      esc(f.totalTreesCount || 1000), esc(f.primaryVarieties), esc(f.soilType), esc(f.shadeTrees),
      esc(f.organicStatus), esc(f.eudrCompliant ? 1 : 0), esc(f.weatherData), esc(f.plotBoundary),
      esc(f.patokList), esc(f.photoUrl), esc(f.establishedYear), esc(f.notes || ''),
      esc(f.verificationStatus || 'verified'), esc(f.verificationStamp || null)
    ].join(', ') +
    `);`
  );
}
lines.push('');

// 3. Harvest Lots
lines.push('-- 3. FARMER HARVEST LOTS');
for (const h of INITIAL_FARMER_LOTS) {
  lines.push(`INSERT INTO \`farmer_harvest_lots\` (\`id\`, \`farmer_id\`, \`farmer_name\`, \`farm_id\`, \`farm_name\`, \`farm_location\`, \`altitude\`, \`variety\`, \`harvest_date\`, \`picking_method\`, \`brix\`, \`total_weight_kg\`, \`available_weight_kg\`, \`price_per_kg\`, \`notes\`, \`status\`, \`photo_url\`, \`weather_snapshot\`, \`soil_type\`, \`shade_trees\`, \`verification_status\`, \`verification_stamp\`) VALUES (` +
    [
      esc(h.id), esc(h.farmerId), esc(h.farmerName), esc(h.farmId || null), esc(h.farmName || ''),
      esc(h.farmLocation), esc(h.altitude), esc(h.variety), esc(h.harvestDate), esc(h.pickingMethod),
      esc(h.brix), esc(h.totalWeightKg), esc(h.availableWeightKg), esc(h.pricePerKg), esc(h.notes),
      esc(h.status), esc(h.photoUrl || null), esc(h.weatherSnapshot || null), esc(h.soilType || null),
      esc(h.shadeTrees || null), esc(h.verificationStatus || 'verified'), esc(h.verificationStamp || null)
    ].join(', ') +
    `);`
  );
}
lines.push('');

// 4. Processing Batches
lines.push('-- 4. PROCESSING BATCHES');
for (const b of INITIAL_PROCESSING_BATCHES) {
  lines.push(`INSERT INTO \`processing_batches\` (\`id\`, \`processor_id\`, \`processor_name\`, \`batch_code\`, \`source_cherry_lots\`, \`process_method\`, \`current_stage\`, \`intake_log\`, \`fermentation_log\`, \`drying_log\`, \`conditioning_log\`, \`milling_log\`, \`grading_qc_log\`, \`closure_log\`, \`total_cherry_input_kg\`, \`estimated_green_bean_yield_kg\`, \`actual_green_bean_yield_kg\`, \`yield_percentage\`, \`waste_management\`, \`status\`) VALUES (` +
    [
      esc(b.id), esc(b.processorId), esc(b.processorName), esc(b.batchCode), esc(b.sourceCherryLots),
      esc(b.processMethod), esc(b.currentStage), esc(b.intakeLog), esc(b.fermentationLog),
      esc(b.dryingLog), esc(b.conditioningLog), esc(b.millingLog), esc(b.gradingQcLog), esc(b.closureLog),
      esc(b.totalCherryInputKg), esc(b.estimatedGreenBeanYieldKg), esc(b.actualGreenBeanYieldKg),
      esc(b.yieldPercentage), esc(b.wasteManagement), esc(b.status)
    ].join(', ') +
    `);`
  );
}
lines.push('');

// 5. Processed Green Bean Lots
lines.push('-- 5. PROCESSED GREEN BEAN LOTS');
for (const p of INITIAL_PROCESSED_LOTS) {
  lines.push(`INSERT INTO \`processed_green_bean_lots\` (\`id\`, \`processor_id\`, \`processor_name\`, \`source_farmer_lot_id\`, \`source_farmer_name\`, \`source_origin\`, \`variety\`, \`altitude\`, \`process_method\`, \`fermentation_time_hours\`, \`drying_method\`, \`moisture_content_percent\`, \`water_activity_aw\`, \`grade\`, \`defect_count\`, \`screen_size\`, \`green_bean_weight_kg\`, \`available_weight_kg\`, \`price_per_kg\`, \`cupping_notes\`, \`processed_date\`, \`status\`, \`photo_url\`, \`waste_management\`, \`verification_status\`, \`verification_stamp\`) VALUES (` +
    [
      esc(p.id), esc(p.processorId), esc(p.processorName), esc(p.sourceFarmerLotId), esc(p.sourceFarmerName),
      esc(p.sourceOrigin), esc(p.variety), esc(p.altitude), esc(p.processMethod), esc(p.fermentationTimeHours),
      esc(p.dryingMethod), esc(p.moistureContentPercent), esc(p.waterActivityAw), esc(p.grade),
      esc(p.defectCount), esc(p.screenSize), esc(p.greenBeanWeightKg), esc(p.availableWeightKg),
      esc(p.pricePerKg), esc(p.cuppingNotes), esc(p.processedDate), esc(p.status), esc(p.photoUrl || null),
      esc(p.wasteManagement || null), esc(p.verificationStatus || 'verified'), esc(p.verificationStamp || null)
    ].join(', ') +
    `);`
  );
}
lines.push('');

// 6. Warehouse Lots
lines.push('-- 6. WAREHOUSE LOTS');
for (const w of INITIAL_WAREHOUSE_LOTS) {
  lines.push(`INSERT INTO \`warehouse_lots\` (\`id\`, \`warehouse_id\`, \`warehouse_name\`, \`source_green_bean_id\`, \`source_processor_name\`, \`source_farmer_name\`, \`origin\`, \`variety\`, \`altitude\`, \`process_method\`, \`storage_location\`, \`temperature_celsius\`, \`humidity_percent\`, \`packaging_type\`, \`verified_sca_score\`, \`weight_kg\`, \`available_weight_kg\`, \`purchase_price_per_kg\`, \`price_per_kg\`, \`stored_date\`, \`grade_tier\`, \`defect_count\`, \`screen_size\`, \`moisture_content_percent\`, \`water_activity_aw\`, \`target_market\`, \`has_health_certificate\`, \`health_certificate_number\`, \`status\`, \`qc_status\`, \`notes\`, \`verification_status\`, \`verification_stamp\`) VALUES (` +
    [
      esc(w.id), esc(w.warehouseId), esc(w.warehouseName), esc(w.sourceGreenBeanId), esc(w.sourceProcessorName),
      esc(w.sourceFarmerName), esc(w.origin), esc(w.variety), esc(w.altitude), esc(w.processMethod),
      esc(w.storageLocation), esc(w.temperatureCelsius), esc(w.humidityPercent), esc(w.packagingType),
      esc(w.verifiedScaScore), esc(w.weightKg), esc(w.availableWeightKg), esc(w.purchasePricePerKg),
      esc(w.pricePerKg), esc(w.storedDate), esc(w.gradeTier), esc(w.defectCount), esc(w.screenSize),
      esc(w.moistureContentPercent), esc(w.waterActivityAw), esc(w.targetMarket || null),
      esc(w.hasHealthCertificate ? 1 : 0), esc(w.healthCertificateNumber || null), esc(w.status),
      esc(w.qcStatus || 'passed'), esc(w.notes || ''), esc(w.verificationStatus || 'verified'),
      esc(w.verificationStamp || null)
    ].join(', ') +
    `);`
  );
}
lines.push('');

// 7. Roast Profiles
lines.push('-- 7. ROAST PROFILES');
for (const rp of INITIAL_MASTER_PROFILES) {
  lines.push(`INSERT INTO \`roast_profiles\` (\`id\`, \`roaster_id\`, \`profile_name\`, \`roast_level\`, \`charge_temp\`, \`turning_point_temp\`, \`first_crack_time\`, \`first_crack_temp\`, \`drop_time\`, \`drop_temp\`, \`development_time_ratio\`, \`notes\`) VALUES (` +
    [
      esc(rp.id), esc(rp.roasterId), esc(rp.profileName), esc(rp.roastLevel), esc(rp.chargeTemp),
      esc(rp.turningPointTemp), esc(rp.firstCrackTime), esc(rp.firstCrackTemp), esc(rp.dropTime),
      esc(rp.dropTemp), esc(rp.developmentTimeRatio), esc(rp.notes || '')
    ].join(', ') +
    `);`
  );
}
lines.push('');

// 8. Roasted Lots
lines.push('-- 8. ROASTED BEAN LOTS');
for (const r of INITIAL_ROASTED_LOTS) {
  lines.push(`INSERT INTO \`roasted_bean_lots\` (\`id\`, \`roaster_id\`, \`roaster_name\`, \`source_warehouse_lot_id\`, \`origin\`, \`variety\`, \`altitude\`, \`process_method\`, \`farmer_name\`, \`roaster_machine\`, \`roast_level\`, \`agtron_number\`, \`roast_date\`, \`development_time_ratio\`, \`tasting_notes\`, \`sca_cupping_score\`, \`package_weight_grams\`, \`total_packs\`, \`available_packs\`, \`price_per_pack\`, \`resting_recommendation_days\`, \`recommended_brew\`, \`status\`, \`photo_url\`, \`source_work_order_id\`, \`verification_status\`, \`verification_stamp\`) VALUES (` +
    [
      esc(r.id), esc(r.roasterId), esc(r.roasterName), esc(r.sourceWarehouseLotId), esc(r.origin),
      esc(r.variety), esc(r.altitude), esc(r.processMethod), esc(r.farmerName), esc(r.roasterMachine),
      esc(r.roastLevel), esc(r.agtronNumber), esc(r.roastDate), esc(r.developmentTimeRatio),
      esc(r.tastingNotes), esc(r.scaCuppingScore), esc(r.packageWeightGrams), esc(r.totalPacks),
      esc(r.availablePacks), esc(r.pricePerPack), esc(r.restingRecommendationDays), esc(r.recommendedBrew),
      esc(r.status), esc(r.photoUrl || null), esc(r.sourceWorkOrderId || null),
      esc(r.verificationStatus || 'verified'), esc(r.verificationStamp || null)
    ].join(', ') +
    `);`
  );
}
lines.push('');

// 9. QC Cupping Sessions
lines.push('-- 9. QC CUPPING SESSIONS');
for (const q of INITIAL_QC_SESSIONS) {
  lines.push(`INSERT INTO \`qc_cupping_sessions\` (\`id\`, \`sample_id\`, \`session_date\`, \`evaluator_name\`, \`fragrance_aroma\`, \`flavor\`, \`aftertaste\`, \`acidity\`, \`body\`, \`balance\`, \`uniformity\`, \`clean_cup\`, \`sweetness\`, \`overall\`, \`total_score\`, \`tasting_notes\`, \`defect_deduction\`, \`notes\`) VALUES (` +
    [
      esc(q.id), esc(q.sampleId || null), esc(q.sessionDate), esc(q.evaluatorName), esc(q.fragranceAroma),
      esc(q.flavor), esc(q.aftertaste), esc(q.acidity), esc(q.body), esc(q.balance), esc(q.uniformity),
      esc(q.cleanCup), esc(q.sweetness), esc(q.overall), esc(q.totalScore), esc(q.tastingNotes),
      esc(q.defectDeduction || 0), esc(q.notes || '')
    ].join(', ') +
    `);`
  );
}
lines.push('');

// 10. Cafe Inventory & Products
lines.push('-- 10. CAFE INVENTORY');
for (const ci of INITIAL_CAFE_ITEMS) {
  lines.push(`INSERT INTO \`cafe_inventory\` (\`id\`, \`cafe_id\`, \`cafe_name\`, \`source_roasted_bean_id\`, \`bean_name\`, \`roaster_name\`, \`origin\`, \`variety\`, \`process_method\`, \`roast_level\`, \`tasting_notes\`, \`sca_score\`, \`pack_weight_grams\`, \`packs_in_stock\`, \`purchase_date\`, \`cost_per_pack\`, \`lineage\`) VALUES (` +
    [
      esc(ci.id), esc(ci.cafeId), esc(ci.cafeName), esc(ci.sourceRoastedBeanId), esc(ci.beanName),
      esc(ci.roasterName), esc(ci.origin), esc(ci.variety), esc(ci.processMethod), esc(ci.roastLevel),
      esc(ci.tastingNotes), esc(ci.scaScore), esc(ci.packWeightGrams), esc(ci.packsInStock),
      esc(ci.purchaseDate), esc(ci.costPerPack), esc(ci.lineage)
    ].join(', ') +
    `);`
  );
}
lines.push('');

lines.push('-- 11. CAFE PRODUCTS');
for (const cp of INITIAL_CAFE_PRODUCTS) {
  lines.push(`INSERT INTO \`cafe_products\` (\`id\`, \`cafe_id\`, \`cafe_name\`, \`name\`, \`origin\`, \`variety\`, \`roast_level\`, \`tasting_notes\`, \`price\`, \`package_unit\`, \`total_stock\`, \`available_stock\`, \`description\`, \`photo_url\`, \`verification_status\`, \`verification_stamp\`) VALUES (` +
    [
      esc(cp.id), esc(cp.cafeId), esc(cp.cafeName), esc(cp.name), esc(cp.origin), esc(cp.variety),
      esc(cp.roastLevel), esc(cp.tastingNotes), esc(cp.price), esc(cp.packageUnit), esc(cp.totalStock),
      esc(cp.availableStock), esc(cp.description), esc(cp.photoUrl || null),
      esc(cp.verificationStatus || 'verified'), esc(cp.verificationStamp || null)
    ].join(', ') +
    `);`
  );
}
lines.push('');

// 12. Supply Chain Transactions
lines.push('-- 12. SUPPLY CHAIN TRANSACTIONS');
for (const tx of INITIAL_TRANSACTIONS) {
  lines.push(`INSERT INTO \`supply_chain_transactions\` (\`id\`, \`tx_date\`, \`from_role\`, \`from_name\`, \`to_role\`, \`to_name\`, \`item_name\`, \`quantity\`, \`total_amount\`, \`status\`) VALUES (` +
    [
      esc(tx.id), esc(tx.date), esc(tx.fromRole), esc(tx.fromName), esc(tx.toRole), esc(tx.toName),
      esc(tx.itemName), esc(tx.quantity), esc(tx.totalAmount), esc(tx.status)
    ].join(', ') +
    `);`
  );
}
lines.push('');

lines.push('SET FOREIGN_KEY_CHECKS = 1;');
lines.push('-- End of Seed Data');

fs.writeFileSync(path.join(process.cwd(), 'database/seed.sql'), lines.join('\n'), 'utf8');
console.log('Successfully wrote database/seed.sql! Lines:', lines.length);
