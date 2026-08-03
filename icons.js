// icons.js

export function getWeatherIcon(weatherCode) {

    switch (weatherCode) {
        case 0:
            return "Sunny";
        case 1:
        case 2:
            return "Partly Cloudy";
        case 3:
            return "Cloudy";
        case 61:
        case 62:
        case 63:
        case 64:
        case 65:
            return "Rain";
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
            return "Snow";
        default:
            return "Unknown";
    }

}
export function getWeatherDescription(code) {

    if (code === 0) return "Sunny";

    if (code === 1 || code === 2)
        return "Partly Cloudy";

    if (code === 3)
        return "Cloudy";

    if (code >= 61 && code <= 65)
        return "Rain";

    if (code >= 71 && code <= 75)
        return "Snow";

    return "Unknown";

}