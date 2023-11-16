// TODO
// -Add eventlisteners to form. $$$
// -Call api for input location $$$
//      -Add error catches $$$
//      -Add list with possible locations for input name $$$
// -Call api for weather data for location $$$
// -Create elements in DOM to display weather information $$$
// -Make them asynchronous $

import { weatherCodes as weatherCodes } from "./codes.js";

const main = document.querySelector('main');
const searchBarForm = document.querySelector("#search-bar");
const searchInput = document.querySelector('#search-input');
const locationDisplay = document.querySelector('#location-display');
const weatherDisplay = document.querySelector('#weather-display');
const locationInfo = document.querySelector('#locationInfo');
const cardContainer = document.querySelector('#cards-container');

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];



const getLocationList = (location) => {
    fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + location + "&count=20&language=en&format=json")
        .then(response => response.json())
        .then(data => {
            locationDisplay.innerHTML = "";
            data.results.forEach(city => {
                displayLocations(city);
                return true;
            });
        })
        .catch(error => {
            console.log(error);
            locationDisplay.style.display = "none";
            searchBarForm.style.borderRadius = "1rem";
            return false;
        });
}

const displayLocations = (location) => {
    locationDisplay.style.display = "flex";
    const locationDiv = document.createElement('div');
        locationDiv.className = "location-item";
    const locationFlag = document.createElement('img');
        locationFlag.src = "https://hatscripts.github.io/circle-flags/flags/" + location.country_code.toLowerCase() + ".svg";
        locationFlag.className = 'location-flag';
        console.log(locationFlag.src)

    locationDiv.appendChild(locationFlag);

    const locationItem = document.createElement('span');
    locationItem.textContent += location.name + " in " + location.admin1 + ", " + location.country;
  
    locationItem.longitude = location.longitude;
    locationItem.latitude = location.latitude;
    locationItem.timeZone = location.timezone;
    locationItem.name = location.name;
    locationItem.area = location.admin1;
    locationItem.country = location.country;
    searchBarForm.style.borderRadius = "1rem 1rem 0 0";

    locationDiv.appendChild(locationItem);
    locationItem.addEventListener('click', () => {
        locationInfo.innerHTML = "";
        cardContainer.innerHTML = "";
        locationDisplay.style.display = "none";
        searchBarForm.style.borderRadius = "1rem";
        console.log("test");
        getWeatherForLocation(locationItem.longitude, locationItem.latitude, locationItem.name, locationItem.area, locationItem.country);
    })
    locationDisplay.appendChild(locationDiv);
}

const getWeatherForLocation = (longitude, latitude, name, area, country) => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude="+ longitude + 
    "&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto")
        .then(response => response.json())
        .then(data => {
            displayWeatherForLocation(data, name, area, country);
        });
}

const displayWeatherForLocation = (locationData, name, area, country) => {

    const locationHeader = document.createElement('h1');
        locationHeader.textContent = name;
    const locationArea = document.createElement('h3');
        locationArea.textContent = area + " " + country;

    locationInfo.appendChild(locationHeader);
    locationInfo.appendChild(locationArea);

    for (let i = 0; i < locationData.daily.time.length; i++) {
        const cardElement = document.createElement('div');
            cardElement.className = "card";
            cardElement.selected = false;
        const cardDay = document.createElement('h3');
        let timeDate = new Date(locationData.daily.time[i]);
            if(i === 0){cardDay.textContent = "Today";}
            else {cardDay.textContent = weekdays[timeDate.getDay()];}
            
        const cardImage = document.createElement('img');
        const imgSrc = weatherCodes[locationData.daily.weather_code[i]].day.image;
            cardImage.src = imgSrc;

        const cardDesc = document.createElement('span');
            cardDesc.textContent = weatherCodes[locationData.daily.weather_code[i]].day.description;

        const cardTemp = document.createElement('span');
        let meanTemp = (locationData.daily.temperature_2m_max[i] + locationData.daily.temperature_2m_min[i]) / 2;
            cardTemp.textContent =meanTemp.toFixed(2) + "°C ";
       
        cardElement.appendChild(cardDay);
        cardElement.appendChild(cardImage);
        cardElement.appendChild(cardDesc);
        cardElement.appendChild(cardTemp);

        cardElement.hourly = locationData.hourly;
        cardElement.addEventListener('click', () => {

            cardContainer.childNodes.forEach(element => {
                if(element.selected === true) {
                    element.selected = false;
                    element.classList.remove('selected');
                }
            });
            cardElement.selected = true;
            cardElement.classList.add('selected');
            const removeDisplay = document.getElementById('hoursOfDay');
            if(removeDisplay){
                cardContainer.removeChild(removeDisplay);
            }
            cardContainer.appendChild(displayHourlyWeather(locationData, i));
            
        })
        cardContainer.appendChild(cardElement);
 
    }

    // weatherItem.textContent = locationData.temperature_2m_max;
}

