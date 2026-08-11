export const UNIT_SYSTEMS = {
  METRIC: 'metric',
  IMPERIAL: 'imperial',
} as const;

export type UnitSystem = (typeof UNIT_SYSTEMS)[keyof typeof UNIT_SYSTEMS];

export interface UnitPreferences {
  system: UnitSystem;
  temperature: 'celsius' | 'fahrenheit';
  windSpeed: 'kmh' | 'mph';
  precipitation: 'mm' | 'inch';
}

export const METRIC_PREFERENCES: UnitPreferences = {
  system: UNIT_SYSTEMS.METRIC,
  temperature: 'celsius',
  windSpeed: 'kmh',
  precipitation: 'mm',
};

export const IMPERIAL_PREFERENCES: UnitPreferences = {
  system: UNIT_SYSTEMS.IMPERIAL,
  temperature: 'fahrenheit',
  windSpeed: 'mph',
  precipitation: 'inch',
};