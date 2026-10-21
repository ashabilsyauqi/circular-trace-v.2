<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $farmerId = $_GET['farmer_id'] ?? null;
    if ($farmerId) {
        $stmt = $pdo->prepare("SELECT * FROM `coffee_farms` WHERE `farmer_id` = :fid ORDER BY `created_at` DESC");
        $stmt->execute(['fid' => $farmerId]);
    } else {
        $stmt = $pdo->query("SELECT * FROM `coffee_farms` ORDER BY `created_at` DESC");
    }
    $rows = $stmt->fetchAll();

    foreach ($rows as &$r) {
        $r['primaryVarieties'] = json_decode($r['primary_varieties'] ?? '[]', true);
        $r['shadeTrees'] = json_decode($r['shade_trees'] ?? '[]', true);
        $r['weatherData'] = json_decode($r['weather_data'] ?? '{}', true);
        $r['plotBoundary'] = json_decode($r['plot_boundary'] ?? 'null', true);
        $r['patokList'] = json_decode($r['patok_list'] ?? '[]', true);
        $r['verificationStamp'] = json_decode($r['verification_stamp'] ?? 'null', true);
        $r['farmerId'] = $r['farmer_id'];
        $r['farmerName'] = $r['farmer_name'];
        $r['farmName'] = $r['farm_name'];
        $r['altitudeMeters'] = (int)$r['altitude_meters'];
        $r['altitudeDisplay'] = $r['altitude_display'];
        $r['landAreaHectares'] = (float)$r['land_area_hectares'];
        $r['totalTreesCount'] = (int)$r['total_trees_count'];
        $r['soilType'] = $r['soil_type'];
        $r['organicStatus'] = $r['organic_status'];
        $r['eudrCompliant'] = (bool)$r['eudr_compliant'];
        $r['photoUrl'] = $r['photo_url'];
        $r['establishedYear'] = (int)$r['established_year'];
        $r['verificationStatus'] = $r['verification_status'];
        if ($r['latitude'] && $r['longitude']) {
            $r['coordinates'] = [
                'latitude'  => (float)$r['latitude'],
                'longitude' => (float)$r['longitude']
            ];
        }
    }

    sendResponse($rows);
}

if ($method === 'POST') {
    $data = getJsonInput();
    $id = $data['id'] ?? ('FARM-' . strtoupper(substr(uniqid(), -6)));
    $farmerId = $data['farmerId'] ?? '';
    $farmerName = $data['farmerName'] ?? '';
    $farmName = $data['farmName'] ?? '';
    $location = $data['location'] ?? '';
    $province = $data['province'] ?? 'Jawa Barat';
    $lat = $data['coordinates']['latitude'] ?? null;
    $lng = $data['coordinates']['longitude'] ?? null;
    $alt = $data['altitudeMeters'] ?? 1500;
    $altDisp = $data['altitudeDisplay'] ?? "{$alt} mdpl";
    $area = $data['landAreaHectares'] ?? 1.0;
    $trees = $data['totalTreesCount'] ?? 1000;
    $varieties = json_encode($data['primaryVarieties'] ?? []);
    $soil = $data['soilType'] ?? 'Andosol Vulkanik';
    $shade = json_encode($data['shadeTrees'] ?? []);
    $organic = $data['organicStatus'] ?? 'Transisi Menuju Organik';
    $eudr = !empty($data['eudrCompliant']) ? 1 : 0;
    $weather = json_encode($data['weatherData'] ?? []);
    $boundary = json_encode($data['plotBoundary'] ?? null);
    $patok = json_encode($data['patokList'] ?? []);
    $photo = $data['photoUrl'] ?? 'https://images.unsplash.com/photo-1524350876685-274059332603?w=600';
    $year = $data['establishedYear'] ?? date('Y');
    $notes = $data['notes'] ?? '';

    $stmt = $pdo->prepare("INSERT INTO `coffee_farms` 
        (`id`, `farmer_id`, `farmer_name`, `farm_name`, `location`, `province`, `latitude`, `longitude`, `altitude_meters`, `altitude_display`, `land_area_hectares`, `total_trees_count`, `primary_varieties`, `soil_type`, `shade_trees`, `organic_status`, `eudr_compliant`, `weather_data`, `plot_boundary`, `patok_list`, `photo_url`, `established_year`, `notes`, `verification_status`)
        VALUES 
        (:id, :fid, :fname, :farmname, :loc, :prov, :lat, :lng, :alt, :altdisp, :area, :trees, :var, :soil, :shade, :org, :eudr, :wea, :bound, :pat, :photo, :yr, :notes, 'verified')
        ON DUPLICATE KEY UPDATE 
        `farm_name`=:farmname, `location`=:loc, `latitude`=:lat, `longitude`=:lng, `altitude_meters`=:alt, `land_area_hectares`=:area, `notes`=:notes");

    $stmt->execute([
        'id'       => $id,
        'fid'      => $farmerId,
        'fname'    => $farmerName,
        'farmname' => $farmName,
        'loc'      => $location,
        'prov'     => $province,
        'lat'      => $lat,
        'lng'      => $lng,
        'alt'      => $alt,
        'altdisp'  => $altDisp,
        'area'     => $area,
        'trees'    => $trees,
        'var'      => $varieties,
        'soil'     => $soil,
        'shade'    => $shade,
        'org'      => $organic,
        'eudr'     => $eudr,
        'wea'      => $weather,
        'bound'    => $boundary,
        'pat'      => $patok,
        'photo'    => $photo,
        'yr'       => $year,
        'notes'    => $notes
    ]);

    sendResponse(['id' => $id, 'message' => 'Kebun berhasil disimpan'], 201);
}

sendError('Method not allowed', 405);
