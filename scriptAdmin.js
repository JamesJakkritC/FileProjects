const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/AKfycbz5I0kTu6YDb-Xiq1XQ-39VZ_6Dw6FNdumTwyzEhmvoq7jpAqfIm8NLBah7uSYoP4ig/exec`;
const ADMIN_USER = "admin";
const ADMIN_PASS = "123456";


//////////////////////////////////////////////////////////////
// 1. Validate Login.
//////////////////////////////////////////////////////////////
function adminLogin() {
    const user = document.getElementById("adminUsername").value;
    const pass = document.getElementById("adminPassword").value;
    
    showLoading(true);
    
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        document.getElementById("locationForm").style.display = "block";
        alert("✅ Login successful");
        showLoading(false);
    } else {
        alert("❌ Invalid credentials");
        showLoading(false);
    }
}

//////////////////////////////////////////////////////////////
// 2. Add Location.
//////////////////////////////////////////////////////////////

async function addLocation() {
    const name = document.getElementById("locationName").value;
    const lat = parseFloat(document.getElementById("locationLat").value);
    const lng = parseFloat(document.getElementById("locationLng").value);

    showLoading(true);
    
    if (!name || isNaN(lat) || isNaN(lng)) 
    {
        alert("❗ Please fill in all fields with valid values.");
        showLoading(false);
        return;
    }


  try {
    // 1. Fetch existing locations
    const response = await fetch(GOOGLE_SCRIPT_URL + `?action=getLocations`);
    const locations = await response.json();

    const nameLower = name.toLowerCase();
    const latFixed = parseFloat(lat.toFixed(8)); // Round to 6 decimals for comparison
    const lngFixed = parseFloat(lng.toFixed(8));

    // 2. Check for exact duplicate (name, lat, lng)
    const isDuplicateName = locations.some(loc =>
      (loc.name || "").toLowerCase() === nameLower
    );

    if (isDuplicateName) {
      alert("❌ This location (name) already exists.");
      showLoading(false);
      return;
    }
      
    const isDuplicateLatLng = locations.some(loc =>
      parseFloat(loc.lat).toFixed(8) === latFixed.toFixed(8) &&
      parseFloat(loc.lng).toFixed(8) === lngFixed.toFixed(8)
    );

    if (isDuplicateLatLng) {
      alert("❌ This location (latitude, and longitude) already exists.");
      showLoading(false);
      return;
    }

    // 3. Proceed to add
    const saveResponse = await fetch(
      `${GOOGLE_SCRIPT_URL}?action=addLocation&name=${encodeURIComponent(name)}&lat=${lat}&lng=${lng}`
    );
    const resultText = await saveResponse.text();

    alert(resultText);

    // 4. Clear input fields
    ClearData();

  } catch (err) {
    console.error("Error saving location:", err);
    showLoading(false);
    alert("⚠️ Failed to save location.");
  }

  showLoading(false);
}

//////////////////////////////////////////////////////////////
// 3. showLoading
//////////////////////////////////////////////////////////////
function showLoading(show) {
  const modal = document.getElementById("loadingModalAdmin");
  if (modal) {
    modal.style.display = show ? "flex" : "none";
  }
}

//////////////////////////////////////////////////////////////
// 4. Clear Data
//////////////////////////////////////////////////////////////
function ClearData() {
    document.getElementById("locationName").value = "";
    document.getElementById("locationLat").value = "";
    document.getElementById("locationLng").value = "";
}
