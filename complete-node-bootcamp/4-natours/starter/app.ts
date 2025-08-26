
const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev')); // Logging middleware for development
app.use(express.json()); // Middleware to parse JSON bodies

// MIDDLEWARES

app.use((req, res, next) => {
  const currentTime = new Date().toISOString();
  res.created_at = currentTime; // Add createdAt property to the response
  // console.log(`[${currentTime}] Request received:`);
  // console.log(`${req.method} ${req.url}`);
  next(); // Call the next middleware or route handler
});

const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'dev-data', 'data', 'tours-simple.json'),
    'utf-8'
  )
);

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
  const id = req.params.id * 1;
  if (id > tours.length || id < 1) {
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
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length || req.params.id < 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
}

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
}

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
}

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
}

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
}


// ROUTES
// Tour routes

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

  // User routes

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// Start the server

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
