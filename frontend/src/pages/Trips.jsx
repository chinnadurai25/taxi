import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Eye, Calendar, Filter } from 'lucide-react';

const Trips = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/bookings');
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 className="section-title">Trips</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ 
            background: 'white', 
            border: '1px solid var(--border-color)',
            padding: '8px 16px', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <Filter size={16} />
            Filter
          </button>
          <button style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            Export
          </button>
        </div>
      </div>
      <p className="section-subtitle">View and manage all taxi trips</p>

      <div className="table-container">
        <table>
          <thead>
             <tr>
               <th>ID</th>
               <th>Customer</th>
               <th>Date/Time</th>
               <th className="hide-mobile">Pickup</th>
               <th className="hide-mobile">Drop</th>
               <th>Status</th>
               <th>Action</th>
             </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id || booking.bookingId}>
                  <td style={{ fontWeight: '600' }}>{booking.bookingId}</td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{booking.customer}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{booking.phone}</div>
                  </td>
                  <td style={{ fontSize: '14px', fontWeight: '500' }}>
                     <div style={{ fontSize: '11px' }}>{new Date(booking.date).toLocaleDateString([], { day: '2-digit', month: 'short' })}</div>
                     <div style={{ fontWeight: '700' }}>{new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="hide-mobile">{booking.pickup}</td>
                  <td className="hide-mobile">{booking.drop}</td>
                  <td>
                    <span className={`status-pill status-${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-view">
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  {loading ? 'Loading trips...' : 'No trips found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Trips;
