<?php
/**
 * Circular Coffee Trace (CircularCoffee)
 * Database Connection & Global API Utilities
 * Supports Auto-Configured SQLite (Default, Zero-Setup) & Optional MySQL
 */

// Global CORS & JSON Headers
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $sqlitePath = dirname(__DIR__) . '/data/cct_database.sqlite';
    $sqliteDir = dirname($sqlitePath);

    // Ensure data directory exists and is protected from web access
    if (!file_exists($sqliteDir)) {
        mkdir($sqliteDir, 0755, true);
        file_put_contents($sqliteDir . '/.htaccess', "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Deny from all\n</IfModule>\n");
    }

    // Check if MySQL is explicitly configured via environment variable
    $useMysql = getenv('USE_MYSQL') === 'true' || getenv('DB_HOST') !== false;

    if ($useMysql) {
        $db_host = getenv('DB_HOST') ?: 'localhost';
        $db_name = getenv('DB_NAME') ?: 'cirp8652_cct_coffee';
        $db_user = getenv('DB_USER') ?: 'cirp8652_cct_user';
        $db_pass = getenv('DB_PASS') ?: 'sangrAI_2026_Secure!';

        try {
            $dsn = "mysql:host={$db_host};dbname={$db_name};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $pdo = new PDO($dsn, $db_user, $db_pass, $options);
            ensureCoreTablesAndColumns($pdo);
            return $pdo;
        } catch (PDOException $e) {
            // Fallback to SQLite if MySQL is unreachable
        }
    }

    // Default: Native File-Based SQL (SQLite) - Zero setup required!
    try {
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        $pdo = new PDO('sqlite:' . $sqlitePath, null, null, $options);
        ensureCoreTablesAndColumns($pdo);
        return $pdo;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed: ' . $e->getMessage()
        ]);
        exit;
    }
}

function ensureCoreTablesAndColumns($pdo) {
    static $ensured = false;
    if ($ensured) return;

    $isMysql = isMysqlConnection($pdo);
    $autoInc = $isMysql ? 'INT AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';

    // 1. user_tokens table
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `user_tokens` (
            `id` {$autoInc},
            `user_id` VARCHAR(64) NOT NULL,
            `token` VARCHAR(128) NOT NULL UNIQUE,
            `role` VARCHAR(30) NOT NULL,
            `kelompok_tani_id` VARCHAR(64) DEFAULT NULL,
            `ip_address` VARCHAR(45) DEFAULT NULL,
            `user_agent` TEXT DEFAULT NULL,
            `expires_at` DATETIME NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
    } catch (Exception $e) {}

    // 2. password_resets table
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `password_resets` (
            `id` {$autoInc},
            `email` VARCHAR(191) NOT NULL,
            `otp_hash` VARCHAR(255) NOT NULL,
            `attempts` INT DEFAULT 0,
            `is_used` TINYINT(1) DEFAULT 0,
            `expires_at` DATETIME NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
    } catch (Exception $e) {}

    // 3. subscriptions table (Midtrans audit log)
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `subscriptions` (
            `id` {$autoInc},
            `order_id` VARCHAR(100) NOT NULL UNIQUE,
            `user_id` VARCHAR(64) NOT NULL,
            `user_email` VARCHAR(191) NOT NULL,
            `service_role` VARCHAR(50) NOT NULL,
            `plan_name` VARCHAR(100) NOT NULL,
            `billing_cycle` VARCHAR(20) NOT NULL DEFAULT 'monthly',
            `gross_amount` INT NOT NULL,
            `snap_token` VARCHAR(100) DEFAULT NULL,
            `transaction_status` VARCHAR(50) NOT NULL DEFAULT 'pending',
            `payment_type` VARCHAR(50) DEFAULT NULL,
            `midtrans_response` TEXT DEFAULT NULL,
            `paid_at` DATETIME DEFAULT NULL,
            `expires_at` DATETIME DEFAULT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
    } catch (Exception $e) {}

    // 4. Dynamic columns
    $tableCols = [
        'users' => [
            'status'                     => "VARCHAR(20) DEFAULT 'active'",
            'kelompok_tani_id'           => "VARCHAR(64) DEFAULT NULL",
            'kelompok_tani_name'         => "VARCHAR(200) DEFAULT NULL",
            'verification_status'        => "VARCHAR(20) DEFAULT 'pending'",
            'verified_by'                => "VARCHAR(150) DEFAULT NULL",
            'verified_at'                => "DATETIME DEFAULT NULL",
            'verification_notes'         => "TEXT DEFAULT NULL",
            'is_email_verified'          => "TINYINT(1) DEFAULT 0",
            'subscription_status'        => "VARCHAR(30) DEFAULT 'pending_payment'",
            'subscription_plan'          => "VARCHAR(100) DEFAULT NULL",
            'subscription_billing_cycle' => "VARCHAR(20) DEFAULT 'monthly'",
            'subscription_expires_at'    => "DATETIME DEFAULT NULL",
            'last_payment_order_id'      => "VARCHAR(100) DEFAULT NULL",
            'last_payment_date'          => "DATETIME DEFAULT NULL"
        ],
        'coffee_farms' => [
            'kelompok_tani_id'    => "VARCHAR(64) DEFAULT NULL"
        ],
        'farmer_harvest_lots' => [
            'kelompok_tani_id'    => "VARCHAR(64) DEFAULT NULL"
        ],
        'processing_batches' => [
            'kelompok_tani_id'    => "VARCHAR(64) DEFAULT NULL"
        ],
        'processed_green_bean_lots' => [
            'kelompok_tani_id'    => "VARCHAR(64) DEFAULT NULL"
        ]
    ];

    foreach ($tableCols as $table => $cols) {
        foreach ($cols as $col => $def) {
            try {
                $pdo->exec("ALTER TABLE `{$table}` ADD COLUMN `{$col}` {$def}");
            } catch (Exception $e) {
                // column already exists or table not ready
            }
        }
    }

    $ensured = true;
}

