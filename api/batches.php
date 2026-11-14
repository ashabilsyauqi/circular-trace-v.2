<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $processorId = $_GET['processor_id'] ?? null;
    $sql = "SELECT * FROM `processing_batches`";
    $params = [];
    if ($processorId) {
        $sql .= " WHERE `processor_id` = :pid";
        $params['pid'] = $processorId;
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
    $data = getJsonInput();
    $id = $data['id'] ?? ('BATCH-' . strtoupper(substr(uniqid(), -6)));
    $processorId = $data['processorId'] ?? '';
    $processorName = $data['processorName'] ?? '';
    $batchCode = $data['batchCode'] ?? ('BTC-' . date('Ymd-His'));
    $cherryLots = json_encode($data['sourceCherryLots'] ?? []);
    $methodType = $data['processMethod'] ?? 'Full Washed';
    $stage = $data['currentStage'] ?? 'intake_sorting';
    $intake = json_encode($data['intakeLog'] ?? null);
    $ferm = json_encode($data['fermentationLog'] ?? null);
    $drying = json_encode($data['dryingLog'] ?? null);
    $cond = json_encode($data['conditioningLog'] ?? null);
    $mill = json_encode($data['millingLog'] ?? null);
    $grading = json_encode($data['gradingQcLog'] ?? null);
    $closure = json_encode($data['closureLog'] ?? null);
    $cherryKg = $data['totalCherryInputKg'] ?? 100;
    $estKg = $data['estimatedGreenBeanYieldKg'] ?? ($cherryKg * 0.18);
    $actKg = $data['actualGreenBeanYieldKg'] ?? null;
    $yieldPct = $data['yieldPercentage'] ?? null;
    $waste = json_encode($data['wasteManagement'] ?? null);
    $status = $data['status'] ?? 'in_progress';

    $stmt = $pdo->prepare("INSERT INTO `processing_batches` 
        (`id`, `processor_id`, `processor_name`, `batch_code`, `source_cherry_lots`, `process_method`, `current_stage`, `intake_log`, `fermentation_log`, `drying_log`, `conditioning_log`, `milling_log`, `grading_qc_log`, `closure_log`, `total_cherry_input_kg`, `estimated_green_bean_yield_kg`, `actual_green_bean_yield_kg`, `yield_percentage`, `waste_management`, `status`)
        VALUES 
        (:id, :pid, :pname, :bcode, :clots, :pmethod, :stage, :intake, :ferm, :drying, :cond, :mill, :grading, :closure, :ckg, :estkg, :actkg, :ypct, :waste, :status)
        ON DUPLICATE KEY UPDATE 
        `current_stage`=:stage, `drying_log`=:drying, `milling_log`=:mill, `actual_green_bean_yield_kg`=:actkg, `yield_percentage`=:ypct, `status`=:status");

    $stmt->execute([
        'id'      => $id,
        'pid'     => $processorId,
        'pname'   => $processorName,
        'bcode'   => $batchCode,
        'clots'   => $cherryLots,
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

    sendResponse(['id' => $id, 'message' => 'Batch pengolahan berhasil disimpan'], 201);
}

sendError('Method not allowed', 405);
