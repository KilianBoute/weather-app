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

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const getLocationList = (location) => {
    fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + location + "&count=10&language=en&format=json")
        .then(response => response.json())
            .then(data => {
                data.results.forEach(city => {
                   displayLocations(city);
                   return true;
                });
            })
            .catch(error => {
                console.log(error);
                return false;
            });
}

const displayLocations = (location) => {
    const locationItem = document.createElement('div');
    locationItem.textContent = location.name + " in " + location.admin1 + ", " + location.country;
    locationItem.classList.add("location-item");
    locationItem.classList.add("card");
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
   
    for(i = 0; i < locationData.temperature_2m_max.length; i++){
        const dailyInfo = document.createElement('span');
            dailyInfo.classList.add('daily-info');
            dailyInfo.classList.add("card");
        const dailyInfoDate = document.createElement('p');
        let timeDate = new Date(locationData.time[i]);
            dailyInfoDate.textContent = weekdays[timeDate.getDay()];
        const dailyInfoMeanTemp = document.createElement('p');
            let meanTemp = (locationData.temperature_2m_max[i] + locationData.temperature_2m_min[i])/2;
            dailyInfoMeanTemp.textContent = "°C " + meanTemp.toFixed(2);
        dailyInfo.appendChild(dailyInfoDate);
        dailyInfo.appendChild(dailyInfoMeanTemp);
        weatherItem.appendChild(dailyInfo);
    }
    // weatherItem.textContent = locationData.temperature_2m_max;
    weatherDisplay.appendChild(weatherItem);
}

searchBarForm.addEventListener('submit', (e) => {
    e.preventDefault();
    weatherDisplay.innerHTML = locationDisplay.innerHTML = "";
    getLocationList(searchInput.value);
})

searchBarForm.addEventListener('keyup', (e) => {
    e.preventDefault();
    weatherDisplay.innerHTML = locationDisplay.innerHTML = "";
    if(getLocationList(searchInput.value)){
    getLocationList(searchInput.value);
    }
})
