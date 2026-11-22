"use strict";

// Weather data comes from Open-Meteo (free, no API key required).
const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const statusEl = document.getElementById("status");
const currentCard = document.getElementById("current-card");
const forecastSection = document.getElementById("forecast-section");
const forecastGrid = document.getElementById("forecast-grid");

// WMO weather codes -> Indonesian description + symbol.
const WEATHER_CODES = {
  0: ["Cerah", "☀"],
  1: ["Sebagian besar cerah", "🌤"],
  2: ["Berawan sebagian", "⛅"],
  3: ["Mendung", "☁"],
  45: ["Berkabut", "🌫"],
  48: ["Kabut tebal", "🌫"],
  51: ["Gerimis ringan", "🌦"],
  53: ["Gerimis", "🌦"],
  55: ["Gerimis lebat", "🌦"],
  61: ["Hujan ringan", "🌧"],
  63: ["Hujan sedang", "🌧"],
  65: ["Hujan lebat", "🌧"],
  66: ["Hujan beku ringan", "🌧"],
  67: ["Hujan beku lebat", "🌧"],
  71: ["Salju ringan", "🌨"],
  73: ["Salju sedang", "🌨"],
  75: ["Salju lebat", "🌨"],
  77: ["Butiran salju", "🌨"],
  80: ["Hujan lokal ringan", "🌦"],
  81: ["Hujan lokal sedang", "🌦"],
  82: ["Hujan lokal lebat", "🌦"],
  85: ["Salju lokal ringan", "🌨"],
  86: ["Salju lokal lebat", "🌨"],
  95: ["Badai petir", "⛈"],
  96: ["Badai petir + hujan es", "⛈"],
  99: ["Badai petir + hujan es lebat", "⛈"],
};

function describe(code) {
  return WEATHER_CODES[code] || ["Tidak diketahui", "·"];
}

function setStatus(text) {
  statusEl.textContent = text;
}

async function loadWeather(city) {
  setStatus("Mencari kota " + city + "…");
  currentCard.hidden = true;
  forecastSection.hidden = true;
  try {
    const geoRes = await fetch(
      "https://geocoding-api.open-meteo.com/v1/search?count=1&language=id&name=" +
        encodeURIComponent(city)
    );
    if (!geoRes.ok) throw new Error("geocoding failed");
    const geo = await geoRes.json();
    if (!geo.results || !geo.results.length) {
      setStatus("Kota \"" + city + "\" tidak ditemukan. Coba ejaan lain, misalnya nama kota dalam bahasa Inggris.");
      return;
    }
    const place = geo.results[0];
    const label = [place.name, place.admin1, place.country]
      .filter(Boolean)
      .join(", ");

    const wxRes = await fetch(
      "https://api.open-meteo.com/v1/forecast?timezone=auto" +
        "&latitude=" + place.latitude +
        "&longitude=" + place.longitude +
        "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m" +
        "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
    );
    if (!wxRes.ok) throw new Error("forecast failed");
    const wx = await wxRes.json();

    const cur = wx.current;
    const [desc] = describe(cur.weather_code);
    document.getElementById("current-city").textContent = label;
    document.getElementById("current-temp").textContent = Math.round(cur.temperature_2m);
    document.getElementById("current-desc").textContent = desc;
    document.getElementById("detail-feels").textContent = Math.round(cur.apparent_temperature) + "°C";
    document.getElementById("detail-humidity").textContent = cur.relative_humidity_2m + "%";
    document.getElementById("detail-wind").textContent = Math.round(cur.wind_speed_10m) + " km/jam";
    document.getElementById("detail-tz").textContent = wx.timezone || "—";
    currentCard.hidden = false;

    forecastGrid.innerHTML = "";
    const daily = wx.daily;
    for (let i = 0; i < daily.time.length; i++) {
      const [dDesc, dSymbol] = describe(daily.weather_code[i]);
      const dayName = new Date(daily.time[i] + "T00:00:00").toLocaleDateString("id-ID", { weekday: "short" });
      const dateLabel = new Date(daily.time[i] + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      const card = document.createElement("article");
      card.className = "forecast-card" + (i === 0 ? " forecast-today" : "");
      const rain = daily.precipitation_probability_max
        ? daily.precipitation_probability_max[i]
        : null;
      card.innerHTML =
        '<p class="fc-day"></p>' +
        '<p class="fc-symbol"></p>' +
        '<p class="fc-desc"></p>' +
        '<p class="fc-temp"></p>' +
        '<p class="fc-rain"></p>';
      card.querySelector(".fc-day").textContent = (i === 0 ? "Hari ini" : dayName) + " · " + dateLabel;
      card.querySelector(".fc-symbol").textContent = dSymbol;
      card.querySelector(".fc-desc").textContent = dDesc;
      card.querySelector(".fc-temp").textContent =
        Math.round(daily.temperature_2m_max[i]) + "° / " + Math.round(daily.temperature_2m_min[i]) + "°";
      card.querySelector(".fc-rain").textContent =
        rain === null || rain === undefined ? "" : "Peluang hujan " + rain + "%";
      forecastGrid.appendChild(card);
    }
    forecastSection.hidden = false;
    setStatus("");
  } catch (err) {
    setStatus("Gagal memuat data cuaca. Periksa koneksi internet, lalu coba lagi.");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = input.value.trim();
  if (city) loadWeather(city);
});

loadWeather("Jakarta");
