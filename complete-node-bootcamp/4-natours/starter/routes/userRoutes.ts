import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from '../controllers/userController';
import { login, signup } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);


router.route('/').get(getAllUsers).post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

export default router;
