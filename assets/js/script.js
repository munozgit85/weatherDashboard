

$(window).on ("load",function() {
  //Current Date formatted 
  var todayDate = moment().format("l");
  
  //moment.js to add subsequent 5 days from current date 
  var day1 = moment().add(1, "days").format("l");
  var day2 = moment().add(2, "days").format("l");
  var day3 = moment().add(3, "days").format("l");
  var day4 = moment().add(4, "days").format("l");
  var day5 = moment().add(5, "days").format("l");

 //city variables 
  var city;
  var cities;
 //get the last city serached 
  function SaveRecentCities() {
    var lastSearch = localStorage.getItem("lastSearchedCity");
    if (lastSearch) {
      city = lastSearch;
      search();
    } else {
      city = "San-antonio";
      search();
    }
  }

  SaveRecentCities()

//Get the past cities searched and place on the page 
  function getRecentCities() {
    var recentCities = JSON.parse(localStorage.getItem("cities"));

    if (recentCities) {
      cities = recentCities;
    } else {
      cities = [];
    }
  }

  getRecentCities()

  //button/event handler  to serach for a city 
  $("#submit").on("click", (e) => {
    e.preventDefault();
    getCity();
    search();
    $("#city-input").val("");
    placeCitiesTable();
  });

  //Send the cities searched to local storage 
  function saveToLocalStorage() {
    localStorage.setItem("lastSearchedCity", city);
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
  }

  //Get the value of the search city and then function to save to local storage. 
  function getCity() {
    city = $("#city-input").val();
    if (city && cities.includes(city) === false) {
      saveToLocalStorage();
      return city;
    } else if (!city) {
      alert("City not found. Please enter a city");
    }
  }


  // searches the API for the chosen city
  function search() {
    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=ef45ab95b637bfe8f4345d1d72a19628";
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
      var cityHum = response.main.humidity;
      var cityWind = response.wind.speed;
      var icon = response.weather[0].icon;
      $("#icon").html(
        `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`
      );
      $("#city-name").html(cityName + " " + "(" + todayDate + ")");
      $("#city-cond").text("Current Conditions: " + cityCond);
      $("#temp").text("Current Temp (F): " + cityTemp.toFixed(1));
      $("#humidity").text("Humidity: " + cityHum + "%");
      $("#wind-speed").text("Wind Speed: " + cityWind + "mph");
      $("#date1").text(day1);
      $("#date2").text(day2);
      $("#date3").text(day3);
      $("#date4").text(day4);
      $("#date5").text(day5);

      retrieveUVIndex(response.coord.lat, response.coord.lon);
    }).fail(function (){
      alert("Unable to obtain result")
    });

    //Function to get 5-day forecast and UV index and put them on page
    function retrieveUVIndex(lat, lon) {
     
        
      $.ajax({
        url: "https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&units=imperial&uvi&appid=ecb9162c172f9e6c3428b9608baebe28",
        method: "GET",
      }).then(function (response) {
        console.log(response)

        //code to determine UV index severity
        var uvIndex = response.current.uvi;
        $("#uv-index").text("UV Index:" + " " + uvIndex);
        if (uvIndex >= 8) {
          $("#uv-index").css("color", "red");
        } else if (uvIndex > 4 && uvIndex < 8) {
          $("#uv-index").css("color", "yellow");
        } else {
          $("#uv-index").css("color", "green");
        }
        var cityHigh = response.daily[0].temp.max;
        $("#high").text("Temperature high (F): " + " " + cityHigh);

        //forecast temp variables
        var day1temp = response.daily[1].temp.max;
        var day2temp = response.daily[2].temp.max;
        var day3temp = response.daily[3].temp.max;
        var day4temp = response.daily[4].temp.max;
        var day5temp = response.daily[5].temp.max;
        //forecast humidity variables
        var day1hum = response.daily[1].humidity;
        var day2hum = response.daily[2].humidity;
        var day3hum = response.daily[3].humidity;
        var day4hum = response.daily[4].humidity;
        var day5hum = response.daily[5].humidity;
        //forecast weather icon variables
        var icon1 = response.daily[1].weather[0].icon;
        var icon2 = response.daily[2].weather[0].icon;
        var icon3 = response.daily[3].weather[0].icon;
        var icon4 = response.daily[4].weather[0].icon;
        var icon5 = response.daily[5].weather[0].icon;
        //forecast wind speed variables 
        var day1wind = response.daily[1].wind_speed;
        var day2wind = response.daily[2].wind_speed;
        var day3wind = response.daily[3].wind_speed;
        var day4wind = response.daily[4].wind_speed;
        var day5wind = response.daily[5].wind_speed;

        $("#temp1").text("Temp(F):" + " " + day1temp.toFixed(1));
        $("#temp2").text("Temp(F):" + " " + day2temp.toFixed(1));
        $("#temp3").text("Temp(F):" + " " + day3temp.toFixed(1));
        $("#temp4").text("Temp(F):" + " " + day4temp.toFixed(1));
        $("#temp5").text("Temp(F):" + " " + day5temp.toFixed(1));
        //humidity 5 days
        $("#hum1").text("Hum:" + " " + day1hum + "%");
        $("#hum2").text("Hum:" + " " + day2hum + "%");
        $("#hum3").text("Hum:" + " " + day3hum + "%");
        $("#hum4").text("Hum:" + " " + day4hum + "%");
        $("#hum5").text("Hum:" + " " + day5hum + "%");
        //wind speed for 5 days 
        $("#wind1").text("wind:" + " " + day1wind.toFixed(1));
        $("#wind2").text("wind:" + " " + day2wind.toFixed(1));
        $("#wind3").text("wind:" + " " + day3wind.toFixed(1));
        $("#wind4").text("wind:" + " " + day4wind.toFixed(1));
        $("#wind5").text("wind:" + " " + day5wind.toFixed(1));

        $("#icon1").html(
          `<img src="http://openweathermap.org/img/wn/${icon1}@2x.png">`
        );
        $("#icon2").html(
          `<img src="http://openweathermap.org/img/wn/${icon2}@2x.png">`
        );
        $("#icon3").html(
          `<img src="http://openweathermap.org/img/wn/${icon3}@2x.png">`
        );
        $("#icon4").html(
          `<img src="http://openweathermap.org/img/wn/${icon4}@2x.png">`
        );
        $("#icon5").html(
          `<img src="http://openweathermap.org/img/wn/${icon5}@2x.png">`
        );
      });
    }
  }
//function to place the searched cities in a table on the page 
  function placeCitiesTable() {
    $("#cityList").text("");
    cities.forEach((city) => {
      $("#cityList").prepend("<tr><td>" + city + "</td></tr>");
    });
  }

  placeCitiesTable();
//button click with handler. Listed searched cities when clicked, weather is searched 
  $(document).on("click", "td", (e) => {
    e.preventDefault();
    var listedCity = $(e.target).text();
    city = listedCity;
    search();
  });
// clear button to remove the cities in the table 
  $("#clr-btn").click(() => {
    localStorage.removeItem("cities");
    getRecentCities();
    placeCitiesTable();
  });
});