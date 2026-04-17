import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';

const signup = catchAsync(async (req: Request, res: Response) => {
  const newUser = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  res.status(200).json({
    status: 'success',
    message: 'Login route is not implemented yet',
    data: {
      email,
    },
  });
});

export { signup, login };
