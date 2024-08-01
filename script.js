
document.getElementById('search-button').addEventListener('click', () => {
    const location = document.getElementById('location-input').value.trim();
    if (location) {
        fetchWeatherData(location);
    } else {
        alert('Please enter a location');
    }
});

// The above function is to take action after user click on Submit Button

// This is the Function to update the recent cities dropdown   _____ So, this part I learned externaly from the Internet Videos !!

function updateRecentCitiesDropdown(city) {
    const maxCities = 5; // Max number of recent cities to store
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

    // It will Check if the city already exists in the list
    if (!recentCities.includes(city)) {
        recentCities.unshift(city); // It will Add new city to the beginning
        if (recentCities.length > maxCities) {
            recentCities.pop(); // It will Remove the oldest city if we exceed maxCities
        }
        localStorage.setItem('recentCities', JSON.stringify(recentCities)); // Save updated list to localStorage
    }

    // Update the dropdown menu
    const dropdown = document.getElementById('recent-cities-dropdown');
    dropdown.innerHTML = ''; // Clear existing dropdown items

    recentCities.forEach((recentCity) => {
        const dropdownItem = document.createElement('li');
        dropdownItem.textContent = recentCity;
        dropdownItem.addEventListener('click', () => {
            fetchWeatherData(recentCity); // Fetch weather data for the selected city
        });
        dropdown.appendChild(dropdownItem);
    });
}

//  -------------------------------------------------------------------------------------------- 

// Now This is the Function for the "Current Location Button", This part Also learned from the other Sources (Internet , Uvideos)

document.getElementById('current-location-button').addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(`${latitude},${longitude}`); // Fetch weather data for the current location
        },
        (error) => {
          console.error('Error fetching location:', error);
          alert('Unable to retrieve your location. Please ensure location services are enabled.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  });
  


// It will Fetch Weather Data Based on User Input From API

async function fetchWeatherData(location) {
    const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&days=3`; // Dynamic URL
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'a490233d43mshcd96f38c8116888p19b43bjsn52c8355907a0',
            'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json(); // Parse JSON response

        // Display the data in HTML
        updateWeatherData(result);

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}



// Function to update HTML with the fetched weather data


function updateWeatherData(data) {
    // Extracting necessary information from the API response

    const cityName = data.location.name;
    const countryName = data.location.country;
    const currentTemp = data.current.temp_c;
    const currentCondition = data.current.condition.text;
    const currentHumidity = data.current.humidity;
    const currentWindSpeed = data.current.wind_kph;
    const forecastDays = data.forecast.forecastday;
   
    // Update HTML elements with fetched data

    document.getElementById('city-name').textContent = `${cityName}, ${countryName}`;
    document.getElementById('current-temp').textContent = `${currentTemp}°C`;
    document.getElementById('current-condition').textContent = currentCondition;
    document.getElementById('current-humidity').textContent = `Humidity: ${currentHumidity}%`;
    document.getElementById('current-wind').textContent = `Wind Speed: ${currentWindSpeed} km/h`;
  


    // Function for Forecast for the next days

    forecastDays.forEach((day, index) => {
        // It will Extract forecast data
        const date = day.date;
        const maxTemp = day.day.maxtemp_c;
        const minTemp = day.day.mintemp_c;
        const conditionText = day.day.condition.text;
        const conditionIcon = day.day.condition.icon;

        // Now, It will Update the corresponding HTML elements for each day

        document.getElementById(`day-${index}-date`).textContent = date;
        document.getElementById(`day-${index}-condition`).textContent = conditionText;
        document.getElementById(`day-${index}-icon`).src = conditionIcon;
        document.getElementById(`day-${index}-temp`).textContent = `Max: ${maxTemp}°C / Min: ${minTemp}°C`;
    });
}

// It will Add Event Listener for Search Button

document.getElementById('search-button').addEventListener('click', () => {
    const location = document.getElementById('location-input').value.trim();
    if (location) {
        fetchWeatherData(location); // Fetch weather data for the user input location
    } else {
        alert('Please enter a location');
    }
});

//  This is the default Location Initial fetch 
fetchWeatherData('Roorkee');
