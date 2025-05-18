//const DEFAULT_LAT = 18.58128; // Iphone Me 
//const DEFAULT_LNG = 99.04747;
//const DEFAULT_LAT = 18.7816; // Computer ME
//const DEFAULT_LNG = 99.0064;

const ALLOWED_LOCATIONS = [
  { lat: 18.7816, lng: 99.0064 },  // Location 1
  { lat: 18.58128, lng: 99.04747 },  // Location 2
  //{ lat: 18.7700, lng: 99.0100 }   // Location 3
];

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

  let withinRange = false;
  let nearestDistance = Infinity;

  for (const loc of ALLOWED_LOCATIONS) {
    const distance = getDistanceFromLatLonInMeters(loc.lat, loc.lng, userLat, userLng);
    if (distance < nearestDistance) nearestDistance = distance;

    if (distance <= RANGE_METERS) {
      withinRange = true;
      break;
    }
  }

  if (withinRange) {
    document.getElementById('checkin-btn').disabled = false;
    document.getElementById('checkout-btn').disabled = false;
    document.getElementById('gps-status').innerText =
      `✅ You are within ${Math.round(nearestDistance)} meters of an allowed location.`;
  } else {
    document.getElementById('checkin-btn').disabled = true;
    document.getElementById('checkout-btn').disabled = true;
    document.getElementById('gps-status').innerText =
      `🚫 Too far from any allowed location (${Math.round(nearestDistance)}m).`;
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
  
  const url = `https://script.google.com/macros/s/AKfycbxPdCqO5HheZVtFIrHYzCzTvaK7_PcGYQXpzm4lhWB-ZUhR9oXVlQ2VMulAYeb2pyJM/exec?name=${encodeURIComponent(name)}&action=checkin`;

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
  
  const url = `https://script.google.com/macros/s/AKfycbxPdCqO5HheZVtFIrHYzCzTvaK7_PcGYQXpzm4lhWB-ZUhR9oXVlQ2VMulAYeb2pyJM/exec?name=${encodeURIComponent(name)}&action=checkout`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    document.getElementById('response').innerText = text;
  } catch (err) {
    console.error(err);
    document.getElementById('response').innerText = "Check-out failed";
  }
}
