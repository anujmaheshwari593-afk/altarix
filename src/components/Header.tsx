import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, FileText, Layers } from "lucide-react";

export function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Layers className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">ASAC</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/">
            <Button 
              variant={isActive("/") ? "secondary" : "ghost"} 
              size="sm"
            >
              Home
            </Button>
          </Link>
          <Link to="/calculator">
            <Button 
              variant={isActive("/calculator") ? "secondary" : "ghost"} 
              size="sm"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Calculator
            </Button>
          </Link>
          <Link to="/methodology">
            <Button 
              variant={isActive("/methodology") ? "secondary" : "ghost"} 
              size="sm"
            >
              <FileText className="mr-2 h-4 w-4" />
              Methodology
            </Button>
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Link to="/calculator">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Open Calculator
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
