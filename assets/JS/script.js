
  var apiKey = "ed53a88702cbe5ce8a7ff26fd8f283d7";
  var searchform = $("#search-form");
  var prevSearch = $("#prev-search");
  var weather = $("#current-date");
  var forecast = $("#5-day-forecast");
  var forecastTitle= $("#forecast-title")
  
  var cityList = []
  var isClearing = false;
  var clearMessageCode;
  
  // Set the day
  var today = dayjs();
  
  function init() {
      searchform.children("button").on("click", getData);
      initiateStorage();
      initiatePrev();
  }
  
  // Checks if local storage has any items and puts them in an array
  function initiateStorage() {
      if(localStorage.getItem("cityList") !== null) {
          cityList = JSON.parse(localStorage.getItem("cityList"));
      }
      localStorage.setItem("cityList", JSON.stringify(cityList));
  }
  
  // Creates buttons of prev searches if there were any
  function initiatePrev() {
      var i = 0;
      while(i < cityList.length && i < 10) {
          var prev = $("<button>");
          prev.text(`${cityList[i]}`);
          prev.attr("class", "col-8 my-1 btn btn-dark");
          prevSearch.append(prev);
          i++;
      }
      prevSearch.children("button").on("click", getData)
  }
  
  // Takes the value in the input element or the prev searches
  // Uses that string to access the API for geocoding
  // Passes geocode into API for weather
  function getData(event) {
      event.preventDefault();
      var city = "";
      if(event.target.textContent === "Search") {
          city = searchform.children("input").val();
          searchform.children("input").val("");
      } else {
          city = event.target.textContent;
      }
      city = city.toUpperCase();
      if(!city) {
          invalidInput();
          return;
      }
  
      var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=ed53a88702cbe5ce8a7ff26fd8f283d7&units=Imperial`;
      fetch(apiUrl)
          .then(function (response) {
              return response.json();
          })
          .then(function (data) {
              if(data.length) {
                  var lat = data[0].lat;
                  var lon = data[0].lon;
                  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=ed53a88702cbe5ce8a7ff26fd8f283d7&units=Imperial`;
                  fetch(apiUrl)
                      .then(function (response) {
                          return response.json();
                      })
                      .then(function (data) {
                          displayWeather(data, city);    
                          displayForecast(data);
                          saveCity(city);   
                      });
              } else {
                  invalidInput();
              }
          });
  }
  
  // Handles an bad response from API
  // Displays the message returned from API
  function invalidInput() {
      if(!isClearing) {
          var messageSpace = $("<p>");
          messageSpace.text("Please provide a valid city");
          messageSpace.css("color", "red");
          searchform.append(messageSpace); 
          clearAnswer();  
      } else {
          clearAnswer();
      }
  }
  
  // Clears the invalid input message
  // Checks if a timeout has already been set
  // If it has it clears the previous timeout and calls itself
  function clearAnswer() {
      if(isClearing) {
          isClearing = false;
          clearTimeout(clearMessageCode);
          clearAnswer();
      } else {
          isClearing = true;
          clearMessageCode = setTimeout(function() {
              searchform.children().eq(3).remove();
              isClearing = false;
          }, 1500);
      }
  }
  
  // Displays the current weather
  function displayWeather(data, city) {
      var title = weather.children().eq(0).children("h2")
      var conditions = weather.children().eq(0).children("img");
      var temp = weather.children().eq(1);
      var wind = weather.children().eq(2);
      var humidity = weather.children().eq(3);
      var uvIndex = weather.children().eq(4);
  
      weather.addClass("card bg-light mb-3");
  
      title.text(`${city} ${today.format("MM/DD/YYYY")}`);
      conditions.attr("src",`https://openweathermap.org/img/w/${data.current.weather[0].icon}.png`);
      temp.text(`Temp: ${data.current.temp}°F`);
      wind.text(`Wind: ${Math.round((data.current.wind_speed * 3.6))} MPH`);
      humidity.text(`Humidty: ${data.current.humidity}%`);
      uvIndex.text(`UV Index: ${data.current.uvi}`);
  
      var uv = data.current.uvi;
      if(uv < 4) {
          uvIndex.css("background-color", "green");
      }else if(uv < 7) {
          uvIndex.css("background-color", "yellow");
      }else {
          uvIndex.css("background-color", "red");
      }
  
  }
  
  // Displays the 5 day forecast
  function displayForecast(data) {
      forecastTitle.css("visibility", "visible");
      for(var i = 0; i < 5; i++) {
          var date = forecast.children().eq(i).children().eq(0);
          var conditions = forecast.children().eq(i).children("img");
          var temp = forecast.children().eq(i).children().eq(2);
          var wind = forecast.children().eq(i).children().eq(3);
          var humidity = forecast.children().eq(i).children().eq(4);
  
          forecast.children().eq(i).addClass("card text-white bg-dark mb-3 mx-1")
  
          var index = i + 1;
          date.text(today.add((i + 1), "d").format("MM/DD/YYYY"));
          conditions.attr("src",`https://openweathermap.org/img/w/${data.daily[index].weather[0].icon}.png`);
          temp.text(`Temp: ${data.daily[index].temp.day}°F`);
          wind.text(`Wind: ${Math.round(data.daily[index].wind_speed * 3.6)} MPH`);
          humidity.text(`Humidity: ${data.daily[index].humidity}%`);
      }
  }
  
  /* Chacks if there are any cities saved locally
  *  If there are is populates them in an array
  *  Checks if the city is already recorded and exits if yes
  *  Adds the city to the array and updates local storage */
  function saveCity(city) {
      if(localStorage.getItem("cityList") !== null) {
          cityList = JSON.parse(localStorage.getItem("cityList"));
      }
      while(cityList.length > 9) {
          cityList.pop();
      }
      for(var i = 0; i < cityList.length; i++) {
          if(city === cityList[i]) {
              return
          }
      }
      cityList.reverse();
      cityList.push(city);
      cityList.reverse();
  
      localStorage.setItem("cityList", JSON.stringify(cityList));
      updatePrev();
  }
  
  // Creates a new button if less than ten buttons
  // Otherwise it renames the buttons
  function updatePrev() {
      if(cityList.length < 10) {
          var prev = $("<button>");
          prev.text(`${cityList[0]}`);
          prev.attr("class", "col-8 my-1 btn btn-dark");
          prevSearch.append(prev);
      } else {
          for(var i = 0; i < 10; i++) {
              prevSearch.children().eq(i).text(cityList[i]);
          }
      }    
  }
  
  init();