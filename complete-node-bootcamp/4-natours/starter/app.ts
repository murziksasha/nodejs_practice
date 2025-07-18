const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'dev-data', 'data', 'tours-simple.json'),
    'utf-8'
  )
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(t => t.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    },
  });
});



app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${path.join(__dirname, 'dev-data', 'data', 'tours-simple.json')}`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'fail',
          message: 'Error saving the new tour',
        });
      }
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  if(id > tours.length || id < 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
      res.status(200).json({
        status: 'success',
        data: {
          tour: '<Updated tour data here>',
        },
      });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tourIndex = tours.findIndex(t => t.id === id);
  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  tours.splice(tourIndex, 1);
  fs.writeFile(
    `${path.join(__dirname, 'dev-data', 'data', 'tours-simple.json')}`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'fail',
          message: 'Error deleting the tour',
        });
      }
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
