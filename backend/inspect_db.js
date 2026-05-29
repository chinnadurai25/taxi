import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Booking } from './models/Booking.js';
import { Driver } from './models/Driver.js';
import { Taxi } from './models/Taxi.js';
import { Message } from './models/Message.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taxi_db';

console.log('Connecting to:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB!');
    
    const bookings = await Booking.find({});
    const drivers = await Driver.find({});
    const taxis = await Taxi.find({});
    const messages = await Message.find({});
    
    console.log('Bookings Count:', bookings.length);
    if (bookings.length > 0) {
      console.log('Sample Booking:', bookings[0]);
    }
    
    console.log('Drivers Count:', drivers.length);
    if (drivers.length > 0) {
      console.log('Sample Driver:', drivers[0]);
    }
    
    console.log('Taxis Count:', taxis.length);
    if (taxis.length > 0) {
      console.log('Sample Taxi:', taxis[0]);
    }
    
    console.log('Messages Count:', messages.length);
    
    await mongoose.disconnect();
    console.log('Disconnected!');
  })
  .catch((err) => {
    console.error('Error connecting:', err);
  });
