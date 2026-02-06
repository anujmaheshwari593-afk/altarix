import { Link } from "react-router-dom";
import { Layers } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logo and description */}
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Layers className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">ASAC</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Aerospace Standard Atmosphere Calculator. Precise atmospheric profiles 
              for design, simulation, and flight analysis.
            </p>
          </div>
          
          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/methodology" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Methodology
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Reference</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://en.wikipedia.org/wiki/International_Standard_Atmosphere" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ISA Wikipedia
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.iso.org/standard/7472.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ISO 2533:1975
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ASAC. Built for engineers, by engineers.
          </p>
          <p className="text-xs text-muted-foreground">
            Based on ISO 2533:1975 / ICAO Standard Atmosphere
          </p>
        </div>
      </div>
    </footer>
  );
}
