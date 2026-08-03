// ==========================
// Imports
// ==========================
import {
    getLocation,
    getWeather,
    getWeatherFromCoords,
    getLocationFromCoords
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

// ==========================
// Variables
// ==========================
let currentCity = "";

let searchHistory =
    JSON.parse(localStorage.getItem("history")) || [];

let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

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
searchBtn.addEventListener(
    "click",
    searchCity
);

locationBtn.addEventListener(
    "click",
    getCurrentLocation
);

favoriteBtn.addEventListener(
    "click",
    addFavorite
);

cityInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchCity();

        }

    }
);

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

    if (!searchHistory.includes(city)) {

        searchHistory.push(city);

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