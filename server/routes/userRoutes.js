import express from 'express';
import { registerUser, loginUser, getMe, updateProfile, getUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/', protect, getUsers); // <--- New Search Route

export default router;
