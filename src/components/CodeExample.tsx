import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, AlertTriangle, CheckCircle, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CodeExampleProps {
  title: string;
  description?: string;
  vulnerableCode?: string;
  secureCode: string;
  language?: string;
  type?: "vulnerable" | "secure" | "info";
}

const CodeExample = ({ 
  title, 
  description, 
  vulnerableCode, 
  secureCode, 
  language = "php",
  type = "secure"
}: CodeExampleProps) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"vulnerable" | "secure">(
    vulnerableCode ? "vulnerable" : "secure"
  );
  const { toast } = useToast();

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Kod kopyalandı!",
        description: "Kod panoya başarıyla kopyalandı.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Kopyalama hatası",
        description: "Kod kopyalanırken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "vulnerable":
        return <AlertTriangle className="w-4 h-4 text-danger" />;
      case "secure":
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return <CheckCircle className="w-4 h-4 text-primary" />;
    }
  };

  const getTypeClasses = (type: string) => {
    switch (type) {
      case "vulnerable":
        return "border-danger/30 bg-danger/5";
      case "secure":
        return "border-success/30 bg-success/5";
      default:
        return "border-primary/30 bg-primary/5";
    }
  };

  return (
    <Card className={`code-example ${getTypeClasses(type)} animate-fade-in`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon(type)}
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {language.toUpperCase()}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(activeTab === "vulnerable" ? vulnerableCode || "" : secureCode)}
          >
            {copied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {vulnerableCode && (
          <div className="flex space-x-2 mt-2">
            <Button
              variant={activeTab === "vulnerable" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("vulnerable")}
              className="h-8"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Güvensiz
            </Button>
            <Button
              variant={activeTab === "secure" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("secure")}
              className="h-8"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Güvenli
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative">
          <SyntaxHighlighter
            language={language}
            style={oneLight}
            customStyle={{
              backgroundColor: '#f8f9fc',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}
            showLineNumbers={true}
            wrapLines={true}
          >
            {activeTab === "vulnerable" ? vulnerableCode || "" : secureCode}
          </SyntaxHighlighter>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 opacity-50 hover:opacity-100"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  {getTypeIcon(type)}
                  <span>{title}</span>
                  <Badge variant="outline" className="text-xs">
                    {language.toUpperCase()}
                  </Badge>
                </DialogTitle>
                {description && (
                  <DialogDescription>{description}</DialogDescription>
                )}
              </DialogHeader>
              
              {vulnerableCode && (
                <div className="flex space-x-2 mb-4">
                  <Button
                    variant={activeTab === "vulnerable" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("vulnerable")}
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Güvensiz
                  </Button>
                  <Button
                    variant={activeTab === "secure" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("secure")}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Güvenli
                  </Button>
                </div>
              )}
              
              <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{
                  backgroundColor: '#1e1e1e',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.6'
                }}
                showLineNumbers={true}
                wrapLines={false}
              >
                {activeTab === "vulnerable" ? vulnerableCode || "" : secureCode}
              </SyntaxHighlighter>
              
              <Button
                onClick={() => copyToClipboard(activeTab === "vulnerable" ? vulnerableCode || "" : secureCode)}
                className="mt-4"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Kopyalandı
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Kodu Kopyala
                  </>
                )}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeExample;