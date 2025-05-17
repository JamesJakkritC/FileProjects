async function checkIn() {
  const name = document.getElementById('name').value;
  if (!name) {
    alert('Please enter your name');
    return;
  }

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbylKWau7EvWxcaX5Ygnuzs5C0SeJudv5iowmIxSlXrn-I6xxCaVRsR3uUCY8_4s-bTG/exec?name=' + encodeURIComponent(name));
    const text = await response.text();
    document.getElementById('response').innerText = text;
  } catch (err) {
    console.error(err);
    document.getElementById('response').innerText = 'Failed to check in.';
  }
}
