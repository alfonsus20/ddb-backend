import { Router } from 'express';
import { body } from 'express-validator';
import {
  deleteUser,
  getAllUsers,
  getAllUsersFilteredAndPaginated,
  getUserById,
  makeUserAdmin,
  makeUserVerified,
  editUser,
} from '../controllers/user.controller';
import {
  adminMiddleware,
  authMiddleware,
} from '../middlewares/auth.middleware';

const route = Router();

route.get('/', getAllUsersFilteredAndPaginated);
route.get('/findAll', getAllUsers);
route.get('/:id', getUserById);
route.get('/:id/makeAdmin', authMiddleware, adminMiddleware, makeUserAdmin);
route.get('/:id/verify', authMiddleware, adminMiddleware, makeUserVerified);
route.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  [
    body('name').notEmpty().isString(),
    body('majority').notEmpty().isString(),
    body('entryYear').notEmpty().isInt(),
    body('isGraduated').default(false),
    body('graduationYear').optional({ nullable: true }).isInt(),
    body('thesisURL').optional({ nullable: true }).isURL(),
    body('thesisTitle').optional({ nullable: true }),
  ],
  editUser,
);
route.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default route;
