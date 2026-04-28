import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  phone: { type: String, required: true },
  pickup: { type: String, required: true },
  drop: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  date: { type: Date, default: Date.now }
});

export const Booking = mongoose.model('Booking', bookingSchema);
