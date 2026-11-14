<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $whId = $_GET['warehouse_id'] ?? null;
    $sql = "SELECT * FROM `warehouse_lots`";
    $params = [];
    if ($whId) {
        $sql .= " WHERE `warehouse_id` = :wid";
        $params['wid'] = $whId;
    }
    $sql .= " ORDER BY `stored_date` DESC, `created_at` DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    foreach ($rows as &$r) {
        $r['verificationStamp'] = json_decode($r['verification_stamp'] ?? 'null', true);
        $r['warehouseId'] = $r['warehouse_id'];
        $r['warehouseName'] = $r['warehouse_name'];
        $r['sourceGreenBeanId'] = $r['source_green_bean_id'];
        $r['sourceProcessorName'] = $r['source_processor_name'];
        $r['sourceFarmerName'] = $r['source_farmer_name'];
        $r['processMethod'] = $r['process_method'];
        $r['storageLocation'] = $r['storage_location'];
        $r['temperatureCelsius'] = (float)$r['temperature_celsius'];
        $r['humidityPercent'] = (float)$r['humidity_percent'];
        $r['packagingType'] = $r['packaging_type'];
        $r['verifiedScaScore'] = (float)$r['verified_sca_score'];
        $r['weightKg'] = (float)$r['weight_kg'];
        $r['availableWeightKg'] = (float)$r['available_weight_kg'];
        $r['purchasePricePerKg'] = (float)$r['purchase_price_per_kg'];
        $r['pricePerKg'] = (float)$r['price_per_kg'];
        $r['storedDate'] = $r['stored_date'];
        $r['gradeTier'] = $r['grade_tier'];
        $r['defectCount'] = (int)$r['defect_count'];
        $r['screenSize'] = $r['screen_size'];
        $r['moistureContentPercent'] = (float)$r['moisture_content_percent'];
        $r['waterActivityAw'] = (float)$r['water_activity_aw'];
        $r['targetMarket'] = $r['target_market'];
        $r['hasHealthCertificate'] = (bool)$r['has_health_certificate'];
        $r['healthCertificateNumber'] = $r['health_certificate_number'];
        $r['qcStatus'] = $r['qc_status'];
        $r['verificationStatus'] = $r['verification_status'];
    }

    sendResponse($rows);
}

if ($method === 'POST') {
    $data = getJsonInput();
    $id = $data['id'] ?? ('LOT-GDG-' . str_pad(mt_rand(1, 999), 3, '0', STR_PAD_LEFT));
    $whId = $data['warehouseId'] ?? '';
    $whName = $data['warehouseName'] ?? '';
    $sourceGreenBeanId = $data['sourceGreenBeanId'] ?? '';
    $sourceProc = $data['sourceProcessorName'] ?? '';
    $sourceFarmer = $data['sourceFarmerName'] ?? '';
    $origin = $data['origin'] ?? '';
    $variety = $data['variety'] ?? '';
    $alt = $data['altitude'] ?? '';
    $methodType = $data['processMethod'] ?? '';
    $storage = $data['storageLocation'] ?? 'Gudang Utama';
    $temp = $data['temperatureCelsius'] ?? 20.0;
    $humidity = $data['humidityPercent'] ?? 55.0;
    $packType = $data['packagingType'] ?? 'GrainPro + Karung Goni 60kg';
    $sca = $data['verifiedScaScore'] ?? 85.0;
    $weight = $data['weightKg'] ?? 100;
    $availWeight = $data['availableWeightKg'] ?? $weight;
    $buyPrice = $data['purchasePricePerKg'] ?? 100000;
    $price = $data['pricePerKg'] ?? 125000;
    $storedDate = $data['storedDate'] ?? date('Y-m-d');
    $grade = $data['gradeTier'] ?? 'Grade 1 - Super Premium';
    $defect = $data['defectCount'] ?? 2;
    $screen = $data['screenSize'] ?? 'Screen 16-18';
    $moist = $data['moistureContentPercent'] ?? 11.0;
    $aw = $data['waterActivityAw'] ?? 0.56;
    $target = $data['targetMarket'] ?? 'Roastery Specialty';
    $hasHc = !empty($data['hasHealthCertificate']) ? 1 : 0;
    $hcNum = $data['healthCertificateNumber'] ?? null;
    $status = $data['status'] ?? 'available';
    $qcStatus = $data['qcStatus'] ?? 'passed';
    $notes = $data['notes'] ?? '';

    $stmt = $pdo->prepare("INSERT INTO `warehouse_lots` 
        (`id`, `warehouse_id`, `warehouse_name`, `source_green_bean_id`, `source_processor_name`, `source_farmer_name`, `origin`, `variety`, `altitude`, `process_method`, `storage_location`, `temperature_celsius`, `humidity_percent`, `packaging_type`, `verified_sca_score`, `weight_kg`, `available_weight_kg`, `purchase_price_per_kg`, `price_per_kg`, `stored_date`, `grade_tier`, `defect_count`, `screen_size`, `moisture_content_percent`, `water_activity_aw`, `target_market`, `has_health_certificate`, `health_certificate_number`, `status`, `qc_status`, `notes`)
        VALUES 
        (:id, :wid, :wname, :sgb, :sproc, :sfarmer, :orig, :var, :alt, :pmethod, :storage, :temp, :hum, :pack, :sca, :wt, :awt, :buy, :price, :sdate, :grade, :def, :screen, :moist, :aw, :target, :hashc, :hcnum, :status, :qc, :notes)
        ON DUPLICATE KEY UPDATE 
        `available_weight_kg`=:awt, `price_per_kg`=:price, `status`=:status, `qc_status`=:qc, `has_health_certificate`=:hashc, `health_certificate_number`=:hcnum");

    $stmt->execute([
        'id'      => $id,
        'wid'     => $whId,
        'wname'   => $whName,
        'sgb'     => $sourceGreenBeanId,
        'sproc'   => $sourceProc,
        'sfarmer' => $sourceFarmer,
        'orig'    => $origin,
        'var'     => $variety,
        'alt'     => $alt,
        'pmethod' => $methodType,
        'storage' => $storage,
        'temp'    => $temp,
        'hum'     => $humidity,
        'pack'    => $packType,
        'sca'     => $sca,
        'wt'      => $weight,
        'awt'     => $availWeight,
        'buy'     => $buyPrice,
        'price'   => $price,
        'sdate'   => $storedDate,
        'grade'   => $grade,
        'def'     => $defect,
        'screen'  => $screen,
        'moist'   => $moist,
        'aw'      => $aw,
        'target'  => $target,
        'hashc'   => $hasHc,
        'hcnum'   => $hcNum,
        'status'  => $status,
        'qc'      => $qcStatus,
        'notes'   => $notes
    ]);

    sendResponse(['id' => $id, 'message' => 'Lot gudang berhasil disimpan'], 201);
}

sendError('Method not allowed', 405);
