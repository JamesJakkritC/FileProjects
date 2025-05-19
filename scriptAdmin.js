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

      fetch(`${GOOGLE_SCRIPT_URL}?action=add_location&name=${name}&lat=${lat}&lng=${lng}`)
        .then(res => res.text())
        .then(msg => alert(msg))
        .catch(err => alert("❗ Error saving location"));
    }
