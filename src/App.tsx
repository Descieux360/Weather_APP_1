import Header from './components/layout/Header'
import SearchBar from './components/Weather/SearchBar'
import CurrentWeatherCard from './components/Weather/CurrentWeatherCard'
import HourlyForeCast from './components/Weather/HourlyForeCast'
import DailyForecast from './components/Weather/DailyForecast'

export const App = () => {

  return (
    <>
     <div className=" flex flex-col justify-between space-y-8 py-4 px-6 sm:py-10 sm:px-16 lg:px-25 lg:py-12 xl:px-40 2xl:px-75 min-h-screen">
      <Header />

      <div className='flex flex-1 flex-col justify-between space-y-12 h-full'>

        <div className=" flex flex-col space-y-8 items-center">
            <h1 className='font-bricolage text-center sm:text-left text-4xl font-medium'>How's the sky looking today?</h1>
            <SearchBar />
        </div>

        <div className="flex justify-between space-y-6 lg:space-x-6 lg:space-y-0 flex-col lg:flex-row h-fit max-h-full">
          <div className="flex flex-col justify-between lg:w-2/3 space-y-4">
            <CurrentWeatherCard />
            <DailyForecast />
          </div>
          <div className="lg:w-1/3">
            <HourlyForeCast />
          </div>
        </div>

      </div>  

     </div>
    </>
  )
}

export default App
