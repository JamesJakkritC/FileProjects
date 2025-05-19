import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method Not Allowed'
        });
    }

    const {
        name,
        lat,
        lng
    } = req.body;
    const filePath = path.join(process.cwd(), 'public', 'locations.json');

    try {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const locations = JSON.parse(fileData);

        locations.push({
            name,
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        });
        fs.writeFileSync(filePath, JSON.stringify(locations, null, 2));

        return res.status(200).json({
            message: '✅ Location added successfully'
        });
    } catch (err) {
        return res.status(500).json({
            message: '❌ Error updating locations',
            error: err.message
        });
    }
}