function getBearerToken() {
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER['Authorization']);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    
    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/i', $headers, $matches)) {
            return $matches[1];
        }
    }
    return null;
}

function requireAuth($pdo, $allowedRoles = []) {
    $token = getBearerToken();
    if (!$token) {
        sendError('Akses ditolak. Token otentikasi (Bearer Token) tidak ditemukan.', 401);
    }

    $stmt = $pdo->prepare("SELECT ut.*, u.name, u.email, u.status as user_status, u.verification_status, u.organization 
                           FROM `user_tokens` ut 
                           JOIN `users` u ON ut.user_id = u.id 
                           WHERE ut.token = :t AND ut.expires_at > CURRENT_TIMESTAMP LIMIT 1");
    $stmt->execute(['t' => $token]);
    $auth = $stmt->fetch();

    if (!$auth) {
        sendError('Sesi login telah kedaluwarsa atau tidak valid. Silakan login kembali.', 401);
    }

    if ($auth['user_status'] === 'suspended') {
        sendError('Akun Anda sedang dinonaktifkan oleh pengurus.', 403);
    }

    // Role check if whitelist provided
    if (!empty($allowedRoles) && !in_array($auth['role'], $allowedRoles)) {
        sendError('Anda tidak memiliki hak akses (Role: ' . $auth['role'] . ') untuk endpoint ini.', 403);
    }

    return $auth;
}

function requireTenant($auth) {
    if ($auth['role'] === 'super_admin') {
        return null; // Super admin bypass tenant restriction
    }
    if (empty($auth['kelompok_tani_id'])) {
        return $auth['user_id'];
    }
    return $auth['kelompok_tani_id'];
}

function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => true,
        'data'    => $data
    ]);
    exit;
}

function sendError($message, $statusCode = 400, $details = null) {
    http_response_code($statusCode);
    $res = [
        'success' => false,
        'message' => $message
    ];
    if ($details !== null) {
        $res['details'] = $details;
    }
    echo json_encode($res);
    exit;
}

function getJsonInput() {
    if (!empty($GLOBALS['MOCK_INPUT'])) {
        return is_array($GLOBALS['MOCK_INPUT']) ? $GLOBALS['MOCK_INPUT'] : json_decode($GLOBALS['MOCK_INPUT'], true);
    }
    $raw = file_get_contents('php://input');
    if (!$raw && PHP_SAPI === 'cli') {
        $raw = file_get_contents('php://stdin');
    }
    if (!$raw) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function isMysqlConnection($pdo) {
    try {
        return $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql';
    } catch (Exception $e) {
        return false;
    }
}

