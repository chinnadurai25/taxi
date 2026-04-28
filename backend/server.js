import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { Booking } from './models/Booking.js';
import { Driver } from './models/Driver.js';
import { Taxi } from './models/Taxi.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Dashboard Stats
app.get('/api/stats', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const activeTrips = await Booking.countDocuments({ status: 'Pending' });
    const availableDrivers = await Driver.countDocuments({ status: 'Available' });
    const availableTaxis = await Taxi.countDocuments({ status: 'Available' });

    res.json({
      totalBookings,
      activeTrips,
      availableDrivers,
      availableTaxis,
      trends: { totalBookings: '+12%' }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('taxi')
      .populate('driver')
      .sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings/recent', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('taxi')
      .populate('driver')
      .sort({ date: -1 })
      .limit(5);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/bookings/:id/allocate', async (req, res) => {
  try {
    const { taxiId, driverId } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.taxi = taxiId;
    booking.driver = driverId;
    booking.status = 'Assigned';
    await booking.save();

    // Update taxi and driver status
    await Taxi.findByIdAndUpdate(taxiId, { status: 'On Trip' });
    await Driver.findByIdAndUpdate(driverId, { status: 'On Trip' });

    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.post('/api/bookings', async (req, res) => {
  try {
    const lastBooking = await Booking.findOne().sort({ date: -1 });
    const lastId = lastBooking ? parseInt(lastBooking.bookingId.split('-')[1]) : 1000;
    const newBookingId = `BK-${lastId + 1}`;

    const newBooking = new Booking({
      ...req.body,
      bookingId: newBookingId
    });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Drivers
app.get('/api/drivers', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const drivers = await Driver.find(query);
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/drivers', async (req, res) => {
  try {
    const newDriver = new Driver(req.body);
    await newDriver.save();
    res.status(201).json(newDriver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Taxis
app.get('/api/taxis', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const taxis = await Taxi.find(query);
    res.json(taxis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/taxis', async (req, res) => {
  try {
    const newTaxi = new Taxi(req.body);
    await newTaxi.save();
    res.status(201).json(newTaxi);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Taxi App Backend is running...');
});

// --- SEED DATA ---
const seedData = async () => {
  const bookingCount = await Booking.countDocuments();
  if (bookingCount === 0) {
    await Booking.insertMany([
      { bookingId: 'BK-1023', customer: 'John Doe', phone: '+1 234 567 890', pickup: '123 Main St', drop: '456 Park Ave', status: 'Completed' },
      { bookingId: 'BK-1024', customer: 'Sarah Miller', phone: '+1 987 654 321', pickup: '789 Oak Rd', drop: '321 Pine St', status: 'Pending' },
      { bookingId: 'BK-1025', customer: 'Robert Wilson', phone: '+1 555 123 456', pickup: '555 Elm St', drop: '777 Cedar Ln', status: 'Completed' },
      { bookingId: 'BK-1026', customer: 'Emma Thompson', phone: '+1 222 333 444', pickup: '111 Maple Ave', drop: '999 Willow Dr', status: 'Cancelled' },
    ]);
    console.log('Seeded Bookings');
  }

  const driverCount = await Driver.countDocuments();
  if (driverCount === 0) {
    await Driver.insertMany([
      { name: 'Alex Johnson', phone: '+1 222 333 444', status: 'Available', rating: 4.8 },
      { name: 'Mike Ross', phone: '+1 555 666 777', status: 'On Trip', rating: 4.9 },
      { name: 'Harvey Specter', phone: '+1 999 888 777', status: 'Available', rating: 5.0 },
    ]);
    console.log('Seeded Drivers');
  }

  const taxiCount = await Taxi.countDocuments();
  if (taxiCount === 0) {
    await Taxi.insertMany([
      { model: 'Toyota Camry', taxiNumber: 'TX-001', type: 'Sedan', status: 'Available' },
      { model: 'Honda CR-V', taxiNumber: 'TX-002', type: 'SUV', status: 'On Trip' },
      { model: 'Mercedes S-Class', taxiNumber: 'TX-003', type: 'Luxury', status: 'Available' },
    ]);
    console.log('Seeded Taxis');
  }
};

// --- DB CONNECTION ---
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taxi_db';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // await seedData(); // Disabled seeding so user can enter own data
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
