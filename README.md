This application allows a user to enter a city name and returns current weather conditions relevant to that city, as well as five days worth of weather forecasts. When the user enters the city name, it automatically drops into a favourites list (using local storage). The user can choose whether or not to delete that city from local storage, but if they click again on the city name in the favourites list, it will once again display the weather data relevant to that city. 

This application was developed using the 'OpenWeatherMap' API. There were two calls made on the API:
    1. Daily Weather. This first call was made in order to get:
     - Date/Time
     - City Name
     - Wind
     - Humidity
     - Location (in Lat/Lon)

    2. The 'One Call' option. This was then interrogated, using the lat/lon gleaned from the daily weather to get:
     - UVI
     - Date/Time for each of the subsequent day forecasts
     - Temperature relevant to the day
     - Humidty for each of the subsequent day forecasts
     - Weather ICON relevant to the day

The app uses the following major functions:

1. dailyweather. This function makes the DailyWeather API call and transfers the results to the relevant HTML elements. Importantly, it stores the lat/lon to variables which are made available for the getforecast function (which requires the lat/lon in order to make its API call).

2. getforecast. This function makes the OneCall API call as described above, and transfers the results to the relevant HTML elements. Within the function there are discrete sections to append the information to the different days. 

3. storecitynames. When a user inputs a city name, this function uses an eventlistner to store the trimmed version of the city name into a variable, then sends a stringified version of that variable to local storage, setting the key at the same time. The function also includes an error handling feature which returns the function if the user enters nothing. 

4. initcitynames. This function takes the stored city names (which which are now in local storage) and parses them (using JSON) back into a variable (array) which is then rendered to the favourites list, using the next function.

5. rendercitynames. This function cleares the favourites list and re-renders the list, using a loop over the array described in the previous function. It creates a list with each of the array elements. A button is added to each of the list elements, which provides the user with the option to delete that element of the list.

The deployed version of this application can be found at:  https://andrewmiddleton1.github.io/Bootcamp-Homework-Week-6/
