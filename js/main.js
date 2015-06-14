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
var markerTypes = [];
var markerItems = [];
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
    'description' : 'supermarket, Margaretenstraße 67, 1050 Wien, Austria',
    'type' : 'Supermarket'
  },
  {
    'title' : 'Billa',
    'lat' : 48.19266072672536,
    'lng' : 16.355563402175903,
    'description' : 'yet another supermarket, Pilgramgasse 22, 1050 Wien, Austria',
    'type' : 'Supermarket'
  },
  {
    'title' : 'Crossfit ACE',
    'lat' : 48.1969196503154,
    'lng' : 16.352081894874573,
    'description' : 'best crossfit box, Blümelgasse 1, 1060 Wien',
    'type' : 'Misc'
  },
];

function Model(){

}

function CheckboxItem(type){
  var self = this;
  self.type = ko.observable(type);
  self.selected = ko.observable(true);
}

function ViewModel(){
  var self = this;
  self.markers = ko.observableArray(markers);
  this.markerTypeItems = ko.observableArray(markerItems);
  /*this.visibleMarkersList = ko.computed(function(){
    var visibleListEntries = [];
    for(var i = 0; i < myModel.markers().length; i++){
      if(myModel.markers()[i].visible == true){
        visibleListEntries.push(myModel.markers()[i]);
      }
    }
    return visibleListEntries;
  });*/
  self.changeVisibility = function(item){
    if(item.selected() === true){
      console.log(item.type() + ' item is selected');

      //console.log(myModel.markers()[0]);
      for(var i = 0; i < myModel.markers().length; i++){

        //console.log(myModel.markers()[i]);

        if(myModel.markers()[i].type == item.type()){
          console.log('found matching type ');
          console.log(myModel.markers()[i]);
          myModel.markers()[i].setVisible(false);
        }
      //console.log('markers length ' + myModel.markers().length);
      /*
      for(var i = 0; i < myModel.markers().length; i++){
        var marker = myModel.markers()[i];
        console.log(marker);
        /*
        if(marker.type() == item.type()){
          console.log('found matching type');
        }
        */
      //}
      }
    }else{
      console.log(item.type() + ' item is not selected');
      for(var i = 0; i < myModel.markers().length; i++){

        //console.log(myModel.markers()[i]);

        if(myModel.markers()[i].type == item.type()){
          console.log('found matching type ');
          console.log(myModel.markers()[i]);
          myModel.markers()[i].setVisible(true);
        }
      }
    }
    item.selected(!(item.selected()));
    return true;
  }
}


function populateMarkers(data){

  for(var i=0; i<data.length; i++){
    var dataEntry = data[i];
    var location = {
        'lat': dataEntry.lat,
        'lng': dataEntry.lng,
      };
    //console.log(location);
    var marker = new google.maps.Marker({
      position: location,
      title: dataEntry.title,
      icon: function(){
        if(dataEntry.type == 'Misc'){
          return 'images/yellow_MarkerM.png';
        }else if(dataEntry.type == 'Supermarket'){
          return 'images/red_MarkerS.png';
        }else if(dataEntry.type == 'Restaurant'){
          return 'images/darkgreen_MarkerR.png';
        }
      }(),
      map: map,
      type: dataEntry.type
    });
    var infowindow = new google.maps.InfoWindow({
          content: dataEntry.description
    });

    // Add an Eventlistener to the marker that can access the marker's infowindow when clicked
    google.maps.event.addListener(marker, 'click', (function(infowindowCopy, markerCopy) {
      return function(){
        infowindowCopy.open(map,markerCopy)
      };
    })(infowindow, marker));

    if(markerTypes.indexOf(marker.type) == -1){
      myModel.markerTypeItems.push(new CheckboxItem(marker.type));
      markerTypes.push(marker.type);
    }
    myModel.markers.push(marker);
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
  // Was needed to get initial latLng values, might be used in the future to add
  // additional markers

  google.maps.event.addListener(map, 'click', function(event) {
    console.log('clicked');
    console.log('event.latLng ' + event.latLng);
    console.log(event.latLng);
    addMarker(event.latLng);
    positions.push(event.latLng);
  });

  /*
    (48.215637193754965, 16.287244856357574)
    (48.1976187093228, 16.33727476000786)

  */
  var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(48.215637193754965, 16.287244856357574),
      new google.maps.LatLng(48.1976187093228, 16.33727476000786));
  map.fitBounds(defaultBounds);

  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(
  /** @type {HTMLInputElement} */(input));

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });
  // [END region_getplaces]

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });

  populateMarkers(data);
}

// Add a marker to the map and push to the array.
function addMarker(location) {
  //console.log(location);
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
      // This code can be used to add a inital marker at the address location
      /*
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
      markers.push(marker);
      */
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}


google.maps.event.addDomListener(window, 'load', initialize);
var myModel = new ViewModel();
ko.applyBindings(myModel);
