import React, {useState, useEffect} from 'react';
import { changeBackground } from '../lib/changeBackground.js';

import Search from './Search.jsx';

import './list-view.css'

function ListView() {
  const [backgroundChanged, setBackgroundChanged] = useState(false);

  let cityList = JSON.parse(localStorage.getItem('cityList'));
  console.log(cityList);

  useEffect(() => {
    setBackgroundChanged(changeBackground());
  }, [backgroundChanged]);

  return(
    <>
      <Search></Search>
      <h1>hi</h1>
    </>
  );
}

export default ListView;