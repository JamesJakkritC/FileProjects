async function checkIn() {
  const name = document.getElementById('name').value;
  if (!name) {
    alert('Please enter your name');
    return;
  }

  const response = await fetch('https://script.google.com/macros/s/AKfycbxBDUjHfQPgvqgo55mi0H9fKEvq1Bni7sl6ei2G0ai0Y5DV4RhIaSPvRxv1r1bVEMcg/exec', {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await response.text();
  document.getElementById('response').innerText = result;
}