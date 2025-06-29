let ALLOWED_LOCATIONS = [];
const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/AKfycbz5I0kTu6YDb-Xiq1XQ-39VZ_6Dw6FNdumTwyzEhmvoq7jpAqfIm8NLBah7uSYoP4ig/exec`;
let currentLocationName = "";
let userLat = 0;
let userLng = 0;

const RANGE_METERS = 100;

window.onload = async function () {
    try {
        //const res = await fetch("locations.json");
        const res = await fetch(GOOGLE_SCRIPT_URL + `?action=getLocations`);
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

    checkinBtn.disabled = false;
    checkoutBtn.disabled = false;
    
    if (withinRange) {
      currentLocationName = currentLocationName;
      //document.getElementById('gps-status').innerText = `✅ You are near ${currentLocationName}`;
    } else {
      currentLocationName = ""; // Clear current location
      //document.getElementById('gps-status').innerText = `⚠️ You are not near any allowed location.`;
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

    if (!currentLocationName) {
    alert("🚫 บันทึกเวลาเข้างานไม่สำเร็จ เนื่องจากคุณอยู่นอกพื้นที่ทำงาน.\n 🚫 သင်သည် အလုပ်ဧရိယာပြင်ပဖြစ်သောကြောင့် အချိန်ဝင်ရောက်မှု မအောင်မြင်ပါ။");
    return;
    }


    const url = GOOGLE_SCRIPT_URL + `?name=${encodeURIComponent(name)}&action=checkin&location=${encodeURIComponent(currentLocationName)}`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        //document.getElementById('response').innerText = text;
        alert(text);
    } catch (err) {
        console.error(err);
        //document.getElementById('response').innerText = "Check-in failed";
        alert(" 🚫 บันทึกเวลาเข้างานไม่สำเร็จ กรุณากดบันทึกเวลาเข้างานใหม่อีกครั้ง. \n 🚫 အလုပ်ချိန်ကို မှတ်တမ်းတင်ရန် မအောင်မြင်ပါ။ ကျေးဇူးပြု၍ အလုပ်ချိန်ကို မှတ်တမ်းတင်ရန် ထပ်မံနှိပ်ပါ။);
    }
}

async function checkOut() {
    const name = document.getElementById('name').value;
    if (!name) {
        alert('Please enter your name !!!');
        return;
    }
    
    if (!currentLocationName) {
    alert("🚫 บันทึกเวลาออกงานไม่สำเร็จ เนื่องจากคุณอยู่นอกพื้นที่ทำงาน.\n 🚫 သင်သည် အလုပ်ဧရိယာပြင်ပတွင် ရှိနေသောကြောင့် အချိန်ကုန် အသံသွင်းခြင်း မအောင်မြင်ပါ။");
    return;
    }

    const url = GOOGLE_SCRIPT_URL + `?name=${encodeURIComponent(name)}&action=checkout&location=${encodeURIComponent(currentLocationName)}`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        //document.getElementById('response').innerText = text;
        alert(text);
    } catch (err) {
        console.error(err);
        //document.getElementById('response').innerText = "Check-out failed";
        alert(" 🚫 บันทึกเวลาออกงานไม่สำเร็จ กรุณากดบันทึกเวลาออกงานใหม่อีกครั้ง. \n 🚫 အလုပ်ချိန်ကို မှတ်တမ်းတင်ရန် မအောင်မြင်ပါ။ ကျေးဇူးပြု၍ အလုပ်ချိန်ကို မှတ်တမ်းတင်ရန် ထပ်မံနှိပ်ပါ။);
    }
}
