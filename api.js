// api.js

// ==========================
// Geocoding API URL
// ==========================
function getGeoUrl(city) {

    return `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

}

// ==========================
// Reverse Geocoding API URL
// ==========================
function getReverseGeoUrl(latitude, longitude) {

    return `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1`;

}

// ==========================
// Weather API URL
// ==========================
function getWeatherUrl(location) {

    return `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`;

}

// ==========================
// Weather URL from Coordinates
// ==========================
function getWeatherCoordsUrl(latitude, longitude) {

    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`;

}

// ==========================
// Get Location by City Name
// ==========================
export async function getLocation(city) {

    const response = await fetch(getGeoUrl(city));

    if (!response.ok) {

        throw new Error("Failed to fetch location.");

    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {

        throw new Error("City not found.");

    }

    return data.results[0];

}

// ==========================
// Get Location from Coordinates
// ==========================
export async function getLocationFromCoords(latitude, longitude) {

    const response = await fetch(
        getReverseGeoUrl(latitude, longitude)
    );

    if (!response.ok) {

        throw new Error("Failed to fetch location.");

    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {

        throw new Error("Location not found.");

    }

    return data.results[0];

}

// ==========================
// Get Weather by Location Object
// ==========================
export async function getWeather(location) {

    const response = await fetch(
        getWeatherUrl(location)
    );

    if (!response.ok) {

        throw new Error("Failed to fetch weather.");

    }

    return await response.json();

}

// ==========================
// Get Weather by Coordinates
// ==========================
export async function getWeatherFromCoords(latitude, longitude) {

    const response = await fetch(
        getWeatherCoordsUrl(latitude, longitude)
    );

    if (!response.ok) {

        throw new Error("Failed to fetch weather.");

    }

    return await response.json();

}