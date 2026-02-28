const API_KEY = '26ee0c604e454706b23113013262602';
const BASE_URL = 'https://api.weatherapi.com/v1';

const darkModeBtn = document.getElementById("darkmode-tog-btn");
const cityInput = document.getElementById("city-input");
const currentWeather = document.getElementById(id = "current-weather");
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const toggleBtn = document.getElementById("toggle-btn");
const description = document.getElementById("description");
const forecastSection = document.getElementById("forecast-section");
const forecastContainer = document.getElementById("forecast-container");
const saveFavoriteBtn = document.getElementById("save-favorite-btn");
const favoriteCities = document.getElementById("favorite-cities");
const searchBtn = document.querySelector(".search-btn");
const favoritesList = document.querySelector("#favorite-cities ul");

let currentCity = "";
let isCelsius = true;
let celsiusTemp = null;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];


async function fetchCurrentWeather(lat, lon) {
    // call the weather api.
    const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}`;
    const res = await fetch(url, { method: 'GET' })
    const data = await res.json();
    displayCurrentWeather(data);
}


async function fetchForecastWeather(city) {
    try {
        const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log(data);
        displayForecastCard(data);

    } catch (error) {
        console.error('Failed to fetch forecast:', error.message);
    }
}


function displayCurrentWeather(data) {
    const current = data.current;
    const location = data.location;
    cityName.textContent = `${location.name}, ${location.country}`;
    temperature.textContent = `${current.temp_c}°C`;
    celsiusTemp = current.temp_c;
    description.textContent = current.condition.text;
    weatherIcon.src = `https:${current.condition.icon}`;
    weatherIcon.style.display = 'block';
    currentWeather.classList.remove('hidden');
    currentCity = location.name;

}


function displayForecastCard(data) {

}


function searchFormSubmission() {

}


window.addEventListener('DOMContentLoaded', async () => {
    console.log("windowscontentloaded");
    await fetchCurrentWeather(6.5244, 3.3792);
})