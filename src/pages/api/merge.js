import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

// Disable Next.js default body parser to allow formidable to consume the stream
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
    const form = formidable({ multiples: true });
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Handle both single and multiple file uploads safely
    let uploadedFiles = files.files;
    if (!uploadedFiles) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    if (!Array.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles];
    }

    if (uploadedFiles.length < 2) {
      return res.status(400).json({ error: 'At least 2 files are required for merging' });
    }

    const pdfBuffers = [];

    // 1. Process each file: If not PDF, convert to PDF
    for (const file of uploadedFiles) {
      const fileBuffer = fs.readFileSync(file.filepath);
      const ext = file.originalFilename.split('.').pop().toLowerCase();

      if (ext === 'pdf') {
        pdfBuffers.push(fileBuffer);
      } else {
        // Convert non-PDF to PDF using Cloudmersive
        const convertData = new FormData();
        convertData.append('inputFile', fileBuffer, file.originalFilename);

        const convertRes = await axios.post(
          'https://api.cloudmersive.com/convert/autodetect/to/pdf',
          convertData,
          {
            headers: {
              ...convertData.getHeaders(),
              'Apikey': apiKey,
            },
            responseType: 'arraybuffer',
            timeout: 60000,
          }
        );
        pdfBuffers.push(convertRes.data);
      }
    }

    // 2. Merge all PDFs into one
    const mergeData = new FormData();
    pdfBuffers.forEach((buffer, index) => {
      mergeData.append('inputFiles', buffer, `document_${index + 1}.pdf`);
    });

    const mergeRes = await axios.post(
      'https://api.cloudmersive.com/convert/merge/pdf/multi',
      mergeData,
      {
        headers: {
          ...mergeData.getHeaders(),
          'Apikey': apiKey,
        },
        responseType: 'arraybuffer',
        timeout: 60000, // 60s timeout for large files
      }
    );

    // 3. Send back the merged PDF file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="merged-${Date.now()}.pdf"`);
    return res.status(200).send(mergeRes.data);

  } catch (error) {
    let errorDetails = error.message;
    if (error.response && error.response.data) {
      // Decode arraybuffer to string if Cloudmersive sent a JSON error
      errorDetails = Buffer.isBuffer(error.response.data) 
        ? error.response.data.toString() 
        : error.response.data;
    }
    console.error('Merge API Error:', errorDetails);
    return res.status(error.response?.status || 500).json({ 
      error: 'Failed to merge documents',
      details: errorDetails
    });
  }
}