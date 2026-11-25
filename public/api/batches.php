<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $auth = requireAuth($pdo);
    $role = $auth['role'];
    $userId = $auth['user_id'];
    $ktId = $auth['kelompok_tani_id'];

    $sql = "SELECT * FROM `processing_batches` WHERE 1=1";
    $params = [];

    if ($role === 'pengolah') {
        if ($ktId) {
            $sql .= " AND (`processor_id` = :pid OR `kelompok_tani_id` = :ktid)";
            $params['pid'] = $userId;
            $params['ktid'] = $ktId;
        } else {
            $sql .= " AND `processor_id` = :pid";
            $params['pid'] = $userId;
        }
    } elseif (in_array($role, ['admin_kelompok_tani', 'verifikator'])) {
        if ($ktId) {
            $sql .= " AND `kelompok_tani_id` = :ktid";
            $params['ktid'] = $ktId;
        }
    } elseif ($role === 'super_admin') {
        if (!empty($_GET['processor_id'])) {
            $sql .= " AND `processor_id` = :pid";
            $params['pid'] = $_GET['processor_id'];
        }
    }

    $sql .= " ORDER BY `created_at` DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    foreach ($rows as &$r) {
        $r['sourceCherryLots'] = json_decode($r['source_cherry_lots'] ?? '[]', true);
        $r['intakeLog'] = json_decode($r['intake_log'] ?? 'null', true);
        $r['fermentationLog'] = json_decode($r['fermentation_log'] ?? 'null', true);
        $r['dryingLog'] = json_decode($r['drying_log'] ?? 'null', true);
        $r['conditioningLog'] = json_decode($r['conditioning_log'] ?? 'null', true);
        $r['millingLog'] = json_decode($r['milling_log'] ?? 'null', true);
        $r['gradingQcLog'] = json_decode($r['grading_qc_log'] ?? 'null', true);
        $r['closureLog'] = json_decode($r['closure_log'] ?? 'null', true);
        $r['wasteManagement'] = json_decode($r['waste_management'] ?? 'null', true);
        $r['processorId'] = $r['processor_id'];
        $r['processorName'] = $r['processor_name'];
        $r['kelompokTaniId'] = $r['kelompok_tani_id'] ?? null;
        $r['batchCode'] = $r['batch_code'];
        $r['processMethod'] = $r['process_method'];
        $r['currentStage'] = $r['current_stage'];
        $r['totalCherryInputKg'] = (float)$r['total_cherry_input_kg'];
        $r['estimatedGreenBeanYieldKg'] = (float)$r['estimated_green_bean_yield_kg'];
        $r['actualGreenBeanYieldKg'] = $r['actual_green_bean_yield_kg'] ? (float)$r['actual_green_bean_yield_kg'] : null;
        $r['yieldPercentage'] = $r['yield_percentage'] ? (float)$r['yield_percentage'] : null;
        $r['createdAt'] = $r['created_at'];
    }

    sendResponse($rows);
}

