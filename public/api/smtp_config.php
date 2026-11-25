<?php
/**
 * Circular Coffee Trace (CircularCoffee)
 * Konfigurasi Akun Email SMTP cPanel / Hosting
 * 
 * Anda dapat mengubah kredensial di bawah ini secara langsung,
 * atau mengaturnya lewat Environment Variable di cPanel / Server (.env).
 */

return [
    // Aktifkan konektor SMTP cPanel
    'enabled'    => true,

    // Host SMTP cPanel (biasanya mail.domainanda.id atau IP / Hostname cPanel)
    'host'       => getenv('SMTP_HOST') ?: 'mail.circulartrace.id',

    // Port SMTP: 465 (SSL) atau 587 (TLS/STARTTLS)
    'port'       => (int)(getenv('SMTP_PORT') ?: 465),

    // Protokol keamanan: 'ssl' (untuk port 465) atau 'tls' (untuk port 587)
    'secure'     => getenv('SMTP_SECURE') ?: 'ssl',

    // Alamat email lengkap akun cPanel (Username)
    'user'       => getenv('SMTP_USER') ?: 'noreply@circulartrace.id',

    // Kata sandi akun email cPanel Anda
    'pass'       => getenv('SMTP_PASS') ?: '',

    // Alamat pengirim resmi yang tampil di inbox penerima
    'from_email' => getenv('SMTP_FROM_EMAIL') ?: 'noreply@circulartrace.id',

    // Nama pengirim resmi yang tampil di inbox penerima
    'from_name'  => getenv('SMTP_FROM_NAME') ?: 'Circular Coffee Trace',

    // Batas waktu koneksi socket (detik) agar sistem tidak hang jika server offline
    'timeout'    => 5,
];
