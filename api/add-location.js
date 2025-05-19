import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, lat, lng } = req.body;
    const filePath = path.join(process.cwd(), 'locations.json');

    let locations = [];
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath);
      locations = JSON.parse(raw);
    }

    locations.push({ name, lat, lng });
    fs.writeFileSync(filePath, JSON.stringify(locations, null, 2));

    return res.status(200).json({
      message: '✅ Location added',
      location: { name, lat, lng },
    });
  }

  res.status(405).json({ message: 'Method not allowed' });
}
