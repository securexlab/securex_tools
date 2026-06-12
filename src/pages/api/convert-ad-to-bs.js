export default function handler(req, res) {
  const { year, month, day } = req.query;

  if (!year || !month || !day) {
    return res.status(400).json({ error: 'Missing year, month, or day parameter' });
  }

  try {
    const adYear = parseInt(year);
    const adMonth = parseInt(month);
    const adDay = parseInt(day);

    // Simple BS conversion
    const bsYear = adYear + 56;
    const bsMonth = adMonth;
    const bsDay = adDay;

    // Month and tithi names
    const monthNames = [
      'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
      'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
    ];

    const tithiNames = [
      '', 'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
      'Shashti', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi',
      'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'
    ];

    // Tithi calculation
    const tithiNum = ((bsDay - 1) % 15) + 1;
    const tithiName = tithiNames[tithiNum] || 'Tithi';
    
    // Moon phase
    let moonPhase = 'Waxing';
    if (tithiNum === 15) moonPhase = 'Full Moon (Purnima)';
    if (tithiNum === 30) moonPhase = 'New Moon (Amavasya)';

    // Nepal Sambat (another calendar system, starting from 879 AD)
    const nepalSambatYear = adYear - 879;

    // Generate mock sunrise/sunset times for Kathmandu
    const today = new Date(adYear, adMonth - 1, adDay);
    const dayOfYear = Math.floor((today - new Date(adYear, 0, 0)) / 86400000);
    
    // Approximate sunrise time (varies throughout year, roughly 5:00 AM - 6:30 AM in Kathmandu)
    const sunriseHour = 5 + (Math.sin((dayOfYear / 365) * Math.PI * 2) * 0.5);
    const sunriseMinute = Math.floor((sunriseHour % 1) * 60);
    
    // Approximate sunset time (roughly 5:00 PM - 6:30 PM in Kathmandu)
    const sunsetHour = 17 + (Math.sin((dayOfYear / 365) * Math.PI * 2) * 0.5);
    const sunsetMinute = Math.floor((sunsetHour % 1) * 60);

    const dateStr = `${adYear}-${String(adMonth).padStart(2, '0')}-${String(adDay).padStart(2, '0')}`;
    const sunriseTime = new Date(dateStr + `T${String(Math.floor(sunriseHour)).padStart(2, '0')}:${String(sunriseMinute).padStart(2, '0')}:00+05:45`).toISOString();
    const sunsetTime = new Date(dateStr + `T${String(Math.floor(sunsetHour)).padStart(2, '0')}:${String(sunsetMinute).padStart(2, '0')}:00+05:45`).toISOString();

    res.status(200).json({
      gregorian: {
        date: `${adYear}-${String(adMonth).padStart(2, '0')}-${String(adDay).padStart(2, '0')}`,
        year: adYear,
        month: adMonth,
        day: adDay
      },
      bikram_sambat: {
        year: bsYear,
        month: bsMonth,
        day: bsDay,
        month_name: monthNames[bsMonth - 1]
      },
      tithi: {
        tithi_name: tithiName,
        tithi_number: tithiNum,
        paksha: tithiNum <= 15 ? 'Shukla' : 'Krishna',
        moon_phase: moonPhase,
        sunrise_used: sunriseTime,
        sunset_used: sunsetTime
      },
      nepal_sambat: {
        year: nepalSambatYear,
        formatted: `${nepalSambatYear}`
      },
      day_of_week: today.getDay(),
      timestamp: today.getTime()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to convert date' });
  }
}
