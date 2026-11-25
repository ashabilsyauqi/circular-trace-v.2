<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/mailer.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';



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

// 2. Pending Approvals Listing (GET)
// Accessible by: admin_kelompok_tani (filtered to their tenant) or super_admin (all)
if ($method === 'GET' && $action === 'pending-approvals') {
    $auth = requireAuth($pdo, ['admin_kelompok_tani', 'super_admin']);
    
    if ($auth['role'] === 'super_admin') {
        $stmt = $pdo->query("SELECT `id`, `name`, `email`, `role`, `verifier_domain` as verifierDomain, `organization`, `location`, `avatar`, `phone`, `balance`, `bio`, `verification_status` as verificationStatus, `kelompok_tani_id` as kelompokTaniId, `kelompok_tani_name` as kelompokTaniName, `created_at` as createdAt FROM `users` WHERE `verification_status` = 'pending' ORDER BY `created_at` DESC");
        $pendingUsers = $stmt->fetchAll();
    } else {
        $ktId = $auth['kelompok_tani_id'];
        $stmt = $pdo->prepare("SELECT `id`, `name`, `email`, `role`, `verifier_domain` as verifierDomain, `organization`, `location`, `avatar`, `phone`, `balance`, `bio`, `verification_status` as verificationStatus, `kelompok_tani_id` as kelompokTaniId, `kelompok_tani_name` as kelompokTaniName, `created_at` as createdAt FROM `users` WHERE `verification_status` = 'pending' AND `kelompok_tani_id` = :ktid ORDER BY `created_at` DESC");
        $stmt->execute(['ktid' => $ktId]);
        $pendingUsers = $stmt->fetchAll();
    }

    sendResponse($pendingUsers);
}

// 3. User Directory (GET)
if ($method === 'GET' && $action === 'users') {
    $stmt = $pdo->query("SELECT `id`, `name`, `email`, `role`, `verifier_domain` as verifierDomain, `organization`, `location`, `avatar`, `phone`, `balance`, `bio`, `verification_status` as verificationStatus, `kelompok_tani_id` as kelompokTaniId, `kelompok_tani_name` as kelompokTaniName, `verified_by` as verifiedBy, `verified_at` as verifiedAt, `verification_notes` as verificationNotes, `is_email_verified` as isEmailVerified, `status` FROM `users`");
    $users = $stmt->fetchAll();
    sendResponse($users);
}

