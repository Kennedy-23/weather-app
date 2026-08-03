// ui.js

import { getWeatherIcon } from "./icons.js";

// Display weather and forecast
export function displayWeather(location, weatherData, result) {

    // Location
    const { name, country } = location;

    // Current weather
    const {
        temperature_2m,
        wind_speed_10m,
        weather_code
    } = weatherData.current;

    const weather = getWeatherIcon(weather_code);

    // Today's weather
    result.innerHTML = `
        <h2>${name}, ${country}</h2>

        <h1>${weather}</h1>

        <p>🌡️ Temperature: ${temperature_2m} °C</p>

        <p>💨 Wind Speed: ${wind_speed_10m} km/h</p>

        <h3>5-Day Forecast</h3>

        <div class="forecast-container"></div>
    `;

    // Select the forecast container
    const forecastContainer =
        result.querySelector(".forecast-container");

    // Loop through the forecast days
    for (let i = 0; i < weatherData.daily.time.length; i++) {

        const date = weatherData.daily.time[i];

        const maxTemp =
            weatherData.daily.temperature_2m_max[i];

        const minTemp =
            weatherData.daily.temperature_2m_min[i];

        const weatherIcon =
            getWeatherIcon(
                weatherData.daily.weather_code[i]
            );

        forecastContainer.innerHTML += `
            <div class="forecast-card">

                <h4>${date}</h4>

                <h2>${weatherIcon}</h2>

                <p>${maxTemp}°C / ${minTemp}°C</p>

            </div>
        `;

    }

}

// Show messages
export function showMessage(result, message) {

    result.textContent = message;

}

// Clear result
export function clearResult(result) {

    result.innerHTML = "";

}

// Display Search History
export function displaySearchHistory(
    history,
    historyList,
    onCityClick
) {

    historyList.innerHTML = "";

    for (const city of history) {

        const li = document.createElement("li");

        li.textContent = city;

        li.addEventListener("click", function () {

            onCityClick(city);

        });

        historyList.appendChild(li);

    }

}

// Display Favorites / City Lists
export function displayCityList(
    cities,
    listElement,
    onCityClick,
    onDeleteClick
) {

    listElement.innerHTML = "";

    for (const city of cities) {

        const li = document.createElement("li");

        const cityName =
            document.createElement("span");

        cityName.textContent = city;

        cityName.style.cursor = "pointer";

        cityName.addEventListener("click", function () {

            onCityClick(city);

        });

        li.appendChild(cityName);

        if (onDeleteClick) {

            const deleteBtn =
                document.createElement("button");

            deleteBtn.textContent = "❌";

            deleteBtn.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    onDeleteClick(city);

                }
            );

            li.appendChild(deleteBtn);

        }

        listElement.appendChild(li);

    }

}
export function updateBackground(weatherCode) {

    const body = document.body;

    // Remove previous weather classes
    body.classList.remove(
        "sunny",
        "partly-cloudy",
        "cloudy",
        "rainy",
        "snowy",
        "default-weather"
    );

    // Weather code to CSS class mapping
    const weatherClasses = {

        0: "sunny",

        1: "partly-cloudy",
        2: "partly-cloudy",

        3: "cloudy",

        61: "rainy",
        63: "rainy",
        65: "rainy",

        71: "snowy",
        73: "snowy",
        75: "snowy"

    };

    // Get the correct class
    const weatherClass =
        weatherClasses[weatherCode] || "default-weather";

    // Apply it
    body.classList.add(weatherClass);

}