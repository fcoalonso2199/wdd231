// --- OpenWeatherMap Configurations for Celaya, Guanajuato ---
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const LAT = '20.5218';
const LON = '-100.8146';

const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;
const membersUrl = 'data/members.json';

document.addEventListener('DOMContentLoaded', () => {
  initMenuAndFooter();
  fetchCurrentWeather();
  fetchForecast();
  fetchSpotlights();
});

// --- Navigation Toggle & Footer Metadata ---
function initMenuAndFooter() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  const lastModifiedSpan = document.getElementById('last-modified');
  if (lastModifiedSpan) {
    lastModifiedSpan.textContent = document.lastModified;
  }
}

// --- Fetch & Display Current Weather ---
async function fetchCurrentWeather() {
  try {
    const response = await fetch(currentWeatherUrl);
    if (response.ok) {
      const data = await response.json();
      displayCurrentWeather(data);
    } else {
      throw new Error(`Weather error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching current weather:', error);
    const descEl = document.getElementById('weather-desc');
    if (descEl) descEl.textContent = 'Weather unavailable';
  }
}

function displayCurrentWeather(data) {
  const tempEl = document.getElementById('current-temp');
  const descEl = document.getElementById('weather-desc');
  const iconEl = document.getElementById('weather-icon');

  const temp = Math.round(data.main.temp);
  const desc = data.weather[0].description;
  const iconCode = data.weather[0].icon;

  if (tempEl) tempEl.textContent = temp;
  if (descEl) descEl.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
  if (iconEl) {
    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconEl.alt = desc;
  }
}

// --- Fetch & Display 3-Day Forecast ---
async function fetchForecast() {
  try {
    const response = await fetch(forecastUrl);
    if (response.ok) {
      const data = await response.json();
      displayForecast(data);
    }
  } catch (error) {
    console.error('Error fetching forecast data:', error);
  }
}

function displayForecast(data) {
  const container = document.getElementById('weather-forecast');
  if (!container) return;
  container.innerHTML = '';

  // Filter 3 forecast points around 12:00 PM for distinct consecutive days
  const dailyEntries = data.list
    .filter(item => item.dt_txt.includes('12:00:00'))
    .slice(0, 3);

  dailyEntries.forEach(entry => {
    const date = new Date(entry.dt_txt);
    const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
    const temp = Math.round(entry.main.temp);

    const card = document.createElement('div');
    card.className = 'forecast-day';
    card.innerHTML = `
      <p class="forecast-label">${dayLabel}</p>
      <p class="forecast-temp">${temp}°C</p>
    `;
    container.appendChild(card);
  });
}

// --- Fetch & Display Random Gold/Silver Member Spotlights ---
async function fetchSpotlights() {
  try {
    const response = await fetch(membersUrl);
    if (response.ok) {
      const members = await response.json();
      
      // Filter members with Gold/Silver status (or numeric levels 2 & 3)
      const qualified = members.filter(m => {
        const level = String(m.membership || m.membershipLevel).toLowerCase();
        return level === 'gold' || level === 'silver' || level === '3' || level === '2';
      });

      // Randomly pick 2 or 3 members
      const count = Math.min(qualified.length, 3);
      const shuffled = [...qualified].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);

      renderSpotlights(selected);
    }
  } catch (error) {
    console.error('Error fetching spotlight members:', error);
  }
}

function renderSpotlights(members) {
  const container = document.getElementById('spotlight-cards');
  if (!container) return;
  container.innerHTML = '';

  members.forEach(member => {
    const levelText = member.membership ? member.membership : (member.membershipLevel === 3 ? 'Gold' : 'Silver');
    
    const card = document.createElement('article');
    card.className = 'card spotlight-card';
    card.innerHTML = `
      <span class="spotlight-badge badge-${levelText.toLowerCase()}">${levelText} Member</span>
      <h3>${member.name}</h3>
      <div class="spotlight-logo-wrapper">
        <img src="${member.image || member.logo || 'images/placeholder-logo.png'}" alt="${member.name} logo" loading="lazy">
      </div>
      <p class="spotlight-phone">📞 ${member.phone}</p>
      <p class="spotlight-address">📍 ${member.address}</p>
      <a href="${member.website}" target="_blank" rel="noopener" class="spotlight-link">Visit Website</a>
    `;
    container.appendChild(card);
  });
}