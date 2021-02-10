google.charts.load('current', {'packages':['corechart', 'scatter']});
google.charts.setOnLoadCallback(DrawTideChart);
google.charts.setOnLoadCallback(DrawWeatherChart);
document.getElementById("GeolocationOK").click();

var zArrayWind = Array;
var zArrayTimeWind = Array;
var zArrayWindGusts = Array;
var zArrayTimeWindGusts = Array;
var zArrayWave = Array;
var zArrayTimeWave = Array;

function DMfromDMS() {
  var degN= Number(document.getElementById("DMS").elements.namedItem("degN").value);
  var minN= Number(document.getElementById("DMS").elements.namedItem("minN").value);
  var secN= Number(document.getElementById("DMS").elements.namedItem("secN").value);
  var SecInMinN = secN/60;
  var minNewN = minN + SecInMinN;

  var degE= Number(document.getElementById("DMS").elements.namedItem("degE").value);
  var minE= Number(document.getElementById("DMS").elements.namedItem("minE").value);
  var secE= Number(document.getElementById("DMS").elements.namedItem("secE").value);
  var SecInMinE = secE/60;
  var minNewE = minE + SecInMinE;

  document.getElementById("resultatN").innerHTML = degN.toString() + "&deg " + minNewN.toFixed(3).toString() + "' " + document.getElementById("hemisphere3").value.substring(0,1).toUpperCase();
  document.getElementById("resultatE").innerHTML = degE.toString() + "&deg " + minNewE.toFixed(3).toString() + "' " + document.getElementById("hemisphere4").value.substring(0,1).toUpperCase();

  UpdateData();
};

function DMfromDD() {
  var degN = Number(document.getElementById("DD").elements.namedItem("degN").value);
  var degE = Number(document.getElementById("DD").elements.namedItem("degE").value);

  var degdecN = (degN - Math.floor(degN))*60;
  var degdecE = (degE - Math.floor(degE))*60;

  document.getElementById("resultatN").innerHTML = Math.floor(degN).toString() + "&deg " + degdecN.toFixed(3).toString() + "' " + document.getElementById("hemisphere1").value.substring(0,1).toUpperCase();
  document.getElementById("resultatE").innerHTML = Math.floor(degE).toString() + "&deg " + degdecE.toFixed(3).toString() + "' " + document.getElementById("hemisphere2").value.substring(0,1).toUpperCase();

  UpdateData();
};

function DMfromDM() {
  var degN = Number(document.getElementById("DM").elements.namedItem("degN").value);
  var degE = Number(document.getElementById("DM").elements.namedItem("degE").value);
  var degdecN = Number(document.getElementById("DM").elements.namedItem("minN").value);
  var degdecE = Number(document.getElementById("DM").elements.namedItem("minE").value);

  document.getElementById("resultatN").innerHTML = Math.floor(degN).toString() + "&deg " + degdecN.toFixed(3).toString() + "' " + document.getElementById("hemisphere5").value.substring(0,1).toUpperCase();
  document.getElementById("resultatE").innerHTML = Math.floor(degE).toString() + "&deg " + degdecE.toFixed(3).toString() + "' " + document.getElementById("hemisphere6").value.substring(0,1).toUpperCase();

  UpdateData();
}

function DMfromUTM() {
  var utm = "+proj=utm +zone=" + document.getElementById("UTM").elements.namedItem("zone").value;
  var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
  var resultUTM = proj4(utm,wgs84,[Number(document.getElementById("UTM").elements.namedItem("northing").value),Number(document.getElementById("UTM").elements.namedItem("easting").value)]);

  var degE = resultUTM.toString().substring(0,resultUTM.toString().indexOf(","));
  var degN = resultUTM.toString().substring(resultUTM.toString().indexOf(",")+1,resultUTM.toString().length);

  var degdecE = (degE - Math.floor(degE))*60;
  var degdecN = (degN - Math.floor(degN))*60;

  document.getElementById("resultatN").innerHTML = Math.floor(degN).toString() + "&deg " + degdecN.toFixed(3).toString() + "' " + document.getElementById("hemisphere1").value.substring(0,1).toUpperCase();
  document.getElementById("resultatE").innerHTML = Math.floor(degE).toString() + "&deg " + degdecE.toFixed(3).toString() + "' " + document.getElementById("hemisphere2").value.substring(0,1).toUpperCase();

  UpdateData();
};

