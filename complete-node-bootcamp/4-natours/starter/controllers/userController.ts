import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import AppError from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

const isValidMongoId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);
const getSingleParam = (param: string | string[] | undefined): string | undefined =>
  Array.isArray(param) ? param[0] : param;

const getAllUsers = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = getSingleParam(req.params.id);

    if (!userId || !isValidMongoId(userId)) {
      return next(
        new AppError(`User not found with that ID ${userId}`, 404),
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(
        new AppError(`User not found with that ID ${userId}`, 404),
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  },
);

const createUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  },
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = getSingleParam(req.params.id);

    if (!userId || !isValidMongoId(userId)) {
      return next(
        new AppError(`User not found with that ID ${userId}`, 404),
      );
    }

    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(
        new AppError(`User not found with that ID ${userId}`, 404),
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  },
);

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = getSingleParam(req.params.id);

    if (!userId || !isValidMongoId(userId)) {
      return next(
        new AppError(`User not found with that ID ${userId}`, 404),
      );
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return next(
        new AppError(`User not found with that ID ${userId}`, 404),
      );
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  },
);

export { createUser, deleteUser, getAllUsers, getUser, updateUser };
