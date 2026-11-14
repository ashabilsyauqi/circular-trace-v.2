<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$type = $_GET['type'] ?? 'products';

if ($method === 'GET') {
    if ($type === 'inventory') {
        $cafeId = $_GET['cafe_id'] ?? null;
        $sql = "SELECT * FROM `cafe_inventory`";
        $params = [];
        if ($cafeId) {
            $sql .= " WHERE `cafe_id` = :cid";
            $params['cid'] = $cafeId;
        }
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r['tastingNotes'] = json_decode($r['tasting_notes'] ?? '[]', true);
            $r['lineage'] = json_decode($r['lineage'] ?? 'null', true);
            $r['cafeId'] = $r['cafe_id'];
            $r['cafeName'] = $r['cafe_name'];
            $r['sourceRoastedBeanId'] = $r['source_roasted_bean_id'];
            $r['beanName'] = $r['bean_name'];
            $r['roasterName'] = $r['roaster_name'];
            $r['processMethod'] = $r['process_method'];
            $r['roastLevel'] = $r['roast_level'];
            $r['scaScore'] = (float)$r['sca_score'];
            $r['packWeightGrams'] = (int)$r['pack_weight_grams'];
            $r['packsInStock'] = (int)$r['packs_in_stock'];
            $r['purchaseDate'] = $r['purchase_date'];
            $r['costPerPack'] = (float)$r['cost_per_pack'];
        }
        sendResponse($rows);
    }

    // Default: cafe retail products
    $cafeId = $_GET['cafe_id'] ?? null;
    $sql = "SELECT * FROM `cafe_products`";
    $params = [];
    if ($cafeId) {
        $sql .= " WHERE `cafe_id` = :cid";
        $params['cid'] = $cafeId;
    }
    $sql .= " ORDER BY `created_at` DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    foreach ($rows as &$r) {
        $r['tastingNotes'] = json_decode($r['tasting_notes'] ?? '[]', true);
        $r['verificationStamp'] = json_decode($r['verification_stamp'] ?? 'null', true);
        $r['cafeId'] = $r['cafe_id'];
        $r['cafeName'] = $r['cafe_name'];
        $r['roastLevel'] = $r['roast_level'];
        $r['packageUnit'] = $r['package_unit'];
        $r['price'] = (float)$r['price'];
        $r['totalStock'] = (int)$r['total_stock'];
        $r['availableStock'] = (int)$r['available_stock'];
        $r['photoUrl'] = $r['photo_url'];
        $r['createdAt'] = $r['created_at'];
        $r['verificationStatus'] = $r['verification_status'];
    }

    sendResponse($rows);
}

if ($method === 'POST') {
    $data = getJsonInput();

    if ($type === 'inventory') {
        $id = $data['id'] ?? ('INV-CF-' . strtoupper(substr(uniqid(), -6)));
        $stmt = $pdo->prepare("INSERT INTO `cafe_inventory` 
            (`id`, `cafe_id`, `cafe_name`, `source_roasted_bean_id`, `bean_name`, `roaster_name`, `origin`, `variety`, `process_method`, `roast_level`, `tasting_notes`, `sca_score`, `pack_weight_grams`, `packs_in_stock`, `purchase_date`, `cost_per_pack`, `lineage`)
            VALUES 
            (:id, :cid, :cname, :srb, :bname, :rname, :orig, :var, :pmethod, :rlevel, :tnotes, :sca, :pwt, :packs, :pdate, :cost, :lineage)
            ON DUPLICATE KEY UPDATE `packs_in_stock`=:packs");
        $stmt->execute([
            'id'      => $id,
            'cid'     => $data['cafeId'] ?? '',
            'cname'   => $data['cafeName'] ?? '',
            'srb'     => $data['sourceRoastedBeanId'] ?? '',
            'bname'   => $data['beanName'] ?? '',
            'rname'   => $data['roasterName'] ?? '',
            'orig'    => $data['origin'] ?? '',
            'var'     => $data['variety'] ?? '',
            'pmethod' => $data['processMethod'] ?? '',
            'rlevel'  => $data['roastLevel'] ?? '',
            'tnotes'  => json_encode($data['tastingNotes'] ?? []),
            'sca'     => $data['scaScore'] ?? 85.0,
            'pwt'     => $data['packWeightGrams'] ?? 1000,
            'packs'   => $data['packsInStock'] ?? 1,
            'pdate'   => $data['purchaseDate'] ?? date('Y-m-d'),
            'cost'    => $data['costPerPack'] ?? 150000,
            'lineage' => json_encode($data['lineage'] ?? null)
        ]);
        sendResponse(['id' => $id, 'message' => 'Inventaris kafe berhasil disimpan'], 201);
    }

    // Default: Add product
    $id = $data['id'] ?? ('PROD-CF-' . strtoupper(substr(uniqid(), -6)));
    $stmt = $pdo->prepare("INSERT INTO `cafe_products` 
        (`id`, `cafe_id`, `cafe_name`, `name`, `origin`, `variety`, `roast_level`, `tasting_notes`, `price`, `package_unit`, `total_stock`, `available_stock`, `description`, `photo_url`)
        VALUES 
        (:id, :cid, :cname, :name, :orig, :var, :rlevel, :tnotes, :price, :punit, :tstock, :astock, :desc, :photo)
        ON DUPLICATE KEY UPDATE 
        `available_stock`=:astock, `price`=:price, `description`=:desc");

    $stmt->execute([
        'id'     => $id,
        'cid'    => $data['cafeId'] ?? '',
        'cname'  => $data['cafeName'] ?? '',
        'name'   => $data['name'] ?? '',
        'orig'   => $data['origin'] ?? '',
        'var'    => $data['variety'] ?? '',
        'rlevel' => $data['roastLevel'] ?? '',
        'tnotes' => json_encode($data['tastingNotes'] ?? []),
        'price'  => $data['price'] ?? 35000,
        'punit'  => $data['packageUnit'] ?? 'Cup 200ml',
        'tstock' => $data['totalStock'] ?? 100,
        'astock' => $data['availableStock'] ?? 100,
        'desc'   => $data['description'] ?? '',
        'photo'  => $data['photoUrl'] ?? 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600'
    ]);

    sendResponse(['id' => $id, 'message' => 'Produk kafe berhasil disimpan'], 201);
}

sendError('Method not allowed', 405);
