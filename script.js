async function checkIn() {
  const name = document.getElementById('name').value;
  if (!name) {
    alert('Please enter your name ?');
    return;
  }

  try {
    const response = await fetch('/api/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    const result = await response.text();
    document.getElementById('response').innerText = result;
  } catch (error) {
    console.error(error);
    document.getElementById('response').innerText = 'Check-in failed.';
  }
}