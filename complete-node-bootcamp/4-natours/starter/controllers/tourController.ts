import * as fs from 'fs';
import * as path from 'path';
import { Tour } from '../models/tourModel';

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

const aliasTopTours = (req, res, next) => {
  const add = {
    limit: '5',
    sort: '-ratingsAverage,price',
    fields: 'name,price,ratingsAverage,summary,difficulty',
  };

  // safe: keep original req.query untouched, store alias params separately
  // @ts-ignore
  req.aliasQuery = { ...add };

  console.log('aliasTopTours set req.aliasQuery:', req.aliasQuery);
  next();
};

const getAllTours = async (req, res) => {
  try {
    console.log('Request query at start:', req.query);
    //{ 'duration[gte]': '5', difficulty: 'easy' }
    //{ 'duration[$gte]': '5', difficulty: 'easy' } - after replace

    //Build the query
    //1) Filtering
    const queryObject = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);

    //2) Advanced Filtering
    const mongoQuery = {};
    Object.keys(queryObject).forEach((key) => {
      const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);
      if (match) {
        const field = match[1];
        const operator = `$${match[2]}`;
        if (!mongoQuery[field]) mongoQuery[field] = {};
        // Convert value to number if possible
        const val = isNaN(queryObject[key])
          ? queryObject[key]
          : Number(queryObject[key]);
        mongoQuery[field][operator] = val;
      } else {
        // Convert value to number if possible
        mongoQuery[key] = isNaN(queryObject[key])
          ? queryObject[key]
          : Number(queryObject[key]);
      }
    });

    let query = Tour.find(mongoQuery);

    //3) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //4) Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //5) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error('This page does not exist');
      }
    }

    //Execute Query
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findOne({ _id: req.params.id });
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
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
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

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // const tour = await Tour.findOne({ _id: req.params.id });

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour: req.body,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
  res.status(200).json({
    status: 'success',
    message: 'Deleted successfully',
  });
};
export {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkBody,
  aliasTopTours,
};
