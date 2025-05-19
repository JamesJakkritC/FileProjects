import fs from 'fs';
import path from 'path';

const tempFile = path.join('/tmp', 'locations.json');

export default function handler(req, res) {
  try {
    if (!fs.existsSync(tempFile)) {
      return res.status(200).json([]); // Return empty array if file not found
    }

    const data = fs.readFileSync(tempFile, 'utf-8');
    const locations = JSON.parse(data);
    return res.status(200).json(locations);
  } catch (err) {
    return res.status(500).json({ message: '❌ Failed to read locations', error: err.message });
  }
}
