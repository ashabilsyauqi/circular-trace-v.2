<?php
/**
 * Circular Coffee Trace (CircularCoffee)
 * Super Admin Management API
 * Provides endpoints for Service Configurations, Subscriptions, and Ecosystem Telemetry.
 */

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'services';

// Auto create table for superadmin service settings if not exists
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS superadmin_service_settings (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        status VARCHAR(30) DEFAULT 'active',
        quota_json TEXT,
        pricing_json TEXT,
        features_json TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS superadmin_subscriptions (
        id VARCHAR(50) PRIMARY KEY,
        organization_name VARCHAR(150) NOT NULL,
        pic_name VARCHAR(100),
        email VARCHAR(150),
        phone VARCHAR(50),
        location VARCHAR(150),
        service_id VARCHAR(50) NOT NULL,
        package_id VARCHAR(50) NOT NULL,
        package_name VARCHAR(150) NOT NULL,
        billing_cycle VARCHAR(20) DEFAULT 'monthly',
        price_per_cycle DECIMAL(12,2) DEFAULT 0.00,
        mrr_contribution DECIMAL(12,2) DEFAULT 0.00,
        status VARCHAR(30) DEFAULT 'active',
        user_seats_used INT DEFAULT 1,
        user_seats_limit INT DEFAULT 10,
        lots_quota_used INT DEFAULT 0,
        lots_quota_limit VARCHAR(30) DEFAULT 'Unlimited',
        start_date DATE,
        renewal_date DATE,
        auto_renew TINYINT(1) DEFAULT 1,
        notes TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
} catch (Exception $e) {
    // Ignore if table creation fails or already exists
}

if ($method === 'GET') {
    if ($action === 'services') {
        try {
            $stmt = $pdo->query("SELECT * FROM superadmin_service_settings");
            $rows = $stmt->fetchAll();
            $data = [];
            foreach ($rows as $r) {
                $data[$r['id']] = [
                    'id'            => $r['id'],
                    'name'          => $r['name'],
                    'status'        => $r['status'],
                    'quota'         => json_decode($r['quota_json'] ?? '{}', true),
                    'pricing'       => json_decode($r['pricing_json'] ?? '{}', true),
                    'features'      => json_decode($r['features_json'] ?? '[]', true),
                    'updatedAt'     => $r['updated_at'],
                ];
            }
            sendResponse([
                'success' => true,
                'data'    => $data,
            ]);
        } catch (Exception $e) {
            sendResponse(['success' => true, 'data' => []]);
        }
    }

    if ($action === 'subscriptions') {
        try {
            $stmt = $pdo->query("SELECT * FROM superadmin_subscriptions ORDER BY renewal_date ASC");
            $rows = $stmt->fetchAll();
            $data = [];
            foreach ($rows as $r) {
                $data[] = [
                    'id'               => $r['id'],
                    'organizationName' => $r['organization_name'],
                    'picName'          => $r['pic_name'],
                    'email'            => $r['email'],
                    'phone'            => $r['phone'],
                    'location'         => $r['location'],
                    'serviceId'        => $r['service_id'],
                    'packageId'        => $r['package_id'],
                    'packageName'      => $r['package_name'],
                    'billingCycle'     => $r['billing_cycle'],
                    'pricePerCycle'    => (float)$r['price_per_cycle'],
                    'mrrContribution'  => (float)$r['mrr_contribution'],
                    'status'           => $r['status'],
                    'userSeatsUsed'    => (int)$r['user_seats_used'],
                    'userSeatsLimit'   => (int)$r['user_seats_limit'],
                    'lotsQuotaUsed'    => (int)$r['lots_quota_used'],
                    'lotsQuotaLimit'   => $r['lots_quota_limit'],
                    'startDate'        => $r['start_date'],
                    'renewalDate'      => $r['renewal_date'],
                    'autoRenew'        => (bool)$r['auto_renew'],
                    'notes'            => $r['notes'],
                ];
            }
            sendResponse([
                'success' => true,
                'data'    => $data,
            ]);
        } catch (Exception $e) {
            sendResponse(['success' => true, 'data' => []]);
        }
    }

    if ($action === 'telemetry') {
        // Aggregate dynamic metrics from users, farms, batches, and transactions
        try {
            $totalUsers = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
            $totalTx = (float)$pdo->query("SELECT COALESCE(SUM(total_amount), 0) FROM supply_chain_transactions")->fetchColumn();
            sendResponse([
                'success' => true,
                'data'    => [
                    'activePlatformUsers' => $totalUsers,
                    'totalTransactionValue' => $totalTx,
                    'serverTimestamp'     => date('Y-m-d H:i:s'),
                ]
            ]);
        } catch (Exception $e) {
            sendResponse(['success' => true, 'data' => []]);
        }
    }
}

if ($method === 'POST') {
    $data = getJsonInput();

    if ($action === 'update_service') {
        $serviceId = $data['id'] ?? null;
        if (!$serviceId) {
            sendError('ID service diperlukan', 400);
        }

        try {
            $stmt = $pdo->prepare("INSERT OR REPLACE INTO superadmin_service_settings 
                (id, name, status, quota_json, pricing_json, features_json, updated_at) 
                VALUES (:id, :name, :status, :quota, :pricing, :features, CURRENT_TIMESTAMP)");
            $stmt->execute([
                'id'       => $serviceId,
                'name'     => $data['name'] ?? $serviceId,
                'status'   => $data['status'] ?? 'active',
                'quota'    => json_encode($data['quota'] ?? []),
                'pricing'  => json_encode($data['pricing'] ?? []),
                'features' => json_encode($data['features'] ?? []),
            ]);

            sendResponse([
                'success' => true,
                'message' => "Pengaturan service {$serviceId} berhasil diperbarui",
            ]);
        } catch (Exception $e) {
            sendError('Gagal memperbarui service: ' . $e->getMessage(), 500);
        }
    }

    if ($action === 'update_subscription') {
        $subId = $data['id'] ?? null;
        if (!$subId) {
            sendError('ID subscription diperlukan', 400);
        }

        try {
            $stmt = $pdo->prepare("INSERT OR REPLACE INTO superadmin_subscriptions 
                (id, organization_name, pic_name, email, phone, location, service_id, package_id, package_name, billing_cycle, price_per_cycle, mrr_contribution, status, user_seats_used, user_seats_limit, lots_quota_used, lots_quota_limit, start_date, renewal_date, auto_renew, notes, updated_at) 
                VALUES (:id, :org_name, :pic, :email, :phone, :loc, :svc, :pkg_id, :pkg_name, :cycle, :price, :mrr, :status, :seats_used, :seats_limit, :lots_used, :lots_limit, :start, :renewal, :auto_renew, :notes, CURRENT_TIMESTAMP)");
            
            $stmt->execute([
                'id'          => $subId,
                'org_name'    => $data['organizationName'] ?? '',
                'pic'         => $data['picName'] ?? '',
                'email'       => $data['email'] ?? '',
                'phone'       => $data['phone'] ?? '',
                'loc'         => $data['location'] ?? '',
                'svc'         => $data['serviceId'] ?? 'admin_kelompok_tani',
                'pkg_id'      => $data['packageId'] ?? '',
                'pkg_name'    => $data['packageName'] ?? '',
                'cycle'       => $data['billingCycle'] ?? 'monthly',
                'price'       => (float)($data['pricePerCycle'] ?? 0),
                'mrr'         => (float)($data['mrrContribution'] ?? 0),
                'status'      => $data['status'] ?? 'active',
                'seats_used'  => (int)($data['userSeatsUsed'] ?? 1),
                'seats_limit' => (int)($data['userSeatsLimit'] ?? 10),
                'lots_used'   => (int)($data['lotsQuotaUsed'] ?? 0),
                'lots_limit'  => (string)($data['lotsQuotaLimit'] ?? 'Unlimited'),
                'start'       => $data['startDate'] ?? date('Y-m-d'),
                'renewal'     => $data['renewalDate'] ?? date('Y-m-d', strtotime('+30 days')),
                'auto_renew'  => !empty($data['autoRenew']) ? 1 : 0,
                'notes'       => $data['notes'] ?? '',
            ]);

            sendResponse([
                'success' => true,
                'message' => "Data langganan {$subId} berhasil disimpan",
            ]);
        } catch (Exception $e) {
            sendError('Gagal memperbarui langganan: ' . $e->getMessage(), 500);
        }
    }
}

sendError('Action atau metode tidak didukung', 400);
