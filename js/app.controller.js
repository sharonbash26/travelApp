import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemove=onRemove
window.onGo=onGo
window.getCurrentLocation=getCurrentLocation
var gMap
function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
                  gMap = mapService.getMap();
            gMap.addListener("click", (mapsMouseEvent) => {
                const name = prompt('Enter location:');
                const lat = mapsMouseEvent.latLng.lat();
                const lng = mapsMouseEvent.latLng.lng();

                console.log('lat long', lat, lng)
                mapService.addPlace(lat, lng, name, gMap.getZoom())
                renderPlaces()
            });
        })
        .catch((err) => {
            console.error('Error initializing map:', err);
        });
}



// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}
function onGo(){
    alert('goooo')
}
function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const currentLocation = new google.maps.LatLng(lat, lng);
  
          gMap.setCenter(currentLocation);
  
          var marker = new google.maps.Marker({
            position: currentLocation,
            map: gMap,  // Make sure the map variable is accessible and correctly initialized
            title: 'Current Location'
          });
  
          // Create a geocoder object
          var geocoder = new google.maps.Geocoder();
  
          // Reverse geocoding
          geocoder.geocode({ 'location': currentLocation }, function (results, status) {
            if (status === 'OK') {
              if (results[0]) {
                console.log("Place name is: ", results[0].formatted_address);
                var elCurLocation=document.querySelector('.user-pos')
                elCurLocation.innerText=results[0].formatted_address
              } else {
                console.log('No results found');
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
            }
          });
        },
        function (error) {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported in your browser.');
    }
  }
  

function onPanTo(lat,lng) {
    console.log('Panning the Map')
    mapService.panTo(lat, lng)
}

function onRemove(placeId) {
    mapService.removePlace(placeId)
    renderPlaces()
}


function renderPlaces() {
    var places = mapService.getPlaces()
    console.log('places', places)
    var elPlaces = document.querySelector('.places')
    if (!places.length) {
        elPlaces.innerHTML = `<span class="places-not-found text-light"> No places found </span>`
    } else {
        var strHTML = places.map(place => {
            console.log('placeName', place.name)
            console.log('placelat', place.lat)
            console.log('placelng', place.lng)
            return `
                <ul>
                    <li class="list-group-item"><span class="text-light fw-bold m-2">${place.name} </span><button class="x btn btn-outline-danger btn-sm" onclick="onRemove('${place.id}',event)">X</button>
                    <button class="go btn btn-outline-success btn-sm" onclick="onPanTo(${place.lat},${place.lng})">Go</button></li>
                </ul>`
        })
        elPlaces.innerHTML = strHTML.join('')
    }
}

//last version 