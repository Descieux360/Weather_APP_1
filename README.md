# Skyward Weather Dashboard 🌤️

Skyward is a responsive, highly polished, and fully typed modern Weather Dashboard built with React 19, TypeScript, Vite, and Tailwind CSS v4. It allows users to search for cities globally in real time, customize their telemetry units down to specific preferences, and view beautiful, detailed 7-day daily forecasts as well as 24-hour hourly projections for any selected day.

---

## 🚀 Key Features

* **Real-Time Geocoding Autocomplete:** Integrated with the Open-Meteo Geocoding API to suggest worldwide locations on-the-fly.
* **In-Depth Telemetry Insights:** Track feels-like temperature, relative humidity, wind speed, and precipitation levels in a clean grid.
* **Interactive 7-Day Forecast:** Quick-look overview detailing daily highs, lows, and weather condition trends.
* **Day-by-Day 24-Hour Hourly Resolver:** A scrollable sidebar displaying temperature progressions hour-by-hour. Users can choose to view hourly data for any of the next 7 days via a nested day selector.
* **Granular Unit Preferences:** Toggle between metric and imperial presets, or construct custom combinations of temperature (`°C`/`°F`), wind speed (`km/h`/`mph`), and precipitation (`mm`/`inch`).
* **Optimized Mobile UX:** Implements responsive overlays, touch-friendly scrollbars, and transforms standard desktop dropdowns into full-screen dialogs on mobile screens.
* **Beautiful Typography & Theme:** Stylized layout using high-legibility fonts (DM Sans & Bricolage Grotesque) and custom HSL color systems.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core:** **React 19** utilizing functional components, custom hooks, and context-driven state management.
- **Language Standard:** **TypeScript (v6.0)** ensuring total type safety across asynchronous API payloads and context variables.
- **Development Tooling:** **Vite (v8)** for near-instantaneous hot module replacement (HMR) and highly efficient tree-shaken production builds.
- **Styling System:** **Tailwind CSS v4** featuring its new high-performance CSS-only configuration directive (`@theme`) mapping custom color matrices, variable font assets, and custom-styled scrollbars.
- **Data Source APIs:** 
  - **Open-Meteo Geocoding API** for client-side search indexing (zero latency, no keys required).
  - **Open-Meteo Forecast API** with coordinate mapping and automated local timezone adjustments.

---

## 🧠 Architectural Logic & State Flow

The application is structured around a **one-way data flow** orchestrated by a central React Context Provider:

```
                  ┌──────────────────────┐
                  │   Search / Location  │
                  └──────────┬───────────┘
                             │ (User selects city)
                             ▼
 ┌──────────┐     ┌──────────────────────┐
 │  Units   ├────►│    WeatherContext    │
 │ Dropdown │     │  (State Management)  │
 └──────────┘     └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼ (Effects trigger API fetch)     ▼
 ┌──────────────────────┐          ┌──────────────────────┐
 │ Open-Meteo Geocoding │          │ Open-Meteo Forecast  │
 └──────────────────────┘          └──────────┬───────────┘
                                              │ (Updates UI)
                                              ▼
                                 ┌───────────────────────────┐
                                 │ - CurrentWeatherCard      │
                                 │ - DailyForecast           │
                                 │ - HourlyForecast          │
                                 └───────────────────────────┘
```

### 1. Centralized Context (`WeatherContext.tsx`)
State coordinates are entirely managed in a single `WeatherContext`.
* **State Values:** `selectedCity` (defaults to Yaoundé, Cameroon), `weatherData`, `isLoading`, `error`, and `unitPreferences`.
* **Synchronized Side Effects:** A single React `useEffect` hooks into modifications of either the target coordinates (`latitude`/`longitude`) or the active units (`unitPreferences`). When triggered, it initiates a call to the Open-Meteo Forecast API, keeping all components in sync.
* **Unit Alignment Helper:** When a user sets individual preferences (e.g., choosing Fahrenheit but choosing millimeters for precipitation), the system dynamically detects if the configuration perfectly mirrors Metric, Imperial, or a Custom mix.

### 2. Geocoding API Search (`SearchBar.tsx` & `weatherApi.ts`)
* To optimize bandwidth and respect API rate limits, autocomplete searches are dispatched to Open-Meteo's geocoding endpoint only when the search query extends past **2 characters**.
* Pressing **Enter** or clicking **Search** automatically selects the top suggested result.

### 3. WMO Weather Code Resolution (`weatherHelpers.ts`)
The Open-Meteo API transmits weather types using the standardized **WMO (World Meteorological Organization) 4677 weather code table**. 
* The utility function `getWeatherCondition(code)` converts numerical integers (e.g., `0` for Clear Sky, `3` for Overcast, `95` for Thunderstorms) into corresponding static asset pathways (`.webp` files) and descriptive text.

