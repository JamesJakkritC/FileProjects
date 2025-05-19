import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'locations.json');

  if (!fs.existsSync(filePath)) {
    return res.status(200).json([]); // return empty array if no file
  }

  const data = fs.readFileSync(filePath);
  const locations = JSON.parse(data);

  res.status(200).json(locations);
}
