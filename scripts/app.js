const API_KEY = import.meta.env.VITE_API_KEY;
console.log('API KEY:', API_KEY);
const BASE_URL = 'https://api.weatherapi.com/v1';

const darkModeBtn = document.getElementById("darkmode-tog-btn");
const cityInput = document.getElementById("city-input");
const currentWeather = document.getElementById("current-weather");
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const toggleBtn = document.getElementById("toggle-btn");
const description = document.getElementById("description");
const forecastSection = document.getElementById("forecast-section");
const forecastContainer = document.getElementById("forecast-container");
const saveFavoriteBtn = document.getElementById("save-favorite-btn");
const favoriteCities = document.getElementById("favorite-cities");
const searchForm = document.querySelector(".search-btn");
const favoritesList = document.querySelector("#favorite-cities ul");

let currentCity = "";
let isCelsius = true;
let celsiusTemp = null;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];


async function fetchCurrentWeather(query) {
    // call the weather api.
    const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${query}`;
    const res = await fetch(url, { method: 'GET' })
    const data = await res.json();
    displayCurrentWeather(data);
}

// async function fetchCurrentWeather(query) {
//     try {
//         const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${query}`;
//         const res = await fetch(url);
//         if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
//         const data = await res.json();
//         displayCurrentWeather(data);
//         fetchForecastWeather(data.location.name);
//     } catch (error) {
//         console.error('Failed to fetch weather:', error.message);
//     }
// }

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
    const tempC = data.current.temp_c;
    const current = data.current;
    currentCity = data.location.name;
    const location = data.location;
    cityName.textContent = `${location.name}, ${location.country}`;
    temperature.textContent = `${tempC}°C`;
    celsiusTemp = tempC;
    description.textContent = current.condition.text;
    weatherIcon.src = `https:${current.condition.icon}`;
    weatherIcon.style.display = 'block';
    currentWeather.classList.remove('hidden');
    currentCity = location.name;
    isCelsius = true;
    toggleBtn.textContent = 'Switch to Fahrenheit';

}


function displayForecastCard(data) {
    forecastContainer.innerHTML = '';
    const days = data.forecast.forecastday;
    days.forEach(day => {
        const card = document.createElement('div');
        card.classList.add('forecast-card');
        const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        const iconUrl = `https:${day.day.condition.icon}`;
        const highTemp = day.day.maxtemp_c;
        const lowTemp = day.day.mintemp_c;
        const conditionText = day.day.condition.text;
        card.innerHTML = `
      <div class="forecast-day">${dayName}</div>
      <img class="forecast-icon" src="${iconUrl}" alt="${conditionText}" />
      <div class="forecast-temp-high">${highTemp}°C</div>
      <div class="forecast-temp-low">${lowTemp}°C</div>
      <div class="forecast-desc">${conditionText}</div>
    `;
        forecastContainer.appendChild(card);
    })
    forecastSection.classList.remove('hidden');
}


async function searchFormSubmission(e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city === '') return;

    try {
        await fetchCurrentWeather(city);
        await fetchForecastWeather(city);
        cityInput.value = '';
    } catch (error) {
        console.error('Search failed:', error.message);
    }

}


function addFavoriteCities() {
  if (currentCity === '') {
    alert('Please search for a city first');
    return;
  }
  const cityToSave = currentCity.trim();
  if (favorites.some(fav => fav.toLowerCase() === cityToSave.toLowerCase())) {
    alert(`${cityToSave} is already in your favorites`);
    return;
  }
  favorites.push(cityToSave);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayFavoriteCities();
}

function removeFavoriteCities(city) {
    favorites = favorites.filter(fav => fav !== city);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavoriteCities();
}


function displayFavoriteCities() {
    favoritesList.innerHTML = '';
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="favorites-empty">No favorites cities yet</p>';
        return;
    }
    favorites.forEach(city => {
        const li = document.createElement('li');
        li.innerHTML = `
      <span class="favorite-city-name">📍 ${city}</span>
      <button class="remove-favorite-btn" data-city="${city}">✕</button>
    `;
        favoritesList.appendChild(li);
    })

}


function loadFavoriteCities(city) {
    fetchCurrentWeather(city);
    fetchForecastWeather(city);
    currentCity = city;

}


function toggleTemperature() {
    if (isCelsius) {
        const fahrenheit = (celsiusTemp * 9 / 5) + 32;
        temperature.textContent = `${fahrenheit.toFixed(1)}°F`;
        toggleBtn.textContent = 'Switch to Celsius';
        isCelsius = false;
    } else {
        temperature.textContent = `${celsiusTemp}°C`;
        toggleBtn.textContent = 'Switch to Fahrenheit';
        isCelsius = true;

    }
}



function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        darkModeBtn.querySelector('.button-icon').textContent = '☀️';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        darkModeBtn.querySelector('.button-icon').textContent = '🌙';
  localStorage.setItem('darkMode', 'disabled');
    }
}


function loadDarkModePreference() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeBtn.querySelector('.button-icon').textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        darkModeBtn.querySelector('.button-icon').textContent = '🌙';
    }
}


window.addEventListener('DOMContentLoaded', async () => {
    console.log("windowscontentloaded");
    loadDarkModePreference();
    await fetchCurrentWeather('6.5244,3.3792');
    displayFavoriteCities();
});

searchForm.addEventListener('submit', searchFormSubmission);

saveFavoriteBtn.addEventListener('click', addFavoriteCities);

favoritesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-favorite-btn')) {
        const city = e.target.dataset.city;
        removeFavoriteCities(city);
    } else if (e.target.classList.contains('favorite-city-name')) {
        const city = e.target.textContent.replace('📍', '').trim();
        loadFavoriteCities(city);
    }

});

toggleBtn.addEventListener('click', toggleTemperature);

darkModeBtn.addEventListener('click', toggleDarkMode);