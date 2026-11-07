import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchWeatherData } from '../services/weatherApi';
import type { OpenMeteoForecastResponse, GeocodingResult } from '../types/GeocodingResult';
import {
  METRIC_PREFERENCES,
  IMPERIAL_PREFERENCES,
  UNIT_SYSTEMS,
  type UnitPreferences,
} from '../types/units';

interface WeatherContextType {
  selectedCity: GeocodingResult | null;
  weatherData: OpenMeteoForecastResponse | null;
  isLoading: boolean;
  error: string | null;
  unitPreferences: UnitPreferences;
  isMetric: boolean;

  setSelectedCity: (city: GeocodingResult | null) => void;
  toggleUnitSystem: () => void;
  setTemperatureUnit: (unit: 'celsius' | 'fahrenheit') => void;
  setWindUnit: (unit: 'kmh' | 'mph') => void;
  setPrecipitationUnit: (unit: 'mm' | 'inch') => void;
  refreshWeather: () => void;
}

const DEFAULT_CITY: GeocodingResult = {
  id: 1,
  name: 'Yaoundé',
  country: 'Cameroon',
  latitude: 3.848,
  longitude: 11.5021,
};

/** Derives `system` from the individual unit choices. Pure, so it lives outside the component. */
const withSystem = (prefs: UnitPreferences): UnitPreferences => {
  const isAllMetric =
    prefs.temperature === 'celsius' &&
    prefs.windSpeed === 'kmh' &&
    prefs.precipitation === 'mm';
  const isAllImperial =
    prefs.temperature === 'fahrenheit' &&
    prefs.windSpeed === 'mph' &&
    prefs.precipitation === 'inch';

  if (isAllMetric) return { ...prefs, system: UNIT_SYSTEMS.METRIC };
  if (isAllImperial) return { ...prefs, system: UNIT_SYSTEMS.IMPERIAL };
  return { ...prefs, system: UNIT_SYSTEMS.CUSTOM };
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCity, setSelectedCity] = useState<GeocodingResult | null>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<OpenMeteoForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unitPreferences, setUnitPreferences] = useState<UnitPreferences>(METRIC_PREFERENCES);
  const [refreshKey, setRefreshKey] = useState(0);

  const latitude = selectedCity?.latitude;
  const longitude = selectedCity?.longitude;

  // Fetch whenever the location, the units, or a manual refresh changes.
  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return;

    // Set by the cleanup below, so a response for an outdated request is ignored.
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    fetchWeatherData(latitude, longitude, unitPreferences)
      .then((data) => {
        if (!cancelled) setWeatherData(data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to fetch weather data:', err);
        setError('Failed to load weather data. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, unitPreferences, refreshKey]);

  const refreshWeather = useCallback(() => setRefreshKey((k) => k + 1), []);

  const toggleUnitSystem = useCallback(() => {
    setUnitPreferences((prev) =>
      prev.system === UNIT_SYSTEMS.METRIC ? IMPERIAL_PREFERENCES : METRIC_PREFERENCES,
    );
  }, []);

  // Returns `prev` unchanged when nothing changed, so the effect doesn't refetch.
  const updateUnits = useCallback((patch: Partial<UnitPreferences>) => {
    setUnitPreferences((prev) => {
      const next = { ...prev, ...patch };
      const unchanged =
        next.temperature === prev.temperature &&
        next.windSpeed === prev.windSpeed &&
        next.precipitation === prev.precipitation;
      return unchanged ? prev : withSystem(next);
    });
  }, []);

  const setTemperatureUnit = useCallback(
    (unit: 'celsius' | 'fahrenheit') => updateUnits({ temperature: unit }),
    [updateUnits],
  );
  const setWindUnit = useCallback(
    (unit: 'kmh' | 'mph') => updateUnits({ windSpeed: unit }),
    [updateUnits],
  );
  const setPrecipitationUnit = useCallback(
    (unit: 'mm' | 'inch') => updateUnits({ precipitation: unit }),
    [updateUnits],
  );

  const isMetric = unitPreferences.system === UNIT_SYSTEMS.METRIC;

  const value = useMemo<WeatherContextType>(
    () => ({
      selectedCity,
      weatherData,
      isLoading,
      error,
      unitPreferences,
      isMetric,
      setSelectedCity,
      toggleUnitSystem,
      setTemperatureUnit,
      setWindUnit,
      setPrecipitationUnit,
      refreshWeather,
    }),
    [
      selectedCity, weatherData, isLoading, error, unitPreferences, isMetric,
      toggleUnitSystem, setTemperatureUnit, setWindUnit, setPrecipitationUnit, refreshWeather,
    ],
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};