
import { getWeather, describeWeather } from "./weather.js";
import { initRouter } from "./router.js";

const $ = selector => document.querySelector(selector);
const form = $("#searchForm");
const input = $("#cityInput");
const message = $("#message");

function showForecast(data) {
  $("#forecast").innerHTML = data.daily.time.map((date, i) => {
    const [description, icon] = describeWeather(data.daily.weather_code[i]);
    const day = new Date(`${date}T12:00:00`).toLocaleDateString("en", {
      weekday: "short"
    });

    return `
      <div class="forecast-day">
        <strong>${i === 0 ? "Today" : day}</strong>
        <span role="img" aria-label="${description}">${icon}</span>
        <small>${Math.round(data.daily.temperature_2m_max[i])}° /
        ${Math.round(data.daily.temperature_2m_min[i])}°C</small>
      </div>`;
  }).join("");
}

async function searchWeather(city) {
  message.textContent = "Loading weather information…";
  form.querySelector("button").disabled = true;

  try {
    const { place, data } = await getWeather(city);
    const current = data.current;
    const [description, icon] = describeWeather(current.weather_code);

    $("#location").textContent =
      `${place.name}${place.admin1 ? ", " + place.admin1 : ""}, ${place.country}`;
    $("#temperature").textContent = `${Math.round(current.temperature_2m)}°C`;
    $("#condition").textContent = description;
    $("#weatherIcon").textContent = icon;
    $("#feels").textContent = `${Math.round(current.apparent_temperature)}°C`;
    $("#humidity").textContent = `${current.relative_humidity_2m}%`;
    $("#wind").textContent = `${Math.round(current.wind_speed_10m)} km/h`;

    showForecast(data);
    message.textContent = `Weather updated for ${place.name}.`;
    $("#weather").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    message.textContent = error.message || "Something went wrong. Please try again.";
  } finally {
    form.querySelector("button").disabled = false;
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const city = input.value.trim();
  if (city) searchWeather(city);
});

$("#year").textContent = new Date().getFullYear();
initRouter();
searchWeather("Patna");
