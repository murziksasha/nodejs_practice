import { Router } from 'express';

import {createTour, deleteTour, getAllTours, getTour, updateTour, checkBody } from '../controllers/tourController';

const router = Router();

// router.param('id', checkId);  // Middleware to validate ID parameter);


router.route('/').get(getAllTours).post(checkBody, createTour);

router.route('/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);

export default router;
