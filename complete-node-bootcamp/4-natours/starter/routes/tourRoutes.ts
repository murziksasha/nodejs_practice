import { Router } from 'express';

import {createTour, deleteTour, getAllTours, aliasTopTours, getTour, updateTour, checkBody, getTourStats } from '../controllers/tourController';

const router = Router();

// router.param('id', checkId);  // Middleware to validate ID parameter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/').get(getAllTours).post(checkBody, createTour);

router.route('/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);

export default router;
