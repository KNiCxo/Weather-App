import React, {useState, useRef, useEffect} from 'react';

// Search bar component for ListView
function Search(props) {
  // Store a reference to the search bar input field
  const inputRef = useRef();

  // Store the list of cities that is fetched from the Geocoding API
  const [locationList, setLocationList] = useState();

  // Gets the locations from the Geocoding API that match the user input and stores them in locationList if possible
  const getLocations = async () => {
    // Calls API only if there is user input
    if (inputRef.current.value) {
      // Use user input to make API call
      const geocodingResponse = await fetch(`
      http://api.openweathermap.org/geo/1.0/direct?q=${inputRef.current.value}&limit=5&appid=6c873417c4c8208022b5eae05b92905a`);
      const geocodingJSON = await geocodingResponse.json();
  
      // Create temporary array
      const cityArray = []

      // Go through results and insert them into temp array if necessary
      geocodingJSON.forEach(city => {
        // If array is empty, push first object into it
        if (cityArray.length === 0) {
          // If there is not a state, then keep state key empty
          cityArray.push({name: city.name, 
                          state: city.state ? `${city.state},` : '', 
                          country: city.country,
                          lat: city.lat,
                          lon: city.lon});
        } else {
          // Iterate through temp array and skip result if it already exists
          for (let i = 0; i < cityArray.length; i++) {
            if (`${city.state},` == cityArray[i].state) {
              return;
            }
          }
          // Else, push into array
          cityArray.push({name: city.name, 
                          state: city.state ? `${city.state},` : '', 
                          country: city.country,
                          lat: city.lat,
                          lon: city.lon});
        }
      });

      // Set locationList value to that of the temp array
      setLocationList(cityArray);
    }
  };

  // Adds location to the city list and saves the new list in local storage
  // Uses the index of the li to add the correct city
  function addLocation(index) {
    // Iterates through each city in the list and compares to see if the result matches any of them
    // If it does, return
    for (let i = 0; i < props.cityList.length; i++) {
      if (props.cityList[i].lat === locationList[index].lat && props.cityList[i].lon === locationList[index].lon) {
        return;
      }
    }

    // If result doesn't match anything in the city list, then set new cityList state and save to local storage
    const newCityList = [...props.cityList, {lat: locationList[index].lat, lon: locationList[index].lon}]
    props.setCityList(newCityList);
    localStorage.setItem('cityList', JSON.stringify(newCityList));
  }

  // On mount, adds an event listener to the body
  useEffect(() => {
    // Results div clears when clicked off of it
    document.body.addEventListener('click', () => setLocationList(null))
  }, [])
  
  return(
    <>
      {/* Container for search bar, magnifying glass image, and search results */}
      <div className='search'>
        {/* Get access to input field using ref */}
        <div className='search-bar'>
          <input ref={inputRef} type="text" placeholder='Search City'/>
          <img className='search-icon' src="search.png" alt="" onClick={getLocations}/>
        </div>

        {/* Displays array if it exist s*/}
        {locationList && (
          <div className='search-results'>
            <ul>
              {/* Loop through to display all results */}
              {locationList.map((city, index) => (
                <li key={index}>
                  {/* Displays city name, state, and country, along with an "Add" button */}
                  {city.name}, {city.state} {city.country} <span className='add-button' onClick={() => addLocation(index)}>Add</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
    
  );
}

export default Search;