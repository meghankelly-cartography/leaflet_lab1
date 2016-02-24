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

//Import GeoJSON data
function getData(map){
    //load the data with callback function
    $.ajax("data/Europe.geojson", {
        dataType: "json",
        success: function(response){
        
            //Test by printing to console
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

//Create sequence control
//This function will be called in the getData AJAX function
function createSequenceControls(map){
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');
    
    //set slider attributes
    //set range (max and min) to the number of attributes being sequenced
    //I have 12 months starting at 0 and ending at 11
    $('.range-slider').attr({
        max: 11,
        min: 0,
        value: 0,
        step: 1
    });
    
    //These forward/backward buttons drive me crazy
    $('#panel').append('<button class="skip" id="reverse">Back</button>');
    $('#panel').append('<button class="skip" id="forward">Forward</button>');


    //Example 3.12 line 2...Step 5: click listener for buttons
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 11 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 11 : index;
        };

        //Step 8: update slider
        $('.range-slider').val(index);

        updatePropSymbols(map, attributes[index]);
    });

    $('.range-slider').on('input', function(){
        //Step 6: get the new index value
        var index = $(this).val();

        updatePropSymbols(map, attributes[index]);
    });
    
    //This test didn't work...
    console.log('what is this'); 
};


//Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            var popupContent = "<p><b>Country:</b> " + props.Country + "</p>";

            //add formatted attribute to panel content string
            var year = attribute.split("_")[1];
            popupContent += "<p><b>Month:</b> " + attribute +"</p>";

            //add formatted attribute to popup content string
            var number = attribute.split("_")[1];
            popupContent += "<p><b>Number of asylum seekers:</b> " + feature.properties[attribute] + "</p>";

            //replace the layer popup
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
            });
        };
    });
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


//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};


//function to convert markers to circle markers
function pointToLayer(feature, latlng){
    
    var attribute = attributes[0];
    
    //check, this works
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


