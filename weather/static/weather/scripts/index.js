document.addEventListener('DOMContentLoaded', function () {
    const search_field = document.querySelector(".search-field");
    const results = document.querySelector(".results");
    const cityname = document.getElementById("cityname");
    const description = document.getElementById("description");
    const temp = document.getElementById("temp");
    const castitems = document.querySelector(".cast-items");
    const real_feel = document.querySelector("#realfeel");
    const humidity = document.querySelector("#humidity");
    const windkm= document.querySelector("#windkm");
    const pressure = document.querySelector("#pressure");
    const cities_btn = document.querySelector(".cities");
    const cities_cast = document.querySelector('.cities-cast');
    const search_div = document.querySelector('.search');
    const weather_now = document.querySelector('.weather-now');
    const air_condition = document.querySelector('.air-condition');
    const forecast_div = document.querySelector('.forecast');
    const weather_btn = document.querySelector('.weather-btn');
    const units_h1 = document.querySelector('.units-h1');
    const filter = document.querySelector('.filter');
    const settings_btn = document.querySelector('.settings');
    const imperial_btn = document.querySelector('.imperial-btn');
    const metric_btn = document.querySelector('.metric-btn');
    const kelvin_btn = document.querySelector('.kelvin-btn');


    if (results.innerHTML === '') {
        results.style.display = "none"
    }
    let unit = localStorage.getItem("unit");
    let lastCity = localStorage.getItem("lastcity");
    if(unit === null) {
        localStorage.setItem("unit", "metric");
        unit = localStorage.getItem("unit");
    }
    if(lastCity === null) {
        localStorage.setItem("lastcity", "london");
        lastCity = localStorage.getItem("lastcity");
    }

    display_weather(lastCity)
    forecast(lastCity)

    const cities = [
        // North America
        'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
        'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
        'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa',
        'Mexico City', 'Guadalajara', 'Monterrey', 'Tijuana', 'Puebla',
    
        // South America
        'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza',
        'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata',
        'Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Chiclayo',
        'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
    
        // Europe
        'London', 'Paris', 'Berlin', 'Madrid', 'Rome',
        'Vienna', 'Budapest', 'Warsaw', 'Prague', 'Amsterdam',
        'Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Nizhny Novgorod',
        'Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Adana',
    
        // Africa
        'Lagos', 'Cairo', 'Kinshasa', 'Johannesburg', 'Nairobi',
        'Casablanca', 'Algiers', 'Accra', 'Abidjan', 'Dakar',
        'Cape Town', 'Durban', 'Pretoria', 'Luanda', 'Kampala',
    
        // Asia
        'Tokyo', 'Delhi', 'Shanghai', 'Mumbai', 'Beijing',
        'Bangkok', 'Seoul', 'Jakarta', 'Manila', 'Hong Kong',
        'Singapore', 'Kuala Lumpur', 'Hanoi', 'Ho Chi Minh City', 'Phnom Penh',
        'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam',
    
        // Oceania
        'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
        'Auckland', 'Wellington', 'Christchurch', 'Suva', 'Port Moresby'
    ];

    function unixtotime(unixTimestamp) {
        // Convert Unix timestamp to milliseconds
        const date = new Date(unixTimestamp * 1000);
    
        // Get hours (12-hour format), minutes, and AM/PM
        const hours = date.getHours() % 12 || 12; // Adjust 0 to 12 for 12-hour format
        const minutes = ('0' + date.getMinutes()).slice(-2); // Ensure two digits for minutes
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM'; // Determine AM or PM
    
        // Construct the time string
        const timeString = `${hours}:${minutes} ${ampm}`;
    
        return timeString;
    }

    async function get_weather(city, unit) {
        try {
            const response = await fetch(`api/weather?city=${city}&unit=${unit}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return [
                `${data["sys"]["country"]} ${data["name"]}`,
                data["main"]["temp"],
                data["weather"][0]["description"],
                data["weather"][0]["icon"],
                data["main"]["feels_like"],
                data["wind"]["speed"],
                data["main"]["humidity"],
                data["main"]["pressure"]
            ];
        } catch (error) {
            console.error('Error fetching the weather data:', error);
            throw error;
        }
    }
    async function display_weather(city){
        const unit = localStorage.getItem("unit");
        const weather = await get_weather(city, unit);
        units_h1.style.display = 'none';
        filter.style.display = 'none';
        cities_cast.style.display = 'none';
        cityname.innerHTML = weather[0]
        temp.innerHTML = weather[1]
        description.innerHTML = weather[2]
        let icon = weather[3]
        const iconimg = document.querySelector("#icon");
        iconimg.src = `https://openweathermap.org/img/wn/${icon}.png`
        real_feel.innerHTML = weather[4]
        windkm.innerHTML = weather[5]
        humidity.innerHTML = weather[6]
        pressure.innerHTML = weather[7]
        
    }
    function forecast(city) {
        const unit = localStorage.getItem("unit");
        fetch(`api/getforecast?city=${city}&unit=${unit}`)
            .then(response => {
                if(!response.ok){
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                castitems.innerHTML = ''
                data["list"].slice(0, 6).forEach(timestamp => {
                    const item = document.createElement('div');
                    item.classList.add("castitem")
                    item.innerHTML = `<p id="casttime">${unixtotime(timestamp["dt"])}</p>
                    <img src="https://openweathermap.org/img/wn/${timestamp["weather"][0]["icon"]}.png" id="casticon" width="100px">
                    <h6 id="casttemp">${timestamp["main"]["temp"]}</h6>`
                    castitems.appendChild(item)
                    
                })

            })
    }

    search_field.addEventListener('input', function () {
        let query = search_field.value.toLowerCase();
        results.innerHTML = '';
        results.style.display = "none"   

        if (query) {
            const filteredcities = cities.filter(city => city.toLowerCase().includes(query));
            filteredcities.forEach(city => {
                const result = document.createElement('div');
                result.textContent = city;
                result.classList.add('result');
                result.addEventListener('click', function() {
                    search_field.value = city;
                    results.innerHTML = '';
                    results.style.display = "none"    
                    display_weather(city)
                    castitems.innerHTML = '';
                    forecast(city)
                    search_field.value = '';   
                    localStorage.setItem("lastcity", city);  
                });
                results.appendChild(result);
                if (result) {
                    results.style.display = "block"
                    
                }
            });
        }
    });

    cities_btn.addEventListener('click', async function () {
        const unit = localStorage.getItem("unit");
        weather_now.style.display = 'none';
        air_condition.style.display = 'none';
        forecast_div.style.display = 'none';
        units_h1.style.display = 'none';
        filter.style.display = 'none';
        cities_cast.style.display = 'flex';
        cities_cast.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * cities.length);
            const city = cities[randomIndex];
            const city_cast = document.createElement('div');
            city_cast.classList.add('city-cast')
            const data = await get_weather(city, unit);
            const cast_content = `<h1>${data[0]}</h1><h2>${data[1]}</h2>
            <img src="https://openweathermap.org/img/wn/${data[3]}.png">`
            city_cast.innerHTML = cast_content;
            cities_cast.appendChild(city_cast) 
            } 
    });

    weather_btn.addEventListener('click', function () {
        cities_cast.style.display = 'none';
        weather_now.style.display = 'flex';
        air_condition.style.display = 'flex';
        forecast_div.style.display = 'flex';
        display_weather(lastCity)
        forecast(lastCity)
    });

    settings_btn.addEventListener('click', function () {
        const unit = localStorage.getItem("unit");
        weather_now.style.display = 'none';
        air_condition.style.display = 'none';
        forecast_div.style.display = 'none';
        cities_cast.style.display = 'none';
        units_h1.style.display = 'flex';
        filter.style.display = 'flex';
        if(unit === "metric"){
            metric_btn.style.backgroundColor = '#202b3b'; 
            imperial_btn.style.backgroundColor = 'transparent';
            kelvin_btn.style.backgroundColor = 'transparent';
        } 
        if(unit === "imperial"){
            imperial_btn.style.backgroundColor = '#202b3b';
            kelvin_btn.style.backgroundColor = 'transparent';
            metric_btn.style.backgroundColor = 'transparent'; 
        } 
        if(unit === "standard") {
            kelvin_btn.style.backgroundColor = '#202b3b';
            metric_btn.style.backgroundColor = 'transparent'; 
            imperial_btn.style.backgroundColor = 'transparent';
        }
    });

    imperial_btn.addEventListener('click', function () {
        imperial_btn.style.backgroundColor = '#202b3b';
        metric_btn.style.backgroundColor = '#0b131e';
        kelvin_btn.style.backgroundColor = '#0b131e';
        const unit = imperial_btn.dataset.unit;
        localStorage.setItem("unit", unit);
    });

    metric_btn.addEventListener('click', function () {
        imperial_btn.style.backgroundColor = '#0b131e';
        metric_btn.style.backgroundColor = '#202b3b';
        kelvin_btn.style.backgroundColor = '#0b131e';
        const unit = metric_btn.dataset.unit;
        localStorage.setItem("unit", unit);
        console.log(unit)
    });

    kelvin_btn.addEventListener('click', function () {
        imperial_btn.style.backgroundColor = '#0b131e';
        metric_btn.style.backgroundColor = '#0b131e';
        kelvin_btn.style.backgroundColor = '#202b3b';
        const unit = kelvin_btn.dataset.unit;
        localStorage.setItem("unit", unit);
        console.log(localStorage.getItem(unit))
    });
});

