import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const response = await axios.post(
      "https://securex-parva-api.onrender.com/api/calendar/bs-to-gregorian",
      req.body,
      { timeout: 15000 }
    );
    res.json(response.data);
  } catch (error) {
    console.error("BS to AD Proxy Error:", error.message);
    
    let errorMsg = "Conversion failed";
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      errorMsg = "The API took too long to respond. Please try again.";
    }
    
    res.status(error.response?.status || 503).json({ error: errorMsg });
  }
}