$(window).load(function() {
    loadScript();
});

var map;

function initialize() {

    var mapOptions = {
        center: new google.maps.LatLng(30.055487, 31.279766),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.NORMAL,
        panControl: true,
        scaleControl: false,
        streetViewControl: true,
        overviewMapControl: true
    };
    // initializing map
    map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);

    // geocoding
    var geocoding  = new google.maps.Geocoder();
    $("#submit_button_geocoding").click(function(){
        codeAddress(geocoding);
    });
    $("#submit_button_reverse").click(function(){
        codeLatLng(geocoding);
    });

    // geofencing stuff
    map.data.setControls(['Point', 'LineString', 'Polygon']);
    map.data.setStyle({
        editable: true,
        draggable: true
    });
    bindDataLayerListeners(map.data);

    // Retrieve HTML elements.
    dropContainer = document.getElementById('drop-container');
    panel = document.getElementById('panel');
    var mapContainer = document.getElementById('map-holder');
    geoJsonInput = document.getElementById('geojson');
    downloadLink = document.getElementById('download-link');

    // Resize the geoJsonInput textarea.
    resizeGeoJsonInput();

    // Set up the drag and drop events.
    // First on common events.
    [mapContainer, dropContainer].forEach(function(container) {
        google.maps.event.addDomListener(container, 'drop', handleDrop);
        google.maps.event.addDomListener(container, 'dragover', showPanel);
    });

    // Then map-specific events.
    google.maps.event.addDomListener(mapContainer, 'dragstart', showPanel);
    google.maps.event.addDomListener(mapContainer, 'dragenter', showPanel);

    // Then the overlay specific events (since it only appears once drag starts).
    google.maps.event.addDomListener(dropContainer, 'dragend', hidePanel);
    google.maps.event.addDomListener(dropContainer, 'dragleave', hidePanel);
    // Set up events for changing the geoJson input.
    google.maps.event.addDomListener(
        geoJsonInput,
        'input',
        refreshDataFromGeoJson);
    google.maps.event.addDomListener(
        geoJsonInput,
        'input',
        refreshDownloadLinkFromGeoJson);

    // Set up events for styling.
    google.maps.event.addDomListener(window, 'resize', resizeGeoJsonInput);


}

var info;

// Refresh different components from other components.
function refreshGeoJsonFromData() {
    map.data.toGeoJson(function(geoJson) {
        geoJsonInput.value = JSON.stringify(geoJson, null, 2);
        refreshDownloadLinkFromGeoJson();
    });
}

// Replace the data layer with a new one based on the inputted geoJson.
function refreshDataFromGeoJson() {
    var newData = new google.maps.Data({
        map: map,
        style: map.data.getStyle(),
        controls: ['Point', 'LineString', 'Polygon']
    });
    try {
        var userObject = JSON.parse(geoJsonInput.value);
        var newFeatures = newData.addGeoJson(userObject);
    } catch (error) {
        newData.setMap(null);
        if (geoJsonInput.value !== "") {
            setGeoJsonValidity(false);
        } else {
            setGeoJsonValidity(true);
        }
        return;
    }
    // No error means GeoJSON was valid!
    map.data.setMap(null);
    map.data = newData;
    bindDataLayerListeners(newData);
    setGeoJsonValidity(true);
}

// Refresh download link.
function refreshDownloadLinkFromGeoJson() {
    downloadLink.href = "data:;base64," + btoa(geoJsonInput.value);
}

// Apply listeners to refresh the GeoJson display on a given data layer.
function bindDataLayerListeners(dataLayer) {
    dataLayer.addListener('addfeature', refreshGeoJsonFromData);
    dataLayer.addListener('removefeature', refreshGeoJsonFromData);
    dataLayer.addListener('setgeometry', refreshGeoJsonFromData);
}

// Display the validity of geoJson.
function setGeoJsonValidity(newVal) {
    if (!newVal) {
        geoJsonInput.className = 'invalid';
    } else {
        geoJsonInput.className = '';
    }
}

// Control the drag and drop panel. Adapted from this code sample:
// https://developers.google.com/maps/documentation/javascript/examples/layer-data-dragndrop
function showPanel(e) {
    e.stopPropagation();
    e.preventDefault();
    dropContainer.className = 'visible';
    return false;
}

function hidePanel() {
    dropContainer.className = '';
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    hidePanel();

    var files = e.dataTransfer.files;
    if (files.length) {
        // process file(s) being dropped
        // grab the file data from each file
        for (var i = 0, file; file = files[i]; i++) {
            var reader = new FileReader();
            reader.onload = function(e) {
                map.data.addGeoJson(JSON.parse(e.target.result));
            };
            reader.onerror = function(e) {
                console.error('reading failed');
            };
            reader.readAsText(file);
        }
    } else {
        // process non-file (e.g. text or html) content being dropped
        // grab the plain text version of the data
        var plainText = e.dataTransfer.getData('text/plain');
        if (plainText) {
            map.data.addGeoJson(JSON.parse(plainText));
        }
    };
    // prevent drag event from bubbling further
    return false;
}

// Styling related functions.
function resizeGeoJsonInput() {
    var geoJsonInputRect = geoJsonInput.getBoundingClientRect();
    var panelRect = panel.getBoundingClientRect();
    geoJsonInput.style.height = panelRect.bottom - geoJsonInputRect.top - 8 + "px";
}

function loadScript() {
    console.log("map loading ...");
    var script = document.createElement('script');
    script.type = 'text/javascript';
    //'https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBJYFdplGeKUUEmGZ-vL4ydiSZ09Khsa_o&sensor=false&libraries=drawing'
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
        //'&v=3.14'+
        //'&key=AIzaSyBJYFdplGeKUUEmGZ-vL4ydiSZ09Khsa_o'+
        '&libraries=drawing'+
        '&callback=initialize';
    document.body.appendChild(script);
}

