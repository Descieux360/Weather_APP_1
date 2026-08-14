import { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { useMediaQuery } from '../../hooks/useMediaQuery'

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isMetric, toggleUnitSystem } = useWeather();

  const isMobile = useMediaQuery('(min-width: 426px)');

  const handleUnitToggle = (e: React.MouseEvent): void => {
    e.stopPropagation();
    toggleUnitSystem();
    setIsDropdownOpen(false);
  };

  return (
    <header className="flex items-center justify-between text-white">
      <div className="logo">
        <img
          className='w-35 sm:w-50' 
          src="/assets/images/logo.svg" alt="My Weather App Logo" />
      </div>

      <div
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className= "relative flex cursor-pointer items-center  rounded-lg bg-neutral-800 gap-2 px-2 lg:px-4 py-2"
      >
        <img src="./src/assets/images/icon-units.svg" alt="Units Toggle" />
        <span className="text-sm">Units</span>
        <div>
          <img
            className={`transform transition-transform ${!isDropdownOpen ? 'rotate-180' : ''} ${isMobile  ? 'h-2' : ''} `}
            src="/assets/images/icon-dropdown.svg"
            alt="Dropdown"
          />
        </div>

        {isDropdownOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute z-50 bg-neutral-800 p-2 shadow-lg ${isMobile ? 'right-0 top-full rounded-lg w-52 mt-2' : '-right-6 -top-4 w-screen pt-8 h-screen'}`}
          >
            <button
              onClick={handleUnitToggle}
              className="mb-2 w-full rounded-md p-2 text-left hover:bg-neutral-600"
            >
              Switch to {isMetric ? 'Imperial' : 'Metric'}
            </button>

            {!isMobile &&             
              <button onClick={() => setIsDropdownOpen((prev) => !prev)} className='absolute right-2.5 top-2.5'>
                &#10005;
              </button>
            }

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