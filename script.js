const weatherApp = {
    apiKey: "229671e5d741dee76445d7f04eb4d470",
  
    init: () => {
      document.getElementById("search-weather").addEventListener("click", weatherApp.handleSearchClick);
    },
  
    handleSearchClick: () => {
      const cityName = document.getElementById("city-input").value;
      if (cityName) {
        weatherApp.fetchLocation(cityName)
          .then((data) => weatherApp.fetchWeather(data.lat, data.lon))
          .catch((error) => console.error(error));
      } else {
        console.error("City is required.");
      }
    },
  
    fetchLocation: (cityName) => {
      const locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${weatherApp.apiKey}`;
      return fetch(locationUrl)
        .then((res) => res.json())
        .then((data) => {
          if (!data[0]) {
            throw new Error("Location not found");
          } else {
            return {
              lat: data[0].lat,
              lon: data[0].lon
            };
          }
        });
    },
  
    fetchWeather: (lat, lon) => {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApp.apiKey}&units=metric`;
      return fetch(weatherUrl)
        .then((res) => res.json())
        .then((data) => {
          weatherApp.displayCurrentForecast(data.list[0]);
          weatherApp.displayFiveDayForecast(data.list.slice(1, 6));
        })
        .catch((error) => console.error(error));
    },
  
    displayCurrentForecast: (currentData) => {
      const todayContainer = document.getElementById("today");
      todayContainer.innerHTML = `
        <h2>Today's Weather</h2>
        <div class="weather-card">
          <img src="https://openweathermap.org/img/w/${currentData.weather[0].icon}.png" alt="Weather Icon">
          <p>${currentData.weather[0].description}</p>
        </div>
        <div class="weather-card">
          <p>Temperature: ${currentData.main.temp} °C</p>
          <p>Humidity: ${currentData.main.humidity}%</p>
          <p>Wind Speed: ${currentData.wind.speed} m/s</p>
        </div>
      `;
    },
  
    displayFiveDayForecast: (forecastData) => {
      const forecastContainer = document.getElementById("forecast");
      forecastContainer.innerHTML = `
        <h2>Five-Day Forecast</h2>
      `;
      forecastData.forEach((data) => {
        forecastContainer.innerHTML += `
          <div class="weather-card">
            <p>Date: ${data.dt_txt}</p>
            <div class="weather-card">
              <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon">
              <p>${data.weather[0].description}</p>
            </div>
            <p>Temperature: ${data.main.temp} °C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
          </div>
        `;
      });
    },
  };
  
  weatherApp.init();