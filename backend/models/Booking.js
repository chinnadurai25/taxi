import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  phone: { type: String, required: true },
  pickup: { type: String, required: true },
  drop: { type: String, required: true },
  taxi: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxi' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  status: { 
    type: String, 
    enum: ['Pending', 'Assigned', 'On Trip', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  date: { type: Date, default: Date.now }
});

export const Booking = mongoose.model('Booking', bookingSchema);
