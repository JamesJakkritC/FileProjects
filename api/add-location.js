import fs from 'fs';
import path from 'path';

const tempFile = path.join('/tmp', 'locations.json');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, lat, lng } = req.body;

  let locations = [];

  try {
    if (fs.existsSync(tempFile)) {
      const data = fs.readFileSync(tempFile, 'utf-8');
      locations = JSON.parse(data);
    }

    locations.push({ name, lat: parseFloat(lat), lng: parseFloat(lng) });
    fs.writeFileSync(tempFile, JSON.stringify(locations, null, 2));

    console.log('Sending response:', { name, lat, lng });
    return res.status(200).json({ message: '✅ Location added', location: { name, lat, lng } });
  } catch (err) {
    return res.status(500).json({ message: '❌ Error saving location', error: err.message });
  }
}
