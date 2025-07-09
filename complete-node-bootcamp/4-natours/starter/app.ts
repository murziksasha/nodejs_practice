const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

const tours = JSON.parse(fs.readFileSync(
  path.join(__dirname, 'dev-data', 'data', 'tours-simple.json'),
  'utf-8'
));

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
