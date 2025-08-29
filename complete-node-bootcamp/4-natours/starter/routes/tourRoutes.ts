import { Router } from 'express';

import { checkId, createTour, deleteTour, getAllTours, getTour, updateTour } from '../controllers/tourController';

const router = Router();

router.param('id', checkId);  // Middleware to validate ID parameter);


router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
