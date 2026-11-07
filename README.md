# Skyward Weather Dashboard

A responsive weather dashboard built with React 19, TypeScript, Vite and Tailwind CSS v4. Search any city, switch units, and browse a 7-day forecast with an hour-by-hour breakdown for each day.

**[Live demo](https://weather-app-1-mu-silk.vercel.app)**

![Skyward Weather Dashboard](docs/screenshot.png)

## Features

- **City search with autocomplete.** Suggestions come from the Open-Meteo Geocoding API once the query is longer than 2 characters. Pressing Enter selects the top result.
- **Current conditions.** Temperature, feels-like, humidity, wind speed and precipitation.
- **7-day forecast.** Daily highs, lows and weather condition.
- **Hourly forecast.** Hour-by-hour temperatures for any of the next 7 days, chosen from a day selector.
- **Flexible units.** Switch between metric and imperial, or mix them (for example °F with km/h and mm). The active system is derived automatically and shown as metric, imperial or custom.
- **Responsive layout.** On small screens the units dropdown becomes a full-screen dialog.
- **Keyboard focus styles.** Interactive elements use `:focus-visible` outlines.

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19 (function components, custom hooks, Context) |
| Language | TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 (`@theme` design tokens) |
| Data | Open-Meteo Forecast and Geocoding APIs (no API key needed) |
| Testing | Vitest, React Testing Library |
| Hosting | Vercel |

## Architecture

State lives in one provider, `WeatherContext`, and components read from it through the `useWeather` hook.

```
 Search / city selection ──┐
                           ▼
 Units dropdown ───►  WeatherContext  ──► fetchWeatherData ──► Open-Meteo Forecast API
                           │
              ┌────────────┼─────────────┐
              ▼            ▼             ▼
   CurrentWeatherCard  DailyForecast  HourlyForecast
```

**Data fetching.** One `useEffect` in `WeatherContext.tsx` re-fetches whenever the selected coordinates, the unit preferences, or a manual refresh change. Units are passed to the Forecast API, so conversion happens server-side.

**Stale responses.** Effects can't cancel async work on their own, so each run of the effect has a `cancelled` flag that its cleanup sets. If a user picks a second city before the first request returns, the late response is ignored and can't overwrite newer data or flip the loading state.

**Unit preferences.** Temperature, wind and precipitation units are stored separately. A pure helper, `withSystem`, derives whether the combination is metric, imperial or custom. Selecting a unit that is already active returns the same state object, so it doesn't trigger a refetch.

**Hourly data.** The API returns all 168 hourly values for the week in one flat array. `HourlyForecast` uses `useMemo` to slice out the 24-hour window for the selected day.

**Weather codes.** Open-Meteo uses WMO weather interpretation codes. `getWeatherCondition(code)` in `weatherHelpers.ts` maps each code to a label and an icon, with an `Unknown` fallback.

**Dates.** The date helpers parse `YYYY-MM-DD` strings into local dates by hand instead of using `new Date("YYYY-MM-DD")`, which is parsed as UTC and can show the wrong weekday in timezones behind UTC. Invalid or out-of-range dates return an empty string, or the original input for `formatLongDate`.

## Project structure

```
Weather_APP_1/
├── public/                      # Static assets (weather icons, fonts)
├── src/
│   ├── components/
│   │   ├── common/              # Shared UI components
│   │   ├── layout/Header.tsx    # Brand bar and units control
│   │   └── Weather/
│   │       ├── CurrentWeatherCard.tsx
│   │       ├── DailyForecast.tsx
│   │       ├── HourlyForecast.tsx
│   │       └── SearchBar.tsx
│   ├── context/
│   │   └── WeatherContext.tsx   # Provider, fetch effect, unit actions
│   ├── hooks/
│   │   └── useMediaQuery.ts
│   ├── services/
│   │   └── weatherApi.ts        # Forecast and geocoding requests
│   ├── types/
│   │   ├── GeocodingResult.ts   # API response types
│   │   └── units.ts             # Unit systems and presets
│   └── utils/
│       └── weatherHelpers.ts    # WMO mapping, date and hour formatting
├── index.html
├── package.json
└── vite.config.ts
```

## Getting started

**Requirements:** Node.js 18 or later.

```bash
git clone https://github.com/Descieux360/Weather_APP_1.git
cd Weather_APP_1
npm install
npm run dev
```

Then open <http://localhost:5173>.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the test suite once |
| `npm run test:tz` | Run the tests under `America/Los_Angeles` to catch timezone bugs |

## Testing

Tests use Vitest and React Testing Library.

- **`weatherHelpers.test.ts`** covers the WMO mapping (every documented code plus the unknown fallback), date formatting, and invalid input.
- **`WeatherContext.test.tsx`** covers the provider. One test checks that a stale response can't overwrite a newer one. Another checks that choosing the unit that's already active doesn't refetch.

The date tests also run under a different timezone (`npm run test:tz`), which is how the UTC date-parsing bug in `formatDayOfWeek` was found and fixed.

## Roadmap

- Abort in-flight network requests with `AbortController`, not just ignore their results
- Debounce the search input
- Keyboard navigation and combobox ARIA roles for the suggestions list
- Remember the last city and unit choice between visits
- Component-level tests for the search bar and forecast components

## Data source

Weather and location data come from [Open-Meteo](https://open-meteo.com/).