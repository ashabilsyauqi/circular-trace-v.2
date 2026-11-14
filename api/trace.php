<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();

$code = $_GET['code'] ?? $_GET['lotId'] ?? $_GET['cupId'] ?? $_GET['scan'] ?? '';
$code = trim($code);

if (!$code) {
    sendError('Parameter code / lotId / cupId wajib disertakan.', 400);
}

// 1. Try finding in cafe_products
$stmt = $pdo->prepare("SELECT * FROM `cafe_products` WHERE `id` = :id LIMIT 1");
$stmt->execute(['id' => $code]);
$cafeProduct = $stmt->fetch();

// 2. Try finding in roasted_bean_lots
$stmt = $pdo->prepare("SELECT * FROM `roasted_bean_lots` WHERE `id` = :id LIMIT 1");
$stmt->execute(['id' => $code]);
$roastedLot = $stmt->fetch();

// 3. Try finding in warehouse_lots
$stmt = $pdo->prepare("SELECT * FROM `warehouse_lots` WHERE `id` = :id LIMIT 1");
$stmt->execute(['id' => $code]);
$warehouseLot = $stmt->fetch();

// 4. Try finding in processed_green_bean_lots
$stmt = $pdo->prepare("SELECT * FROM `processed_green_bean_lots` WHERE `id` = :id LIMIT 1");
$stmt->execute(['id' => $code]);
$processedLot = $stmt->fetch();

// 5. Try finding in farmer_harvest_lots
$stmt = $pdo->prepare("SELECT * FROM `farmer_harvest_lots` WHERE `id` = :id LIMIT 1");
$stmt->execute(['id' => $code]);
$harvestLot = $stmt->fetch();

// Trace Lineage backward
if ($cafeProduct && !$roastedLot) {
    // If cafe product has a source roasted bean lot (search first available roasted lot with same origin)
    $stmt = $pdo->prepare("SELECT * FROM `roasted_bean_lots` WHERE `origin` LIKE :origin LIMIT 1");
    $stmt->execute(['origin' => '%' . explode(',', $cafeProduct['origin'])[0] . '%']);
    $roastedLot = $stmt->fetch();
}

if ($roastedLot && !$warehouseLot) {
    $stmt = $pdo->prepare("SELECT * FROM `warehouse_lots` WHERE `id` = :id LIMIT 1");
    $stmt->execute(['id' => $roastedLot['source_warehouse_lot_id']]);
    $warehouseLot = $stmt->fetch();
}

if ($warehouseLot && !$processedLot) {
    $stmt = $pdo->prepare("SELECT * FROM `processed_green_bean_lots` WHERE `id` = :id LIMIT 1");
    $stmt->execute(['id' => $warehouseLot['source_green_bean_id']]);
    $processedLot = $stmt->fetch();
}

if ($processedLot && !$harvestLot) {
    $stmt = $pdo->prepare("SELECT * FROM `farmer_harvest_lots` WHERE `id` = :id LIMIT 1");
    $stmt->execute(['id' => $processedLot['source_farmer_lot_id']]);
    $harvestLot = $stmt->fetch();
}

// Get Farm details
$farm = null;
if ($harvestLot && !empty($harvestLot['farm_id'])) {
    $stmt = $pdo->prepare("SELECT * FROM `coffee_farms` WHERE `id` = :id LIMIT 1");
    $stmt->execute(['id' => $harvestLot['farm_id']]);
    $farm = $stmt->fetch();
} elseif ($harvestLot && !empty($harvestLot['farmer_id'])) {
    $stmt = $pdo->prepare("SELECT * FROM `coffee_farms` WHERE `farmer_id` = :fid LIMIT 1");
    $stmt->execute(['fid' => $harvestLot['farmer_id']]);
    $farm = $stmt->fetch();
}

if (!$harvestLot && !$processedLot && !$warehouseLot && !$roastedLot && !$cafeProduct) {
    sendError("Lot / Cup dengan kode '{$code}' tidak ditemukan di sistem.", 404);
}

// Decode JSON fields helper
function decodeJsonFields(&$row, $fields) {
    if (!$row) return;
    foreach ($fields as $f) {
        if (isset($row[$f]) && is_string($row[$f])) {
            $row[$f] = json_decode($row[$f], true);
        }
    }
}

decodeJsonFields($farm, ['primary_varieties', 'shade_trees', 'weather_data', 'plot_boundary', 'patok_list', 'verification_stamp']);
decodeJsonFields($harvestLot, ['weather_snapshot', 'shade_trees', 'verification_stamp']);
decodeJsonFields($processedLot, ['cupping_notes', 'waste_management', 'verification_stamp']);
decodeJsonFields($warehouseLot, ['verification_stamp']);
decodeJsonFields($roastedLot, ['tasting_notes', 'recommended_brew', 'verification_stamp']);
decodeJsonFields($cafeProduct, ['tasting_notes', 'verification_stamp']);

sendResponse([
    'query_code'   => $code,
    'farm'         => $farm,
    'harvest_lot'  => $harvestLot,
    'processed_lot'=> $processedLot,
    'warehouse_lot'=> $warehouseLot,
    'roasted_lot'  => $roastedLot,
    'cafe_product' => $cafeProduct,
    'verified'     => true,
    'traced_at'    => date('Y-m-d H:i:s')
]);
