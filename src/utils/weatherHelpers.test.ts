import { describe, it, expect } from 'vitest';
import {
  getWeatherCondition,
  formatDayOfWeek,
  formatLongDate,
  formatHour,
} from './weatherHelpers';

describe('getWeatherCondition', () => {
  it.each([
    [0, 'Clear Sky'],
    [2, 'Partly Cloudy'],
    [3, 'Overcast'],
    [48, 'Fog'],
    [57, 'Drizzle'],
    [82, 'Rain'],
    [86, 'Snow'],
    [99, 'Thunderstorm'],
  ])('maps WMO code %i to "%s"', (code, label) => {
    expect(getWeatherCondition(code).label).toBe(label);
  });

  it('recognizes every documented WMO code', () => {
    const documented = [
      0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67,
      71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99,
    ];
    for (const code of documented) {
      expect(getWeatherCondition(code).label).not.toBe('Unknown');
    }
  });

  it('falls back to "Unknown" for unrecognized codes', () => {
    expect(getWeatherCondition(1234).label).toBe('Unknown');
    expect(getWeatherCondition(-1).label).toBe('Unknown');
  });

  it('always returns a .webp icon under /assets/images/', () => {
    for (const code of [0, 3, 45, 51, 61, 71, 95, 9999]) {
      expect(getWeatherCondition(code).icon).toMatch(
        /^\/assets\/images\/icon-[\w-]+\.webp$/,
      );
    }
  });
});

describe('formatDayOfWeek', () => {
  it('formats a date-only string', () => {
    expect(formatDayOfWeek('2026-08-09')).toBe('Sun');
  });

  it('formats a datetime string using only the date part', () => {
    expect(formatDayOfWeek('2026-08-09T23:00')).toBe('Sun');
  });

  it('returns an empty string for invalid input', () => {
    expect(formatDayOfWeek('')).toBe('');
    expect(formatDayOfWeek('not-a-date')).toBe('');
    expect(formatDayOfWeek('2026-13-45')).toBe('');
  });
});

describe('formatLongDate', () => {
  it('formats a date-only string', () => {
    expect(formatLongDate('2026-08-05')).toBe('Wednesday, August 5, 2026');
  });

  it('formats a datetime string using only the date part', () => {
    expect(formatLongDate('2026-08-05T14:00')).toBe('Wednesday, August 5, 2026');
  });

  it('returns an empty string for empty input', () => {
    expect(formatLongDate('')).toBe('');
  });

  it('returns the original string when it cannot be parsed', () => {
    expect(formatLongDate('not-a-date')).toBe('not-a-date');
    expect(formatLongDate('2026-13-45')).toBe('2026-13-45');
  });
});

describe('formatHour', () => {
  it('extracts the time from an ISO datetime', () => {
    expect(formatHour('2026-08-09T14:00')).toBe('14:00');
  });

  it('returns an empty string when there is no time part', () => {
    expect(formatHour('2026-08-09')).toBe('');
  });
});