$(document).ready(function() {
//Current date from Moment.js
var currentMoment = moment().format("l");

//display dates for the 5 day forcast 
var day1 = moment().add(1, "days").format("l");
var day2 = moment().add(2, "days").format("l");
var day3 = moment().add(3, "days").format("l");
var day4 = moment().add(4, "days").format("l");
var day5 = moment().add(5, "days").format("l");

//variable for City Search and storage 
var city;
var cities;

//Event Handler for click button to search for cities. 
$("#city-btn").on("click", (e) => {
    e.preventDefault();
    getCity();
    searchCity();
    $("#city-input").val("");
    listCities();
    });

//function to set searched items to the local storage 
function savetoLocalStorage() {
    localStorage.setItem("mostRecent",city);
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
}


//function to store and display the last city searched 
function loadMostRecent() {
var lastSearch = localStorage.getItem("mostRecent");
if (lastSearch) {
    city = lastSearch;
    searchCity();
} else {
    city = "San-Antonio";
    searchCity();
}
}
loadMostRecent()

//function to get most recent cities searched and display 
function loadRecentCities() {
var recentCities = JSON.parse(localStorage.getItem("cities"));
if (recentCities) {
    cities = recentCities;
} else {
    cities = [];
}
}

//function to obtain the input city and place in function to save in local storage 
function getCity() {
    city = $("#city-input").val();
    if(city && cities.includes(city) === false) {
        savetoLocalStorage();
        return city;
    } else if (!city) {
        alert("Not found. Please enter a city");
    }
    }

//Function to search for the City's Weather 
function searchCity() {
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=ef45ab95b637bfe8f4345d1d72a19628"
var coords = [];
$.ajax({
    url: queryURL,
    method: "GET",
}).then(function (response) {

coords.push(response.coord.lat);
coords.push(response.coord.lon);
var cityName = response.name;
var cityCond = response.weather[0].description.toUpperCase();
var cityTemp = response.main.temp;
var cityHum  = response.main.humidity;
var cityWind = response.wind.speed;
var icon     = response.weather[0].icon;
$("#icon").html (
    `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`
);
$("#city-name").html(cityName + " " + "(" + NowMoment +")"); 
$("#city-cond").text("Current Conditions: " + cityCond);
$("#temp").text("Current Temp (F): " + cityTemp.toFixed(1));
$("#humidity").text("Humidity: " + cityHum + "%");
$("#wind-speed").text("Wind Speed: " + cityWind + "mph");
$("date1").text(day1);
$("date2").text(day2);
$("date3").text(day3);
$("date4").text(day4);
$("date5").text(day5);

getUV(response.coord.lat, response.coord.lon); 
}).fail(function (){
    alert("No available UV data")
});

//function to get the 5 day forecast with UV index
function getUV(lat, lon) {

    $.ajax({
        url:"https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&units=imperial&appid=ef45ab95b637bfe8f4345d1d72a19628",
        method: "GET",
    }).then(function (response) {

    //Color code UV index severeity 
    var uvIndex = response.current.uvi;
    $("#uv-index").text("UV Index:" + " " + uvIndex);
    if (uvIndex >= 8) {
        $("#uv-index").css("color", "red");
    } else if (uvIndex > 4 && uvIndex < 8) {
        $("#uv-index").css("color", "yellow");
    } else {
        $("uv-index").css("color", "green");
    }
    var cityHigh = response.daily[0].temp.max;
    $("high").text("Expected high (F): " + " " + cityHigh);

    //Temperature for 5 days 
    var day1temp = response.daily[1].temp.max;
    var day2temp = response.daily[2].temp.max;
    var day3temp = response.daily[3].temp.max;
    var day4temp = response.daily[4].temp.max;
    var day5temp = response.daily[5].temp.max;
    //humidity for 5 days
    var day1hum = response.daily[1].humidity; 
    var day2hum = response.daily[2].humidity; 
    var day3hum = response.daily[3].humidity; 
    var day4hum = response.daily[4].humidity; 
    var day5hum = response.daily[5].humidity; 
    //weather icons for 5 days
    var icon1 = response.daily[1] .weather[0].icon;
    var icon2 = response.daily[2] .weather[0].icon;
    var icon3 = response.daily[3] .weather[0].icon;
    var icon4 = response.daily[4] .weather[0].icon;
    var icon5 = response.daily[5] .weather[0].icon;
    //
    $("#temp1").text("Temp(F):" + " " + day1temp.toFixed(1));
    $("#temp2").text("Temp(F):" + " " + day2temp.toFixed(1));
    $("#temp3").text("Temp(F):" + " " + day3temp.toFixed(1));
    $("#temp4").text("Temp(F):" + " " + day4temp.toFixed(1));
    $("#temp5").text("Temp(F):" + " " + day5temp.toFixed(1));
    //
    $("#hum1").text("Hum:" + " " + day1hum + "%");
    $("#hum2").text("Hum:" + " " + day2hum + "%");
    $("#hum3").text("Hum:" + " " + day3hum + "%");
    $("#hum4").text("Hum:" + " " + day4hum + "%");
    $("#hum5").text("Hum:" + " " + day5hum + "%");
    //
    $("#icon1").html (`<img src="http://openweathermap.org/img/wn/${icon1}@2x.png">`);
    $("#icon2").html (`<img src="http://openweathermap.org/img/wn/${icon2}@2x.png">`);
    $("#icon3").html (`<img src="http://openweathermap.org/img/wn/${icon3}@2x.png">`);
    $("#icon4").html (`<img src="http://openweathermap.org/img/wn/${icon4}@2x.png">`);
    $("#icon5").html (`<img src="http://openweathermap.org/img/wn/${icon5}@2x.png">`);
});
}
}
//function to place recently searched cities on the page 
function listCities() {
    $("citySearch").text("");
    cities.forEach((city) => {
    $("citySearch").prepend("<tr><td>" + city + "</td></tr>");
    });
}

listCities(); 
//event handler to place recent cities in a table 
$(document).on("click", "td", (e) => {
    e.preventDefault();
    var ListedCity = $(e.target).text();
    city = ListedCity;
    searchCity();
});
//event handler for the clear button 
$("clearCity-btn").click(() => {
localStorage.removeItem("cities");
loadRecentCities();
listCities();
});
});
