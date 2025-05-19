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
    const lat = document.getElementById("locationLat").value;
    const lng = document.getElementById("locationLng").value;

    if (!name || !lat || !lng) {
        alert("❗ Please fill in all fields");
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
        .then(res => res.json())
        .then(data => alert(data.message))
        .catch(err => alert("❌ Error saving location"));

    document.getElementById("locationName").value = "";
    document.getElementById("locationLat").value = "";
    document.getElementById("locationLng").value = "";
}
