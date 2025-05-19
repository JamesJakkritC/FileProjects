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
      if (!name) {
    alert('Please enter your name !!!');
    return;
  }
    
    const name = document.getElementById("locationName").value;
        if (!name) {
            alert('Please enter locationName !!!');
            return;
        }
    const lat = document.getElementById("locationLat").value;
        if (!lat) {
            alert('Please enter locationLat !!!');
            return;
        }
    const lng = document.getElementById("locationLng").value;
        if (!lng) {
            alert('Please enter locationLng !!!');
            return;
        }

    fetch(`${GOOGLE_SCRIPT_URL}?action=add_location&name=${name}&lat=${lat}&lng=${lng}`)
        .then(res => res.text())
        .then(msg => alert(msg))
        .catch(err => alert("❗ Error saving location"));
}
