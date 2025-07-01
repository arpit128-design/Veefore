const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.json({ message: 'Test successful' });
});

const server = app.listen(5000, '0.0.0.0', () => {
  console.log('Test server running on port 5000');
});