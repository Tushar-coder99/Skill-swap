import express from 'express';
import { createSwapRequest, getMySwaps, updateSwapStatus } from '../controllers/swapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createSwapRequest);     // send request
router.get('/', protect, getMySwaps);            // list my swaps
router.patch('/:id', protect, updateSwapStatus); // accept/reject/cancel

export default router;
