import React, {useState} from 'react';

function DailyForecast(props) {
  return(
    <>
      {/* Displays 7 day forecast */}
      <div className='seven-day'>
          {/* Loops through the indexes that relate to the 7 day forecast */}
          {props.data.slice(26, 33).map((data, index) => (
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
  );
}

export default DailyForecast;