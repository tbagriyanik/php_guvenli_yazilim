import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Zap, Shield, Activity, Smartphone, Search, RefreshCw } from "lucide-react";
import CodeExample from "@/components/CodeExample";

const AdvancedLevel = () => {
  const securityMeasures = [
    {
      title: "Web Application Firewall (WAF)",
      description: "Uygulama seviyesinde saldırı tespiti ve engelleme",
      icon: <Shield className="w-5 h-5" />,
      importance: "Kritik"
    },
    {
      title: "Rate Limiting & DDoS Koruması",
      description: "Brute force ve DDoS saldırılarını önleme",
      icon: <RefreshCw className="w-5 h-5" />,
      importance: "Kritik"
    },
    {
      title: "İki Faktörlü Kimlik Doğrulama",
      description: "TOTP/SMS ile ek güvenlik katmanı",
      icon: <Smartphone className="w-5 h-5" />,
      importance: "Yüksek"
    },
    {
      title: "API Güvenliği",
      description: "JWT, OAuth, API rate limiting ve güvenlik",
      icon: <Activity className="w-5 h-5" />,
      importance: "Kritik"
    },
    {
      title: "Güvenlik İzleme & Log Analizi",
      description: "SIEM sistemleri ve güvenlik olay izleme",
      icon: <Search className="w-5 h-5" />,
      importance: "Yüksek"
    },
    {
      title: "Veritabanı Güvenlik Sertleştirme",
      description: "DB encryption, backup güvenliği, audit logs",
      icon: <Zap className="w-5 h-5" />,
      importance: "Kritik"
    },
    {
      title: "Container & DevOps Güvenliği",
      description: "Docker, Kubernetes güvenliği ve CI/CD pipeline",
      icon: <Shield className="w-5 h-5" />,
      importance: "Yüksek"
    },
    {
      title: "Olay Müdahale Planı",
      description: "Incident response ve disaster recovery",
      icon: <Activity className="w-5 h-5" />,
      importance: "Yüksek"
    },
    {
      title: "Compliance & Audit",
      description: "GDPR, ISO 27001, PCI DSS uyumluluğu",
      icon: <Search className="w-5 h-5" />,
      importance: "Orta"
    }
  ];

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "Kritik":
        return "bg-danger/20 text-danger border-danger/30";
      case "Yüksek":
        return "bg-warning/20 text-warning border-warning/30";
      case "Orta":
        return "bg-success/20 text-success border-success/30";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="flex items-center justify-center space-x-3">
          <Zap className="w-12 h-12 text-danger animate-security-pulse" />
          <h1 className="text-4xl font-bold gradient-text">İleri Seviye</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Profesyonel güvenlik çözümleri ve kurumsal düzeyde koruma sistemleri.
        </p>
        <Badge className="bg-danger/20 text-danger border-danger/30 text-lg px-4 py-2">
          Profesyonel Güvenlik Sistemleri
        </Badge>
      </div>

      {/* Security Measures Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityMeasures.map((measure, index) => (
          <Card key={index} className="security-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-primary">
                    {measure.icon}
                  </div>
                  <CardTitle className="text-lg">{measure.title}</CardTitle>
                </div>
                <Badge className={getImportanceBadge(measure.importance)}>
                  {measure.importance}
                </Badge>
              </div>
              <CardDescription>
                {measure.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Detailed Examples */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Detaylı Örnekler ve Çözümler</h2>

        {/* WAF Implementation */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <Shield className="w-6 h-6 text-primary" />
            <span>Web Application Firewall (WAF)</span>
          </h3>
          
          <CodeExample
            title="Basit WAF Implementasyonu"
            description="PHP ile temel WAF kuralları ve saldırı tespiti."
            secureCode={`class SimpleWAF {
    private $rules = [
        'sql_injection' => [
            '/union\\s+select/i',
            '/select\\s+.*\\s+from/i',
            '/insert\\s+into/i'
        ],
        'xss' => [
            '/<script[^>]*>/i',
            '/javascript:/i',
            '/on\\w+\\s*=/i'
        ]
    ];
    
    public function analyzeRequest() {
        $request_data = array_merge($_GET, $_POST);
        
        foreach ($this->rules as $category => $patterns) {
            foreach ($patterns as $pattern) {
                foreach ($request_data as $key => $value) {
                    if (preg_match($pattern, $value)) {
                        $this->blockRequest($category);
                    }
                }
            }
        }
    }
    
    private function blockRequest($reason) {
        http_response_code(403);
        echo json_encode(['error' => 'Request blocked: ' . $reason]);
        exit;
    }
}`}
            type="secure"
          />
        </div>

        {/* Rate Limiting */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 text-primary" />
            <span>Rate Limiting ve Brute Force Koruması</span>
          </h3>
          
          <CodeExample
            title="Redis Tabanlı Rate Limiting"
            description="Redis kullanarak yüksek performanslı rate limiting sistemi."
            secureCode={`class RateLimit {
    private $redis;
    
    public function __construct() {
        $this->redis = new Redis();
        $this->redis->connect('127.0.0.1', 6379);
    }
    
    public function checkLimit($identifier, $max_requests = 100, $window = 60) {
        $key = "rate_limit:" . $identifier;
        $current = $this->redis->get($key);
        
        if ($current === false) {
            $this->redis->setex($key, $window, 1);
            return true;
        }
        
        if ($current >= $max_requests) {
            return false;
        }
        
        $this->redis->incr($key);
        return true;
    }
    
    public function blockBruteForce($ip, $max_attempts = 5) {
        $key = "brute_force:" . $ip;
        $attempts = $this->redis->incr($key);
        $this->redis->expire($key, 300); // 5 dakika
        
        if ($attempts > $max_attempts) {
            $this->redis->setex("blocked:" . $ip, 1800, 1); // 30 dakika blok
            return false;
        }
        
        return true;
    }
}`}
            type="secure"
          />
        </div>

        {/* 2FA Implementation */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <Smartphone className="w-6 h-6 text-primary" />
            <span>İki Faktörlü Kimlik Doğrulama (2FA)</span>
          </h3>
          
          <CodeExample
            title="TOTP Tabanlı 2FA Sistemi"
            description="Google Authenticator uyumlu TOTP sistemi."
            secureCode={`class TwoFactorAuth {
    
    public static function generateSecret() {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $secret = '';
        for ($i = 0; $i < 32; $i++) {
            $secret .= $chars[random_int(0, strlen($chars) - 1)];
        }
        return $secret;
    }
    
    public static function generateTOTP($secret, $timestamp = null) {
        if ($timestamp === null) {
            $timestamp = time();
        }
        
        $time_slice = floor($timestamp / 30);
        $secret_binary = self::base32Decode($secret);
        
        $hash = hash_hmac('sha1', pack('N*', 0, $time_slice), $secret_binary, true);
        $offset = ord($hash[19]) & 0xf;
        
        $code = (
            ((ord($hash[$offset]) & 0x7f) << 24) |
            ((ord($hash[$offset + 1]) & 0xff) << 16) |
            ((ord($hash[$offset + 2]) & 0xff) << 8) |
            (ord($hash[$offset + 3]) & 0xff)
        ) % 1000000;
        
        return sprintf('%06d', $code);
    }
    
    public static function verifyTOTP($secret, $user_code, $tolerance = 1) {
        $timestamp = time();
        
        for ($i = -$tolerance; $i <= $tolerance; $i++) {
            $test_timestamp = $timestamp + ($i * 30);
            $valid_code = self::generateTOTP($secret, $test_timestamp);
            
            if (hash_equals($valid_code, $user_code)) {
                return true;
            }
        }
        
        return false;
    }
}`}
            type="secure"
          />
        </div>

        {/* API Security */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <Activity className="w-6 h-6 text-primary" />
            <span>API Güvenliği ve JWT Yönetimi</span>
          </h3>
          
          <CodeExample
            title="JWT Tabanlı API Güvenliği"
            description="Güvenli JWT token oluşturma, doğrulama ve API endpoint koruması."
            secureCode={`// ✅ JWT API Güvenlik Sistemi
class JWTManager {
    private $secret_key;
    private $algorithm = 'HS256';
    
    public function __construct() {
        $this->secret_key = $_ENV['JWT_SECRET_KEY'] ?? bin2hex(random_bytes(32));
    }
    
    // JWT Token oluşturma
    public function createToken($user_id, $roles = [], $expires_in = 3600) {
        $issued_at = time();
        $expiration = $issued_at + $expires_in;
        
        $payload = [
            'iss' => $_SERVER['HTTP_HOST'], // Issuer
            'aud' => $_SERVER['HTTP_HOST'], // Audience
            'iat' => $issued_at,           // Issued at
            'exp' => $expiration,          // Expiration
            'sub' => $user_id,             // Subject (user ID)
            'roles' => $roles,             // User roles
            'jti' => uniqid(),             // JWT ID
        ];
        
        return $this->encode($payload);
    }
    
    // Token doğrulama
    public function verifyToken($token) {
        try {
            $payload = $this->decode($token);
            
            // Expiration kontrolü
            if ($payload['exp'] < time()) {
                throw new Exception('Token expired');
            }
            
            // Issuer kontrolü
            if ($payload['iss'] !== $_SERVER['HTTP_HOST']) {
                throw new Exception('Invalid issuer');
            }
            
            return $payload;
        } catch (Exception $e) {
            return false;
        }
    }
    
    // Refresh token sistemi
    public function refreshToken($old_token) {
        $payload = $this->verifyToken($old_token);
        if (!$payload) {
            return false;
        }
        
        // Refresh sadece son 5 dakikada mümkün
        if ($payload['exp'] - time() > 300) {
            throw new Exception('Token still valid, refresh not needed');
        }
        
        return $this->createToken($payload['sub'], $payload['roles']);
    }
    
    private function encode($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => $this->algorithm]);
        $payload = json_encode($payload);
        
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $this->secret_key, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }
    
    private function decode($jwt) {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) {
            throw new Exception('Invalid JWT format');
        }
        
        [$header, $payload, $signature] = $parts;
        
        $header = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $header)), true);
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);
        
        // Signature verification
        $expected_signature = str_replace(['+', '/', '='], ['-', '_', ''], 
            base64_encode(hash_hmac('sha256', $parts[0] . "." . $parts[1], $this->secret_key, true)));
        
        if (!hash_equals($signature, $expected_signature)) {
            throw new Exception('Invalid signature');
        }
        
        return $payload;
    }
}

// API Middleware
class APISecurityMiddleware {
    private $jwt_manager;
    private $rate_limiter;
    
    public function __construct() {
        $this->jwt_manager = new JWTManager();
        $this->rate_limiter = new RateLimit();
    }
    
    public function authenticate($required_role = null) {
        // Rate limiting kontrolü
        $client_ip = $_SERVER['REMOTE_ADDR'];
        if (!$this->rate_limiter->checkLimit($client_ip, 1000, 3600)) { // 1000 req/hour
            $this->sendError(429, 'Rate limit exceeded');
        }
        
        // Authorization header kontrolü
        $headers = getallheaders();
        if (!isset($headers['Authorization'])) {
            $this->sendError(401, 'Authorization header missing');
        }
        
        $auth_header = $headers['Authorization'];
        if (!preg_match('/Bearer\\s+(\\S+)/', $auth_header, $matches)) {
            $this->sendError(401, 'Invalid authorization format');
        }
        
        $token = $matches[1];
        $payload = $this->jwt_manager->verifyToken($token);
        
        if (!$payload) {
            $this->sendError(401, 'Invalid or expired token');
        }
        
        // Role kontrolü
        if ($required_role && !in_array($required_role, $payload['roles'])) {
            $this->sendError(403, 'Insufficient permissions');
        }
        
        // Request'e user bilgisini ekle
        $_REQUEST['authenticated_user'] = [
            'id' => $payload['sub'],
            'roles' => $payload['roles']
        ];
        
        return true;
    }
    
    private function sendError($code, $message) {
        http_response_code($code);
        header('Content-Type: application/json');
        echo json_encode([
            'error' => $message,
            'code' => $code,
            'timestamp' => date('c')
        ]);
        exit;
    }
}

// API endpoint kullanımı
$api = new APISecurityMiddleware();

// Public endpoint
if ($_SERVER['REQUEST_URI'] === '/api/public') {
    echo json_encode(['message' => 'Public data']);
    exit;
}

// Protected endpoint
$api->authenticate();
if ($_SERVER['REQUEST_URI'] === '/api/user/profile') {
    $user = $_REQUEST['authenticated_user'];
    echo json_encode(['user_id' => $user['id'], 'data' => 'Protected user data']);
    exit;
}

// Admin only endpoint
$api->authenticate('admin');
if ($_SERVER['REQUEST_URI'] === '/api/admin/users') {
    echo json_encode(['message' => 'Admin only data']);
    exit;
}`}
            language="php"
            type="secure"
          />
        </div>

        {/* Database Security */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <Zap className="w-6 h-6 text-primary" />
            <span>Veritabanı Güvenlik Sertleştirme</span>
          </h3>
          
          <CodeExample
            title="Veritabanı Şifreleme ve Audit Sistemi"
            description="Hassas verilerin şifrelenmesi ve veritabanı işlemlerinin audit edilmesi."
            secureCode={`// ✅ Veritabanı Güvenlik ve Şifreleme Sistemi
class DatabaseSecurity {
    private $pdo;
    private $encryption_key;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->encryption_key = $_ENV['DB_ENCRYPTION_KEY'] ?? $this->generateKey();
        $this->setupAuditTables();
    }
    
    // AES-256-GCM ile şifreleme
    public function encrypt($data) {
        if (empty($data)) return $data;
        
        $iv = random_bytes(16);
        $tag = '';
        $encrypted = openssl_encrypt($data, 'aes-256-gcm', $this->encryption_key, OPENSSL_RAW_DATA, $iv, $tag);
        
        return base64_encode($iv . $tag . $encrypted);
    }
    
    // Şifre çözme
    public function decrypt($encrypted_data) {
        if (empty($encrypted_data)) return $encrypted_data;
        
        $data = base64_decode($encrypted_data);
        $iv = substr($data, 0, 16);
        $tag = substr($data, 16, 16);
        $encrypted = substr($data, 32);
        
        return openssl_decrypt($encrypted, 'aes-256-gcm', $this->encryption_key, OPENSSL_RAW_DATA, $iv, $tag);
    }
    
    // Güvenli kullanıcı kaydetme
    public function createUser($email, $password, $personal_data) {
        try {
            $this->pdo->beginTransaction();
            
            // Parolayı hashle
            $password_hash = password_hash($password, PASSWORD_ARGON2ID, [
                'memory_cost' => 65536, // 64 MB
                'time_cost' => 4,       // 4 iterations
                'threads' => 3          // 3 threads
            ]);
            
            // Hassas verileri şifrele
            $encrypted_phone = $this->encrypt($personal_data['phone']);
            $encrypted_address = $this->encrypt($personal_data['address']);
            $encrypted_ssn = $this->encrypt($personal_data['ssn']);
            
            // Kullanıcı oluştur
            $stmt = $this->pdo->prepare("
                INSERT INTO users (email, password_hash, phone_encrypted, address_encrypted, ssn_encrypted, created_at) 
                VALUES (?, ?, ?, ?, ?, NOW())
            ");
            
            $result = $stmt->execute([
                $email,
                $password_hash,
                $encrypted_phone,
                $encrypted_address,
                $encrypted_ssn
            ]);
            
            $user_id = $this->pdo->lastInsertId();
            
            // Audit log
            $this->logAuditEvent('USER_CREATED', $user_id, [
                'email' => $email,
                'ip' => $_SERVER['REMOTE_ADDR'],
                'user_agent' => $_SERVER['HTTP_USER_AGENT']
            ]);
            
            $this->pdo->commit();
            return $user_id;
            
        } catch (Exception $e) {
            $this->pdo->rollBack();
            $this->logAuditEvent('USER_CREATE_FAILED', null, [
                'email' => $email,
                'error' => $e->getMessage(),
                'ip' => $_SERVER['REMOTE_ADDR']
            ]);
            throw $e;
        }
    }
    
    // Güvenli veri okuma
    public function getUserData($user_id) {
        $stmt = $this->pdo->prepare("
            SELECT email, phone_encrypted, address_encrypted, created_at,
                   last_login, login_attempts, account_locked
            FROM users 
            WHERE id = ?
        ");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();
        
        if ($user) {
            // Hassas verileri çöz
            $user['phone'] = $this->decrypt($user['phone_encrypted']);
            $user['address'] = $this->decrypt($user['address_encrypted']);
            unset($user['phone_encrypted'], $user['address_encrypted']);
            
            // Audit log
            $this->logAuditEvent('USER_DATA_ACCESSED', $user_id, [
                'ip' => $_SERVER['REMOTE_ADDR'],
                'fields_accessed' => array_keys($user)
            ]);
        }
        
        return $user;
    }
    
    // Audit log sistemi
    private function logAuditEvent($event_type, $user_id, $details) {
        $stmt = $this->pdo->prepare("
            INSERT INTO audit_logs (event_type, user_id, ip_address, user_agent, details, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        
        $stmt->execute([
            $event_type,
            $user_id,
            $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            json_encode($details)
        ]);
    }
    
    // Veritabanı güvenlik analizi
    public function securityAuditReport($days = 30) {
        $stmt = $this->pdo->prepare("
            SELECT 
                event_type,
                COUNT(*) as count,
                COUNT(DISTINCT user_id) as unique_users,
                COUNT(DISTINCT ip_address) as unique_ips,
                DATE(created_at) as date
            FROM audit_logs 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY event_type, DATE(created_at)
            ORDER BY created_at DESC
        ");
        $stmt->execute([$days]);
        
        return $stmt->fetchAll();
    }
    
    // Şüpheli aktivite tespiti
    public function detectSuspiciousActivity() {
        $suspicious_events = [];
        
        // Çok fazla başarısız giriş
        $stmt = $this->pdo->prepare("
            SELECT ip_address, COUNT(*) as failed_attempts
            FROM audit_logs 
            WHERE event_type = 'LOGIN_FAILED' 
            AND created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
            GROUP BY ip_address 
            HAVING failed_attempts > 10
        ");
        $stmt->execute();
        $suspicious_events['brute_force'] = $stmt->fetchAll();
        
        // Gece vakti erişimler
        $stmt = $this->pdo->prepare("
            SELECT user_id, ip_address, COUNT(*) as night_access
            FROM audit_logs 
            WHERE HOUR(created_at) BETWEEN 0 AND 5
            AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY user_id, ip_address
            HAVING night_access > 5
        ");
        $stmt->execute();
        $suspicious_events['night_access'] = $stmt->fetchAll();
        
        return $suspicious_events;
    }
    
    private function setupAuditTables() {
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS audit_logs (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                event_type VARCHAR(50) NOT NULL,
                user_id INT NULL,
                ip_address VARCHAR(45) NOT NULL,
                user_agent TEXT,
                details JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_event_type (event_type),
                INDEX idx_user_id (user_id),
                INDEX idx_created_at (created_at)
            )
        ");
    }
    
    private function generateKey() {
        return base64_encode(random_bytes(32));
    }
}

// Kullanım örneği
$dbSecurity = new DatabaseSecurity($pdo);

// Yeni kullanıcı oluşturma
$user_id = $dbSecurity->createUser('user@example.com', 'StrongP@ssw0rd', [
    'phone' => '+90 555 123 4567',
    'address' => 'İstanbul, Türkiye',
    'ssn' => '12345678901'
]);

// Güvenlik raporu
$security_report = $dbSecurity->securityAuditReport(30);
$suspicious_activity = $dbSecurity->detectSuspiciousActivity();`}
            language="php"
            type="secure"
          />
        </div>

        {/* Security Monitoring */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <Search className="w-6 h-6 text-primary" />
            <span>Güvenlik İzleme ve SIEM</span>
          </h3>
          
          <CodeExample
            title="Real-time Güvenlik İzleme Sistemi"
            description="SIEM benzeri güvenlik olay izleme ve alarm sistemi."
            secureCode={`// ✅ Güvenlik İzleme ve Alert Sistemi
class SecurityMonitoring {
    private $pdo;
    private $alert_thresholds;
    private $notification_channels;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->alert_thresholds = [
            'failed_logins' => ['count' => 5, 'window' => 300], // 5 dakikada 5 başarısız
            'suspicious_ips' => ['count' => 100, 'window' => 3600], // Saatte 100 istek
            'data_access' => ['count' => 50, 'window' => 1800], // 30 dakikada 50 veri erişimi
            'admin_actions' => ['count' => 1, 'window' => 0] // Her admin işlemi
        ];
        
        $this->notification_channels = [
            'email' => 'security@company.com',
            'slack' => $_ENV['SLACK_WEBHOOK_URL'],
            'sms' => '+90555XXXXXXX'
        ];
    }
    
    // Güvenlik olayını işle ve değerlendir
    public function processSecurityEvent($event_type, $user_id, $ip_address, $details = []) {
        // Event'i kaydet
        $event_id = $this->logSecurityEvent($event_type, $user_id, $ip_address, $details);
        
        // Threshold kontrolü
        $this->checkThresholds($event_type, $user_id, $ip_address);
        
        // Anomali tespiti
        $this->detectAnomalies($event_type, $user_id, $ip_address, $details);
        
        // Real-time dashboard güncellemesi
        $this->updateDashboard($event_type, $user_id, $ip_address);
        
        return $event_id;
    }
    
    // Güvenlik olayını kaydet
    private function logSecurityEvent($event_type, $user_id, $ip_address, $details) {
        $stmt = $this->pdo->prepare("
            INSERT INTO security_events (
                event_type, user_id, ip_address, user_agent, 
                request_uri, details, severity, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        
        $severity = $this->calculateSeverity($event_type, $details);
        
        $stmt->execute([
            $event_type,
            $user_id,
            $ip_address,
            $_SERVER['HTTP_USER_AGENT'] ?? '',
            $_SERVER['REQUEST_URI'] ?? '',
            json_encode($details),
            $severity
        ]);
        
        return $this->pdo->lastInsertId();
    }
    
    // Threshold kontrolü
    private function checkThresholds($event_type, $user_id, $ip_address) {
        if (!isset($this->alert_thresholds[$event_type])) {
            return;
        }
        
        $threshold = $this->alert_thresholds[$event_type];
        $window = $threshold['window'];
        $max_count = $threshold['count'];
        
        if ($window > 0) {
            $stmt = $this->pdo->prepare("
                SELECT COUNT(*) as event_count
                FROM security_events 
                WHERE event_type = ? 
                AND (ip_address = ? OR user_id = ?)
                AND created_at >= DATE_SUB(NOW(), INTERVAL ? SECOND)
            ");
            $stmt->execute([$event_type, $ip_address, $user_id, $window]);
            
            $count = $stmt->fetchColumn();
            
            if ($count >= $max_count) {
                $this->triggerAlert($event_type, $user_id, $ip_address, [
                    'count' => $count,
                    'threshold' => $max_count,
                    'window' => $window
                ]);
            }
        } else {
            // Immediate alert
            $this->triggerAlert($event_type, $user_id, $ip_address, []);
        }
    }
    
    // Alert tetikle
    private function triggerAlert($event_type, $user_id, $ip_address, $context) {
        $alert_data = [
            'id' => uniqid('ALERT_'),
            'event_type' => $event_type,
            'user_id' => $user_id,
            'ip_address' => $ip_address,
            'timestamp' => date('c'),
            'context' => $context,
            'severity' => $this->getAlertSeverity($event_type)
        ];
        
        // Alert'i kaydet
        $this->saveAlert($alert_data);
        
        // Bildirim gönder
        $this->sendNotifications($alert_data);
        
        // Otomatik aksiyonlar
        $this->executeAutomatedResponse($alert_data);
    }
    
    // Anomali tespiti
    private function detectAnomalies($event_type, $user_id, $ip_address, $details) {
        // IP coğrafi konum kontrolü
        if ($user_id) {
            $this->checkGeolocationAnomaly($user_id, $ip_address);
        }
        
        // Zaman anomalisi (normal saatler dışı erişim)
        $current_hour = (int)date('H');
        if ($current_hour < 6 || $current_hour > 22) {
            $this->processSecurityEvent('anomaly_time', $user_id, $ip_address, [
                'hour' => $current_hour,
                'original_event' => $event_type
            ]);
        }
        
        // Tarayıcı/User-Agent anomalisi
        $this->checkUserAgentAnomaly($user_id, $_SERVER['HTTP_USER_AGENT'] ?? '');
    }
    
    // Coğrafi konum anomalisi
    private function checkGeolocationAnomaly($user_id, $ip_address) {
        // Son 24 saatteki IP'leri al
        $stmt = $this->pdo->prepare("
            SELECT DISTINCT ip_address
            FROM security_events 
            WHERE user_id = ? 
            AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            ORDER BY created_at DESC
            LIMIT 10
        ");
        $stmt->execute([$user_id]);
        $recent_ips = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (!in_array($ip_address, $recent_ips) && count($recent_ips) > 0) {
            // Yeni IP - geolocation check gerekli
            $this->processSecurityEvent('anomaly_geolocation', $user_id, $ip_address, [
                'new_ip' => $ip_address,
                'recent_ips' => $recent_ips
            ]);
        }
    }
    
    // Otomatik güvenlik aksiyonları
    private function executeAutomatedResponse($alert_data) {
        switch ($alert_data['event_type']) {
            case 'failed_logins':
                if ($alert_data['context']['count'] >= 10) {
                    $this->blockIP($alert_data['ip_address'], 3600); // 1 saat blok
                }
                break;
                
            case 'suspicious_ips':
                $this->blockIP($alert_data['ip_address'], 1800); // 30 dakika blok
                break;
                
            case 'admin_actions':
                // Admin işlemlerini hemen bildir
                $this->sendUrgentNotification($alert_data);
                break;
        }
    }
    
    // Real-time dashboard
    public function getDashboardData() {
        $data = [];
        
        // Son 24 saatteki event'ler
        $stmt = $this->pdo->prepare("
            SELECT 
                event_type,
                COUNT(*) as count,
                AVG(severity) as avg_severity
            FROM security_events 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            GROUP BY event_type
            ORDER BY count DESC
        ");
        $stmt->execute();
        $data['events_24h'] = $stmt->fetchAll();
        
        // Aktif alertler
        $stmt = $this->pdo->prepare("
            SELECT * FROM security_alerts 
            WHERE status = 'active' 
            ORDER BY created_at DESC 
            LIMIT 10
        ");
        $stmt->execute();
        $data['active_alerts'] = $stmt->fetchAll();
        
        // En çok saldırıya uğrayan IP'ler
        $stmt = $this->pdo->prepare("
            SELECT 
                ip_address,
                COUNT(*) as attack_count,
                MAX(created_at) as last_attack
            FROM security_events 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            AND severity >= 7
            GROUP BY ip_address
            ORDER BY attack_count DESC
            LIMIT 10
        ");
        $stmt->execute();
        $data['top_attacking_ips'] = $stmt->fetchAll();
        
        return $data;
    }
    
    // Güvenlik raporu oluştur
    public function generateSecurityReport($start_date, $end_date) {
        $report = [
            'period' => ['start' => $start_date, 'end' => $end_date],
            'summary' => $this->getEventSummary($start_date, $end_date),
            'top_threats' => $this->getTopThreats($start_date, $end_date),
            'incident_timeline' => $this->getIncidentTimeline($start_date, $end_date),
            'recommendations' => $this->generateRecommendations($start_date, $end_date)
        ];
        
        return $report;
    }
}`}
            language="php"
            type="secure"
          />
        </div>
      </div>

      {/* Repair Steps */}
      <Card className="security-card bg-danger/5 border-danger/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Tamir Aşamaları</span>
          </CardTitle>
          <CardDescription>
            İleri seviye güvenlik ihlallerinin tespiti ve müdahale planları.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-primary">1. Saldırı Tespit Edildiğinde</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Güvenlik loglarını derhal inceleyin ve saldırı kapsamını belirleyin</li>
              <li>Saldırgan IP adreslerini tespit edin ve firewall'dan engelleyin</li>
              <li>WAF kurallarını güncelleyin ve benzer saldırıları önleyin</li>
              <li>Etkilenen kullanıcıları tespit edin ve bilgilendirin</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-primary">2. Brute Force Saldırısı Müdahalesi</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Rate limiting kurallarını gözden geçirin ve sıkılaştırın</li>
              <li>Captcha sistemini devreye alın</li>
              <li>Hedef alınan hesapları geçici olarak kilitleyin</li>
              <li>2FA zorunluluğunu tüm hesaplara uygulayın</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-primary">3. Sistem Güncellemeleri ve Bakım</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Tüm framework ve kütüphaneleri en son sürüme güncelleyin</li>
              <li>Güvenlik yamalarını derhal uygulayın</li>
              <li>Düzenli penetrasyon testleri planlayın</li>
              <li>Güvenlik loglarını merkezi sistem üzerinde toplayın</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedLevel;