
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










  init();