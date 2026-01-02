import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import colors from 'colors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import swapRoutes from './routes/swapRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // Add this import

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes); // <--- new route group
app.use('/api/admin', adminRoutes); // Add this line


app.use((err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

