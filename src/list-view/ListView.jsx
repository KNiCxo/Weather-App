import React, {useState, useEffect} from 'react';
import { changeBackground } from '../lib/changeBackground.js';

import './list-view.css';

// Import search bar and city list component
import Search from './Search.jsx';
import City from './City.jsx';

// Creates a list of selected cities and displays their respective weather data
function ListView() {
  // Stores the latitude and longitude of the user's location as an object
  const [localCity, setLocalCity] = useState(null);

  // Stores the latitude and longitude values as objects for the cities that the user has chosen
  const [cityList, setCityList] = useState(
    // If cityList is saved in local storage, use as default, otherwise set as empty
    // *** USES TEST SET TEMPORARILY ***
    JSON.parse(localStorage.getItem('cityList')) ? JSON.parse(localStorage.getItem('cityList')) :
    [
      {
        lat: 37.77,
        lon: -122.41
      },
      {
        lat: 35.6828387,
        lon: 139.7594549
      }
    ]
  );

  // Fetches data from the Geolocation and "One Call" APIs to be able to set the background image and current location
  const fetchData = async () => {
    // Get lat and lon from Geolocation API
    const geolocationResponse = await fetch('http://ip-api.com/json/');
    const geolocationJSON = await geolocationResponse.json();
    
    // Use lat and lon to get current location
    const oneCallResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${geolocationJSON.lat}&lon=${geolocationJSON.lon}&appid=6c873417c4c8208022b5eae05b92905a&units=imperial&exclude=minutely, alerts`);
    const oneCallJSON = await oneCallResponse.json();

    changeBackground(oneCallJSON.current.dt, oneCallJSON.current.sunrise, oneCallJSON.current.sunset);
    setLocalCity({lat: geolocationJSON.lat, lon: geolocationJSON.lon});
  };

  // Displays the local city if it has been set
  function displayLocal() {
    if (localCity) {
      return(
        <>
          {/* Uses lat and lon values from localCity object so that component can get the correct data */}
          <City lat={localCity.lat} lon={localCity.lon}></City>
        </>
      );
    }
  }

  // Displays the list of cities
  function displayCities() {
    // If array is populated, return list of cities
    if (cityList.Length != 0) {
      return(
        <>
          {/* Iterates through city list and creates city component, movement arrows, and a remove button */}
          {cityList.map((city, index) =>
            <div className='city-container' key={index} >
              <City lat={city.lat} lon={city.lon}></City> 

              <div className='arrow-div'>
                <img className='up-arrow' src="up.png" alt="" /> 
                <img className='down-arrow' src="down.png" alt="" />
              </div>

              <img className='remove' src="remove.png" alt="" />
            </div>
          )}
        </>
      );
    }
  }

  // On mount, sets background image to it's most recent state and fetches data needed for component
  useEffect(() => {
    document.body.style.backgroundImage = JSON.parse(localStorage.getItem('isDay'));
    fetchData();
  }, []);

  return(
    <>
      <Search setCityList={setCityList}></Search>
      {displayLocal()}
      {displayCities()}
    </>
  );
}

export default ListView;