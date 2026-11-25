<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $auth = requireAuth($pdo);
    $role = $auth['role'];
    $userId = $auth['user_id'];
    $ktId = $auth['kelompok_tani_id'];

    $sql = "SELECT * FROM `farmer_harvest_lots` WHERE 1=1";
    $params = [];

    if ($role === 'petani') {
        // Petani only sees their own harvest lots
        $sql .= " AND `farmer_id` = :uid";
        $params['uid'] = $userId;
    } elseif (in_array($role, ['admin_kelompok_tani', 'verifikator'])) {
        // Admin Kelompok Tani / Verifikator only sees lots within their kelompok tani
        if ($ktId) {
            $sql .= " AND `kelompok_tani_id` = :ktid";
            $params['ktid'] = $ktId;
        }
    } elseif (in_array($role, ['pengolah', 'roaster', 'gudang', 'cafe'])) {
        // Downstream buyers / processors only see available harvest lots
        $sql .= " AND `status` = 'available'";
    } elseif ($role === 'super_admin') {
        // Super admin sees all, optional filters
        if (!empty($_GET['farmer_id'])) {
            $sql .= " AND `farmer_id` = :fid";
            $params['fid'] = $_GET['farmer_id'];
        }
        if (!empty($_GET['kelompok_tani_id'])) {
            $sql .= " AND `kelompok_tani_id` = :ktid";
            $params['ktid'] = $_GET['kelompok_tani_id'];
        }
    }

    if (!empty($_GET['status'])) {
        $sql .= " AND `status` = :st";
        $params['st'] = $_GET['status'];
    }

    $sql .= " ORDER BY `harvest_date` DESC, `created_at` DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    foreach ($rows as &$r) {
        $r['weatherSnapshot'] = json_decode($r['weather_snapshot'] ?? 'null', true);
        $r['shadeTrees'] = json_decode($r['shade_trees'] ?? '[]', true);
        $r['verificationStamp'] = json_decode($r['verification_stamp'] ?? 'null', true);
        $r['farmerId'] = $r['farmer_id'];
        $r['farmerName'] = $r['farmer_name'];
        $r['kelompokTaniId'] = $r['kelompok_tani_id'] ?? null;
        $r['farmId'] = $r['farm_id'];
        $r['farmName'] = $r['farm_name'];
        $r['farmLocation'] = $r['farm_location'];
        $r['harvestDate'] = $r['harvest_date'];
        $r['pickingMethod'] = $r['picking_method'];
        $r['brix'] = (float)$r['brix'];
        $r['totalWeightKg'] = (float)$r['total_weight_kg'];
        $r['availableWeightKg'] = (float)$r['available_weight_kg'];
        $r['pricePerKg'] = (float)$r['price_per_kg'];
        $r['photoUrl'] = $r['photo_url'];
        $r['soilType'] = $r['soil_type'];
        $r['verificationStatus'] = $r['verification_status'];
        $r['createdAt'] = $r['created_at'];
    }

    sendResponse($rows);
}