if ($method === 'POST') {
    $auth = requireAuth($pdo, ['pengolah', 'admin_kelompok_tani']);
    $data = getJsonInput();

    $id = $data['id'] ?? ('BATCH-' . strtoupper(substr(uniqid(), -6)));
    $processorId = !empty($data['processorId']) ? $data['processorId'] : $auth['user_id'];
    $processorName = !empty($data['processorName']) ? $data['processorName'] : $auth['name'];
    $kelompokTaniId = $auth['kelompok_tani_id'] ?? ($data['kelompokTaniId'] ?? null);
    $batchCode = $data['batchCode'] ?? ('BTC-' . date('Ymd-His'));
    
    $sourceCherryLotsRaw = $data['sourceCherryLots'] ?? [];
    if (!is_array($sourceCherryLotsRaw)) {
        $sourceCherryLotsRaw = [];
    }

    $methodType = $data['processMethod'] ?? 'Full Washed';
    $stage = $data['currentStage'] ?? 'intake_sorting';
    $intake = json_encode($data['intakeLog'] ?? null);
    $ferm = json_encode($data['fermentationLog'] ?? null);
    $drying = json_encode($data['dryingLog'] ?? null);
    $cond = json_encode($data['conditioningLog'] ?? null);
    $mill = json_encode($data['millingLog'] ?? null);
    $grading = json_encode($data['gradingQcLog'] ?? null);
    $closure = json_encode($data['closureLog'] ?? null);
    $cherryKg = (float)($data['totalCherryInputKg'] ?? 100);
    $estKg = (float)($data['estimatedGreenBeanYieldKg'] ?? ($cherryKg * 0.18));
    $actKg = isset($data['actualGreenBeanYieldKg']) ? (float)$data['actualGreenBeanYieldKg'] : null;
    $yieldPct = isset($data['yieldPercentage']) ? (float)$data['yieldPercentage'] : null;
    $waste = json_encode($data['wasteManagement'] ?? null);
    $status = $data['status'] ?? 'in_progress';

    // ATOMIC TRANSACTION: Deduct cherry stock, record ledger, and save batch
    $pdo->beginTransaction();

    try {
        // If cherry lots were specified, validate and deduct stock atomically
        if (!empty($sourceCherryLotsRaw)) {
            $remainingNeeded = $cherryKg;

            foreach ($sourceCherryLotsRaw as $lotItem) {
                $lotId = is_array($lotItem) ? ($lotItem['id'] ?? ($lotItem['lotId'] ?? '')) : (string)$lotItem;
                if (!$lotId) continue;

                $weightFromLot = is_array($lotItem) && !empty($lotItem['weightKg']) 
                    ? (float)$lotItem['weightKg'] 
                    : $remainingNeeded;
                
                if ($weightFromLot <= 0) continue;

                // Lock & check lot availability
                $lotStmt = $pdo->prepare("SELECT `id`, `farmer_name`, `available_weight_kg`, `price_per_kg` FROM `farmer_harvest_lots` WHERE `id` = :lid LIMIT 1");
                $lotStmt->execute(['lid' => $lotId]);
                $lot = $lotStmt->fetch();

                if (!$lot) {
                    throw new Exception("Lot ceri panen '{$lotId}' tidak ditemukan di sistem.");
                }

                $available = (float)$lot['available_weight_kg'];
                if ($available < $weightFromLot) {
                    throw new Exception("Stok ceri tidak mencukupi untuk lot '{$lotId}'. Tersedia: {$available} kg, Dibutuhkan: {$weightFromLot} kg.");
                }

                $newAvailable = max(0, $available - $weightFromLot);
                $newLotStatus = ($newAvailable <= 0.01) ? 'sold' : 'partial';

                // Update lot available weight & status
                $upLot = $pdo->prepare("UPDATE `farmer_harvest_lots` SET `available_weight_kg` = :aw, `status` = :st WHERE `id` = :lid");
                $upLot->execute([
                    'aw'  => $newAvailable,
                    'st'  => $newLotStatus,
                    'lid' => $lotId
                ]);

                // Record financial transaction in ledger
                $txId = 'TX-' . strtoupper(substr(uniqid(), -6));
                $txStmt = $pdo->prepare("INSERT INTO `supply_chain_transactions` 
                    (`id`, `tx_date`, `from_role`, `from_name`, `to_role`, `to_name`, `item_name`, `quantity`, `total_amount`, `status`)
                    VALUES 
                    (:id, :tdate, 'petani', :fname, 'pengolah', :pname, :item, :qty, :amount, 'Selesai')");
                
                $totalAmt = $weightFromLot * (float)$lot['price_per_kg'];
                $txStmt->execute([
                    'id'     => $txId,
                    'tdate'  => date('Y-m-d'),
                    'fname'  => $lot['farmer_name'],
                    'pname'  => $processorName,
                    'item'   => "Pembelian Ceri Merah ({$lotId})",
                    'qty'    => "{$weightFromLot} kg",
                    'amount' => $totalAmt
                ]);

                $remainingNeeded -= $weightFromLot;
            }
        }

        // Save processing batch
        $cherryLotsJson = json_encode($sourceCherryLotsRaw);
        $isMysql = isMysqlConnection($pdo);

        if ($isMysql) {
            $stmt = $pdo->prepare("INSERT INTO `processing_batches` 
                (`id`, `processor_id`, `processor_name`, `kelompok_tani_id`, `batch_code`, `source_cherry_lots`, `process_method`, `current_stage`, `intake_log`, `fermentation_log`, `drying_log`, `conditioning_log`, `milling_log`, `grading_qc_log`, `closure_log`, `total_cherry_input_kg`, `estimated_green_bean_yield_kg`, `actual_green_bean_yield_kg`, `yield_percentage`, `waste_management`, `status`)
                VALUES 
                (:id, :pid, :pname, :ktid, :bcode, :clots, :pmethod, :stage, :intake, :ferm, :drying, :cond, :mill, :grading, :closure, :ckg, :estkg, :actkg, :ypct, :waste, :status)
                ON DUPLICATE KEY UPDATE 
                `current_stage`=:stage, `drying_log`=:drying, `milling_log`=:mill, `actual_green_bean_yield_kg`=:actkg, `yield_percentage`=:ypct, `status`=:status, `kelompok_tani_id`=:ktid");
        } else {
            $stmt = $pdo->prepare("INSERT INTO `processing_batches` 
                (`id`, `processor_id`, `processor_name`, `kelompok_tani_id`, `batch_code`, `source_cherry_lots`, `process_method`, `current_stage`, `intake_log`, `fermentation_log`, `drying_log`, `conditioning_log`, `milling_log`, `grading_qc_log`, `closure_log`, `total_cherry_input_kg`, `estimated_green_bean_yield_kg`, `actual_green_bean_yield_kg`, `yield_percentage`, `waste_management`, `status`)
                VALUES 
                (:id, :pid, :pname, :ktid, :bcode, :clots, :pmethod, :stage, :intake, :ferm, :drying, :cond, :mill, :grading, :closure, :ckg, :estkg, :actkg, :ypct, :waste, :status)
                ON CONFLICT(`id`) DO UPDATE SET 
                `current_stage`=:stage, `drying_log`=:drying, `milling_log`=:mill, `actual_green_bean_yield_kg`=:actkg, `yield_percentage`=:ypct, `status`=:status, `kelompok_tani_id`=:ktid");
        }

        $stmt->execute([
            'id'      => $id,
            'pid'     => $processorId,
            'pname'   => $processorName,
            'ktid'    => $kelompokTaniId,
            'bcode'   => $batchCode,
            'clots'   => $cherryLotsJson,
            'pmethod' => $methodType,
            'stage'   => $stage,
            'intake'  => $intake,
            'ferm'    => $ferm,
            'drying'  => $drying,
            'cond'    => $cond,
            'mill'    => $mill,
            'grading' => $grading,
            'closure' => $closure,
            'ckg'     => $cherryKg,
            'estkg'   => $estKg,
            'actkg'   => $actKg,
            'ypct'    => $yieldPct,
            'waste'   => $waste,
            'status'  => $status
        ]);

        $pdo->commit();
        sendResponse(['id' => $id, 'message' => 'Batch pengolahan berhasil dibuat dan stok ceri dipotong'], 201);

    } catch (Exception $e) {
        $pdo->rollBack();
        sendError('Gagal memproses batch pengolahan: ' . $e->getMessage(), 400);
    }
}

sendError('Method not allowed', 405);
