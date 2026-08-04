// ui.js

import {
    getWeatherIcon,
    getWeatherDescription
} from "./icons.js";

/* ==========================
   Helper Functions
========================== */

function convertTemperature(temp, unit) {

    if (unit === "F") {

        return (temp * 9 / 5 + 32).toFixed(1);

    }

    return temp;

}

function getUnitSymbol(unit) {

    return unit === "F"
        ? "°F"
        : "°C";

}

function formatTime(dateString) {

    return new Date(dateString).toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}

/* ==========================
   Display Weather
========================== */

export function displayWeather(
    location,
    weatherData,
    result,
    unit
) {

    // Location
    const { name, country } = location;

    // Current Weather
    const {

        temperature_2m,

        apparent_temperature,

        relative_humidity_2m,

        wind_speed_10m,

        surface_pressure,

        weather_code

    } = weatherData.current;

    // Weather icon & description

    const weatherIcon =
        getWeatherIcon(weather_code);

    const description =
        getWeatherDescription(weather_code);

    // Convert temperatures

    const currentTemp =
        convertTemperature(
            temperature_2m,
            unit
        );

    const feelsLike =
        convertTemperature(
            apparent_temperature,
            unit
        );

    // Sunrise & Sunset

    const sunrise =
        formatTime(
            weatherData.daily.sunrise[0]
        );

    const sunset =
        formatTime(
            weatherData.daily.sunset[0]
        );

    // Build HTML

    result.innerHTML = `

        <h2>${name}, ${country}</h2>

        <h1>${weatherIcon}</h1>

        <h3>${description}</h3>

        <div class="weather-info">

            <div class="info-card">

                

                <h3>
                    ${currentTemp}${getUnitSymbol(unit)}
                </h3>

                <p>Temperature</p>

            </div>

            <div class="info-card">


                <h3>
                    ${feelsLike}${getUnitSymbol(unit)}
                </h3>

                <p>Feels Like</p>

            </div>

            <div class="info-card">

               

                <h3>
                    ${relative_humidity_2m}%
                </h3>

                <p>Humidity</p>

            </div>

            <div class="info-card">

                

                <h3>
                    ${wind_speed_10m} km/h
                </h3>

                <p>Wind Speed</p>

            </div>

            <div class="info-card">

                

                <h3>
                    ${surface_pressure} hPa
                </h3>

                <p>Pressure</p>

            </div>

            <div class="info-card">

              

                <h3>${sunrise}</h3>

                <p>Sunrise</p>

            </div>

            <div class="info-card">

               

                <h3>${sunset}</h3>

                <p>Sunset</p>

            </div>

        </div>

        <h3>5-Day Forecast</h3>

        <div class="forecast-container"></div>

        <h3> Temperature Trend</h3>

        <canvas id="weatherChart"></canvas>

    `;

    // Forecast container

    const forecastContainer =
        result.querySelector(
            ".forecast-container"
        );

    // Forecast Loop

    for (
        let i = 0;
        i < weatherData.daily.time.length;
        i++
    ) {

        const day =
            new Date(
                weatherData.daily.time[i]
            );

        const dayName =
            day.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );

        const maxTemp =
            convertTemperature(
                weatherData.daily.temperature_2m_max[i],
                unit
            );

        const minTemp =
            convertTemperature(
                weatherData.daily.temperature_2m_min[i],
                unit
            );

        const icon =
            getWeatherIcon(
                weatherData.daily.weather_code[i]
            );

        const forecastDescription =
            getWeatherDescription(
                weatherData.daily.weather_code[i]
            );

        forecastContainer.innerHTML += `

            <div class="forecast-card">

                <h4>${dayName}</h4>

                <h2>${icon}</h2>

                <p>${forecastDescription}</p>

                <p>
                    High:
                    ${maxTemp}${getUnitSymbol(unit)}
                </p>

                <p>
                    Low:
                    ${minTemp}${getUnitSymbol(unit)}
                </p>

            </div>

        `;

    }

}
/* ==========================
   Show Messages
========================== */

export function showMessage(type, message){

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.className = "";

    toast.classList.add(type);

    toast.classList.add("show");

    setTimeout(function(){

        toast.classList.remove("show");

    },3000);

}

/* ==========================
   Clear Weather Result
========================== */

