// this is the code for creating and storing the city names inputed by the user

var citynamesInput = document.querySelector("#citynames-text");
var citynamesForm = document.querySelector("#citynames-form");
var citynamesList = document.querySelector("#citynames-list");

// create the array in which everything will be stored
var citynames = [];

initcitynames();

function rendercitynames() {
    // Clear citynames list
    $(citynamesList).html("");


    // Render a new li for each new name
    for (var i = 0; i < citynames.length; i++) {
        var cityname = citynames[i];

        var li = document.createElement("p");
        $(li).text(cityname);
        $(li).attr("data-index", i);

        var button = document.createElement("button");
        $(button).text("X");

        $(li).append(button);
        $(citynamesList).append(li);
    }
}

function initcitynames() {
    // Get items from localStorage and parse to new variable

    var storedcitynames = JSON.parse(localStorage.getItem("citynames"));

    // As long as there are items in storage, transfer to the todos array
    if (storedcitynames !== null) {
        citynames = storedcitynames;
    }
    // Call the function
    rendercitynames();
}

function storecitynames() {
    // Stringify and set "todos" key in localStorage to todos array
    localStorage.setItem("citynames", JSON.stringify(citynames));
}
// When the new city is submitted.. 
citynamesForm.addEventListener("submit", function (event) {
    var citynamesText = citynamesInput.value.trim();

    // Return from function early if submitted todoText is blank
    if (citynamesText === "") {
        return;
    }

    // Add new todoText to todos array, clear the input
    citynames.push(citynamesText);
    citynamesInput.value = "";

    // Store updated todos in localStorage, re-render the list
    storecitynames();
    rendercitynames();
});

// In order to remove the items once they are complete
$(citynamesList).click(function (event) {
    var element = event.target;

    // If that element is a button...
    if (element.matches("button") === true) {
        // Get its data-index value and remove (splice) the todo element from the list
        var index = $(element.parentElement).attr("data-index");
        citynames.splice(index, 1);

        // Store updated todos in localStorage, re-render the list
        storecitynames();
        rendercitynames();
    }
});

// Another event listener will be added to to the input form in order to trigger the dailyweather and forecast functions:

citynamesForm.addEventListener("submit", function (event) {
    var selectedcityname = citynamesInput.value.trim();

    // Return from function early if submitted cityname is blank
    if (citynamesText === "") {
        return;
    }

    dailyweather(selectedcityname);
    getforecast(selectedcityname);
});





// First we need the daily weather API:

// var selectedcityname = "Sydney";




function dailyweather() {

    var APIKey = "166a433c57516f51dfab1f7edaed8413";

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + selectedcityname +
        "&appid=" + APIKey;

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })

        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {

            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);
            console.log(response.name);

            //create a variable for the date (from UNIX to date)
            var currentdate = moment.unix(response.dt).format("DD/MM/YYYY");

            // Transfer content to HTML
            $(".city").html("<h1>" + response.name + ": Weather Details:" + currentdate + "</h1>");
            $(".wind").text("Wind Speed: " + response.wind.speed);
            $(".humidity").text("Humidity: " + response.main.humidity);

            // Convert the temp to fahrenheit
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;

            //Convert from Kelvin to Celsisum
            var tempC = response.main.temp - 273.15;


            // add temp content to html
            $(".tempF").text("Temperature (F) " + tempF.toFixed(2));
            $(".tempC").text("Temperature (C) " + tempC.toFixed(2));

            // Log the data in the console as well
            console.log("Wind Speed: " + response.wind.speed);
            console.log("Humidity: " + response.main.humidity);
            console.log("Temperature (F): " + tempF);
            console.log("Temperature (C): " + tempC);

            //we also need the lat/long to pull the UV data and 5 day forecast
            var lat = response.coord.lat;
            var lon = response.coord.lon;

            console.log(lat);
            console.log(lon);

            getforecast(lat, lon);

        });

}

dailyweather();
// To get the UV rating and the 5-Day Forecast Use the One Call API

