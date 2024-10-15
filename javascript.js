var zArrayWind = Array;
var zArrayTimeWind = Array;
var zArrayWindGusts = Array;
var zArrayTimeWindGusts = Array;
var zArrayWave = Array;
var zArrayTimeWave = Array;
var zArrayTide = Array;
var zArrayTimeTide = Array;
var zArrayWindDirection = Array;
var zArrayTimeWindDirection = Array;
var zOldN;
var zOldE;

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(fDrawChart_tide);
google.charts.setOnLoadCallback(fDrawChart_weather);

function fDrawChart_weather() {
  var resultN = document.getElementById("resultatN").innerHTML;
  var resultE = document.getElementById("resultatE").innerHTML;
  var N_deg = resultN.substring(0,resultN.indexOf("°"));
  var N_min = resultN.substring(resultN.indexOf(" ")+1, resultN.indexOf("'"));
  var E_deg = resultE.substring(0,resultE.indexOf("°"));
  var E_min = resultE.substring(resultE.indexOf(" ")+1, resultE.indexOf("'"));
  var fi_N = Number(N_deg) + Number(N_min)/60;
  var fi_E = Number(E_deg) + Number(E_min)/60;
  var urlWeather = "https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=" + fi_N + "&lon=" + fi_E;
  var urlWaveheight = "https://api.met.no/weatherapi/oceanforecast/2.0/complete?lat=" + fi_N + "&lon=" + fi_E;
  var data = new google.visualization.DataTable();

  fetch(urlWeather, {"User-Agent"   : "RS Koordinater at beta website. https://rskoordinater.vercel.app. Contact: opplaring.rsrk.kristiansand@rs.no"})
  .then(res => res.json())
  .then((resultJSON) => {
    fetch(urlWaveheight, {"User-Agent"   : "RS Koordinater at beta website. https://rskoordinater.vercel.app. Contact: opplaring.rsrk.kristiansand@rs.no"})
    .then(x => x.json())
    .then(function(response){
      let count = 12;
      zArrayWave = Array(count);
      zArrayTimeWave = Array(count);
      zArrayWind = Array(count);
      zArrayTimeWind = Array(count);
      zArrayWindGusts = Array(count);
      zArrayTimeWindGusts = Array(count);
      zArrayWindDirection = Array(count);
      zArrayTimeWindDirection = Array(count);

      for (i = 0; i <= count-1; i++) {
        zArrayWave[i] = response.properties.timeseries[i].data.instant.details.sea_surface_wave_height;
        zArrayTimeWave[i] = response.properties.timeseries[i].time;
      }

      for (i = 0; i <= count-1; i++) {
        zArrayWind[i] = resultJSON.properties.timeseries[i].data.instant.details.wind_speed;
        zArrayTimeWind[i] = resultJSON.properties.timeseries[i].time;
        zArrayWindGusts[i] = resultJSON.properties.timeseries[i].data.instant.details.wind_speed_of_gust;
        zArrayTimeWindGusts[i] = resultJSON.properties.timeseries[i].time;
        zArrayTimeWindDirection[i] = resultJSON.properties.timeseries[i].time;
        zArrayWindDirection[i] = resultJSON.properties.timeseries[i].data.instant.details.wind_from_direction;
      }

      document.getElementById("weathersymbol").src = "yr.png/" + resultJSON.properties.timeseries[1].data.next_1_hours.summary.symbol_code + ".png";
      document.getElementById("w_airpressure").innerHTML = "Lufttrykk: " + resultJSON.properties.timeseries[1].data.instant.details.air_pressure_at_sea_level + " hPa";
      document.getElementById("w_airtemp").innerHTML = "Lufttemperatur: " + resultJSON.properties.timeseries[1].data.instant.details.air_temperature + "&degC";
      document.getElementById("w_cloudTot").innerHTML = "Skydekke totalt: " + resultJSON.properties.timeseries[1].data.instant.details.cloud_area_fraction + "%";
      document.getElementById("w_cloudH").innerHTML = "Skydekke, høyt: " + resultJSON.properties.timeseries[1].data.instant.details.cloud_area_fraction_high + "%";
      document.getElementById("w_cloudL").innerHTML = "Skydekke lavt: " + resultJSON.properties.timeseries[1].data.instant.details.cloud_area_fraction_low + "%";
      document.getElementById("w_cloudM").innerHTML = "Skydekke middels: " + resultJSON.properties.timeseries[1].data.instant.details.cloud_area_fraction_medium + "%";
      document.getElementById("w_dewpoint").innerHTML = "Duggpunkt: " + resultJSON.properties.timeseries[1].data.instant.details.dew_point_temperature + "&degC";
      document.getElementById("w_fog").innerHTML = "Tåke: " + resultJSON.properties.timeseries[1].data.instant.details.fog_area_fraction + "%";
      document.getElementById("w_Hum").innerHTML = "Luftfuktighet: " + resultJSON.properties.timeseries[1].data.instant.details.relative_humidity + "%";
      document.getElementById("w_UV").innerHTML = "UV-indeks: " + resultJSON.properties.timeseries[1].data.instant.details.ultraviolet_index_clear_sky;
      document.getElementById("w_windDir").innerHTML = "Vindretning: " + resultJSON.properties.timeseries[1].data.instant.details.wind_from_direction + " grader";
      document.getElementById("w_windSpeed").innerHTML = "Vindhastighet: " + resultJSON.properties.timeseries[1].data.instant.details.wind_speed + " m/s";
      document.getElementById("w_precipitation").innerHTML = "Nedbør: " + resultJSON.properties.timeseries[1].data.next_1_hours.details.precipitation_amount + " mm";

      document.getElementById("wind_arrow").style.transform = "rotate(" + Number(resultJSON.properties.timeseries[1].data.instant.details.wind_from_direction + 180) + "deg)";
      document.getElementById("w_windSpeed2").innerHTML = resultJSON.properties.timeseries[1].data.instant.details.wind_speed +  " m/s";
      document.getElementById("wave_arrow").style.transform = "rotate(" + Number(response.properties.timeseries[1].data.instant.details.sea_surface_wave_from_direction+180) + "deg)";
      document.getElementById("waveheight").innerHTML = zArrayWave[0] + " m";

      data.addColumn('datetime', 'tid');
      data.addColumn('number', 'Bølgehøyde');
      data.addColumn('number', 'Vindstyrke');
      data.addColumn('number', 'Vindkast');
      data.addColumn('number', 'Vindretning');

      for(i = 0; i < zArrayWave.length; i++)
        data.addRow([new Date(zArrayTimeWave[i]), zArrayWave[i], null, null, null]);

      for(i = 0; i < zArrayWind.length; i++)
        data.addRow([new Date(zArrayTimeWind[i]), null, zArrayWind[i], null, null]);

      for(i = 0; i < zArrayWindGusts.length; i++)
        data.addRow([new Date(zArrayTimeWindGusts[i]), null, null, zArrayWindGusts[i], null]);

      //for(i = 0; i < zArrayWindDirection.length; i++)
      //  data.addRow([new Date(zArrayTimeWindDirection[i]), null, null, null, zArrayWindDirection[i]]);

      var options = {
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
          gridlines: {color: '#550000'},
          minorGridlines: { count: 0 },
          textStyle:{color: '#ff0000'},
          format: 'HH:mm',
          showTextEvery: 1
        },
        vAxis: {
          titleTextStyle: {color: '#ff0000'},
          gridlines: {color: 'transparent'},
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
          }
        },
        pointSize: 8,
        backgroundColor: { fill:'transparent' },
        colors:[
          '#ff0000',
          '#bb7700',
          '#660000',
          '#443300'],
        chartArea: {
          left: 50,
          right: 50
        },
        animation: {
          duration: 1000,
          easing: 'inAndOut',
          "startup": true
        },
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_weather'));
      chart.draw(data, options);

    })
  })
}