function DMfromMGRS() {
  var resultMGRS = mgrs.toPoint(document.getElementById("MGRS").elements.namedItem("zone").value+document.getElementById("MGRS").elements.namedItem("zone2").value+document.getElementById("MGRS").elements.namedItem("easting").value+document.getElementById("MGRS").elements.namedItem("northing").value).toString();

  var degE = resultMGRS.toString().substring(0,resultMGRS.toString().indexOf(","));
  var degN = resultMGRS.toString().substring(resultMGRS.toString().indexOf(",")+1,resultMGRS.toString().length);

  var degdecE = (degE - Math.floor(degE))*60;
  var degdecN = (degN - Math.floor(degN))*60;

  document.getElementById("resultatN").innerHTML = Math.floor(degN).toString() + "&deg " + degdecN.toFixed(3).toString() + "' N";
  document.getElementById("resultatE").innerHTML = Math.floor(degE).toString() + "&deg " + degdecE.toFixed(3).toString() + "' Ø";

  UpdateData();
};

function UpdateData() {
  UpdateMapLocation();
  DrawTideChart();
  DrawWeatherChart();
};

function UpdateMapLocation() {
  var source = "+proj=longlat +datum=WGS84 +no_defs ";
  var dest = "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  var resultN = document.getElementById("resultatN").innerHTML;
  var resultE = document.getElementById("resultatE").innerHTML;
  var N_deg = resultN.substring(0,resultN.indexOf("°"));
  var N_min = resultN.substring(resultN.indexOf(" ")+1, resultN.indexOf("'"));
  var E_deg = resultE.substring(0,resultE.indexOf("°"));
  var E_min = resultE.substring(resultE.indexOf(" ")+1, resultE.indexOf("'"));
  var y_value = Number(N_deg) + Number(N_min)/60;
  var x_value = Number(E_deg) + Number(E_min)/60;
  var result = proj4(source, dest, [x_value, y_value]).toString();
  var northing = result.toString().substring(0,result.toString().indexOf(","));
  var easting = result.toString().substring(result.toString().indexOf(",")+1,result.toString().length);
  var UTM33Lon = Math.round(northing); //norgeskart.no har byttet på aksene
  var UTM33Lat  = Math.round(easting);
  var Layer = document.getElementById("map_settings").elements.namedItem("map_type").value;

  zN = y_value;
  zE = x_value;

  document.getElementById("map_area").src = "https://www.norgeskart.no/#!?project=norgeskart&layers=" + Layer + "&zoom=13&lat=" + UTM33Lat + "&lon=" + UTM33Lon + "&markerLat=" + UTM33Lat + "&markerLon=" + UTM33Lon + "&type=1";
  document.getElementById("map_area").parentNode.replaceChild(document.getElementById("map_area").cloneNode(), document.getElementById("map_area"));
};

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
};

function deg2rad(deg) {
  return deg * (Math.PI/180)
};

