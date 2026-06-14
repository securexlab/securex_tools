import axios from 'axios';
import FormData from 'form-data';
import formidable from 'formidable';
import fs from 'fs';

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
    maxFileSize: 50 * 1024 * 1024, // 50 MB limit
    multiples: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "File upload error: " + err.message });
    }

    let uploadedFiles = files.files || files.file;
    if (!uploadedFiles) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    if (!Array.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles];
    }

    if (uploadedFiles.length < 2) {
      return res.status(400).json({ error: "Please upload at least 2 files to merge" });
    }

    try {
      const pdfBuffers = [];

      for (const file of uploadedFiles) {
        const fileData = fs.readFileSync(file.filepath);
        const ext = (file.originalFilename || "").split(".").pop().toLowerCase();

        if (ext === "pdf") {
          pdfBuffers.push(fileData);
        } else {
          const formData = new FormData();
          formData.append("inputFile", fileData, {
            filename: file.originalFilename,
            contentType: file.mimetype,
          });

          const conversionResponse = await axios.post(
            "https://api.cloudmersive.com/convert/autodetect/to/pdf",
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
          pdfBuffers.push(Buffer.from(conversionResponse.data));
        }
      }

      if (pdfBuffers.length === 0) {
        return res.status(400).json({ error: "No valid files to merge" });
      }

      const mergeFormData = new FormData();
      pdfBuffers.forEach((buffer, index) => {
        mergeFormData.append("inputFiles", buffer, {
          filename: `document-${index + 1}.pdf`,
          contentType: "application/pdf"
        });
      });

      const mergeResponse = await axios.post(
        "https://api.cloudmersive.com/convert/merge/pdf/multi",
        mergeFormData,
        {
          headers: {
            ...mergeFormData.getHeaders(),
            Apikey: apiKey,
          },
          responseType: "arraybuffer",
          timeout: 60000,
        }
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="merged-${Date.now()}.pdf"`);
      return res.send(Buffer.from(mergeResponse.data));

    } catch (error) {
      console.error("Merge API Error:", error.message);
      let errorMsg = "Failed to merge documents.";
      if (error.response?.data) {
        try {
          errorMsg += " " + Buffer.from(error.response.data).toString('utf-8').substring(0, 200);
        } catch (e) {
          errorMsg += " " + error.message;
        }
      }
      return res.status(error.response?.status || 500).json({ error: errorMsg });
    } finally {
      // Clean up temp files left by formidable
      for (const file of uploadedFiles) {
        try {
          fs.unlinkSync(file.filepath);
        } catch (e) {}
      }
    }
  });
}