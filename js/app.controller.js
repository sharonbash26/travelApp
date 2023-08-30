import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemove=onRemove
window.onGoToLocation=onGoToLocation
window.onGo=onGo
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
// function onPanTo(lat,lng) {
//     console.log('Panning the Map')
//     mapService.panTo(lat, lng)
// }

function onPanTo(lat,lng) {
    console.log('Panning the Map')
    mapService.panTo(lat, lng)
}

function onRemove(placeId) {
    mapService.removePlace(placeId)
    renderPlaces()
}
function onGoToLocation(placeId) {
    const place =  mapService.getPlaceById(placeId)
    gMap.setCenter({ lat: place.lat, lng: place.lng })
    gMap.setZoom(place.zoom)
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
<<<<<<< HEAD
                    <li>Place Name:${place.name}<button class="x" onclick="onRemove('${place.id}',event)">X</button>
                    <button class="go" onclick="onPanTo(${place.lat},${place.lng})">Go</button></li>

=======
                    <li class="list-group-item"><span class="text-light fw-bold m-2">${place.name} </span><button class="x btn btn-outline-danger btn-sm" onclick="onRemove('${place.id}',event)">X</button>
                    <button class="go btn btn-outline-success btn-sm" onclick="onPanTo('${place.id}')">Go</button></li>
>>>>>>> 7a2dc7efca4e1a4b08100a4fac0bf10827ff6056
                </ul>`
        })
        elPlaces.innerHTML = strHTML.join('')
    }
}