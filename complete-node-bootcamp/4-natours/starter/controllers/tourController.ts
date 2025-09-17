import * as fs from 'fs';
import * as path from 'path';
import { Tour, tourSchema } from '../models/tourModel';

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    // requestedAt: res.created_at,
    // data: {
    //   tours,
    // },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  // const tour = tours.find((t) => t.id === id);
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Tour not found',
  //   });
  // }
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

const createTour = async (req, res) => {
  // const newTour = new Tour(req.body);
  // newTour.save();

  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
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
export { getAllTours, getTour, createTour, updateTour, deleteTour, checkBody };
