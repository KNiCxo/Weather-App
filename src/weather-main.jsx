import React, {useState, useEffect, useRef} from 'react';

// Creates Current, 24-Hour, and 7-Day Forecasts
function WeatherMain() {
  // Stores data necessary for forecasts from OpenWeatherMap API as an array of objects
  const [weatherData, setWeatherData] = useState([]);

  // Fetches data from OpenWeatherMap API on component mount
  useEffect(() => {
    fetchData();
  }, []);
  

  // Makes a call to the "Current Weather Data" and "One Call" APIs, stores the responses, and organizes the data
  const fetchData = async () => {
    const currentResponse = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=32.64&lon=-117.08&appid=6c873417c4c8208022b5eae05b92905a&units=imperial');

    const currentJSON = await currentResponse.json();

    const hourlyDailyResponse = await fetch('https://api.openweathermap.org/data/3.0/onecall?lat=32.64&lon=-117.08&appid=6c873417c4c8208022b5eae05b92905a&units=imperial&exclude=minutely, alerts');

    const hourlyDailyJSON = await hourlyDailyResponse.json();
    console.log(hourlyDailyJSON);

    organizeData(currentJSON, hourlyDailyJSON);
  };

  // Parases data from API calls into weatherData array
  function organizeData(currentData, hourlyDailyData) {
    // Formats the date and parses the time into an individual variable
    const currentDate = new Date();
    const formattedDate = currentDate.toString().substr(4, 6);
    const time = currentDate.toLocaleTimeString('en-US');

    // Formats the time as HH:MM with Meridiem
    let formattedTime;

    // Handles the case difference between one and two digit hours
    if (time.length > 10) {
      formattedTime = time.substr(0, 5) + ' ' + time.substr(9, 2);
    } else {
      formattedTime = time.substr(0, 4) + ' ' + time.substr(8, 2);
    }

    // Parses the hour and meridiem from formattedTime into seperate variables
    let currentHour = formattedTime.length > 7 ? Number(formattedTime.substr(0, 2)) : Number(formattedTime.substr(0, 1));
    let currentMeridiem = formattedTime.length > 7 ? formattedTime.substr(6, 2) : formattedTime.substr(5, 2); 

    // Stores current forecast data in first index of array
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

    // Stores the first hourly forecast data into the next index of array
    const firstHourly = {
      time: 'Now',
      meridiem: '',
      icon: hourlyDailyData.hourly[0].weather[0].icon,
      temp: hourlyDailyData.hourly[0].temp
    }
    setWeatherData(w => [...w, firstHourly]);

    // Increments the hour and changes the meridiem (if needed) for next hourly forecast dataset
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

    // Creates 24 hour forecast dataset and stores into array
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
    }

    // Stores the first daily forecast data into the next index of array
    const firstDaily = {
      day: 'Today',
      icon: hourlyDailyData.daily[0].weather[0].icon,
      high: hourlyDailyData.daily[0].temp.max,
      low: hourlyDailyData.daily[0].temp.min
    }
    setWeatherData(w => [...w, firstDaily]);

     // Creates 7 day forecast dataset and stores into array
     for (let i = 1; i <= 7; i++) {
      // Increments to the following day
      const date = currentDate.setDate(currentDate.getDate() + 1);

      // Gets the day name from the date
      const day = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

      // Formats day into the first three letters
      const formattedDay = day.substr(0, 3);

      const dailyStat = {
        day: formattedDay,
        icon: hourlyDailyData.daily[i].weather[0].icon,
        high: hourlyDailyData.daily[i].temp.max,
        low: hourlyDailyData.daily[i].temp.min
      }
      setWeatherData(w => [...w, dailyStat]);
    }

  }

  // Handles displaying current, hourly, and daily forecast data onto the web page
  function showData() {
    // Only displays data if array is not empty
    if (weatherData.length != 0) {
      return (
        <>
          {/* Displays current forecast data */}
          <div className='current-stats'>
            {/* Displays current date and time */}
            <h1>{`${weatherData[0].date}, ${weatherData[0].time}`}</h1>
            <h2>{weatherData[0].location}</h2>

            {/* Displays current temperature */}
            <p className='current-temp'>{`${Math.round(weatherData[0].currentTemp)}°F`}</p>

            {/* Displays current weather condition */}
            <div className='current-weather-con'>
              <p>{`${weatherData[0].currentDesc}`}</p>
              <img src={`${weatherData[0].currentIcon}.png`} alt="image of weather condition"/>
            </div>

            {/* Displays current highs and lows */}
            <div className='current-high-low'>
              <p>{`H: ${Math.round(weatherData[0].high)}°`}</p>
              <p>{`L: ${Math.round(weatherData[0].low)}°`}</p>
            </div>
          </div>

          {/* Displays daily weather summary and 24 hour forecast */}
          <div className='twenty-four-hour'>
            {/* Displays daily weather summary */}
            <div class='summary-section'>
              <p>{`${weatherData[0].summary}.`}</p>
            </div>

            <div className='hourly-section'>
              {/* Loops through the indexes that relate to the 24 hour forecast */}
              {weatherData.slice(1, 26).map((data, index) => (
                // Displays individual hourly data
                <div className='hourly-data' key={index}>
                  {/* Displays the hour along with the weather condition and temperature associated with it */}
                  <p>{`${data.time}${data.meridiem}`}</p>
                  <img src={`${data.icon}.png`} alt=""/>
                  <p>{`${Math.round(data.temp)}°`}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Displays 7 day forecast */}
          <div className='seven-day'>
              {/* Loops through the indexes that relate to the 7 day forecast */}
              {weatherData.slice(26, 33).map((data, index) => (
                // Displays individual daily data
                <div className='daily-data' key={index}>
                  {/* Displays the day along with the weather condition and high/low associated with it */}
                  <p>{`${data.day}`}</p>
                  <img src={`${data.icon}.png`} alt=""/>
                  <div className='daily-high-low'>
                    <p>{`H: ${Math.round(data.high)}°`}</p>
                    <p>{`L: ${Math.round(data.low)}°`}</p>
                  </div>
                </div>
              ))}
          </div>
        </>
      )
    }
  }

  return (
    <>
      {/* Displays data on to the page */}
      {showData()}
    </>
  );
}

export default WeatherMain