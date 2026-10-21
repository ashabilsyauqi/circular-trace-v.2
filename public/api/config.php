<?php
/**
 * Circular Coffee Trace (sangrAI)
 * Database Connection & Global API Utilities
 */

// Global CORS & JSON Headers
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// cPanel Database Credentials
// Ganti nilai default ini jika menggunakan kredensial custom di cPanel
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'cirp8652_cct_coffee';
$db_user = getenv('DB_USER') ?: 'cirp8652_cct_user';
$db_pass = getenv('DB_PASS') ?: 'sangrAI_2026_Secure!';

function getDbConnection() {
    global $db_host, $db_name, $db_user, $db_pass;
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

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
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed: ' . $e->getMessage(),
            'hint'    => 'Pastikan database dan user cPanel sudah dibuat serta kredensial di api/config.php sudah sesuai.'
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
