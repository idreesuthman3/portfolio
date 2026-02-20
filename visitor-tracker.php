<?php
/**
 * visitor-tracker.php
 * Logs unique visitors to visitor.json with IP, count, and timestamps.
 * Call this on every page load.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

define('VISITOR_FILE', __DIR__ . '/visitor.json');

// ── Get real visitor IP ──────────────────────────────────────────────────────
function getVisitorIP(): string {
    $headers = [
        'HTTP_CF_CONNECTING_IP',   // Cloudflare
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_REAL_IP',
        'REMOTE_ADDR',
    ];
    foreach ($headers as $h) {
        if (!empty($_SERVER[$h])) {
            $ip = trim(explode(',', $_SERVER[$h])[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return $ip;
            }
        }
    }
    // Fall back to any REMOTE_ADDR (covers localhost dev)
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

// ── Load existing data ───────────────────────────────────────────────────────
function loadData(): array {
    if (!file_exists(VISITOR_FILE)) {
        return [
            'total_unique_visitors' => 0,
            'total_visits'          => 0,
            'last_updated'          => '',
            'visitors'              => []
        ];
    }
    $raw = file_get_contents(VISITOR_FILE);
    return json_decode($raw, true) ?? [];
}

// ── Save data ────────────────────────────────────────────────────────────────
function saveData(array $data): void {
    file_put_contents(VISITOR_FILE, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);
}

// ── Main logic ───────────────────────────────────────────────────────────────
$action = $_GET['action'] ?? 'track';

if ($action === 'stats') {
    // Just return stats without tracking
    $data = loadData();
    echo json_encode([
        'total_unique_visitors' => $data['total_unique_visitors'] ?? 0,
        'total_visits'          => $data['total_visits']          ?? 0,
        'last_updated'          => $data['last_updated']          ?? '',
        'recent_visitors'       => array_slice(
            array_values(array_reverse(array_values($data['visitors'] ?? []))),
            0, 10
        )
    ]);
    exit;
}

// Track visit
$ip   = getVisitorIP();
$now  = date('Y-m-d H:i:s');
$data = loadData();

$isNew = !isset($data['visitors'][$ip]);

if ($isNew) {
    // First visit from this IP
    $data['visitors'][$ip] = [
        'ip'          => $ip,
        'visits'      => 1,
        'first_seen'  => $now,
        'last_seen'   => $now,
        'user_agent'  => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 200),
    ];
    $data['total_unique_visitors'] = ($data['total_unique_visitors'] ?? 0) + 1;
} else {
    // Returning visitor
    $data['visitors'][$ip]['visits']++;
    $data['visitors'][$ip]['last_seen'] = $now;
}

$data['total_visits']  = ($data['total_visits'] ?? 0) + 1;
$data['last_updated']  = $now;

saveData($data);

echo json_encode([
    'status'                => 'ok',
    'new_visitor'           => $isNew,
    'total_unique_visitors' => $data['total_unique_visitors'],
    'total_visits'          => $data['total_visits'],
    'ip_visits'             => $data['visitors'][$ip]['visits'],
]);