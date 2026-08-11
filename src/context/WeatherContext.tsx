import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { fetchWeatherData } from '../services/weatherApi';
import type { OpenMeteoForecastResponse, GeocodingResult } from '../types/GeocodingResult'; // Import here!
import {
  METRIC_PREFERENCES,
  IMPERIAL_PREFERENCES,
  UNIT_SYSTEMS,
  type UnitPreferences,
} from '../types/units';

interface WeatherContextType {
  selectedCity: GeocodingResult | null;
  weatherData: OpenMeteoForecastResponse | null; // Use imported type
  isLoading: boolean;
  error: string | null;
  unitPreferences: UnitPreferences;
  isMetric: boolean;

  setSelectedCity: (city: GeocodingResult | null) => void;
  setWeatherData: (data: OpenMeteoForecastResponse | null) => void;
  setIsLoading: (loading: boolean) => void;
  toggleUnitSystem: () => void;
  setTemperatureUnit: (unit: 'celsius' | 'fahrenheit') => void;
  setWindUnit: (unit: 'kmh' | 'mph') => void;
  setPrecipitationUnit: (unit: 'mm' | 'inch') => void;
  refreshWeather: () => Promise<void>;
}

const DEFAULT_CITY: GeocodingResult = {
  id: 1,
  name: 'Yaoundé',
  country: 'Cameroon',
  latitude: 3.848,
  longitude: 11.5021,
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCity, setSelectedCity] = useState<GeocodingResult | null>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<OpenMeteoForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unitPreferences, setUnitPreferences] = useState<UnitPreferences>(METRIC_PREFERENCES);

  const isMetric = unitPreferences.system === UNIT_SYSTEMS.METRIC;

  // Core weather loading function
  const loadWeatherData = async (
    city: GeocodingResult | null,
    units: UnitPreferences
  ) => {
    if (!city) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(city.latitude, city.longitude, units);
      setWeatherData(data);
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
      setError('Failed to load weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch weather whenever active location or unit preferences change
  useEffect(() => {
    loadWeatherData(selectedCity, unitPreferences);
  }, [selectedCity?.latitude, selectedCity?.longitude, unitPreferences]);

  // Action: Refresh weather manually
  const refreshWeather = async () => {
    await loadWeatherData(selectedCity, unitPreferences);
  };

  // Action: Toggle overall system (Metric <-> Imperial)
  const toggleUnitSystem = () => {
    setUnitPreferences((prev) =>
      prev.system === UNIT_SYSTEMS.METRIC ? IMPERIAL_PREFERENCES : METRIC_PREFERENCES
    );
  };

  // Action: Set temperature unit specifically
  const setTemperatureUnit = (unit: 'celsius' | 'fahrenheit') => {
    setUnitPreferences((prev) => {
      const updated = { ...prev, temperature: unit };
      return checkSystemAlignment(updated);
    });
  };

  // Action: Set wind speed unit specifically
  const setWindUnit = (unit: 'kmh' | 'mph') => {
    setUnitPreferences((prev) => {
      const updated = { ...prev, windSpeed: unit };
      return checkSystemAlignment(updated);
    });
  };

  // Action: Set precipitation unit specifically
  const setPrecipitationUnit = (unit: 'mm' | 'inch') => {
    setUnitPreferences((prev) => {
      const updated = { ...prev, precipitation: unit };
      return checkSystemAlignment(updated);
    });
  };

  // Helper to determine if custom unit combination aligns with metric or imperial default
  const checkSystemAlignment = (prefs: UnitPreferences): UnitPreferences => {
    const isAllMetric =
      prefs.temperature === 'celsius' &&
      prefs.windSpeed === 'kmh' &&
      prefs.precipitation === 'mm';

    const isAllImperial =
      prefs.temperature === 'fahrenheit' &&
      prefs.windSpeed === 'mph' &&
      prefs.precipitation === 'inch';

    if (isAllMetric) return { ...prefs, system: 'metric' };
    if (isAllImperial) return { ...prefs, system: 'imperial' };
    return { ...prefs, system: 'custom' as any };
  };

  return (
    <WeatherContext.Provider
      value={{
        selectedCity,
        weatherData,
        isLoading,
        error,
        unitPreferences,
        isMetric,
        setSelectedCity,
        setWeatherData,
        setIsLoading,
        toggleUnitSystem,
        setTemperatureUnit,
        setWindUnit,
        setPrecipitationUnit,
        refreshWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};