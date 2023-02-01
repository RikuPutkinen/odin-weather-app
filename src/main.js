const searchBar = document.getElementById('search');
const searchButton = document.getElementById('search-button');
const temperatureUnitSelector = document.getElementById("temperature-unit-selector");
const locationNameElement = document.getElementById("location-name");
const iconContainer = document.getElementById("icon-container");
const iconDescriptionElement = document.getElementById("icon-description");
const temperatureNumberElement = document.getElementById('temperature-number');

let weatherData;

temperatureUnitSelector.addEventListener('change', (e) => {
  if (!weatherData) return;
  renderTemperature();
});

searchButton.addEventListener('click', async (e) => {
  if (!searchBar.value) return;
  const locationName = searchBar.value;
  weatherData = await getWeatherData(locationName);
  console.log(weatherData);

  renderWeatherData()
})

async function getWeatherData(locationName) {
  const API_KEY = "6a17fb59a0685a9b4fc365f9e8552890";
  try{
    console.log("Getting data...");
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${API_KEY}`)
    const weatherData = await response.json();
    console.log("Received data")
    return weatherData;
  } catch(err) {
    console.error(err);
  }
}

function renderWeatherData() {
  locationNameElement.innerText = weatherData.name;
  renderWeatherIcon();
  iconDescriptionElement.innerText = weatherData.weather[0].description;
  renderTemperature()
}

function renderWeatherIcon() {
  while (iconContainer.firstChild) {
    iconContainer.removeChild(iconContainer.firstChild);
  }

  const iconId = weatherData.weather[0].icon;
  console.log(iconId);
  const iconUrl = `http://openweathermap.org/img/wn/${iconId}@2x.png`

  const imgElem = new Image();
  imgElem.src = iconUrl;
  imgElem.alt = "Weather icon"

  iconContainer.appendChild(imgElem);
}

function renderTemperature() {
  const temperatureUnit = temperatureUnitSelector.value || 'c';
  const tempK = weatherData.main.temp;
  let temp;
  if (temperatureUnit == 'c') {
    temp = Math.round(tempK - 273.15);
  } else {
    temp = Math.round(9 / 5 * (tempK - 273.15) + 32);
  }
  
  const tempFormat = new Intl.NumberFormat('en-US', {
    style: 'unit',
    unit: temperatureUnit === 'c' ? 'celsius' : 'fahrenheit'
  })

  temperatureNumberElement.innerText = tempFormat.format(temp);
}

