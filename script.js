const apiKey = '44e1f3908ece4bda837102809241610'; // WeatherAPI key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const forecastInfo = document.getElementById('forecast-info');

// Clear input field on page load
document.addEventListener('DOMContentLoaded', () => {
    cityInput.value = '';
});

// Search button click event
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        searchBtn.disabled = true; // Disable button to prevent multiple clicks
        fetchWeather(city);
    } else {
        showError('Please enter a city name.');
    }
});

// Fetch current weather data
async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
        if (!response.ok) throw new Error('City not found.');

        const data = await response.json();
        displayWeather(data);
        await fetchForecast(city); // Wait for forecast data
    } catch (error) {
        showError(error.message);
    } finally {
        searchBtn.disabled = false; // Re-enable button
    }
}

// Fetch 2-day forecast data
async function fetchForecast(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no`);
        if (!response.ok) throw new Error('Forecast not found.');

        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        forecastInfo.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Display current weather
function displayWeather(data) {
    weatherInfo.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <p><strong>Temperature:</strong> ${data.current.temp_c}°C</p>
        <p><strong>Condition:</strong> ${data.current.condition.text}</p>
        <p><strong>Wind Speed:</strong> ${data.current.wind_kph} kph</p>
        <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
        <p><strong>Feels Like:</strong> ${data.current.feelslike_c}°C</p>
    `;
}

// Display 2-day forecast
function displayForecast(data) {
    const forecastDays = data.forecast.forecastday.slice(1, 3); // Ensure 2-day forecast

    if (forecastDays.length === 0) {
        forecastInfo.innerHTML = '<p>No forecast available.</p>';
        return;
    }

    let forecastHTML = '<h3>2-Day Forecast:</h3>';
    forecastDays.forEach(day => {
        forecastHTML += `
            <div class="forecast-day">
                <h4>${day.date}</h4>
                <p><strong>Max Temp:</strong> ${day.day.maxtemp_c}°C</p>
                <p><strong>Min Temp:</strong> ${day.day.mintemp_c}°C</p>
                <p><strong>Condition:</strong> ${day.day.condition.text}</p>
            </div>
        `;
    });

    forecastInfo.innerHTML = forecastHTML;
}

// Display error and clear previous data
function showError(message) {
    weatherInfo.innerHTML = `<p>Error: ${message}</p>`;
    forecastInfo.innerHTML = ''; // Clear forecast section
}
