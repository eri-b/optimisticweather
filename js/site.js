var address;
var url;
var url2;
var url3;
var url4;

var urlMap;

var currentData = [[]];
var forecastData = [[]];

var maxPoints=[]; // define maxPoints as global var

var ipCity = "New York";
var ipReg = "New York";
var lat = "40.7128";
var lon = "-74.0060";

var sunset;
var sunrise;
var time24;

var isDark;
var current;

$.getJSON('http://api.ipstack.com/check?access_key=b0173b76f3a64ad0ca9a80b984ce0ea9&format=1', function(data) {
  ipCity = data.city;
  ipReg = data.region_name;
console.log(data);
  lat = data.latitude;
  lon = data.longitude;
  if (ipCity == " " || ipCity == ""){
    ipCity = "New York";
    ipReg = "New York";
    lat = "40.7128";
    lon = "-74.0060";
  }

}).done(function() {
  $(" #current input[type='text']").attr('value', ipCity);
    // Lat/Lng should have appeared from IP address
    newUrl();
    var ipWhole = ipCity +", "+ipReg;
    console.log(ipWhole);
    //awxCityLookUp(ipWhole); // accuweather
    document.title = 'Optimistic Weather - '+ ipCity;

}).fail(function() {
  $(" #current input[type='text']").attr('value', ipCity);
    // Lat/Lng should have appeared from IP address
    newUrl();
    var ipWhole = ipCity +", "+ipReg;
    console.log(ipWhole);
    //awxCityLookUp(ipWhole); // accuweather
    document.title = 'Optimistic Weather - '+ ipCity;
  });




// Create Dataset
$( document ).ready(function() {

    // This is now done above in the jetJson request
    // Lat/Lng should have appeared from IP address
    //newUrl();
    //awxCityLookUp(ipCity); // accuweather
});

// Once ajax is complete, create some HTML
$(document).ajaxStop(function() {
  fillChart2(forecastData);
  showWeather();
});


// When a new address is submitted, rebuild
$( "#newSearch" ).click(function() {
  address = $( "#text" ).val();
  codeAddress();
  //awxCityLookUp(address); // accuweather
  // Change document.title
  document.title = 'Optimistic Forecasting - '+ address;

    $(document).ajaxStop(function() {
      empty(); // gonna be unnecessary once test table is not being used.
      fillChart2(forecastData);
      showWeather();
    });

});

$("#current input[type='text']").click(function(){
  $(this).addClass('border');
});


// Finds Lat/Lon for any given search query
geocoder = new google.maps.Geocoder();

function codeAddress() {
    geocoder.geocode( { 'address' : address }, function( results, status ) {
        if( status == google.maps.GeocoderStatus.OK ) {
          lat = results[0].geometry.location.lat();
          lon = results[0].geometry.location.lng();

          // CALL WEATHER APIs after getting Lat/Lon Coords
          newUrl();

        } else {
            alert( 'Geocode was not successful for the following reason: ' + status );
        }
    } );
}

// Set new request URL and then call darksky
function newUrl(){
  url = "https://api.darksky.net/forecast/d5d98e87f7b5cfc3cacc4f0539238087/"+lat+","+lon+"?exclude=minutely,hourly,alerts,flags";

  url2 = "http://api.apixu.com/v1/forecast.json?key=2ebdee80f5764771b4b174024191204&q="+lat+","+lon;
  url2b = "http://api.apixu.com/v1/current.json?key=2ebdee80f5764771b4b174024191204&q="+lat+","+lon;

  url3 = "https://api.weatherbit.io/v2.0/forecast/daily?&lat="+lat+"&lon="+lon+"&key=39cea9619ee34fc184c0b3e8998f6c44&units=I";
  url3b = "https://api.weatherbit.io/v2.0/current?&lat="+lat+"&lon="+lon+"&key=39cea9619ee34fc184c0b3e8998f6c44&units=I";


  url4 = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&units=imperial&APPID=4b3cb43e74ccc7db969227da3d2e0064";
  url4b = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=imperial&APPID=4b3cb43e74ccc7db969227da3d2e0064";


  // MAP goes here
  urlMap = "https://darksky.net/map-embed/@radar,"+ lat +","+ lon +",7.js?embed=true&timeControl=true&fieldControl=true&defaultField=radar"

  //call postcribe library
  $('#mapDiv').html("");
  postscribe('#mapDiv', "<script id='radar' src='"+ urlMap +"'></script>");



  findWeather(); // Call Weather Apps


}


