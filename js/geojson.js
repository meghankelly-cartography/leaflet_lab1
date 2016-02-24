//Map of GeoJSON data from MegaCities.geojson
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [54, 10],
        zoom: 3
    });

    //add OSM base tilelayer
	L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

    //call getData function
    getData(map);
};

//Create sequence control
//This function will be called in the getData AJAX function
function createSequenceControls(map){
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');
    
    //set slider attributes
    $('.range-slider').attr({
        max: 11,
        min: 0,
        value: 0,
        step: 1
    });
    
    $('#panel').append('<button class="skip" id="reverse">Back</button>');
    $('#panel').append('<button class="skip" id="forward">Forward</button>');
    
    //click listener for buttons
    $('.skip').click(function(){
        //sequence
    });

    $('.range-slider').on('input', function(){
        //Step 6: get the new index value
        var index = $(this).val();
    });
    
    //This test didn't work...
    //console.log(index); 
};

//create empty array to hold attributes, use square brackets
	var attributes = [];

//Build array that houses attributes from data
function processData(data){

	
	//create variable of first feature in data
	var properties = data.features[0].properties;
	
	//then push each attribute name into the array
	for (var attribute in properties){
		
		//only take attributes with population values
		if (attribute.indexOf("month") > -1){
			attributes.push(attribute);
		};
	};
	
	//check result with console
	console.log(attributes);
	
	return attributes;
};


//Step 2: Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/Europe.geojson", {
        dataType: "json",
        success: function(response){
        
        	//Test set by printing to console
        	//I used these functions to begin querying my data in the console
            //console.log(response.features[1].properties)
            //console.log(response.features)

			// create array of attributes
			var attributes = processData(response);

            //call function to create proportional symbols
            createPropSymbols(response, map, attributes);
            
            //call function to create sequence control as a response to data AJAX call
            createSequenceControls(map, attributes);
        }
    });
};
$(document).ready(createMap);

//Example 2.1 line 34...Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};


//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = .5;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

//function to convert markers to circle markers
function pointToLayer(feature, latlng){
	var attribute = attributes[0];
    //check
    console.log(attribute);
	
	//Create marker options
	var options = {
		fillColor: "blue",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.6,
	};
	
	//For each feature, determine its value for the selected attribute
	var attValue = Number(feature.properties[attribute]);
	
	//Give each feature's circle marker a radius based on its attribute value
	options.radius = calcPropRadius(attValue);
	
	//create circle marker layer
	var layer = L.circleMarker(latlng, options);
	
	//build popup content string starting with city...Example 2.1 line 24
    var popupContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";

    //add formatted attribute to popup content string
    var month = attribute.split("_")[1];
    popupContent += "<p><b>Month:</b> " + attribute +"</p>";
    
    //add formatted attribute to popup content string
    var year = attribute.split("_")[1];
    popupContent += "<p><b>Number of asylum seekers:</b> " + feature.properties[attribute] + "</p>";
    
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius)
    });

    //event listeners to open popup on hover
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        }
    });
    
	
	//return the circle marker to the L.geojson pointToLayer option
	return layer;
};




