import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, UserCheck, Upload, ShoppingCart, MessageSquare, Database, Shield, Lock } from "lucide-react";
import CodeExample from "@/components/CodeExample";

const PracticalExamples = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="flex items-center justify-center space-x-3">
          <BookOpen className="w-12 h-12 text-primary animate-security-pulse" />
          <h1 className="text-4xl font-bold gradient-text">Uygulamalı Örnekler</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Gerçek dünya senaryolarına dayanan, baştan sona güvenli PHP-MySQL mini projeleri.
        </p>
        <Badge className="bg-primary/20 text-primary border-primary/30 text-lg px-4 py-2">
          Tam Proje Örnekleri
        </Badge>
      </div>

      <Separator />

      {/* Project 1: Secure Login System */}
      <section className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-success/10 text-success">
            <UserCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Proje 1: Güvenli Giriş Sistemi</h2>
            <p className="text-muted-foreground">Kayıt, giriş, oturum yönetimi ve şifre sıfırlama</p>
          </div>
        </div>

        <Tabs defaultValue="db" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="db">Veritabanı</TabsTrigger>
            <TabsTrigger value="register">Kayıt</TabsTrigger>
            <TabsTrigger value="login">Giriş</TabsTrigger>
            <TabsTrigger value="session">Oturum</TabsTrigger>
            <TabsTrigger value="reset">Şifre Sıfırla</TabsTrigger>
          </TabsList>

          <TabsContent value="db">
            <CodeExample
              title="Veritabanı Tablosu Oluşturma"
              description="Kullanıcı tablosu ve şifre sıfırlama tokenları için güvenli şema."
              secureCode={`-- Kullanıcılar tablosu
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    failed_login_attempts INT DEFAULT 0,
    locked_until DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Şifre sıfırlama token tablosu
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token_hash),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Giriş logları tablosu (brute force tespiti için)
CREATE TABLE login_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(500),
    success TINYINT(1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_ip (ip_address),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`}
              language="sql"
              type="secure"
            />
          </TabsContent>

          <TabsContent value="register">
            <CodeExample
              title="Güvenli Kayıt İşlemi"
              description="Input doğrulama, parola politikası ve güvenli kayıt akışı."
              vulnerableCode={`// ❌ GÜVENSİZ KAYIT
$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];

$query = "INSERT INTO users (username, email, password_hash) 
          VALUES ('$username', '$email', '$password')";
mysqli_query($conn, $query);

echo "Kayıt başarılı!";
// Sorunlar: SQL injection, düz metin parola, input doğrulama yok`}
              secureCode={`<?php
// ✅ GÜVENLİ KAYIT SİSTEMİ
session_start();
require_once 'config/database.php'; // PDO bağlantısı

class UserRegistration {
    private $pdo;
    private $errors = [];
    
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
    
    public function register(array $data): bool {
        // 1. CSRF Token doğrulama
        if (!$this->verifyCsrfToken($data['csrf_token'] ?? '')) {
            $this->errors[] = 'Geçersiz form isteği.';
            return false;
        }
        
        // 2. Input doğrulama
        $username = $this->sanitize($data['username'] ?? '');
        $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
        $password = $data['password'] ?? '';
        $password_confirm = $data['password_confirm'] ?? '';
        
        // 3. Kullanıcı adı kontrolü
        if (strlen($username) < 3 || strlen($username) > 50) {
            $this->errors[] = 'Kullanıcı adı 3-50 karakter olmalıdır.';
        }
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
            $this->errors[] = 'Kullanıcı adı sadece harf, rakam ve _ içerebilir.';
        }
        
        // 4. E-posta kontrolü
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->errors[] = 'Geçerli bir e-posta adresi giriniz.';
        }
        
        // 5. Parola politikası
        if (strlen($password) < 8) {
            $this->errors[] = 'Parola en az 8 karakter olmalıdır.';
        }
        if (!preg_match('/[A-Z]/', $password)) {
            $this->errors[] = 'Parola en az bir büyük harf içermelidir.';
        }
        if (!preg_match('/[0-9]/', $password)) {
            $this->errors[] = 'Parola en az bir rakam içermelidir.';
        }
        if (!preg_match('/[^A-Za-z0-9]/', $password)) {
            $this->errors[] = 'Parola en az bir özel karakter içermelidir.';
        }
        if ($password !== $password_confirm) {
            $this->errors[] = 'Parolalar eşleşmiyor.';
        }
        
        // 6. Benzersizlik kontrolü
        if ($this->isUserExists($username, $email)) {
            $this->errors[] = 'Bu kullanıcı adı veya e-posta zaten kayıtlı.';
        }
        
        if (!empty($this->errors)) {
            return false;
        }
        
        // 7. Güvenli kayıt
        try {
            $password_hash = password_hash($password, PASSWORD_ARGON2ID, [
                'memory_cost' => 65536,
                'time_cost' => 4,
                'threads' => 3
            ]);
            
            $stmt = $this->pdo->prepare("
                INSERT INTO users (username, email, password_hash) 
                VALUES (:username, :email, :password_hash)
            ");
            
            $stmt->execute([
                ':username' => $username,
                ':email' => $email,
                ':password_hash' => $password_hash
            ]);
            
            return true;
        } catch (PDOException $e) {
            error_log('Kayıt hatası: ' . $e->getMessage());
            $this->errors[] = 'Bir hata oluştu. Lütfen tekrar deneyin.';
            return false;
        }
    }
    
    private function isUserExists(string $username, string $email): bool {
        $stmt = $this->pdo->prepare(
            "SELECT COUNT(*) FROM users WHERE username = ? OR email = ?"
        );
        $stmt->execute([$username, $email]);
        return $stmt->fetchColumn() > 0;
    }
    
    private function sanitize(string $input): string {
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
    
    private function verifyCsrfToken(string $token): bool {
        return isset($_SESSION['csrf_token']) && 
               hash_equals($_SESSION['csrf_token'], $token);
    }
    
    public function getErrors(): array {
        return $this->errors;
    }
}

// Kullanım
$registration = new UserRegistration($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($registration->register($_POST)) {
        $_SESSION['success'] = 'Kayıt başarılı! Giriş yapabilirsiniz.';
        header('Location: login.php');
        exit;
    }
}

// CSRF token üret
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
?>`}
              type="secure"
            />
          </TabsContent>

          <TabsContent value="login">
            <CodeExample
              title="Güvenli Giriş İşlemi"
              description="Brute force koruması, hesap kilitleme ve güvenli oturum başlatma."
              vulnerableCode={`// ❌ GÜVENSİZ GİRİŞ
$email = $_POST['email'];
$password = $_POST['password'];

$result = mysqli_query($conn, 
    "SELECT * FROM users WHERE email='$email' AND password='$password'"
);

if (mysqli_num_rows($result) > 0) {
    $_SESSION['user'] = $email;
    echo "Giriş başarılı!";
}
// Sorunlar: SQL injection, düz metin parola karşılaştırma, 
// brute force koruması yok`}
              secureCode={`<?php
// ✅ GÜVENLİ GİRİŞ SİSTEMİ
session_start();
require_once 'config/database.php';

class UserLogin {
    private $pdo;
    private $max_attempts = 5;
    private $lockout_duration = 900; // 15 dakika (saniye)
    
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
    
    public function login(string $email, string $password, string $csrf_token): array {
        // 1. CSRF doğrulama
        if (!isset($_SESSION['csrf_token']) || 
            !hash_equals($_SESSION['csrf_token'], $csrf_token)) {
            return ['success' => false, 'message' => 'Geçersiz istek.'];
        }
        
        // 2. IP bazlı rate limiting
        $ip = $_SERVER['REMOTE_ADDR'];
        if ($this->isIPBlocked($ip)) {
            return [
                'success' => false, 
                'message' => 'Çok fazla başarısız deneme. 15 dakika sonra tekrar deneyin.'
            ];
        }
        
        // 3. Input temizleme
        $email = filter_var(trim($email), FILTER_SANITIZE_EMAIL);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Geçersiz e-posta.'];
        }
        
        // 4. Kullanıcıyı bul
        $stmt = $this->pdo->prepare("
            SELECT id, username, email, password_hash, is_active, 
                   failed_login_attempts, locked_until 
            FROM users WHERE email = ?
        ");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // 5. Kullanıcı yoksa (timing attack önleme)
        if (!$user) {
            password_hash('dummy_password', PASSWORD_ARGON2ID);
            $this->logAttempt(null, $ip, false);
            return ['success' => false, 'message' => 'E-posta veya parola hatalı.'];
        }
        
        // 6. Hesap kilitli mi?
        if ($user['locked_until'] && strtotime($user['locked_until']) > time()) {
            $remaining = strtotime($user['locked_until']) - time();
            return [
                'success' => false, 
                'message' => "Hesap kilitli. " . ceil($remaining / 60) . " dakika sonra deneyin."
            ];
        }
        
        // 7. Hesap aktif mi?
        if (!$user['is_active']) {
            return ['success' => false, 'message' => 'Hesabınız devre dışı.'];
        }
        
        // 8. Parola doğrulama
        if (!password_verify($password, $user['password_hash'])) {
            $this->handleFailedLogin($user['id'], $ip);
            return ['success' => false, 'message' => 'E-posta veya parola hatalı.'];
        }
        
        // 9. Başarılı giriş - Parola hash güncelleme (rehashing)
        if (password_needs_rehash($user['password_hash'], PASSWORD_ARGON2ID)) {
            $new_hash = password_hash($password, PASSWORD_ARGON2ID);
            $stmt = $this->pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
            $stmt->execute([$new_hash, $user['id']]);
        }
        
        // 10. Oturum başlatma
        $this->startSecureSession($user);
        $this->resetFailedAttempts($user['id']);
        $this->logAttempt($user['id'], $ip, true);
        
        return ['success' => true, 'message' => 'Giriş başarılı!'];
    }
    
    private function handleFailedLogin(int $user_id, string $ip): void {
        $stmt = $this->pdo->prepare("
            UPDATE users SET 
                failed_login_attempts = failed_login_attempts + 1,
                locked_until = CASE 
                    WHEN failed_login_attempts + 1 >= ? 
                    THEN DATE_ADD(NOW(), INTERVAL ? SECOND) 
                    ELSE locked_until 
                END
            WHERE id = ?
        ");
        $stmt->execute([$this->max_attempts, $this->lockout_duration, $user_id]);
        $this->logAttempt($user_id, $ip, false);
    }
    
    private function startSecureSession(array $user): void {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'];
        $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
        $_SESSION['last_activity'] = time();
        $_SESSION['login_time'] = time();
    }
    
    private function isIPBlocked(string $ip): bool {
        $stmt = $this->pdo->prepare("
            SELECT COUNT(*) FROM login_logs 
            WHERE ip_address = ? AND success = 0 
            AND created_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
        ");
        $stmt->execute([$ip]);
        return $stmt->fetchColumn() >= 20; // IP başına 20 deneme
    }
    
    private function resetFailedAttempts(int $user_id): void {
        $stmt = $this->pdo->prepare(
            "UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?"
        );
        $stmt->execute([$user_id]);
    }
    
    private function logAttempt(?int $user_id, string $ip, bool $success): void {
        $stmt = $this->pdo->prepare("
            INSERT INTO login_logs (user_id, ip_address, user_agent, success) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$user_id, $ip, $_SERVER['HTTP_USER_AGENT'] ?? '', $success]);
    }
}

// Kullanım
$login = new UserLogin($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = $login->login(
        $_POST['email'] ?? '',
        $_POST['password'] ?? '',
        $_POST['csrf_token'] ?? ''
    );
    
    if ($result['success']) {
        header('Location: dashboard.php');
        exit;
    }
    $error = $result['message'];
}

$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
?>`}
              type="secure"
            />
          </TabsContent>

          <TabsContent value="session">
            <CodeExample
              title="Güvenli Oturum Yönetimi"
              description="Session hijacking koruması, otomatik çıkış ve güvenli oturum doğrulama."
              secureCode={`<?php
// ✅ GÜVENLİ OTURUM YÖNETİMİ
class SessionManager {
    private $timeout = 1800;       // 30 dakika inaktivite
    private $absolute_timeout = 28800; // 8 saat mutlak süre
    
    public function __construct() {
        // Güvenli session ayarları
        ini_set('session.cookie_httponly', 1);
        ini_set('session.cookie_secure', 1);
        ini_set('session.cookie_samesite', 'Strict');
        ini_set('session.use_strict_mode', 1);
        ini_set('session.use_only_cookies', 1);
        
        session_start();
    }
    
    // Oturum geçerliliğini kontrol et
    public function isValidSession(): bool {
        if (!isset($_SESSION['user_id'])) {
            return false;
        }
        
        // IP adresi değişti mi?
        if ($_SESSION['ip_address'] !== $_SERVER['REMOTE_ADDR']) {
            $this->destroySession();
            return false;
        }
        
        // User-Agent değişti mi?
        if ($_SESSION['user_agent'] !== $_SERVER['HTTP_USER_AGENT']) {
            $this->destroySession();
            return false;
        }
        
        // İnaktivite kontrolü
        if (time() - $_SESSION['last_activity'] > $this->timeout) {
            $this->destroySession();
            return false;
        }
        
        // Mutlak süre kontrolü (8 saat)
        if (time() - $_SESSION['login_time'] > $this->absolute_timeout) {
            $this->destroySession();
            return false;
        }
        
        // Son aktivite zamanını güncelle
        $_SESSION['last_activity'] = time();
        
        // Her 5 dakikada session ID'yi yenile
        if (!isset($_SESSION['last_regeneration']) ||
            time() - $_SESSION['last_regeneration'] > 300) {
            session_regenerate_id(true);
            $_SESSION['last_regeneration'] = time();
        }
        
        return true;
    }
    
    // Güvenli çıkış
    public function destroySession(): void {
        $_SESSION = [];
        
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params['path'], $params['domain'],
                $params['secure'], $params['httponly']
            );
        }
        
        session_destroy();
    }
    
    // Mevcut kullanıcı ID'sini al
    public function getUserId(): ?int {
        return $_SESSION['user_id'] ?? null;
    }
}

// Her korumalı sayfanın başında kullanım:
$session = new SessionManager();

if (!$session->isValidSession()) {
    header('Location: login.php?expired=1');
    exit;
}

$current_user_id = $session->getUserId();
// Artık güvenli şekilde kullanıcı işlemleri yapılabilir
?>`}
              type="secure"
            />
          </TabsContent>

          <TabsContent value="reset">
            <CodeExample
              title="Güvenli Şifre Sıfırlama"
              description="Token tabanlı, zaman sınırlı güvenli şifre sıfırlama sistemi."
              secureCode={`<?php
// ✅ GÜVENLİ ŞİFRE SIFIRLAMA SİSTEMİ
class PasswordReset {
    private $pdo;
    private $token_expiry = 3600; // 1 saat
    
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
    
    // Şifre sıfırlama talebi
    public function requestReset(string $email): array {
        $email = filter_var(trim($email), FILTER_SANITIZE_EMAIL);
        
        // Kullanıcıyı bul
        $stmt = $this->pdo->prepare("SELECT id, email FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        // Kullanıcı bulunamasa bile aynı mesaj (bilgi sızıntısını önler)
        if (!$user) {
            return ['success' => true, 'message' => 'Talimatlar e-posta adresinize gönderildi.'];
        }
        
        // Eski tokenları iptal et
        $stmt = $this->pdo->prepare("UPDATE password_resets SET used = 1 WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        
        // Yeni token oluştur
        $token = bin2hex(random_bytes(32));
        $token_hash = hash('sha256', $token);
        $expires_at = date('Y-m-d H:i:s', time() + $this->token_expiry);
        
        $stmt = $this->pdo->prepare("
            INSERT INTO password_resets (user_id, token_hash, expires_at) 
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$user['id'], $token_hash, $expires_at]);
        
        // E-posta gönder (token URL'de plain olarak gönderilir)
        $reset_link = "https://example.com/reset.php?token=" . $token;
        $this->sendResetEmail($user['email'], $reset_link);
        
        return ['success' => true, 'message' => 'Talimatlar e-posta adresinize gönderildi.'];
    }
    
    // Şifre sıfırlama işlemi
    public function resetPassword(string $token, string $new_password): array {
        // Token hash'le ve veritabanında ara
        $token_hash = hash('sha256', $token);
        
        $stmt = $this->pdo->prepare("
            SELECT pr.*, u.email 
            FROM password_resets pr
            JOIN users u ON pr.user_id = u.id
            WHERE pr.token_hash = ? AND pr.used = 0 AND pr.expires_at > NOW()
        ");
        $stmt->execute([$token_hash]);
        $reset = $stmt->fetch();
        
        if (!$reset) {
            return ['success' => false, 'message' => 'Geçersiz veya süresi dolmuş bağlantı.'];
        }
        
        // Parola politikası kontrolü
        if (strlen($new_password) < 8 || 
            !preg_match('/[A-Z]/', $new_password) ||
            !preg_match('/[0-9]/', $new_password)) {
            return ['success' => false, 'message' => 'Parola güvenlik gereksinimlerini karşılamıyor.'];
        }
        
        // Yeni parola hash'le ve güncelle
        $password_hash = password_hash($new_password, PASSWORD_ARGON2ID);
        
        $this->pdo->beginTransaction();
        try {
            // Parolayı güncelle
            $stmt = $this->pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
            $stmt->execute([$password_hash, $reset['user_id']]);
            
            // Token'ı kullanıldı olarak işaretle
            $stmt = $this->pdo->prepare("UPDATE password_resets SET used = 1 WHERE id = ?");
            $stmt->execute([$reset['id']]);
            
            // Tüm aktif oturumları sonlandır (opsiyonel)
            // $this->invalidateAllSessions($reset['user_id']);
            
            $this->pdo->commit();
            return ['success' => true, 'message' => 'Parolanız başarıyla güncellendi.'];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            error_log('Şifre sıfırlama hatası: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Bir hata oluştu.'];
        }
    }
    
    private function sendResetEmail(string $email, string $link): void {
        $subject = 'Şifre Sıfırlama Talebi';
        $message = "Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:\\n\\n";
        $message .= $link . "\\n\\n";
        $message .= "Bu bağlantı 1 saat geçerlidir.\\n";
        $message .= "Bu talebi siz yapmadıysanız bu e-postayı görmezden gelin.";
        
        $headers = "From: noreply@example.com\\r\\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\\r\\n";
        
        mail($email, $subject, $message, $headers);
    }
}

// Kullanım
$reset = new PasswordReset($pdo);

// Sıfırlama talebi
if ($_POST['action'] === 'request') {
    $result = $reset->requestReset($_POST['email']);
}

// Yeni şifre belirleme
if ($_POST['action'] === 'reset') {
    $result = $reset->resetPassword($_GET['token'], $_POST['new_password']);
}
?>`}
              type="secure"
            />
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* Project 2: Secure File Upload */}
      <section className="space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-warning/10 text-warning">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Proje 2: Güvenli Dosya Yükleme Sistemi</h2>
            <p className="text-muted-foreground">Resim yükleme, doğrulama, thumbnail ve güvenli erişim</p>
          </div>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="upload">Yükleme</TabsTrigger>
            <TabsTrigger value="serve">Güvenli Erişim</TabsTrigger>
            <TabsTrigger value="htaccess">.htaccess</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <CodeExample
              title="Güvenli Resim Yükleme Sistemi"
              description="Çoklu doğrulama katmanı, resim işleme ve güvenli depolama."
              secureCode={`<?php
// ✅ GÜVENLİ RESİM YÜKLEME SİSTEMİ
class SecureImageUploader {
    private $upload_dir;
    private $allowed_mime = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    private $allowed_ext = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    private $max_size = 5242880; // 5MB
    private $max_width = 4096;
    private $max_height = 4096;
    
    public function __construct(string $upload_dir = 'uploads/images/') {
        $this->upload_dir = rtrim($upload_dir, '/') . '/';
        
        if (!is_dir($this->upload_dir)) {
            mkdir($this->upload_dir, 0755, true);
        }
    }
    
    public function upload(array $file): array {
        // 1. Temel hata kontrolü
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return $this->error($this->getUploadError($file['error']));
        }
        
        // 2. Boyut kontrolü
        if ($file['size'] > $this->max_size) {
            return $this->error('Dosya boyutu 5MB\'dan büyük olamaz.');
        }
        
        // 3. Uzantı kontrolü
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $this->allowed_ext)) {
            return $this->error('İzin verilmeyen dosya uzantısı: ' . $ext);
        }
        
        // 4. MIME type kontrolü (gerçek dosya içeriğine göre)
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);
        if (!in_array($mime, $this->allowed_mime)) {
            return $this->error('İzin verilmeyen dosya tipi: ' . $mime);
        }
        
        // 5. Gerçek resim mi? (getimagesize kontrolü)
        $image_info = @getimagesize($file['tmp_name']);
        if ($image_info === false) {
            return $this->error('Geçerli bir resim dosyası değil.');
        }
        
        // 6. Boyut sınırları
        if ($image_info[0] > $this->max_width || $image_info[1] > $this->max_height) {
            return $this->error("Resim en fazla {$this->max_width}x{$this->max_height} piksel olabilir.");
        }
        
        // 7. Zararlı içerik taraması (EXIF verilerinde PHP kodu olabilir)
        $content = file_get_contents($file['tmp_name']);
        if (preg_match('/<\\?php|<\\?=|<script/i', $content)) {
            return $this->error('Zararlı içerik tespit edildi.');
        }
        
        // 8. Güvenli dosya adı oluştur
        $safe_name = bin2hex(random_bytes(16)) . '.' . $ext;
        $dest = $this->upload_dir . $safe_name;
        
        // 9. Resmi yeniden oluştur (EXIF ve zararlı meta verileri temizler)
        $clean_image = $this->reprocessImage($file['tmp_name'], $mime, $dest);
        if (!$clean_image) {
            return $this->error('Resim işlenirken hata oluştu.');
        }
        
        // 10. Thumbnail oluştur
        $thumb_name = 'thumb_' . $safe_name;
        $this->createThumbnail($dest, $this->upload_dir . $thumb_name, 200, 200);
        
        return [
            'success' => true,
            'filename' => $safe_name,
            'thumbnail' => $thumb_name,
            'size' => filesize($dest),
            'mime' => $mime,
            'dimensions' => $image_info[0] . 'x' . $image_info[1]
        ];
    }
    
    private function reprocessImage(string $source, string $mime, string $dest): bool {
        $image = match($mime) {
            'image/jpeg' => imagecreatefromjpeg($source),
            'image/png' => imagecreatefrompng($source),
            'image/gif' => imagecreatefromgif($source),
            'image/webp' => imagecreatefromwebp($source),
            default => false
        };
        
        if (!$image) return false;
        
        $result = match($mime) {
            'image/jpeg' => imagejpeg($image, $dest, 85),
            'image/png' => imagepng($image, $dest, 8),
            'image/gif' => imagegif($image, $dest),
            'image/webp' => imagewebp($image, $dest, 85),
            default => false
        };
        
        imagedestroy($image);
        return $result;
    }
    
    private function createThumbnail(string $src, string $dest, int $w, int $h): void {
        list($orig_w, $orig_h) = getimagesize($src);
        $ratio = min($w / $orig_w, $h / $orig_h);
        $new_w = (int)($orig_w * $ratio);
        $new_h = (int)($orig_h * $ratio);
        
        $thumb = imagecreatetruecolor($new_w, $new_h);
        $source = imagecreatefromstring(file_get_contents($src));
        
        imagecopyresampled($thumb, $source, 0, 0, 0, 0, $new_w, $new_h, $orig_w, $orig_h);
        imagejpeg($thumb, $dest, 75);
        
        imagedestroy($thumb);
        imagedestroy($source);
    }
    
    private function error(string $message): array {
        return ['success' => false, 'error' => $message];
    }
    
    private function getUploadError(int $code): string {
        return match($code) {
            UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'Dosya boyutu çok büyük.',
            UPLOAD_ERR_PARTIAL => 'Dosya kısmen yüklendi.',
            UPLOAD_ERR_NO_FILE => 'Dosya seçilmedi.',
            default => 'Bilinmeyen yükleme hatası.'
        };
    }
}

// Kullanım
$uploader = new SecureImageUploader('uploads/images/');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $result = $uploader->upload($_FILES['image']);
    
    if ($result['success']) {
        echo "Resim yüklendi: " . htmlspecialchars($result['filename']);
        echo "Boyut: " . $result['dimensions'];
    } else {
        echo "Hata: " . htmlspecialchars($result['error']);
    }
}
?>`}
              type="secure"
            />
          </TabsContent>

          <TabsContent value="serve">
            <CodeExample
              title="Dosyaları Güvenli Sunma"
              description="Dosyalara doğrudan erişimi engelleyip PHP üzerinden güvenli sunma."
              secureCode={`<?php
// ✅ DOSYALARI GÜVENLİ SUNMA (serve_file.php)
session_start();
require_once 'config/database.php';

class SecureFileServer {
    private $storage_dir;
    private $pdo;
    
    public function __construct(PDO $pdo, string $storage_dir = 'uploads/') {
        $this->pdo = $pdo;
        $this->storage_dir = realpath($storage_dir) . DIRECTORY_SEPARATOR;
    }
    
    public function serve(string $filename): void {
        // 1. Oturum kontrolü
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            die('Yetkisiz erişim.');
        }
        
        // 2. Path traversal koruması
        $safe_path = realpath($this->storage_dir . basename($filename));
        
        if (!$safe_path || strpos($safe_path, $this->storage_dir) !== 0) {
            http_response_code(403);
            die('Geçersiz dosya yolu.');
        }
        
        // 3. Dosya var mı?
        if (!file_exists($safe_path)) {
            http_response_code(404);
            die('Dosya bulunamadı.');
        }
        
        // 4. Erişim yetkisi kontrolü (veritabanından)
        if (!$this->hasAccess($_SESSION['user_id'], $filename)) {
            http_response_code(403);
            die('Bu dosyaya erişim yetkiniz yok.');
        }
        
        // 5. Dosyayı güvenli şekilde sun
        $mime = mime_content_type($safe_path);
        $size = filesize($safe_path);
        
        header('Content-Type: ' . $mime);
        header('Content-Length: ' . $size);
        header('Content-Disposition: inline; filename="' . basename($safe_path) . '"');
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: private, max-age=3600');
        
        // Büyük dosyalar için chunk'lı okuma
        $fp = fopen($safe_path, 'rb');
        while (!feof($fp)) {
            echo fread($fp, 8192);
            flush();
        }
        fclose($fp);
        exit;
    }
    
    private function hasAccess(int $user_id, string $filename): bool {
        $stmt = $this->pdo->prepare("
            SELECT COUNT(*) FROM file_permissions 
            WHERE user_id = ? AND filename = ?
        ");
        $stmt->execute([$user_id, $filename]);
        return $stmt->fetchColumn() > 0;
    }
}

// Kullanım: serve_file.php?file=abc123.jpg
$server = new SecureFileServer($pdo, 'uploads/images/');
$server->serve($_GET['file'] ?? '');
?>`}
              type="secure"
            />
          </TabsContent>

          <TabsContent value="htaccess">
            <CodeExample
              title="Upload Dizini .htaccess Koruması"
              description="Yüklenen dosyaların doğrudan çalıştırılmasını önleme."
              secureCode={`# uploads/.htaccess
# ✅ PHP çalıştırmayı tamamen devre dışı bırak
php_flag engine off

# Tüm script dosyalarını engelle
<FilesMatch "\\.(php|phtml|php3|php4|php5|pl|py|cgi|sh|bash)$">
    Order Deny,Allow
    Deny from all
</FilesMatch>

# Sadece izin verilen dosya tiplerine erişim
<FilesMatch "\\.(jpg|jpeg|png|gif|webp|pdf)$">
    Order Allow,Deny
    Allow from all
</FilesMatch>

# Dizin listelemeyi kapat
Options -Indexes

# .htaccess dosyasına erişimi engelle
<Files ".htaccess">
    Order Allow,Deny
    Deny from all
</Files>

# Content-Type sniffing'i engelle
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
</IfModule>`}
              language="bash"
              type="secure"
            />
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* Project 3: Secure CRUD API */}
      <section className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-danger/10 text-danger">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Proje 3: Güvenli CRUD API</h2>
            <p className="text-muted-foreground">REST API, yetkilendirme ve güvenli veri işlemleri</p>
          </div>
        </div>

        <Tabs defaultValue="router" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="router">API Router</TabsTrigger>
            <TabsTrigger value="crud">CRUD İşlemleri</TabsTrigger>
            <TabsTrigger value="middleware">Middleware</TabsTrigger>
          </TabsList>

          <TabsContent value="router">
            <CodeExample
              title="Güvenli API Router"
              description="Basit ve güvenli bir PHP REST API yönlendirici."
              secureCode={`<?php
// ✅ GÜVENLİ API ROUTER (api/index.php)
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

require_once '../config/database.php';
require_once '../classes/APIMiddleware.php';
require_once '../classes/ProductController.php';

// CORS ayarları (gerekirse)
$allowed_origins = ['https://yourdomain.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');
}

// OPTIONS request (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Middleware
$middleware = new APIMiddleware($pdo);
$middleware->rateLimit(100, 3600); // 100 req/hour

// Routing
$method = $_SERVER['REQUEST_METHOD'];
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$path = str_replace('api/', '', $path);
$segments = explode('/', $path);

$resource = $segments[0] ?? '';
$id = $segments[1] ?? null;

try {
    switch ($resource) {
        case 'products':
            $auth = $middleware->authenticate(); // JWT doğrulama
            $controller = new ProductController($pdo, $auth);
            
            match ($method) {
                'GET' => $id 
                    ? $controller->getOne((int)$id) 
                    : $controller->getAll(),
                'POST' => $controller->create(),
                'PUT' => $controller->update((int)$id),
                'DELETE' => $controller->delete((int)$id),
                default => throw new Exception('Method not allowed', 405)
            };
            break;
            
        default:
            throw new Exception('Resource not found', 404);
    }
} catch (Exception $e) {
    $code = $e->getCode() ?: 500;
    http_response_code($code);
    echo json_encode([
        'error' => true,
        'message' => $code === 500 ? 'Internal server error' : $e->getMessage(),
        'code' => $code
    ]);
    
    if ($code === 500) {
        error_log('API Error: ' . $e->getMessage() . ' | ' . $e->getTraceAsString());
    }
}
?>`}
              type="secure"
            />
          </TabsContent>

          <TabsContent value="crud">
            <CodeExample
              title="Güvenli CRUD Controller"
              description="Prepared statements, input doğrulama ve yetki kontrolü ile CRUD işlemleri."
              secureCode={`<?php
// ✅ GÜVENLİ PRODUCT CONTROLLER
class ProductController {
    private $pdo;
    private $auth_user;
    
    public function __construct(PDO $pdo, array $auth_user) {
        $this->pdo = $pdo;
        $this->auth_user = $auth_user;
    }
    
    // Tüm ürünleri listele (sayfalama ile)
    public function getAll(): void {
        $page = max(1, (int)($_GET['page'] ?? 1));
        $per_page = min(100, max(1, (int)($_GET['per_page'] ?? 20)));
        $offset = ($page - 1) * $per_page;
        
        // Güvenli sıralama
        $allowed_sort = ['id', 'name', 'price', 'created_at'];
        $sort = in_array($_GET['sort'] ?? '', $allowed_sort) ? $_GET['sort'] : 'id';
        $order = strtoupper($_GET['order'] ?? '') === 'DESC' ? 'DESC' : 'ASC';
        
        // Arama (güvenli)
        $search = trim($_GET['search'] ?? '');
        $where = '';
        $params = [];
        
        if ($search !== '') {
            $where = 'WHERE name LIKE ? OR description LIKE ?';
            $search_param = '%' . $search . '%';
            $params = [$search_param, $search_param];
        }
        
        // Toplam sayı
        $count_sql = "SELECT COUNT(*) FROM products $where";
        $stmt = $this->pdo->prepare($count_sql);
        $stmt->execute($params);
        $total = $stmt->fetchColumn();
        
        // Veri çekme
        $sql = "SELECT id, name, description, price, stock, created_at 
                FROM products $where 
                ORDER BY $sort $order 
                LIMIT ? OFFSET ?";
        $stmt = $this->pdo->prepare($sql);
        $params[] = $per_page;
        $params[] = $offset;
        $stmt->execute($params);
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $this->respond([
            'data' => $products,
            'pagination' => [
                'total' => (int)$total,
                'page' => $page,
                'per_page' => $per_page,
                'total_pages' => ceil($total / $per_page)
            ]
        ]);
    }
    
    // Tek ürün detayı
    public function getOne(int $id): void {
        $stmt = $this->pdo->prepare(
            "SELECT * FROM products WHERE id = ?"
        );
        $stmt->execute([$id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$product) {
            throw new Exception('Ürün bulunamadı.', 404);
        }
        
        $this->respond(['data' => $product]);
    }
    
    // Ürün ekleme
    public function create(): void {
        $this->requireRole('admin');
        
        $data = $this->getJsonInput();
        $validated = $this->validateProduct($data);
        
        $stmt = $this->pdo->prepare("
            INSERT INTO products (name, description, price, stock) 
            VALUES (:name, :description, :price, :stock)
        ");
        
        $stmt->execute($validated);
        $id = $this->pdo->lastInsertId();
        
        http_response_code(201);
        $this->respond([
            'message' => 'Ürün oluşturuldu.',
            'data' => ['id' => (int)$id]
        ]);
    }
    
    // Ürün güncelleme
    public function update(int $id): void {
        $this->requireRole('admin');
        
        // Ürün var mı kontrol
        $stmt = $this->pdo->prepare("SELECT id FROM products WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            throw new Exception('Ürün bulunamadı.', 404);
        }
        
        $data = $this->getJsonInput();
        $validated = $this->validateProduct($data);
        $validated[':id'] = $id;
        
        $stmt = $this->pdo->prepare("
            UPDATE products SET 
                name = :name, description = :description,
                price = :price, stock = :stock
            WHERE id = :id
        ");
        $stmt->execute($validated);
        
        $this->respond(['message' => 'Ürün güncellendi.']);
    }
    
    // Ürün silme
    public function delete(int $id): void {
        $this->requireRole('admin');
        
        $stmt = $this->pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            throw new Exception('Ürün bulunamadı.', 404);
        }
        
        $this->respond(['message' => 'Ürün silindi.']);
    }
    
    // Input doğrulama
    private function validateProduct(array $data): array {
        $errors = [];
        
        $name = trim($data['name'] ?? '');
        if (strlen($name) < 2 || strlen($name) > 200) {
            $errors[] = 'Ürün adı 2-200 karakter olmalıdır.';
        }
        
        $description = trim($data['description'] ?? '');
        if (strlen($description) > 5000) {
            $errors[] = 'Açıklama en fazla 5000 karakter olabilir.';
        }
        
        $price = filter_var($data['price'] ?? null, FILTER_VALIDATE_FLOAT);
        if ($price === false || $price < 0) {
            $errors[] = 'Geçerli bir fiyat giriniz.';
        }
        
        $stock = filter_var($data['stock'] ?? null, FILTER_VALIDATE_INT);
        if ($stock === false || $stock < 0) {
            $errors[] = 'Geçerli bir stok miktarı giriniz.';
        }
        
        if (!empty($errors)) {
            throw new Exception(implode(' ', $errors), 422);
        }
        
        return [
            ':name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
            ':description' => htmlspecialchars($description, ENT_QUOTES, 'UTF-8'),
            ':price' => $price,
            ':stock' => $stock
        ];
    }
    
    private function requireRole(string $role): void {
        if (!in_array($role, $this->auth_user['roles'] ?? [])) {
            throw new Exception('Bu işlem için yetkiniz yok.', 403);
        }
    }
    
    private function getJsonInput(): array {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Geçersiz JSON verisi.', 400);
        }
        
        return $data;
    }
    
    private function respond(array $data, int $code = 200): void {
        http_response_code($code);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
}
?>`}
              type="secure"
            />
          </TabsContent>

          <TabsContent value="middleware">
            <CodeExample
              title="API Güvenlik Middleware"
              description="JWT doğrulama, rate limiting ve güvenlik kontrolleri."
              secureCode={`<?php
// ✅ API GÜVENLİK MIDDLEWARE
class APIMiddleware {
    private $pdo;
    
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
    
    // JWT ile kimlik doğrulama
    public function authenticate(): array {
        $token = $this->extractBearerToken();
        
        if (!$token) {
            $this->abort(401, 'Authorization token gerekli.');
        }
        
        try {
            // JWT decode (basitleştirilmiş)
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                throw new Exception('Geçersiz token formatı.');
            }
            
            $payload = json_decode(
                base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), 
                true
            );
            
            // Token süresi kontrolü
            if (!$payload || ($payload['exp'] ?? 0) < time()) {
                throw new Exception('Token süresi dolmuş.');
            }
            
            // Kullanıcı hâlâ aktif mi?
            $stmt = $this->pdo->prepare(
                "SELECT id, username, is_active FROM users WHERE id = ?"
            );
            $stmt->execute([$payload['sub']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$user || !$user['is_active']) {
                throw new Exception('Kullanıcı bulunamadı veya devre dışı.');
            }
            
            // Kullanıcı rollerini al
            $stmt = $this->pdo->prepare(
                "SELECT role FROM user_roles WHERE user_id = ?"
            );
            $stmt->execute([$user['id']]);
            $roles = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            return [
                'id' => $user['id'],
                'username' => $user['username'],
                'roles' => $roles
            ];
            
        } catch (Exception $e) {
            $this->abort(401, $e->getMessage());
        }
    }
    
    // Rate limiting (IP bazlı, veritabanı ile)
    public function rateLimit(int $max_requests, int $window_seconds): void {
        $ip = $_SERVER['REMOTE_ADDR'];
        $now = time();
        $window_start = $now - $window_seconds;
        
        // Eski kayıtları temizle
        $stmt = $this->pdo->prepare(
            "DELETE FROM api_rate_limits WHERE timestamp < ?"
        );
        $stmt->execute([$window_start]);
        
        // Mevcut istek sayısını kontrol et
        $stmt = $this->pdo->prepare(
            "SELECT COUNT(*) FROM api_rate_limits WHERE ip_address = ? AND timestamp > ?"
        );
        $stmt->execute([$ip, $window_start]);
        $count = $stmt->fetchColumn();
        
        if ($count >= $max_requests) {
            header('Retry-After: ' . $window_seconds);
            $this->abort(429, 'İstek limiti aşıldı. Lütfen bekleyin.');
        }
        
        // İsteği kaydet
        $stmt = $this->pdo->prepare(
            "INSERT INTO api_rate_limits (ip_address, timestamp) VALUES (?, ?)"
        );
        $stmt->execute([$ip, $now]);
        
        // Rate limit bilgisini header'da göster
        header("X-RateLimit-Limit: $max_requests");
        header("X-RateLimit-Remaining: " . ($max_requests - $count - 1));
        header("X-RateLimit-Reset: " . ($window_start + $window_seconds));
    }
    
    // Request body boyut limiti
    public function limitRequestSize(int $max_bytes = 1048576): void {
        $content_length = $_SERVER['CONTENT_LENGTH'] ?? 0;
        
        if ($content_length > $max_bytes) {
            $this->abort(413, 'İstek boyutu çok büyük. Maksimum: ' . 
                         round($max_bytes / 1024) . 'KB');
        }
    }
    
    private function extractBearerToken(): ?string {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? 
                  $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        
        if (preg_match('/Bearer\\s+(\\S+)/', $header, $matches)) {
            return $matches[1];
        }
        
        return null;
    }
    
    private function abort(int $code, string $message): void {
        http_response_code($code);
        echo json_encode([
            'error' => true,
            'message' => $message,
            'code' => $code
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
?>`}
              type="secure"
            />
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* Project 4: Secure Contact Form */}
      <section className="space-y-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Proje 4: Güvenli İletişim Formu</h2>
            <p className="text-muted-foreground">Spam koruması, rate limiting ve güvenli e-posta gönderimi</p>
          </div>
        </div>

        <CodeExample
          title="Güvenli İletişim Formu (Tam Örnek)"
          description="CSRF, honeypot, rate limiting ve input doğrulama ile tam güvenli iletişim formu."
          vulnerableCode={`// ❌ GÜVENSİZ İLETİŞİM FORMU
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

// Doğrudan e-posta gönderimi - Header injection'a açık!
$headers = "From: $email";
mail("admin@site.com", "İletişim: $name", $message, $headers);

// Veritabanına kayıt - SQL injection'a açık!
$query = "INSERT INTO messages (name, email, message) 
          VALUES ('$name', '$email', '$message')";
mysqli_query($conn, $query);

echo "Mesajınız gönderildi!";`}
          secureCode={`<?php
// ✅ GÜVENLİ İLETİŞİM FORMU
session_start();
require_once 'config/database.php';

class SecureContactForm {
    private $pdo;
    private $errors = [];
    private $max_messages_per_hour = 3;
    
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
    
    public function handleSubmission(array $post): array {
        // 1. CSRF Token doğrulama
        if (!$this->verifyCsrf($post['csrf_token'] ?? '')) {
            return $this->fail('Geçersiz form isteği.');
        }
        
        // 2. Honeypot kontrolü (bot tuzağı)
        // Formda gizli bir "website" alanı var, insanlar doldurmaz
        if (!empty($post['website'] ?? '')) {
            // Bot tespit edildi, sessizce başarılı gibi göster
            return $this->success();
        }
        
        // 3. Zaman kontrolü (form çok hızlı doldurulmuşsa bot)
        $form_load_time = $post['_form_time'] ?? 0;
        if (time() - $form_load_time < 3) { // 3 saniyeden kısa
            return $this->success(); // Bot'a başarılı gibi göster
        }
        
        // 4. Rate limiting (IP bazlı)
        if (!$this->checkRateLimit()) {
            return $this->fail('Çok fazla mesaj gönderdiniz. Lütfen 1 saat bekleyin.');
        }
        
        // 5. Input doğrulama
        $name = $this->validateName($post['name'] ?? '');
        $email = $this->validateEmail($post['email'] ?? '');
        $subject = $this->validateSubject($post['subject'] ?? '');
        $message = $this->validateMessage($post['message'] ?? '');
        
        if (!empty($this->errors)) {
            return ['success' => false, 'errors' => $this->errors];
        }
        
        // 6. Veritabanına güvenli kayıt
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO contact_messages 
                    (name, email, subject, message, ip_address, user_agent) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $name, $email, $subject, $message,
                $_SERVER['REMOTE_ADDR'],
                substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500)
            ]);
            
            // 7. Güvenli e-posta gönderimi
            $this->sendNotification($name, $email, $subject, $message);
            
            return $this->success();
            
        } catch (PDOException $e) {
            error_log('İletişim formu hatası: ' . $e->getMessage());
            return $this->fail('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }
    
    private function validateName(string $name): string {
        $name = trim(strip_tags($name));
        if (strlen($name) < 2 || strlen($name) > 100) {
            $this->errors[] = 'İsim 2-100 karakter olmalıdır.';
        }
        return htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    }
    
    private function validateEmail(string $email): string {
        $email = filter_var(trim($email), FILTER_SANITIZE_EMAIL);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->errors[] = 'Geçerli bir e-posta adresi giriniz.';
        }
        // Disposable email kontrolü
        $domain = explode('@', $email)[1] ?? '';
        $disposable = ['tempmail.com', 'throwaway.email', 'guerrillamail.com'];
        if (in_array($domain, $disposable)) {
            $this->errors[] = 'Geçici e-posta adresleri kabul edilmiyor.';
        }
        return $email;
    }
    
    private function validateSubject(string $subject): string {
        $subject = trim(strip_tags($subject));
        if (strlen($subject) < 3 || strlen($subject) > 200) {
            $this->errors[] = 'Konu 3-200 karakter olmalıdır.';
        }
        return htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
    }
    
    private function validateMessage(string $message): string {
        $message = trim(strip_tags($message));
        if (strlen($message) < 10 || strlen($message) > 5000) {
            $this->errors[] = 'Mesaj 10-5000 karakter olmalıdır.';
        }
        return htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    }
    
    private function checkRateLimit(): bool {
        $stmt = $this->pdo->prepare("
            SELECT COUNT(*) FROM contact_messages 
            WHERE ip_address = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
        ");
        $stmt->execute([$_SERVER['REMOTE_ADDR']]);
        return $stmt->fetchColumn() < $this->max_messages_per_hour;
    }
    
    private function sendNotification(string $name, string $email, 
                                       string $subject, string $message): void {
        $to = 'admin@yoursite.com';
        $mail_subject = '[İletişim] ' . $subject;
        
        // Header injection koruması
        $safe_name = str_replace(["\\r", "\\n"], '', $name);
        $safe_email = str_replace(["\\r", "\\n"], '', $email);
        
        $body = "Gönderen: $safe_name <$safe_email>\\n\\n";
        $body .= "Mesaj:\\n$message\\n\\n";
        $body .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\\n";
        $body .= "Tarih: " . date('d.m.Y H:i:s');
        
        $headers = "From: noreply@yoursite.com\\r\\n";
        $headers .= "Reply-To: $safe_email\\r\\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\\r\\n";
        
        mail($to, $mail_subject, $body, $headers);
    }
    
    private function verifyCsrf(string $token): bool {
        return isset($_SESSION['csrf_token']) && 
               hash_equals($_SESSION['csrf_token'], $token);
    }
    
    private function success(): array {
        return ['success' => true, 'message' => 'Mesajınız başarıyla gönderildi!'];
    }
    
    private function fail(string $msg): array {
        return ['success' => false, 'errors' => [$msg]];
    }
}

// HTML FORM KODU:
/*
<form method="POST" action="contact.php">
    <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">
    <input type="hidden" name="_form_time" value="<?= time() ?>">
    
    <!-- Honeypot (CSS ile gizle: display:none) -->
    <div style="display:none">
        <input type="text" name="website" tabindex="-1" autocomplete="off">
    </div>
    
    <input type="text" name="name" required placeholder="Adınız">
    <input type="email" name="email" required placeholder="E-posta">
    <input type="text" name="subject" required placeholder="Konu">
    <textarea name="message" required placeholder="Mesajınız"></textarea>
    <button type="submit">Gönder</button>
</form>
*/
?>`}
          type="secure"
        />
      </section>

      {/* Summary Card */}
      <Card className="security-card bg-primary/5 border-primary/20 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Önemli Notlar</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Genel Kurallar</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>Kullanıcı girdilerine asla güvenmeyin</li>
                <li>Her zaman prepared statement kullanın</li>
                <li>Parolaları mutlaka hash'leyin</li>
                <li>CSRF token kullanın</li>
                <li>Hata detaylarını kullanıcıya göstermeyin</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Production Checklist</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>display_errors = Off</li>
                <li>HTTPS zorunlu</li>
                <li>Güvenlik header'ları aktif</li>
                <li>Dosya izinleri doğru ayarlanmış</li>
                <li>Düzenli güvenlik taraması</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticalExamples;