//Finds Weather for any given Lat/lon Darksky
function findWeather() {

// Dark Sky
$.ajax({
  url: url,
  dataType: "jsonp",
  success: function (pdata) {
      var temp = pdata.currently.temperature;
      var source = "<img style='filter:invert(100%);'title='Darksky' src='img/darksky.png' />";
      source = "Darksky";

      forecastData[0]=[]; // create inner arrary
      forecastData[0][0] = source;
      for (var i = 0; i < 5; i++) {
        forecastData[ 0 ][ 3*i+1 ] = pdata.daily.data[i].temperatureMax;
        forecastData[ 0 ][ 3*i+2 ] = pdata.daily.data[i].temperatureMin;
        forecastData[ 0 ][ 3*i+3 ] = pdata.daily.data[i].summary;
        //forecastData[ 0 ][ 3*i+3 ] = pdata.daily.data[i].icon;
      };

      currentData[0]=[];
      currentData[0][0]=source;
      currentData[0][1]= pdata.currently.temperature;//Temp
      currentData[0][2]= pdata.currently.summary;//Condition
      currentData[0][3]= "<a target='_blank' href='https://darksky.net/forecast/"+lat+","+lon+"'>"+source+"</a>";//URL



  }
});




  // Open Weather Map (Need to pay $40/mo for daily forecast access)

  $.ajax({
    url : url4,
    dataType : "jsonp",
    success : function(pdata) {
      var temp = pdata.list[0].main.temp;
      var source = "The Open Weather Map";
      //console.log(pdata);

      forecastData[1]=[]; // create inner arrary
      forecastData[1][0] = source;
      for (var i = 0; i < 5; i ++) {
      	var z = 8*i;

        forecastData[ 1 ][ 3*i+3 ] = pdata.list[z].weather[0].description;
        var max = -999;
        var min = 999;
        for(j=z; j < z+8; j++){
        	if(pdata.list[j].main.temp_max > max){max = pdata.list[j].main.temp_max;}
        	if(pdata.list[j].main.temp_min < min){min = pdata.list[j].main.temp_min;}
        }
        forecastData[ 1 ][ 3*i+1 ] = max;
        forecastData[ 1 ][ 3*i+2 ] = min;

      };

      $.ajax({
            url : url4b,
            dataType : "json",
            success : function(pdata) {
              console.log(pdata);
              //var source = "<img title='The Weather Channel' src='img/openweather.png' />";
              var source = "Open Weather";
              var row = 3;

              currentData[1]=[];
              currentData[1][0]=source;
              currentData[1][1]= pdata.main.temp;//Temp
              currentData[1][2]= pdata.weather[0].description;//Condition
              currentData[1][3]= "<a target='_blank' href='http://openweathermap.org'>"+source+"</a>";//URL

            }
          });
    }
  });






// Weatherbit NOAA
$.ajax({
    url : url3,
    dataType : "jsonp",
    success : function(pdata) {

      var source = "NOAA";

      forecastData[2]=[]; // create inner arrary
      forecastData[2][0] = source;
      for (var i = 0; i < 5; i++) {
        forecastData[ 2 ][ 3*i+1 ] = pdata.data[i].max_temp;
        forecastData[ 2 ][ 3*i+2 ] = pdata.data[i].min_temp;
        forecastData[ 2 ][ 3*i+3 ] = pdata.data[i].weather.description;
      };

      // Delayed until after forecast is filled
      // Weather Underground / Weather.com (Current)
        $.ajax({
            url : url3b,
            dataType : "jsonp",
            success : function(pdata) {

              var source = "<img title='NOAA' src='img/noaa.svg' />";
              source = "NOAA"

              currentData[2]=[];
              currentData[2][0]=source;
              currentData[2][1]= pdata.data[0].temp;//Temp
              currentData[2][2]= pdata.data[0].weather.description;//Condition
              currentData[2][3]= "<a target='_blank' href='http://forecast.weather.gov/MapClick.php?lat="+lat+"&lon="+lon+"'>"+source+"</a>";//URL

              sunset = pdata.data[0].sunset;
              sunrise = pdata.data[0].sunrise;
              time24 = pdata.data[0].ob_time;
              time24 = time24.slice(11);
              checkSunset();
            }
          });

    }
  });




}

  var awxCityLookUp = function (freeText) {
      locationUrl = "http://dataservice.accuweather.com/locations/v1/cities/search?q=" + freeText + "&apikey=9soKD1gtNHGo7AGn8f23YtqaSaTG1wAv";
      $.ajax({
          type: "GET",
          url: locationUrl,
          dataType: "jsonp",
          cache: true,                    // Use cache for better reponse times
          //jsonpCallback: "awxCallback",   // Prevent unique callback name for better reponse times
          success: function (data) { awxGetCurrentConditions(data); }
      });
  };

  var awxGetCurrentConditions = function (data) {
    var locationKey =  data[0].Key;


    var forecastConditionsUrl = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" +
          locationKey + ".json?&apikey=9soKD1gtNHGo7AGn8f23YtqaSaTG1wAv";

    var currentConditionsUrl = "http://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=9soKD1gtNHGo7AGn8f23YtqaSaTG1wAv";
    console.log(currentConditionsUrl);

      $.ajax({
          type: "GET",
          url: forecastConditionsUrl,
          dataType: "jsonp",
          cache: true,                    // Use cache for better reponse times
          //jsonpCallback: "awxCallback",   // Prevent unique callback name for better reponse times
          success: function (data) {

            var source = "<img title='Accuweather' src='img/accuweather.jpg' />";
            source = "Accuweather";


            forecastData[3]=[]; // create inner array
            forecastData[3][0] = source;
            for (var i = 0; i < 5; i++) {
              forecastData[ 3 ][ 3*i+1 ] = data.DailyForecasts[i].Temperature.Maximum.Value;
              forecastData[ 3 ][ 3*i+2 ] = data.DailyForecasts[i].Temperature.Minimum.Value;
              forecastData[ 3 ][ 3*i+3 ] = data.DailyForecasts[i].Day.IconPhrase;
            };

          }
      });

      $.ajax({
          type: "GET",
          url: currentConditionsUrl,
          dataType: "jsonp",
          cache: true,                    // Use cache for better reponse times
          //jsonpCallback: "awxCallback",   // Prevent unique callback name for better reponse times
          success: function (data) {

            var source = "<img title='Accuweather' src='img/accuweather.jpg' />";
            source = "Accuweather";

              currentData[3]=[];
              currentData[3][0]=source;
              currentData[3][1]= data[0].Temperature.Imperial.Value; //Temp
              currentData[3][2]= data[0].WeatherText; //Condition
              currentData[3][3]= "<a target='_blank' href='"+data[0].Link+"'>"+source+"</a>";//URL


          }
      });



  };



