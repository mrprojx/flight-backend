const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Test route (optional)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Flight backend is working!' });
});

// OpenSky flight data route
app.get('/api/flights', async (req, res) => {
  try {
    const response = await axios.get('https://opensky-network.org/api/states/all');

    const flights = response.data.states.map(flight => ({
      icao24: flight[0],
      callsign: flight[1]?.trim(),
      origin_country: flight[2],
      time_position: flight[3],
      last_contact: flight[4],
      longitude: flight[5],
      latitude: flight[6],
      baro_altitude: flight[7],
      on_ground: flight[8],
      velocity: flight[9],
      heading: flight[10],
      vertical_rate: flight[11],
      geo_altitude: flight[13]
    }));

    res.json({ flights });
  } catch (err) {
    console.error('Error fetching flight data:', err.message);
    res.status(500).json({ error: 'Unable to fetch flight data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