function fDrawChart_tide() {
  var resultN = document.getElementById("resultatN").innerHTML;
  var resultE = document.getElementById("resultatE").innerHTML;

  var N_deg = resultN.substring(0,resultN.indexOf("°"));
  var N_min = resultN.substring(resultN.indexOf(" ")+1, resultN.indexOf("'"));
  var E_deg = resultE.substring(0,resultE.indexOf("°"));
  var E_min = resultE.substring(resultE.indexOf(" ")+1, resultE.indexOf("'"));

  var fi_N = Number(N_deg) + Number(N_min)/60;
  var fi_E = Number(E_deg) + Number(E_min)/60;

  var startDate = new Date();
  var endDate = new Date();
  var startTime = new Date();
  var endTime = new Date();

  startDate.setHours(new Date().getHours()-5);
  endDate.setHours(new Date().getHours()+12);

  zStartDate = startDate.getFullYear() + "-" + pad((startDate.getMonth() + 1)) + "-" + pad(startDate.getDate());
  zEndDate = endDate.getFullYear() + "-" + pad((endDate.getMonth() + 1)) + "-" + pad((endDate.getDate()));
  zStartHour = pad(startDate.getHours());
  zEndHour = pad(endDate.getHours());

  var urlTide = "http://vannstand.kartverket.no/tideapi.php?lat=" + fi_N + "&lon=" + fi_E + "&fromtime=" + zStartDate + "T" + zStartHour + "%3A00&totime=" + zEndDate + "T" + zEndHour + "%3A00&datatype=all&refcode=cd&place=&file=&lang=nb&interval=10&dst=0&tzone=&tide_request=locationdata";

  fetch(urlTide)
  .then(x => x.text())
  .then(function(response){
    var data = new google.visualization.DataTable();
    let parser = new DOMParser();
    let xml = parser.parseFromString(response, "text/xml");
    let countObs = xml.evaluate('count(/tide/locationdata/data[position()=1]/*)', xml, null, XPathResult.ANY_TYPE, null).numberValue;
    let countPre = xml.evaluate('count(/tide/locationdata/data[position()=2]/*)', xml, null, XPathResult.ANY_TYPE, null).numberValue;
    let countNone = xml.evaluate('count(/tide/locationdata/data[position()=3]/*)', xml, null, XPathResult.ANY_TYPE, null).numberValue;
    let countForecast = xml.evaluate('count(/tide/locationdata/data[position()=4]/*)', xml, null, XPathResult.ANY_TYPE, null).numberValue;
    let zArrayObs = Array(countObs);
    let zArrayPre = Array(countPre);
    let zArrayNon = Array(countNone);
    let zArrayFor = Array(countForecast);
    let zArrayTimeObs = Array(countObs);
    let zArrayTimePre = Array(countPre);
    let zArrayTimeNon = Array(countNone);
    let zArrayTimeFor = Array(countForecast);

    document.getElementById("chart_tide_descr").innerHTML = xml.evaluate('/tide/locationdata/location/@descr', xml, null, XPathResult.ANY_TYPE, null).iterateNext().textContent;

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
        gridlines: {color: '#550000'},
        minorGridlines: { count: 0 },
        textStyle:{color: '#ff0000'},
        format: 'HH:mm',
        showTextEvery: 1
      },
      vAxis: {
        titleTextStyle: {color: '#ff0000'},
        gridlines: {color: 'transparent'},
        baselineColor: {color:'#550000'},
        textStyle: {color: '#ff0000'}
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
      backgroundColor: { fill:'transparent' },
      colors:[
        '#ff0000',
        '#bb7700',
        '#660000',
        '#443300'],
      chartArea: {
        left: 50,
        right: 50,
      },
      animation: {
        duration: 1000,
        easing: 'out',
        "startup": true
      },
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_tide'));
    chart.draw(data, options);
  })
}

