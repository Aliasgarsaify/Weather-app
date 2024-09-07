const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAcessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]"); 
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_KEY = "0927ddb75d2f97ea63af8b089a7de434";

currentTab.classList.add("current-tab");
getFromSessoinStorage();


function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    }

    if(!searchForm.classList.contains("active")){
        grantAcessContainer.classList.remove("active");
        userInfoContainer.classList.remove("active");
        searchForm.classList.add("active"); 
    }
    else{
        userInfoContainer.classList.remove("active");
        searchForm.classList.remove("active");
        // ab main your weather tab me aagaya hun
        // to display weather we need coordinates so lets check local storage.
        getFromSessoinStorage();
    }
}
userTab.addEventListener("click", ()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    switchTab(searchTab);
});

function getFromSessoinStorage(){
    const localCoordinates  = sessionStorage.getItem("user-coordinate");

    if(!localCoordinates){
        grantAcessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){

    const {lat, lon} = coordinates;

    // make grantContainer invisible
    grantAcessContainer.classList.remove("active");

    // make loader visible
    loadingScreen.classList.add("active");

    // API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.add("active");
    }

}

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fetch the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText =  `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

}

const grantAccessButton = document.querySelector("[data-grantAcess]");
grantAccessButton.addEventListener("click", getLocation);

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("geolocation not supported");
    }
}

function showPosition(position){
    const userCoordinate = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinate", JSON.stringify(userCoordinate));
    fetchUserWeatherInfo(userCoordinate);
}

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) =>{

    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === ""){
        return ;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }

});

async function fetchSearchWeatherInfo(city){

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAcessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){

    }

}