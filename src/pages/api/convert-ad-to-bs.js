import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { year, month, day } = req.query;
    const date = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const response = await axios.get(
      `https://securex-parva-api.onrender.com/api/calendar/convert?date=${date}`,
      { timeout: 15000 }
    );
    res.json(response.data);
  } catch (error) {
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
}