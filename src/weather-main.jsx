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
    const formattedTime = time.substr(0, 4) + ' ' + time.substr(8, 2);

    setWeatherData(
      {city: currentData.name,
       date: formattedDate,
       time: formattedTime,
       currentTemp: currentData.main.temp,
       high: hourlyDailyData.daily[0].temp.max,
       low: hourlyDailyData.daily[0].temp.min,
       currentDesc: hourlyDailyData.current.weather[0].main,
       currentIcon: hourlyDailyData.current.weather[0].icon}
    );
  }

  function showData() {
    if (weatherData) {
      return (
        <>
          <h1>{`${weatherData.date}, ${weatherData.time}`}</h1>
          <h2>{weatherData.city}</h2>
          <p>{`${Math.round(weatherData.currentTemp)}°F`}</p>
          <p>{`H: ${Math.round(weatherData.high)} L: ${Math.round(weatherData.low)}`}</p>
          <p>
            {`${weatherData.currentDesc}`}
            <img src={`${weatherData.currentIcon}.png`} alt="" />
          </p>
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