import { FileCode, Shield, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeExample from "@/components/CodeExample";
import { Link } from "react-router-dom";

const HtmlSecurity = () => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center space-x-4 mb-8 animate-fade-in">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <FileCode className="w-10 h-10 text-primary animate-security-pulse" />
          <div>
            <h1 className="text-3xl font-bold gradient-text">HTML Güvenlik Dersleri</h1>
            <p className="text-muted-foreground">HTML'de güvenlik açıkları ve korunma yöntemleri</p>
          </div>
        </div>

        <Tabs defaultValue="xss" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto p-2">
            <TabsTrigger value="xss" className="text-xs">XSS Koruması</TabsTrigger>
            <TabsTrigger value="forms" className="text-xs">Form Güvenliği</TabsTrigger>
            <TabsTrigger value="iframe" className="text-xs">iframe & Embedding</TabsTrigger>
            <TabsTrigger value="headers" className="text-xs">Güvenlik Başlıkları</TabsTrigger>
          </TabsList>

          <TabsContent value="xss" className="space-y-6">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span>XSS (Cross-Site Scripting) Koruması</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  XSS saldırıları, kötü niyetli JavaScript kodlarının sayfanıza enjekte edilmesiyle gerçekleşir. 
                  HTML'de doğru kaçış (escape) ve Content Security Policy kullanarak korunabilirsiniz.
                </p>
              </CardContent>
            </Card>

            <CodeExample
              title="DOM Tabanlı XSS"
              description="innerHTML kullanımı XSS'e açık kapı bırakır"
              type="vulnerable"
              language="html"
              vulnerableCode={`<!-- ❌ Güvensiz: innerHTML ile kullanıcı verisi -->
<div id="output"></div>
<script>
  // URL'den gelen veri doğrudan DOM'a yazılıyor
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  
  // Saldırgan: ?name=<img src=x onerror=alert('XSS')>
  document.getElementById('output').innerHTML = 
    'Hoşgeldin, ' + name;
</script>`}
              secureCode={`<!-- ✅ Güvenli: textContent kullanımı -->
<div id="output"></div>
<script>
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  
  // textContent HTML'i çalıştırmaz
  document.getElementById('output').textContent = 
    'Hoşgeldin, ' + name;
  
  // Alternatif: DOMPurify ile sanitize
  // import DOMPurify from 'dompurify';
  // element.innerHTML = DOMPurify.sanitize(userInput);
</script>`}
            />

            <CodeExample
              title="Attribute Injection"
              description="HTML attribute'larına kullanıcı verisi enjekte edilmesi"
              type="vulnerable"
              language="html"
              vulnerableCode={`<!-- ❌ Güvensiz: Attribute'a doğrudan veri -->
<a href="javascript:alert('XSS')">Tıkla</a>

<img src="user_input" onerror="alert('XSS')">

<div style="background:url('javascript:alert(1)')">
  İçerik
</div>

<!-- Event handler injection -->
<input value="" onfocus="alert('XSS')" autofocus>`}
              secureCode={`<!-- ✅ Güvenli: URL ve attribute doğrulama -->
<script>
  function safeUrl(url) {
    try {
      const parsed = new URL(url);
      // Sadece http ve https protokollerine izin ver
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return '#';
      }
      return parsed.href;
    } catch {
      return '#';
    }
  }
  
  function safeAttribute(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }
</script>

<a id="safeLink">Tıkla</a>
<script>
  const link = document.getElementById('safeLink');
  link.href = safeUrl(userProvidedUrl);
  link.textContent = safeAttribute(userProvidedText);
</script>`}
            />

            <CodeExample
              title="Content Security Policy (CSP)"
              description="CSP ile XSS saldırılarını engelleme"
              type="secure"
              language="html"
              secureCode={`<!-- Meta tag ile CSP tanımlama -->
<meta http-equiv="Content-Security-Policy" 
  content="
    default-src 'self';
    script-src 'self' 'nonce-randomValue123';
    style-src 'self' 'unsafe-inline';
    img-src 'self' https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.example.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  ">

<!-- Nonce kullanarak inline script -->
<script nonce="randomValue123">
  // Bu script çalışır çünkü nonce eşleşiyor
  console.log('Güvenli inline script');
</script>

<!-- Nonce olmayan script çalışmaz -->
<!-- <script>alert('Bu engellenir')</script> -->`}
            />
          </TabsContent>

          <TabsContent value="forms" className="space-y-6">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Form Güvenliği</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  HTML formlarında güvenlik, veri doğrulama, CSRF koruması ve güvenli iletim yöntemleri.
                </p>
              </CardContent>
            </Card>

            <CodeExample
              title="Güvenli Form Tasarımı"
              description="HTML5 doğrulama ve güvenlik attribute'ları"
              type="secure"
              language="html"
              vulnerableCode={`<!-- ❌ Güvensiz Form -->
<form action="/login" method="GET">
  <!-- GET ile parola gönderme! URL'de görünür -->
  <input type="text" name="username">
  <input type="text" name="password">
  <!-- type="text" ile parola gösterilir -->
  
  <!-- autocomplete açık, tarayıcı saklar -->
  <button type="submit">Giriş</button>
</form>

<!-- action olmadan form - sayfa URL'ine gider -->
<form>
  <input name="data">
  <button>Gönder</button>
</form>`}
              secureCode={`<!-- ✅ Güvenli Form -->
<form action="/login" method="POST" 
  autocomplete="off"
  novalidate>
  
  <!-- CSRF Token -->
  <input type="hidden" name="_token" 
    value="server_generated_csrf_token">
  
  <!-- Honeypot (bot koruması) -->
  <div style="display:none" aria-hidden="true">
    <input type="text" name="website" tabindex="-1">
  </div>
  
  <label for="username">Kullanıcı Adı</label>
  <input type="text" id="username" name="username"
    required
    minlength="3"
    maxlength="50"
    pattern="[a-zA-Z0-9_]+"
    autocomplete="username"
    spellcheck="false">
  
  <label for="password">Parola</label>
  <input type="password" id="password" name="password"
    required
    minlength="8"
    maxlength="128"
    autocomplete="current-password">
  
  <button type="submit">Güvenli Giriş</button>
</form>`}
            />

            <CodeExample
              title="Input Doğrulama Attribute'ları"
              description="HTML5 ile istemci tarafı doğrulama"
              type="secure"
              language="html"
              secureCode={`<!-- Kapsamlı Input Doğrulama -->
<form id="secureForm" method="POST" action="/api/submit">
  
  <!-- E-posta doğrulama -->
  <input type="email" name="email" required
    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
    title="Geçerli bir e-posta adresi girin">
  
  <!-- Telefon doğrulama -->
  <input type="tel" name="phone"
    pattern="\\+90[0-9]{10}"
    title="Türkiye telefon formatı: +905xxxxxxxxx">
  
  <!-- URL doğrulama -->
  <input type="url" name="website"
    pattern="https://.*"
    title="URL https:// ile başlamalıdır">
  
  <!-- Sayı aralığı -->
  <input type="number" name="age"
    min="18" max="120" step="1">
  
  <!-- Dosya yükleme kısıtlama -->
  <input type="file" name="avatar"
    accept="image/jpeg,image/png,image/webp"
    data-max-size="5242880">
  
  <!-- Textarea karakter sınırı -->
  <textarea name="message" 
    maxlength="1000" 
    rows="4"></textarea>
  
  <button type="submit">Gönder</button>
</form>

<script>
  document.getElementById('secureForm')
    .addEventListener('submit', function(e) {
      // Sunucu tarafında da mutlaka doğrulayın!
      const file = this.querySelector('[type=file]').files[0];
      if (file && file.size > 5242880) {
        e.preventDefault();
        alert('Dosya boyutu 5MB\'dan küçük olmalı');
      }
    });
</script>`}
            />
          </TabsContent>

          <TabsContent value="iframe" className="space-y-6">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span>iframe ve Embedding Güvenliği</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  iframe kullanımı, clickjacking saldırıları ve güvenli embedding yöntemleri.
                </p>
              </CardContent>
            </Card>

            <CodeExample
              title="Clickjacking Koruması"
              description="iframe ile yapılan clickjacking saldırılarını engelleme"
              type="vulnerable"
              language="html"
              vulnerableCode={`<!-- ❌ Saldırgan sitesi: Clickjacking -->
<!-- Hedef siteyi iframe içinde gösterir -->
<style>
  .overlay {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    opacity: 0; /* Görünmez katman */
    z-index: 10;
  }
  iframe {
    width: 500px;
    height: 300px;
    opacity: 0.01; /* Neredeyse görünmez */
    position: absolute;
  }
</style>

<p>Ödülünüzü kazanmak için tıklayın!</p>
<button class="overlay">Tıkla!</button>

<!-- Kullanıcı butona tıkladığını sanır ama 
     aslında iframe içindeki "Hesabı Sil" 
     butonuna tıklar -->
<iframe src="https://hedef-site.com/hesap">
</iframe>`}
              secureCode={`<!-- ✅ Clickjacking Koruması -->

<!-- 1. X-Frame-Options başlığı (sunucu tarafı) -->
<!-- Apache .htaccess -->
<!-- Header always set X-Frame-Options "DENY" -->

<!-- 2. CSP frame-ancestors -->
<meta http-equiv="Content-Security-Policy" 
  content="frame-ancestors 'none';">

<!-- 3. JavaScript frame-busting -->
<script>
  // Sayfa iframe içinde açıldıysa engelle
  if (window.self !== window.top) {
    // iframe içindeyiz, sayfayı boşalt
    document.body.innerHTML = '';
    window.top.location = window.self.location;
  }
</script>

<!-- 4. Güvenli iframe kullanımı -->
<iframe 
  src="https://trusted-site.com/widget"
  sandbox="allow-scripts allow-same-origin"
  referrerpolicy="no-referrer"
  loading="lazy"
  title="Güvenli Widget">
</iframe>

<!-- sandbox attribute değerleri:
  allow-scripts: JS çalıştırma
  allow-same-origin: aynı origin erişimi
  allow-forms: form gönderimi
  allow-popups: popup açma
  (boş sandbox en kısıtlayıcı) -->`}
            />
          </TabsContent>

          <TabsContent value="headers" className="space-y-6">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>HTTP Güvenlik Başlıkları</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Web uygulamalarını koruyan temel HTTP güvenlik başlıkları ve HTML meta etiketleri.
                </p>
              </CardContent>
            </Card>

            <CodeExample
              title="Temel Güvenlik Meta Etiketleri"
              description="Her HTML sayfasında olması gereken güvenlik etiketleri"
              type="secure"
              language="html"
              secureCode={`<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" 
    content="width=device-width, initial-scale=1.0">
  
  <!-- XSS Koruması -->
  <meta http-equiv="X-XSS-Protection" 
    content="1; mode=block">
  
  <!-- MIME Type Sniffing engelleme -->
  <meta http-equiv="X-Content-Type-Options" 
    content="nosniff">
  
  <!-- Referrer politikası -->
  <meta name="referrer" 
    content="strict-origin-when-cross-origin">
  
  <!-- Content Security Policy -->
  <meta http-equiv="Content-Security-Policy" 
    content="
      default-src 'self';
      script-src 'self';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self';
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
      upgrade-insecure-requests;
    ">
  
  <!-- Permissions Policy -->
  <meta http-equiv="Permissions-Policy" 
    content="
      camera=(),
      microphone=(),
      geolocation=(self),
      payment=()
    ">
  
  <title>Güvenli Sayfa</title>
</head>
<body>
  <!-- Güvenli içerik -->
</body>
</html>`}
            />

            <CodeExample
              title="Apache/Nginx Güvenlik Başlıkları"
              description="Sunucu tarafında ayarlanması gereken başlıklar"
              type="secure"
              language="bash"
              secureCode={`# Apache (.htaccess)
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(self)"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self'"

# Nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'" always;`}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HtmlSecurity;
