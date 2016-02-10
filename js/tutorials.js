/* Example from Leaflet Quick Start Guide*/

var map = L.map('map').setView([51.505, -0.09], 13);

//Example 1.1 line 5...add tile layer
L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//Tutorial 1

var marker = L.marker([51.5, -0.09]).addTo(map);

var circle = L.circle([51.508, -0.11], 500, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(map);

var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

marker.bindPopup("<b>Leaflet Tutorial</b><br>My popup works!").openPopup();
circle.bindPopup("I made a circle.");
polygon.bindPopup("I made a polygon.");

var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("Meghan's first Leaflet popup!")
    .openOn(map);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

//Tutorial 2
