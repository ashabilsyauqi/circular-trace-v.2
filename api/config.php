<?php
/**
 * Circular Coffee Trace (sangrAI)
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
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}
