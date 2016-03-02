function createMap(){
    //create the map
    var map = L.map('map', {
        center: [54, 10],
        zoom: 3
    });

    //add OSM base tilelayer
	L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	}).addTo(map);
	
	getData2(map);
};


//Import GeoJSON data
function getData2(map){
    //load the data with callback function
    $.ajax("data/europeData.geojson", {
        dataType: "json",
        success: function(response){

           //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {style: style}).addTo(map);
            L.control.layers(response).addTo(map);
        }
    });
};

function getColor(d) {
    return d > 10000000 ? '#800026' :
           d > 5000000  ? '#BD0026' :
           d > 2000000  ? '#E31A1C' :
           d > 1000000  ? '#FC4E2A' :
           d > 500000   ? '#FD8D3C' :
           d > 200000   ? '#FEB24C' :
           d > 100000   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.pop_est),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}




$(document).ready(createMap);