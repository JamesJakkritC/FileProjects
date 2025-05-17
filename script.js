async function checkIn() {
  const name = document.getElementById('name').value;
  if (!name) {
    alert('Please enter your name');
    return;
  }

  const response = await fetch('https://script.google.com/macros/s/AKfycbwBkpnW1-J5bO6p2QAxPnIsOrf4WwgIcgmHf8SfOI9U7UwSqs9g7VnPRHg-SPNDykto/exec', {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await response.text();
  document.getElementById('response').innerText = result;
}
