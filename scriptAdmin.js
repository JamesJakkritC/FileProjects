const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/AKfycbzhEItBfJGPP0Fbc9Ew5QO9F06OqSkc-rUqMD5lxowYR9_Z26nHiueWHj_H5TkRu83a/exec`;
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
    const modal = document.getElementById("loadingModal");

    if (!name || !lat || !lng) {
        alert("❗ Please fill in all fields");
        return;
    }

    if (isNaN(lat) || isNaN(lng)) {
        alert('Invalid latitude or longitude');
        return;
    }

    modal.style.display = "flex";  // Show loading modal
    
    fetch(GOOGLE_SCRIPT_URL + `?action=addLocation&name=${name}&lat=${lat}&lng=${lng}`)
        .then(response => response.text())
        .then(data => {
            alert(data);
        })
        .catch(err => {
            console.error(err);
            alert("⚠️ Failed to save location.");
        })
        .finally(() => {
            modal.style.display = "none";  // Hide modal
            document.getElementById("locationName").value = "";
            document.getElementById("locationLat").value = "";
            document.getElementById("locationLng").value = "";
        });
}
