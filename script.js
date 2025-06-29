let ALLOWED_LOCATIONS = [];
const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/AKfycbz5I0kTu6YDb-Xiq1XQ-39VZ_6Dw6FNdumTwyzEhmvoq7jpAqfIm8NLBah7uSYoP4ig/exec`;
let currentLocationName = "";
let userLat = 0;
let userLng = 0;

const RANGE_METERS = 100;

//////////////////////////////////////////////////////////////
// 1. Start loading the GPS Location
//////////////////////////////////////////////////////////////
window.onload = async function () {
    try {
        //const res = await fetch("locations.json");
        const res = await fetch(GOOGLE_SCRIPT_URL + `?action=getLocations`);
        ALLOWED_LOCATIONS = await res.json();
        initGeolocation(); // Start GPS check after loading locations
        fetchEmployeeCodes(); // Get EmployeeCodes form Google sheet;
    } catch (err) {
        document.getElementById('gps-status').innerText = " ❌ ไม่สามารถโหลดข้อมูลตำแหน่งได้. \n ❌ တည်နေရာဒေတာကို တင်၍မရပါ။ ";
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
    document.getElementById('gps-status').innerText = " ❌ ไม่สามารถโหลดข้อมูลตำแหน่งได้. \n ❌ တည်နေရာဒေတာကို တင်၍မရပါ။ ";
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
// 2. Action checkIn()
//////////////////////////////////////////////////////////////
async function checkIn() {
    const name = document.getElementById('name').value;
    showLoading(true); // Show loading modal
    
    if (!name) {
        alert(' กรุณากรอกรหัสพนักงาน !!! \n ကျေးဇူးပြု၍ သင့်ဝန်ထမ်းကုဒ်ကို ထည့်ပါ။ !!! ');
        showLoading(false);
        return;
    }

    if (!isValidEmployeeCode(name)) {
        alert('❌ ไม่พบรหัสพนักงาน กรุณากรอกรหัสพนักงานใหม่.\n ❌ ဝန်ထမ်း ID မတွေ့ပါ။ ဝန်ထမ်း ID အသစ်ကို ထည့်ပါ။ ');
        hideLoading();
        return;
    }

    if (!currentLocationName) {
        alert(" 🚫 บันทึกเวลาเข้างานไม่สำเร็จ เนื่องจากคุณอยู่นอกพื้นที่ทำงาน.\n 🚫 သင်သည် အလုပ်ဧရိယာပြင်ပဖြစ်သောကြောင့် အချိန်ဝင်ရောက်မှု မအောင်မြင်ပါ။ ");
        hideLoading();
        return;
    }

    const url = GOOGLE_SCRIPT_URL + `?name=${encodeURIComponent(name)}&action=checkin&location=${encodeURIComponent(currentLocationName)}`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        //document.getElementById('response').innerText = text;
        alert(text);
        hideLoading();
    } catch (err) {
        console.error(err);
        //document.getElementById('response').innerText = "Check-in failed";
        alert(" 🚫 บันทึกเวลาเข้างานไม่สำเร็จ กรุณากดบันทึกเวลาเข้างานใหม่อีกครั้ง. \n 🚫 အလုပ်ချိန်ကို မှတ်တမ်းတင်ရန် မအောင်မြင်ပါ။ ကျေးဇူးပြု၍ အလုပ်ချိန်ကို မှတ်တမ်းတင်ရန် ထပ်မံနှိပ်ပါ။ ");
        hideLoading();
    }
}

//////////////////////////////////////////////////////////////
// 3. Action checkOut()
//////////////////////////////////////////////////////////////
async function checkOut() {
    const name = document.getElementById('name').value;
    showLoading(true); // Show loading modal
    
    if (!name) {
        alert(' กรุณากรอกรหัสพนักงาน !!! \n ကျေးဇူးပြု၍ သင့်ဝန်ထမ်းကုဒ်ကို ထည့်ပါ။ !!! ');
        hideLoading();
        return;
    }

    if (!isValidEmployeeCode(name)) {
        alert('❌ ไม่พบรหัสพนักงาน กรุณากรอกรหัสพนักงานใหม่.\n ❌ ဝန်ထမ်း ID မတွေ့ပါ။ ဝန်ထမ်း ID အသစ်ကို ထည့်ပါ။ ');
        hideLoading();
        return;
    }
    
    if (!currentLocationName) {
        alert(" 🚫 บันทึกเวลาออกงานไม่สำเร็จ เนื่องจากคุณอยู่นอกพื้นที่ทำงาน.\n 🚫 သင်သည် အလုပ်ဧရိယာပြင်ပတွင် ရှိနေသောကြောင့် အချိန်ကုန် အသံသွင်းခြင်း မအောင်မြင်ပါ။ ");
        hideLoading();
        return;
    }

    const url = GOOGLE_SCRIPT_URL + `?name=${encodeURIComponent(name)}&action=checkout&location=${encodeURIComponent(currentLocationName)}`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        //document.getElementById('response').innerText = text;
        alert(text);
        hideLoading();
    } catch (err) {
        console.error(err);
        //document.getElementById('response').innerText = "Check-out failed";
        alert(" 🚫 บันทึกเวลาออกงานไม่สำเร็จ กรุณากดบันทึกเวลาออกงานใหม่อีกครั้ง. \n 🚫 အလုပ်ချိန်ကို မှတ်တမ်းတင်ရန် မအောင်မြင်ပါ။ ကျေးဇူးပြု၍ အလုပ်ချိန်ကို မှတ်တမ်းတင်ရန် ထပ်မံနှိပ်ပါ။ ");
        hideLoading();
    }
}

//////////////////////////////////////////////////////////////
// 4. showLoading
//////////////////////////////////////////////////////////////
function showLoading(show) {
  const modal = document.getElementById("loadingModal");
  if (modal) {
    modal.style.display = show ? "flex" : "none";
  }
}

function showLoading() {
  document.getElementById("loadingModal").style.display = "block";
}

function hideLoading() {
  document.getElementById("loadingModal").style.display = "none";
}

//////////////////////////////////////////////////////////////
// 5. Get Employee Codes from Google sheet
//////////////////////////////////////////////////////////////
let validEmployeeCodes = [];

function fetchEmployeeCodes() {
  fetch(GOOGLE_SCRIPT_URL + "?action=getEmployees")
    .then(res => res.json())
    .then(data => {
      validEmployeeCodes = data.map(code => code.trim().toLowerCase());
      const datalist = document.getElementById("employeeList");
      datalist.innerHTML = "";
      data.forEach(code => {
        const option = document.createElement("option");
        option.value = code;
        datalist.appendChild(option);
      });
    })
    .catch(err => {
      console.error("Failed to fetch employee codes:", err);
    });
}

//////////////////////////////////////////////////////////////
// 6. Validate EmployeeCode
//////////////////////////////////////////////////////////////
function isValidEmployeeCode(code) {
  return validEmployeeCodes.includes(code.trim().toLowerCase());
}
