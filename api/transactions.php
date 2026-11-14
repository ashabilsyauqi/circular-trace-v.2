<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT `id`, `tx_date` as date, `from_role` as fromRole, `from_name` as fromName, `to_role` as toRole, `to_name` as toName, `item_name` as itemName, `quantity`, `total_amount` as totalAmount, `status` FROM `supply_chain_transactions` ORDER BY `tx_date` DESC, `created_at` DESC");
    $rows = $stmt->fetchAll();
    foreach ($rows as &$r) {
        $r['totalAmount'] = (float)$r['totalAmount'];
    }
    sendResponse($rows);
}

if ($method === 'POST') {
    $data = getJsonInput();
    $id = $data['id'] ?? ('TX-' . strtoupper(substr(uniqid(), -6)));
    $date = $data['date'] ?? date('Y-m-d');
    $fromRole = $data['fromRole'] ?? 'petani';
    $fromName = $data['fromName'] ?? '';
    $toRole = $data['toRole'] ?? 'pengolah';
    $toName = $data['toName'] ?? '';
    $item = $data['itemName'] ?? '';
    $qty = $data['quantity'] ?? '100 kg';
    $amount = $data['totalAmount'] ?? 0;
    $status = $data['status'] ?? 'Selesai';

    $stmt = $pdo->prepare("INSERT INTO `supply_chain_transactions` 
        (`id`, `tx_date`, `from_role`, `from_name`, `to_role`, `to_name`, `item_name`, `quantity`, `total_amount`, `status`)
        VALUES 
        (:id, :tdate, :frole, :fname, :trole, :tname, :item, :qty, :amount, :status)");

    $stmt->execute([
        'id'     => $id,
        'tdate'  => $date,
        'frole'  => $fromRole,
        'fname'  => $fromName,
        'trole'  => $toRole,
        'tname'  => $toName,
        'item'   => $item,
        'qty'    => $qty,
        'amount' => $amount,
        'status' => $status
    ]);

    sendResponse(['id' => $id, 'message' => 'Transaksi berhasil dicatat ke buku besar'], 201);
}

sendError('Method not allowed', 405);
