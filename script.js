async function checkIn() {
  const name = document.getElementById('name').value;
  if (!name) {
    alert('Please enter your name');
    return;
  }

  const url = `https://script.google.com/macros/s/1D1VSEvQqcMHvHviipfJHI6pe1p2XOp2KX0sh7ZREDic/exec?name=${encodeURIComponent(name)}`;

  try {
    const response = await fetch(url);
    const result = await response.text();
    document.getElementById('response').innerText = result;
  } catch (error) {
    console.error(error);
    document.getElementById('response').innerText = 'Failed to check in';
  }
}
