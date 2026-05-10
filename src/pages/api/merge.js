import formidable from "formidable";
import fs from "fs";
import axios from "axios";

// Disable body parsing to handle multipart/form-data manually
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Convert a file to PDF using Cloudmersive's Auto-Detect to PDF endpoint
 */
async function convertToPdf(fileBuffer, fileName, apiKey) {
  try {
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: "application/octet-stream" });
    formData.append("inputFile", blob, fileName);

    const response = await axios.post(
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

    return Buffer.from(response.data);
  } catch (error) {
    console.error(`Error converting ${fileName} to PDF:`, error.message);
    throw new Error(`Failed to convert ${fileName} to PDF: ${error.message}`);
  }
}

/**
 * Merge multiple PDF buffers using Cloudmersive's Merge Multiple PDFs endpoint
 */
async function mergePdfs(pdfBuffers, apiKey) {
  try {
    const formData = new FormData();

    // Append each PDF buffer as a file
    pdfBuffers.forEach((buffer, index) => {
      const blob = new Blob([buffer], { type: "application/pdf" });
      formData.append("inputFiles", blob, `document-${index + 1}.pdf`);
    });

    const response = await axios.post(
      "https://api.cloudmersive.com/convert/merge/pdf/multi",
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

    return Buffer.from(response.data);
  } catch (error) {
    console.error("Error merging PDFs:", error.message);
    throw new Error(`Failed to merge PDFs: ${error.message}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.CLOUDMERSIVE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Cloudmersive API key not configured" });
  }

  try {
    // Parse multipart/form-data using formidable
    const form = formidable({
      multiples: true,
      maxFileSize: 50 * 1024 * 1024, // 50 MB
    });

    const [fields, files] = await form.parse(req);

    // Handle both single and multiple files
    let uploadedFiles = files.files || [];
    if (!Array.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles];
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    if (uploadedFiles.length < 2) {
      return res.status(400).json({
        error: "Please upload at least 2 files to merge",
      });
    }

    // Process each file: convert to PDF if needed
    const pdfBuffers = [];

    for (const file of uploadedFiles) {
      try {
        const fileBuffer = fs.readFileSync(file.filepath);
        const fileName = file.originalFilename || file.filename;
        const ext = fileName.split(".").pop().toLowerCase();

        let pdfBuffer;

        if (ext === "pdf") {
          // Already a PDF, use as-is
          pdfBuffer = fileBuffer;
          console.log(`[Merge] Using PDF file: ${fileName}`);
        } else {
          // Convert to PDF using Cloudmersive
          console.log(`[Merge] Converting ${ext.toUpperCase()} to PDF: ${fileName}`);
          pdfBuffer = await convertToPdf(fileBuffer, fileName, apiKey);
        }

        pdfBuffers.push(pdfBuffer);
      } catch (error) {
        console.error(`Error processing file:`, error.message);
        throw error;
      }
    }

    if (pdfBuffers.length === 0) {
      return res.status(400).json({ error: "No valid files to merge" });
    }

    // Merge all PDFs
    console.log(`[Merge] Merging ${pdfBuffers.length} PDF files...`);
    const mergedPdf = await mergePdfs(pdfBuffers, apiKey);

    // Return the merged PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="merged-${Date.now()}.pdf"`
    );
    res.send(mergedPdf);
  } catch (error) {
    console.error("[Merge API Error]:", error.message);

    // Determine error message
    let errorMsg = "Failed to merge documents";
    if (error.response?.status === 401) {
      errorMsg = "API key is invalid";
    } else if (error.response?.status === 429) {
      errorMsg = "Too many requests. Please try again later.";
    } else if (error.message?.includes("timeout")) {
      errorMsg = "Request timeout. Files may be too large or server is busy.";
    }

    res.status(error.response?.status || 500).json({
      error: errorMsg,
      details: error.message,
    });
  }
}
