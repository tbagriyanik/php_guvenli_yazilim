import { Lock, AlertTriangle, Zap, ArrowRight, Shield, Code, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SecurityLevelCard from "@/components/SecurityLevelCard";
import { Link } from "react-router-dom";

const Index = () => {
  const securityLevels = [
    {
      level: 1,
      title: "Başlangıç Seviyesi",
      description: "Temel güvenlik önlemleri ve her projede olması gereken minimum güvenlik katmanları.",
      features: [
        "SQL Injection koruması",
        "Parola güvenliği (hashing)",
        "XSS koruması",
        "CSRF token sistemi",
        "Session güvenliği",
        "Güvenli yapılandırma"
      ],
      href: "/baslangic",
      variant: "success" as const,
      icon: <Lock className="w-8 h-8" />
    },
    {
      level: 2,
      title: "Orta Seviye",
      description: "Gelişmiş güvenlik önlemleri ve profesyonel uygulamalar için gerekli koruma katmanları.",
      features: [
        "Rol bazlı erişim (RBAC)",
        "Dosya yükleme güvenliği",
        "Input doğrulama",
        "HTTPS zorunluluğu",
        "Güvenli hata yönetimi",
        "Veritabanı yedekleme"
      ],
      href: "/orta",
      variant: "warning" as const,
      icon: <AlertTriangle className="w-8 h-8" />
    },
    {
      level: 3,
      title: "İleri Seviye",
      description: "Kurumsal düzeyde güvenlik çözümleri ve profesyonel koruma sistemleri.",
      features: [
        "Web Application Firewall (WAF)",
        "IDS/IPS sistemleri",
        "Rate limiting",
        "İki faktörlü kimlik doğrulama",
        "Güvenlik test araçları",
        "Güncel kütüphane yönetimi"
      ],
      href: "/ileri",
      variant: "danger" as const,
      icon: <Zap className="w-8 h-8" />
    }
  ];

  const stats = [
    { label: "Güvenlik Seviyesi", value: "3", icon: <Shield className="w-5 h-5" /> },
    { label: "Kod Örneği", value: "50+", icon: <Code className="w-5 h-5" /> },
    { label: "Güvenlik Önlemi", value: "25+", icon: <Users className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container mx-auto max-w-4xl space-y-8 animate-fade-in">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Shield className="w-16 h-16 text-primary animate-security-pulse" />
            <div className="text-left">
              <h1 className="text-5xl font-bold gradient-text">Web Güvenliği</h1>
              <p className="text-2xl text-muted-foreground">Kapsamlı Rehber</p>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Web projeleriniz için kapsamlı güvenlik rehberi. PHP, JavaScript, Node.js ve 
            HTML güvenlik önlemleri ile projelerinizi koruma altına alın.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {stats.map((stat, index) => (
              <Card key={index} className="security-card min-w-[120px]" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="flex flex-col items-center p-4">
                  <div className="text-primary mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground text-center">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button asChild size="lg" className="animate-float">
            <Link to="/baslangic">
              Güvenlik Yolculuğuna Başla
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Security Levels */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Güvenlik Seviyeleri</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Her seviye bir öncekinin üzerine eklenen gelişmiş güvenlik önlemlerini içerir. 
              Kademeli olarak güvenlik seviyenizi artırın.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {securityLevels.map((level, index) => (
              <SecurityLevelCard
                key={level.level}
                {...level}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Neler İçeriyor?</h2>
            <p className="text-muted-foreground">
              Kapsamlı güvenlik rehberi ile projelerinizi koruma altına alın.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="security-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-primary" />
                  <span>Pratik Kod Örnekleri</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Her güvenlik önlemi için güvensiz ve güvenli kod örnekleri ile detaylı açıklamalar.
                </p>
              </CardContent>
            </Card>
            
            <Card className="security-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Tamir Rehberleri</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mevcut projelerinizdeki güvenlik açıklarını nasıl gidereceğiniz için adım adım rehber.
                </p>
              </CardContent>
            </Card>
            
            <Card className="security-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Kullanıcı Dostu</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mobil uyumlu tasarım ve interaktif animasyonlar ile öğrenme deneyimi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;