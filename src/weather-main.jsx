import React, {useState, useEffect, useRef} from 'react';

function WeatherMain() {
  const [weatherData, setWeatherData] = useState([]);

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

    setWeatherData([{
      location: `${currentData.name}, ${currentData.sys.country}`,
      date: formattedDate,
      time: formattedTime,
      currentTemp: currentData.main.temp,
      high: hourlyDailyData.daily[0].temp.max,
      low: hourlyDailyData.daily[0].temp.min,
      currentDesc: hourlyDailyData.current.weather[0].description,
      currentIcon: hourlyDailyData.current.weather[0].icon,
      summary: hourlyDailyData.daily[0].summary
     }
    ]);
    
    let currentHour = formattedTime.length > 7 ? Number(formattedTime.substr(0, 2)) : Number(formattedTime.substr(0, 1));
    let currentMeridiem = formattedTime.length > 7 ? formattedTime.substr(6, 2) : formattedTime.substr(5, 2); 

    const firstStat = {
      time: 'Now',
      meridiem: '',
      icon: hourlyDailyData.hourly[0].weather[0].icon,
      temp: hourlyDailyData.hourly[0].temp
    }
    setWeatherData(w => [...w, firstStat]);

    if (currentHour === 12) {
      currentHour = 1;
    } else {
      currentHour++;
      if (currentHour === 12) {
        if (currentMeridiem === 'AM') {
          currentMeridiem = 'PM';
        } else {
          currentMeridiem = 'AM';
        }
      }
    }

    for (let i = 1; i <= 24; i++) {
      const hourlyStat = {
        time: currentHour,
        meridiem: currentMeridiem,
        icon: hourlyDailyData.hourly[i].weather[0].icon,
        temp: hourlyDailyData.hourly[i].temp
      }
      
      if (currentHour === 12) {
        currentHour = 1;
      } else {
        currentHour++;
        if (currentHour === 12) {
          if (currentMeridiem === 'AM') {
            currentMeridiem = 'PM';
          } else {
            currentMeridiem = 'AM';
          }
        }
      }

      setWeatherData(w => [...w, hourlyStat]);
      console.log(hourlyStat);
    }

  }

  function showData() {
    if (weatherData.length != 0) {
      return (
        <>
          <div className='current-stats'>
            <h1>{`${weatherData[0].date}, ${weatherData[0].time}`}</h1>
            <h2>{weatherData[0].location}</h2>
            <p className='current-temp'>{`${Math.round(weatherData[0].currentTemp)}°F`}</p>
            <div className='current-weather-con'>
              <p>{`${weatherData[0].currentDesc}`}</p>
              <img src={`${weatherData[0].currentIcon}.png`} alt="image of weather condition"/>
            </div>
            <div className='current-high-low'>
              <p>{`H: ${Math.round(weatherData[0].high)}°`}</p>
              <p>{`L: ${Math.round(weatherData[0].low)}°`}</p>
            </div>
            <p></p>
          </div>

          <p className='summary'>{`${weatherData[0].summary}.`}</p>

          <div className='twenty-four-hour'>
            {weatherData.slice(1, 26).map((data, index) => (
              <div className='hourly-data' key={index}>
                <p>{`${data.time}${data.meridiem}`}</p>
                <img src={`${data.icon}.png`} alt=""/>
                <p>{`${Math.round(data.temp)}°`}</p>
              </div>
            ))}
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