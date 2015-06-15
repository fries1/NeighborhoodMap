Model = {
  geocoder : undefined,
  map : undefined,
  markers : [],
  markerTypes : [],
  markerItems : [],
  data : [{
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
  ]
}

function CheckboxItem(type){
  var self = this;
  self.type = ko.observable(type);
  self.selected = ko.observable(true);
}

function ViewModel(){
  var self = this;
  self.markers = ko.observableArray(Model.markers);
  self.fSMarkers = ko.observableArray([]);
  this.markerTypeItems = ko.observableArray(Model.markerItems);

  self.changeVisibility = function(item){
    if(item.selected() === true){
      for(var i = 0; i < myModel.markers().length; i++){
        if(myModel.markers()[i].type == item.type()){
          myModel.markers()[i].setVisible(false);
          myModel.markers()[i].isVisible(false);
        }
      }
    }else{
      for(var i = 0; i < myModel.markers().length; i++){
        if(myModel.markers()[i].type == item.type()){
          myModel.markers()[i].setVisible(true);
          myModel.markers()[i].isVisible(true);
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
      map: Model.map,
      type: dataEntry.type,
      isVisible: ko.observable(true)
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

    if(Model.markerTypes.indexOf(marker.type) == -1){
      myModel.markerTypeItems.push(new CheckboxItem(marker.type));
      Model.markerTypes.push(marker.type);
    }
    myModel.markers.push(marker);
  }
}

function initialize() {
  Model.geocoder = new google.maps.Geocoder();
  codeAddress();
  var mapOptions = {
    zoom: 14,
    center:new google.maps.LatLng(48.191382265384924, 16.358393132686615)
  }
  Model.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(48.215637193754965, 16.287244856357574),
      new google.maps.LatLng(48.1976187093228, 16.33727476000786));
  Model.map.fitBounds(defaultBounds);

  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  Model.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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
    for (var i = 0, marker; marker = Model.markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    Model.markers = [];
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

      Model.markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });
  // [END region_getplaces]

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(Model.map, 'bounds_changed', function() {
    var bounds = Model.map.getBounds();
    searchBox.setBounds(bounds);
  });

  populateMarkers(Model.data);
}

// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < Model.markers.length; i++) {
    Model.markers[i].setMap(map);
  }
  for (var i = 0; i < myModel.fSMarkers().length; i++) {
    myModel.fSMarkers()[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setAllMap(Model.map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  Model.markers = [];
}

function codeAddress() {
  var address = document.getElementById('address').value;
  Model.geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      Model.map.setCenter(results[0].geometry.location);
      // This code can be used to add a inital marker at the address location
      /*
      var marker = new google.maps.Marker({
          map: Model.map,
          position: results[0].geometry.location
      });
      Model.markers.push(marker);
      */
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function getFourSquareData(){
  // category ID for Food 4d4b7105d754a06374d81259
  var center = Model.map.getCenter();
  var clientID = '2OA0JAMGRATF3CCFOVBTHNHZOXFMG2MRATCCGM03CSLY0KMO';
  var clientSecret = 'LX0R5AUB4WDRFODRP1CKXNYPYRF42U2AHRZMCZGVL5TPTQHH';
  var url = "https://api.foursquare.com/v2/venues/search?ll=" + center.A + ',' + center.F +
    '&categoryId=' + '4d4b7105d754a06374d81259' + '&radius=' + '1000' + '&client_id=' +
    clientID + '&client_secret=' + clientSecret + '&v=201506013';
  var myJSON = $.getJSON(url);
  myModel.fSMarkers([]);
  $.getJSON(url, function(data){
    var array = [];
    $.each(data.response.venues, function(index, elem){
      // Create a marker for each place.
      var latlng = new google.maps.LatLng(elem.location.lat, elem.location.lng);
      var marker = new google.maps.Marker({
        map: Model.map,
        title: elem.name,
        position: latlng
      });
      var infowindow = new google.maps.InfoWindow({
          content: elem.name
      });

      // Add an Eventlistener to the marker that can access the marker's infowindow when clicked
      google.maps.event.addListener(marker, 'click', (function(infowindowCopy, markerCopy) {
        return function(){
          infowindowCopy.open(Model.map,markerCopy)
        };
      })(infowindow, marker));

      myModel.fSMarkers.push(marker);
    });
  });
}

function fSMarkerClicked(){
  for(var i=0; i<myModel.fSMarkers().length; i++){
    if(myModel.fSMarkers()[i].title == this.title){
      google.maps.event.trigger(myModel.fSMarkers()[i], 'click');
    }
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
var myModel = new ViewModel();
ko.applyBindings(myModel);
