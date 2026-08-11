import { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { searchLocation, type CityResult } from '../../services/weatherApi';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityResult[]>([]);

  const {
    setSelectedCity,
  } = useWeather();

  // Execute search when typing
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 2) {
      const locations = await searchLocation(value);
      setResults(locations);
    } else {
      setResults([]);
    }
  };

  // Execute search when clicking "Search" button or pressing Enter
  const handleSearchSubmit = async () => {
    if (query.trim().length === 0) return;

    try {
      const locations = await searchLocation(query);
      if (locations.length > 0) {
        handleSelectCity(locations[0]);
      }
    } catch (error) {
      console.error('Failed to search location:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Select a city from dropdown or direct search
  const handleSelectCity = (city: CityResult) => {
    setQuery(`${city.name}, ${city.country}`);
    setResults([]);
    setSelectedCity({
      id : city.id,
      name: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex flex-1">
          <div className="flex items-center justify-center rounded-l-lg bg-neutral-800 pl-4">
            <img
              className="w-4"
              src="./src/assets/images/icon-search.svg"
              alt="search icon"
            />
          </div>
          <input
            className="font-bricolage text-sm w-100 py-4 pr-4 pl-3 h-10 rounded-r-lg round-l-none bg-neutral-800 outline-none placeholder:text-neutral-300"
            type="text"
            value={query}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for a place..."
          />
        </div>
        <button
          onClick={handleSearchSubmit}
          className="h-10 cursor-pointer rounded-lg bg-blue-500 p-2 text-sm transition-colors hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Suggestion Dropdown */}
      {results.length > 0 && (
        <ul className="absolute left-0 top-full z-20 mt-2 w-full rounded-lg bg-neutral-800 p-2 shadow-lg">
          {results.map((city) => (
            <li
              key={city.id}
              onClick={() => handleSelectCity(city)}
              className="cursor-pointer rounded-md p-3 text-sm text-white hover:bg-neutral-700"
            >
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
