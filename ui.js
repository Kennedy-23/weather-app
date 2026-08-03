// ui.js

import { getWeatherIcon, getWeatherDescription
 } from "./icons.js";

// Display weather and forecast
export function displayWeather(location, weatherData, result, unit) {

    // Location
    const { name, country } = location;

    // Current weather
    const {
    temperature_2m,
    apparent_temperature,
    relative_humidity_2m,
    wind_speed_10m,
    surface_pressure,
    weather_code
} = weatherData.current;

    const weather = getWeatherIcon(weather_code);

    // Today's weather
 result.innerHTML = `
    <h2>${name}, ${country}</h2>

    <h1>${weather}</h1>

    <p>🌡️ Temperature: ${temperature_2m} °C</p>

    <p>🤗 Feels Like: ${apparent_temperature} °C</p>

    <p>💧 Humidity: ${relative_humidity_2m}%</p>

    <p>💨 Wind Speed: ${wind_speed_10m} km/h</p>

    <p>📈 Pressure: ${surface_pressure} hPa</p>
    <p>🌅 Sunrise: ${weatherData.daily.sunrise[0].split("T")[1]}</p>

    <p>🌇 Sunset: ${weatherData.daily.sunset[0].split("T")[1]}</p>

    <h3>5-Day Forecast</h3>

    <div class="forecast-container"></div>
`;

    // Select the forecast container
    const forecastContainer = result.querySelector(
        ".forecast-container"
    );
    // Loop through the forecast days
    for (let i = 0; i < weatherData.daily.time.length; i++) {

        const date = new Date(weatherData.daily.time[i]);
        const description =
    getWeatherDescription(
        weatherData.daily.weather_code[i]
    );

const dayName = date.toLocaleDateString(
    "en-US",
    {
        weekday: "short"
    }
);

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

                <h4>${dayName}</h4>

                <h2>${weatherIcon}</h2>

               <p>High: ${maxTemp}°C</p>
               <p>${description}</p>
               
               <p>Low: ${minTemp}°C</p>

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

    for (const item of cities) {

        const li = document.createElement("li");

        // Handle both old string format and new object format
        const city =
            typeof item === "string"
                ? item
                : item.city;

        const time =
            typeof item === "string"
                ? null
                : item.time;

        const cityName = document.createElement("strong");

        cityName.textContent = city;

        cityName.style.cursor = "pointer";

        cityName.addEventListener("click", function () {

            onCityClick(city);

        });

        li.appendChild(cityName);

        // Show timestamp if available
        if (time) {

            const date = new Date(time);

            const small = document.createElement("small");

            small.style.display = "block";

            small.style.color = "#666";

            small.textContent =
                date.toLocaleString();

            li.appendChild(small);

        }

        // Delete button
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
function convertTemperature(temp, unit) {

    if (unit === "F") {

        return (temp * 9 / 5 + 32).toFixed(1);

    }

    return temp;

}