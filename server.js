const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Flight backend is working!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