export function clearResult(result) {

    result.innerHTML = "";

}

/* ==========================
   Display Search History
========================== */

export function displaySearchHistory(
    history,
    historyList,
    onCityClick
) {

    historyList.innerHTML = "";

    for (const item of history) {

        const li = document.createElement("li");

        const city =
            typeof item === "string"
                ? item
                : item.city;

        li.textContent = city;

        li.style.cursor = "pointer";

        li.addEventListener("click", function () {

            onCityClick(city);

        });

        historyList.appendChild(li);

    }

}

/* ==========================
   Display City List
   (Favorites / History)
========================== */

export function displayCityList(
    cities,
    listElement,
    onCityClick,
    onDeleteClick
) {

    listElement.innerHTML = "";

    for (const item of cities) {

        const city =
            typeof item === "string"
                ? item
                : item.city;

        const time =
            typeof item === "string"
                ? null
                : item.time;

        const li = document.createElement("li");

        const left = document.createElement("div");

        left.className = "city-details";

        const cityName =
            document.createElement("strong");

        cityName.textContent = city;

        cityName.style.cursor = "pointer";

        cityName.addEventListener(
            "click",
            function () {

                onCityClick(city);

            }
        );

        left.appendChild(cityName);

        if (time) {

            const small =
                document.createElement("small");

            small.textContent =
                new Date(time).toLocaleString();

            left.appendChild(small);

        }

        li.appendChild(left);

        if (onDeleteClick) {

            const deleteBtn =
                document.createElement("button");

            deleteBtn.textContent = "❌";

            deleteBtn.className =
                "delete-btn";

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
/* ==========================
   Update Background
========================== */

export function updateBackground(weatherCode) {

    const body = document.body;

    // Remove all previous weather classes
    body.classList.remove(

        "sunny",

        "partly-cloudy",

        "cloudy",

        "rainy",

        "snowy",

        "stormy",

        "foggy",

        "default-weather"

    );

    // Weather Code Mapping
    let weatherClass = "default-weather";

    // Sunny
    if (weatherCode === 0) {

        weatherClass = "sunny";

    }

    // Partly Cloudy
    else if (
        weatherCode === 1 ||
        weatherCode === 2
    ) {

        weatherClass = "partly-cloudy";

    }

    // Cloudy
    else if (weatherCode === 3) {

        weatherClass = "cloudy";

    }

    // Fog
    else if (
        weatherCode === 45 ||
        weatherCode === 48
    ) {

        weatherClass = "foggy";

    }

    // Rain
    else if (

        weatherCode >= 51 &&
        weatherCode <= 67

    ) {

        weatherClass = "rainy";

    }

    // Snow
    else if (

        weatherCode >= 71 &&
        weatherCode <= 77

    ) {

        weatherClass = "snowy";

    }

    // Thunderstorm
    else if (

        weatherCode >= 95

    ) {

        weatherClass = "stormy";

    }

    body.classList.add(weatherClass);

}/* ==========================
   Draw Temperature Chart
========================== */

let weatherChart = null;

export function drawChart(weatherData) {

    const labels = weatherData.daily.time.map(day =>
        new Date(day).toLocaleDateString("en-US", {
            weekday: "short"
        })
    );

    const maxTemps = weatherData.daily.temperature_2m_max;
    const minTemps = weatherData.daily.temperature_2m_min;

    const canvas = document.getElementById("weatherChart");

    if (!canvas) return;

    if (weatherChart) {
        weatherChart.destroy();
    }

    weatherChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "Maximum Temperature",
                    data: maxTemps,
                    borderColor: "#ff9800",
                    backgroundColor: "rgba(255,152,0,0.2)",
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                },

                {
                    label: "Minimum Temperature",
                    data: minTemps,
                    borderColor: "#2196f3",
                    backgroundColor: "rgba(33,150,243,0.2)",
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                }

            ]

        },

        options: {

            responsive: true,

            interaction: {
                mode: "index",
                intersect: false
            },

            plugins: {

                legend: {
                    display: true,
                    position: "top"
                },

                title: {
                    display: true,
                    text: "5-Day Temperature Forecast"
                }

            },

            scales: {

                y: {

                    title: {
                        display: true,
                        text: "Temperature (°C)"
                    }

                }

            }

        }

    });

}