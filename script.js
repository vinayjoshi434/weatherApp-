

const cityinput = document.getElementById("cityinput")
const searchbtn = document.getElementById("searchbutton")
const detailsdiv = document.getElementById("details-parameter")
const forecastcarddiv = document.getElementById("forecast-cards-div")
const locationButton = document.getElementById("locationbutton")


const baseurl = "http://api.weatherapi.com/v1/"


const fetchData = async (url, city) => {
    try {
        const finalurl = `${url}forecast.json?key=cd1f7ea2ff894ff8b7a62606240712&q=${city}&aqi=yes&days=6`
        const res = await fetch(finalurl)
        const data = await res.json()
        if (res.ok === true) {
            displaydata(data)
        }

        console.log(data);


    } catch (error) {
        alert(`error fetching weather data   ${error.message} `)
    }

}

locationButton.addEventListener("click", () => {
    console.log("hello")
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const locationQuery = `${latitude},${longitude}`;
                fetchData(baseurl, locationQuery);
            },
            (error) => {
                alert("Unable to retrieve location. Please allow location access.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});



searchbtn.addEventListener("click", (e) => {
    const cityname = cityinput.value.trim()
    console.log(cityname)
    if (cityname !== "") {
        fetchData(baseurl, cityname)
    }

    else {
        alert("please enter the city Name ")
    }
})







function displaydata(data) {

    const { location, current, forecast } = data

    detailsdiv.innerHTML = `
                    <div class="flex-col flex gap-3 text-lime-50">
                        <h2>${location.name} - ( ${location.localtime})</h2>
                        <h6>Temperature: ${current.temp_c}°C</h6>
                        <h6>feels-like:${current.feelslike_c}</h6>
                        <h6>Humidity:${current.humidity}</h6>
                    </div>
                    <div class="text-slate-200 flex flex-col items-center">
                        <div>
                        <span class="">Pressure: <span id="wrapper-pressure">${current.pressure_in}</span></span>
                        <span class="mx-2">|</span>
                        <span class="">Humidity: <span id="wrapper-humidity">${current.humidity}</span></span>
                        </div>
                        <div>
                        <p>AQI:${current.air_quality.pm10}</p>
                        </div>
 
                    </div>
                    <div class="p-3">
                        <img src=${current.condition.icon} alt="Weather Icon"
                                    class="w-16 h-16">
                         <span class="font-[outfit] text-orange-200">${current.condition.text}</span>


                     </div>`


    forecastcarddiv.innerHTML = ""
    forcastarray = forecast.forecastday.filter((ele, index) => {
        return index !== 0
    })
    console.log(forcastarray)



    forcastarray.map((ele) => {

        const card = document.createElement("div")
        card.classList.add("bg-white/10backdrop", "backdrop-blur-md", "p-3", "rounded-lg", "shadow-lg", "text-white", "w-auto", "h-auto")
        card.innerHTML += `
                            <!-- City & Weather Icon -->
                            <div class="flex justify-between items-center">
                                <div>
                                    <h2 class="text-xl font-semibold">${location.name}</h2>
                                    <p class="text-sm text-gray-300">${ele.date}</p>
                                </div>
                                <img src=${ele.day.condition.icon} alt="Weather Icon"
                                    class="w-16 h-16">
                            </div>

                            <!-- Temperature & Weather Condition -->
                            <div class="text-center mt-2">
                                <h1 class="text-3xl font-bold">${ele.day.avgtemp_c}</h1>
                                <p class="text-md text-gray-300">${ele.day.condition.text}</p>
                            </div>

                            <!-- Weather Details -->
                            <div class="mt-4 flex justify-between text-sm text-gray-200">
                                <div class="flex items-center space-x-1 gap-1">
                                    <span>🌅</span>
                                    
                                    <p>Sunset:${ele.astro.sunset}</p>
                                </div>
                                <div class="flex items-center space-x-1 gap-1">
                                    <span>💨</span>
                                    <p>Wind:${ele.day.maxwind_kph}</p>
                                </div>
                                <div class="flex items-center space-x-1 gap-2">
                                    <span>🌅</span>
                                    <p>Sunrise:${ele.astro.sunrise}</p>
                                </div>
                            </div>
                        `
        forecastcarddiv.appendChild(card)
    })

}








