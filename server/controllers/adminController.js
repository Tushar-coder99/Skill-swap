import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import csvWriter from 'csv-writer';

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Admin access required');
  }

  const users = await User.find({})
    .select('-password')
    .sort('-createdAt');

  res.json(users);
});

// @desc    Export users CSV
// @route   GET /api/admin/export
export const exportUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Admin access required');
  }

  const users = await User.find({})
    .select('name email location skillsOffered skillsWanted rating createdAt isBanned')
    .lean();

  const csvStringifier = csvWriter.createObjectCsvStringifier({
    header: [
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'location', title: 'Location' },
      { id: 'skillsOffered', title: 'Skills Offered' },
      { id: 'skillsWanted', title: 'Skills Wanted' },
      { id: 'rating', title: 'Rating' },
      { id: 'createdAt', title: 'Joined' },
      { id: 'isBanned', title: 'Banned' },
    ],
  });

  let csvData = csvStringifier.getHeaderString() + '\n';
  users.forEach((user) => {
    csvData += csvStringifier.stringifyRecords([user]);
  });

  res.header('Content-Type', 'text/csv');
  res.attachment('skillswap_users.csv');
  res.send(csvData);
});
