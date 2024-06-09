import React, {useState, useRef} from 'react';

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
          cityArray.push({name: city.name, state: city.state ? `${city.state},` : '', country: city.country});
        } else {
          // Iterate through temp array and skip result if it already exists
          for (let i = 0; i < cityArray.length; i++) {
            if (`${city.state},` == cityArray[i].state) {
              return;
            }
          }
          // Else, push into array
          cityArray.push({name: city.name, state: city.state ? `${city.state},` : '', country: city.country});
        }
      });

      // Set locationList value to that of the temp array
      setLocationList(cityArray);
    }
  };
  
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
                  {city.name}, {city.state} {city.country} <span className='add-button'>Add</span>
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