<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/mailer.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

function ensureUserColumns($pdo) {
    static $ensured = false;
    if ($ensured) return;
    $cols = [
        'verification_status'           => "TEXT DEFAULT 'pending'",
        'kelompok_tani_id'              => "TEXT DEFAULT NULL",
        'kelompok_tani_name'            => "TEXT DEFAULT NULL",
        'verified_by'                   => "TEXT DEFAULT NULL",
        'verified_at'                   => "DATETIME DEFAULT NULL",
        'verification_notes'            => "TEXT DEFAULT NULL",
        'email_verification_token'      => "VARCHAR(64) DEFAULT NULL",
        'email_verification_expires_at' => "DATETIME DEFAULT NULL",
        'is_email_verified'             => "INTEGER DEFAULT 0"
    ];
    foreach ($cols as $col => $def) {
        try {
            $pdo->exec("ALTER TABLE `users` ADD COLUMN `{$col}` {$def}");
        } catch (Exception $e) {
            // Already exists or unneeded
        }
    }
    $ensured = true;
}

ensureUserColumns($pdo);

if ($action === 'verify-email') {
    $input = getJsonInput();
    $token = trim($_GET['token'] ?? ($input['token'] ?? ''));
    if (!$token) {
        sendError('Token verifikasi wajib disertakan.', 400);
    }

    $stmt = $pdo->prepare("SELECT `id`, `name`, `email`, `role`, `verifier_domain` as verifierDomain, `organization`, `location`, `avatar`, `phone`, `balance`, `bio`, `verification_status` as verificationStatus, `kelompok_tani_id` as kelompokTaniId, `kelompok_tani_name` as kelompokTaniName, `email_verification_token`, `email_verification_expires_at`, `is_email_verified` FROM `users` WHERE `email_verification_token` = :token LIMIT 1");
    $stmt->execute(['token' => $token]);
    $user = $stmt->fetch();

    if (!$user) {
        sendError('Token verifikasi tidak valid atau tautan sudah pernah digunakan.', 404);
    }

    if (!empty($user['email_verification_expires_at'])) {
        $expiresTimestamp = strtotime($user['email_verification_expires_at']);
        if ($expiresTimestamp && $expiresTimestamp < time()) {
            sendError('Tautan verifikasi telah kedaluwarsa (berlaku 24 jam). Silakan lakukan pendaftaran atau minta verifikasi ulang.', 400);
        }
    }

    // Mark as verified & clear token
    $upStmt = $pdo->prepare("UPDATE `users` SET `is_email_verified` = 1, `email_verification_token` = NULL, `email_verification_expires_at` = NULL WHERE `id` = :id");
    $upStmt->execute(['id' => $user['id']]);

    unset($user['email_verification_token']);
    unset($user['email_verification_expires_at']);
    $user['isEmailVerified'] = true;

    sendResponse([
        'message' => 'Alamat email berhasil diverifikasi! Akun Anda kini aktif.',
        'user'    => $user
    ]);
}

if ($method === 'GET' && $action === 'users') {
    $stmt = $pdo->query("SELECT `id`, `name`, `email`, `role`, `verifier_domain` as verifierDomain, `organization`, `location`, `avatar`, `phone`, `balance`, `bio`, `verification_status` as verificationStatus, `kelompok_tani_id` as kelompokTaniId, `kelompok_tani_name` as kelompokTaniName, `verified_by` as verifiedBy, `verified_at` as verifiedAt, `verification_notes` as verificationNotes, `is_email_verified` as isEmailVerified FROM `users`");
    $users = $stmt->fetchAll();
    sendResponse($users);
}

