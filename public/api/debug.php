<?php
header('Content-Type: application/json; charset=UTF-8');
error_reporting(E_ALL);
ini_set('display_errors', '1');

echo json_encode([
    'status' => 'ok',
    'php_version' => PHP_VERSION,
    'pdo_drivers' => extension_loaded('pdo') ? pdo_drivers() : 'no pdo',
    'curl' => extension_loaded('curl'),
    'sqlite3' => extension_loaded('sqlite3'),
    'time' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT);
