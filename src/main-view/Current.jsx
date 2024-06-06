import React, {useState} from 'react';
import { Link } from "react-router-dom";

function Current(props) {
  return(
    <>
      {/* Displays current forecast data */}
      <div className='current-stats'>
        {/* Displays current forecast data */}
        <h1>{`${props.data[0].date}, ${props.data[0].time}`}</h1>
        <h2>{props.data[0].location} <Link to='/list'><span className='menu'><img src="menu.png" alt="" /></span></Link></h2>

        {/* Displays current temperature */}
        <p className='current-temp'>{`${Math.round(props.data[0].currentTemp)}°F`}</p>

        {/* Displays current weather condition */}
        <div className='current-weather-con'>
          <p>{`${props.data[0].currentDesc}`}</p>
          <img src={`${props.data[0].currentIcon}.png`} alt="image of weather condition"/>
        </div>

        {/* Displays current highs and lows */}
        <div className='current-high-low'>
          <p>{`H: ${Math.round(props.data[0].high)}°`}</p>
          <p>{`L: ${Math.round(props.data[0].low)}°`}</p>
        </div>
      </div>
    </>
  );
}

export default Current;