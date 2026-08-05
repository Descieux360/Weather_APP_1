export type UnitSystem = 'metric' | 'imperial';

export interface UnitPreferences {
  system: UnitSystem;
  temperature: 'celsius' | 'fahrenheit';
  windSpeed: 'kmh' | 'mph';
  precipitation: 'mm' | 'inch';
}