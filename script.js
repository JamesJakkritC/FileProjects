const ALLOWED_LOCATIONS = [
  //{ lat: 18.7816, lng: 99.0064, name: "Nong Hoi" },  // Me1
  //{ lat: 18.58128, lng: 99.04747, name: "One Nimman" },  // Me2
  { lat: 18.751662, lng: 99.012689, name: "Nong Hoi" },  // Location 1
  { lat: 18.800008, lng: 98.969783, name: "One Nimman" },  // Location 2
  //{ lat: 18.7700, lng: 99.0100 }   // Location 3
];

let currentLocationName = "";
let userLat = 0;
let userLng = 0;

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
  
  const url = `https://script.google.com/macros/s/AKfycbye3yBby9QDS5Op6Wf1eEDCF1iPEh3W7srVfKBuS0ikoXqPx_pgDS9yx3kq-4zCTsFL/exec?name=${encodeURIComponent(name)}&action=checkin&location=${encodeURIComponent(currentLocationName)}`;

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
  
  const url = `https://script.google.com/macros/s/AKfycbye3yBby9QDS5Op6Wf1eEDCF1iPEh3W7srVfKBuS0ikoXqPx_pgDS9yx3kq-4zCTsFL/exec?name=${encodeURIComponent(name)}&action=checkout&location=${encodeURIComponent(currentLocationName)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    document.getElementById('response').innerText = text;
  } catch (err) {
    console.error(err);
    document.getElementById('response').innerText = "Check-out failed";
  }
}

const ADMIN_USER = "admin";
const ADMIN_PASS = "123456"; // Change this securely in real applications

function adminLogin() {
  const user = document.getElementById("adminUsername").value;
  const pass = document.getElementById("adminPassword").value;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    document.getElementById("locationForm").style.display = "block";
    alert("✅ Login successful");
  } else {
    alert("❌ Invalid credentials");
  }
}

function addLocation() {
  const name = document.getElementById("locationName").value;
  const lat = document.getElementById("locationLat").value;
  const lng = document.getElementById("locationLng").value;

  if (!name || !lat || !lng) {
    alert("❗ All fields required");
    return;
  }

  fetch(GOOGLE_SCRIPT_URL + `?action=add_location&name=${name}&lat=${lat}&lng=${lng}`)
    .then(response => response.text())
    .then(data => {
      alert(data);
    })
    .catch(err => {
      console.error(err);
      alert("⚠️ Failed to save location.");
    });
}
