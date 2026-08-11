import Header from './components/layout/Header'
import SearchBar from './components/Weather/SearchBar'
import CurrentWeatherCard from './components/Weather/CurrentWeatherCard'
import HourlyForeCast from './components/Weather/HourlyForeCast'
import DailyForecast from './components/Weather/DailyForecast'

export const App = () => {

  return (
    <>
     <div className=" flex flex-col justify-between py-12 px-16 lg:px-32 xl:px-40 2xl:px-75 min-h-screen">
      <Header />

      <div className='flex flex-col justify-between space-y-12 h-full'>

        <div className=" flex flex-col space-y-8 items-center">
            <h1 className='font-bricolage text-4xl font-medium'>How's the sky looking today?</h1>
            <SearchBar />
        </div>

        <div className="flex justify-between space-x-6">
          <div className=" w-2/3 space-y-4">
            <CurrentWeatherCard />
            <DailyForecast />
          </div>
          <div className="w-1/3">
            <HourlyForeCast />
          </div>
        </div>

      </div>  

     </div>
    </>
  )
}

export default App
