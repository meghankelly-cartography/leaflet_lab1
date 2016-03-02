//Map of GeoJSON data from MegaCities.geojson
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [54, 10],
        zoom: 3
    });

	L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	}).addTo(map);

    //call getData function
    getData(map);
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
    
    //check, this works
    console.log(attribute);
    
    //console.log("This is also working!");
	
	//Create marker options
	var options = {
		//fillColor: "blue",
		color: "white",
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

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};


//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
        //Example 3.16 line 4
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            var popupContent = "<p><b>City:</b> " + props.Country + "</p>";

            //add formatted attribute to panel content string
            var year = attribute.split("_")[1];
            popupContent += "<p><b>Population in " + month + ":</b> " + props[attribute] + " million</p>";

            //replace the layer popup
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
            });
        };
};


//Step 1: Create new sequence controls
function createSequenceControls(map){
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');
    
    //set slider attributes
    $('.range-slider').attr({
        max: 1,
        min: 0,
        value: 0,
        step: 1
    });
    
    //below Example 3.4...add skip buttons
    $('#panel').append('<button class="skip" id="reverse">Reverse</button>');
    $('#panel').append('<button class="skip" id="forward">Skip</button>');
    
    //Below Example 3.5...replace button content with images
    $('#reverse').html('<img src="img/reverse2.png">');
    $('#forward').html('<img src="img/forward2.png">');
    
   //click listener for buttons
	$('.skip').click(function(){
		//get the old index value
		var index = $('.range-slider').val();

		//increment or decriment depending on button clicked
		if ($(this).attr('id') == 'forward'){
			index++;
			//if past the last attribute, wrap around to first attribute
			index = index > 6 ? 0 : index;
		} else if ($(this).attr('id') == 'reverse'){
			index--;
			//if past the first attribute, wrap around to last attribute
			index = index < 0 ? 6 : index;
		};

		//update slider
		$('.range-slider').val(index);

		//pass new attribute to update symbols
		updatePropSymbols(map, attributes[index]);
	});

	//input listener for slider
	$('.range-slider').on('input', function(){
		//get the new index value
		var index = $(this).val();

		//pass new attribute to update symbols
		updatePropSymbols(map, attributes[index]);
	});
};


	//empty array to hold attributes
	var attributes = [];

//Above Example 3.8...Step 3: build an attributes array from the data
function processData(data){
	
    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("month_") > -1){
            attributes.push(attribute);
        };
    };

    //check result
    console.log(attributes);

    return attributes;
};

//Import GeoJSON data
function getData(map){
    //load the data with callback function
    $.ajax("data/Europe.geojson", {
        dataType: "json",
        success: function(response){

            //console.log(response.features[1].properties)
            //console.log(response.features)

            // create array of attributes
            var attributes = processData(response);

            //call function to create proportional symbols
            createPropSymbols(response, map, attributes);

			//call function to create sequence control
            createSequenceControls(map, attributes);

        }
    });
};


$(document).ready(createMap);



