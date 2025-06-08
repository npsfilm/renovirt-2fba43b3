
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          {/* Pixo Character Image */}
          <div className="mb-6 flex justify-center">
            <img 
              src="/lovable-uploads/16e3b792-4a28-4957-bd43-9aacfb434b21.png" 
              alt="Verlorenes Pixo-Maskottchen mit Kamera" 
              className="w-48 h-48 object-contain"
            />
          </div>

          {/* Error Message */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Seite nicht gefunden
            </h2>
            <p className="text-muted-foreground mb-2">
              Es tut uns leid, aber die von Ihnen gesuchte Seite existiert nicht.
            </p>
            <p className="text-sm text-subtle">
              Pfad: <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Zur Startseite
              </Link>
            </Button>
            
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/dashboard">
                  <Search className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Benötigen Sie Hilfe?
            </p>
            <Button asChild variant="link" size="sm">
              <Link to="/help">
                Kontaktieren Sie unseren Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
