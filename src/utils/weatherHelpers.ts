/**
 * Maps WMO Weather Interpretation Codes (WMO 4677) to dynamic weather icons and descriptions.
 */

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
      return { label: 'Thunderstorm', icon: '/src/assets/images/icon-storm.webp' };
    default:
      return { label: 'Unknown', icon: '/src/assets/images/icon-sunny.webp' };
  }
};

/**
 * Formats an ISO Date string (e.g. "2026-08-09") into a human-readable day of the week (e.g., "Mon").
 */
export const formatDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Formats an ISO Date/DateTime string into a long date display (e.g., "Tuesday, August 5, 2025").
 */
/**
 * Formats an ISO Date/DateTime string into a full date display (e.g., "Tuesday, August 5, 2026").
 */
export const formatLongDate = (dateString: string): string => {
  if (!dateString) return '';

  // If datetime string has "T", parse only the date portion to avoid local timezone offset issues
  const dateOnlyString = dateString.includes('T') ? dateString.split('T')[0] : dateString;

  // Parse elements directly to avoid browser-specific timezone offset shifts
  const [year, month, day] = dateOnlyString.split('-').map(Number);
  if (!year || !month || !day) return dateString;

  // Construct local date with exact YYYY, MM (0-indexed), DD
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('en-US', {
    weekday: 'long',  // "Tuesday"
    month: 'long',    // "August"
    day: 'numeric',   // "5"
    year: 'numeric',  // "2026"
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
