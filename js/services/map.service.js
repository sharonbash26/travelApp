import { api } from "./secret.js"
import { utilService } from "./util.service.js"

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMap,
    getPlaces,
    addPlace,
    removePlace,
    getPlaceById
}


// Var that is used throughout this Module (not global)
var gMap
var gPlaces=[]
var STORAGE_KEY='placeDB'

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap)
        })
}

function getMap() {
    return gMap
}
function getPlaces(){
    return gPlaces
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}
function addPlace(lat, lng, name, zoom) {
    const place = _createPlace( lat, lng, name,zoom)
    gPlaces.unshift(place)
    utilService.saveToStorage(STORAGE_KEY)

}
function _createPlace(latitude = 32.1416, longitude = 34.831213, name, zoom = 15) {
    return {
        id:  utilService.makeId(),
        lat: latitude,
        lng: longitude,
        name: name,
        zoom: zoom
    }

}
function getPlaceById(placeId) {
    return gPlaces.find(place => place.id === placeId)
}
function removePlace(placeId) {
    var placeIndex = gPlaces.findIndex(place => place.id === placeId)
    gPlaces.splice(placeIndex, 1)
    utilService.saveToStorage(STORAGE_KEY,gPlaces)
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${api.GOOGLE_MAPS_API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

