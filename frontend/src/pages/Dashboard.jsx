import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Car, Eye, ArrowUpRight, Plus } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start',
        padding: '32px 24px',
        minHeight: '220px'
      }}
    >
      <div style={{ 
        width: '56px', 
        height: '56px', 
        background: color, 
        color: 'white',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '28px',
        boxShadow: `0 8px 16px ${color}30`
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px', color: '#1A1D1F' }}>{value}</h3>
      <p style={{ color: '#6F767E', fontSize: '15px', fontWeight: '500' }}>{title}</p>
    </motion.div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickBooking, setQuickBooking] = useState({
    customer: '',
    phone: '',
    pickup: '',
    drop: ''
  });

  const fetchData = async () => {
    try {
      const statsRes = await fetch('http://localhost:5000/api/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      const bookingsRes = await fetch('http://localhost:5000/api/bookings/recent');
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuickBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quickBooking)
      });
      if (res.ok) {
        setQuickBooking({ customer: '', phone: '', pickup: '', drop: '' });
        fetchData();
      }
    } catch (err) {
      console.error('Error creating quick booking:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="section-title" style={{ fontSize: '32px', fontWeight: '800', color: '#1A1D1F' }}>Dashboard</h1>
      <p className="section-subtitle" style={{ fontSize: '16px', color: '#6F767E', marginBottom: '40px' }}>Overview of your taxi booking system</p>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <StatCard 
          title="Total Bookings" 
          value={stats?.totalBookings || '1,247'} 
          icon={<Calendar size={28} />} 
          color="#3B82F6"
        />
        <StatCard 
          title="Active Trips" 
          value={stats?.activeTrips || '23'} 
          icon={<MapPin size={28} />} 
          color="#FF6B00"
        />
        <StatCard 
          title="Available Drivers" 
          value={stats?.availableDrivers || '34'} 
          icon={<Users size={28} />} 
          color="#10B981"
        />
        <StatCard 
          title="Available Taxis" 
          value={stats?.availableTaxis || '42'} 
          icon={<Car size={28} />} 
          color="#8B5CF6"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '32px', marginTop: '40px' }}>
        <div className="table-container" style={{ marginTop: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1A1D1F' }}>Recent Bookings</h3>
            <button style={{ color: 'var(--primary)', fontSize: '15px', fontWeight: '700' }}>View All</button>
          </div>
          <table>
            <thead>
              <tr>
                <th style={{ color: '#6F767E', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Booking ID</th>
                <th style={{ color: '#6F767E', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Customer</th>
                <th style={{ color: '#6F767E', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Pickup</th>
                <th style={{ color: '#6F767E', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Drop</th>
                <th style={{ color: '#6F767E', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
                <th style={{ color: '#6F767E', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id || booking.bookingId}>
                    <td style={{ fontWeight: '700', color: '#1A1D1F' }}>{booking.bookingId}</td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#1A1D1F' }}>{booking.customer}</div>
                      <div style={{ color: '#6F767E', fontSize: '12px' }}>{booking.phone}</div>
                    </td>
                    <td style={{ color: '#6F767E' }}>{booking.pickup}</td>
                    <td style={{ color: '#6F767E' }}>{booking.drop}</td>
                    <td>
                      <span className={`status-pill status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-view" style={{ fontSize: '14px', fontWeight: '700' }}>
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: '#6F767E' }}>
                    No recent bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1A1D1F', marginBottom: '24px' }}>Quick Booking</h3>
          <form onSubmit={handleQuickBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600' }}>Customer</label>
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                value={quickBooking.customer}
                onChange={(e) => setQuickBooking({...quickBooking, customer: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: '#F8F9FA' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600' }}>Phone</label>
              <input 
                type="tel" 
                placeholder="+1 234 567 890" 
                required
                value={quickBooking.phone}
                onChange={(e) => setQuickBooking({...quickBooking, phone: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: '#F8F9FA' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600' }}>Pickup</label>
              <input 
                type="text" 
                placeholder="Address" 
                required
                value={quickBooking.pickup}
                onChange={(e) => setQuickBooking({...quickBooking, pickup: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: '#F8F9FA' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600' }}>Drop</label>
              <input 
                type="text" 
                placeholder="Destination" 
                required
                value={quickBooking.drop}
                onChange={(e) => setQuickBooking({...quickBooking, drop: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: '#F8F9FA' }}
              />
            </div>
            <button 
              type="submit" 
              style={{ 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '16px', 
                borderRadius: '12px', 
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '12px',
                boxShadow: '0 8px 16px rgba(255, 107, 0, 0.2)'
              }}
            >
              <Plus size={20} />
              Book Now
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
