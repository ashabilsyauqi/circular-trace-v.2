<?php
/**
 * Circular Coffee Trace (CircularCoffee)
 * Service Packages Management API (Super Admin / Platform Admin)
 * Supports full CRUD operations, feature flags configuration, and pricing.
 */

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

function formatPackageRow(array $r): array {
    $features = [];
    if (!empty($r['features_json'])) {
        $decoded = is_string($r['features_json']) ? json_decode($r['features_json'], true) : $r['features_json'];
        $features = is_array($decoded) ? $decoded : [];
    }

    // Realistic demo subscriber count based on package ID
    $subscriberCounts = [
        'PKG-GAPOKTAN-STARTER' => 14,
        'PKG-GAPOKTAN-PRO'     => 28,
        'PKG-ROASTERY-SCALE'   => 19,
        'PKG-WAREHOUSE-HUB'    => 8,
        'PKG-CAFE-BOUTIQUE'    => 22,
        'PKG-ENTERPRISE-ALL'   => 6,
    ];
    $subs = $subscriberCounts[$r['id']] ?? 5;

    return [
        'id'               => $r['id'],
        'name'             => $r['name'],
        'target_role'      => $r['target_role'],
        'targetRole'       => $r['target_role'],
        'price_monthly'    => (float)$r['price_monthly'],
        'priceMonthly'     => (float)$r['price_monthly'],
        'price_yearly'     => (float)$r['price_yearly'],
        'priceYearly'      => (float)$r['price_yearly'],
        'discount_percent' => (int)$r['discount_percent'],
        'discountPercent'  => (int)$r['discount_percent'],
        'features_json'    => $features,
        'featuresJson'     => $features,
        'is_popular'       => (bool)$r['is_popular'],
        'isPopular'        => (bool)$r['is_popular'],
        'status'           => $r['status'],
        'subscribersCount' => $subs,
        'created_at'       => $r['created_at'] ?? date('Y-m-d H:i:s'),
        'createdAt'        => $r['created_at'] ?? date('Y-m-d H:i:s'),
        'updated_at'       => $r['updated_at'] ?? date('Y-m-d H:i:s'),
        'updatedAt'        => $r['updated_at'] ?? date('Y-m-d H:i:s'),
    ];
}

if ($method === 'GET') {
    $targetRole = $_GET['target_role'] ?? $_GET['role'] ?? null;
    $status = $_GET['status'] ?? null;
    $packageId = $_GET['id'] ?? null;

    if ($packageId) {
        $stmt = $pdo->prepare("SELECT * FROM `service_packages` WHERE `id` = :id LIMIT 1");
        $stmt->execute(['id' => $packageId]);
        $row = $stmt->fetch();
        if (!$row) {
            sendError('Paket tidak ditemukan', 404);
        }
        sendResponse(formatPackageRow($row));
    }

    $sql = "SELECT * FROM `service_packages` WHERE 1=1";
    $params = [];

    if ($targetRole && $targetRole !== 'all') {
        $sql .= " AND (`target_role` = :role OR `target_role` = 'all')";
        $params['role'] = $targetRole;
    }

    if ($status && $status !== 'all') {
        $sql .= " AND `status` = :status";
        $params['status'] = $status;
    }

    $sql .= " ORDER BY `is_popular` DESC, `price_monthly` ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $results = [];
    foreach ($rows as $r) {
        $results[] = formatPackageRow($r);
    }

    sendResponse($results);
}