// 4. POST Actions
if ($method === 'POST') {
    $input = getJsonInput();

    // 4A. Login with Bearer Token Generation
    if ($action === 'login') {
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');

        if (!$email || !$password) {
            sendError('Email dan password wajib diisi.', 400);
        }

        $stmt = $pdo->prepare("SELECT `id`, `name`, `email`, `password`, `role`, `verifier_domain` as verifierDomain, `organization`, `location`, `avatar`, `phone`, `balance`, `bio`, `verification_status` as verificationStatus, `kelompok_tani_id` as kelompokTaniId, `kelompok_tani_name` as kelompokTaniName, `verified_by` as verifiedBy, `verified_at` as verifiedAt, `verification_notes` as verificationNotes, `is_email_verified` as isEmailVerified, `status` FROM `users` WHERE `email` = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if (!$user) {
            sendError('Akun dengan email tersebut tidak ditemukan.', 401);
        }

        if (($user['status'] ?? 'active') === 'suspended') {
            sendError('Akun Anda sedang dinonaktifkan oleh pengurus.', 403);
        }

        // Strict Password Verification - No Bypass Allowed!
        $isPasswordCorrect = false;
        if (password_verify($password, $user['password'])) {
            $isPasswordCorrect = true;
        } elseif ($password === $user['password']) {
            // Legacy plain-text match: upgrade hash to bcrypt immediately
            $isPasswordCorrect = true;
            $newHash = password_hash($password, PASSWORD_BCRYPT);
            $upStmt = $pdo->prepare("UPDATE `users` SET `password` = :p WHERE `id` = :id");
            $upStmt->execute(['p' => $newHash, 'id' => $user['id']]);
        }

        if (!$isPasswordCorrect) {
            sendError('Password yang Anda masukkan salah.', 401);
        }

        // Generate 64-character Bearer Token
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Web Browser';

        $tokenStmt = $pdo->prepare("INSERT INTO `user_tokens` (`user_id`, `token`, `role`, `kelompok_tani_id`, `ip_address`, `user_agent`, `expires_at`) VALUES (:uid, :token, :role, :ktid, :ip, :ua, :exp)");
        $tokenStmt->execute([
            'uid'   => $user['id'],
            'token' => $token,
            'role'  => $user['role'],
            'ktid'  => $user['kelompokTaniId'],
            'ip'    => $ip,
            'ua'    => $userAgent,
            'exp'   => $expiresAt
        ]);

        unset($user['password']);

        sendResponse([
            'token'   => $token,
            'user'    => $user,
            'message' => 'Login berhasil'
        ]);
    }

    // 4B. User Registration with Role Validation & Approval Gate Status
    if ($action === 'register') {
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');
        $role = trim($input['role'] ?? 'petani');
        $org = trim($input['organization'] ?? '');
        $location = trim($input['location'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $bio = trim($input['bio'] ?? '');
        $kelompokTaniId = trim($input['kelompokTaniId'] ?? '');
        $kelompokTaniName = trim($input['kelompokTaniName'] ?? '');

        if (!$name || !$email || !$password) {
            sendError('Nama, email, dan password wajib diisi.', 400);
        }

        // Prevent public self-registration of super_admin
        if ($role === 'super_admin') {
            sendError('Registrasi publik tidak diizinkan untuk peran Super Administrator.', 403);
        }

        $id = 'user-' . $role . '-' . time() . '-' . mt_rand(100, 999);

        // Handle organization assignment for Kelompok Tani Admin
        if ($role === 'admin_kelompok_tani') {
            if (!$kelompokTaniId) {
                $kelompokTaniId = 'kt-' . substr(md5($id . $org), 0, 8);
            }
            if (!$kelompokTaniName) {
                $kelompokTaniName = $org;
            }
            $verificationStatus = 'verified';
        } elseif (in_array($role, ['petani', 'pengolah', 'verifikator'])) {
            if (!$kelompokTaniId) {
                sendError('Kelompok Tani wajib dipilih untuk pendaftaran peran ' . ucfirst($role) . '.', 400);
            }
            $verificationStatus = 'pending';
        } else {
            // Downstream commercial buyers (roaster, gudang, cafe) are verified upon signup
            $verificationStatus = 'verified';
        }

        // Check if email already registered
        $checkStmt = $pdo->prepare("SELECT `id` FROM `users` WHERE `email` = :email LIMIT 1");
        $checkStmt->execute(['email' => $email]);
        if ($checkStmt->fetch()) {
            sendError('Alamat email sudah terdaftar. Silakan gunakan email lain atau login.', 409);
        }
        $avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // Generate 64-char random verification token (24-hour expiry)
        $verificationToken = bin2hex(random_bytes(32));
        $verificationExpiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

        $stmt = $pdo->prepare("INSERT INTO `users` 
            (`id`, `name`, `email`, `password`, `role`, `organization`, `location`, `avatar`, `phone`, `balance`, `bio`, `verification_status`, `kelompok_tani_id`, `kelompok_tani_name`, `email_verification_token`, `email_verification_expires_at`, `is_email_verified`, `status`) 
            VALUES 
            (:id, :name, :email, :password, :role, :org, :location, :avatar, :phone, 0, :bio, :vstatus, :ktid, :ktname, :token, :expires, 0, 'active')");
        
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
            'message'                   => $verificationStatus === 'pending'
                ? 'Pendaftaran berhasil. Akun Anda sedang menunggu persetujuan Ketua Kelompok Tani dan verifikasi email.'
                : 'Pendaftaran berhasil. Silakan periksa email Anda untuk mengaktifkan akun.'
        ], 201);
    }

    // 4C. Approval Gate: Verify or Reject User (Protected: admin_kelompok_tani or super_admin)
    if ($action === 'verify-user') {
        $auth = requireAuth($pdo, ['admin_kelompok_tani', 'super_admin']);
        
        $userId = trim($input['userId'] ?? '');
        $status = trim($input['status'] ?? 'verified');
        $notes = trim($input['notes'] ?? '');

        if (!$userId) {
            sendError('User ID wajib disertakan.', 400);
        }

        if (!in_array($status, ['verified', 'rejected', 'pending'])) {
            sendError('Status verifikasi tidak valid.', 400);
        }

        // Validate that user exists
        $userCheck = $pdo->prepare("SELECT `id`, `name`, `kelompok_tani_id` FROM `users` WHERE `id` = :id LIMIT 1");
        $userCheck->execute(['id' => $userId]);
        $targetUser = $userCheck->fetch();

        if (!$targetUser) {
            sendError('Pengguna tidak ditemukan.', 404);
        }

        // Enforce tenant boundary for admin_kelompok_tani
        if ($auth['role'] !== 'super_admin') {
            if ($targetUser['kelompok_tani_id'] !== $auth['kelompok_tani_id']) {
                sendError('Akses ditolak. Anda hanya dapat memverifikasi anggota kelompok tani Anda sendiri.', 403);
            }
        }

        $now = date('Y-m-d H:i:s');
        $upStmt = $pdo->prepare("UPDATE `users` SET `verification_status` = :st, `verified_by` = :vb, `verified_at` = :va, `verification_notes` = :vn WHERE `id` = :id");
        $upStmt->execute([
            'st' => $status,
            'vb' => $auth['name'],
            'va' => $now,
            'vn' => $notes,
            'id' => $userId
        ]);

        sendResponse([
            'message'      => 'Status verifikasi akun berhasil diperbarui',
            'userId'       => $userId,
            'targetName'   => $targetUser['name'],
            'status'       => $status,
            'verifiedBy'   => $auth['name'],
            'verifiedAt'   => $now
        ]);
    }

    // 4D. Forgot Password (Secure OTP Generation - NEVER LEAK OTP IN JSON)
    if ($action === 'forgot-password') {
        $email = trim($input['email'] ?? '');
        if (!$email) sendError('Email wajib diisi.', 400);

        $stmt = $pdo->prepare("SELECT `id`, `name`, `email` FROM `users` WHERE `email` = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if (!$user) {
            sendError('Email tidak terdaftar pada direktori Circular Coffee Trace.', 404);
        }

        // Generate 6-digit numeric OTP
        $otp = strval(random_int(100000, 999999));
        $otpHash = password_hash($otp, PASSWORD_BCRYPT);
        $expiry = date('Y-m-d H:i:s', strtotime('+15 minutes'));

        // Store hashed OTP in password_resets
        $resetStmt = $pdo->prepare("INSERT INTO `password_resets` (`email`, `otp_hash`, `attempts`, `is_used`, `expires_at`) VALUES (:email, :hash, 0, 0, :exp)");
        $resetStmt->execute([
            'email' => $email,
            'hash'  => $otpHash,
            'exp'   => $expiry
        ]);

        // Dispatch OTP via mailer
        $emailSubject = "Kode Verifikasi Reset Kata Sandi - CircularCoffee";
        $emailHtml = "<p>Halo <strong>{$user['name']}</strong>,</p>" .
                     "<p>Kode verifikasi untuk mereset kata sandi akun CircularCoffee Anda adalah:</p>" .
                     "<h2 style='color:#b45309;letter-spacing:4px;font-size:28px;'>{$otp}</h2>" .
                     "<p>Kode ini berlaku selama 15 menit. Jika Anda tidak merasa meminta reset kata sandi, abaikan email ini.</p>";

        sendSystemEmail($email, $emailSubject, $emailHtml, "Kode OTP Anda: {$otp}");

        // STRICT SECURITY REQUIREMENT: No OTP in response JSON
        sendResponse([
            'message' => 'Kode OTP reset kata sandi telah dikirim ke email Anda.'
        ]);
    }

    // 4E. Reset Password (Secure Verification & Token Invalidation)
    if ($action === 'reset-password') {
        $email = trim($input['email'] ?? '');
        $otp = trim($input['otp'] ?? '');
        $newPassword = trim($input['newPassword'] ?? '');

        if (!$email || !$otp || !$newPassword) {
            sendError('Email, kode OTP, dan kata sandi baru wajib diisi.', 400);
        }

        // Find latest unused and unexpired reset request
        $resetStmt = $pdo->prepare("SELECT * FROM `password_resets` WHERE `email` = :email AND `is_used` = 0 AND `expires_at` > CURRENT_TIMESTAMP ORDER BY `id` DESC LIMIT 1");
        $resetStmt->execute(['email' => $email]);
        $record = $resetStmt->fetch();

        if (!$record) {
            sendError('Kode OTP salah atau kedaluwarsa.', 400);
        }

        // Rate limit verification attempts (max 5)
        if ((int)$record['attempts'] >= 5) {
            $pdo->prepare("UPDATE `password_resets` SET `is_used` = 1 WHERE `id` = :id")->execute(['id' => $record['id']]);
            sendError('Batas percobaan OTP telah terlampaui. Silakan minta kode OTP baru.', 400);
        }

        // Verify OTP against stored bcrypt hash
        if (!password_verify($otp, $record['otp_hash'])) {
            $pdo->prepare("UPDATE `password_resets` SET `attempts` = `attempts` + 1 WHERE `id` = :id")->execute(['id' => $record['id']]);
            sendError('Kode OTP salah atau kedaluwarsa.', 400);
        }

        // Hash new password and update user record
        $hashed = password_hash($newPassword, PASSWORD_BCRYPT);
        $userUpStmt = $pdo->prepare("UPDATE `users` SET `password` = :pass WHERE `email` = :email");
        $userUpStmt->execute(['pass' => $hashed, 'email' => $email]);

        // Invalidate OTP
        $pdo->prepare("UPDATE `password_resets` SET `is_used` = 1 WHERE `id` = :id")->execute(['id' => $record['id']]);

        // Invalidate all existing login sessions for this user
        $pdo->prepare("DELETE FROM `user_tokens` WHERE `user_id` = (SELECT `id` FROM `users` WHERE `email` = :email LIMIT 1)")->execute(['email' => $email]);

        sendResponse([
            'message' => 'Kata sandi berhasil diperbarui. Silakan login dengan password baru Anda.'
        ]);
    }
}

sendError('Aksi atau metode HTTP tidak valid.', 400);
