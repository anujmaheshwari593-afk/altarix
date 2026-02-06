/**
 * International Standard Atmosphere (ISA) Calculations
 * Based on ISO 2533:1975 and ICAO Standard Atmosphere
 * Valid for 0-86 km altitude range
 */

// Physical constants
export const ISA_CONSTANTS = {
  g0: 9.80665, // m/s² - Standard gravity
  R: 287.05287, // J/(kg·K) - Specific gas constant for dry air
  M: 0.0289644, // kg/mol - Molar mass of dry air
  Rstar: 8.31432, // J/(mol·K) - Universal gas constant
  gamma: 1.4, // Ratio of specific heats (Cp/Cv)
  T0: 288.15, // K - Sea level temperature
  P0: 101325, // Pa - Sea level pressure
  rho0: 1.225, // kg/m³ - Sea level density
};

// Atmospheric layer definitions
export interface AtmosphericLayer {
  name: string;
  baseAltitude: number; // m
  baseTemperature: number; // K
  lapseRate: number; // K/m (negative = temperature decreases with altitude)
  basePressure: number; // Pa
}

export const LAYERS: AtmosphericLayer[] = [
  { name: "Troposphere", baseAltitude: 0, baseTemperature: 288.15, lapseRate: -0.0065, basePressure: 101325 },
  { name: "Tropopause", baseAltitude: 11000, baseTemperature: 216.65, lapseRate: 0, basePressure: 22632.1 },
  { name: "Stratosphere I", baseAltitude: 20000, baseTemperature: 216.65, lapseRate: 0.001, basePressure: 5474.89 },
  { name: "Stratosphere II", baseAltitude: 32000, baseTemperature: 228.65, lapseRate: 0.0028, basePressure: 868.019 },
  { name: "Stratopause", baseAltitude: 47000, baseTemperature: 270.65, lapseRate: 0, basePressure: 110.906 },
  { name: "Mesosphere I", baseAltitude: 51000, baseTemperature: 270.65, lapseRate: -0.0028, basePressure: 66.9389 },
  { name: "Mesosphere II", baseAltitude: 71000, baseTemperature: 214.65, lapseRate: -0.002, basePressure: 3.95642 },
  { name: "Mesopause", baseAltitude: 86000, baseTemperature: 186.87, lapseRate: 0, basePressure: 0.3734 },
];

export interface AtmosphericResult {
  altitude: number; // m
  temperature: number; // K
  temperatureCelsius: number; // °C
  pressure: number; // Pa
  density: number; // kg/m³
  speedOfSound: number; // m/s
  dynamicViscosity: number; // Pa·s
  kinematicViscosity: number; // m²/s
  layer: AtmosphericLayer;
  layerName: string;
}

/**
 * Get the atmospheric layer for a given altitude
 */
export function getLayer(altitudeM: number): AtmosphericLayer {
  for (let i = LAYERS.length - 1; i >= 0; i--) {
    if (altitudeM >= LAYERS[i].baseAltitude) {
      return LAYERS[i];
    }
  }
  return LAYERS[0];
}

/**
 * Calculate ISA temperature at a given altitude
 */
export function calculateTemperature(altitudeM: number): number {
  const layer = getLayer(altitudeM);
  const deltaH = altitudeM - layer.baseAltitude;
  return layer.baseTemperature + layer.lapseRate * deltaH;
}

/**
 * Calculate ISA pressure at a given altitude
 */
export function calculatePressure(altitudeM: number): number {
  const layer = getLayer(altitudeM);
  const { g0, R } = ISA_CONSTANTS;
  const deltaH = altitudeM - layer.baseAltitude;
  const T = calculateTemperature(altitudeM);

  if (layer.lapseRate === 0) {
    // Isothermal layer: P = Pb * exp(-g0 * deltaH / (R * T))
    return layer.basePressure * Math.exp((-g0 * deltaH) / (R * T));
  } else {
    // Gradient layer: P = Pb * (T / Tb)^(-g0 / (L * R))
    const exponent = -g0 / (layer.lapseRate * R);
    return layer.basePressure * Math.pow(T / layer.baseTemperature, exponent);
  }
}

/**
 * Calculate ISA density using ideal gas law
 */
export function calculateDensity(pressure: number, temperature: number): number {
  const { R } = ISA_CONSTANTS;
  return pressure / (R * temperature);
}

/**
 * Calculate speed of sound
 */
export function calculateSpeedOfSound(temperature: number): number {
  const { gamma, R } = ISA_CONSTANTS;
  return Math.sqrt(gamma * R * temperature);
}

/**
 * Calculate dynamic viscosity using Sutherland's formula
 */
export function calculateDynamicViscosity(temperature: number): number {
  const mu0 = 1.7894e-5; // Reference viscosity at T0 (Pa·s)
  const T0 = 288.15; // Reference temperature (K)
  const S = 110.4; // Sutherland's constant for air (K)
  return mu0 * Math.pow(temperature / T0, 1.5) * ((T0 + S) / (temperature + S));
}

/**
 * Main calculation function - returns all atmospheric properties
 */
