//const DEFAULT_LAT = 18.58128; // Change to your real location
//const DEFAULT_LNG = 99.04747;
const DEFAULT_LAT = 18.7816; // Change to your real location
const DEFAULT_LNG = 99.0064;
const RANGE_METERS = 100;

window.onload = function () {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(success, error, {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
});
  } else {
    document.getElementById('gps-status').innerText = "Geolocation not supported.";
  }
};

function success(position) {
  const userLat = position.coords.latitude;
  const userLng = position.coords.longitude;

  const distance = getDistanceFromLatLonInMeters(DEFAULT_LAT, DEFAULT_LNG, userLat, userLng);

  if (distance <= RANGE_METERS) {
    document.getElementById('checkin-btn').disabled = false;
    document.getElementById('checkout-btn').disabled = false;
    document.getElementById('gps-status').innerText = `You are within ${Math.round(distance)} meters. You can check in.`;
  } else {
    document.getElementById('gps-status').innerText = `Too far from location (${Math.round(distance)}m). You cannot check in.`;
  }
}

function error(err) {
  console.error(err);
  document.getElementById('gps-status').innerText = "Failed to get GPS location.";
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
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
  const url = `https://script.google.com/macros/s/AKfycbz-EwLwSGioDEOJUIfu3uLR6l9I4BSyGfgIJ2oEfkBci7xla4pTDKIuO8LvK-7zDflw/exec?name=${encodeURIComponent(name)}&action=checkin`;

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
  const url = `https://script.google.com/macros/s/AKfycbz-EwLwSGioDEOJUIfu3uLR6l9I4BSyGfgIJ2oEfkBci7xla4pTDKIuO8LvK-7zDflw/exec?name=${encodeURIComponent(name)}&action=checkout`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    document.getElementById('response').innerText = text;
  } catch (err) {
    console.error(err);
    document.getElementById('response').innerText = "Check-out failed";
  }
}
