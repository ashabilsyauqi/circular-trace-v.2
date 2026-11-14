<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'GET' && $action === 'users') {
    $stmt = $pdo->query("SELECT `id`, `name`, `email`, `role`, `verifier_domain` as verifierDomain, `organization`, `location`, `avatar`, `phone`, `balance`, `bio` FROM `users`");
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

        $stmt = $pdo->prepare("SELECT `id`, `name`, `email`, `password`, `role`, `verifier_domain` as verifierDomain, `organization`, `location`, `avatar`, `phone`, `balance`, `bio` FROM `users` WHERE `email` = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if (!$user) {
            sendError('Akun dengan email tersebut tidak ditemukan.', 401);
        }

        // Support plain password or hashed password
        $match = ($password === $user['password']) || password_verify($password, $user['password']);
        if (!$match) {
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

        if (!$name || !$email) {
            sendError('Nama dan email wajib diisi.', 400);
        }

        $id = 'user-' . $role . '-' . time();
        $avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

        $stmt = $pdo->prepare("INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `organization`, `location`, `avatar`, `phone`, `balance`, `bio`) VALUES (:id, :name, :email, :password, :role, :org, :location, :avatar, :phone, 0, :bio)");
        $stmt->execute([
            'id'       => $id,
            'name'     => $name,
            'email'    => $email,
            'password' => $password,
            'role'     => $role,
            'org'      => $org,
            'location' => $location,
            'avatar'   => $avatar,
            'phone'    => $phone,
            'bio'      => $bio
        ]);

        sendResponse([
            'id'           => $id,
            'name'         => $name,
            'email'        => $email,
            'role'         => $role,
            'organization' => $org,
            'location'     => $location,
            'avatar'       => $avatar,
            'phone'        => $phone,
            'balance'      => 0,
            'bio'          => $bio
        ], 201);
    }
}

sendError('Invalid action or method.', 400);
