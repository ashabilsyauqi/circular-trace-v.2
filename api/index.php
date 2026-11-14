<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();

// Check table counts
$tables = [
    'users',
    'coffee_farms',
    'farmer_harvest_lots',
    'processing_batches',
    'processed_green_bean_lots',
    'warehouse_lots',
    'roast_profiles',
    'roasted_bean_lots',
    'qc_cupping_sessions',
    'cafe_inventory',
    'cafe_products',
    'supply_chain_transactions'
];

$counts = [];
foreach ($tables as $t) {
    try {
        $stmt = $pdo->query("SELECT COUNT(*) AS total FROM `{$t}`");
        $row = $stmt->fetch();
        $counts[$t] = (int)$row['total'];
    } catch (Exception $e) {
        $counts[$t] = 'Table not found / uninitialized';
    }
}

sendResponse([
    'service'   => 'Circular Coffee Trace (sangrAI) REST API',
    'status'    => 'online',
    'engine'    => 'MySQL PDO',
    'timestamp' => date('Y-m-d H:i:s'),
    'tables'    => $counts,
    'endpoints' => [
        'GET /api/trace.php?code={lotId|cupId}' => 'Public farm-to-cup traceability QR lookup',
        'POST /api/auth.php?action=login'      => 'Stakeholder login authentication',
        'GET /api/farms.php'                   => 'List coffee farms & geolocation boundaries',
        'GET /api/harvests.php'                => 'List farmer red cherry harvest lots',
        'GET /api/batches.php'                 => 'List processing batches & drying logs',
        'GET /api/warehouse.php'               => 'List warehouse green bean inventory & health certs',
        'GET /api/roastery.php?type=lots'      => 'List roasted coffee bean lots & cupping scores',
        'GET /api/cafe.php?type=products'      => 'List cafe retail & cup products',
        'GET /api/transactions.php'            => 'List supply chain transaction ledger'
    ]
]);
