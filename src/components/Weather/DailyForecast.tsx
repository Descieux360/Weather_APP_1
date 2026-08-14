import React from 'react';
import { useWeather } from '../../context/WeatherContext'; // Adjust path based on your folder structure
import { getWeatherCondition , formatDayOfWeek } from '../../utils/weatherHelpers'; // Adjust helper imports as needed

export const DailyForecast: React.FC = () => {
  const { weatherData, isLoading } = useWeather();

  if (isLoading || !weatherData?.daily) {
    return (
      <div className="flex flex-1 flex-col justify-between space-y-4">
        <h3 className="text-lg font-semibold">Daily Forecast</h3>
        <div className="flex space-x-2 space-y-2 flex-wrap">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center py-2 h-40 w-25 bg-neutral-700/50 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  const { time, weather_code, temperature_2m_max, temperature_2m_min } = weatherData.daily;


  return (
    <div className="flex flex-1 flex-col justify-between w-full space-y-4">
      <h3>Daily Forecast</h3>
      <div className="flex flex-wrap gap-3 sm:gap-5">
        {time.slice(0, 7).map((dateStr, index) => {
          const dayName = formatDayOfWeek(dateStr); // e.g., "Mon"
          const iconPath = getWeatherCondition (weather_code[index]);
          const maxTemp = Math.round(temperature_2m_max[index]);
          const minTemp = Math.round(temperature_2m_min[index]);
          return (
            <div
              key={dateStr}
              className="flex flex-col justify-between items-center h-33 w-20 py-2 bg-neutral-700 rounded-lg"
            >
              <div>{dayName}</div>
              <div>
                <img
                  src={`${iconPath.icon}`}
                  alt={`Weather condition for ${dayName}`}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex justify-between items-center px-2 space-x-5 text-sm w-full">
                <div>{maxTemp}&deg;</div>
                <div className="text-neutral-400">{minTemp}&deg;</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;