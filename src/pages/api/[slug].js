// In-memory cache to prevent spamming the backend
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export default async function handler(req, res) {
  // Fallback to your Render URL if .env is missing
  const API_BASE_URL = process.env.API_BASE_URL || "https://securex-parva-api.onrender.com";
  const { slug, ...queryParams } = req.query;

  let targetUrl = "";

  // 1. Map frontend Next.js routes to the actual Render API endpoints
  if (slug === "patro") {
    const { year, month } = queryParams;
    if (!year || !month) return res.status(400).json({ error: "Year and month are required" });
    targetUrl = `${API_BASE_URL}/api/festivals/calendar/${year}/${month}`;
  } else if (slug === "today") {
    // Map directly to the actual today endpoint provided by the Render backend
    // just like you had in your original server.ts setup
    targetUrl = `${API_BASE_URL}/api/calendar/today`;
  } else if (slug === "convert-ad-to-bs") {
    const { year, month, day } = queryParams;
    if (!year || !month || !day) return res.status(400).json({ error: "Year, month, and day are required" });
    const pad = (n) => n.toString().padStart(2, "0");
    const date = `${year}-${pad(month)}-${pad(day)}`;
    targetUrl = `${API_BASE_URL}/api/calendar/convert?date=${date}`;
  } else {
    return res.status(404).json({ error: "API route not found." });
  }

  // 2. Check if we have a valid cached response
  const cacheKey = targetUrl;
  if (req.method === 'GET' && cache.has(cacheKey)) {
    const cachedEntry = cache.get(cacheKey);
    if (Date.now() - cachedEntry.timestamp < CACHE_TTL) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).json(cachedEntry.data);
    } else {
      cache.delete(cacheKey); // Expired
    }
  }

  try {
    const response = await fetch(targetUrl, { method: req.method });

    // If Render API is sleeping, send a nice message to the frontend UI
    if (!response.ok) {
      return res.status(503).json({ error: "The calendar backend is currently waking up from sleep. Please wait a few seconds and try again." });
    }

    const data = await response.json();
    if (req.method === 'GET') cache.set(cacheKey, { timestamp: Date.now(), data });

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(503).json({ error: 'Connection to cosmic records failed. The backend server might be down.' });
  }
}