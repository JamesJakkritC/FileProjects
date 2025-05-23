function addLocation() {
  const name = document.getElementById("locationName").value;
  const lat = document.getElementById("locationLat").value;
  const lng = document.getElementById("locationLng").value;

  if (!name || !lat || !lng) {
    alert("❗ All fields required");
    return;
  }

  const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/AKfycbz6Zgp6P1D3lfpwHCFbkvkMIv3QGlG1CDWSnCasI3Djx4qY8r-I1lJ400-7df2W_RmL/exec`;
  fetch(GOOGLE_SCRIPT_URL + `?action=add_location&name=${name}&lat=${lat}&lng=${lng}`)
    .then(response => response.text())
    .then(data => {
      alert(data);
    })
    .catch(err => {
      console.error(err);
      alert("⚠️ Failed to save location.");
    });
}
