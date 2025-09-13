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
      title: "IDS/IPS Sistemleri",
      description: "Trafik izleme ve saldırı tespit sistemleri",
      icon: <Activity className="w-5 h-5" />,
      importance: "Kritik"
    },
    {
      title: "Rate Limiting",
      description: "Brute force ve DDoS saldırılarını önleme",
      icon: <RefreshCw className="w-5 h-5" />,
      importance: "Yüksek"
    },
    {
      title: "İki Faktörlü Kimlik Doğrulama",
      description: "SMS/E-posta ile ek güvenlik katmanı",
      icon: <Smartphone className="w-5 h-5" />,
      importance: "Yüksek"
    },
    {
      title: "Güvenlik Test Araçları",
      description: "Otomatik zafiyet tarama ve penetrasyon testleri",
      icon: <Search className="w-5 h-5" />,
      importance: "Yüksek"
    },
    {
      title: "Güncel Kütüphaneler",
      description: "Framework ve bağımlılıkların düzenli güncellenmesi",
      icon: <Zap className="w-5 h-5" />,
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

        {/* Security Testing */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <Search className="w-6 h-6 text-primary" />
            <span>Otomatik Güvenlik Testi</span>
          </h3>
          
          <CodeExample
            title="PHP Güvenlik Tarayıcı"
            description="Kendi projelerinizi taramak için basit güvenlik kontrol scripti."
            secureCode={`class SecurityScanner {
    private $results = [];
    
    public function scan($directory = '.') {
        $this->scanDirectory($directory);
        $this->checkConfiguration();
        $this->generateReport();
    }
    
    private function scanFile($file_path) {
        $content = file_get_contents($file_path);
        
        // SQL Injection kontrolü
        if (preg_match('/mysql_query.*\\$/', $content)) {
            $this->addResult('SQL_INJECTION', 'HIGH', $file_path, 
                'Prepared statement kullanın');
        }
        
        // XSS kontrolü
        if (preg_match('/echo.*\\$_(GET|POST)/', $content)) {
            $this->addResult('XSS', 'MEDIUM', $file_path, 
                'htmlspecialchars() kullanın');
        }
        
        // File inclusion kontrolü
        if (preg_match('/include.*\\$_(GET|POST)/', $content)) {
            $this->addResult('FILE_INCLUSION', 'HIGH', $file_path, 
                'Kullanıcı kontrolündeki dosya dahil etme');
        }
    }
    
    private function checkConfiguration() {
        $dangerous_settings = [
            'display_errors' => ini_get('display_errors'),
            'expose_php' => ini_get('expose_php'),
            'allow_url_include' => ini_get('allow_url_include')
        ];
        
        foreach ($dangerous_settings as $setting => $value) {
            if ($value == '1') {
                $this->addResult('CONFIG', 'MEDIUM', 'php.ini', 
                    "Güvenli olmayan ayar: $setting");
            }
        }
    }
    
    private function generateReport() {
        echo "Güvenlik Tarama Raporu\\n";
        echo "=====================\\n";
        echo "Toplam Sorun: " . count($this->results) . "\\n\\n";
        
        foreach ($this->results as $result) {
            echo "[{$result['risk']}] {$result['type']}\\n";
            echo "Dosya: {$result['file']}\\n";
            echo "Açıklama: {$result['description']}\\n\\n";
        }
    }
}`}
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