### 4. Hourly Forecast Filtration (`HourlyForecast.tsx`)
The Forecast API supplies hourly predictions for all 168 hours of the upcoming week in a single flat array.
* The system utilizes a `useMemo` filter that slices and isolates the specific 24-hour window matching the date chosen by the user in the dropdown.
* It displays weather icons, hours in 24-hour format, and corresponding temperatures.

### 5. Media Queries & Responsive Switch (`useMediaQuery.ts`)
* A custom hook `useMediaQuery` listens directly to viewport shifts.
* **Responsiveness Optimization:** On wider screens, clicking the "Units" toggle displays a lightweight floating overlay. On mobile devices, the dropdown dynamically converts into a full-height dialog drawer with a close button (`✕`) for native-like user experience.

---

## 📁 Directory Structure

```text
C:\Workspace\Personal Projects\weather_app_1\
├── package.json               # Project dependencies and operational scripts
├── vite.config.ts             # Vite bundler, React, and Tailwind CSS v4 configurations
├── tsconfig.json              # TypeScript root settings
├── index.html                 # Entry point HTML document
└── src/
    ├── main.tsx               # Client bootstrapper
    ├── App.tsx                # Layout shell and main application assembly
    ├── index.css              # Custom scrollbars, custom fonts, Tailwind theme configurations
    ├── components/
    │   ├── common/            # Shared UI components
    │   ├── layout/
    │   │   └── Header.tsx     # Site brand bar and Unit switch modal wrapper
    │   └── Weather/
    │       ├── CurrentWeatherCard.tsx  # Highlights current weather with telemetry indicators
    │       ├── DailyForecast.tsx       # 7-day weather cards showing day high/lows
    │       ├── HourlyForeCast.tsx      # Scrollable day-specific hourly breakdown list
    │       └── SearchBar.tsx           # Search input with autocomplete recommendations dropdown
    ├── context/
    │   └── WeatherContext.tsx # Application-wide React Context & unit-switch handlers
    ├── hooks/
    │   └── useMediaQuery.ts   # Custom window width listener for adaptive interfaces
    ├── services/
    │   └── weatherApi.ts      # Open-Meteo HTTP fetch integrations (Forecast & Geocoding)
    ├── types/
    │   ├── GeocodingResult.ts # Data interfaces representing locations & forecast payloads
    │   └── units.ts           # Enums and configurations governing metric/imperial units
    └── utils/
        └── weatherHelpers.ts  # ISO date formats, WMO icon mappers, and hour parsers
```

---

## 🧩 Data Schemas & Types

The application leverages strongly typed schemas to ensure payload reliability.

```typescript
// Location Object returned by search API
export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

// Complex Open-Meteo forecast return schema
export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
}
```

---

## 🏎️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) installed on your local computer.

### Installation

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd weather_app_1
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Local Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` to interact with the project!

### Production Build

To run ESLint, compile the TypeScript source files, and generate optimized production files, execute:
```bash
npm run build
```
This produces a static output inside the `dist/` directory ready to be deployed on static hosting providers like Netlify, Vercel, or GitHub Pages.

To preview your production build locally:
```bash
npm run preview
```

---

## 🎨 Visual System & Styling Details

Skyward's aesthetic is configured natively within the **Tailwind CSS v4** environment using custom design tokens declared in `src/index.css`:

```css
@theme {
  /* Dynamic Variable Fonts */
  --font-dm: "DM Sans", sans-serif;
  --font-bricolage: "Bricolage Grotesque", sans-serif;

  /* WCAG-Friendly Dark Background & High-Contrast Colors */
  --color-neutral-900: hsl(243, 96%, 9%);  /* Main deep space backdrop */
  --color-neutral-800: hsl(243, 27%, 20%); /* Secondary containers */
  --color-neutral-600: hsl(243, 23%, 30%); /* Scrollbar-thumbs and borders */
  --color-neutral-0: hsl(0, 0%, 100%);     /* Pure white crisp text */

  /* Focus Accent and Actions */
  --color-blue-500: hsl(233, 67%, 56%);    /* Focus rings & main call-to-actions */
}
```

* **Focus States:** Every interactive element has been calibrated with standard WCAG outline settings (`*:focus-visible`) for fully-compliant keyboard navigation.
* **Custom Scrollbars (`.spaced-scrollbar`):** Leverages Webkit selectors combined with padding-box background clip tricks to construct "floating" scrollbar handles that prevent visual collision with content blocks.
