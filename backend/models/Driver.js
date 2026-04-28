import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Available', 'On Trip', 'Offline'], 
    default: 'Available' 
  },
  rating: { type: Number, default: 5.0 },
  avatar: { type: String }
});

export const Driver = mongoose.model('Driver', driverSchema);