if ($method === 'POST') {
    $data = getJsonInput();

    $name = trim($data['name'] ?? '');
    if (!$name) {
        sendError('Nama paket wajib diisi', 422);
    }

    $id = trim($data['id'] ?? '');
    if (!$id) {
        $targetPrefix = strtoupper(str_replace('admin_', '', $data['targetRole'] ?? $data['target_role'] ?? 'PKG'));
        $id = 'PKG-' . $targetPrefix . '-' . strtoupper(substr(uniqid(), -5));
    }

    $targetRole = $data['targetRole'] ?? $data['target_role'] ?? 'all';
    $priceMonthly = (float)($data['priceMonthly'] ?? $data['price_monthly'] ?? 0);
    $priceYearly = (float)($data['priceYearly'] ?? $data['price_yearly'] ?? 0);
    
    // Auto-calculate yearly discount if not set
    $discountPercent = (int)($data['discountPercent'] ?? $data['discount_percent'] ?? 0);
    if ($discountPercent === 0 && $priceMonthly > 0 && $priceYearly > 0) {
        $full12Months = $priceMonthly * 12;
        if ($full12Months > $priceYearly) {
            $discountPercent = (int)round((($full12Months - $priceYearly) / $full12Months) * 100);
        }
    }

    $features = $data['featuresJson'] ?? $data['features_json'] ?? [];
    if (!is_array($features)) {
        $features = is_string($features) ? json_decode($features, true) : [];
        if (!is_array($features)) $features = [];
    }
    $featuresJson = json_encode($features, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $isPopular = !empty($data['isPopular']) || !empty($data['is_popular']) ? 1 : 0;
    $status = in_array($data['status'] ?? '', ['active', 'archived']) ? $data['status'] : 'active';

    $isMysql = isMysqlConnection($pdo);

    if ($isMysql) {
        $stmt = $pdo->prepare("INSERT INTO `service_packages`
            (`id`, `name`, `target_role`, `price_monthly`, `price_yearly`, `discount_percent`, `features_json`, `is_popular`, `status`)
            VALUES
            (:id, :name, :role, :pm, :py, :disc, :feat, :pop, :status)
            ON DUPLICATE KEY UPDATE
            `name` = :name,
            `target_role` = :role,
            `price_monthly` = :pm,
            `price_yearly` = :py,
            `discount_percent` = :disc,
            `features_json` = :feat,
            `is_popular` = :pop,
            `status` = :status");
    } else {
        $stmt = $pdo->prepare("INSERT INTO `service_packages`
            (`id`, `name`, `target_role`, `price_monthly`, `price_yearly`, `discount_percent`, `features_json`, `is_popular`, `status`)
            VALUES
            (:id, :name, :role, :pm, :py, :disc, :feat, :pop, :status)
            ON CONFLICT(`id`) DO UPDATE SET
            `name` = :name,
            `target_role` = :role,
            `price_monthly` = :pm,
            `price_yearly` = :py,
            `discount_percent` = :disc,
            `features_json` = :feat,
            `is_popular` = :pop,
            `status` = :status");
    }

    $stmt->execute([
        'id'     => $id,
        'name'   => $name,
        'role'   => $targetRole,
        'pm'     => $priceMonthly,
        'py'     => $priceYearly,
        'disc'   => $discountPercent,
        'feat'   => $featuresJson,
        'pop'    => $isPopular,
        'status' => $status,
    ]);

    // Return updated record
    $fetchStmt = $pdo->prepare("SELECT * FROM `service_packages` WHERE `id` = :id LIMIT 1");
    $fetchStmt->execute(['id' => $id]);
    $saved = $fetchStmt->fetch();

    sendResponse([
        'package' => formatPackageRow($saved),
        'message' => 'Paket layanan berhasil disimpan',
    ], 201);
}

if ($method === 'PUT') {
    $data = getJsonInput();
    $id = trim($data['id'] ?? $_GET['id'] ?? '');

    if (!$id) {
        sendError('ID paket wajib disertakan untuk pembaruan', 400);
    }

    $checkStmt = $pdo->prepare("SELECT * FROM `service_packages` WHERE `id` = :id LIMIT 1");
    $checkStmt->execute(['id' => $id]);
    $existing = $checkStmt->fetch();

    if (!$existing) {
        sendError('Paket tidak ditemukan', 404);
    }

    // Partial updates support
    $name = isset($data['name']) ? trim($data['name']) : $existing['name'];
    $targetRole = $data['targetRole'] ?? $data['target_role'] ?? $existing['target_role'];
    $priceMonthly = isset($data['priceMonthly']) ? (float)$data['priceMonthly'] : (isset($data['price_monthly']) ? (float)$data['price_monthly'] : (float)$existing['price_monthly']);
    $priceYearly = isset($data['priceYearly']) ? (float)$data['priceYearly'] : (isset($data['price_yearly']) ? (float)$data['price_yearly'] : (float)$existing['price_yearly']);
    $discountPercent = isset($data['discountPercent']) ? (int)$data['discountPercent'] : (isset($data['discount_percent']) ? (int)$data['discount_percent'] : (int)$existing['discount_percent']);
    
    if (isset($data['featuresJson']) || isset($data['features_json'])) {
        $features = $data['featuresJson'] ?? $data['features_json'];
        if (!is_array($features)) {
            $features = is_string($features) ? json_decode($features, true) : [];
        }
        $featuresJson = json_encode($features ?: [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        $featuresJson = $existing['features_json'];
    }

    $isPopular = isset($data['isPopular']) ? ($data['isPopular'] ? 1 : 0) : (isset($data['is_popular']) ? ($data['is_popular'] ? 1 : 0) : (int)$existing['is_popular']);
    $status = isset($data['status']) ? (in_array($data['status'], ['active', 'archived']) ? $data['status'] : $existing['status']) : $existing['status'];

    $updateStmt = $pdo->prepare("UPDATE `service_packages` SET
        `name` = :name,
        `target_role` = :role,
        `price_monthly` = :pm,
        `price_yearly` = :py,
        `discount_percent` = :disc,
        `features_json` = :feat,
        `is_popular` = :pop,
        `status` = :status,
        `updated_at` = CURRENT_TIMESTAMP
        WHERE `id` = :id");

    $updateStmt->execute([
        'id'     => $id,
        'name'   => $name,
        'role'   => $targetRole,
        'pm'     => $priceMonthly,
        'py'     => $priceYearly,
        'disc'   => $discountPercent,
        'feat'   => $featuresJson,
        'pop'    => $isPopular,
        'status' => $status,
    ]);

    $fetchStmt = $pdo->prepare("SELECT * FROM `service_packages` WHERE `id` = :id LIMIT 1");
    $fetchStmt->execute(['id' => $id]);
    $updated = $fetchStmt->fetch();

    sendResponse([
        'package' => formatPackageRow($updated),
        'message' => 'Paket layanan berhasil diperbarui',
    ]);
}

if ($method === 'DELETE') {
    $id = trim($_GET['id'] ?? '');
    if (!$id) {
        $data = getJsonInput();
        $id = trim($data['id'] ?? '');
    }

    if (!$id) {
        sendError('ID paket wajib disertakan', 400);
    }

    $permanent = isset($_GET['permanent']) && $_GET['permanent'] == '1';

    if ($permanent) {
        $stmt = $pdo->prepare("DELETE FROM `service_packages` WHERE `id` = :id");
        $stmt->execute(['id' => $id]);
        sendResponse(['message' => "Paket {$id} berhasil dihapus permanen"]);
    } else {
        // Soft delete / archive
        $stmt = $pdo->prepare("UPDATE `service_packages` SET `status` = 'archived', `updated_at` = CURRENT_TIMESTAMP WHERE `id` = :id");
        $stmt->execute(['id' => $id]);
        sendResponse(['message' => "Paket {$id} berhasil dinonaktifkan / diarsipkan"]);
    }
}

sendError('Metode HTTP tidak didukung', 405);
