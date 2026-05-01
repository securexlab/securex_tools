import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

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
        }
      );

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", `attachment; filename="${req.file.originalname.replace(".pdf", ".docx")}"`);
      res.send(response.data);
    } catch (error: any) {
      console.error("PDF Conversion Error:", error.message);
      res.status(500).json({ error: "Failed to convert PDF. " + (error.response?.data?.toString() || error.message) });
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
        }
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${req.file.originalname.replace(/\.(docx|doc)$/, ".pdf")}"`);
      res.send(response.data);
    } catch (error: any) {
      console.error("Word Conversion Error:", error.message);
      res.status(500).json({ error: "Failed to convert Word document. " + (error.response?.data?.toString() || error.message) });
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
        }
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${req.file.originalname.replace(/\.(xlsx|xls)$/, ".pdf")}"`);
      res.send(response.data);
    } catch (error: any) {
      console.error("Excel Conversion Error:", error.message);
      res.status(500).json({ error: "Failed to convert Excel file. " + (error.response?.data?.toString() || error.message) });
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
        }
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${req.file.originalname.replace(/\.(pptx|ppt)$/, ".pdf")}"`);
      res.send(response.data);
    } catch (error: any) {
      console.error("PPT Conversion Error:", error.message);
      res.status(500).json({ error: "Failed to convert PowerPoint file. " + (error.response?.data?.toString() || error.message) });
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
        `https://securex-parva-api.onrender.com/api/festivals/calendar/${year}/${month}`
      );
      res.json(response.data);
    } catch (error: any) {
      console.error("Patro Proxy Error:", error.message);
      res.status(error.response?.status || 500).json({ 
        error: "Failed to fetch calendar data",
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
        `https://securex-parva-api.onrender.com/api/calendar/convert?date=${date}`
      );
      res.json(response.data);
    } catch (error: any) {
      console.error("AD to BS Proxy Error:", error.message);
      res.status(error.response?.status || 500).json({ 
        error: "Conversion failed",
        details: error.response?.data || error.message
      });
    }
  });

  // API route for BS to AD conversion
  app.post("/api/convert-bs-to-ad", express.json(), async (req, res) => {
    try {
      const response = await axios.post(
        "https://securex-parva-api.onrender.com/api/calendar/bs-to-gregorian",
        req.body
      );
      res.json(response.data);
    } catch (error: any) {
      console.error("BS to AD Proxy Error:", error.message);
      res.status(error.response?.status || 500).json({ error: "Conversion failed" });
    }
  });

  // API route for Today's date
  app.get("/api/today", async (req, res) => {
    try {
      const response = await axios.get("https://securex-parva-api.onrender.com/api/calendar/today");
      res.json(response.data);
    } catch (error: any) {
      console.error("Today Proxy Error:", error.message);
      res.status(error.response?.status || 500).json({ error: "Failed to fetch today date" });
    }
  });

  // Heatlh check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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