function getforecast(lat, lon) {

    //var selectedcityname = "sydney";

    var APIKey = "166a433c57516f51dfab1f7edaed8413";

    var queryURLonecall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

    // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
    // Here we run our AJAX call to the OpenWeatherMap API


    $.ajax({
        url: queryURLonecall,
        method: "GET"
    })

        // We store all of the retrieved data inside of an object called "response"
        .then(function (responseonecall) {

            // Log the queryURL
            console.log(queryURLonecall);

            // Log the resulting object
            console.log(responseonecall);

            // Transfer day1 content to HTML
            var datetime = moment.unix(responseonecall.daily[1].dt).format("DD/MM/YYYY");
            var dailyweathericoncode = responseonecall.daily[1].weather[0].icon;
            var weatherimage = "http://openweathermap.org/img/w/" + dailyweathericoncode + ".png";
            var day1temp = responseonecall.daily[1].temp.day;
            var day1humidity = responseonecall.daily[1].humidity;

            //first display the UV index in the current day
            $(".UVindex").text("Current UV Index:" + responseonecall.current.uvi);

            // the all of the info relevant to day 1 of the 5-day forecast
            $(".day1").html("Date: " + datetime + " & " + "Temp:" + day1temp + " & " + "Humidity:" + day1humidity);

            // Creating an element to hold the day 1 weather image and then append
            var image = $("<img>").attr("src", weatherimage);
            $(".day1").append(image);

            //create day two data

            var datetime = moment.unix(responseonecall.daily[2].dt).format("DD/MM/YYYY");
            var dailyweathericoncode = responseonecall.daily[2].weather[0].icon;
            var weatherimage = "http://openweathermap.org/img/w/" + dailyweathericoncode + ".png";
            var day2temp = responseonecall.daily[2].temp.day;
            var day2humidity = responseonecall.daily[2].humidity;

            // the all of the info relevant to day 2 of the 5-day forecast
            $(".day2").html("Date: " + datetime + " & " + "Temp:" + day2temp + " & " + "Humidity:" + day2humidity);

            // Creating an element to hold the day 1 weather image and then append
            var image = $("<img>").attr("src", weatherimage);
            $(".day2").append(image);

            //create day three data

            var datetime = moment.unix(responseonecall.daily[3].dt).format("DD/MM/YYYY");
            var dailyweathericoncode = responseonecall.daily[3].weather[0].icon;
            var weatherimage = "http://openweathermap.org/img/w/" + dailyweathericoncode + ".png";
            var day3temp = responseonecall.daily[3].temp.day;
            var day3humidity = responseonecall.daily[3].humidity;

            // the all of the info relevant to day 2 of the 5-day forecast
            $(".day3").html("Date: " + datetime + " & " + "Temp:" + day3temp + " & " + "Humidity:" + day3humidity);

            // Creating an element to hold the day 1 weather image and then append
            var image = $("<img>").attr("src", weatherimage);
            $(".day3").append(image);

            //create day four data

            var datetime = moment.unix(responseonecall.daily[4].dt).format("DD/MM/YYYY");
            var dailyweathericoncode = responseonecall.daily[4].weather[0].icon;
            var weatherimage = "http://openweathermap.org/img/w/" + dailyweathericoncode + ".png";
            var day4temp = responseonecall.daily[4].temp.day;
            var day4humidity = responseonecall.daily[4].humidity;

            // the all of the info relevant to day 2 of the 5-day forecast
            $(".day4").html("Date: " + datetime + " & " + "Temp:" + day4temp + " & " + "Humidity:" + day4humidity);

            // Creating an element to hold the day 1 weather image and then append
            var image = $("<img>").attr("src", weatherimage);
            $(".day4").append(image);

            //create day five data

            var datetime = moment.unix(responseonecall.daily[5].dt).format("DD/MM/YYYY");
            var dailyweathericoncode = responseonecall.daily[5].weather[0].icon;
            var weatherimage = "http://openweathermap.org/img/w/" + dailyweathericoncode + ".png";
            var day5temp = responseonecall.daily[5].temp.day;
            var day5humidity = responseonecall.daily[5].humidity;

            // the all of the info relevant to day 2 of the 5-day forecast
            $(".day5").html("Date: " + datetime + " & " + "Temp:" + day5temp + " & " + "Humidity:" + day5humidity);

            // Creating an element to hold the day 1 weather image and then append
            var image = $("<img>").attr("src", weatherimage);
            $(".day5").append(image);

        });

}
