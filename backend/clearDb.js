import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Booking } from './models/Booking.js';
import { Driver } from './models/Driver.js';
import { Taxi } from './models/Taxi.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taxi_db';

async function clearDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Booking.deleteMany({});
    await Driver.deleteMany({});
    await Taxi.deleteMany({});

    console.log('Successfully cleared all Bookings, Drivers, and Taxis.');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing database:', err);
    process.exit(1);
  }
}

clearDatabase();
