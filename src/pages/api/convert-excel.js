import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.CLOUDMERSIVE_API_KEY;
  if (!apiKey) {
    return res.status(401).json({ error: 'API key not configured' });
  }

  try {
    const form = formidable();
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.file?.[0] || files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = fs.readFileSync(file.filepath);

    // Convert Excel to PDF using Cloudmersive API
    const response = await axios.post(
      'https://api.cloudmersive.com/convert/xlsx/to/pdf',
      fileBuffer,
      {
        headers: {
          'Apikey': apiKey,
          'Content-Type': 'application/octet-stream',
        },
        responseType: 'arraybuffer',
      }
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalFilename.replace(/\.(xlsx|xls)$/i, '.pdf')}"`);
    res.send(Buffer.from(response.data));

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({
      error: error.response?.data?.message || 'Conversion failed'
    });
  }
}