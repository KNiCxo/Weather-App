import React, {useState, useEffect} from 'react';

// Displays the weather data of a city based on the latitude and longitude values passed to it
function City(props) {
  // Stores the city's weather data as an object
  const [cityData, setCityData] = useState(null)

  // Fetches data from the Reverse Geolocation and "OneCall" APIs to get the city's name and weather data
  // Uses the latitude and longitude values passed to it to achieve this
  const fetchData = async () => {
    const reverseGeoResponse = await fetch(`
    https://api.geoapify.com/v1/geocode/reverse?lat=${props.lat}&lon=${props.lon}&apiKey=6f097032f1cc40498b36edaa50ca490a`);
    const reverseGeoJSON = await reverseGeoResponse.json();

    const oneCallResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${props.lat}&lon=${props.lon}&appid=6c873417c4c8208022b5eae05b92905a&units=imperial&exclude=minutely, alerts`);
    const oneCallJSON = await oneCallResponse.json();

    setCityData({
      city: reverseGeoJSON.features[0].properties.city,
      currentDesc: oneCallJSON.current.weather[0].description,
      currentIcon: oneCallJSON.current.weather[0].icon,
      currentTemp: oneCallJSON.current.temp,
      high: oneCallJSON.daily[0].temp.max,
      low: oneCallJSON.daily[0].temp.min,
    })
  };

  // If the cityData is not null, display the city component
  function displayCity() {
    if (cityData) {
      return(
        <>
          {/* Container to hold all component data */}
          <div className='city-div city-div-small'>
            {/* City name */}
            <p className='city-name'>{cityData.city}</p>

            {/* Weather condition */}
            <img className='city-image city-image-small' src={`${cityData.currentIcon}.png`} alt="" />

            {/* Container to hold the temperature data */}
            <div className='city-temps'>
              {/* Current temperature */}
              <p className='city-current city-current-small'>{`${Math.round(cityData.currentTemp)}°`}</p>

              {/* Temperature high and low */}
              <div className='city-high-low city-high-low-small'>
                <p>{`H: ${Math.round(cityData.high)}°`}</p>
                <p>{`L: ${Math.round(cityData.low)}°`}</p>
              </div>
            </div>
          </div>
        </>
      );
    }
  }

  // On mount, fetches data needed for component
  useEffect(() =>{
    fetchData();
  }, []);

  return(
    <>
      {displayCity()}
    </>
  );
}

export default City;