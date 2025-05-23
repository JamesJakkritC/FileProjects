const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/AKfycbz6Zgp6P1D3lfpwHCFbkvkMIv3QGlG1CDWSnCasI3Djx4qY8r-I1lJ400-7df2W_RmL/exec`;
const ADMIN_USER = "admin";
const ADMIN_PASS = "123456";

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
    const lat = parseFloat(document.getElementById("locationLat").value);
    const lng = parseFloat(document.getElementById("locationLng").value);

    if (!name || !lat || !lng) {
        alert("❗ Please fill in all fields");
        return;
    }

    if (isNaN(lat) || isNaN(lng)) {
        alert('Invalid latitude or longitude');
        return;
    }

  fetch(GOOGLE_SCRIPT_URL + `?action=addLocation&name=${name}&lat=${lat}&lng=${lng}`)
    .then(response => response.text())
    .then(data => {
      alert(data);
    })
    .catch(err => {
      console.error(err);
      alert("⚠️ Failed to save location.");
    });

    document.getElementById("locationName").value = "";
    document.getElementById("locationLat").value = "";
    document.getElementById("locationLng").value = "";
}
