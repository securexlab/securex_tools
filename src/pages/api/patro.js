import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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
  } catch (error) {
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
}