//////// Misc
var d = new Date();

var today = d.getDay();
var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var days = [];
var numDays = 5;
for (var i = 0; i < numDays; i++) {
  days[i]= week[today + i ];
};
fillHeader(days);

// fill charts with header info
function fillHeader(info){
  $('#weather2 table tr:nth-child(1)').append("<th>Source</th><th colspan='3'>Currently</th>");
  for (var i = 0; i < numDays; i++) {
    $('#weather2 table tr:nth-child(1)').append("<th colspan='3'>"+days[i]+"</th>");
  };


  for (var i = 0; i < numDays; i++) {
    $('#weather3 table tr:nth-child('+ (i+2)+') td:nth-child(1)').html(days[i+1]);
  };

}

// fill charts with weather
function fillChart2(forecastData){

  // These are deprecated!
  /*
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < currentData[0].length; j++) {
      $('#weather2 table tr:nth-child('+ (i+2) +')').append("<td>"+currentData[i][j]+"</td>");
    };

    //j=1 because you don't want to repeat the source.
    for (var j = 1; j < forecastData[0].length; j++) {
      $('#weather2 table tr:nth-child('+ (i+2) +')').append("<td>"+forecastData[i][j]+"</td>");
    };
  };
  */


  //Find best Weather (Forecast)!

  //cycle through all days
  for (var j = 0; j < numDays; j++) {
      var weatherA;


      // FORECAST!
      // On given day, cycle through forecasts
      maxPoints=[-999999, ""]; //reset max

      for (var i = 0; i < forecastData.length; i++) {
        weatherA = forecastData[i][3*j + 3];
        pointSystem(weatherA, i);
      };



      // This fills the winning weather!
      var winner = maxPoints[1]; //this is the index of the winning entry

      var winningWeather = forecastData[winner][3*j + 3];

      current = false; // needed for check inside findIcon()

      var icon = findIcon(winningWeather);

      //$('#weather3 table tr:nth-child('+ (j+1)+') td:nth-child(2)').html(forecastData[winner][3*j + 3]); //weather (col 2)
      $('#weather3 table tr:nth-child('+ (j+1)+') td:nth-child(2)').html(icon); //weather (col 2)

      $('#weather3 table tr:nth-child('+ (j+1)+') td:nth-child(3)').html(Math.round(forecastData[winner][3*j + 1])); //max (col 3)
      $('#weather3 table tr:nth-child('+ (j+1)+') td:nth-child(4)').html(Math.round(forecastData[winner][3*j + 2])); //min (col 4)
      $('#weather3 table tr:nth-child('+ (j+1)+') td:nth-child(5)').html(currentData[winner][3]); //source (col 5)


      //Now we can fill the losing weather..

      var notWinner = [0, 1, 2];

      var result = notWinner.filter(function(elem){
         return elem != winner;
      });

      icon = findIcon(forecastData[result[0]][3*j + 3]);
      //$('#weather3 table tr:nth-child('+ (j+1)+') td:nth-child(6)').html(forecastData[result[0]][3*j + 3]); //Weather
      $('#weather3 table tr:nth-child('+ (j+1)+') td:nth-child(6)').html(icon); //Weather
      $('#weather3 table tr:nth-child('+ (j+1)+') td:nth-child(7)').html(currentData[result[0]][3]); //Source

      icon = findIcon(forecastData[result[1]][3*j + 3]);
      //$('#weather3 table tr:nth-child('+ (j+1)+') td:nth-child(8)').html(forecastData[result[1]][3*j + 3]); //Weather
      $('#weather3 table tr:nth-child('+ (j+1)+') td:nth-child(8)').html(icon); //Weather
      $('#weather3 table tr:nth-child('+ (j+1)+') td:nth-child(9)').html(currentData[result[1]][3]); //Source


      // this was deactivated when accuweather was removed
      //icon = findIcon(forecastData[result[2]][3*j + 3]);
      //$('#weather3 table tr:nth-child('+ (j+1)+') td:nth-child(10)').html(icon); //Weather
      //$('#weather3 table tr:nth-child('+ (j+1)+') td:nth-child(11)').html(currentData[result[2]][3]); //Source

  };


      // CURRENT! (Doesn't need to be inside of numDays loop)

      var weatherB;

      maxPoints=[-999999, ""]; //reset max

      //current weather calc
      for (var i = 0; i < currentData.length; i++) {
        weatherB = currentData[i][2]; //weather is in col2
        pointSystem(weatherB, i);
      };

      // This fills the winning weather!
      winner = maxPoints[1]; //this is the index of the winning entry

      current = true; // needed for check inside findIcon()
      icon = findIcon(currentData[winner][2]);

      $('#curW').html(currentData[winner][2]); //weather
      $('#curI').html(icon); //weather
      $('#curT').html(Math.round(currentData[winner][1])+"&#176"); //temperature
      $('#curS').html(currentData[winner][3]); //source/link


      //Now we can fill the losing weather..

      //Not currently working..

      // var notWinner = [0, 1, 2, 3];

      // var result = notWinner.filter(function(elem){
      //    return elem != winner;
      // });

      // icon = findIcon(currentData[result[0]][2]); // where the weather resides
      // $('.currLoser div:nth-child(1) span:nth-child(1)').html(icon);
      // $('.currLoser div:nth-child(1) span:nth-child(2)').html(currentData[result[0]][3]);

      // icon = findIcon(currentData[result[1]][2]); // where the weather resides
      // $('.currLoser div:nth-child(2) span:nth-child(1)').html(icon);
      // $('.currLoser div:nth-child(2) span:nth-child(2)').html(currentData[result[1]][3]);

      // icon = findIcon(currentData[result[2]][2]); // where the weather resides
      // $('.currLoser div:nth-child(3) span:nth-child(1)').html(icon);
      // $('.currLoser div:nth-child(3) span:nth-child(2)').html(currentData[result[2]][3]);

}

