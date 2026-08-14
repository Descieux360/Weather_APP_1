import { useWeather } from '../../context/WeatherContext';
import { getWeatherCondition, formatLongDate } from '../../utils/weatherHelpers';

const CurrentWeatherCard = () => {

    const { weatherData, selectedCity, unitPreferences, isLoading, error } = useWeather();
    
    if (isLoading) {
        return (
        <div className="relative flex h-64 w-full flex-col justify-between overflow-hidden rounded-2xl bg-neutral-800 p-6 animate-pulse text-white shadow-xl">
            <div className="flex justify-between items-start">
            <div className="space-y-2">
                <div className="h-6 w-32 rounded bg-neutral-700"></div>
                <div className="h-4 w-24 rounded bg-neutral-700"></div>
            </div>
            <div className="h-12 w-12 rounded-full bg-neutral-700"></div>
            </div>
            <div className="flex items-baseline space-x-2">
            <div className="h-16 w-28 rounded bg-neutral-700"></div>
            </div>
        </div>
        );
    }

    // 2. Render Error State if API fails
    if (error || !weatherData || !selectedCity) {
        return (
        <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-neutral-800 p-6 text-center text-red-400">
            <p>{error || 'No weather data available.'}</p>
        </div>
        );
    }

    // Destructure real context values (derived prior to this return)
    const { current } = weatherData;
    const condition = getWeatherCondition(current.weather_code);
    const formattedDate = formatLongDate(current.time);

        // Dynamic unit symbols from preferences
    const tempSymbol = unitPreferences.temperature === 'fahrenheit' ? '°F' : '°C';
    const windSymbol = unitPreferences.windSpeed;
    const precipSymbol = unitPreferences.precipitation;

    const metrics = [
        {
            id: 1,
            metric: 'Feels Like',
            value: `${Math.round(current.apparent_temperature)}${tempSymbol}`,
        },
        {
            id: 2,
            metric: 'Humidity',
            value: `${current.relative_humidity_2m}%`,
        },
        {
            id: 3,
            metric: 'Wind Speed',
            value: `${current.wind_speed_10m} ${windSymbol}`,
        },
        {
            id: 4,
            metric: 'Precipitation',
            value: `${current.precipitation} ${precipSymbol}`,
        },
    ];

return (
    <div className="flex flex-col space-y-6">
      {/* Current Weather Card Container */}
      <div className="relative inline-block overflow-hidden rounded-2xl">
        {/* Background Image Asset */}
        <img
          src="../../src/assets/images/bg-today-large.svg"
          alt="Card Background"
          className="block w-full h-50 xl:h-65 object-cover"
        />

        {/* Card Overlay Content */}
        <div className="absolute inset-0 px-6 py-8 z-10 flex justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-center h-full w-full">
            {/* Location & Date */}
            <div>
              <div className="text-2xl xl:text-3xl font-bold font-bricolage">
                {`${selectedCity.name}, ${selectedCity.country}`}
              </div>
              <div className="text-sm text-neutral-200">
                {formattedDate}
              </div>
            </div>

            {/* Condition Icon & Temperature */}
            <div>
              <div className="flex items-center space-x-4">
                <img
                  src={`${condition.icon}`}
                  alt={condition.label}
                  className="h-20 w-20 object-contain"
                />
                <div className="flex items-center font-bricolage text-7xl font-bold">
                  {Math.round(current.temperature_2m)}
                  <span className="font-bricolage ml-1">
                    &deg;
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((item) => (
          <div
            key={item.id}
            className="bg-neutral-800/80 backdrop-blur-md p-4 rounded-xl border border-neutral-700/50 shadow-sm"
          >
            <div className="text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
              {item.metric}
            </div>
            <div className="text-2xl font-semibold font-bricolage text-white">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurrentWeatherCard

