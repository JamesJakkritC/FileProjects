let ALLOWED_LOCATIONS = [];

let currentLocationName = "";
let userLat = 0;
let userLng = 0;

const RANGE_METERS = 100;

window.onload = async function () {
    try {
        //const res = await fetch("locations.json");
        const res = await fetch('https://script.google.com/macros/s/AKfycbynWe_GmPymYx3gDQDOqtf9ISPYWx2596K0241o75mKcglElb4YmNWfm_IIY9UrVFJR/exec?action=getLocations');
        ALLOWED_LOCATIONS = await res.json();
        initGeolocation(); // Start GPS check after loading locations
    } catch (err) {
        document.getElementById('gps-status').innerText = "❌ Failed to load location data.";
        console.error("Failed to load locations.json", err);
    }
};

function initGeolocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    } else {
        document.getElementById('gps-status').innerText = "Geolocation not supported.";
    }
}

function success(position) {
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;

    let withinRange = false;
    let nearestDistance = Infinity;

    for (const loc of ALLOWED_LOCATIONS) {
        const distance = getDistanceFromLatLonInMeters(loc.lat, loc.lng, userLat, userLng);
        if (distance <= 100) {
            withinRange = true;
            currentLocationName = loc.name;
            break;
        } else if (distance < nearestDistance) {
            nearestDistance = distance;
            currentLocationName = ""; // Clear if not close enough
        }
    }

    const checkinBtn = document.getElementById('checkin-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (withinRange) {
        checkinBtn.disabled = false;
        checkoutBtn.disabled = false;
        document.getElementById('gps-status').innerText =
            `✅ You are near ${currentLocationName}`;
    } else {
        checkinBtn.disabled = true;
        checkoutBtn.disabled = true;
        document.getElementById('gps-status').innerText =
            `🚫 Not near any allowed location (min dist: ${Math.round(nearestDistance)}m).`;
    }
}

function error(err) {
    console.error(err);
    document.getElementById('gps-status').innerText = "❌ Failed to get GPS location.";
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of Earth in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

//////////////////////////////////////////////////////////////
// 2. Your existing checkIn() function (leave as-is or after)
//////////////////////////////////////////////////////////////

async function checkIn() {
    const name = document.getElementById('name').value;
    if (!name) {
        alert('Please enter your name !!!');
        return;
    }

    const url = `https://script.google.com/macros/s/AKfycbynWe_GmPymYx3gDQDOqtf9ISPYWx2596K0241o75mKcglElb4YmNWfm_IIY9UrVFJR/exec?name=${encodeURIComponent(name)}&action=checkin&location=${encodeURIComponent(currentLocationName)}`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        document.getElementById('response').innerText = text;
    } catch (err) {
        console.error(err);
        document.getElementById('response').innerText = "Check-in failed";
    }
}

async function checkOut() {
    const name = document.getElementById('name').value;
    if (!name) {
        alert('Please enter your name !!!');
        return;
    }

    const url = `https://script.google.com/macros/s/AKfycbynWe_GmPymYx3gDQDOqtf9ISPYWx2596K0241o75mKcglElb4YmNWfm_IIY9UrVFJR/exec?name=${encodeURIComponent(name)}&action=checkout&location=${encodeURIComponent(currentLocationName)}`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        document.getElementById('response').innerText = text;
    } catch (err) {
        console.error(err);
        document.getElementById('response').innerText = "Check-out failed";
    }
}
