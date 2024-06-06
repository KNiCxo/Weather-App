import React, {useState} from 'react';

function HourlyForecast(props) {
  return(
    <>
      {/* Displays daily weather summary and 24 hour forecast */}
      <div className='twenty-four-hour'>
        {/* Displays daily weather summary */}
        <div className='summary-section'>
          <p>{`${props.data[0].summary}.`}</p>
        </div>

        <div className='hourly-section'>
          {/* Loops through the indexes that relate to the 24 hour forecast */}
          {props.data.slice(1, 26).map((data, index) => (
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
    </>
  );
}

export default HourlyForecast;