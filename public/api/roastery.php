<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$type = $_GET['type'] ?? 'lots';

if ($method === 'GET') {
    if ($type === 'profiles') {
        $roasterId = $_GET['roaster_id'] ?? null;
        $sql = "SELECT * FROM `roast_profiles`";
        $params = [];
        if ($roasterId) {
            $sql .= " WHERE `roaster_id` = :rid";
            $params['rid'] = $roasterId;
        }
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r['roasterId'] = $r['roaster_id'];
            $r['profileName'] = $r['profile_name'];
            $r['roastLevel'] = $r['roast_level'];
            $r['chargeTemp'] = (int)$r['charge_temp'];
            $r['turningPointTemp'] = (int)$r['turning_point_temp'];
            $r['firstCrackTime'] = $r['first_crack_time'];
            $r['firstCrackTemp'] = (int)$r['first_crack_temp'];
            $r['dropTime'] = $r['drop_time'];
            $r['dropTemp'] = (int)$r['drop_temp'];
            $r['developmentTimeRatio'] = (float)$r['development_time_ratio'];
        }
        sendResponse($rows);
    }

    if ($type === 'cupping') {
        $stmt = $pdo->query("SELECT * FROM `qc_cupping_sessions` ORDER BY `session_date` DESC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r['tastingNotes'] = json_decode($r['tasting_notes'] ?? '[]', true);
            $r['fragranceAroma'] = (float)$r['fragrance_aroma'];
            $r['flavor'] = (float)$r['flavor'];
            $r['aftertaste'] = (float)$r['aftertaste'];
            $r['acidity'] = (float)$r['acidity'];
            $r['body'] = (float)$r['body'];
            $r['balance'] = (float)$r['balance'];
            $r['uniformity'] = (float)$r['uniformity'];
            $r['cleanCup'] = (float)$r['clean_cup'];
            $r['sweetness'] = (float)$r['sweetness'];
            $r['overall'] = (float)$r['overall'];
            $r['totalScore'] = (float)$r['total_score'];
            $r['defectDeduction'] = (float)$r['defect_deduction'];
        }
        sendResponse($rows);
    }

    // Default: roasted bean lots
    $roasterId = $_GET['roaster_id'] ?? null;
    $sql = "SELECT * FROM `roasted_bean_lots`";
    $params = [];
    if ($roasterId) {
        $sql .= " WHERE `roaster_id` = :rid";
        $params['rid'] = $roasterId;
    }
    $sql .= " ORDER BY `roast_date` DESC, `created_at` DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    foreach ($rows as &$r) {
        $r['tastingNotes'] = json_decode($r['tasting_notes'] ?? '[]', true);
        $r['recommendedBrew'] = json_decode($r['recommended_brew'] ?? '[]', true);
        $r['verificationStamp'] = json_decode($r['verification_stamp'] ?? 'null', true);
        $r['roasterId'] = $r['roaster_id'];
        $r['roasterName'] = $r['roaster_name'];
        $r['sourceWarehouseLotId'] = $r['source_warehouse_lot_id'];
        $r['farmerName'] = $r['farmer_name'];
        $r['roasterMachine'] = $r['roaster_machine'];
        $r['roastLevel'] = $r['roast_level'];
        $r['agtronNumber'] = (int)$r['agtron_number'];
        $r['roastDate'] = $r['roast_date'];
        $r['developmentTimeRatio'] = (float)$r['development_time_ratio'];
        $r['scaCuppingScore'] = (float)$r['sca_cupping_score'];
        $r['packageWeightGrams'] = (int)$r['package_weight_grams'];
        $r['totalPacks'] = (int)$r['total_packs'];
        $r['availablePacks'] = (int)$r['available_packs'];
        $r['pricePerPack'] = (float)$r['price_per_pack'];
        $r['restingRecommendationDays'] = (int)$r['resting_recommendation_days'];
        $r['photoUrl'] = $r['photo_url'];
        $r['sourceWorkOrderId'] = $r['source_work_order_id'];
        $r['verificationStatus'] = $r['verification_status'];
    }

    sendResponse($rows);
}

