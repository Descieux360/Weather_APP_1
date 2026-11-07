import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { WeatherProvider, useWeather } from './WeatherContext';
import { fetchWeatherData } from '../services/weatherApi';
import type { OpenMeteoForecastResponse } from '../types/GeocodingResult';

vi.mock('../services/weatherApi');

const wrapper = ({ children }: { children: ReactNode }) => (
  <WeatherProvider>{children}</WeatherProvider>
);

const fake = (marker: string) =>
  ({ marker }) as unknown as OpenMeteoForecastResponse;

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
};

describe('WeatherProvider', () => {
  it('ignores a stale response that resolves after a newer one', async () => {
    const first = deferred<OpenMeteoForecastResponse>();
    const second = deferred<OpenMeteoForecastResponse>();
    vi.mocked(fetchWeatherData)
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    const { result } = renderHook(() => useWeather(), { wrapper });

    act(() =>
      result.current.setSelectedCity({
        id: 2, name: 'Paris', country: 'France', latitude: 48.85, longitude: 2.35,
      }),
    );

    // Newer request resolves first, then the older one resolves late.
    await act(async () => second.resolve(fake('paris')));
    await act(async () => first.resolve(fake('yaounde')));

    expect(result.current.weatherData).toEqual(fake('paris'));
    expect(result.current.isLoading).toBe(false);
  });

  it('does not refetch when selecting a unit that is already active', async () => {
    vi.mocked(fetchWeatherData).mockResolvedValue(fake('any'));
    const { result } = renderHook(() => useWeather(), { wrapper });
    await act(async () => {});

    vi.mocked(fetchWeatherData).mockClear();
    await act(async () => result.current.setTemperatureUnit('celsius'));

    expect(fetchWeatherData).not.toHaveBeenCalled();
  });
});