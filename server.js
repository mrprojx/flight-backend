const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all incoming requests
app.use(cors());

// Test route to confirm the backend is running
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Flight backend is working!' });
});

// Main AviationStack flight data route
app.get('/api/flight/:flightNumber', async (req, res) => {
  const { flightNumber } = req.params;
  const apiKey = process.env.AVIATIONSTACK_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'AviationStack API key is not configured on the server.' });
  }

  try {
    const response = await axios.get('http://api.aviationstack.com/v1/flights', {
      params: {
        access_key: apiKey,
        flight_iata: flightNumber
      }
    });

    const flights = response.data.data;

    if (!flights || flights.length === 0) {
      return res.status(404).json({ error: `No flight data found for ${flightNumber}.` });
    }

    const flight = flights[0];

    res.json({
      callsign: flight.flight?.iata || flight.flight?.icao || flight.flight?.number || 'N/A',
      origin: flight.departure?.airport || 'Unknown',
      destination: flight.arrival?.airport || 'Unknown',
      departureTimeUTC: flight.departure?.estimated || flight.departure?.scheduled || 'N/A',
      arrivalTimeUTC: flight.arrival?.estimated || flight.arrival?.scheduled || 'N/A',
      altitude: flight.live?.altitude || 'N/A'
    });
  } catch (error) {
    console.error('AviationStack API error:', error.message);
    res.status(500).json({ error: 'An error occurred while retrieving flight data.' });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`SkyTrace backend is running on port ${PORT}`);
});
