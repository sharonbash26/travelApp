import { storageService } from "./async-storage.service.js"
import { utilService } from "./util.service.js"

export const locService = {
    getLocs
}


const LOCS_KEY = 'locsDB'

_createLocs()


function getLocs() {
    return storageService.query(LOCS_KEY)
}

function addLoc(name, lat, lng) {
    const loc = _createLoc(name, lat, lng)

    
}

function _createLoc(name, lat , lng) {
    return {
        name, 
        lat,
        lng,
        createdAt: new Date(),
    }
}

function _createDemoLocs() {
    const locs = [
        { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
        { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
    ]
    utilService.saveToStorage(LOCS_KEY, locs)
}

function _createLocs() {
    let locs = utilService.loadFromStorage(LOCS_KEY)
    if (!locs || !locs.length) {
        _createDemoLocs()
    }
}