export function calculateAtmosphere(altitudeM: number): AtmosphericResult {
  // Clamp altitude to valid range
  const clampedAlt = Math.max(0, Math.min(86000, altitudeM));
  
  const layer = getLayer(clampedAlt);
  const temperature = calculateTemperature(clampedAlt);
  const pressure = calculatePressure(clampedAlt);
  const density = calculateDensity(pressure, temperature);
  const speedOfSound = calculateSpeedOfSound(temperature);
  const dynamicViscosity = calculateDynamicViscosity(temperature);
  const kinematicViscosity = dynamicViscosity / density;

  return {
    altitude: clampedAlt,
    temperature,
    temperatureCelsius: temperature - 273.15,
    pressure,
    density,
    speedOfSound,
    dynamicViscosity,
    kinematicViscosity,
    layer,
    layerName: layer.name,
  };
}

/**
 * Generate atmospheric profile for a range of altitudes
 */
export function generateProfile(
  startAltM: number,
  endAltM: number,
  stepM: number
): AtmosphericResult[] {
  const results: AtmosphericResult[] = [];
  for (let alt = startAltM; alt <= endAltM; alt += stepM) {
    results.push(calculateAtmosphere(alt));
  }
  return results;
}

// Unit conversion utilities
export const UNITS = {
  altitude: {
    m: { factor: 1, symbol: "m", name: "meters" },
    km: { factor: 1000, symbol: "km", name: "kilometers" },
    ft: { factor: 0.3048, symbol: "ft", name: "feet" },
  },
  temperature: {
    K: { offset: 0, symbol: "K", name: "Kelvin" },
    C: { offset: -273.15, symbol: "°C", name: "Celsius" },
    F: { offset: -459.67, factor: 1.8, symbol: "°F", name: "Fahrenheit" },
  },
  pressure: {
    Pa: { factor: 1, symbol: "Pa", name: "Pascal" },
    hPa: { factor: 100, symbol: "hPa", name: "hectopascal" },
    mbar: { factor: 100, symbol: "mbar", name: "millibar" },
    atm: { factor: 101325, symbol: "atm", name: "atmosphere" },
    psi: { factor: 6894.76, symbol: "psi", name: "pounds per square inch" },
  },
  density: {
    kgm3: { factor: 1, symbol: "kg/m³", name: "kilograms per cubic meter" },
    gm3: { factor: 0.001, symbol: "g/m³", name: "grams per cubic meter" },
  },
  velocity: {
    ms: { factor: 1, symbol: "m/s", name: "meters per second" },
    kmh: { factor: 0.277778, symbol: "km/h", name: "kilometers per hour" },
    mph: { factor: 0.44704, symbol: "mph", name: "miles per hour" },
    kts: { factor: 0.514444, symbol: "kts", name: "knots" },
  },
};

export function convertAltitude(value: number, from: keyof typeof UNITS.altitude, to: keyof typeof UNITS.altitude): number {
  const meters = value * UNITS.altitude[from].factor;
  return meters / UNITS.altitude[to].factor;
}

export function convertPressure(value: number, from: keyof typeof UNITS.pressure, to: keyof typeof UNITS.pressure): number {
  const pascals = value * UNITS.pressure[from].factor;
  return pascals / UNITS.pressure[to].factor;
}

export function formatNumber(value: number, decimals: number = 4): string {
  if (Math.abs(value) < 0.001 || Math.abs(value) >= 1e6) {
    return value.toExponential(decimals);
  }
  return value.toFixed(decimals);
}

/**
 * Export results to CSV format
 */
export function exportToCSV(results: AtmosphericResult[]): string {
  const headers = [
    "Altitude (m)",
    "Temperature (K)",
    "Temperature (°C)",
    "Pressure (Pa)",
    "Density (kg/m³)",
    "Speed of Sound (m/s)",
    "Dynamic Viscosity (Pa·s)",
    "Kinematic Viscosity (m²/s)",
    "Layer",
  ];
  
  const rows = results.map((r) => [
    r.altitude,
    r.temperature.toFixed(4),
    r.temperatureCelsius.toFixed(4),
    r.pressure.toFixed(4),
    r.density.toExponential(6),
    r.speedOfSound.toFixed(4),
    r.dynamicViscosity.toExponential(6),
    r.kinematicViscosity.toExponential(6),
    r.layerName,
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

/**
 * Export results to JSON format
 */
export function exportToJSON(results: AtmosphericResult[]): string {
  const exportData = {
    metadata: {
      model: "ISA (ISO 2533:1975)",
      generatedAt: new Date().toISOString(),
      constants: ISA_CONSTANTS,
    },
    data: results.map((r) => ({
      altitude_m: r.altitude,
      temperature_K: r.temperature,
      temperature_C: r.temperatureCelsius,
      pressure_Pa: r.pressure,
      density_kgm3: r.density,
      speed_of_sound_ms: r.speedOfSound,
      dynamic_viscosity_Pas: r.dynamicViscosity,
      kinematic_viscosity_m2s: r.kinematicViscosity,
      layer: r.layerName,
    })),
  };
  return JSON.stringify(exportData, null, 2);
}
