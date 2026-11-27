<?php
/**
 * CircularCoffee - Midtrans Webhook / HTTP Notification Handler
 * Endpoint: POST /api/midtrans_webhook.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/midtrans_config.php';
require_once __DIR__ . '/mailer.php';

$pdo = getDbConnection();
$rawInput = file_get_contents('php://input');
$notification = json_decode($rawInput, true);

if (!$notification || empty($notification['order_id'])) {
    sendError('Payload notifikasi Midtrans tidak valid.', 400);
}

$orderId = trim($notification['order_id']);
$statusCode = trim($notification['status_code'] ?? '');
$grossAmount = trim($notification['gross_amount'] ?? '');
$signatureKey = trim($notification['signature_key'] ?? '');
$transactionStatus = trim($notification['transaction_status'] ?? '');
$fraudStatus = trim($notification['fraud_status'] ?? '');
$paymentType = trim($notification['payment_type'] ?? 'unknown');

$serverKey = MIDTRANS_SERVER_KEY;
$hasRealKey = (!empty($serverKey) && $serverKey !== 'SB-Mid-server-YOUR_SERVER_KEY_HERE');

// 1. Signature Verification jika Server Key terpasang
if ($hasRealKey && $signatureKey) {
    $expectedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);
    if ($expectedSignature !== $signatureKey) {
        error_log("Midtrans Webhook: Signature mismatch untuk order {$orderId}");
        sendError('Signature key Midtrans tidak valid.', 403);
    }
}

// 2. Evaluasi Status Transaksi Midtrans
$subscriptionStatus = 'pending_payment';
$isSuccess = false;

if ($transactionStatus === 'capture') {
    if ($fraudStatus === 'challenge') {
        $subscriptionStatus = 'pending_payment';
    } else if ($fraudStatus === 'accept') {
        $subscriptionStatus = 'active';
        $isSuccess = true;
    }
} else if ($transactionStatus === 'settlement') {
    $subscriptionStatus = 'active';
    $isSuccess = true;
} else if ($transactionStatus === 'pending') {
    $subscriptionStatus = 'pending_payment';
} else if (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
    $subscriptionStatus = 'expired';
}

// 3. Ambil data transaksi dari subscriptions
$stmt = $pdo->prepare("SELECT * FROM `subscriptions` WHERE `order_id` = :order_id LIMIT 1");
$stmt->execute(['order_id' => $orderId]);
$subRecord = $stmt->fetch();

$billingCycle = $subRecord['billing_cycle'] ?? 'monthly';
$interval = ($billingCycle === 'yearly') ? '+1 year' : '+1 month';
$expiresAt = date('Y-m-d H:i:s', strtotime($interval));
$now = date('Y-m-d H:i:s');

// 4. Update Tabel Subscriptions
try {
    $upStmt = $pdo->prepare("UPDATE `subscriptions` SET 
        `transaction_status` = :tx_status,
        `payment_type` = :ptype,
        `midtrans_response` = :raw,
        `paid_at` = CASE WHEN :is_success = 1 THEN :now ELSE `paid_at` END,
        `expires_at` = CASE WHEN :is_success = 1 THEN :expires ELSE `expires_at` END
        WHERE `order_id` = :order_id");
    
    $upStmt->execute([
        'tx_status'   => $transactionStatus,
        'ptype'       => $paymentType,
        'raw'         => $rawInput,
        'is_success'  => $isSuccess ? 1 : 0,
        'now'         => $now,
        'expires'     => $expiresAt,
        'order_id'    => $orderId
    ]);

    // 5. Update Status User di Database
    $userId = $subRecord['user_id'] ?? null;
    $userEmail = $subRecord['user_email'] ?? null;

    if ($userId || $userEmail) {
        $upUser = $pdo->prepare("UPDATE `users` SET 
            `subscription_status` = :sub_status,
            `subscription_expires_at` = CASE WHEN :is_success = 1 THEN :expires ELSE `subscription_expires_at` END,
            `last_payment_order_id` = :order_id,
            `last_payment_date` = CASE WHEN :is_success = 1 THEN :now ELSE `last_payment_date` END
            WHERE `id` = :uid OR `email` = :email");
        
        $upUser->execute([
            'sub_status' => $subscriptionStatus,
            'is_success' => $isSuccess ? 1 : 0,
            'expires'    => $expiresAt,
            'order_id'   => $orderId,
            'now'        => $now,
            'uid'        => $userId,
            'email'      => $userEmail
        ]);
    }

    // 6. Jika sukses, kirim email konfirmasi pembayaran
    if ($isSuccess && $userEmail) {
        $planName = $subRecord['plan_name'] ?? 'Paket Layanan CircularCoffee';
        $formattedAmount = 'Rp ' . number_format((int)($subRecord['gross_amount'] ?? $grossAmount), 0, ',', '.');
        
        $emailSubject = "[CircularCoffee] Pembayaran Berhasil: {$planName}";
        $emailBody = "
            <div style='font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FAF7F2; border-radius: 16px;'>
                <div style='background: #07130C; padding: 24px; border-radius: 12px; text-align: center; color: white;'>
                    <h2 style='color: #F59E0B; margin: 0;'>CircularCoffee Ecosystem</h2>
                    <p style='color: #9CA3AF; margin: 4px 0 0 0; font-size: 13px;'>Konfirmasi Pembayaran Midtrans Sandbox</p>
                </div>
                <div style='background: white; padding: 24px; border-radius: 12px; margin-top: 16px; border: 1px solid #E6DFD5;'>
                    <h3 style='color: #10B981; margin-top: 0;'>Pembayaran Berhasil Diverifikasi!</h3>
                    <p style='color: #4B5563; font-size: 14px;'>Akun layanan Anda telah resmi aktif. Berikut rincian transaksi Anda:</p>
                    <table style='width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0;'>
                        <tr style='border-bottom: 1px solid #E5E7EB;'>
                            <td style='padding: 8px 0; color: #6B7280;'>Order ID:</td>
                            <td style='padding: 8px 0; font-weight: bold; text-align: right;'>{$orderId}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #E5E7EB;'>
                            <td style='padding: 8px 0; color: #6B7280;'>Layanan:</td>
                            <td style='padding: 8px 0; font-weight: bold; text-align: right;'>{$planName}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #E5E7EB;'>
                            <td style='padding: 8px 0; color: #6B7280;'>Metode Bayar:</td>
                            <td style='padding: 8px 0; font-weight: bold; text-align: right; text-transform: uppercase;'>{$paymentType}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #E5E7EB;'>
                            <td style='padding: 8px 0; color: #6B7280;'>Nominal:</td>
                            <td style='padding: 8px 0; font-weight: bold; color: #059669; text-align: right;'>{$formattedAmount}</td>
                        </tr>
                        <tr>
                            <td style='padding: 8px 0; color: #6B7280;'>Masa Aktif Sampai:</td>
                            <td style='padding: 8px 0; font-weight: bold; text-align: right;'>{$expiresAt}</td>
                        </tr>
                    </table>
                    <div style='text-align: center; margin-top: 24px;'>
                        <a href='https://circularcoffee.circulartrace.id/admin/overview' style='display: inline-block; background: #059669; color: white; padding: 12px 24px; border-radius: 10px; font-weight: bold; text-decoration: none; font-size: 14px;'>Buka Panel Operasional</a>
                    </div>
                </div>
            </div>
        ";
        @sendRawEmail($userEmail, $emailSubject, $emailBody);
    }
} catch (Exception $e) {
    error_log("Midtrans Webhook Error: " . $e->getMessage());
}

sendResponse([
    'status'    => 'ok',
    'orderId'   => $orderId,
    'newStatus' => $subscriptionStatus,
    'message'   => 'Notifikasi webhook Midtrans berhasil diproses.'
]);
