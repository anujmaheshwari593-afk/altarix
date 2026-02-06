import { Calculator, Code2, Database, FileJson, Layers, LineChart } from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "Precise ISA Calculations",
    description: "Accurate implementation of ISO 2533:1975 standard atmosphere with all 7 layers from sea level to 86 km.",
  },
  {
    icon: Layers,
    title: "Layer Detection",
    description: "Automatic identification of atmospheric layer (Troposphere, Stratosphere, Mesosphere) with exact boundary altitudes.",
  },
  {
    icon: LineChart,
    title: "Rich Properties",
    description: "Temperature, pressure, density, speed of sound, dynamic viscosity, and kinematic viscosity for every altitude.",
  },
  {
    icon: FileJson,
    title: "Multiple Export Formats",
    description: "Download results as CSV or JSON. Ready for OpenRocket, CFD solvers, MATLAB, Python, and other simulation tools.",
  },
  {
    icon: Code2,
    title: "Unit Flexibility",
    description: "Toggle between SI and Imperial units. Support for meters/feet, Kelvin/Celsius/Fahrenheit, Pa/hPa/atm.",
  },
  {
    icon: Database,
    title: "Reproducible Results",
    description: "Every calculation includes the exact formulas and constants used. Perfect for engineering reports and academic citations.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Engineering-Grade Accuracy
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for aerospace engineers, researchers, and students who need reliable atmospheric data 
            for design, simulation, and analysis.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="group p-6 rounded-2xl border bg-card transition-all duration-300 hover:shadow-lg hover:border-accent/30"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                <feature.icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
