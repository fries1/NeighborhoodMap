/*
var geocoder;
var map;
function initialize() {
  console.log('in initialize');
	var mapCanvas = document.getElementById('map-canvas');
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(44.5403, -78.5463)
	var mapOptions = {
	  center: latlng,
	  zoom: 8,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(mapCanvas, mapOptions);
	//map = google.maps.event.addDomListener(window, 'load', initialize);
}



function codeAddress() {
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
*/

/* ToDO
 set markers: restaurants, super markets, misc (crossfit, pharmacy, atm)
*/




/*
Restaurants:
      Altes Fassl {A: 48.19151100699213, F: 16.360471844673157}
      Restaurant Altes Fassl
      Ziegelofengasse 37
      1050 Wien
      Austria
      Margareta {A: 48.19170769493416, F: 16.35875254869461}
      Margaretenpl. 2
      1050 Wien
      Austria
      Motto {A: 48.192980784082735, F: 16.35754019021988}
      Schönbrunner Str. 30
      1050 Wien
      Austria
      Weinschenke {A: 48.19435396837981, F: 16.359954178333282}
      Franzensgasse 11/ Ecke Schönbrunner Straße 14
      1050 Wien
      Austria
      Aromat {A: 48.194389727895896, F: 16.3621187210083}
      Margaretenstraße 52
      1040 Wien
      Austria
      Woraczicky 48.189340237198124, F: 16.352972388267517}
      Spengergasse 52
      1050 Wien
      Austria
Misc: Filmcasino {A: 48.192279873745626, F: 16.359828114509583}
      Margaretenstraße 78
      1050 Wien
      Austria
      Haus des Meeres {A: 48.19766161800487, F: 16.35290801525116}
      Fritz-Grünbaum-Platz 1
      1060 Wien
      Austria

Supermärkte:


      Spar {A: 48.19320607465498, F: 16.35336399078369}


*/

var geocoder;
var map;
var markers = [];
var data = [{
    'title' : 'Altes Fassl',
    'lat' : 48.19151100699213,
    'lng' : 16.360471844673157,
    'description' : 'Nice Beergarden',
    'type' : 'Restaurant'
  },
  {
    'title' : 'Billa',
    'lat' : 48.18851768096375,
    'lng' : 16.35386288166046,
    'description' : 'just another supermarket, Margaretenstraße 115, 1050 Wien, Austria',
    'type' : 'Supermarket'
  },
  {
    'title' : 'Veganz',
    'lat' : 48.19517285504024,
    'lng' : 16.363009214401245,
    'description' : 'vegan shop, Margaretenstraße 44, 1040 Wien, Austria',
    'type' : 'Supermarket'
  },
  {
    'title' : 'Billa',
    'lat' : 48.19221192784606,
    'lng' : 16.36017680168152,
    'description' : 'vegan shop, Margaretenstraße 67, 1050 Wien, Austria',
    'type' : 'Supermarket'
  },
  {
    'title' : 'Billa',
    'lat' : 48.19266072672536,
    'lng' : 16.355563402175903,
    'description' : 'vegan shop, Pilgramgasse 22, 1050 Wien, Austria',
    'type' : 'Supermarket'
  },
  {
    'title' : 'Crossfit ACE',
    'lat' : 48.1969196503154,
    'lng' : 16.352081894874573,
    'description' : 'best crossfit box, Blümelgasse 1, 1060 Wien',
    'type' : 'Misc'
  },
]

function populateMarkers(data){

  for(var i=0; i<data.length; i++){
    var dataEntry = data[i];
    var location = {
        'lat': dataEntry.lat,
        'lng': dataEntry.lng,
      };
    console.log(location);
    var marker = new google.maps.Marker({
      position: location,
      title: dataEntry.title,
      map: map
    });
    var infowindow = new google.maps.InfoWindow({
          content: dataEntry.description
        });

    // Add an Eventlistener to the marker that can access the marker's infowindow when clicked
    google.maps.event.addListener(marker, 'click', (function(infowindowCopy, markerCopy) {
      console.log('clicked');
      return function(){
        infowindowCopy.open(map,markerCopy)
      };
    })(infowindow, marker));


    markers.push(marker);
  }

}

function initialize() {
  geocoder = new google.maps.Geocoder();
  codeAddress();
  var mapOptions = {
    zoom: 14,
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // This event listener will call addMarker() when the map is clicked.
  google.maps.event.addListener(map, 'click', function(event) {
    console.log('clicked');
    console.log('event.latLng ' + event.latLng);
    console.log(event.latLng);
    addMarker(event.latLng);
    positions.push(event.latLng);
  });
  populateMarkers(data);
}

// Add a marker to the map and push to the array.
function addMarker(location) {
  console.log(location);
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
}

// Sets the map on all markers in the array.
function setAllMap(map) {

  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function codeAddress() {
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
      markers.push(marker);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}


google.maps.event.addDomListener(window, 'load', initialize);

