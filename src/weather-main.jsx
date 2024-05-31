import React, {useState, useEffect, useRef} from 'react';

function WeatherMain() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  

  const fetchData = async () => {
    const currentResponse = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=32.64&lon=-117.08&appid=6c873417c4c8208022b5eae05b92905a&units=imperial');

    const currentJSON = await currentResponse.json();

    const hourlyDailyResponse = await fetch('https://api.openweathermap.org/data/3.0/onecall?lat=32.64&lon=-117.08&appid=6c873417c4c8208022b5eae05b92905a&units=imperial&exclude=minutely, alerts');

    const hourlyDailyJSON = await hourlyDailyResponse.json();
    console.log(hourlyDailyJSON);

    organizeData(currentJSON, hourlyDailyJSON);
  };

  function organizeData(currentData, hourlyDailyData) {
    const currentDate = new Date();
    const formattedDate = currentDate.toString().substr(4, 6);
    const time = currentDate.toLocaleTimeString('en-US');

    let formattedTime;
    if (time.length > 10) {
      formattedTime = time.substr(0, 5) + ' ' + time.substr(9, 2);
    } else {
      formattedTime = time.substr(0, 4) + ' ' + time.substr(8, 2);
    }

    setWeatherData(
      {location: `${currentData.name}, ${currentData.sys.country}`,
       date: formattedDate,
       time: formattedTime,
       currentTemp: currentData.main.temp,
       high: hourlyDailyData.daily[0].temp.max,
       low: hourlyDailyData.daily[0].temp.min,
       currentDesc: hourlyDailyData.current.weather[0].description,
       currentIcon: hourlyDailyData.current.weather[0].icon}
    );
  }

  function showData() {
    if (weatherData) {
      return (
        <>
          <div className='current-stats'>
            <h1>{`${weatherData.date}, ${weatherData.time}`}</h1>
            <h2>{weatherData.location}</h2>
            <p className='current-temp'>{`${Math.round(weatherData.currentTemp)}°F`}</p>
            <div className='current-weather-con'>
              <p>{`${weatherData.currentDesc}`}</p>
              <img src={`${weatherData.currentIcon}.png`} alt="image of weather condition"/>
            </div>
            <div className='current-high-low'>
              <p>{`H: ${Math.round(weatherData.high)}°`}</p>
              <p>{`L: ${Math.round(weatherData.low)}°`}</p>
            </div>
            <p></p>
          </div>
        </>
      )
    }
  }

  return (
    <>
      {showData()}
    </>
  );
}

export default WeatherMain