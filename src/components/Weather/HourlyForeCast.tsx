import React, { useState, useMemo } from 'react';
import { useWeather } from '../../context/WeatherContext'; // Adjust path based on your folder structure
import { getWeatherCondition, formatHour, formatDayOfWeek } from '../../utils/weatherHelpers'; // Adjust path based on your folder structure

export const HourlyForecast: React.FC = () => {
  const { weatherData, isLoading } = useWeather();
  const [open, setOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Extract available days for the dropdown menu (up to 7 days)
  const availableDays = useMemo(() => {
    if (!weatherData?.daily?.time) return [];
    return weatherData.daily.time.slice(0, 7).map((timeStr, index) => ({
      id: index,
      day: index === 0 ? 'Today' : formatDayOfWeek(timeStr),
      dateStr: timeStr.split('T')[0],
    }));
  }, [weatherData]);

  // Filter 24 hours of data for the selected day
  const selectedHourlyData = useMemo(() => {
    if (!weatherData?.hourly || availableDays.length === 0) return [];

    const targetDate = availableDays[selectedDayIndex]?.dateStr;
    if (!targetDate) return [];

    const { time, weather_code, temperature_2m } = weatherData.hourly;

    // Filter index bounds for the matching date
    return time
      .map((timeStr, index) => ({
        id: index,
        hour: formatHour(timeStr),
        dateStr: timeStr.split('T')[0],
        weatherCode: weather_code[index],
        temperature: Math.round(temperature_2m[index]),
      }))
      .filter((item) => item.dateStr === targetDate);
  }, [weatherData, selectedDayIndex, availableDays]);

  const currentDayLabel = availableDays[selectedDayIndex]?.day || 'Today';

  const handleSelectDay = (index: number) => {
    setSelectedDayIndex(index);
    setOpen(false);
  };

  if (isLoading || !weatherData) {
    return (
      <div className="flex flex-col space-y-4 bg-neutral-700 p-4 rounded-lg min-h-full animate-pulse">
        <div className="flex justify-between items-center h-8 bg-neutral-600 rounded w-full" />
        <div className="flex flex-col flex-1 justify-between space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 bg-neutral-600 rounded-lg w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 bg-neutral-700 p-4 rounded-lg h-full">
      <div className="flex justify-between items-center">
        <div>Hourly forecast</div>
        <div
          onClick={() => setOpen(!open)}
          className="relative text-sm bg-neutral-600 rounded-sm p-2 flex space-x-2 items-center hover:cursor-pointer z-10"
        >
          <div>{currentDayLabel}</div>
          <img
            className={`h-2 transform transition-transform ${open ? '' : 'rotate-180'} m-0`}
            src="../../src/assets/images/icon-dropdown.svg"
            alt="dropdown icon"
          />
          {open && (
            <div className="absolute top-[110%] w-35 right-0 text-sm rounded-lg flex flex-col p-1 space-y-1 bg-neutral-800 shadow-lg">
              {availableDays.map((d) => (
                <li
                  key={d.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectDay(d.id);
                  }}
                  className={`list-none p-2 hover:bg-neutral-600 rounded-lg hover:cursor-pointer ${
                    selectedDayIndex === d.id ? 'bg-neutral-700' : ''
                  }`}
                >
                  {d.day}
                </li>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 justify-between space-y-1 max-h-125 overflow-y-auto spaced-scrollbar">
        {selectedHourlyData.map((item) => {
          const condition = getWeatherCondition(item.weatherCode);

          return (
            <div
              key={item.id}
              className="flex justify-between items-center p-3 bg-neutral-600 rounded-lg h-25"
            >
              <div className="flex items-center space-x-2">
                <img
                  className="h-8 w-8 object-contain"
                  src={condition.icon}
                  alt={condition.label}
                />
                <div>{item.hour}</div>
              </div>
              <div className="text-sm">{item.temperature}&#176;</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;