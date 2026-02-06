import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LAYERS, ISA_CONSTANTS } from "@/lib/isa-calculations";

export default function Methodology() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Methodology</h1>
            <p className="text-lg text-muted-foreground">
              Technical documentation of the International Standard Atmosphere (ISA) model 
              implementation used in ASAC.
            </p>
          </div>

          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              The International Standard Atmosphere (ISA) is a static atmospheric model defined by 
              ISO 2533:1975 and adopted by the International Civil Aviation Organization (ICAO). 
              It provides a standardized reference for temperature, pressure, and density as functions 
              of altitude, enabling consistent comparison of aircraft performance and atmospheric research.
            </p>
            <p className="text-muted-foreground">
              ASAC implements the ISA model for geopotential altitudes from 0 to 86 km, covering the 
              troposphere, stratosphere, and mesosphere.
            </p>
          </section>

          {/* Constants */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Physical Constants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">Symbol</th>
                      <th className="text-left py-2 pr-4">Value</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr className="border-b">
                      <td className="py-2 pr-4">g₀</td>
                      <td className="py-2 pr-4">{ISA_CONSTANTS.g0} m/s²</td>
                      <td className="py-2 font-sans text-muted-foreground">Standard gravity</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4">R</td>
                      <td className="py-2 pr-4">{ISA_CONSTANTS.R} J/(kg·K)</td>
                      <td className="py-2 font-sans text-muted-foreground">Specific gas constant for dry air</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4">M</td>
                      <td className="py-2 pr-4">{ISA_CONSTANTS.M} kg/mol</td>
                      <td className="py-2 font-sans text-muted-foreground">Molar mass of dry air</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4">γ</td>
                      <td className="py-2 pr-4">{ISA_CONSTANTS.gamma}</td>
                      <td className="py-2 font-sans text-muted-foreground">Ratio of specific heats (Cp/Cv)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4">T₀</td>
                      <td className="py-2 pr-4">{ISA_CONSTANTS.T0} K</td>
                      <td className="py-2 font-sans text-muted-foreground">Sea level temperature</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4">P₀</td>
                      <td className="py-2 pr-4">{ISA_CONSTANTS.P0} Pa</td>
                      <td className="py-2 font-sans text-muted-foreground">Sea level pressure</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">ρ₀</td>
                      <td className="py-2 pr-4">{ISA_CONSTANTS.rho0} kg/m³</td>
                      <td className="py-2 font-sans text-muted-foreground">Sea level density</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Layer Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Atmospheric Layers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">Layer</th>
                      <th className="text-right py-2 pr-4">Base (km)</th>
                      <th className="text-right py-2 pr-4">Tb (K)</th>
                      <th className="text-right py-2 pr-4">Lapse (K/km)</th>
                      <th className="text-right py-2">Pb (Pa)</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {LAYERS.map((layer) => (
                      <tr key={layer.name} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-sans font-medium">{layer.name}</td>
                        <td className="py-2 pr-4 text-right">{layer.baseAltitude / 1000}</td>
                        <td className="py-2 pr-4 text-right">{layer.baseTemperature}</td>
                        <td className="py-2 pr-4 text-right">{layer.lapseRate * 1000}</td>
                        <td className="py-2 text-right">{layer.basePressure.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Formulas */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Governing Equations</h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Temperature</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Temperature varies linearly with altitude within each layer:
                </p>
                <div className="bg-muted p-4 rounded-lg font-mono text-center mb-4">
                  T = T<sub>b</sub> + L · (h - h<sub>b</sub>)
                </div>
                <p className="text-sm text-muted-foreground">
                  Where T<sub>b</sub> is the base temperature, L is the lapse rate (K/m), 
                  h is the geopotential altitude, and h<sub>b</sub> is the layer base altitude.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Pressure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Pressure calculation depends on whether the layer is isothermal (L = 0) or has a temperature gradient:
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Gradient layer (L ≠ 0):</p>
                    <div className="bg-muted p-4 rounded-lg font-mono text-center">
                      P = P<sub>b</sub> · (T / T<sub>b</sub>)<sup>-g₀/(L·R)</sup>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Isothermal layer (L = 0):</p>
                    <div className="bg-muted p-4 rounded-lg font-mono text-center">
                      P = P<sub>b</sub> · exp(-g₀ · Δh / (R · T))
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Density</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Density is derived from the ideal gas law:
                </p>
                <div className="bg-muted p-4 rounded-lg font-mono text-center">
                  ρ = P / (R · T)
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Speed of Sound</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Speed of sound in an ideal gas:
                </p>
                <div className="bg-muted p-4 rounded-lg font-mono text-center">
                  a = √(γ · R · T)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dynamic Viscosity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Calculated using Sutherland's formula:
                </p>
                <div className="bg-muted p-4 rounded-lg font-mono text-center text-sm">
                  μ = μ₀ · (T/T₀)<sup>3/2</sup> · (T₀ + S) / (T + S)
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Where μ₀ = 1.7894×10⁻⁵ Pa·s, T₀ = 288.15 K, and S = 110.4 K (Sutherland's constant for air).
                </p>
              </CardContent>
            </Card>
          </section>

          {/* References */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">References</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-foreground font-medium">[1]</span>
                <span>ISO 2533:1975 — Standard Atmosphere. International Organization for Standardization.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground font-medium">[2]</span>
                <span>ICAO Doc 7488/3 — Manual of the ICAO Standard Atmosphere (extended to 80 kilometres).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground font-medium">[3]</span>
                <span>U.S. Standard Atmosphere, 1976. NOAA/NASA/USAF.</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