if ($method === 'POST') {
    $auth = requireAuth($pdo, ['petani', 'admin_kelompok_tani']);
    $data = getJsonInput();

    $id = $data['id'] ?? ('LOT-PTN-' . str_pad(mt_rand(1, 999), 3, '0', STR_PAD_LEFT));
    $farmerId = !empty($data['farmerId']) ? $data['farmerId'] : $auth['user_id'];
    $farmerName = !empty($data['farmerName']) ? $data['farmerName'] : $auth['name'];
    $kelompokTaniId = $auth['kelompok_tani_id'] ?? ($data['kelompokTaniId'] ?? null);
    $farmId = $data['farmId'] ?? null;
    $farmName = $data['farmName'] ?? '';
    $farmLocation = $data['farmLocation'] ?? '';
    $altitude = $data['altitude'] ?? '';
    $variety = $data['variety'] ?? '';
    $harvestDate = $data['harvestDate'] ?? date('Y-m-d');
    $pickingMethod = $data['pickingMethod'] ?? 'Petik Merah Optimal (95%+)';
    $brix = $data['brix'] ?? 20.0;
    $totalWeight = (float)($data['totalWeightKg'] ?? 100);
    $availableWeight = (float)($data['availableWeightKg'] ?? $totalWeight);
    $price = $data['pricePerKg'] ?? 15000;
    $notes = $data['notes'] ?? '';
    $status = $data['status'] ?? 'available';
    $photoUrl = $data['photoUrl'] ?? 'https://images.unsplash.com/photo-1524350876685-274059332603?w=600';
    $weather = json_encode($data['weatherSnapshot'] ?? null);
    $soil = $data['soilType'] ?? null;
    $shade = json_encode($data['shadeTrees'] ?? null);
    $verStatus = $data['verificationStatus'] ?? 'verified';
    $stamp = json_encode($data['verificationStamp'] ?? null);

    $isMysql = isMysqlConnection($pdo);

    if ($isMysql) {
        $stmt = $pdo->prepare("INSERT INTO `farmer_harvest_lots` 
            (`id`, `farmer_id`, `farmer_name`, `kelompok_tani_id`, `farm_id`, `farm_name`, `farm_location`, `altitude`, `variety`, `harvest_date`, `picking_method`, `brix`, `total_weight_kg`, `available_weight_kg`, `price_per_kg`, `notes`, `status`, `photo_url`, `weather_snapshot`, `soil_type`, `shade_trees`, `verification_status`, `verification_stamp`)
            VALUES 
            (:id, :fid, :fname, :ktid, :farmid, :farmname, :loc, :alt, :var, :hdate, :pick, :brix, :tw, :aw, :price, :notes, :status, :photo, :wea, :soil, :shade, :vstatus, :stamp)
            ON DUPLICATE KEY UPDATE 
            `available_weight_kg`=:aw, `price_per_kg`=:price, `status`=:status, `notes`=:notes, `kelompok_tani_id`=:ktid");
    } else {
        $stmt = $pdo->prepare("INSERT INTO `farmer_harvest_lots` 
            (`id`, `farmer_id`, `farmer_name`, `kelompok_tani_id`, `farm_id`, `farm_name`, `farm_location`, `altitude`, `variety`, `harvest_date`, `picking_method`, `brix`, `total_weight_kg`, `available_weight_kg`, `price_per_kg`, `notes`, `status`, `photo_url`, `weather_snapshot`, `soil_type`, `shade_trees`, `verification_status`, `verification_stamp`)
            VALUES 
            (:id, :fid, :fname, :ktid, :farmid, :farmname, :loc, :alt, :var, :hdate, :pick, :brix, :tw, :aw, :price, :notes, :status, :photo, :wea, :soil, :shade, :vstatus, :stamp)
            ON CONFLICT(`id`) DO UPDATE SET 
            `available_weight_kg`=:aw, `price_per_kg`=:price, `status`=:status, `notes`=:notes, `kelompok_tani_id`=:ktid");
    }

    $stmt->execute([
        'id'       => $id,
        'fid'      => $farmerId,
        'fname'    => $farmerName,
        'ktid'     => $kelompokTaniId,
        'farmid'   => $farmId,
        'farmname' => $farmName,
        'loc'      => $farmLocation,
        'alt'      => $altitude,
        'var'      => $variety,
        'hdate'    => $harvestDate,
        'pick'     => $pickingMethod,
        'brix'     => $brix,
        'tw'       => $totalWeight,
        'aw'       => $availableWeight,
        'price'    => $price,
        'notes'    => $notes,
        'status'   => $status,
        'photo'    => $photoUrl,
        'wea'      => $weather,
        'soil'     => $soil,
        'shade'    => $shade,
        'vstatus'  => $verStatus,
        'stamp'    => $stamp
    ]);

    sendResponse(['id' => $id, 'message' => 'Lot panen berhasil disimpan'], 201);
}

sendError('Method not allowed', 405);
