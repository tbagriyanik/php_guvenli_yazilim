import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield, Lock, AlertTriangle, Zap, BookOpen, Target } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Ana Sayfa", icon: Shield },
    { href: "/baslangic", label: "Başlangıç", icon: Lock },
    { href: "/orta", label: "Orta Seviye", icon: AlertTriangle },
    { href: "/ileri", label: "İleri Seviye", icon: Zap },
    { href: "/uygulamali", label: "Uygulamalı", icon: BookOpen },
  ];

  const NavLink = ({ href, label, icon: Icon, mobile = false }) => {
    const isActive = location.pathname === href;
    
    return (
      <Link
        to={href}
        className={`nav-link ${isActive ? 'active' : ''} ${
          mobile ? 'flex items-center space-x-3 text-lg' : 'flex items-center space-x-2'
        }`}
        onClick={() => mobile && setIsOpen(false)}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-primary animate-security-pulse" />
          <span className="text-xl font-bold gradient-text">PHP Security Guide</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-8">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold gradient-text">PHP Security Guide</span>
              </div>
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  mobile={true}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navigation;