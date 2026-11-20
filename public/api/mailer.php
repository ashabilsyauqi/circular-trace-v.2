<?php
/**
 * Circular Coffee Trace (CircularCoffee)
 * System Mailer Utility (Resend API / Brevo API / cPanel mail() / Dev Simulation Fallback)
 */

function sendSystemEmail($to, $subject, $htmlBody, $plainText = '') {
    $fromEmail = getenv('SMTP_FROM_EMAIL') ?: 'noreply@circulartrace.id';
    $fromName  = getenv('SMTP_FROM_NAME') ?: 'Circular Coffee Trace Platform';
    $resendKey = getenv('RESEND_API_KEY') ?: '';
    $brevoKey  = getenv('BREVO_API_KEY') ?: '';

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
        $existing = json_decode(@file_get_contents($logFile), true) ?: [];
    }
    array_unshift($existing, $logEntry);
    if (count($existing) > 50) {
        $existing = array_slice($existing, 0, 50);
    }
    @file_put_contents($logFile, json_encode($existing, JSON_PRETTY_PRINT));

    $mailSent = false;
    $provider = 'simulated';

    // 1. Try Resend API if key is present
    if (!empty($resendKey)) {
        try {
            $payload = json_encode([
                'from'    => "{$fromName} <{$fromEmail}>",
                'to'      => [$to],
                'subject' => $subject,
                'html'    => $htmlBody,
                'text'    => $plainText ?: strip_tags($htmlBody)
            ]);
            $opts = [
                'http' => [
                    'method'  => 'POST',
                    'header'  => "Authorization: Bearer {$resendKey}\r\nContent-Type: application/json\r\n",
                    'content' => $payload,
                    'timeout' => 5
                ]
            ];
            $ctx = stream_context_create($opts);
            $res = @file_get_contents('https://api.resend.com/emails', false, $ctx);
            if ($res !== false) {
                $mailSent = true;
                $provider = 'resend';
            }
        } catch (Exception $e) {
            $mailSent = false;
        }
    }

    // 2. Try Brevo API if key is present
    if (!$mailSent && !empty($brevoKey)) {
        try {
            $payload = json_encode([
                'sender'      => ['name' => $fromName, 'email' => $fromEmail],
                'to'          => [['email' => $to]],
                'subject'     => $subject,
                'htmlContent' => $htmlBody,
                'textContent' => $plainText ?: strip_tags($htmlBody)
            ]);
            $opts = [
                'http' => [
                    'method'  => 'POST',
                    'header'  => "api-key: {$brevoKey}\r\nContent-Type: application/json\r\n",
                    'content' => $payload,
                    'timeout' => 5
                ]
            ];
            $ctx = stream_context_create($opts);
            $res = @file_get_contents('https://api.brevo.com/v3/smtp/email', false, $ctx);
            if ($res !== false) {
                $mailSent = true;
                $provider = 'brevo';
            }
        } catch (Exception $e) {
            $mailSent = false;
        }
    }

    // 3. Fallback to PHP native mail() (e.g. cPanel Exim / Sendmail)
    if (!$mailSent && function_exists('mail') && !empty($to)) {
        try {
            $mailSent = @mail($to, $subject, $htmlBody, implode("\r\n", $headers));
            if ($mailSent) $provider = 'php_mail';
        } catch (Exception $e) {
            $mailSent = false;
        }
    }

    return [
        'success'   => true,
        'delivered' => $mailSent,
        'provider'  => $provider,
        'simulated' => !$mailSent,
        'message'   => $mailSent ? "Email terkirim melalui {$provider}" : 'Email dicatat dalam log simulasi sistem'
    ];
}

function sendVerificationEmail($to, $name, $token, $verificationLink) {
    $subject = "Verifikasi Alamat Email Anda - Circular Coffee Trace";
    $safeName = htmlspecialchars($name ?: 'Mitra Kopi');
    $safeLink = htmlspecialchars($verificationLink);

    $htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verifikasi Akun Circular Coffee Trace</title>
</head>
<body style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#FAF7F2;margin:0;padding:24px;color:#292524;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.06);border:1px solid #E7E5E4;">
          <!-- Header -->
          <tr>
            <td style="background:#1C120C;padding:36px 32px;text-align:center;">
              <span style="display:inline-block;background:rgba(217,119,6,0.2);color:#F59E0B;border:1px solid rgba(245,158,11,0.3);padding:4px 14px;border-radius:20px;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">
                Circular Coffee Trace Platform
              </span>
              <h1 style="color:#ffffff;font-size:24px;margin:8px 0 0;font-weight:900;letter-spacing:-0.5px;">
                Aktivasi Akun &amp; Verifikasi Email
              </h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:36px 32px;">
              <p style="font-size:16px;line-height:24px;margin-top:0;">Halo <strong>{$safeName}</strong>,</p>
              <p style="font-size:14px;line-height:22px;color:#57534E;">
                Terima kasih telah mendaftar di ekosistem rantai pasok kopi sirkular digital <strong>Circular Coffee Trace</strong>. Untuk mengaktifkan akun dan memastikan keamanan akses ke panel operasional Anda, silakan verifikasi alamat email Anda.
              </p>

              <!-- CTA Button -->
              <div style="text-align:center;margin:32px 0;">
                <a href="{$safeLink}" style="display:inline-block;background:linear-gradient(135deg, #D97706, #B45309);color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 32px;border-radius:14px;box-shadow:0 6px 16px rgba(217,119,6,0.35);">
                  Verifikasi Akun Saya Sekarang &rarr;
                </a>
              </div>

              <!-- Direct URL Fallback -->
              <div style="background:#F5F5F4;border-radius:12px;padding:16px;border:1px solid #E7E5E4;margin-bottom:24px;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:bold;color:#78716C;">Atau salin dan buka tautan ini di browser Anda:</p>
                <a href="{$safeLink}" style="color:#D97706;word-break:break-all;font-size:12px;text-decoration:none;">
                  {$safeLink}
                </a>
              </div>

              <!-- Note -->
              <div style="border-left:3px solid #D97706;padding-left:12px;margin-bottom:24px;">
                <p style="margin:0;font-size:12px;color:#78716C;line-height:18px;">
                  ⏱️ <strong>Masa Berlaku:</strong> Tautan verifikasi ini berlaku selama <strong>24 jam</strong>. Setelah diverifikasi, Anda dapat langsung masuk (*auto-login*) ke dashboard panel bisnis Anda.
                </p>
              </div>

              <p style="font-size:12px;color:#A8A29E;margin-bottom:0;line-height:18px;">
                Jika Anda tidak merasa mendaftar di Circular Coffee Trace, Anda dapat mengabaikan email ini dengan aman.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#FAF7F2;border-top:1px solid #E7E5E4;padding:20px 32px;text-align:center;font-size:11px;color:#A8A29E;">
              &copy; 2026 Circular Coffee Trace (CircularTrace Ecosystem). Hak Cipta Dilindungi.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

    return sendSystemEmail($to, $subject, $htmlBody, "Buka tautan ini untuk verifikasi akun Anda: {$verificationLink}");
}

