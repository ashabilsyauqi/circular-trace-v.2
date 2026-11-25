<?php
/**
 * Circular Coffee Trace (CircularCoffee)
 * Alat Uji Diagnostik Koneksi SMTP cPanel
 * 
 * Penggunaan:
 * 1. CLI: php public/api/test_smtp.php recipient@example.com
 * 2. HTTP: GET /api/test_smtp.php?to=recipient@example.com
 */

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/mailer.php';

// Ambil alamat email tujuan
$to = $_GET['to'] ?? ($argv[1] ?? '');

$config = getSmtpConfig();
$maskedPass = empty($config['pass']) ? '(KOSONG - Belum diisi)' : str_repeat('*', strlen($config['pass']));

if (empty($to)) {
    echo json_encode([
        'status'  => 'ready_for_test',
        'message' => 'Parameter email tujuan (?to=email@domain.com) belum diberikan.',
        'current_configuration' => [
            'host'        => $config['host'],
            'port'        => $config['port'],
            'secure'      => $config['secure'],
            'user'        => $config['user'],
            'pass_status' => $maskedPass,
            'from_email'  => $config['from_email'],
            'from_name'   => $config['from_name'],
            'timeout'     => $config['timeout'] . ' detik',
        ],
        'usage_instruction' => 'Silakan jalankan pengujian dengan menambahkan parameter to: GET /api/test_smtp.php?to=email_anda@gmail.com atau php public/api/test_smtp.php email_anda@gmail.com'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

$subject = 'Uji Coba Pengiriman SMTP cPanel - Circular Coffee Trace (' . date('Y-m-d H:i:s') . ')';
$htmlBody = "
<div style='font-family:sans-serif;padding:24px;background:#FAF7F2;color:#292524;'>
    <div style='max-width:540px;margin:auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #E7E5E4;'>
        <h2 style='color:#B45309;margin-top:0;'>✅ Uji Coba SMTP cPanel Berhasil!</h2>
        <p>Email ini dikirim langsung dari server backend <strong>Circular Coffee Trace</strong> menggunakan koneksi native socket SMTP cPanel resmi.</p>
        <table style='width:100%;font-size:13px;border-collapse:collapse;margin:20px 0;'>
            <tr><td style='padding:6px 0;color:#78716C;'>Host SMTP:</td><td style='font-weight:bold;'>{$config['host']}</td></tr>
            <tr><td style='padding:6px 0;color:#78716C;'>Port / Enkripsi:</td><td style='font-weight:bold;'>{$config['port']} ({$config['secure']})</td></tr>
            <tr><td style='padding:6px 0;color:#78716C;'>Akun Pengirim:</td><td style='font-weight:bold;'>{$config['user']}</td></tr>
            <tr><td style='padding:6px 0;color:#78716C;'>Waktu Pengujian:</td><td style='font-weight:bold;'>" . date('d M Y H:i:s') . "</td></tr>
        </table>
        <p style='font-size:12px;color:#A8A29E;margin-bottom:0;'>Jika email ini masuk ke inbox Anda, konfigurasi pengiriman email verifikasi dan OTP akun telah 100% aktif dan siap digunakan secara langsung.</p>
    </div>
</div>";

$debugLog = [];
$startTime = microtime(true);
$isDelivered = sendNativeSmtpEmail($to, $subject, $htmlBody, "Uji coba pengiriman SMTP cPanel berhasil pada " . date('Y-m-d H:i:s'), $debugLog);
$durationMs = round((microtime(true) - $startTime) * 1000, 2);

echo json_encode([
    'success'      => $isDelivered,
    'delivered'    => $isDelivered,
    'recipient'    => $to,
    'provider'     => 'cpanel_smtp',
    'duration'     => "{$durationMs} ms",
    'smtp_server'  => "{$config['host']}:{$config['port']} ({$config['secure']})",
    'sender'       => "{$config['from_name']} <{$config['from_email']}>",
    'debug_trace'  => $debugLog,
    'message'      => $isDelivered
        ? 'Email uji coba BERHASIL terkirim via SMTP cPanel ke ' . $to
        : 'Pengiriman SMTP gagal. Periksa debug_trace di atas untuk melihat respons server cPanel.'
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
