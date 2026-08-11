import { useEffect, useState } from 'react';
import { useWeather } from '../../context/WeatherContext';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isMetric, toggleUnitSystem } = useWeather();


  const handleUnitToggle = (e: React.MouseEvent): void => {
    e.stopPropagation();
    toggleUnitSystem();
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    console.log(`My current unit preference is ${isMetric}`);
  }, []);

  return (
    <header className="flex items-center justify-between text-white">
      <div className="logo">
        <img src="./src/assets/images/logo.svg" alt="My Weather App Logo" />
      </div>

      <div
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="relative flex cursor-pointer items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2"
      >
        <img src="./src/assets/images/icon-units.svg" alt="Units Toggle" />
        <span className="text-sm">Units</span>
        <div>
          <img
            className={`transform transition-transform ${!isDropdownOpen ? 'rotate-180' : ''}`}
            src="./src/assets/images/icon-dropdown.svg"
            alt="Dropdown"
          />
        </div>

        {isDropdownOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-full z-10 mt-2 w-52 rounded-lg bg-neutral-800 p-2 shadow-lg"
          >
            <button
              onClick={handleUnitToggle}
              className="mb-2 w-full rounded-md p-2 text-left hover:bg-neutral-600"
            >
              Switch to {isMetric ? 'Imperial' : 'Metric'}
            </button>

            <div className="mb-1 p-2 text-sm text-neutral-300">Temperature</div>
            <ul>
              <li className={`cursor-pointer p-2 hover:bg-neutral-600 ${isMetric ? 'bg-neutral-600' : ''}`}>
                Celsius
              </li>
              <li className={`cursor-pointer p-2 hover:bg-neutral-600 ${!isMetric ? 'bg-neutral-600' : ''}`}>
                Fahrenheit
              </li>
            </ul>

            <div className="mb-1 p-2 text-sm text-neutral-300">Wind Speed</div>
            <ul>
              <li className={`cursor-pointer p-2 hover:bg-neutral-600 ${isMetric ? 'bg-neutral-600' : ''}`}>
                km/h
              </li>
              <li className={`cursor-pointer p-2 hover:bg-neutral-600 ${!isMetric ? 'bg-neutral-600' : ''}`}>
                mph
              </li>
            </ul>

            <div className="mb-1 p-2 text-sm text-neutral-300">Precipitation</div>
            <ul>
              <li className={`cursor-pointer p-2 hover:bg-neutral-600 ${isMetric ? 'bg-neutral-600' : ''}`}>
                millimeters
              </li>
              <li className={`cursor-pointer p-2 hover:bg-neutral-600 ${!isMetric ? 'bg-neutral-600' : ''}`}>
                inch
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;