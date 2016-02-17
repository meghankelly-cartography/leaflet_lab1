//Map of GeoJSON data from MegaCities.geojson
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [20, 0],
        zoom: 1
    });

    //add OSM base tilelayer
	L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

    //call getData function
    getData(map);
};

//function to retrieve the data and place it on the map
function getData(map){
    //Example 2.3 line 22...load the data
    $.ajax("data/megaCities.geojson", {
        dataType: "json",
        success: function(response){
            //create marker options
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map);
        }
    });
};

$(document).ready(createMap);


//Map of Lab 1 data
//function to instantiate the Leaflet map
function createMap1(){
    //create the map
    var map1 = L.map('map1', {
        center: [54, 10],
        zoom: 3
    });

    //add OSM base tilelayer
	L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map1);


    //call getData function
    getMore(map1);
    
};

//function to retrieve the data and place it on the map
function getMore(map1){
    //Example 2.3 line 22...load the data
    $.ajax("data/Europe.geojson", {
        dataType: "json",
        success: function(response){
            //create marker options
            var geojsonMarkerOptions = {
                radius: 4,
                fillColor: "blue",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.5
            };

            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map1);
        }
    });
};

$(document).ready(createMap1);


//Leaflet Tutorial and Commenting
//setView centers the map at a particular zoom level
var map2 = L.map('map2').setView([51.505, -0.09], 13);

// add tile layer to map using OSM map tiles
L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map2);

// create marker at a particular lat/long location and add to map
// use default style
var marker = L.marker([51.5, -0.09]).addTo(map2);

// create circle at particular location with a specific diameter
var circle = L.circle([51.508, -0.11], 500, {
    // set styles for the circle symbol
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(map2);

// create polygon using specific coordinates and add to map
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map2);

// bind specific popup a feature (below: marker, circle, and polygon
// popup opens on click
marker.bindPopup("<b>Leaflet Tutorial</b><br>My popup works!").openPopup();
circle.bindPopup("I made a circle.");
polygon.bindPopup("I made a polygon.");

// create popup with particular attributes
// placed on map immediately
// closes the previous one
var popup = L.popup()
	// set the lat/long for the popup
    .setLatLng([51.5, -0.09])
    // give the pop up some content
    .setContent("Meghan's first Leaflet map!")
    // open popup on map when map loads
    .openOn(map2);

// function to give coordinates of each click on the map
function onMapClick(e) {
    popup
    	// set popup lat and long
        .setLatLng(e.latlng)
        // set content for popup that creates a string of the lat/long coordinates
        .setContent("You clicked the map at " + e.latlng.toString())
        // have popup open on map
        .openOn(map2);
}

// call function as a click event
map.on('click', onMapClick);

