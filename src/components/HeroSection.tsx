import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, FileDown, Layers } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden hero-gradient">
      {/* Atmospheric layer visualization - right side */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30 pointer-events-none hidden lg:block">
        <AtmosphereVisualization />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
      
      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm mb-8 border border-white/10">
            <Layers className="h-4 w-4" />
            <span>ISA-Compliant • 0–86 km Range • Export Ready</span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 tracking-tight">
            Aerospace Standard
            <br />
            <span className="text-accent">Atmosphere Calculator</span>
          </h1>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-white/80 mb-4 font-light">
            Precise atmospheric profiles for design, simulation and flight analysis.
          </p>
          
          <p className="text-lg text-white/60 mb-10 max-w-2xl">
            Compute temperature, pressure, and density for any altitude using the International Standard Atmosphere. 
            Export-ready outputs for OpenRocket, CFD solvers, and engineering workflows.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-16">
            <Link to="/calculator">
              <Button size="lg" className="btn-hero group">
                <Calculator className="mr-2 h-5 w-5" />
                Open Calculator
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/methodology">
              <Button size="lg" className="btn-hero-outline">
                <FileDown className="mr-2 h-5 w-5" />
                View Methodology
              </Button>
            </Link>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FeatureCard 
              icon="🌡️"
              title="Full ISA Model"
              description="7 atmospheric layers, accurate to 86 km altitude"
            />
            <FeatureCard 
              icon="📊"
              title="Rich Output"
              description="T, P, ρ, speed of sound, viscosity & more"
            />
            <FeatureCard 
              icon="📁"
              title="Export Options"
              description="CSV, JSON, ready for simulation tools"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-white/60">{description}</p>
      </div>
    </div>
  );
}

function AtmosphereVisualization() {
  const layers = [
    { name: "Mesosphere", color: "hsl(260, 50%, 50%)", height: "25%" },
    { name: "Stratosphere", color: "hsl(180, 60%, 45%)", height: "30%" },
    { name: "Troposphere", color: "hsl(200, 80%, 55%)", height: "45%" },
  ];
  
  return (
    <div className="h-full flex flex-col">
      {layers.map((layer, index) => (
        <div 
          key={layer.name}
          className="relative flex items-center justify-center"
          style={{ 
            height: layer.height,
            background: `linear-gradient(180deg, ${layer.color}40 0%, ${layer.color}20 100%)`,
          }}
        >
          <span className="text-xs font-medium text-white/40 tracking-wider uppercase">
            {layer.name}
          </span>
          {index < layers.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
          )}
        </div>
      ))}
    </div>
  );
}