const displayHourlyWeather = (locationData, index) => {
    console.log(locationData);

    const hourlyDisplay = document.createElement('div');
    hourlyDisplay.classList.add('hidden');
    hourlyDisplay.classList.add('hour-display');
    let h = 0;
    for(let i = index*24; i < (index+1)*24; i++){
     
        const hourDiv = document.createElement('div');
            hourDiv.classList.add('hour-card');
        const hourDivTime = document.createElement('span');
            hourDivTime.textContent = locationData.hourly.time[i].substring(11);
        const hourDivIcon = document.createElement('img');
            hourDivIcon.src = (h<20 && h>5) ? weatherCodes[locationData.hourly.weather_code[i]].night.image : weatherCodes[locationData.hourly.weather_code[i]].day.image;
            
        const hourDivTemp = document.createElement('span');
            hourDivTemp.textContent = locationData.hourly.temperature_2m[i] + "°C";

        hourDiv.appendChild(hourDivTime);
        hourDiv.appendChild(hourDivIcon);
        hourDiv.appendChild(hourDivTemp);
        hourlyDisplay.appendChild(hourDiv);
        hourlyDisplay.id = 'hoursOfDay';

        h++;
    }
    return hourlyDisplay;
}

async function getWeatherOnSubmit(location) {
    const response = await fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + location + "&count=10&language=en&format=json")
    const data = await response.json();
    locationDisplay.style.display = "none";
    searchBarForm.style.borderRadius = "1rem";
    locationInfo.innerHTML = "";
    cardContainer.innerHTML = "";
    getWeatherForLocation(data.results[0].longitude, data.results[0].latitude, data.results[0].name, data.results[0].admin1, data.results[0].country);
}

searchBarForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // locationInfo.innerHTML = "";
    // cardContainer.innerHTML = "";
    // locationDisplay.innerHTML = "";
    getWeatherOnSubmit(searchInput.value);
})

searchBarForm.addEventListener('keyup', (e) => {
    if (e.key !== "Enter") {
        e.preventDefault();
    //     locationInfo.innerHTML = "";
    //     cardContainer.innerHTML = "";
    //    locationDisplay.innerHTML = "";
        if (getLocationList(searchInput.value)) {
            getLocationList(searchInput.value);
        }
    }
})

 getWeatherOnSubmit("Ghent");

const getGeoLocation = () => {
// Check if geolocation is supported by the browser
if ("geolocation" in navigator) {
    // Prompt user for permission to access their location
    navigator.geolocation.getCurrentPosition(
      // Success callback function
      (position) => {
        // Get the user's latitude and longitude coordinates
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
  
        // Do something with the location data, e.g. display on a map
        console.log(`Latitude: ${lat}, longitude: ${lng}`);
        locationInfo.innerHTML = "";
        cardContainer.innerHTML = "";
        getWeatherForLocation(lng, lat, "Current location", "", "");
      },
      // Error callback function
      (error) => {
        // Handle errors, e.g. user denied location sharing permissions
        console.error("Error getting user location:", error);
        getWeatherOnSubmit("Ghent");
      }
    );
  } else {
    // Geolocation is not supported by the browser
    console.error("Geolocation is not supported by this browser.");
    getWeatherOnSubmit("Ghent");
  }
}

//getGeoLocation();