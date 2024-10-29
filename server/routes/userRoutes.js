import express from 'express';
import {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleWare.js';

const router = express.Router();

// Define routes
router.get('/', getAllUsers); // Anyone can access this route
router.post('/', authMiddleware, createUser); // Only admin can create a user
router.get('/:id', getUserById); // Anyone can access this route
router.put('/:id', authMiddleware, updateUser); // Only admin can update a user
router.delete('/:id', authMiddleware, deleteUser); // Only admin can delete a user

export default router;
