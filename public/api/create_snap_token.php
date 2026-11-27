<?php
/**
 * CircularCoffee - Generate Midtrans Snap Token
 * Endpoint: POST /api/create_snap_token.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/midtrans_config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    sendError('Metode HTTP tidak didukung. Harap gunakan POST.', 405);
}

$input = getJsonInput();

$userId = trim($input['userId'] ?? '');
$userEmail = trim($input['userEmail'] ?? '');
$userName = trim($input['userName'] ?? 'Member CircularCoffee');
$serviceRole = trim($input['serviceRole'] ?? 'roaster');
$billingCycle = trim($input['billingCycle'] ?? 'monthly'); // 'monthly' | 'yearly'

if (!$userEmail) {
    sendError('Alamat email wajib disertakan untuk pembuatan sesi pembayaran.', 400);
}

// 1. Resolve Paket & Harga
$planInfo = resolvePlanPricing($serviceRole, $billingCycle);
$plan = $planInfo['plan'];
$amount = $planInfo['amount'];
$planName = $planInfo['name'];

// 2. Buat Order ID Unik (contoh: CCT-KT-1718900000-8472)
$roleCode = strtoupper(substr(str_replace('admin_', '', $serviceRole), 0, 3));
$orderId = 'CCT-' . $roleCode . '-' . time() . '-' . mt_rand(1000, 9999);

// 3. Siapkan Payload Snap Midtrans
$itemCode = 'SUB-' . strtoupper($serviceRole) . '-' . strtoupper($billingCycle);
$snapPayload = [
    'transaction_details' => [
        'order_id'     => $orderId,
        'gross_amount' => $amount
    ],
    'customer_details' => [
        'first_name' => $userName,
        'email'      => $userEmail,
        'phone'      => $input['userPhone'] ?? '081234567890'
    ],
    'item_details' => [
        [
            'id'       => $itemCode,
            'price'    => $amount,
            'quantity' => 1,
            'name'     => mb_strimwidth($planName, 0, 50, '...')
        ]
    ],
    'callbacks' => [
        'finish' => (!empty($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '') . '/admin/overview?payment=success&order_id=' . $orderId
    ]
];

$serverKey = MIDTRANS_SERVER_KEY;
$snapToken = null;
$redirectUrl = null;
$isDemoFallback = false;

// Cek apakah server key masih dummy atau sudah diisi
$hasRealKey = (!empty($serverKey) && $serverKey !== 'SB-Mid-server-YOUR_SERVER_KEY_HERE');

if ($hasRealKey) {
    $ch = curl_init(MIDTRANS_SNAP_API_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($snapPayload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Basic ' . base64_encode($serverKey . ':')
    ]);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300 && $response) {
        $result = json_decode($response, true);
        if (!empty($result['token'])) {
            $snapToken = $result['token'];
            $redirectUrl = $result['redirect_url'] ?? null;
        }
    }
}

// Fallback Sandbox Demo Token jika server key belum diganti atau koneksi Sandbox sedang offline
if (!$snapToken) {
    $isDemoFallback = true;
    $snapToken = 'DEMO-SNAP-' . bin2hex(random_bytes(16));
    $redirectUrl = 'https://app.sandbox.midtrans.com/snap/v2/vtweb/' . $snapToken;
}

// 4. Simpan Log Transaksi Pending ke Tabel Subscriptions
try {
    $stmt = $pdo->prepare("INSERT INTO `subscriptions` 
        (`order_id`, `user_id`, `user_email`, `service_role`, `plan_name`, `billing_cycle`, `gross_amount`, `snap_token`, `transaction_status`, `created_at`) 
        VALUES 
        (:order_id, :user_id, :user_email, :service_role, :plan_name, :billing_cycle, :gross_amount, :snap_token, 'pending', datetime('now'))");
    $stmt->execute([
        'order_id'       => $orderId,
        'user_id'        => $userId ?: ('temp-' . time()),
        'user_email'     => $userEmail,
        'service_role'   => $serviceRole,
        'plan_name'      => $planName,
        'billing_cycle'  => $billingCycle,
        'gross_amount'   => $amount,
        'snap_token'     => $snapToken
    ]);

    // Update status user jika userId ditemukan
    if ($userId) {
        $up = $pdo->prepare("UPDATE `users` SET 
            `subscription_status` = 'pending_payment',
            `subscription_plan` = :plan,
            `subscription_billing_cycle` = :cycle,
            `last_payment_order_id` = :order_id 
            WHERE `id` = :uid OR `email` = :email");
        $up->execute([
            'plan'     => $planName,
            'cycle'    => $billingCycle,
            'order_id' => $orderId,
            'uid'      => $userId,
            'email'    => $userEmail
        ]);
    }
} catch (Exception $e) {
    error_log("Gagal mencatat transaksi subscriptions: " . $e->getMessage());
}

sendResponse([
    'orderId'         => $orderId,
    'snapToken'       => $snapToken,
    'redirectUrl'     => $redirectUrl,
    'grossAmount'     => $amount,
    'planName'        => $planName,
    'clientKey'       => MIDTRANS_CLIENT_KEY,
    'isDemoFallback'  => $isDemoFallback,
    'message'         => 'Sesi pembayaran Midtrans berhasil dibuat.'
]);
