<?php
/**
 * CircularCoffee - Payment & Subscription Status Checker / Sandbox Simulator
 * Endpoint:
 *   GET  /api/payment_status.php?order_id=... | ?user_id=... | ?email=...
 *   POST /api/payment_status.php?action=simulate_sandbox_payment
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/midtrans_config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// 1. GET: Cek status langganan
if ($method === 'GET') {
    $orderId = trim($_GET['order_id'] ?? '');
    $userId = trim($_GET['user_id'] ?? '');
    $email = trim($_GET['email'] ?? '');

    if (!$orderId && !$userId && !$email) {
        sendError('Parameter order_id, user_id, atau email wajib disertakan.', 400);
    }

    $sub = null;
    if ($orderId) {
        $stmt = $pdo->prepare("SELECT * FROM `subscriptions` WHERE `order_id` = :oid LIMIT 1");
        $stmt->execute(['oid' => $orderId]);
        $sub = $stmt->fetch();
    }

    $user = null;
    if ($userId || $email || ($sub && !empty($sub['user_id']))) {
        $lookupId = $userId ?: ($sub['user_id'] ?? '');
        $lookupEmail = $email ?: ($sub['user_email'] ?? '');
        $uStmt = $pdo->prepare("SELECT `id`, `name`, `email`, `role`, `subscription_status`, `subscription_plan`, `subscription_billing_cycle`, `subscription_expires_at`, `last_payment_order_id`, `last_payment_date` FROM `users` WHERE `id` = :uid OR `email` = :uemail LIMIT 1");
        $uStmt->execute(['uid' => $lookupId, 'uemail' => $lookupEmail]);
        $user = $uStmt->fetch();
    }

    sendResponse([
        'subscription' => $sub,
        'user'         => $user,
        'isActive'     => ($user && $user['subscription_status'] === 'active') || ($sub && $sub['transaction_status'] === 'settlement')
    ]);
}

// 2. POST: Simulasi Pembayaran Sandbox (Sangat berguna untuk demo & testing lokal tanpa webhook tunnel)
if ($method === 'POST' && $action === 'simulate_sandbox_payment') {
    $input = getJsonInput();
    $orderId = trim($input['order_id'] ?? '');
    $userId = trim($input['user_id'] ?? '');
    $email = trim($input['email'] ?? '');

    if (!$orderId && !$userId && !$email) {
        sendError('Parameter order_id, user_id, atau email wajib disertakan.', 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM `subscriptions` WHERE `order_id` = :oid OR `user_id` = :uid OR `user_email` = :email ORDER BY `created_at` DESC LIMIT 1");
    $stmt->execute(['oid' => $orderId, 'uid' => $userId, 'email' => $email]);
    $sub = $stmt->fetch();

    $now = date('Y-m-d H:i:s');
    $billingCycle = $sub['billing_cycle'] ?? 'monthly';
    $expiresAt = date('Y-m-d H:i:s', strtotime($billingCycle === 'yearly' ? '+1 year' : '+1 month'));

    if ($sub) {
        $upSub = $pdo->prepare("UPDATE `subscriptions` SET 
            `transaction_status` = 'settlement',
            `payment_type` = 'sandbox_qris_simulation',
            `paid_at` = :now,
            `expires_at` = :expires
            WHERE `id` = :id");
        $upSub->execute(['now' => $now, 'expires' => $expiresAt, 'id' => $sub['id']]);
    }

    $targetEmail = $email ?: ($sub['user_email'] ?? '');
    $targetId = $userId ?: ($sub['user_id'] ?? '');

    if ($targetEmail || $targetId) {
        $upUser = $pdo->prepare("UPDATE `users` SET 
            `subscription_status` = 'active',
            `subscription_expires_at` = :expires,
            `last_payment_order_id` = :oid,
            `last_payment_date` = :now
            WHERE `id` = :uid OR `email` = :email");
        $upUser->execute([
            'expires' => $expiresAt,
            'oid'     => $orderId ?: ($sub['order_id'] ?? ('DEMO-' . time())),
            'now'     => $now,
            'uid'     => $targetId,
            'email'   => $targetEmail
        ]);
    }

    sendResponse([
        'success'   => true,
        'status'    => 'active',
        'message'   => 'Simulasi pembayaran Sandbox berhasil diselesaikan! Akun kini aktif.'
    ]);
}
