<?php
/**
 * Circular Coffee Trace (CircularCoffee)
 * System Mailer Utility
 * Supports:
 * 1. cPanel / Hostinger Native Socket SMTP (Port 465 SSL & Port 587 TLS) - Zero external dependencies!
 * 2. Resend API (HTTP REST)
 * 3. Brevo API (HTTP REST)
 * 4. PHP Native mail() (Exim / Sendmail)
 * 5. Local Dev Simulation Logging (data/mail_log.json)
 */

function getSmtpConfig() {
    $configFile = __DIR__ . '/smtp_config.php';
    $config = [
        'enabled'    => true,
        'host'       => 'mail.circulartrace.id',
        'port'       => 465,
        'secure'     => 'ssl',
        'user'       => 'noreply@circulartrace.id',
        'pass'       => '',
        'from_email' => 'noreply@circulartrace.id',
        'from_name'  => 'Circular Coffee Trace',
        'timeout'    => 5,
    ];

    if (file_exists($configFile)) {
        $loaded = include $configFile;
        if (is_array($loaded)) {
            $config = array_merge($config, $loaded);
        }
    }

    // Allow environment variable overrides
    if (getenv('SMTP_HOST'))       $config['host']       = getenv('SMTP_HOST');
    if (getenv('SMTP_PORT'))       $config['port']       = (int)getenv('SMTP_PORT');
    if (getenv('SMTP_SECURE'))     $config['secure']     = getenv('SMTP_SECURE');
    if (getenv('SMTP_USER'))       $config['user']       = getenv('SMTP_USER');
    if (getenv('SMTP_PASS'))       $config['pass']       = getenv('SMTP_PASS');
    if (getenv('SMTP_FROM_EMAIL')) $config['from_email'] = getenv('SMTP_FROM_EMAIL');
    if (getenv('SMTP_FROM_NAME'))  $config['from_name']  = getenv('SMTP_FROM_NAME');

    return $config;
}

/**
 * Send email using RFC 5321 native PHP socket SMTP (cPanel Exim / Postfix / Sendmail compatible)
 */
function sendNativeSmtpEmail($to, $subject, $htmlBody, $plainText = '', &$debugLog = []) {
    $cfg = getSmtpConfig();
    $debug = function($msg) use (&$debugLog) {
        $debugLog[] = date('H:i:s') . ' ' . $msg;
    };

    if (empty($cfg['host']) || empty($cfg['user']) || empty($cfg['pass'])) {
        $debug("SMTP dilewati: Host, User, atau Password belum diisi.");
        return false;
    }

    $host    = $cfg['host'];
    $port    = (int)($cfg['port'] ?: 465);
    $user    = $cfg['user'];
    $pass    = $cfg['pass'];
    $secure  = strtolower($cfg['secure'] ?: ($port === 465 ? 'ssl' : 'tls'));
    $timeout = (int)($cfg['timeout'] ?: 5);
    $fromEmail = $cfg['from_email'] ?: $user;
    $fromName  = $cfg['from_name'] ?: 'Circular Coffee Trace';

    $socketAddress = ($secure === 'ssl' ? "ssl://{$host}:{$port}" : "tcp://{$host}:{$port}");
    $debug("Menghubungkan ke {$socketAddress} (Timeout {$timeout}s)...");

    $context = stream_context_create([
        'ssl' => [
            'verify_peer'       => false,
            'verify_peer_name'  => false,
            'allow_self_signed' => true,
        ]
    ]);

    $errno = 0;
    $errstr = '';
    $socket = @stream_socket_client($socketAddress, $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        $debug("Koneksi gagal ke {$socketAddress}: {$errstr} (Kode: {$errno})");
        return false;
    }

    stream_set_timeout($socket, $timeout);

    $getResponse = function() use ($socket, $debug) {
        $response = '';
        while (!feof($socket)) {
            $line = fgets($socket, 512);
            if ($line === false) break;
            $response .= $line;
            if (substr($line, 3, 1) === ' ') break;
        }
        $debug("S: " . trim($response));
        return $response;
    };

    $sendCommand = function($cmd, $mask = false) use ($socket, $debug) {
        $debug("C: " . ($mask ? '******' : trim($cmd)));
        fwrite($socket, $cmd . "\r\n");
    };

    // 1. Initial Greeting
    $greeting = $getResponse();
    if (substr($greeting, 0, 3) !== '220') {
        $debug("Error greeting SMTP: {$greeting}");
        fclose($socket);
        return false;
    }

    // 2. EHLO Handshake
    $clientHost = (isset($_SERVER['SERVER_NAME']) && !empty($_SERVER['SERVER_NAME'])) ? $_SERVER['SERVER_NAME'] : 'circulartrace.id';
    $sendCommand("EHLO {$clientHost}");
    $ehloRes = $getResponse();

    // 3. STARTTLS if TLS on Port 587
    if ($secure === 'tls') {
        $sendCommand("STARTTLS");
        $tlsRes = $getResponse();
        if (substr($tlsRes, 0, 3) !== '220') {
            $debug("STARTTLS ditolak server: {$tlsRes}");
            fclose($socket);
            return false;
        }
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            $debug("Handshake TLS crypto gagal.");
            fclose($socket);
            return false;
        }
        $sendCommand("EHLO {$clientHost}");
        $getResponse();
    }

    // 4. AUTH LOGIN
    $sendCommand("AUTH LOGIN");
    $authRes = $getResponse();
    if (substr($authRes, 0, 3) !== '334') {
        $debug("AUTH LOGIN ditolak: {$authRes}");
        fclose($socket);
        return false;
    }

    // 5. Send Username (Base64)
    $sendCommand(base64_encode($user));
    $userRes = $getResponse();
    if (substr($userRes, 0, 3) !== '334') {
        $debug("Username SMTP ditolak: {$userRes}");
        fclose($socket);
        return false;
    }

    // 6. Send Password (Base64)
    $sendCommand(base64_encode($pass), true);
    $passRes = $getResponse();
    if (substr($passRes, 0, 3) !== '235') {
        $debug("Autentikasi gagal! Password email cPanel salah atau ditolak: {$passRes}");
        fclose($socket);
        return false;
    }

    // 7. MAIL FROM
    $sendCommand("MAIL FROM:<{$fromEmail}>");
    $mailFromRes = $getResponse();
    if (substr($mailFromRes, 0, 3) !== '250') {
        $debug("MAIL FROM ditolak: {$mailFromRes}");
        fclose($socket);
        return false;
    }

    // 8. RCPT TO
    $sendCommand("RCPT TO:<{$to}>");
    $rcptRes = $getResponse();
    if (substr($rcptRes, 0, 3) !== '250' && substr($rcptRes, 0, 3) !== '251') {
        $debug("RCPT TO ditolak: {$rcptRes}");
        fclose($socket);
        return false;
    }

    // 9. DATA
    $sendCommand("DATA");
    $dataRes = $getResponse();
    if (substr($dataRes, 0, 3) !== '354') {
        $debug("DATA command ditolak: {$dataRes}");
        fclose($socket);
        return false;
    }

    // 10. Construct MIME Multipart Email
    $boundary = "----=_Part_" . md5(uniqid(time(), true));
    $encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
    $dateStr = date('r');
    $msgId = "<" . time() . "." . uniqid() . "@{$clientHost}>";

    $message = "Date: {$dateStr}\r\n";
    $message .= "From: {$fromName} <{$fromEmail}>\r\n";
    $message .= "To: <{$to}>\r\n";
    $message .= "Subject: {$encodedSubject}\r\n";
    $message .= "Message-ID: {$msgId}\r\n";
    $message .= "MIME-Version: 1.0\r\n";
    $message .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";
    $message .= "X-Mailer: CircularCoffee-cPanel-SMTP/2.0\r\n\r\n";

    // Plain text part
    $plainBody = !empty($plainText) ? $plainText : strip_tags($htmlBody);
    $message .= "--{$boundary}\r\n";
    $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $message .= chunk_split(base64_encode($plainBody)) . "\r\n";

    // HTML part
    $message .= "--{$boundary}\r\n";
    $message .= "Content-Type: text/html; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $message .= chunk_split(base64_encode($htmlBody)) . "\r\n";

    $message .= "--{$boundary}--\r\n";
    $message .= "\r\n.";

    $sendCommand($message);
    $sendRes = $getResponse();

    // 11. QUIT
    $sendCommand("QUIT");
    $getResponse();
    fclose($socket);

    if (substr($sendRes, 0, 3) === '250') {
        $debug("Email berhasil diterima antrean pengiriman SMTP cPanel!");
        return true;
    } else {
        $debug("Email ditolak oleh SMTP cPanel: {$sendRes}");
        return false;
    }
}

