import mongoose from 'mongoose';

export default new mongoose.Schema(
  { createdAt: { type: Date, expires: '1h', default: Date.now }},
  { expireAfterSeconds: 0, timestamps: true }
);
