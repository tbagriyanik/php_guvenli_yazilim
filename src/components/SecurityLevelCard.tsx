import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface SecurityLevelCardProps {
  level: number;
  title: string;
  description: string;
  features: string[];
  href: string;
  variant: "success" | "warning" | "danger";
  icon: React.ReactNode;
}

const SecurityLevelCard = ({ 
  level, 
  title, 
  description, 
  features, 
  href, 
  variant,
  icon 
}: SecurityLevelCardProps) => {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case "success":
        return "security-level-1 hover:border-success/40 hover:shadow-success/20";
      case "warning":
        return "security-level-2 hover:border-warning/40 hover:shadow-warning/20";
      case "danger":
        return "security-level-3 hover:border-danger/40 hover:shadow-danger/20";
      default:
        return "";
    }
  };

  const getBadgeVariant = (variant: string) => {
    switch (variant) {
      case "success":
        return "bg-success/20 text-success border-success/30";
      case "warning":
        return "bg-warning/20 text-warning border-warning/30";
      case "danger":
        return "bg-danger/20 text-danger border-danger/30";
      default:
        return "secondary";
    }
  };

  return (
    <Link to={href} className="group block">
      <Card className={`security-card ${getVariantClasses(variant)} group-hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="security-icon text-primary group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
              <Badge className={getBadgeVariant(variant)}>
                {level}. Seviye
              </Badge>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mb-6">
            {features.slice(0, 4).map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
            {features.length > 4 && (
              <li className="text-sm text-muted-foreground">
                +{features.length - 4} daha fazla güvenlik önlemi
              </li>
            )}
          </ul>
          <Button className="w-full group-hover:bg-primary-hover transition-colors">
            Detayları İncele
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SecurityLevelCard;