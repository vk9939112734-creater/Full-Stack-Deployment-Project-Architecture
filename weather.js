
const weatherCodes = {
  0: ["Clear sky", "☀️"],
  1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"],
  48: ["Fog", "🌫️"],
  51: ["Light drizzle", "🌦️"],
  61: ["Rain", "🌧️"],
  63: ["Moderate rain", "🌧️"],
  65: ["Heavy rain", "🌧️"],
  71: ["Snow", "🌨️"],
  80: ["Rain showers", "🌦️"],
  95: ["Thunderstorm", "⛈️"]
};

export async function getWeather(city) {
  const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geoUrl.search = new URLSearchParams({
    name: city, count: "1", language: "en", format: "json"
  });

  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) throw new Error("Could not search for this city.");
  const geo = await geoResponse.json();
  const place = geo.results?.[0];

  if (!place) throw new Error("City not found. Check the spelling and try again.");

  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.search = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "5"
  });

  const response = await fetch(weatherUrl);
  if (!response.ok) throw new Error("Weather service is temporarily unavailable.");
  const data = await response.json();

  return { place, data };
}

export function describeWeather(code) {
  return weatherCodes[code] || ["Weather conditions", "🌡️"];
}
