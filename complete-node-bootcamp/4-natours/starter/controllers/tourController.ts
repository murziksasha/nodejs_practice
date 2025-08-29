import * as fs from 'fs';
import * as path from 'path';

const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../dev-data', 'data', 'tours-simple.json'),
    'utf-8'
  )
);

const checkId = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ 
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: res.created_at,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((t) => t.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
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
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour data here>',
    },
  });
};

const deleteTour = (req, res) => {

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
export {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId
};