function DrawTideChart() {
  var source = "+proj=longlat +datum=WGS84 +no_defs ";
  var dest = "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";

  var resultN = document.getElementById("resultatN").innerHTML;
  var resultE = document.getElementById("resultatE").innerHTML;

  var N_deg = resultN.substring(0,resultN.indexOf("°"));
  var N_min = resultN.substring(resultN.indexOf(" ")+1, resultN.indexOf("'"));
  var E_deg = resultE.substring(0,resultE.indexOf("°"));
  var E_min = resultE.substring(resultE.indexOf(" ")+1, resultE.indexOf("'"));

  var y_value = Number(N_deg) + Number(N_min)/60;
  var x_value = Number(E_deg) + Number(E_min)/60;

  var currentDate;
  var currentHour;
  var endDate;

  function pad(n){return n<10 ? '0'+n : n}
    currentDate = new Date();
    var endDate = new Date();
    currentDate = currentDate.getFullYear() + "-" + pad((currentDate.getMonth() + 1)) + "-" + pad(currentDate.getDate());
    endDate = endDate.getFullYear() + "-" + pad((endDate.getMonth() + 1)) + "-" + pad((endDate.getDate() + 1));
    currentHour = pad(new Date().getHours()-5);

    var url = "http://api.sehavniva.no/tideapi.php?lat=" + y_value + "&lon=" + x_value + "&fromtime=" + currentDate + "T" + currentHour + "%3A00&totime=" + endDate + "T" + currentHour + "%3A00&datatype=all&refcode=cd&place=&file=&lang=nn&interval=10&dst=0&tzone=&tide_request=locationdata";

    var zArrayObs;
    var zArrayPre;
    var zArrayNon;
    var zArrayFor;
    var zArrayTimeObs;
    var zArrayTimePre;
    var zArrayTimeNon;
    var zArrayTimeFor;

    fetch(url)
    .then(x => x.text())
    .then(function(response){
      let parser = new DOMParser();
      let xml = parser.parseFromString(response, "text/xml");
      let countObs = xml.evaluate('count(/tide/locationdata/data[position()=1]/*)', xml, null, XPathResult.ANY_TYPE, null).numberValue;
      let countPre = xml.evaluate('count(/tide/locationdata/data[position()=2]/*)', xml, null, XPathResult.ANY_TYPE, null).numberValue;
      let countNone = xml.evaluate('count(/tide/locationdata/data[position()=3]/*)', xml, null, XPathResult.ANY_TYPE, null).numberValue;
      let countForecast = xml.evaluate('count(/tide/locationdata/data[position()=4]/*)', xml, null, XPathResult.ANY_TYPE, null).numberValue;

      zArrayObs = Array(countObs);
      zArrayPre = Array(countPre);
      zArrayNon = Array(countNone);
      zArrayFor = Array(countForecast);
      zArrayTimeObs = Array(countObs);
      zArrayTimePre = Array(countPre);
      zArrayTimeNon = Array(countNone);
      zArrayTimeFor = Array(countForecast);

      for (i = 1; i <= countObs; i++) {
        zArrayObs[i-1] = Number(xml.evaluate('/tide/locationdata/data[position()=1]/waterlevel[position()=' + i + ']/@value', xml, null, XPathResult.ANY_TYPE, null).iterateNext().textContent);
        zArrayTimeObs[i-1] = xml.evaluate('/tide/locationdata/data[position()=1]/waterlevel[position()=' + i + ']/@time', xml, null, XPathResult.ANY_TYPE, null).iterateNext().textContent;
      }

      for (i = 1; i <= countPre; i++) {
        zArrayPre[i-1] = Number(xml.evaluate('/tide/locationdata/data[position()=2]/waterlevel[position()=' + i + ']/@value', xml, null, XPathResult.ANY_TYPE, null).iterateNext().textContent);
        zArrayTimePre[i-1] = xml.evaluate('/tide/locationdata/data[position()=2]/waterlevel[position()=' + i + ']/@time', xml, null, XPathResult.ANY_TYPE, null).iterateNext().textContent;
      }

      for (i = 1; i <= countNone; i++) {
        zArrayNon[i-1] = Number(xml.evaluate('/tide/locationdata/data[position()=3]/waterlevel[position()=' + i + ']/@value', xml, null, XPathResult.ANY_TYPE, null).iterateNext().textContent);
        zArrayTimeNon[i-1] = xml.evaluate('/tide/locationdata/data[position()=1]/waterlevel[position()=' + i + ']/@time', xml, null, XPathResult.ANY_TYPE, null).iterateNext().textContent;
      }

      for (i = 1; i <= countForecast; i++) {
        zArrayFor[i-1] = Number(xml.evaluate('/tide/locationdata/data[position()=4]/waterlevel[position()=' + i + ']/@value', xml, null, XPathResult.ANY_TYPE, null).iterateNext().textContent);
        zArrayTimeFor[i-1] = xml.evaluate('/tide/locationdata/data[position()=4]/waterlevel[position()=' + i + ']/@time', xml, null, XPathResult.ANY_TYPE, null).iterateNext().textContent;
      }

      var data = new google.visualization.DataTable();

      data.addColumn('datetime', 'tid');
      data.addColumn('number', 'Observert');
      data.addColumn('number', 'Teoretisk uten vind');
      data.addColumn('number', 'Meldt vannstand');
      data.addColumn('number', 'Værbidrag');

      for(i = 0; i < zArrayObs.length; i++)
      data.addRow([new Date(zArrayTimeObs[i]), zArrayObs[i], null, null, null]);

      for(i = 0; i < zArrayFor.length; i++)
      data.addRow([new Date(zArrayTimeFor[i]), null, null, zArrayFor[i], null]);

      for(i = 0; i < zArrayNon.length; i++)
      data.addRow([new Date(zArrayTimeNon[i]), null, null, null, zArrayNon[i]]);

      for(i = 0; i < zArrayPre.length; i++)
      data.addRow([new Date(zArrayTimePre[i]), null, zArrayPre[i], null, null]);

      var options = {
        title: 'Tidevann',
        lineWidth: 4,
        titleTextStyle: {
          color: '#ff0000',
          fontSize: 24,
          fontName: 'Arial',
          bold: true,
          italic: false
        },
        hAxis: {
          titleTextStyle: {color: '#ff0000'},
          gridlines: {color: '#550000'},
          baselineColor: {color:'#550000'},
          textStyle:{color: '#ff0000'},
          format: 'HH:mm'
        },
        vAxis: {
          titleTextStyle: {color: '#ff0000'},
          gridlines: {color: '#550000'},
          baselineColor: {color:'#550000'},
          textStyle:{color: '#ff0000'}
        },
        legend: {
          position: 'bottom',
          textStyle: {
            color: '#ff0000',
            fontSize: 24 }
        },
        tooltip: {
          boxStyle: {
            stroke: '#000000',
            strokeWidth: 2,
          }
        },
        pointSize: 0,
        backgroundColor: '#000000',
        colors:[
          '#ff0000',
          '#bb7700',
          '#660000',
          '#ffaa00'],
        chartArea: {
          left: 50,
          right: 0
        },
        animation: {
          duration: 1000,
          easing: 'out',
          "startup": true
        },
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    });
  };

function OpenTab(evt, cityName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

function DrawWeatherChart() {
  var source = "+proj=longlat +datum=WGS84 +no_defs ";
  var dest = "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  var resultN = document.getElementById("resultatN").innerHTML;
  var resultE = document.getElementById("resultatE").innerHTML;
  var N_deg = resultN.substring(0,resultN.indexOf("°"));
  var N_min = resultN.substring(resultN.indexOf(" ")+1, resultN.indexOf("'"));
  var E_deg = resultE.substring(0,resultE.indexOf("°"));
  var E_min = resultE.substring(resultE.indexOf(" ")+1, resultE.indexOf("'"));
  var y_value = Number(N_deg) + Number(N_min)/60;
  var x_value = Number(E_deg) + Number(E_min)/60;
  var urlTide = "https://api.met.no/weatherapi/oceanforecast/0.9/?lat=" + y_value + "&lon=" + x_value;
  var urlWeather = "https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=" + y_value + "&lon=" + x_value;
  var data = new google.visualization.DataTable();
  var zArrayWave;
  var zArrayTimeWave;
  let WaveOK = false;
  let WeatherOK = false;

  fetch(urlTide)
  .then(x => x.text())
  .then(function(response){
    let parser = new DOMParser();
    let xml = parser.parseFromString(response, "application/xml");
    let nsResolver = xml.createNSResolver (xml.documentElement);
    let count = xml.evaluate("count(//mox:significantTotalWaveHeight)", xml, nsResolver, XPathResult.ANY_TYPE, null).numberValue;
      count = 24;
    zArrayWave = Array(count);
    zArrayTimeWave = Array(count);

    try {
      for (i = 1; i <= count; i++) {
        zArrayWave[i-1] = Number(xml.evaluate('(//mox:significantTotalWaveHeight)[' + i + ']', xml, nsResolver, XPathResult.ANY_TYPE, null).iterateNext().textContent);
        zArrayTimeWave[i-1] = xml.evaluate('(//gml:begin)[' + i + ']', xml, nsResolver, XPathResult.ANY_TYPE, null).iterateNext().textContent;
      }
      WaveOK = true;
    } catch (e) {
        console.log("Failed fetching wave height");
    };

    fetch(urlWeather)
    .then(res => res.json())
    .then((resultJSON) => {
      zArrayWind = Array(count);
      zArrayWindGusts = Array(count);
      zArrayTimeWindGusts = Array(count);

      try {
        for (i = 0; i <= count-1; i++) {
          zArrayWind[i] = resultJSON.properties.timeseries[i].data.instant.details.wind_speed;
          zArrayTimeWind[i] = resultJSON.properties.timeseries[i].time;
          zArrayWindGusts[i] = resultJSON.properties.timeseries[i].data.instant.details.wind_speed_of_gust;
          zArrayTimeWindGusts[i] = resultJSON.properties.timeseries[i].time;
          WeatherOK = true;
        }
      } catch (e) {
          console.log("Failed fetching weather");
      };

      data.addColumn('datetime', 'tid');
      data.addColumn('number', 'Bølgehøyde');
      data.addColumn('number', 'Vindstyrke');
      data.addColumn('number', 'Vindkast');

      if (WaveOK) {
        for(i = 0; i < zArrayWave.length; i++)
          data.addRow([new Date(zArrayTimeWave[i]), zArrayWave[i], null, null]);
      };

      if (WeatherOK) {
        for(i = 0; i < zArrayWind.length; i++)
          data.addRow([new Date(zArrayTimeWind[i]), null, zArrayWind[i], null]);
        for(i = 0; i < zArrayWindGusts.length; i++)
          data.addRow([new Date(zArrayTimeWindGusts[i]), null, null, zArrayWindGusts[i]]);
      };

      var options = {
        title: 'Bølgehøyde og vindstyrke',
        lineWidth: 4,
        titleTextStyle: {
          color: '#ff0000',
          fontSize: 24,
          fontName: 'Arial',
          bold: true,
          italic: false
        },
        hAxis: {
          titleTextStyle: {color: '#ff0000'},
          gridlines: {color: '#550000'},
          baselineColor: {color:'#550000'},
          textStyle:{color: '#ff0000'},
          format: 'HH:mm',
          showTextEvery: 2
        },
        vAxis: {
          titleTextStyle: {color: '#ff0000'},
          gridlines: {color: '#550000'},
          baselineColor: {color:'#550000'},
          textStyle: {color: '#ff0000'}
        },

        series: {
          0: {targetAxisIndex:0},
          1: {targetAxisIndex:1},
          2: {targetAxisIndex:1}
        },
        legend: {
          position: 'bottom',
          textStyle: {
            color: '#ff0000',
            fontSize: 24 }
        },
        tooltip: {
          boxStyle: {
            stroke: '#000000',
            strokeWidth: 2,
          }
        },
        axes: {
          y: {
            0: {label: 'Bølgehøyde'},
            1: {title: 'Vindstyrke'},
            2: {title: 'Vindkast'}
          }
        },
        pointSize: 0,
        backgroundColor: '#000000',
        colors:[
          '#ff0000',
          '#bb7700',
          '#995500',
          '#ffaa00'],
        chartArea: {
          left: 50,
          right: 50
        },
        animation: {
          duration: 1000,
          easing: 'out',
          "startup": true
        },
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_wave'));
      chart.draw(data, options);
    });
  });
};


//console.log(zN);
//console.log(zE);
//console.log(position.coords.latitude);
//console.log(position.coords.longitude);
//
//var resultN = document.getElementById("resultatN").innerHTML;
//var resultE = document.getElementById("resultatE").innerHTML;
//var N_deg = resultN.substring(0,resultN.indexOf("°"));
//var N_min = resultN.substring(resultN.indexOf(" ")+1, resultN.indexOf("'"));
//var E_deg = resultE.substring(0,resultE.indexOf("°"));
//var E_min = resultE.substring(resultE.indexOf(" ")+1, resultE.indexOf("'"));
//zN = Number(N_deg) + Number(N_min)/60;
//zE = Number(E_deg) + Number(E_min)/60;
//
//let zDistance = getDistanceFromLatLonInKm(zN, zE, position.coords.latitude, position.coords.longitude);
//let zTTG = (zDistance/30)*60;
//
//document.getElementById("map_distance").innerHTML = "DTG: " + Math.round(zDistance, 2) + " nautiske mil.<br>TTG: " + Math.round(zTTG, 0) + " min. i 30 knop."
