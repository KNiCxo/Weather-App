import React, {useState} from 'react';

// Search bar component for ListView
function Search(props) {
  const [locationList, setLocationList] = useState(null);

  const getLocations = async (userInput) => {
    /* 
    const geocodingResponse = await fetch(`
    http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=5&appid=6c873417c4c8208022b5eae05b92905a`);
    const geocodingJSON = await geocodingResponse.json();
    */
   
    setLocationList(true);
    console.log('test');

  };
  

  return(
    <>
      <div className='search'>
        <div className='search-bar'>
          <input type="text" placeholder='Search City'/>
          <img className='search-icon' src="search.png" alt="" onClick={getLocations}/>
        </div>
        
        <div className='search-results'>
          {locationList && (
            <ul>
              <li>Chula Vista, US<span>Add</span></li>
              <li>Chula Vista, MX <span>Add</span></li>
              <li>Chula Vista, MX<span>Add</span></li>
              <li>entry4 <span>Add</span></li>
              <li>entry5 <span>Add</span></li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default Search;