import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Users, Upload, Globe, FileText, Database } from "lucide-react";
import CodeExample from "@/components/CodeExample";

const IntermediateLevel = () => {
  const securityMeasures = [
    {
      title: "Rol Bazlı Erişim (RBAC)",
      description: "Kullanıcıların yetki seviyelerine göre erişim kontrolü",
      icon: <Users className="w-5 h-5" />,
      importance: "Kritik"
    },
    {
      title: "Dosya Yükleme Güvenliği",
      description: "MIME type, uzantı ve boyut kontrolü ile güvenli dosya yükleme",
      icon: <Upload className="w-5 h-5" />,
      importance: "Yüksek"
    },
    {
      title: "Input Doğrulama",
      description: "White-list mantığıyla kullanıcı girdilerini doğrulama",
      icon: <FileText className="w-5 h-5" />,
      importance: "Yüksek"
    },
    {
      title: "HTTPS Zorunluluğu",
      description: "SSL sertifikası ile şifreli veri iletimi",
      icon: <Globe className="w-5 h-5" />,
      importance: "Kritik"
    },
    {
      title: "Güvenli Hata Yönetimi",
      description: "Error logları ve kullanıcı dostu hata mesajları",
      icon: <AlertTriangle className="w-5 h-5" />,
      importance: "Orta"
    },
    {
      title: "Veritabanı Yedekleme",
      description: "Düzenli yedekleme ve geri yükleme testleri",
      icon: <Database className="w-5 h-5" />,
      importance: "Yüksek"
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
          <AlertTriangle className="w-12 h-12 text-warning animate-security-pulse" />
          <h1 className="text-4xl font-bold gradient-text">Orta Seviye</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Gelişmiş güvenlik önlemleri ve profesyonel uygulamalar için gerekli güvenlik katmanları.
        </p>
        <Badge className="bg-warning/20 text-warning border-warning/30 text-lg px-4 py-2">
          Gelişmiş Güvenlik Önlemleri
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

        {/* RBAC System */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <Users className="w-6 h-6 text-primary" />
            <span>Rol Bazlı Erişim Kontrolü (RBAC)</span>
          </h3>
          
          <CodeExample
            title="RBAC Sistem Implementasyonu"
            description="Kullanıcı rollerine göre sayfa ve işlem erişimlerini kontrol etme."
            secureCode={`// ✅ RBAC Sistem Örneği
class RoleManager {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    // Kullanıcının rolünü alma
    public function getUserRole($user_id) {
        $stmt = $this->pdo->prepare("
            SELECT r.name as role_name, r.permissions 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.id = ?
        ");
        $stmt->execute([$user_id]);
        return $stmt->fetch();
    }
    
    // Yetki kontrolü
    public function hasPermission($user_id, $permission) {
        $role = $this->getUserRole($user_id);
        if (!$role) return false;
        
        $permissions = json_decode($role['permissions'], true);
        return in_array($permission, $permissions);
    }
    
    // Middleware fonksionu
    public function requirePermission($permission) {
        if (!isset($_SESSION['user_id'])) {
            header('Location: login.php');
            exit;
        }
        
        if (!$this->hasPermission($_SESSION['user_id'], $permission)) {
            http_response_code(403);
            die('Bu işlem için yetkiniz bulunmamaktadır.');
        }
    }
}

// Kullanım örneği
session_start();
$roleManager = new RoleManager($pdo);

// Admin paneli erişimi
$roleManager->requirePermission('admin_access');

// Kullanıcı düzenleme yetkisi
if ($roleManager->hasPermission($_SESSION['user_id'], 'edit_users')) {
    // Kullanıcı düzenleme formunu göster
} else {
    echo "Bu işlem için yetkiniz yok.";
}`}
            type="secure"
          />
        </div>

        {/* File Upload Security */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <Upload className="w-6 h-6 text-primary" />
            <span>Güvenli Dosya Yükleme</span>
          </h3>
          
          <CodeExample
            title="Dosya Yükleme Güvenlik Kontrolleri"
            description="Zararlı dosya yüklemelerini önlemek için çoklu güvenlik katmanı."
            vulnerableCode={`// ❌ GÜVENSİZ - Dosya yükleme
$upload_dir = 'uploads/';
$uploaded_file = $upload_dir . $_FILES['file']['name'];

if (move_uploaded_file($_FILES['file']['tmp_name'], $uploaded_file)) {
    echo "Dosya yüklendi: " . $uploaded_file;
}

// Bu kod PHP shell yüklenmesine izin verir!`}
            secureCode={`// ✅ GÜVENLİ - Comprehensive dosya yükleme güvenliği
class SecureFileUpload {
    private $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    private $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
    private $max_file_size = 5242880; // 5MB
    private $upload_dir = 'uploads/';
    
    public function uploadFile($file) {
        // 1. Dosya var mı kontrolü
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Dosya yükleme hatası.');
        }
        
        // 2. Dosya boyutu kontrolü
        if ($file['size'] > $this->max_file_size) {
            throw new Exception('Dosya boyutu çok büyük.');
        }
        
        // 3. MIME type kontrolü
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mime_type, $this->allowed_types)) {
            throw new Exception('İzin verilmeyen dosya tipi.');
        }
        
        // 4. Dosya uzantısı kontrolü
        $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($file_extension, $this->allowed_extensions)) {
            throw new Exception('İzin verilmeyen dosya uzantısı.');
        }
        
        // 5. Güvenli dosya adı oluşturma
        $safe_filename = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file['name']);
        $upload_path = $this->upload_dir . $safe_filename;
        
        // 6. Dosyayı taşıma
        if (move_uploaded_file($file['tmp_name'], $upload_path)) {
            return $safe_filename;
        } else {
            throw new Exception('Dosya yükleme başarısız.');
        }
    }
}

// Kullanım
try {
    $uploader = new SecureFileUpload();
    $filename = $uploader->uploadFile($_FILES['upload']);
    echo "Dosya güvenli şekilde yüklendi: " . htmlspecialchars($filename);
} catch (Exception $e) {
    echo "Hata: " . htmlspecialchars($e->getMessage());
}`}
            type="secure"
          />
        </div>

        {/* Input Validation */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <FileText className="w-6 h-6 text-primary" />
            <span>Gelişmiş Input Doğrulama</span>
          </h3>
          
          <CodeExample
            title="White-list Tabanlı Input Doğrulama"
            description="Kullanıcı girdilerini white-list mantığıyla doğrulama ve temizleme."
            secureCode={`// ✅ Comprehensive Input Validation Class
class InputValidator {
    
    // E-posta doğrulama
    public static function validateEmail($email) {
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
    
    // Telefon numarası doğrulama (Türkiye formatı)
    public static function validatePhone($phone) {
        $phone = preg_replace('/[^0-9]/', '', $phone);
        return preg_match('/^(5[0-9]{2}[0-9]{3}[0-9]{4})$/', $phone);
    }
    
    // Güvenli string temizleme
    public static function sanitizeString($string, $max_length = 255) {
        $string = trim($string);
        $string = strip_tags($string);
        $string = htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
        return substr($string, 0, $max_length);
    }
    
    // Sayısal değer doğrulama
    public static function validateInteger($value, $min = null, $max = null) {
        $value = filter_var($value, FILTER_VALIDATE_INT);
        if ($value === false) return false;
        
        if ($min !== null && $value < $min) return false;
        if ($max !== null && $value > $max) return false;
        
        return $value;
    }
    
    // URL doğrulama
    public static function validateUrl($url) {
        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }
    
    // Güçlü parola kontrolü
    public static function validatePassword($password) {
        if (strlen($password) < 8) return false;
        if (!preg_match('/[A-Z]/', $password)) return false; // Büyük harf
        if (!preg_match('/[a-z]/', $password)) return false; // Küçük harf
        if (!preg_match('/[0-9]/', $password)) return false; // Rakam
        if (!preg_match('/[^A-Za-z0-9]/', $password)) return false; // Özel karakter
        return true;
    }
    
    // Form verilerini toplu doğrulama
    public static function validateForm($data, $rules) {
        $errors = [];
        $clean_data = [];
        
        foreach ($rules as $field => $rule) {
            $value = $data[$field] ?? '';
            
            // Required kontrolü
            if ($rule['required'] && empty($value)) {
                $errors[$field] = $field . ' alanı zorunludur.';
                continue;
            }
            
            // Type kontrolü
            switch ($rule['type']) {
                case 'email':
                    if (!self::validateEmail($value)) {
                        $errors[$field] = 'Geçerli bir e-posta adresi giriniz.';
                    } else {
                        $clean_data[$field] = $value;
                    }
                    break;
                    
                case 'string':
                    $max_length = $rule['max_length'] ?? 255;
                    $clean_data[$field] = self::sanitizeString($value, $max_length);
                    break;
                    
                case 'integer':
                    $min = $rule['min'] ?? null;
                    $max = $rule['max'] ?? null;
                    $validated = self::validateInteger($value, $min, $max);
                    if ($validated === false) {
                        $errors[$field] = 'Geçerli bir sayı giriniz.';
                    } else {
                        $clean_data[$field] = $validated;
                    }
                    break;
            }
        }
        
        return ['errors' => $errors, 'data' => $clean_data];
    }
}

// Kullanım örneği
$validation_rules = [
    'email' => ['required' => true, 'type' => 'email'],
    'name' => ['required' => true, 'type' => 'string', 'max_length' => 100],
    'age' => ['required' => false, 'type' => 'integer', 'min' => 18, 'max' => 120],
    'password' => ['required' => true, 'type' => 'password']
];

$result = InputValidator::validateForm($_POST, $validation_rules);

if (empty($result['errors'])) {
    // Temiz veri ile işlem yap
    $clean_data = $result['data'];
    // Database işlemleri...
} else {
    // Hataları göster
    foreach ($result['errors'] as $error) {
        echo htmlspecialchars($error) . '<br>';
    }
}`}
            type="secure"
          />
        </div>

        {/* HTTPS Implementation */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <Globe className="w-6 h-6 text-primary" />
            <span>HTTPS Zorunluluğu ve SSL Güvenliği</span>
          </h3>
          
          <CodeExample
            title="HTTPS Yönlendirme ve Güvenlik Headers"
            description="SSL sertifikası ile güvenli bağlantı zorunluluğu ve güvenlik başlıkları."
            secureCode={`// ✅ HTTPS ve Güvenlik Headers
class SecurityHeaders {
    
    // HTTPS'e yönlendirme
    public static function forceHTTPS() {
        if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
            if (!headers_sent()) {
                $redirectURL = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
                header("Location: $redirectURL", true, 301);
                exit();
            }
        }
    }
    
    // Güvenlik başlıklarını ayarlama
    public static function setSecurityHeaders() {
        if (headers_sent()) return;
        
        // HSTS - HTTP Strict Transport Security
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
        
        // XSS Protection
        header('X-XSS-Protection: 1; mode=block');
        
        // Content Type Sniffing önleme
        header('X-Content-Type-Options: nosniff');
        
        // Clickjacking önleme
        header('X-Frame-Options: DENY');
        
        // Referrer Policy
        header('Referrer-Policy: strict-origin-when-cross-origin');
        
        // Content Security Policy
        $csp = "default-src 'self'; ";
        $csp .= "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; ";
        $csp .= "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ";
        $csp .= "font-src 'self' https://fonts.gstatic.com; ";
        $csp .= "img-src 'self' data: https:; ";
        $csp .= "connect-src 'self';";
        
        header("Content-Security-Policy: $csp");
        
        // Feature Policy
        header("Permissions-Policy: geolocation=(), microphone=(), camera=()");
    }
    
    // Güvenli cookie ayarları
    public static function setSecureCookie($name, $value, $expire = 0) {
        $secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';
        
        setcookie($name, $value, [
            'expires' => $expire,
            'path' => '/',
            'domain' => $_SERVER['HTTP_HOST'],
            'secure' => $secure,
            'httponly' => true,
            'samesite' => 'Strict'
        ]);
    }
    
    // Session güvenlik ayarları
    public static function secureSession() {
        // Session cookie parametrelerini ayarla
        $secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';
        
        session_set_cookie_params([
            'lifetime' => 3600, // 1 saat
            'path' => '/',
            'domain' => $_SERVER['HTTP_HOST'],
            'secure' => $secure,
            'httponly' => true,
            'samesite' => 'Strict'
        ]);
        
        // Session ID'yi düzenli olarak yenile
        if (!isset($_SESSION['last_regeneration'])) {
            $_SESSION['last_regeneration'] = time();
        } elseif (time() - $_SESSION['last_regeneration'] > 300) { // 5 dakika
            session_regenerate_id(true);
            $_SESSION['last_regeneration'] = time();
        }
    }
}

// Kullanım - her sayfanın başında
SecurityHeaders::forceHTTPS();
SecurityHeaders::setSecurityHeaders();

session_start();
SecurityHeaders::secureSession();

// .htaccess dosyası için öneriler:
/*
# HTTPS yönlendirme
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# PHP dosyalarına doğrudan erişimi engelle
<Files "*.php">
    Order Deny,Allow
    Deny from all
</Files>

# Sadece index.php'ye izin ver
<Files "index.php">
    Order Allow,Deny
    Allow from all
</Files>

# Hassas dosyaları gizle
<FilesMatch "\\.(htaccess|htpasswd|ini|log|sql|conf)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>
*/`}
            type="secure"
          />
        </div>
      </div>

      {/* Repair Steps */}
      <Card className="security-card bg-warning/5 border-warning/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Tamir Aşamaları</span>
          </CardTitle>
          <CardDescription>
            Orta seviye güvenlik açıklarının giderilmesi için adım adım rehber.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-primary">1. Yetkisiz Erişim Tamiri</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Mevcut yetkilendirme sistemini analiz edin</li>
              <li>RBAC tabanlı yeni sistem tasarlayın</li>
              <li>Minimum yetki prensibini uygulayın</li>
              <li>Session timeout ve yenileme mekanizmalarını ekleyin</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-primary">2. Dosya Yükleme Açığı Tamiri</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Yüklenen tüm dosyaları MIME type kontrolüne tabi tutun</li>
              <li>Dosya uzantısı white-list sistemi kurun</li>
              <li>Yüklenen dosyaları web dizini dışına taşıyın</li>
              <li>Dosya boyutu ve işlem süresi limitlerini uygulayın</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-primary">3. HTTPS ve Güvenlik Headers</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>SSL sertifikası yükleyin ve otomatik yenileme kurun</li>
              <li>HTTP trafiğini HTTPS'e yönlendirin</li>
              <li>Güvenlik başlıklarını tüm sayfalara ekleyin</li>
              <li>Content Security Policy (CSP) kurallarını tanımlayın</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntermediateLevel;