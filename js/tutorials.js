/*Leaflet Quick Start Guide*/

//setView centers the map at a particular zoom level
var map = L.map('map').setView([51.505, -0.09], 13);

// add tile layer to map using OSM map tiles
L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// create marker at a particular lat/long location and add to map
// use default style
var marker = L.marker([51.5, -0.09]).addTo(map);

// create circle at particular location with a specific diameter
var circle = L.circle([51.508, -0.11], 500, {
    // set styles for the circle symbol
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(map);

// create polygon using specific coordinates and add to map
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

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
    .setContent("Meghan's first Leaflet popup!")
    // open popup on map when map loads
    .openOn(map);

// function to give coordinates of each click on the map
function onMapClick(e) {
    popup
    	// set popup lat and long
        .setLatLng(e.latlng)
        // set content for popup that creates a string of the lat/long coordinates
        .setContent("You clicked the map at " + e.latlng.toString())
        // have popup open on map
        .openOn(map);
}

// call function as a click event
map.on('click', onMapClick);

