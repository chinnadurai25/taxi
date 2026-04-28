import mongoose from 'mongoose';

const taxiSchema = new mongoose.Schema({
  model: { type: String, required: true },
  taxiNumber: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['Sedan', 'SUV', 'Luxury', 'Mini'], 
    default: 'Sedan' 
  },
  status: { 
    type: String, 
    enum: ['Available', 'On Trip', 'Maintenance'], 
    default: 'Available' 
  }
});

export const Taxi = mongoose.model('Taxi', taxiSchema);
