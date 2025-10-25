// ==================== API CONFIGURATION ====================
// OpenWeatherMap API Key - Replace with your own API key
const API_KEY = '1e101d6d48322ccbdd677d57ed286f64'; // Get free API key from https://openweathermap.org/api
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ==================== DOM ELEMENTS ====================
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const themeToggle = document.getElementById('themeToggle');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const weatherCard = document.getElementById('weatherCard');

// Weather data elements
const cityName = document.getElementById('cityName');
const country = document.getElementById('country');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const windDirection = document.getElementById('windDirection');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const lastUpdated = document.getElementById('lastUpdated');

// ==================== EVENT LISTENERS ====================
// Search button click event
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        showError('Please enter a city name');
    }
});

// Enter key press event on input field
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherByCity(city);
        }
    }
});

// Location button click event
locationBtn.addEventListener('click', getUserLocation);

// Theme toggle button click event
themeToggle.addEventListener('click', toggleTheme);

// ==================== INITIALIZE APP ====================
// Load theme preference and get user location on page load
window.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    getUserLocation();
});

// ==================== THEME FUNCTIONS ====================
/**
 * Toggle between light and dark mode
 */
function toggleTheme() {
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    body.classList.toggle('dark-mode');
    
    // Update icon based on current theme
    if (body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
}

/**
 * Load saved theme preference from localStorage
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.className = 'fas fa-sun';
    }
}

// ==================== GEOLOCATION FUNCTIONS ====================
/**
 * Get user's current location using Geolocation API
 */
function getUserLocation() {
    // Check if Geolocation is supported
    if (navigator.geolocation) {
        showLoader();
        
        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoordinates(lat, lon);
            },
            // Error callback
            (error) => {
                hideLoader();
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        showError('Location access denied. Please enter a city name manually.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        showError('Location information unavailable.');
                        break;
                    case error.TIMEOUT:
                        showError('Location request timed out.');
                        break;
                    default:
                        showError('An unknown error occurred.');
                }
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
    }
}

// ==================== API FUNCTIONS ====================
/**
 * Fetch weather data by city name
 * @param {string} city - Name of the city
 */
async function getWeatherByCity(city) {
    showLoader();
    
    try {
        const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your configuration.');
            } else {
                throw new Error('Failed to fetch weather data. Please try again.');
            }
        }
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        hideLoader();
        showError(error.message);
    }
}

/**
 * Fetch weather data by coordinates (latitude and longitude)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
async function getWeatherByCoordinates(lat, lon) {
    showLoader();
    
    try {
        const url = `${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data for your location.');
        }
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        hideLoader();
        showError(error.message);
    }
}

// ==================== DISPLAY FUNCTIONS ====================
/**
 * Display weather data on the UI
 * @param {Object} data - Weather data from API
 */
function displayWeather(data) {
    hideLoader();
    hideError();
    
    // Update location info
    cityName.textContent = data.name;
    country.textContent = data.sys.country;
    
    // Update weather icon and main info
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    temp.textContent = Math.round(data.main.temp);
    weatherDescription.textContent = data.weather[0].description;
    
    // Update weather details
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`; // Convert m/s to km/h
    pressure.textContent = `${data.main.pressure} hPa`;
    
    // Calculate visibility in km (API returns meters)
    const visibilityKm = (data.visibility / 1000).toFixed(1);
    visibility.textContent = `${visibilityKm} km`;
    
    // Convert wind direction from degrees to compass direction
    windDirection.textContent = getWindDirection(data.wind.deg);
    
    // Convert sunrise and sunset times from Unix timestamp
    sunrise.textContent = formatTime(data.sys.sunrise, data.timezone);
    sunset.textContent = formatTime(data.sys.sunset, data.timezone);
    
    // Update last updated time
    const now = new Date();
    lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    })}`;
    
    // Show weather card with animation
    weatherCard.classList.add('active');
}

// ==================== HELPER FUNCTIONS ====================
/**
 * Convert wind direction from degrees to compass direction
 * @param {number} degrees - Wind direction in degrees
 * @returns {string} - Compass direction (N, NE, E, SE, etc.)
 */
function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

/**
 * Format Unix timestamp to readable time (HH:MM AM/PM)
 * @param {number} timestamp - Unix timestamp
 * @param {number} timezone - Timezone offset in seconds
 * @returns {string} - Formatted time string
 */
function formatTime(timestamp, timezone) {
    // Create date object from timestamp and adjust for timezone
    const date = new Date((timestamp + timezone) * 1000);
    
    // Format time in UTC (since we already adjusted for timezone)
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const minuteStr = minutes.toString().padStart(2, '0');
    
    return `${hour12}:${minuteStr} ${period}`;
}

// ==================== UI STATE FUNCTIONS ====================
/**
 * Show loading spinner
 */
function showLoader() {
    loader.classList.add('active');
    weatherCard.classList.remove('active');
    errorMessage.classList.remove('active');
}

/**
 * Hide loading spinner
 */
function hideLoader() {
    loader.classList.remove('active');
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.add('active');
    weatherCard.classList.remove('active');
}

/**
 * Hide error message
 */
function hideError() {
    errorMessage.classList.remove('active');
}

// ==================== ADDITIONAL FEATURES ====================
/**
 * Clear input field after successful search
 */
function clearInput() {
    cityInput.value = '';
}

// Optional: Add Enter key support for better UX
document.addEventListener('keydown', (e) => {
    // Press 'L' key to get current location
    if (e.key === 'l' || e.key === 'L') {
        if (document.activeElement !== cityInput) {
            getUserLocation();
        }
    }
});

// ==================== ERROR HANDLING ====================
/**
 * Global error handler for unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showError('An unexpected error occurred. Please try again.');
});

// ==================== API KEY VALIDATION ====================
/**
 * Check if API key is configured
 */
function validateAPIKey() {
    if (API_KEY === 'YOUR_API_KEY_HERE' || !API_KEY) {
        console.warn('⚠️ API Key not configured!');
        console.log('Please get your free API key from: https://openweathermap.org/api');
        console.log('Then replace YOUR_API_KEY_HERE in script.js with your actual API key');
    }
}

// Validate API key on load
validateAPIKey();