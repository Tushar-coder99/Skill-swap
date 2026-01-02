import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Send swap request
// @route   POST /api/swaps
// @access  Private
export const createSwapRequest = asyncHandler(async (req, res) => {
  const { toUserId, offeredSkill, requestedSkill } = req.body;

  if (!toUserId || !offeredSkill || !requestedSkill) {
    res.status(400);
    throw new Error('Please provide all swap details');
  }

  const fromUser = await User.findById(req.user._id);
  const toUser = await User.findById(toUserId);

  if (!toUser) {
    res.status(404);
    throw new Error('Target user not found');
  }

  const swap = {
    fromUser: fromUser._id,
    fromName: fromUser.name,
    toUser: toUser._id,
    toName: toUser.name,
    offeredSkill,
    requestedSkill,
  };

  // Push swap to both users
  fromUser.swapRequests.push(swap);
  toUser.swapRequests.push(swap);

  await fromUser.save();
  await toUser.save();

  res.status(201).json({ message: 'Swap request sent', swap });
});

// @desc    Get my swap requests
// @route   GET /api/swaps
// @access  Private
export const getMySwaps = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.swapRequests);
});

// @desc    Update swap status (Accept / Reject / Cancel)
// @route   PATCH /api/swaps/:id
// @access  Private
export const updateSwapStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['Accepted', 'Rejected', 'Cancelled'];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  let found = false;

  // Update status in this user's list
  user.swapRequests = user.swapRequests.map((s) => {
    if (s._id.toString() === req.params.id) {
      found = true;
      return { ...s.toObject(), status };
    }
    return s;
  });

  if (!found) {
    res.status(404);
    throw new Error('Swap not found for this user');
  }

  await user.save();

  // Also update it in the counterpart's list
  const counterpartId = user.swapRequests.find(
    (s) => s._id.toString() === req.params.id
  )?.fromUser?.toString() === user._id.toString()
    ? user.swapRequests.find((s) => s._id.toString() === req.params.id).toUser
    : user.swapRequests.find((s) => s._id.toString() === req.params.id).fromUser;

  if (counterpartId) {
    const counterpart = await User.findById(counterpartId);
    if (counterpart) {
      counterpart.swapRequests = counterpart.swapRequests.map((s) =>
        s._id.toString() === req.params.id ? { ...s.toObject(), status } : s
      );
      await counterpart.save();
    }
  }

  res.json({ message: 'Swap updated', status });
});
