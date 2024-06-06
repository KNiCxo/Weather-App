const fetchData = async () => {
  const geolocationResponse = await fetch('http://ip-api.com/json/');
  const geolocationJSON = await geolocationResponse.json();

  const lat = geolocationJSON.lat.toString();
  const lon = geolocationJSON.lon.toString();

  const oneCallResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=6c873417c4c8208022b5eae05b92905a&units=imperial&exclude=minutely, alerts`);
  const oneCallJSON = await oneCallResponse.json();

  dateTime = 1717591242;
  //dateTime = oneCallJSON.current.dt;
  sunrise = oneCallJSON.current.sunrise;
  sunset = oneCallJSON.current.sunset;
};

export function changeBackground(dateTime, sunrise, sunset) {
  if (dateTime >= sunrise && dateTime < sunset) {
    console.log('set to day no local');
    document.body.style.backgroundImage = 'url("sky.jpg")';
    localStorage.setItem('isDay', JSON.stringify('url("sky.jpg")'));
  } else {
    console.log('set to night no local');
    document.body.style.backgroundImage = 'url("night.jpg")';
    localStorage.setItem('isDay', JSON.stringify('url("night.jpg")'));
  }
  return true;
}