const apiKey = '6b8a0b5975c084d650df891c878ca7b1';

(function () {
    const cityInput = document.querySelector('.city-input');
    const searchBtn = document.querySelector('.search-btn');
    const weatherInfoSection = document.querySelector('.weather-info');
    const notFoundSection = document.querySelector('.not-found');
    const searchCitySection = document.querySelector('.search-city');

    const countryTxt = document.querySelector('.country-txt');
    const tempTxt = document.querySelector('.temp-txt');
    const conditionTxt = document.querySelector('.condition-txt');
    const humidityValueTxt = document.querySelector('.humidity-value-txt');
    const windValueTxt = document.querySelector('.wind-value-txt');
    const weatherSummaryImg = document.querySelector('.weather-summary-img');
    const currentDateTxt = document.querySelector('.current-date-txt');

    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    // Functions
    function handleSearch() {
        const city = cityInput.value.trim();
        if (city) {
            updateWeatherInfo(city);
            cityInput.value = ''; // Clear input after search
            cityInput.blur(); // Remove focus
        }
    }

    async function fetchWeatherData(endPoint, city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        return response.json();
    }

    function getWeatherIcon(id) {
        if (id <= 232) return 'thunderstorm.svg';
        if (id <= 321) return 'drizzle.svg';
        if (id <= 531) return 'rain.svg';
        if (id <= 622) return 'snow.svg';
        if (id <= 781) return 'atmosphere.svg';
        if (id === 800) return 'clear.svg';
        return 'clouds.svg';
    }

    function getCurrentDate() {
        const currentDate = new Date();
        const options = { weekday: 'short', day: '2-digit', month: 'short' };
        return currentDate.toLocaleDateString('en-GB', options);
    }

    async function updateWeatherInfo(city) {
        try {
            const weatherData = await fetchWeatherData('weather', city);
            const {
                name: country,
                main: { temp, humidity },
                weather: [{ id, main }],
                wind: { speed }
            } = weatherData;

            updateUI(country, temp, humidity, speed, main, id);
            await updateForecastsInfo(city);
            showDisplaySection(weatherInfoSection);
        } catch (error) {
            console.error(error);
            showDisplaySection(notFoundSection);
        }
    }

    async function updateForecastsInfo(city) {
        try {
            const forecastsData = await fetchWeatherData('forecast', city);
            const forecastItems = document.querySelector('.forecast-items-container');
            forecastItems.innerHTML = ''; // Clear previous forecasts

            forecastsData.list.forEach((item, index) => {
                if (index % 8 === 0) { // Display forecast every 8 items
                    const forecastItem = document.createElement('div');
                    forecastItem.classList.add('forecast-item');

                    forecastItem.innerHTML = `
                        <h5 class="forecast-item-date regular txt">${getForecastDate(item.dt)}</h5>
                        <img src="assets/weather/${getWeatherIcon(item.weather[0].id)}" class="forecast-item-img" alt="Forecast weather icon">
                        <h5 class="forecast-item-temp">${Math.round(item.main.temp)} ℃</h5>
                    `;
                    forecastItems.appendChild(forecastItem);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    function getForecastDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const options = { weekday: 'short', day: '2-digit', month: 'short' };
        return date.toLocaleDateString('en-GB', options);
    }

    function updateUI(country, temp, humidity, speed, condition, id) {
        countryTxt.textContent = country;
        tempTxt.textContent = Math.round(temp) + '°C';
        conditionTxt.textContent = condition;
        humidityValueTxt.textContent = humidity + '%';
        windValueTxt.textContent = speed + ' M/s';
        currentDateTxt.textContent = getCurrentDate();
        weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;
    }

    function showDisplaySection(section) {
        [weatherInfoSection, searchCitySection, notFoundSection].forEach(section => {
            section.style.display = 'none';
        });

        section.style.display = 'flex';
    }
})();
