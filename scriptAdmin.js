const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/AKfycbwIIaXv0d9z-bWEFANgIWJLiTZbNwSVuhTFf_NQEHZEb1HIbFD5qxhExV17CbOD7mjk/exec`;
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

    fetch("/api/add-location", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                lat,
                lng
            })
        })
        .then(response => response.json())
        .then(data => {
                          console.log("Server response:", data);
                          alert(`✅ Added: ${data.location.name} (${data.location.lat}, ${data.location.lng})`);
                        })
        .catch(err => alert("❌ Error saving location"));

    document.getElementById("locationName").value = "";
    document.getElementById("locationLat").value = "";
    document.getElementById("locationLng").value = "";
}
