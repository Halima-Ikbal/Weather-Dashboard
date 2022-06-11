
  var searchform= $("#serch-form");
  var history= $("#history");
  var tooday= $("#tooday");
  var future= $("#5-day-forecast");
  var forecast= $("#forecast");

  var cityList= []
  var isClearing = false;
  var clearMessageCode;

  //Set the day
  var today= dayjs();
  function init() {
    searchform.children("button").on("click", getData);
    initiateStorage();
    initiatePrev();
  }

  // checks local storage has any items and put in array
  function initiateStorage() {
    if(localStorage.getItem("cityList") !== null) {
      cityList = JSON.parse(localStorage.getItem("cityList"));
    }
    localStorage.setItem("cityList", JSON.stringify(cityList));
  }


  var requestUrl =`https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=ed53a88702cbe5ce8a7ff26fd8f283d7`;
  fetch(requestUrl)
  // get response and turn it into objects
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // get city's longitude and latitude
      if(data.length) {
        var lat=data[0].lat;
        var lon=data[0].lon;
        requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=ed53a88702cbe5ce8a7ff26fd8f283d7`
        fetch(requestUrl)
          .then(function (dresponse) {
            return response.json();

          })
          .then(function (data){
            displayWeather(data, city);
            dispayForecast(data);
            saveCity(city);
          });
      } else{
        invalidInput();
      }
    });










  init();