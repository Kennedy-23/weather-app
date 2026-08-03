// icons.js

export function getWeatherIcon(weatherCode) {

    switch (weatherCode) {

        case 0:
            return "🌤️";

        case 1:
        case 2:
            return "🌤️";

        case 3:
            return "☁️";

        case 45:
        case 48:
            return "🌫️";

        case 51:
        case 53:
        case 55:
            return "Drizzle";

        case 61:
        case 63:
        case 65:
            return "🌧️";

        case 71:
        case 73:
        case 75:
            return "❄️";

        case 95:
            return "⛈️";

        default:
            return "❓";
    }

}