import axios from 'axios';
import FormData from 'form-data';
import formidable from 'formidable';
import fs from 'fs';

// Disable Next.js default body parser to handle multipart/form-data manually
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.CLOUDMERSIVE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Cloudmersive API key not configured" });
  }

  const form = formidable({
    maxFileSize: 3.5 * 1024 * 1024, // 3.5 MB limit
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "File upload error: " + err.message });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const singleFile = Array.isArray(file) ? file[0] : file;

    try {
      const fileData = fs.readFileSync(singleFile.filepath);
      const formData = new FormData();
      
      formData.append("inputFile", fileData, {
        filename: singleFile.originalFilename,
        contentType: singleFile.mimetype,
      });

      const response = await axios.post(
        "https://api.cloudmersive.com/convert/pdf/to/docx",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Apikey: apiKey,
          },
          responseType: "arraybuffer",
          timeout: 60000,
        }
      );

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", `attachment; filename="${singleFile.originalFilename.replace(".pdf", ".docx")}"`);
      return res.send(Buffer.from(response.data));
    } catch (error) {
      console.error("PDF Conversion Error:", error.message);
      let errorMsg = "Failed to convert PDF.";
      if (error.response?.data) {
        try {
          errorMsg += " " + Buffer.from(error.response.data).toString('utf-8').substring(0, 200);
        } catch (e) {
          errorMsg += " " + error.message;
        }
      }
      return res.status(error.response?.status || 500).json({ error: errorMsg });
    } finally {
      // Clean up the temporary file created by formidable
      try {
        fs.unlinkSync(singleFile.filepath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });
}