
const DailyForecast = () => {
    type DummyDataType = {
        day : string,
        atmCondition : string,
        tempMetric : number, 
        temperatureImperial : number,
        id : number
    }
    const dumyData :DummyDataType[] = [
        {
            day : 'Mon',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 1
        },
        {
            day : 'Mon',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 2
        },
        {
            day : 'Mon',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 3
        },
        {
            day : 'Mon',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 4
        },
        {
            day : 'Mon',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 5
        },
        {
            day : 'Mon',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 6
        },
        {
            day : 'Mon',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 7
        }
    ]
  return (
    <div className="flex flex-col space-y-4">
        <h3>Daily Forecast</h3>
        <div className="flex space-x-2">
            {dumyData.map((e) => {
                return(
                    <div key={e.id} className="flex flex-col items-center py-2 w-full bg-neutral-700 rounded-lg">
                        <div className="">
                            {e.day}
                        </div>
                        <div className="">
                            <img 
                                src={`${e.atmCondition}`} 
                                alt="" 
                            />
                        </div>
                        <div className="flex px-2 justify-between text-sm w-full">
                            <div className="">
                                {e.tempMetric}
                            </div>
                            <div className="">
                                {e.temperatureImperial}
                            </div>
                        </div>
                    </div>
                )
            })}  
        </div>
    </div>
  )
}

export default DailyForecast