//
function findIcon(weather){
  var icon = "default.png";
  var weather = weather.toUpperCase();

  // lower down the list is given overriding preference!

  if(weather.includes("THUNDERSTORM")){icon = "thunderstorm.png"}
  if(weather.includes("DRIZZLE")){icon = "drizzle.png"}
  if(weather.includes("SHOWERS")){icon = "drizzle.png"}
  if(weather.includes("RAIN")){icon = "drizzle.png"}
  if(weather.includes("PRECIPITATION")){icon = "drizzle.png"}
  if(weather.includes("FOGGY")){icon = "fog.png"}
  if(weather.includes("FOG")){icon = "fog.png"}
  if(weather.includes("SNOW")){icon = "snow.png"}
  if(weather.includes("FLURRIES")){icon = "snow.png"}
  if(weather.includes("CLOUDY")){icon = "cloudy.png"}
  if(weather.includes("DREARY")){icon = "cloudy.png"}
  if(weather.includes("CLOUDS")){icon = "cloudy.png"}
  if(weather.includes("OVERCAST")){icon = "cloudy.png"}

  // if finding current forecast at night, change icons
  if((isDark==true) && (current == true)){

    if(weather.includes("BROKEN")){icon = "partlycloudynight.png"}
    if(weather.includes("SCATTERED")){icon = "partlycloudynight.png"}
    if(weather.includes("INTERMITTENT")){icon = "partlycloudynight.png"}
    if(weather.includes("SOME")){icon = "partlycloudynight.png"}
    if(weather.includes("FEW")){icon = "partlycloudynight.png"}
    if(weather.includes("CHANCE")){icon = "partlycloudynight.png"}
    if(weather.includes("PARTLY")){icon = "partlycloudynight.png"}
    if(weather.includes("MOSTLY SUNNY")){icon = "clearnight.png"}
    if(weather.includes("CLEAR")){icon = "clearnight.png"}
  }
  else{

    if(weather.includes("BROKEN")){icon = "partlysunny.png"}
    if(weather.includes("SCATTERED")){icon = "partlysunny.png"}
    if(weather.includes("INTERMITTENT")){icon = "partlysunny.png"}
    if(weather.includes("CHANCE")){icon = "partlysunny.png"}
    if(weather.includes("SOME")){icon = "partlysunny.png"}
   	if(weather.includes("FEW")){icon = "partlysunny.png"}
    if(weather.includes("PARTLY")){icon = "partlysunny.png"}
    if(weather.includes("MOSTLY SUNNY")){icon = "sunny.png"}
    if(weather.includes("SUNNY")){icon = "sunny.png"}
    if(weather.includes("CLEAR")){icon = "sunny.png"}
  }


  var iconHtml = "<img src='icons/"+icon+"' title='"+weather+"' />";
  return iconHtml;
}

