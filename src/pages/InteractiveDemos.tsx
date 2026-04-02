import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Eye, Shield, Code, Zap, Lock, Play } from "lucide-react";

const XSSDemo = () => {
  const [unsafeInput, setUnsafeInput] = useState("");
  const [safeInput, setSafeInput] = useState("");
  const [unsafeOutput, setUnsafeOutput] = useState("");
  const [safeOutput, setSafeOutput] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const handleUnsafeSubmit = () => {
    const hasScript = /<script|<img|onerror|onclick|onload|javascript:/i.test(unsafeInput);
    setUnsafeOutput(unsafeInput);
    if (hasScript) {
      setShowWarning(true);
    }
  };

  const handleSafeSubmit = () => {
    setSafeOutput(escapeHtml(safeInput));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unsafe */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Güvensiz Çıktı
            </CardTitle>
            <CardDescription>Girdiyi filtrelemeden gösterir</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder='Dene: <img src="x" onerror="alert(1)">'
              value={unsafeInput}
              onChange={(e) => setUnsafeInput(e.target.value)}
              className="font-mono text-sm"
            />
            <Button onClick={handleUnsafeSubmit} variant="destructive" className="w-full">
              <Play className="w-4 h-4 mr-2" /> Gönder (Güvensiz)
            </Button>
            {unsafeOutput && (
              <div className="p-3 rounded-lg bg-background border border-destructive/20">
                <p className="text-xs text-muted-foreground mb-1">Ham çıktı:</p>
                <div className="font-mono text-sm break-all" dangerouslySetInnerHTML={{ __html: "⚠️ " + escapeHtml(unsafeOutput) }} />
                {showWarning && (
                  <div className="mt-2 p-2 rounded bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    XSS saldırısı tespit edildi! Gerçek bir sitede bu kod çalışırdı.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Safe */}
        <Card className="border-success/30 bg-success/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-success" />
              Güvenli Çıktı
            </CardTitle>
            <CardDescription>htmlspecialchars() ile temizlenmiş</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder='Dene: <img src="x" onerror="alert(1)">'
              value={safeInput}
              onChange={(e) => setSafeInput(e.target.value)}
              className="font-mono text-sm"
            />
            <Button onClick={handleSafeSubmit} className="w-full bg-success hover:bg-success/90 text-success-foreground">
              <Play className="w-4 h-4 mr-2" /> Gönder (Güvenli)
            </Button>
            {safeOutput && (
              <div className="p-3 rounded-lg bg-background border border-success/20">
                <p className="text-xs text-muted-foreground mb-1">Temizlenmiş çıktı:</p>
                <code className="font-mono text-sm break-all">{safeOutput}</code>
                <div className="mt-2 p-2 rounded bg-success/10 text-success text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Zararlı kod etkisiz hale getirildi!
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SQLInjectionDemo = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<{ type: "success" | "danger" | "warning" | null; message: string }>({ type: null, message: "" });
  const [queryPreview, setQueryPreview] = useState("");

  const simulateLogin = () => {
    const unsafeQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    setQueryPreview(unsafeQuery);

    if (username.includes("'") || username.includes("--") || username.includes("OR") || password.includes("'") || password.includes("--")) {
      if (username.includes("' OR '1'='1") || username.includes("' OR 1=1--") || password.includes("' OR '1'='1")) {
        setResult({
          type: "danger",
          message: "🚨 SQL Injection başarılı! Tüm kullanıcı verileri ele geçirildi. Saldırgan admin olarak giriş yaptı!"
        });
      } else {
        setResult({
          type: "warning",
          message: "⚠️ SQL sözdizimi hatası oluştu. Saldırgan SQL yapısını manipüle etmeye çalışıyor."
        });
      }
    } else if (username === "admin" && password === "1234") {
      setResult({ type: "success", message: "✅ Doğru kimlik bilgileri ile giriş yapıldı." });
    } else {
      setResult({ type: null, message: "❌ Yanlış kullanıcı adı veya şifre." });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Giriş Formu Simülasyonu
          </CardTitle>
          <CardDescription>
            SQL Injection deneyin: <code className="bg-muted px-1 rounded text-xs">admin' OR '1'='1</code> veya <code className="bg-muted px-1 rounded text-xs">' OR 1=1--</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Kullanıcı Adı</label>
              <Input
                placeholder="admin' OR '1'='1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Şifre</label>
              <Input
                type="text"
                placeholder="' OR '1'='1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          <Button onClick={simulateLogin} className="w-full">
            <Play className="w-4 h-4 mr-2" /> Giriş Yap
          </Button>

          {queryPreview && (
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground mb-1">Oluşan SQL sorgusu:</p>
              <code className="font-mono text-sm break-all text-destructive">{queryPreview}</code>
            </div>
          )}

          {result.message && (
            <div className={`p-4 rounded-lg border ${
              result.type === "danger" ? "bg-destructive/10 border-destructive/30 text-destructive" :
              result.type === "warning" ? "bg-warning/10 border-warning/30 text-warning" :
              result.type === "success" ? "bg-success/10 border-success/30 text-success" :
              "bg-muted border-border"
            }`}>
              <p className="text-sm font-medium">{result.message}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const PasswordStrengthDemo = () => {
  const [password, setPassword] = useState("");

  const checks = [
    { label: "En az 8 karakter", test: (p: string) => p.length >= 8 },
    { label: "Büyük harf içeriyor", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Küçük harf içeriyor", test: (p: string) => /[a-z]/.test(p) },
    { label: "Rakam içeriyor", test: (p: string) => /[0-9]/.test(p) },
    { label: "Özel karakter içeriyor", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
    { label: "Yaygın şifre değil", test: (p: string) => !["123456", "password", "admin", "qwerty", "12345678", "abc123"].includes(p.toLowerCase()) },
  ];

  const passedCount = checks.filter(c => c.test(password)).length;
  const strength = password.length === 0 ? 0 : passedCount <= 2 ? 1 : passedCount <= 4 ? 2 : 3;
  const strengthLabels = ["", "Zayıf 🔴", "Orta 🟡", "Güçlü 🟢"];
  const strengthColors = ["", "bg-destructive", "bg-warning", "bg-success"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Şifre Güç Analizi
        </CardTitle>
        <CardDescription>Şifrenizin ne kadar güvenli olduğunu test edin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Bir şifre yazın..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="font-mono text-lg"
        />

        {password && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Güç:</span>
                <span className="font-medium">{strengthLabels[strength]}</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${strengthColors[strength]}`}
                  style={{ width: `${(passedCount / checks.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {checks.map((check, i) => {
                const passed = check.test(password);
                return (
                  <div key={i} className={`flex items-center gap-2 text-sm transition-all duration-300 ${passed ? "text-success" : "text-muted-foreground"}`}>
                    {passed ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />}
                    <span>{check.label}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const CSRFDemo = () => {
  const [token] = useState(() => Math.random().toString(36).substring(2, 15));
  const [submittedToken, setSubmittedToken] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleValidSubmit = () => {
    setSubmittedToken(token);
    setResult("success");
  };

  const handleInvalidSubmit = () => {
    setSubmittedToken("fake-token-123");
    setResult("error");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          CSRF Token Simülasyonu
        </CardTitle>
        <CardDescription>Token doğrulama mekanizmasını deneyin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg bg-muted/50 border">
          <p className="text-xs text-muted-foreground mb-1">Sunucu tarafından üretilen token:</p>
          <code className="font-mono text-sm text-primary">{token}</code>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button onClick={handleValidSubmit} className="bg-success hover:bg-success/90 text-success-foreground">
            <CheckCircle className="w-4 h-4 mr-2" /> Doğru Token ile Gönder
          </Button>
          <Button onClick={handleInvalidSubmit} variant="destructive">
            <AlertTriangle className="w-4 h-4 mr-2" /> Sahte Token ile Gönder
          </Button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result === "success" ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"
          }`}>
            <p className="text-sm font-medium mb-1">
              Gönderilen token: <code className="font-mono">{submittedToken}</code>
            </p>
            {result === "success" ? (
              <p className="text-success text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Token doğrulandı, form işlendi!
              </p>
            ) : (
              <p className="text-destructive text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Token eşleşmedi! CSRF saldırısı engellendi.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const HeaderInspectorDemo = () => {
  const [url, setUrl] = useState("https://example.com");
  const [headers, setHeaders] = useState<{name: string; value: string; safe: boolean}[] | null>(null);

  const simulateHeaders = () => {
    const goodHeaders = [
      { name: "Content-Security-Policy", value: "default-src 'self'", safe: true },
      { name: "X-Frame-Options", value: "DENY", safe: true },
      { name: "X-Content-Type-Options", value: "nosniff", safe: true },
      { name: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains", safe: true },
      { name: "X-XSS-Protection", value: "1; mode=block", safe: true },
      { name: "Server", value: "Apache/2.4.41", safe: false },
      { name: "X-Powered-By", value: "PHP/7.4", safe: false },
    ];
    setHeaders(goodHeaders);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          HTTP Header Güvenlik Analizi
        </CardTitle>
        <CardDescription>Bir sitenin güvenlik headerlarını simüle edin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input value={url} onChange={(e) => setUrl(e.target.value)} className="font-mono text-sm" />
          <Button onClick={simulateHeaders}>
            <Play className="w-4 h-4 mr-2" /> Analiz Et
          </Button>
        </div>

        {headers && (
          <div className="space-y-2">
            {headers.map((h, i) => (
              <div key={i} className={`p-3 rounded-lg border flex items-start justify-between gap-3 ${
                h.safe ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"
              }`}>
                <div>
                  <p className="font-mono text-sm font-medium">{h.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{h.value}</p>
                </div>
                <Badge className={h.safe ? "bg-success/20 text-success border-success/30" : "bg-destructive/20 text-destructive border-destructive/30"}>
                  {h.safe ? "Güvenli" : "Risk"}
                </Badge>
              </div>
            ))}
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 text-sm text-warning">
              ⚠️ <strong>Server</strong> ve <strong>X-Powered-By</strong> başlıkları sunucu bilgilerini ifşa eder. Bunları kaldırın!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const InteractiveDemos = () => {
  return (
    <div className="container mx-auto py-8 space-y-8 px-4">
      <div className="text-center space-y-4 animate-fade-in">
        <div className="flex items-center justify-center space-x-3">
          <Zap className="w-12 h-12 text-primary animate-security-pulse" />
          <h1 className="text-4xl font-bold gradient-text">Etkileşimli Denemeler</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Güvenlik açıklarını canlı olarak deneyin, nasıl çalıştıklarını ve nasıl önlendiğini görün.
        </p>
        <Badge className="bg-primary/20 text-primary border-primary/30 text-lg px-4 py-2">
          Güvenli Sandbox Ortamı
        </Badge>
      </div>

      <Separator />

      <Tabs defaultValue="xss" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="xss" className="text-xs md:text-sm">XSS Saldırısı</TabsTrigger>
          <TabsTrigger value="sql" className="text-xs md:text-sm">SQL Injection</TabsTrigger>
          <TabsTrigger value="password" className="text-xs md:text-sm">Şifre Gücü</TabsTrigger>
          <TabsTrigger value="csrf" className="text-xs md:text-sm">CSRF Token</TabsTrigger>
          <TabsTrigger value="headers" className="text-xs md:text-sm">HTTP Headers</TabsTrigger>
        </TabsList>

        <TabsContent value="xss" className="mt-6">
          <XSSDemo />
        </TabsContent>
        <TabsContent value="sql" className="mt-6">
          <SQLInjectionDemo />
        </TabsContent>
        <TabsContent value="password" className="mt-6">
          <PasswordStrengthDemo />
        </TabsContent>
        <TabsContent value="csrf" className="mt-6">
          <CSRFDemo />
        </TabsContent>
        <TabsContent value="headers" className="mt-6">
          <HeaderInspectorDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractiveDemos;
