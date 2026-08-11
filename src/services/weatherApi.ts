import type { GeocodingResult, OpenMeteoForecastResponse } from '../types/GeocodingResult';
import type { UnitPreferences } from '../types/units';

export interface CityResult {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export const searchLocation = async (query: string): Promise<GeocodingResult[]> => {
  if (!query.trim()) return [];

  // 1. Construct URL
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;

  // 2. Fetch data
  const response = await fetch(url);
  const data = await response.json();

  // 3. Return search results array
  return data.results || [];
};

export const fetchWeatherData = async (
  lat: number,
  lon: number,
  units: UnitPreferences
): Promise<OpenMeteoForecastResponse> => {
  // Map unit preferences to API query parameters
  const tempUnit = units.temperature; // 'celsius' or 'fahrenheit'
  const windUnit = units.windSpeed;    // 'kmh' or 'mph'
  const precipUnit = units.precipitation; // 'mm' or 'inch'

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch weather data');

  const data = await response.json();
  return data;
};
