import express from 'express';
import { getAllUsers, exportUsers } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, getAllUsers);
router.get('/export', protect, exportUsers);

export default router;
