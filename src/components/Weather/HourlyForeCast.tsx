import { useState } from "react";

const HourlyForeCast = () => {

  const [open, setOPen] = useState(false);
  const [day, setDay] = useState('Tuesday');  
  
  type DummyDataType = {
    hour : string,
    atmCondition : string,
    tempMetric : number, 
    temperatureImperial : number,
    id : number
  }

  const dumyData :DummyDataType[] = [
        {
            hour : '5 PM',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 1,
        },
        {
            hour : '5 PM',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 2,
        },
        {
            hour : '5 PM',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 3,
        },
        {
            hour : '5 PM',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 4,
        },
        {
            hour : '5 PM',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 5,
        },
        {
            hour : '5 PM',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 6,
        },
        {
            hour : '5 PM',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 7,
        },
        {
            hour : '5 PM',
            atmCondition : '../../src/assets/images/icon-sunny.webp',
            tempMetric : 24,
            temperatureImperial: 50,
            id : 8,
        }
  ];

  type Days = {
    day : string,
    id : number
  }

  const days : Days[] = [
    {
      day : 'Tuesday',
      id : 1
    },{
      day : 'Wednesday',
      id : 2
    },{
      day : 'Thursday',
      id : 3
    },{
      day : 'Friday',
      id : 4
    },{
      day : 'Saturday',
      id : 5
    },{
      day : 'Sunday',
      id : 6
    },{
      day : 'Monday',
      id : 7
    }
  ];

  function handleClick(day : string) {
    setDay((prev) => prev = day);
  }

  return (
    <div className=" flex flex-col space-y-4 bg-neutral-700 p-4 rounded-lg min-h-full">
        <div className="flex justify-between items-center">
          <div className=""> Hourly forecast</div>
          <div onClick={() => setOPen(!open)} className="relative text-sm bg-neutral-600 rounded-sm p-2 flex space-x-2 items-center hover:cursor-pointer">
            <div className="">{day}</div>
            <img
              className={`h-2 transform transition-transform ${open ? '' : 'rotate-180'} m-0`} 
              src="../../src/assets/images/icon-dropdown.svg"
              alt="" 
            />
            {open && (<div className="absolute top-[110%] w-35 right-0 text-sm  rounded-lg flex flex-col p-1 space-y-1 bg-neutral-800">
                       {days.map((day) => {
                         return (<li key={day.id} onClick = {() => handleClick(day.day)} className="list-none p-2 hover:bg-neutral-600 rounded-lg hover:cursor-pointer">
                                     {day.day}
                                </li>)
                          })}             
                       </div>)}
          </div>
        </div>
        <div className="flex flex-col flex-1 justify-between space-y-1 min-h-full">
          {dumyData.map((day) => {
            return(<div key={day.id} className="flex justify-between items-center p-3 bg-neutral-600 rounded-lg">
                    <div className=" flex items-center">
                      <img
                        className="h-8" 
                        src="../../src/assets/images/icon-storm.webp" 
                        alt="strom" 
                        />
                      <div className="">{day.hour}</div>
                    </div>
                    <div className="text-sm">
                      {day.tempMetric}&#176;
                    </div>
                  </div>);
          })}
        </div>
    </div>
  )
}

export default HourlyForeCast