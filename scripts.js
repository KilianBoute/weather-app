// TODO
// -Add eventlisteners to form. $$$
// -Call api for input location $$$
//      -Add error catches $$$
//      -Add list with possible locations for input name $$$
// -Call api for weather data for location $$$
// -Create elements in DOM to display weather information
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
    fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + location + "&count=10&language=en&format=json")
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
            return false;
        });
}

const displayLocations = (location) => {
    locationDisplay.style.display = "flex";
    const locationItem = document.createElement('div');
    locationItem.textContent = location.name + " in " + location.admin1 + ", " + location.country;
    locationItem.classList.add("location-item");
    locationItem.longitude = location.longitude;
    locationItem.latitude = location.latitude;
    locationItem.timeZone = location.timezone;
    locationItem.addEventListener('click', () => {
        locationInfo.innerHTML = "";
        cardContainer.innerHTML = "";
        locationDisplay.style.display = "none";
        console.log(locationItem.longitude + " " + locationItem.latitude + " " + locationItem.timeZone);
        getWeatherForLocation(locationItem.longitude, locationItem.latitude, locationItem.timeZone);
    })
    locationDisplay.appendChild(locationItem);
}

const getWeatherForLocation = (longitude, latitude) => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude="
        + longitude + "&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto")
        .then(response => response.json())
        .then(data => {
            console.log(data.daily);
            displayWeatherForLocation(data.daily);
        });
}

const displayWeatherForLocation = (locationData) => {
    console.log(locationData)

    const locationHeader = document.createElement('h1');
        locationHeader.textContent = "GHENT";
    const locationArea = document.createElement('h3');
        locationArea.textContent = "testext"

    locationInfo.appendChild(locationHeader);
    locationInfo.appendChild(locationArea);

    for (let i = 0; i < locationData.temperature_2m_max.length; i++) {
        const cardElement = document.createElement('div');
            cardElement.className = "card";
        const cardDay = document.createElement('h3');
        let timeDate = new Date(locationData.time[i]);
            cardDay.textContent = weekdays[timeDate.getDay()];
            
        const cardImage = document.createElement('img');
        const imgSrc = weatherCodes[locationData.weather_code[i]].day.image;
            cardImage.src = imgSrc;

        const cardTemp = document.createElement('span');
        let meanTemp = (locationData.temperature_2m_max[i] + locationData.temperature_2m_min[i]) / 2;
            cardTemp.textContent = "°C " + meanTemp.toFixed(2);
       

        cardElement.appendChild(cardDay);
        cardElement.appendChild(cardImage);
        cardElement.appendChild(cardTemp)
        cardContainer.appendChild(cardElement);

    }
    // weatherItem.textContent = locationData.temperature_2m_max;
}

async function getWeatherOnSubmit(location) {
    const response = await fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + location + "&count=10&language=en&format=json")
    const data = await response.json();
    locationDisplay.style.display = "none";
    getWeatherForLocation(data.results[0].longitude, data.results[0].latitude);
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
