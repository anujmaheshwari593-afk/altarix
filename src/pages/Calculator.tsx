import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Copy, Check, Info, Thermometer, Gauge, Wind, Layers } from "lucide-react";
import { 
  calculateAtmosphere, 
  generateProfile,
  exportToCSV, 
  exportToJSON, 
  convertAltitude,
  formatNumber,
  LAYERS,
  ISA_CONSTANTS,
  type AtmosphericResult 
} from "@/lib/isa-calculations";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type AltitudeUnit = "m" | "km" | "ft";
type TemperatureUnit = "K" | "C";
type PressureUnit = "Pa" | "hPa" | "atm";

export default function Calculator() {
  const [altitudeInput, setAltitudeInput] = useState("10000");
  const [altitudeUnit, setAltitudeUnit] = useState<AltitudeUnit>("m");
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>("K");
  const [pressureUnit, setPressureUnit] = useState<PressureUnit>("Pa");
  const [copied, setCopied] = useState(false);

  // Convert input to meters and calculate
  const result = useMemo<AtmosphericResult | null>(() => {
    const value = parseFloat(altitudeInput);
    if (isNaN(value)) return null;
    
    const altitudeM = convertAltitude(value, altitudeUnit, "m");
    if (altitudeM < 0 || altitudeM > 86000) return null;
    
    return calculateAtmosphere(altitudeM);
  }, [altitudeInput, altitudeUnit]);

  // Generate profile data for visualization
  const profileData = useMemo(() => {
    return generateProfile(0, 86000, 1000);
  }, []);

  const handleCopyResult = () => {
    if (!result) return;
    
    const text = `Altitude: ${result.altitude} m
Temperature: ${result.temperature.toFixed(4)} K (${result.temperatureCelsius.toFixed(2)} °C)
Pressure: ${result.pressure.toFixed(4)} Pa
Density: ${result.density.toExponential(6)} kg/m³
Speed of Sound: ${result.speedOfSound.toFixed(4)} m/s
Layer: ${result.layerName}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard" });
  };

  const handleExport = (format: "csv" | "json") => {
    if (!result) return;
    
    const data = format === "csv" 
      ? exportToCSV([result]) 
      : exportToJSON([result]);
    
    const blob = new Blob([data], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `isa-result-${result.altitude}m.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: `Downloaded ${format.toUpperCase()}` });
  };

  const handleExportProfile = (format: "csv" | "json") => {
    const data = format === "csv" 
      ? exportToCSV(profileData) 
      : exportToJSON(profileData);
    
    const blob = new Blob([data], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `isa-profile-0-86km.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: `Downloaded full profile ${format.toUpperCase()}` });
  };

  // Format temperature based on unit
  const displayTemp = (tempK: number) => {
    if (tempUnit === "C") return `${(tempK - 273.15).toFixed(2)} °C`;
    return `${tempK.toFixed(2)} K`;
  };

  // Format pressure based on unit
  const displayPressure = (pressurePa: number) => {
    switch (pressureUnit) {
      case "hPa": return `${(pressurePa / 100).toFixed(4)} hPa`;
      case "atm": return `${(pressurePa / 101325).toFixed(6)} atm`;
      default: return `${pressurePa.toFixed(4)} Pa`;
    }
  };

  // Get layer color class
  const getLayerClass = (layerName: string) => {
    if (layerName.includes("Tropo")) return "layer-troposphere";
    if (layerName.includes("Strato")) return "layer-stratosphere";
    return "layer-mesosphere";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">ISA Calculator</h1>
            <p className="text-muted-foreground">
              Compute atmospheric properties using the International Standard Atmosphere model (0–86 km)
            </p>
          </div>
          
          <div className="grid lg:grid-cols-[400px,1fr] gap-8">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Input</CardTitle>
                  <CardDescription>Enter altitude to calculate atmospheric properties</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Altitude input */}
                  <div className="space-y-2">
                    <Label htmlFor="altitude">Altitude</Label>
                    <div className="flex gap-2">
                      <Input
                        id="altitude"
                        type="number"
                        value={altitudeInput}
                        onChange={(e) => setAltitudeInput(e.target.value)}
                        placeholder="Enter altitude..."
                        className="font-mono"
                      />
                      <Select value={altitudeUnit} onValueChange={(v) => setAltitudeUnit(v as AltitudeUnit)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="m">m</SelectItem>
                          <SelectItem value="km">km</SelectItem>
                          <SelectItem value="ft">ft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Valid range: 0 – 86,000 m (282,000 ft)
                    </p>
                  </div>
                  
                  {/* Unit preferences */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label>Temperature</Label>
                      <Select value={tempUnit} onValueChange={(v) => setTempUnit(v as TemperatureUnit)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="K">Kelvin (K)</SelectItem>
                          <SelectItem value="C">Celsius (°C)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Pressure</Label>
                      <Select value={pressureUnit} onValueChange={(v) => setPressureUnit(v as PressureUnit)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pa">Pascal (Pa)</SelectItem>
                          <SelectItem value="hPa">hPa / mbar</SelectItem>
                          <SelectItem value="atm">atm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Layer Diagram */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Atmospheric Layers</CardTitle>
                </CardHeader>
                <CardContent>
                  <LayerDiagram currentAltitude={result?.altitude ?? null} />
                </CardContent>
              </Card>

              {/* Export Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Current result</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleExport("csv")}
                        disabled={!result}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        CSV
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleExport("json")}
                        disabled={!result}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        JSON
                      </Button>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Full profile (0–86 km, 1 km steps)</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleExportProfile("csv")}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        CSV
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleExportProfile("json")}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        JSON
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Primary results */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <ResultCard
                      icon={Thermometer}
                      label="Temperature"
                      value={displayTemp(result.temperature)}
                      subValue={tempUnit === "K" ? `${result.temperatureCelsius.toFixed(2)} °C` : `${result.temperature.toFixed(2)} K`}
                      color="chart-temperature"
                    />
                    <ResultCard
                      icon={Gauge}
                      label="Pressure"
                      value={displayPressure(result.pressure)}
                      subValue={pressureUnit !== "Pa" ? `${result.pressure.toFixed(2)} Pa` : undefined}
                      color="chart-pressure"
                    />
                    <ResultCard
                      icon={Wind}
                      label="Density"
                      value={`${result.density.toExponential(4)}`}
                      subValue="kg/m³"
                      color="chart-density"
                    />
                  </div>

                  {/* Layer indicator */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Layers className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Atmospheric Layer</p>
                            <p className="font-semibold">{result.layerName}</p>
                          </div>
                        </div>
                        <span className={`layer-badge ${getLayerClass(result.layerName)}`}>
                          {result.layerName}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Detailed results table */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Complete Results</CardTitle>
                        <CardDescription>All atmospheric properties at {formatNumber(result.altitude, 0)} m</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleCopyResult}>
                        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border overflow-hidden">
                        <table className="w-full">
                          <tbody className="divide-y">
                            <ResultRow 
                              label="Altitude" 
                              value={`${formatNumber(result.altitude, 2)} m`}
                              secondary={`${formatNumber(result.altitude / 1000, 3)} km • ${formatNumber(result.altitude / 0.3048, 1)} ft`}
                            />
                            <ResultRow 
                              label="Temperature (T)" 
                              value={`${formatNumber(result.temperature, 4)} K`}
                              secondary={`${formatNumber(result.temperatureCelsius, 2)} °C`}
                            />
                            <ResultRow 
                              label="Pressure (P)" 
                              value={`${formatNumber(result.pressure, 4)} Pa`}
                              secondary={`${formatNumber(result.pressure / 100, 4)} hPa`}
                            />
                            <ResultRow 
                              label="Density (ρ)" 
                              value={`${result.density.toExponential(6)} kg/m³`}
                            />
                            <ResultRow 
                              label="Speed of Sound (a)" 
                              value={`${formatNumber(result.speedOfSound, 4)} m/s`}
                              secondary={`Mach 1 at this altitude`}
                            />
                            <ResultRow 
                              label="Dynamic Viscosity (μ)" 
                              value={`${result.dynamicViscosity.toExponential(6)} Pa·s`}
                            />
                            <ResultRow 
                              label="Kinematic Viscosity (ν)" 
                              value={`${result.kinematicViscosity.toExponential(6)} m²/s`}
                            />
                            <ResultRow 
                              label="Layer" 
                              value={result.layerName}
                              secondary={`Base: ${result.layer.baseAltitude / 1000} km, Lapse: ${result.layer.lapseRate * 1000} K/km`}
                            />
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Formula reference */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Calculation Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">Model: ISA (ISO 2533:1975)</p>
                        <p className="text-muted-foreground">
                          International Standard Atmosphere as defined by ICAO. Valid from 0 to 86 km geopotential altitude.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="font-medium mb-1">Constants Used</p>
                          <ul className="text-muted-foreground space-y-1 font-mono text-xs">
                            <li>g₀ = {ISA_CONSTANTS.g0} m/s²</li>
                            <li>R = {ISA_CONSTANTS.R} J/(kg·K)</li>
                            <li>T₀ = {ISA_CONSTANTS.T0} K</li>
                            <li>P₀ = {ISA_CONSTANTS.P0} Pa</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Layer Parameters</p>
                          <ul className="text-muted-foreground space-y-1 font-mono text-xs">
                            <li>Tb = {result.layer.baseTemperature} K</li>
                            <li>Pb = {formatNumber(result.layer.basePressure, 2)} Pa</li>
                            <li>Hb = {result.layer.baseAltitude / 1000} km</li>
                            <li>L = {result.layer.lapseRate * 1000} K/km</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="py-20">
                  <CardContent className="text-center text-muted-foreground">
                    <Layers className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">Enter an altitude to calculate</p>
                    <p className="text-sm">
                      Valid range: 0 – 86,000 m
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Sub-components

function ResultCard({ 
  icon: Icon, 
  label, 
  value, 
  subValue,
  color 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string; 
  subValue?: string;
  color: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-mono font-semibold tracking-tight">{value}</p>
            {subValue && (
              <p className="text-sm text-muted-foreground mt-1">{subValue}</p>
            )}
          </div>
          <div className={`p-2 rounded-lg bg-${color}/10`}>
            <Icon className={`h-5 w-5 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResultRow({ label, value, secondary }: { label: string; value: string; secondary?: string }) {
  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3 text-sm text-muted-foreground">{label}</td>
      <td className="px-4 py-3 text-right">
        <span className="font-mono font-medium">{value}</span>
        {secondary && (
          <span className="block text-xs text-muted-foreground mt-0.5">{secondary}</span>
        )}
      </td>
    </tr>
  );
}

function LayerDiagram({ currentAltitude }: { currentAltitude: number | null }) {
  const layers = [
    { name: "Mesopause", altitude: 86000, color: "hsl(260, 50%, 50%)" },
    { name: "Mesosphere II", altitude: 71000, color: "hsl(280, 45%, 45%)" },
    { name: "Mesosphere I", altitude: 51000, color: "hsl(260, 50%, 50%)" },
    { name: "Stratopause", altitude: 47000, color: "hsl(200, 55%, 45%)" },
    { name: "Stratosphere II", altitude: 32000, color: "hsl(180, 55%, 42%)" },
    { name: "Stratosphere I", altitude: 20000, color: "hsl(180, 60%, 45%)" },
    { name: "Tropopause", altitude: 11000, color: "hsl(195, 70%, 50%)" },
    { name: "Troposphere", altitude: 0, color: "hsl(200, 80%, 55%)" },
  ].reverse();

  return (
    <div className="relative">
      <div className="flex flex-col-reverse gap-1">
        {layers.map((layer, index) => {
          const nextAlt = index < layers.length - 1 ? layers[index + 1].altitude : 86000;
          const heightRatio = (nextAlt - layer.altitude) / 86000;
          const isActive = currentAltitude !== null && 
            currentAltitude >= layer.altitude && 
            currentAltitude < nextAlt;
          
          return (
            <div
              key={layer.name}
              className={`relative rounded px-3 py-2 text-xs transition-all ${
                isActive ? "ring-2 ring-accent ring-offset-2" : ""
              }`}
              style={{ 
                minHeight: Math.max(28, heightRatio * 200),
                backgroundColor: `${layer.color}20`,
                borderLeft: `3px solid ${layer.color}`,
              }}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium truncate" style={{ color: layer.color }}>
                  {layer.name}
                </span>
                <span className="text-muted-foreground ml-2">
                  {layer.altitude / 1000} km
                </span>
              </div>
              {isActive && currentAltitude !== null && (
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-accent"
                  style={{ 
                    bottom: `${((currentAltitude - layer.altitude) / (nextAlt - layer.altitude)) * 100}%` 
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      {currentAltitude !== null && (
        <div className="mt-3 text-center text-xs text-muted-foreground">
          Current: {(currentAltitude / 1000).toFixed(1)} km
        </div>
      )}
    </div>
  );
}
