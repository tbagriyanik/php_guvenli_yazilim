import { Server, Shield, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeExample from "@/components/CodeExample";
import { Link } from "react-router-dom";

const NodejsSecurity = () => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center space-x-4 mb-8 animate-fade-in">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <Server className="w-10 h-10 text-primary animate-security-pulse" />
          <div>
            <h1 className="text-3xl font-bold gradient-text">Node.js Güvenlik Dersleri</h1>
            <p className="text-muted-foreground">Node.js backend uygulamalarında güvenlik önlemleri</p>
          </div>
        </div>

        <Tabs defaultValue="injection" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-2">
            <TabsTrigger value="injection" className="text-xs">Injection Koruması</TabsTrigger>
            <TabsTrigger value="auth" className="text-xs">Kimlik Doğrulama</TabsTrigger>
            <TabsTrigger value="ratelimit" className="text-xs">Rate Limiting</TabsTrigger>
            <TabsTrigger value="env" className="text-xs">Ortam Değişkenleri</TabsTrigger>
            <TabsTrigger value="helmet" className="text-xs">Helmet & Middleware</TabsTrigger>
          </TabsList>

          <TabsContent value="injection" className="space-y-6">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span>Command & NoSQL Injection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Node.js'te komut enjeksiyonu ve NoSQL injection saldırıları ile korunma yöntemleri.
                </p>
              </CardContent>
            </Card>

            <CodeExample
              title="Command Injection"
              description="child_process ile komut enjeksiyonu riski"
              type="vulnerable"
              language="javascript"
              vulnerableCode={`// ❌ Güvensiz: Kullanıcı girdisi ile komut çalıştırma
const { exec } = require('child_process');

app.get('/ping', (req, res) => {
  const host = req.query.host;
  
  // Saldırgan: ?host=google.com; rm -rf /
  exec('ping -c 4 ' + host, (error, stdout) => {
    res.send(stdout);
  });
});

// ❌ Güvensiz: eval ile JSON işleme
app.post('/calculate', (req, res) => {
  const result = eval(req.body.expression);
  res.json({ result });
});`}
              secureCode={`// ✅ Güvenli: execFile ile parametre ayrımı
const { execFile } = require('child_process');
const validator = require('validator');

app.get('/ping', (req, res) => {
  const host = req.query.host;
  
  // IP veya domain doğrulama
  if (!validator.isFQDN(host) && 
      !validator.isIP(host)) {
    return res.status(400).json({ 
      error: 'Geçersiz host' 
    });
  }
  
  // execFile: argümanlar ayrı geçilir, 
  // shell injection imkansız
  execFile('ping', ['-c', '4', host], 
    { timeout: 10000 },
    (error, stdout) => {
      if (error) {
        return res.status(500).json({ 
          error: 'Ping başarısız' 
        });
      }
      res.send(stdout);
    }
  );
});`}
            />

            <CodeExample
              title="NoSQL Injection (MongoDB)"
              description="MongoDB sorgularında injection koruması"
              type="vulnerable"
              language="javascript"
              vulnerableCode={`// ❌ Güvensiz: Doğrudan kullanıcı verisi
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Saldırgan gönderir:
  // { "username": {"$gt": ""}, 
  //   "password": {"$gt": ""} }
  // Bu TÜM kullanıcıları döndürür!
  
  const user = await db.collection('users').findOne({
    username: username,
    password: password
  });
  
  if (user) res.json({ token: createToken(user) });
});`}
              secureCode={`// ✅ Güvenli: NoSQL injection koruması
const mongoSanitize = require('express-mongo-sanitize');

// Middleware: $ ve . içeren key'leri engelle
app.use(mongoSanitize());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Tip kontrolü
  if (typeof username !== 'string' || 
      typeof password !== 'string') {
    return res.status(400).json({ 
      error: 'Geçersiz veri tipi' 
    });
  }
  
  // Uzunluk sınırı
  if (username.length > 50 || password.length > 128) {
    return res.status(400).json({ 
      error: 'Veri çok uzun' 
    });
  }
  
  const user = await db.collection('users').findOne({
    username: String(username) // String'e zorla
  });
  
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    // Genel hata mesajı (kullanıcı keşfini engelle)
    return res.status(401).json({ 
      error: 'Geçersiz kimlik bilgileri' 
    });
  }
  
  res.json({ token: createToken(user) });
});`}
            />
          </TabsContent>

          <TabsContent value="auth" className="space-y-6">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>JWT ve Session Güvenliği</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Node.js'te güvenli kimlik doğrulama, JWT token yönetimi ve session güvenliği.
                </p>
              </CardContent>
            </Card>

            <CodeExample
              title="Güvenli JWT Uygulaması"
              description="JWT token oluşturma ve doğrulama"
              type="vulnerable"
              language="javascript"
              vulnerableCode={`// ❌ Güvensiz JWT kullanımı
const jwt = require('jsonwebtoken');

// Zayıf secret
const SECRET = 'password123';

// Algorithm belirtilmemiş (none attack!)
const token = jwt.sign({ userId: 1, role: 'admin' }, SECRET);

// Doğrulamada algorithm kontrolü yok
app.use((req, res, next) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, SECRET);
  // { algorithm: "none" } saldırısına açık!
  req.user = decoded;
  next();
});`}
              secureCode={`// ✅ Güvenli JWT uygulaması
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Güçlü secret (env'den oku)
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function generateTokens(user) {
  // Kısa ömürlü access token
  const accessToken = jwt.sign(
    { 
      userId: user.id, 
      role: user.role,
      jti: crypto.randomUUID() // Unique ID
    },
    ACCESS_SECRET,
    { 
      algorithm: 'HS256',  // Algorithm belirt!
      expiresIn: '15m',
      issuer: 'myapp',
      audience: 'myapp-users'
    }
  );
  
  // Uzun ömürlü refresh token
  const refreshToken = jwt.sign(
    { userId: user.id, jti: crypto.randomUUID() },
    REFRESH_SECRET,
    { algorithm: 'HS256', expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
}

// Güvenli doğrulama middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token gerekli' });
  }
  
  const token = authHeader.slice(7);
  
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET, {
      algorithms: ['HS256'], // Sadece HS256 kabul et!
      issuer: 'myapp',
      audience: 'myapp-users'
    });
    
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token süresi doldu' });
    }
    return res.status(403).json({ error: 'Geçersiz token' });
  }
}`}
            />
          </TabsContent>

          <TabsContent value="ratelimit" className="space-y-6">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Rate Limiting & Brute Force Koruması</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  API isteklerini sınırlama ve brute force saldırılarına karşı koruma.
                </p>
              </CardContent>
            </Card>

            <CodeExample
              title="Express Rate Limiter"
              description="express-rate-limit ile istek sınırlama"
              type="secure"
              language="javascript"
              secureCode={`const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

// Genel API limiti
const apiLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redis.call(...args) }),
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // IP başına 100 istek
  message: { error: 'Çok fazla istek, lütfen bekleyin' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login için sıkı limit
const loginLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redis.call(...args) }),
  windowMs: 15 * 60 * 1000,
  max: 5, // 15 dakikada 5 deneme
  message: { error: 'Çok fazla giriş denemesi' },
  skipSuccessfulRequests: true,
});

// Uygula
app.use('/api/', apiLimiter);
app.post('/api/login', loginLimiter);

// Brute force koruması (hesap bazlı)
const loginAttempts = new Map();

app.post('/api/login', async (req, res) => {
  const { email } = req.body;
  const attempts = loginAttempts.get(email) || { count: 0, lockUntil: 0 };
  
  // Hesap kilitli mi?
  if (attempts.lockUntil > Date.now()) {
    const waitMinutes = Math.ceil((attempts.lockUntil - Date.now()) / 60000);
    return res.status(429).json({
      error: \`Hesap kilitli. \${waitMinutes} dk sonra tekrar deneyin\`
    });
  }
  
  const user = await authenticateUser(email, req.body.password);
  
  if (!user) {
    attempts.count++;
    if (attempts.count >= 5) {
      attempts.lockUntil = Date.now() + 15 * 60 * 1000;
      attempts.count = 0;
    }
    loginAttempts.set(email, attempts);
    return res.status(401).json({ error: 'Geçersiz kimlik bilgileri' });
  }
  
  loginAttempts.delete(email);
  res.json({ token: generateToken(user) });
});`}
            />
          </TabsContent>

          <TabsContent value="env" className="space-y-6">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Ortam Değişkenleri ve Konfigürasyon</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hassas bilgilerin güvenli yönetimi, .env dosyaları ve secret rotation.
                </p>
              </CardContent>
            </Card>

            <CodeExample
              title="Güvenli Konfigürasyon Yönetimi"
              description=".env dosyaları ve ortam değişkenleri"
              type="vulnerable"
              language="javascript"
              vulnerableCode={`// ❌ Güvensiz: Hardcoded credentials
const config = {
  db: {
    host: 'db.server.com',
    user: 'admin',
    password: 'SuperSecret123!',
    database: 'production_db'
  },
  jwt: {
    secret: 'my-jwt-secret'
  },
  stripe: {
    secretKey: 'sk_live_abc123...'
  },
  email: {
    apiKey: 'SG.xxxxx'
  }
};

// ❌ Güvensiz: .env dosyası git'e ekleniyor
// .gitignore'a .env eklenmemiş!`}
              secureCode={`// ✅ Güvenli: Ortam değişkenleri ile konfigürasyon
require('dotenv').config();

// config/index.js
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'STRIPE_SECRET_KEY'
];

// Başlangıçta eksik değişken kontrolü
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(\`❌ Eksik: \${envVar}\`);
    process.exit(1);
  }
}

const config = Object.freeze({
  db: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  },
  server: {
    port: parseInt(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || 'development'
  }
});

module.exports = config;

// .env.example (git'e ekle - gerçek değerler olmadan)
// DATABASE_URL=postgresql://user:pass@localhost/db
// JWT_SECRET=change-me-in-production
// STRIPE_SECRET_KEY=sk_test_xxx

// .gitignore
// .env
// .env.local
// .env.production`}
            />
          </TabsContent>

          <TabsContent value="helmet" className="space-y-6">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Helmet ve Güvenlik Middleware'leri</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Express.js güvenlik middleware'leri ile uygulamanızı koruma altına alın.
                </p>
              </CardContent>
            </Card>

            <CodeExample
              title="Express Güvenlik Middleware Stack"
              description="Kapsamlı güvenlik middleware yapılandırması"
              type="secure"
              language="javascript"
              secureCode={`const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// 1. Helmet: HTTP güvenlik başlıkları
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));

// 2. CORS: İzin verilen origin'ler
app.use(cors({
  origin: ['https://myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));

// 3. Body parser limitleri
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// 4. HTTP Parameter Pollution koruması
app.use(hpp());

// 5. NoSQL injection koruması
app.use(mongoSanitize());

// 6. Request boyutu limiti
app.use((req, res, next) => {
  if (req.headers['content-length'] > 1048576) {
    return res.status(413).json({ error: 'Payload çok büyük' });
  }
  next();
});

// 7. Güvenlik logları
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      console.warn({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        ip: req.ip,
        duration: Date.now() - start
      });
    }
  });
  next();
});

// Hata yönetimi
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Sunucu hatası'
      : err.message
  });
});`}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NodejsSecurity;
