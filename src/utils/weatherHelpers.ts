
export interface WeatherCondition {
  label: string;
  icon: string;
}

export const getWeatherCondition = (code: number): WeatherCondition => {
  // WMO weather codes mapped to icons and human-readable names
  switch (code) {
    case 0:
      return { label: 'Clear Sky', icon: '/assets/images/icon-sunny.webp' };
    case 1:
    case 2:
      return { label: 'Partly Cloudy', icon: '/assets/images/icon-partly-cloudy.webp' };
    case 3:
      return { label: 'Overcast', icon: '/assets/images/icon-overcast.webp' };
    case 45:
    case 48:
      return { label: 'Fog', icon: '/assets/images/icon-fog.webp' };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { label: 'Drizzle', icon: '/assets/images/icon-drizzle.webp' };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return { label: 'Rain', icon: '/assets/images/icon-rain.webp' };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return { label: 'Snow', icon: '/assets/images/icon-snow.webp' };
    case 95:
    case 96:
    case 99:
      return { label: 'Thunderstorm', icon: '/assets/images/icon-storm.webp' };
    default:
      return { label: 'Unknown', icon: '/assets/images/icon-sunny.webp' };
  }
};

/**
 * Parses "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm" into a local-time Date.
 * Avoids `new Date("YYYY-MM-DD")`, which is parsed as UTC and shifts the day
 * in timezones behind UTC. Returns null for malformed or out-of-range dates.
 */
const parseLocalDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  // Reject rollovers such as 2026-13-45
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
};

/**
 * Formats an ISO date (e.g. "2026-08-09") as a short weekday (e.g. "Sun").
 * Returns '' for invalid input.
 */
export const formatDayOfWeek = (dateString: string): string => {
  const date = parseLocalDate(dateString);
  return date ? date.toLocaleDateString('en-US', { weekday: 'short' }) : '';
};

/**
 * Formats an ISO date/datetime (e.g. "2026-08-05") as "Wednesday, August 5, 2026".
 * Returns '' for empty input and the original string if it can't be parsed.
 */
export const formatLongDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = parseLocalDate(dateString);
  if (!date) return dateString;

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Extracts the 24-hour timestamp (e.g. "14:00") from an ISO DateTime string.
 */
export const formatHour = (dateTimeString: string): string => {
  // Format "2026-08-09T14:00" -> "14:00"
  const parts = dateTimeString.split('T');
  if (parts.length < 2) return '';
  return parts[1]; // Returns "14:00"
};
