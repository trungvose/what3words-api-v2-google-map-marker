function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(35.137879, -82.836914),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        scaleControl: true,
        streetViewControl: true
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var myMarker = new google.maps.Marker({
        position: new google.maps.LatLng(35.137879, -82.836914),
        draggable: true,
        icon: 'img/what3words.png'
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        var bounds = new google.maps.LatLngBounds();
        place = places[0];

        if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
        myMarker.setPosition(place.geometry.location);

        w3wReverse(toFixed(place.geometry.location.lat()), toFixed(place.geometry.location.lng()));
    });

    setCurrentPosition(map, myMarker, true);

    google.maps.event.addListener(myMarker, 'dragend', function (evt) {
        w3wReverse(toFixed(evt.latLng.lat()), toFixed(evt.latLng.lng()));
    });

    google.maps.event.addListener(myMarker, 'dragstart', function (evt) {
        document.getElementById('current').innerHTML = '<span>Loading...</span>';
    });

    map.setCenter(myMarker.position);
    myMarker.setMap(map);
}

var w3wReverse = function (lat, lng) {
    w3w.reverse({
        coords: [lat, lng]
    },
    {
        onSuccess: function (data) {
            if (data && data.words)
                document.getElementById('current').innerHTML = '<span>' + data.words + '</span>';
        },
        onFailure: function (data) {
            alert('Error. Please refresh the page.')
            console.log(JSON.stringify(data));
        }
    });
}

var setCurrentPosition = function (map, marker, set3word) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
            marker.setPosition(initialLocation);
            if (set3word) {
                w3wReverse(toFixed(position.coords.latitude), toFixed(position.coords.longitude));
            }
        });
    }
}

//reduce coords length to 6 
function toFixed(input) {
    return input.toFixed(6)
}