if ($method === 'POST') {
    $data = getJsonInput();

    if ($type === 'cupping') {
        $id = $data['id'] ?? ('QC-' . strtoupper(substr(uniqid(), -6)));
        $stmt = $pdo->prepare("INSERT INTO `qc_cupping_sessions` 
            (`id`, `sample_id`, `session_date`, `evaluator_name`, `fragrance_aroma`, `flavor`, `aftertaste`, `acidity`, `body`, `balance`, `uniformity`, `clean_cup`, `sweetness`, `overall`, `total_score`, `tasting_notes`, `defect_deduction`, `notes`)
            VALUES 
            (:id, :sample, :sdate, :eval, :frag, :flav, :after, :acid, :body, :bal, :uni, :clean, :sweet, :over, :total, :notes_json, :defect, :notes)");
        $stmt->execute([
            'id'         => $id,
            'sample'     => $data['sampleId'] ?? null,
            'sdate'      => $data['sessionDate'] ?? date('Y-m-d'),
            'eval'       => $data['evaluatorName'] ?? 'Q-Grader',
            'frag'       => $data['fragranceAroma'] ?? 8.0,
            'flav'       => $data['flavor'] ?? 8.0,
            'after'      => $data['aftertaste'] ?? 8.0,
            'acid'       => $data['acidity'] ?? 8.0,
            'body'       => $data['body'] ?? 8.0,
            'bal'        => $data['balance'] ?? 8.0,
            'uni'        => $data['uniformity'] ?? 10.0,
            'clean'      => $data['cleanCup'] ?? 10.0,
            'sweet'      => $data['sweetness'] ?? 10.0,
            'over'       => $data['overall'] ?? 8.0,
            'total'      => $data['totalScore'] ?? 86.0,
            'notes_json' => json_encode($data['tastingNotes'] ?? []),
            'defect'     => $data['defectDeduction'] ?? 0,
            'notes'      => $data['notes'] ?? ''
        ]);
        sendResponse(['id' => $id, 'message' => 'Sesi cupping berhasil dicatat'], 201);
    }

    // Insert roasted lot
    $id = $data['id'] ?? ('LOT-RST-' . str_pad(mt_rand(1, 999), 3, '0', STR_PAD_LEFT));
    $stmt = $pdo->prepare("INSERT INTO `roasted_bean_lots` 
        (`id`, `roaster_id`, `roaster_name`, `source_warehouse_lot_id`, `origin`, `variety`, `altitude`, `process_method`, `farmer_name`, `roaster_machine`, `roast_level`, `agtron_number`, `roast_date`, `development_time_ratio`, `tasting_notes`, `sca_cupping_score`, `package_weight_grams`, `total_packs`, `available_packs`, `price_per_pack`, `resting_recommendation_days`, `recommended_brew`, `status`, `photo_url`, `source_work_order_id`)
        VALUES 
        (:id, :rid, :rname, :swhid, :orig, :var, :alt, :pmethod, :farmer, :machine, :rlevel, :agtron, :rdate, :dtr, :tnotes, :sca, :pweight, :tpacks, :apacks, :price, :rest, :rbrew, :status, :photo, :workorder)
        ON DUPLICATE KEY UPDATE 
        `available_packs`=:apacks, `price_per_pack`=:price, `status`=:status");

    $stmt->execute([
        'id'        => $id,
        'rid'       => $data['roasterId'] ?? '',
        'rname'     => $data['roasterName'] ?? '',
        'swhid'     => $data['sourceWarehouseLotId'] ?? '',
        'orig'      => $data['origin'] ?? '',
        'var'       => $data['variety'] ?? '',
        'alt'       => $data['altitude'] ?? '',
        'pmethod'   => $data['processMethod'] ?? '',
        'farmer'    => $data['farmerName'] ?? '',
        'machine'   => $data['roasterMachine'] ?? 'Giesen W6A',
        'rlevel'    => $data['roastLevel'] ?? 'Medium Roast',
        'agtron'    => $data['agtronNumber'] ?? 65,
        'rdate'     => $data['roastDate'] ?? date('Y-m-d'),
        'dtr'       => $data['developmentTimeRatio'] ?? 14.5,
        'tnotes'    => json_encode($data['tastingNotes'] ?? []),
        'sca'       => $data['scaCuppingScore'] ?? 87.0,
        'pweight'   => $data['packageWeightGrams'] ?? 250,
        'tpacks'    => $data['totalPacks'] ?? 50,
        'apacks'    => $data['availablePacks'] ?? 50,
        'price'     => $data['pricePerPack'] ?? 85000,
        'rest'      => $data['restingRecommendationDays'] ?? 7,
        'rbrew'     => json_encode($data['recommendedBrew'] ?? ['V60', 'Espresso']),
        'status'    => $data['status'] ?? 'available',
        'photo'     => $data['photoUrl'] ?? 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600',
        'workorder' => $data['sourceWorkOrderId'] ?? null
    ]);

    sendResponse(['id' => $id, 'message' => 'Lot biji sangrai berhasil disimpan'], 201);
}

sendError('Method not allowed', 405);