function DMfromDMS() {
  document.getElementById("mapid").style.display = "none";

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
  document.getElementById("mapid").style.display = "none";

  var degN = Number(document.getElementById("DD").elements.namedItem("degN").value);
  var degE = Number(document.getElementById("DD").elements.namedItem("degE").value);

  var degdecN = (degN - Math.floor(degN))*60;
  var degdecE = (degE - Math.floor(degE))*60;

  document.getElementById("resultatN").innerHTML = Math.floor(degN).toString() + "&deg " + degdecN.toFixed(3).toString() + "' " + document.getElementById("hemisphere1").value.substring(0,1).toUpperCase();
  document.getElementById("resultatE").innerHTML = Math.floor(degE).toString() + "&deg " + degdecE.toFixed(3).toString() + "' " + document.getElementById("hemisphere2").value.substring(0,1).toUpperCase();

  UpdateData();
};

function DMfromDM() {
  document.getElementById("mapid").style.display = "none";

  var degN = Number(document.getElementById("DM").elements.namedItem("degN").value);
  var degE = Number(document.getElementById("DM").elements.namedItem("degE").value);
  var degdecN = Number(document.getElementById("DM").elements.namedItem("minN").value);
  var degdecE = Number(document.getElementById("DM").elements.namedItem("minE").value);

  document.getElementById("resultatN").innerHTML = Math.floor(degN).toString() + "&deg " + degdecN.toFixed(3).toString() + "' " + document.getElementById("hemisphere5").value.substring(0,1).toUpperCase();
  document.getElementById("resultatE").innerHTML = Math.floor(degE).toString() + "&deg " + degdecE.toFixed(3).toString() + "' " + document.getElementById("hemisphere6").value.substring(0,1).toUpperCase();

  UpdateData();
}

