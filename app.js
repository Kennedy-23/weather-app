// ==========================
// Imports
// ==========================
import {
    getLocation,
    getWeather,
    getWeatherFromCoords,
    getLocationFromCoords,
    searchCities
} from "./api.js";

import {
    displayWeather,
    showMessage,
    displayCityList,
    updateBackground
} from "./ui.js";

// ==========================
// DOM Elements
// ==========================
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const result = document.getElementById("result");
const historyList = document.getElementById("history");
const favoriteBtn = document.getElementById("favoriteBtn");
const favoritesList = document.getElementById("favorites");
const themeBtn = document.getElementById("themeBtn");
const savedTheme = localStorage.getItem("theme");
const suggestions = document.getElementById("suggestions");
const unitBtn = document.getElementById("unitBtn");

if(savedTheme === "dark"){
    document.body.classList.add("dark");
    themeBtn.textContent ="Light Mode";
}
// ==========================
// Variables
// ==========================
let currentCity = "";
let debounceTimer;
let searchHistory = JSON.parse(localStorage.getItem("history")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let temperatureUnit = localStorage.getItem("unit") || "C";

// ==========================
// Display Saved Data
// ==========================
displayCityList(
    searchHistory,
    historyList,
    loadHistoryCity
);

displayCityList(
    favorites,
    favoritesList,
    loadFavoriteCity,
    removeFavorite
);

// ==========================
// Event Listeners
// ==========================
searchBtn.addEventListener("click", searchCity );
locationBtn.addEventListener("click", getCurrentLocation);
favoriteBtn.addEventListener("click", addFavorite);
themeBtn.addEventListener("click",toggleTheme);
cityInput.addEventListener("input",showSuggestions);
unitBtn.addEventListener("click",toggleUnit);
cityInput.addEventListener( "keydown",function (event) {
 if (event.key === "Enter") {
     searchCity(); } } );

// ==========================
// Search City
// ==========================
async function searchCity() {

    try {

        const city = cityInput.value.trim();

        if (city === "") {

            showMessage(
                result,
                "Please enter a city."
            );

            return;

        }

        showMessage(
            result,
            "Loading weather..."
        );

        const location =
            await getLocation(city);

        currentCity = location.name;

        const weatherData =
            await getWeather(location);

        displayWeather(
            location,
            weatherData,
            result
        );

        updateBackground(
            weatherData.current.weather_code
        );

        saveSearch(currentCity);

        cityInput.value = "";

        cityInput.focus();

    }

    catch (error) {

        console.error(error);

        showMessage(
            result,
            error.message
        );

    }

}
// ==========================
// Current Location Weather
// ==========================
async function getCurrentLocation() {

    if (!navigator.geolocation) {

        showMessage(
            result,
            "Geolocation is not supported by your browser."
        );

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async function (position) {

            try {

                showMessage(
                    result,
                    "Getting your location..."
                );

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                // Get city name
                const location =
                    await getLocationFromCoords(
                        latitude,
                        longitude
                    );

                // Get weather
                const weatherData =
                    await getWeatherFromCoords(
                        latitude,
                        longitude
                    );

                currentCity = location.name;

                displayWeather(
                    location,
                    weatherData,
                    result
                );

                updateBackground(
                    weatherData.current.weather_code
                );

                saveSearch(currentCity);

            }

            catch (error) {

                console.error(error);

                showMessage(
                    result,
                    error.message
                );

            }

        },

        function () {

            showMessage(
                result,
                "Location permission denied."
            );

        }

    );

}

// ==========================
// Save Search History
// ==========================
function saveSearch(city) {

    // Remove duplicate if it already exists
    searchHistory = searchHistory.filter(function(item){

        return item.city !== city;

    });

    // Add the newest search at the top
    searchHistory.unshift({

        city: city,

        time: new Date().toISOString()

    });

    // Keep only the last 10 searches
    if(searchHistory.length > 10){

        searchHistory.pop();

    }

    localStorage.setItem(

        "history",

        JSON.stringify(searchHistory)

    );

    displayCityList(

        searchHistory,

        historyList,

        loadHistoryCity

    );

}
// ==========================
// Load City From History
// ==========================
function loadHistoryCity(city) {

    cityInput.value = city;

    searchCity();

}

// ==========================
// Add Favourite
// ==========================
function addFavorite() {

    if (currentCity === "") {

        return;

    }

    if (!favorites.includes(currentCity)) {

        favorites.push(currentCity);

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

        displayCityList(
            favorites,
            favoritesList,
            loadFavoriteCity,
            removeFavorite
        );

    }

}

// ==========================
// Load Favourite
// ==========================
function loadFavoriteCity(city) {

    cityInput.value = city;

    searchCity();

}

// ==========================
// Remove Favourite
// ==========================
function removeFavorite(city) {

    favorites = favorites.filter(function (item) {

        return item !== city;

    });

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    displayCityList(
        favorites,
        favoritesList,
        loadFavoriteCity,
        removeFavorite
    );

}
async function showSuggestions() {

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async function () {

        const text = cityInput.value.trim();

        if (text.length < 2) {

            suggestions.innerHTML = "";

            return;

        }

        const cities = await searchCities(text);

        suggestions.innerHTML = "";

        for (const city of cities) {

            const li = document.createElement("li");

            li.textContent =
                `${city.name}, ${city.country}`;

            li.addEventListener("click", function () {

                cityInput.value = city.name;

                suggestions.innerHTML = "";

            });

            suggestions.appendChild(li);

        }

    }, 300);

}
function toggleTheme(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        themeBtn.textContent =
            "☀️ Light Mode";

        localStorage.setItem(
            "theme",
            "dark"
        );

    }else{

        themeBtn.textContent =
            "Dark Mode";

        localStorage.setItem(
            "theme",
            "light"
        );

    }

}
function toggleUnit() {

    if (temperatureUnit === "C") {

        temperatureUnit = "F";

    } else {
        temperatureUnit = "C";
    }
    localStorage.setItem(
        "unit",
        temperatureUnit
    );
    unitBtn.textContent =
        `°${temperatureUnit}`;
}