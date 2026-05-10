import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

// Helper function to get error message from error response
function getErrorMessage(error: any): string {
  if (!error) return "Unknown error";
  
  if (error.response?.data) {
    const data = error.response.data;
    // If it's a Buffer or binary data, convert to string safely
    if (Buffer.isBuffer(data)) {
      try {
        return data.toString('utf-8').substring(0, 500);
      } catch (e) {
        return `API Error (status ${error.response.status}): ${error.response.statusText || 'Unknown'}`;
      }
    } else if (typeof data === 'string') {
      return data.substring(0, 500);
    } else if (typeof data === 'object' && data.error) {
      return String(data.error).substring(0, 500);
    }
  }
  
  return error.message || "Unknown error";
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use memory storage for uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 3670016 }, // 3.5 MB limit
  });

  // Upload for multiple files (50 MB per file for merger)
  const uploadMultiple = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB per file
  });

  // API route for PDF to Word conversion
  app.post("/api/convert-pdf", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const apiKey = process.env.CLOUDMERSIVE_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Cloudmersive API key not configured" });
      }

      const formData = new FormData();
      formData.append("inputFile", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
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
          timeout: 30000,
        }
      );

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", `attachment; filename="${req.file.originalname.replace(".pdf", ".docx")}"`);
      res.send(response.data);
    } catch (error: any) {
      console.error("PDF Conversion Error:", error.message);
      res.status(error.response?.status || 500).json({ error: "Failed to convert PDF. " + getErrorMessage(error) });
    }
  });

  // API route for Word to PDF conversion
  app.post("/api/convert-word", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const apiKey = process.env.CLOUDMERSIVE_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Cloudmersive API key not configured" });
      }

      const formData = new FormData();
      formData.append("inputFile", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const response = await axios.post(
        "https://api.cloudmersive.com/convert/docx/to/pdf",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Apikey: apiKey,
          },
          responseType: "arraybuffer",
          timeout: 30000,
        }
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${req.file.originalname.replace(/\.(docx|doc)$/, ".pdf")}"`);
      res.send(response.data);
    } catch (error: any) {
      console.error("Word Conversion Error:", error.message);
      res.status(error.response?.status || 500).json({ error: "Failed to convert Word document. " + getErrorMessage(error) });
    }
  });

  // API route for Excel to PDF conversion
  app.post("/api/convert-excel", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const apiKey = process.env.CLOUDMERSIVE_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Cloudmersive API key not configured" });
      }

      const formData = new FormData();
      formData.append("inputFile", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const response = await axios.post(
        "https://api.cloudmersive.com/convert/xlsx/to/pdf",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Apikey: apiKey,
          },
          responseType: "arraybuffer",
          timeout: 30000,
        }
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${req.file.originalname.replace(/\.(xlsx|xls)$/, ".pdf")}"`);
      res.send(response.data);
    } catch (error: any) {
      console.error("Excel Conversion Error:", error.message);
      res.status(error.response?.status || 500).json({ error: "Failed to convert Excel file. " + getErrorMessage(error) });
    }
  });

  // API route for PPT to PDF conversion
  app.post("/api/convert-ppt", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const apiKey = process.env.CLOUDMERSIVE_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Cloudmersive API key not configured" });
      }

      const formData = new FormData();
      formData.append("inputFile", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const response = await axios.post(
        "https://api.cloudmersive.com/convert/pptx/to/pdf",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Apikey: apiKey,
          },
          responseType: "arraybuffer",
          timeout: 30000,
        }
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${req.file.originalname.replace(/\.(pptx|ppt)$/, ".pdf")}"`);
      res.send(response.data);
    } catch (error: any) {
      console.error("PPT Conversion Error:", error.message);
      res.status(error.response?.status || 500).json({ error: "Failed to convert PowerPoint file. " + getErrorMessage(error) });
    }
  });

  // API route for Nepali Calendar (Patro)
  app.get("/api/patro", async (req, res) => {
    try {
      const { year, month } = req.query;
      if (!year || !month) {
        return res.status(400).json({ error: "Year and month are required" });
      }

      const response = await axios.get(
        `https://securex-parva-api.onrender.com/api/festivals/calendar/${year}/${month}`,
        { timeout: 15000 }
      );
      res.json(response.data);
    } catch (error: any) {
      console.error("Patro Proxy Error:", error.message);
      
      let errorMsg = "Failed to fetch calendar data";
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        errorMsg = "The API took too long to respond. This usually happens when the backend is waking up. Please try again in a few seconds.";
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        errorMsg = "Unable to connect to calendar service. Please check your internet connection.";
      }
      
      res.status(error.response?.status || 503).json({ 
        error: errorMsg,
        details: error.response?.data || error.message 
      });
    }
  });

  // API route for AD to BS conversion
  app.get("/api/convert-ad-to-bs", async (req, res) => {
    try {
      const { year, month, day } = req.query;
      const date = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      const response = await axios.get(
        `https://securex-parva-api.onrender.com/api/calendar/convert?date=${date}`,
        { timeout: 15000 }
      );
      res.json(response.data);
    } catch (error: any) {
      console.error("AD to BS Proxy Error:", error.message);
      
      let errorMsg = "Conversion failed";
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        errorMsg = "The API took too long to respond. Please try again.";
      }
      
      res.status(error.response?.status || 503).json({ 
        error: errorMsg,
        details: error.response?.data || error.message
      });
    }
  });

  // API route for BS to AD conversion
  app.post("/api/convert-bs-to-ad", express.json(), async (req, res) => {
    try {
      const response = await axios.post(
        "https://securex-parva-api.onrender.com/api/calendar/bs-to-gregorian",
        req.body,
        { timeout: 15000 }
      );
      res.json(response.data);
    } catch (error: any) {
      console.error("BS to AD Proxy Error:", error.message);
      
      let errorMsg = "Conversion failed";
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        errorMsg = "The API took too long to respond. Please try again.";
      }
      
      res.status(error.response?.status || 503).json({ error: errorMsg });
    }
  });

  // API route for Today's date
  app.get("/api/today", async (req, res) => {
    try {
      const response = await axios.get("https://securex-parva-api.onrender.com/api/calendar/today", { timeout: 15000 });
      res.json(response.data);
    } catch (error: any) {
      console.error("Today Proxy Error:", error.message);
      
      let errorMsg = "Failed to fetch today date";
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        errorMsg = "The API took too long to respond. Please try again.";
      }
      
      res.status(error.response?.status || 503).json({ error: errorMsg });
    }
  });

  // Heatlh check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API route for Document Merger
  app.post("/api/merge", uploadMultiple.array("files"), async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const files = req.files as Express.Multer.File[];

      if (files.length < 2) {
        return res.status(400).json({
          error: "Please upload at least 2 files to merge",
        });
      }

      const apiKey = process.env.CLOUDMERSIVE_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Cloudmersive API key not configured" });
      }

      console.log(`[Merge] Processing ${files.length} files...`);

      // Process each file: convert to PDF if needed
      const pdfBuffers: Buffer[] = [];

      for (const file of files) {
        try {
          const fileName = file.originalname || file.filename;
          const ext = fileName.split(".").pop()?.toLowerCase();

          if (ext === "pdf") {
            // Already a PDF, use as-is
            pdfBuffers.push(file.buffer);
            console.log(`[Merge] Using PDF file: ${fileName}`);
          } else {
            // Convert to PDF using Cloudmersive Auto-Detect
            console.log(`[Merge] Converting ${ext?.toUpperCase()} to PDF: ${fileName}`);
            const formData = new FormData();
            formData.append("inputFile", file.buffer, {
              filename: fileName,
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
        } catch (error: any) {
          console.error(`Error processing file:`, error.message);
          throw error;
        }
      }

      if (pdfBuffers.length === 0) {
        return res.status(400).json({ error: "No valid files to merge" });
      }

      // Merge all PDFs
      console.log(`[Merge] Merging ${pdfBuffers.length} PDF files...`);
      const mergeFormData = new FormData();

      pdfBuffers.forEach((buffer, index) => {
        mergeFormData.append("inputFiles", buffer, `document-${index + 1}.pdf`);
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

      // Return the merged PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="merged-${Date.now()}.pdf"`
      );
      res.send(Buffer.from(mergeResponse.data));
    } catch (error: any) {
      console.error("[Merge API Error]:", error.message);

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
  });

  // Custom error handler for Multer and other unhandled errors.
  // This MUST be defined after all other app.use() and routes.
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Maximum size is 3.5 MB.' });
      }
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    } else if (err) {
      console.error("An unhandled error occurred:", err);
      return res.status(500).json({ error: 'An unexpected server error occurred. Please try again.' });
    }
    next();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