function DMfromUTM() {
  document.getElementById("mapid").style.display = "none";

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
  document.getElementById("mapid").style.display = "none";

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
  var resultN = document.getElementById("resultatN").innerHTML;
  var resultE = document.getElementById("resultatE").innerHTML;

  var N_deg = resultN.substring(0,resultN.indexOf("°"));
  var N_min = resultN.substring(resultN.indexOf(" ")+1, resultN.indexOf("'"));
  var E_deg = resultE.substring(0,resultE.indexOf("°"));
  var E_min = resultE.substring(resultE.indexOf(" ")+1, resultE.indexOf("'"));

  var fi_N = Number(N_deg) + Number(N_min)/60;
  var fi_E = Number(E_deg) + Number(E_min)/60;

  if (((fi_N == zOldN) && (fi_E == zOldE)) || (isNaN(Number(fi_N)) || isNaN(Number(fi_E)))) {
    return;
  }
  else {
    zOldN = fi_N;
    zOldE = fi_E;

    fDrawChart_tide();
    fDrawChart_weather();
    UpdateMapLocation();
  };
};

function UpdateMapLocation() {
  var resultN = document.getElementById("resultatN").innerHTML;
  var resultE = document.getElementById("resultatE").innerHTML;
  var N_deg = resultN.substring(0,resultN.indexOf("°"));
  var N_min = resultN.substring(resultN.indexOf(" ")+1, resultN.indexOf("'"));
  var E_deg = resultE.substring(0,resultE.indexOf("°"));
  var E_min = resultE.substring(resultE.indexOf(" ")+1, resultE.indexOf("'"));
  var fi_N = Number(N_deg) + Number(N_min)/60;
  var fi_E = Number(E_deg) + Number(E_min)/60;
  var source = "+proj=longlat +datum=WGS84 +no_defs ";
  var dest = "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  var result = proj4(source, dest, [fi_E, fi_N]).toString();
  var northing = result.toString().substring(0,result.toString().indexOf(","));
  var easting = result.toString().substring(result.toString().indexOf(",")+1,result.toString().length);
  var UTM33Lon = Math.round(northing);
  var UTM33Lat  = Math.round(easting);
  var Layer = document.getElementById("map_settings").elements.namedItem("map_type").value;

  document.getElementById("map_area").src = "https://www.norgeskart.no/#!?project=norgeskart&layers=" + Layer + "&zoom=11&lat=" + UTM33Lat + "&lon=" + UTM33Lon + "&markerLat=" + UTM33Lat + "&markerLon=" + UTM33Lon + "&type=1";
  document.getElementById("map_area").parentNode.replaceChild(document.getElementById("map_area").cloneNode(), document.getElementById("map_area"));
};

function ShowManualMap() {

  document.getElementById("mapid").style.display = "block";

  var mymap = L.map('mapid').setView([58.105, 8.09], 11);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    tileSize: 512,
    zoomOffset: -1
  }).addTo(mymap);

  var popup = L.popup();

  function onMapClick(e) {
      var degN = Math.floor(e.latlng.lat);
      var degE = Math.floor(e.latlng.lng);
      var minN = 60 * (e.latlng.lat - degN);
      var minE = 60 * (e.latlng.lng - degE);
      console.log(degN);
      console.log(degE);
      console.log(minN);
      console.log(minE);
      document.getElementById("DM").elements.namedItem("degN").value = degN;
      document.getElementById("DM").elements.namedItem("degE").value = degE;
      document.getElementById("DM").elements.namedItem("minN").value = minN;
      document.getElementById("DM").elements.namedItem("minE").value = minE;
      document.getElementById("defaultSelected").click();
      DMfromDM();

      popup
        .setLatLng(e.latlng)
        .setContent("Du markerte:<br>" + degN.toFixed(3).toString() + "&deg; " + minN.toFixed(3).toString() + "' N<br>" +  degE.toFixed(3).toString() + "&deg; " + minE.toFixed(3).toString() + "' Ø")
        .openOn(mymap);
        document.getElementById("mapid").style.display = "none";
  }

  mymap.on('click', onMapClick);
}

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

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showPositionFailure, options);
  } else {
    //x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  var degN = Math.floor(position.coords.latitude);
  var degE = Math.floor(position.coords.longitude);
  var minN = 60 * (position.coords.latitude - degN);
  var minE = 60 * (position.coords.longitude - degE);
  document.getElementById("DM").elements.namedItem("degN").value = degN;
  document.getElementById("DM").elements.namedItem("degE").value = degE;
  document.getElementById("DM").elements.namedItem("minN").value = minN;
  document.getElementById("DM").elements.namedItem("minE").value = minE;
  document.getElementById("defaultSelected").click();
  DMfromDM();
}

function showPositionFailure(position) {}

const options = { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000};

function pad(n){
  return n<10 ? '0'+n : n;
}

document.getElementById("defaultSelected").click();
document.getElementById("mapid").style.display = "none";
