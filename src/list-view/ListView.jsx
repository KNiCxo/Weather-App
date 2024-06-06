import React, {useState, useEffect} from 'react';
import { changeBackground } from '../lib/changeBackground.js';

import Search from './Search.jsx';
import City from './City.jsx';

import './list-view.css'

function ListView() {
  const [localCity, setLocalCity] = useState(null);

  const [cityList, setCityList] = useState(
    JSON.parse(localStorage.getItem('cityList')) ? JSON.parse(localStorage.getItem('cityList')) :
    [
      {
        lat: 37.77,
        lon: -122.41
      },
      {
        lat: 35.68,
        lon: 139.75
      }
    ]
  );

  const fetchData = async () => {
    const geolocationResponse = await fetch('http://ip-api.com/json/');
    const geolocationJSON = await geolocationResponse.json();
    
    const oneCallResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${geolocationJSON.lat}&lon=${geolocationJSON.lon}&appid=6c873417c4c8208022b5eae05b92905a&units=imperial&exclude=minutely, alerts`);
    const oneCallJSON = await oneCallResponse.json();


    console.log(oneCallJSON.current.dt, oneCallJSON.current.sunrise);
    changeBackground(oneCallJSON.current.dt, oneCallJSON.current.sunrise, oneCallJSON.current.sunset);
    setLocalCity({lat: geolocationJSON.lat, lon: geolocationJSON.lon});
  };

  function displayLocal() {
    if (localCity) {
      return(
        <>
          <City lat={localCity.lat} lon={localCity.lon}></City>
        </>
      );
    }
  }

  function displayCities() {
    if (cityList.Length != 0) {
      return(
        <>
            {cityList.map((city, index) => 
              <City key={index} lat={city.lat} lon={city.lon}></City>
            )}
        </>
      );
    }
  }

  useEffect(() => {
    document.body.style.backgroundImage = JSON.parse(localStorage.getItem('isDay'));
    fetchData();
  }, []);

  return(
    <>
      <Search></Search>
      {displayLocal()}
      {displayCities()}
    </>
  );
}

export default ListView;