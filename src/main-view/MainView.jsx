import React, {useState, useEffect} from 'react';
import { changeBackground } from '../lib/changeBackground.js';

import './main-view.css';
import './main-res.css';

// Import weather display components
import Current from './Current.jsx';
import Hourly from './Hourly.jsx';
import Daily from './Daily.jsx';

// Creates Current, 24-Hour, and 7-Day Forecasts
function App() {
  // Stores all necessary date and time variables as an object
  let dateTimeObj;
  
  // Stores data necessary for forecasts from OpenWeatherMap API as an array of objects
  const [weatherData, setWeatherData] = useState([]);

  // Makes a call to the Reverse Geocoding and "One Call" APIs, stores the responses, and organizes the data
  const fetchData = async () => {
    // When a component on ListView is clicked, two values called "selectedLat" and "selectedLon" will be set
    // When the main view is loaded, those values will be used to get the correct weather data
    // If those values have not been set, set them based on the current location using the Geolocation API
    if (!JSON.parse(localStorage.getItem('selectedLat'))) {
      const geolocationResponse = await fetch('http://ip-api.com/json/');
      const geolocationJSON = await geolocationResponse.json();
      localStorage.setItem('selectedLat', JSON.stringify(geolocationJSON.lat));
      localStorage.setItem('selectedLon', JSON.stringify(geolocationJSON.lon));
    }

    const lat = JSON.parse(localStorage.getItem('selectedLat'));
    const lon = JSON.parse(localStorage.getItem('selectedLon'));

    const reverseGeoResponse = await fetch(`
    https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=6f097032f1cc40498b36edaa50ca490a`);
    const reverseGeoJSON = await reverseGeoResponse.json();

    const oneCallResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=6c873417c4c8208022b5eae05b92905a&units=imperial&exclude=minutely, alerts`);
    const oneCallJSON = await oneCallResponse.json();

    // Change background depending on day or night
    changeBackground(oneCallJSON.current.dt, oneCallJSON.current.sunrise, oneCallJSON.current.sunset);

    // Organizes data from API calls
    organizeData(reverseGeoJSON, oneCallJSON);
  };

  // Parases data from API calls into weatherData array
  function organizeData(reverseGeoData, oneCallData) {
    handleDateTime(oneCallData.current.dt, oneCallData.timezone_offset / 3600);
    organizeCurrent(reverseGeoData, oneCallData);
    organizeHourly(oneCallData);
    organizeDaily(oneCallData);
  }

  // Handles date and time data needed for component
  function handleDateTime(dt, timeZoneOffset) {
    const localTimeOffset = (new Date()).getTimezoneOffset() / 60;

    // Stores current date and time
    dateTimeObj = {...dateTimeObj, currentDate: new Date((dt * 1000) + ((localTimeOffset + timeZoneOffset) * 3600) * 1000)};

    // Stores date formatted e.g. "Jun 01"
    dateTimeObj = {...dateTimeObj, formattedDate: dateTimeObj.currentDate.toString().substr(4, 6)};

    // Get local time
    const time = dateTimeObj.currentDate.toLocaleTimeString('en-US');

    // Stores time formatted e.g. "12:53 PM"
    if (time.length > 10) {
      dateTimeObj = {...dateTimeObj, formattedTime: time.substr(0, 5) + ' ' + time.substr(9, 2)};
    } else {
      dateTimeObj = {...dateTimeObj, formattedTime: time.substr(0, 4) + ' ' + time.substr(8, 2)};
    }

    // Parses the hour and meridiem from formattedTime into seperate variables
    dateTimeObj = {
      ...dateTimeObj, 
      currentHour: dateTimeObj.formattedTime.length > 7 ? 
      Number(dateTimeObj.formattedTime.substr(0, 2)) :        
      Number(dateTimeObj.formattedTime.substr(0, 1))
    };

    dateTimeObj = {
      ...dateTimeObj, 
      currentMeridiem: dateTimeObj.formattedTime.length > 7 ? 
      dateTimeObj.formattedTime.substr(6, 2) : 
      dateTimeObj.formattedTime.substr(5, 2)
    }
  }

  // Organizes data for the "Current" weather component
  function organizeCurrent(reverseGeoData, oneCallData) {
    // Stores current forecast data in first index of array
    setWeatherData([{
        date: dateTimeObj.formattedDate,
        time: dateTimeObj.formattedTime,
        location: `${reverseGeoData.features[0].properties.city}, ${reverseGeoData.features[0].properties.country_code.toUpperCase()}`,
        currentTemp: oneCallData.current.temp,
        high: oneCallData.daily[0].temp.max,
        low: oneCallData.daily[0].temp.min,
        currentDesc: oneCallData.current.weather[0].description,
        currentIcon: oneCallData.current.weather[0].icon,
        summary: oneCallData.daily[0].summary
      }]
    )
  }

  // Organizes data for the "Hourly" weather component
  function organizeHourly(oneCallData) {
    // Stores the first hourly forecast data into the next index of array
    const firstHourly = {
      time: 'Now',
      meridiem: '',
      icon: oneCallData.hourly[0].weather[0].icon,
      temp: oneCallData.hourly[0].temp
    }
    setWeatherData(w => [...w, firstHourly]);

    // Increments the hour and changes the meridiem (if needed) for next hourly forecast dataset
    if (dateTimeObj.currentHour === 12) {
      dateTimeObj.currentHour = 1;
    } else {
      dateTimeObj.currentHour++;
      if (dateTimeObj.currentHour === 12) {
        if (dateTimeObj.currentMeridiem === 'AM') {
          dateTimeObj.currentMeridiem = 'PM';
        } else {
          dateTimeObj.currentMeridiem = 'AM';
        }
      }
    }

    // Creates 24 hour forecast dataset and stores into array
    for (let i = 1; i <= 24; i++) {
      const hourlyStat = {
        time: dateTimeObj.currentHour,
        meridiem: dateTimeObj.currentMeridiem,
        icon: oneCallData.hourly[i].weather[0].icon,
        temp: oneCallData.hourly[i].temp
      }
      
      if (dateTimeObj.currentHour === 12) {
        dateTimeObj.currentHour = 1;
      } else {
        dateTimeObj.currentHour++;
        if (dateTimeObj.currentHour === 12) {
          if (dateTimeObj.currentMeridiem === 'AM') {
            dateTimeObj.currentMeridiem = 'PM';
          } else {
            dateTimeObj.currentMeridiem = 'AM';
          }
        }
      }
      setWeatherData(w => [...w, hourlyStat]);
    }
  }

  // Organizes data for the "Daily" weather component
  function organizeDaily(oneCallData) {
    // Stores the first daily forecast data into the next index of array
    const firstDaily = {
      day: 'Today',
      icon: oneCallData.daily[0].weather[0].icon,
      high: oneCallData.daily[0].temp.max,
      low: oneCallData.daily[0].temp.min
    }
    setWeatherData(w => [...w, firstDaily]);

    // Creates 7 day forecast dataset and stores into array
    for (let i = 1; i <= 7; i++) {
      // Increments to the following day
      const date = dateTimeObj.currentDate.setDate(dateTimeObj.currentDate.getDate() + 1);

      // Gets the day name from the date
      const day = dateTimeObj.currentDate.toLocaleDateString('en-US', { weekday: 'long' });

      // Formats day into the first three letters
      const formattedDay = day.substr(0, 3);

      const dailyStat = {
        day: formattedDay,
        icon: oneCallData.daily[i].weather[0].icon,
        high: oneCallData.daily[i].temp.max,
        low: oneCallData.daily[i].temp.min
      }
      setWeatherData(w => [...w, dailyStat]);
    }
  }

  // Handles displaying current, hourly, and daily forecast data onto the web page
  function showData() {
    // Only displays data if array is not empty
    if (weatherData.length != 0) {
      return(
        <>
          <Current data={weatherData}></Current>
          <Hourly data={weatherData}></Hourly>
          <Daily data={weatherData}></Daily>
        </>
      );
    }
  }

  // Fetches and organizes necessary data on app mount
  useEffect(() => {
    document.body.style.backgroundImage = JSON.parse(localStorage.getItem('isDay'));
    fetchData();
  }, []);

  return (
    <>
      {showData()}
    </>
  );
}

export default App;