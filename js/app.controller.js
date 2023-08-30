import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemove=onRemove

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
            const map = mapService.getMap();
            map.addListener("click", (mapsMouseEvent) => {
                const name = prompt('Enter location:');
                const lat = mapsMouseEvent.latLng.lat();
                const lng = mapsMouseEvent.latLng.lng();

                console.log('lat long', lat, lng)
                mapService.addPlace(lat, lng, name, map.getZoom())
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
function onPanTo() {
    console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}

function onRemove(placeId) {
    console.log('fff')
    mapService.removePlace(placeId)
    renderPlaces()
    console.log('ggg')
}

function renderPlaces() {
    var places = mapService.getPlaces()
    console.log('places', places)
    var elPlaces = document.querySelector('.places')
    if (!places.length) {
        elPlaces.innerHTML = `<span class="places-not-found"> No places found </span>`
    } else {
        var strHTML = places.map(place => {
            console.log('placeName', place.name)
            return `
                <ul>
                    <li>Place Name:${place.name}<button class="x" onclick="onRemove('${place.id}',event)">X</button>
                    <button class="go" onclick="onPanTo('${place.id}')">Go</button></li>
                </ul>`
        })
        elPlaces.innerHTML = strHTML.join('')
    }
}