// This rates the weather!
function pointSystem(str, i){

  var points=0;
  var str = str.toUpperCase();
  if(str.includes("CLEAR")){points+= 15;}
  if(str.includes("SUN")){points+= 10;}
  if(str.includes("SCATTERED")){points+= 3;}
  if(str.includes("BROKEN")){points+= 3;}
  if(str.includes("INTERMITTENT")){points+= 3;}
  if(str.includes("PARTLY")){points+= 3;}
  if(str.includes("CHANCE")){points+= 2;}
  if(str.includes("FLURRIES")){points+= -4;}
  if(str.includes("FOG")){points+= -9;}
  if(str.includes("CLOUDY")){points+= -9;}
  if(str.includes("PRECIPITATION")){points+= -10;}
  if(str.includes("THUNDERSTORM")){points+= -10;}
  if(str.includes("OVERCAST")){points+= -8;}
  if(str.includes("HEAVY")){points+= -6;}
  if(str.includes("RAIN")){points+= -10;}
  if(str.includes("SNOW")){points+= -9;}
  if(str.includes("SHOWERS")){points+= -11;}
  //console.log(points+" and source is "+ forecastData[i][0]);
  if (points > (maxPoints[0])){
    maxPoints = [ points, i];
  }
}

function empty(){
  //$('#weather2 table tr:not(:first-child)').html("");
  $('#weather3 table tr td:not(:first-child)').html("");
  $('.curr').html("");
}

function showWeather(){
  $('#weather3').addClass('vis');
}

$('#extra').click(function(){
  $('body').toggleClass('open');
  $('.z').toggleClass('toggle');
})

$('#info').click(function(){
  $('#info > div').toggle();
  $('#info > a').toggle();
})


//Date Stuff

var now = new Date();

// You can use one of several named masks
var nowD = now.format("mediumDate");
var nowT = now.format("shortTime");

$('.date div:nth-child(1)').html(nowT);
$('.date div:nth-child(2)').html(nowD);

function checkSunset(){
  isDark= false;
  //check whether it's daylight
  console.log("Time is "+time24);
  console.log("Sunset is "+sunset);
  console.log("Sunrise is "+sunrise);

  //this conditional is necessary to account for the fact that sunrise can happen 'after' sunset
  if(sunset > sunrise){

    if (time24 > sunset){ isDark = true;}
    if (time24 < sunrise){ isDark = true;}
  }

  //sunrise >sunset
  else{

    if ((time24 > sunset) && (time24 < sunrise)){ isDark = true;}
  }
}


// Allow enter key to search
$(document).on('keypress', function(e) {
  if(e.which == 13) {
    $( "#newSearch" ).click();
    }
});

/*
$('input[type="text"]')
    // event handler
    .keyup(resizeInput)
    // resize on page load
    .each(resizeInput);
*/
