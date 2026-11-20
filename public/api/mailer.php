<?php
/**
 * Circular Coffee Trace (CircularCoffee)
 * System Mailer Utility (cPanel SMTP / PHP mail() / Dev Simulation Fallback)
 */

function sendSystemEmail($to, $subject, $htmlBody, $plainText = '') {
    $fromEmail = getenv('SMTP_FROM_EMAIL') ?: 'noreply@circulartrace.id';
    $fromName  = getenv('SMTP_FROM_NAME') ?: 'Circular Coffee Trace Platform';

    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . $fromName . ' <' . $fromEmail . '>',
        'Reply-To: ' . $fromEmail,
        'X-Mailer: PHP/' . phpversion()
    ];

    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'to'        => $to,
        'subject'   => $subject,
        'body'      => $htmlBody,
        'plain'     => $plainText,
    ];

    // Always log to local file for dev simulation / audit
    $logDir = dirname(__DIR__) . '/data';
    if (!file_exists($logDir)) {
        @mkdir($logDir, 0755, true);
    }
    $logFile = $logDir . '/mail_log.json';
    $existing = [];
    if (file_exists($logFile)) {
        $existing = json_decode(file_get_contents($logFile), true) ?: [];
    }
    array_unshift($existing, $logEntry);
    if (count($existing) > 50) {
        $existing = array_slice($existing, 0, 50);
    }
    @file_put_contents($logFile, json_encode($existing, JSON_PRETTY_PRINT));

    // Try PHP mail() if available
    $mailSent = false;
    if (function_exists('mail') && !empty($to)) {
        try {
            $mailSent = @mail($to, $subject, $htmlBody, implode("\r\n", $headers));
        } catch (Exception $e) {
            $mailSent = false;
        }
    }

    return [
        'success'   => true,
        'delivered' => $mailSent,
        'simulated' => !$mailSent,
        'message'   => $mailSent ? 'Email terkirim melalui SMTP' : 'Email dicatat dalam log simulasi sistem'
    ];
}
