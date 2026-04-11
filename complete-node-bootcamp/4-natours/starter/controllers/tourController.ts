import * as fs from 'fs';
import * as path from 'path';
import { Request, Response, NextFunction } from 'express';
import { Tour } from '../models/tourModel';
import { APIFeatures } from '../utils/apiFeatures';

const checkBody = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

const aliasTopTours = (req: Request, res: Response, next: NextFunction) => {
  const add = {
    limit: '5',
    sort: '-ratingsAverage,price',
    fields: 'name,price,ratingsAverage,summary,difficulty',
  };

  // safe: keep original req.query untouched, store alias params separately
  // @ts-ignore
  req.aliasQuery = { ...add };

  next();
};

const getAllTours = async (req: Request, res: Response) => {
  try {
    // merge original query with aliasQuery (alias wins)
    // @ts-ignore
    const effectiveQuery = {
      ...(req.query || {}),
      ...((req as any).aliasQuery || {}),
    };

    //Build the query
    //1) Filterings
    // const queryObject = { ...effectiveQuery };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObject[el]);

    //2) Advanced Filtering
    // const mongoQuery: any = {};
    // Object.keys(queryObject).forEach((key) => {
    //   const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);
    //   if (match) {
    //     const field = match[1];
    //     const operator = `$${match[2]}`;
    //     if (!mongoQuery[field]) mongoQuery[field] = {};
    //     const val = isNaN(queryObject[key])
    //       ? queryObject[key]
    //       : Number(queryObject[key]);
    //     mongoQuery[field][operator] = val;
    //   } else {
    //     mongoQuery[key] = isNaN(queryObject[key])
    //       ? queryObject[key]
    //       : Number(queryObject[key]);
    //   }
    // });

    // let query = Tour.find(mongoQuery);

    //3) Sorting
    // if (effectiveQuery.sort) {
    //   const sortBy = String(effectiveQuery.sort).split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    //4) Field Limiting
    // if (effectiveQuery.fields) {
    //   const fields = String(effectiveQuery.fields).split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    //5) Pagination
    // const page = parseInt(String(effectiveQuery.page || '1'), 10);
    // const limit = parseInt(String(effectiveQuery.limit || '100'), 10);
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);
    // if (effectiveQuery.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) {
    //     throw new Error('This page does not exist');
    //   }
    // }

    //Execute Query
    const features = new APIFeatures(Tour.find(), effectiveQuery)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

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
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

const getTour = async (req: Request, res: Response) => {
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
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

const createTour = async (req: Request, res: Response) => {
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
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

const updateTour = async (req: Request, res: Response) => {
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
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

const deleteTour = async (req: Request, res: Response) => {
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
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
  res.status(200).json({
    status: 'success',
    message: 'Deleted successfully',
  });
};

const getTourStats = async (req: Request, res: Response) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgPrice: 1 } },
      // {$match: { _id: { $ne: 'EASY' } } },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getMonthPlan = async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.params.year, 10); // 2021
    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      { $addFields: { month: '$_id' } },
      { $project: { _id: 0 } },
      { $sort: { numTourStarts: -1 } },
      { $limit: 12 },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkBody,
  aliasTopTours,
  getTourStats,
};
