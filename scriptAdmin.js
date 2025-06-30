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

function addLocation() {
    const name = document.getElementById("locationName").value;
    const lat = parseFloat(document.getElementById("locationLat").value);
    const lng = parseFloat(document.getElementById("locationLng").value);
    const modal = document.getElementById("loadingModal");

    showLoading(true);
    
    if (!name || !lat || !lng) {
        alert("❗ Please fill in all fields");
        showLoading(false);
        return;
    }

    if (isNaN(lat) || isNaN(lng)) {
        alert('Invalid latitude or longitude');
        showLoading(false);
        return;
    }

    modal.style.display = "flex";  // Show loading modal
    
    fetch(GOOGLE_SCRIPT_URL + `?action=addLocation&name=${name}&lat=${lat}&lng=${lng}`)
        .then(response => response.text())
        .then(data => {
            alert(data);
            showLoading(false);
        })
        .catch(err => {
            console.error(err);
            showLoading(false);
            alert("⚠️ Failed to save location.");
        })
        .finally(() => {
            showLoading(false);
            modal.style.display = "none";  // Hide modal
            document.getElementById("locationName").value = "";
            document.getElementById("locationLat").value = "";
            document.getElementById("locationLng").value = "";
        });
}

//////////////////////////////////////////////////////////////
// 4. showLoading
//////////////////////////////////////////////////////////////
function showLoading(show) {
  const modal = document.getElementById("loadingModalAdmin");
  if (modal) {
    modal.style.display = show ? "flex" : "none";
  }
}