if ($method === 'POST') {
    $input = getJsonInput();

    if ($action === 'login') {
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');

        if (!$email || !$password) {
            sendError('Email dan password wajib diisi.', 400);
        }

        $stmt = $pdo->prepare("SELECT `id`, `name`, `email`, `password`, `role`, `verifier_domain` as verifierDomain, `organization`, `location`, `avatar`, `phone`, `balance`, `bio`, `verification_status` as verificationStatus, `kelompok_tani_id` as kelompokTaniId, `kelompok_tani_name` as kelompokTaniName, `verified_by` as verifiedBy, `verified_at` as verifiedAt, `verification_notes` as verificationNotes, `is_email_verified` as isEmailVerified FROM `users` WHERE `email` = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if (!$user) {
            sendError('Akun dengan email tersebut tidak ditemukan.', 401);
        }

        // Support bcrypt verification with legacy plain-text fallback & auto-rehash
        $isPasswordCorrect = false;
        if (password_verify($password, $user['password'])) {
            $isPasswordCorrect = true;
        } elseif ($password === $user['password']) {
            $isPasswordCorrect = true;
            // Rehash plain-text password to bcrypt for enhanced security
            $newHash = password_hash($password, PASSWORD_BCRYPT);
            $upStmt = $pdo->prepare("UPDATE `users` SET `password` = :p WHERE `id` = :id");
            $upStmt->execute(['p' => $newHash, 'id' => $user['id']]);
        }

        if (!$isPasswordCorrect) {
            sendError('Password yang Anda masukkan salah.', 401);
        }

        unset($user['password']);
        sendResponse([
            'user'    => $user,
            'message' => 'Login berhasil'
        ]);
    }

    if ($action === 'register') {
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? 'password123');
        $role = trim($input['role'] ?? 'petani');
        $org = trim($input['organization'] ?? '');
        $location = trim($input['location'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $bio = trim($input['bio'] ?? '');
        $kelompokTaniId = trim($input['kelompokTaniId'] ?? '');
        $kelompokTaniName = trim($input['kelompokTaniName'] ?? '');

        if (!$name || !$email) {
            sendError('Nama dan email wajib diisi.', 400);
        }

        // Check if email already registered
        $checkStmt = $pdo->prepare("SELECT `id` FROM `users` WHERE `email` = :email LIMIT 1");
        $checkStmt->execute(['email' => $email]);
        if ($checkStmt->fetch()) {
            sendError('Alamat email sudah terdaftar. Silakan gunakan email lain atau login.', 409);
        }

        $id = 'user-' . $role . '-' . time();
        $avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $verificationStatus = 'pending';

        // Generate 64-char random verification token (24-hour expiry)
        $verificationToken = bin2hex(random_bytes(32));
        $verificationExpiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

        $stmt = $pdo->prepare("INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `organization`, `location`, `avatar`, `phone`, `balance`, `bio`, `verification_status`, `kelompok_tani_id`, `kelompok_tani_name`, `email_verification_token`, `email_verification_expires_at`, `is_email_verified`) VALUES (:id, :name, :email, :password, :role, :org, :location, :avatar, :phone, 0, :bio, :vstatus, :ktid, :ktname, :token, :expires, 0)");
        $stmt->execute([
            'id'       => $id,
            'name'     => $name,
            'email'    => $email,
            'password' => $hashedPassword,
            'role'     => $role,
            'org'      => $org,
            'location' => $location,
            'avatar'   => $avatar,
            'phone'    => $phone,
            'bio'      => $bio,
            'vstatus'  => $verificationStatus,
            'ktid'     => $kelompokTaniId ?: null,
            'ktname'   => $kelompokTaniName ?: null,
            'token'    => $verificationToken,
            'expires'  => $verificationExpiresAt
        ]);

        // Construct verification URL
        $host = $_SERVER['HTTP_HOST'] ?? 'circularcoffee.circulartrace.id';
        $scheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
        $baseUrl = (!empty($_SERVER['HTTP_ORIGIN'])) ? rtrim($_SERVER['HTTP_ORIGIN'], '/') : "{$scheme}://{$host}";
        $verificationLink = "{$baseUrl}/verify-email?token={$verificationToken}";

        // Send email via mailer
        $mailResult = sendVerificationEmail($email, $name, $verificationToken, $verificationLink);

        sendResponse([
            'id'                        => $id,
            'name'                      => $name,
            'email'                     => $email,
            'role'                      => $role,
            'organization'              => $org,
            'location'                  => $location,
            'avatar'                    => $avatar,
            'phone'                     => $phone,
            'balance'                   => 0,
            'bio'                       => $bio,
            'verificationStatus'        => $verificationStatus,
            'kelompokTaniId'            => $kelompokTaniId,
            'kelompokTaniName'          => $kelompokTaniName,
            'isEmailVerified'           => false,
            'verificationToken'         => $verificationToken,
            'verificationLink'          => $verificationLink,
            'mailResult'                => $mailResult,
            'message'                   => 'Pendaftaran berhasil. Silakan periksa email Anda untuk mengaktifkan akun.'
        ], 201);
    }

    if ($action === 'verify-user') {
        $userId = trim($input['userId'] ?? '');
        $status = trim($input['status'] ?? 'verified');
        $verifiedBy = trim($input['verifiedBy'] ?? 'Ketua Kelompok Tani');
        $notes = trim($input['notes'] ?? '');

        if (!$userId) {
            sendError('User ID wajib diisi.', 400);
        }

        $now = date('Y-m-d H:i:s');
        $stmt = $pdo->prepare("UPDATE `users` SET `verification_status` = :st, `verified_by` = :vb, `verified_at` = :va, `verification_notes` = :vn WHERE `id` = :id");
        $stmt->execute([
            'st' => $status,
            'vb' => $verifiedBy,
            'va' => $now,
            'vn' => $notes,
            'id' => $userId
        ]);

        sendResponse([
            'message' => 'Status verifikasi akun berhasil diperbarui',
            'userId'  => $userId,
            'status'  => $status
        ]);
    }

    if ($action === 'forgot-password') {
        $email = trim($input['email'] ?? '');
        if (!$email) sendError('Email wajib diisi.', 400);

        $stmt = $pdo->prepare("SELECT `id`, `name`, `email` FROM `users` WHERE `email` = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if (!$user) {
            sendError('Email tidak terdaftar pada direktori Circular Coffee Trace.', 404);
        }

        // Generate OTP 6 digit
        $otp = strval(rand(100000, 999999));
        $expiry = date('Y-m-d H:i:s', strtotime('+15 minutes'));

        // Kirim OTP via mailer (SMTP cPanel / dev simulation)
        $emailSubject = "Kode Verifikasi Reset Kata Sandi - CircularCoffee";
        $emailHtml = "<p>Halo <strong>{$user['name']}</strong>,</p>" .
                     "<p>Kode verifikasi untuk mereset kata sandi akun CircularCoffee Anda adalah:</p>" .
                     "<h2 style='color:#b45309;letter-spacing:4px;font-size:28px;'>{$otp}</h2>" .
                     "<p>Kode ini berlaku selama 15 menit. Jika Anda tidak merasa meminta reset kata sandi, abaikan email ini.</p>";

        sendSystemEmail($email, $emailSubject, $emailHtml, "Kode OTP Anda: {$otp}");

        sendResponse([
            'message'   => 'Kode OTP verifikasi berhasil dibuat dan dikirim ke email Anda.',
            'resetCode' => $otp,
            'email'     => $email
        ]);
    }

    if ($action === 'reset-password') {
        $email = trim($input['email'] ?? '');
        $newPassword = trim($input['newPassword'] ?? '');

        if (!$email || !$newPassword) {
            sendError('Email dan kata sandi baru wajib diisi.', 400);
        }

        $hashed = password_hash($newPassword, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("UPDATE `users` SET `password` = :pass WHERE `email` = :email");
        $stmt->execute(['pass' => $hashed, 'email' => $email]);

        sendResponse(['message' => 'Kata sandi berhasil diperbarui. Silakan login.']);
    }
}

sendError('Invalid action or method.', 400);
