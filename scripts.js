// TODO
// -Add eventlisteners to form. $$$
// -Call api for input location
//      -Add error catches
//      -Add list with possible locations for input name
// -Call api for weather data for location
// -Create elements in DOM to display weather information
// -Make them asynchronous

const main = document.querySelector('main');
const searchBarForm = document.querySelector("#search-bar");
const searchInput = document.querySelector('#search-input');
const locationDisplay = document.querySelector('#location-display');
const weatherDisplay = document.querySelector('#weather-display');


searchBarForm.addEventListener('submit', (e) => {
    e.preventDefault();
    weatherDisplay.innerHTML = locationDisplay.innerHTML = "";
    getLocationList(searchInput.value);
})

const getLocationList = (location) => {
    fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + location + "&count=10&language=en&format=json")
        .then(response => response.json())
            .then(data => {
                data.results.forEach(city => {
                   displayLocations(city);
                });
            })
            .catch(error => {
                searchInput.value = "ERROR";
            });
}

const displayLocations = (location) => {
    const locationItem = document.createElement('div');
    locationItem.textContent = location.name + " in " + location.admin1 + ", " + location.country;
    locationItem.longitude = location.longitude;
    locationItem.latitude = location.latitude;
    locationItem.timeZone = location.timezone;
    locationItem.addEventListener('click', () => {
        weatherDisplay.innerHTML = locationDisplay.innerHTML = "";
        console.log(locationItem.longitude + " " + locationItem.latitude + " " + locationItem.timeZone);
        getWeatherForLocation(locationItem.longitude, locationItem.latitude, locationItem.timeZone);
    })
    locationDisplay.appendChild(locationItem);
}

const getWeatherForLocation = (longitude, latitude) => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" 
    + longitude + "&daily=temperature_2m_max,temperature_2m_min&timezone=auto")
        .then(response => response.json())
            .then(data => {
                console.log(data.daily);
                displayWeatherForLocation(data.daily);
            });
}

const displayWeatherForLocation = (locationData) => {
    const weatherItem = document.createElement("div");
    console.log(weatherDisplay + " en " + weatherItem) 
    weatherItem.textContent = locationData.temperature_2m_max;
    weatherDisplay.appendChild(weatherItem);
}