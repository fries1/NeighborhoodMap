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

var myMap = function() {
  this.geocoder;
  this.map;
  this.markers = [];
  this.marker_types = [];

};

var ViewModel = function() {
  console.log(myMap.markers);
  console.log('test');
  var self = this;
  this.name = ko.observable('Stefan');

  this.populateMarkers = function(data) {
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
        map: myMap.map
      });
      var infowindow = new google.maps.InfoWindow({
            content: dataEntry.description
      });

      // Add an Eventlistener to the marker that can access the marker's infowindow when clicked
      google.maps.event.addListener(marker, 'click', (function(infowindowCopy, markerCopy) {
        return function(){
          infowindowCopy.open(myMap.map,markerCopy)
        };
      })(infowindow, marker));
      console.log('myMap.markers ' + myMap.markers)
      myMap.markers.push(marker);
    }
  };

  this.codeAddress = function() {
    var address = document.getElementById('address').value;
    myMap.geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        myMap.map.setCenter(results[0].geometry.location);
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
  };

  this.initialize = function() {
    console.log('initializing');
    myMap.geocoder = new google.maps.Geocoder();
    self.codeAddress();
    var mapOptions = {
      zoom: 14,
    }
    myMap.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // This event listener will call addMarker() when the map is clicked.
    // Was needed to get initial latLng values, might be used in the future to add
    // additional markers
    /*
    google.maps.event.addListener(map, 'click', function(event) {
      console.log('clicked');
      console.log('event.latLng ' + event.latLng);
      console.log(event.latLng);
      addMarker(event.latLng);
      positions.push(event.latLng);
    });
    */
    self.populateMarkers(data);

    // add filter html, not used atm
    /*
    var filterContainer = document.createElement('div');
    var label_all = document.createTextNode('all');
    filterContainer.appendChild(label_all);
    var checkbox_all = document.createElement("input");
    checkbox_all.type = 'checkbox';
    checkbox_all.className = 'checkbox_all';
    filterContainer.appendChild(checkbox_all);
    for(var i=0; i<)
    //var filter
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(filterContainer)
    */
  };

  // Add a marker to the map and push to the array.
  this.addMarker = function(location) {
    //console.log(location);
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    myMap.markers.push(marker);
  };

  // Sets the map on all markers in the array.
  this.setAllMap = function(map) {
    for (var i = 0; i < myMap.markers.length; i++) {
      myMap.markers[i].setMap(map);
    }
  };

  // Removes the markers from the map, but keeps them in the array.
  this.clearMarkers = function() {
    console.log('in clearMarkers');
    // might not work!
    self.setAllMap(null);
  };

  // Shows any markers currently in the array.
  this.showMarkers = function() {
    this.setAllMap(myMap.map);
  };

  // Deletes all markers in the array by removing references to them.
  this.deleteMarkers = function() {
    this.clearMarkers();
    myMap.markers = [];
  };

  google.maps.event.addDomListener(window, 'load', this.initialize);
};
ko.applyBindings(new ViewModel());



///////////////////////

/*

var geocoder;
var map;
var markers = [];
var marker_types = [];
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
]

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
      map: map
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
  // Was needed to get initial latLng values, might be used in the future to add
  // additional markers
  /*
  google.maps.event.addListener(map, 'click', function(event) {
    console.log('clicked');
    console.log('event.latLng ' + event.latLng);
    console.log(event.latLng);
    addMarker(event.latLng);
    positions.push(event.latLng);
  });
  */

  /*
  populateMarkers(data);

  // add filter html, not used atm
  /*
  var filterContainer = document.createElement('div');
  var label_all = document.createTextNode('all');
  filterContainer.appendChild(label_all);
  var checkbox_all = document.createElement("input");
  checkbox_all.type = 'checkbox';
  checkbox_all.className = 'checkbox_all';
  filterContainer.appendChild(checkbox_all);
  for(var i=0; i<)
  //var filter
  map.controls[google.maps.ControlPosition.LEFT_CENTER].push(filterContainer)
  */
  /*
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
      /*
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}



ko.applyBindings(new ViewModel());

google.maps.event.addDomListener(window, 'load', initialize);

*/
