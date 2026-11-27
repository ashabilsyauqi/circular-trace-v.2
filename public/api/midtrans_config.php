<?php
/**
 * CircularCoffee - Midtrans Payment Gateway Configuration (Sandbox Mode)
 * Merchant: circulartrace (novizarnazir25@gmail.com)
 */

// Kredensial Midtrans Sandbox
// Ganti nilai di bawah ini dengan Server Key dan Client Key asli dari Dashboard Midtrans:
// Settings > Access Keys (https://dashboard.sandbox.midtrans.com/settings/access_keys)
define('MIDTRANS_SERVER_KEY', getenv('MIDTRANS_SERVER_KEY') ?: 'SB-Mid-server-bjh1QqbI.ZW4JPW5JUwCZwqx');
define('MIDTRANS_CLIENT_KEY', getenv('MIDTRANS_CLIENT_KEY') ?: 'Mid-client-oAq9WPHW_0ihG4o4');
define('MIDTRANS_IS_PRODUCTION', false); // true untuk Production, false untuk Sandbox

// Endpoint URLs
define('MIDTRANS_SNAP_API_URL', MIDTRANS_IS_PRODUCTION 
    ? 'https://app.midtrans.com/snap/v1/transactions' 
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions');

define('MIDTRANS_SNAP_JS_URL', MIDTRANS_IS_PRODUCTION
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js');

/**
 * Baseline Dummy Pricing untuk 4 Layanan Utama CircularCoffee
 */
function getPlatformServicePlans() {
    return [
        'admin_kelompok_tani' => [
            'id'           => 'kelompok_tani',
            'role'         => 'admin_kelompok_tani',
            'name'         => 'Kelompok Tani / Gapoktan',
            'tagline'      => 'Pilar Hulu Terpadu (Petani, Wet Mill & Verifikator ICS)',
            'priceMonthly' => 250000,
            'priceYearly'  => 2500000, // Diskon 2 bulan
            'features'     => [
                'Registrasi & Ledger Petani Binaan Tanpa Batas',
                'Pemetaan Polygon Lahan & Patok Batas BPN (EUDR Ready)',
                'Stasiun Pengolahan Kopi (Wet Mill & Dry Mill)',
                'Audit Verifikator Internal Control System (ICS)',
                'Sertifikat Traceability Digital & QR Code Panen'
            ]
        ],
        'gudang' => [
            'id'           => 'gudang',
            'role'         => 'gudang',
            'name'         => 'Gudang & QA Logistik',
            'tagline'      => 'Manajemen Mutu Stok & Green Bean Pergudangan',
            'priceMonthly' => 450000,
            'priceYearly'  => 4500000,
            'features'     => [
                'Manajemen Stok Hermetik & Lot Gudang',
                'Lembar Uji Fisik SCA (Moisture & Water Activity)',
                'Sensor Telemetri Suhu & Kelembaban Ruang',
                'Stempel Otentikasi QA & Grading Hijau',
                'Penerbitan QR Karung Standar Ekspor'
            ]
        ],
        'roaster' => [
            'id'           => 'roaster',
            'role'         => 'roaster',
            'name'         => 'Artisan Roastery',
            'tagline'      => 'Kontrol Profil Sangrai & Evaluasi Sensori Cupping',
            'priceMonthly' => 650000,
            'priceYearly'  => 6500000,
            'features'     => [
                'Pencatatan Profil Mesin Sangrai & Roasting Log',
                'Lembar Evaluasi Uji Cupping Sensori (SCA Score)',
                'Integrasi Sourcing Green Bean Terverifikasi',
                'Penerbitan Paspor QR Kemasan Kopi Retail',
                'Koneksi Langsung ke Marketplace Pasar Kopi'
            ]
        ],
        'cafe' => [
            'id'           => 'cafe',
            'role'         => 'cafe',
            'name'         => 'Coffee Shop & Kafe',
            'tagline'      => 'Transparansi Cangkir Meja Kafe & Resep Barista',
            'priceMonthly' => 350000,
            'priceYearly'  => 3500000,
            'features'     => [
                'Paspor QR Meja Kafe (Farm-to-Cup Storytelling)',
                'Katalog Resep Seduhan Barista (V60, Espresso, Aeropress)',
                'Fair Share Transparency Margin Petani ke Konsumen',
                'Umpan Balik & Interaksi Penikmat Kopi Langsung',
                'Dukungan Multi-Outlet / Cabang Kafe'
            ]
        ]
    ];
}

/**
 * Helper untuk menghitung nominal tagihan
 */
function resolvePlanPricing($role, $cycle = 'monthly') {
    $plans = getPlatformServicePlans();
    
    // Normalisasi alias role
    if ($role === 'kelompok_tani') $role = 'admin_kelompok_tani';
    if ($role === 'coffee_shop') $role = 'cafe';
    
    if (!isset($plans[$role])) {
        // Fallback default
        return [
            'plan' => $plans['roaster'],
            'amount' => $cycle === 'yearly' ? 6500000 : 650000,
            'name' => 'Paket Langganan Layanan'
        ];
    }
    
    $plan = $plans[$role];
    $amount = ($cycle === 'yearly') ? $plan['priceYearly'] : $plan['priceMonthly'];
    
    return [
        'plan' => $plan,
        'amount' => $amount,
        'name' => $plan['name'] . ' (' . ($cycle === 'yearly' ? '1 Tahun' : '1 Bulan') . ')'
    ];
}
