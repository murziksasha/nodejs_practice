import AppError from "./appError";

export const notFound = (req: { originalUrl: any; }) => {
  return new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
};