function sendSystemEmail($to, $subject, $htmlBody, $plainText = '') {
    $smtpCfg   = getSmtpConfig();
    $fromEmail = $smtpCfg['from_email'];
    $fromName  = $smtpCfg['from_name'];
    $resendKey = getenv('RESEND_API_KEY') ?: '';
    $brevoKey  = getenv('BREVO_API_KEY') ?: '';

    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . $fromName . ' <' . $fromEmail . '>',
        'Reply-To: ' . $fromEmail,
        'X-Mailer: PHP/' . phpversion()
    ];

    $mailSent = false;
    $provider = 'simulated';
    $debugLog = [];

    // 1. Prioritas Utama: Kirim via Native Socket SMTP cPanel jika password sudah dikonfigurasi
    if ($smtpCfg['enabled'] && !empty($smtpCfg['pass'])) {
        try {
            if (sendNativeSmtpEmail($to, $subject, $htmlBody, $plainText, $debugLog)) {
                $mailSent = true;
                $provider = 'cpanel_smtp';
            }
        } catch (Exception $e) {
            $debugLog[] = 'Exception SMTP: ' . $e->getMessage();
            $mailSent = false;
        }
    } else {
        $debugLog[] = 'cPanel SMTP belum memiliki password di smtp_config.php / env.';
    }

    // 2. Prioritas Kedua: Resend API jika key ada
    if (!$mailSent && !empty($resendKey)) {
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

    // 3. Prioritas Ketiga: Brevo API jika key ada
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

    // 4. Prioritas Keempat: PHP native mail() (e.g. cPanel Exim / Sendmail server)
    if (!$mailSent && function_exists('mail') && !empty($to)) {
        try {
            $mailSent = @mail($to, $subject, $htmlBody, implode("\r\n", $headers));
            if ($mailSent) $provider = 'php_mail';
        } catch (Exception $e) {
            $mailSent = false;
        }
    }

    // Catat log pengiriman untuk audit / simulasi dev
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'to'        => $to,
        'subject'   => $subject,
        'provider'  => $provider,
        'delivered' => $mailSent,
        'debug'     => $debugLog,
        'body'      => $htmlBody,
        'plain'     => $plainText,
    ];

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

    return [
        'success'   => true,
        'delivered' => $mailSent,
        'provider'  => $provider,
        'simulated' => !$mailSent,
        'debug'     => $debugLog,
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

