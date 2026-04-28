import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, User, Phone, Calendar } from 'lucide-react';

const NewBooking = () => {
  const [formData, setFormData] = useState({
    customer: '',
    phone: '',
    pickup: '',
    drop: '',
    date: new Date().toISOString().slice(0, 16)
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: `Booking created successfully! ID: ${data.bookingId}` });
        setFormData({ customer: '', phone: '', pickup: '', drop: '', date: new Date().toISOString().slice(0, 16) });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to create booking.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error. Is the backend running?' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="section-title">New Booking</h1>
      <p className="section-subtitle">Create a new taxi reservation</p>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Customer Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                placeholder="Enter customer name" 
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 12px 12px 40px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  fontSize: '14px'
                }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number" 
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 12px 12px 40px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  fontSize: '14px'
                }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Pickup Location</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#10B981' }} />
              <input 
                type="text" 
                name="pickup"
                value={formData.pickup}
                onChange={handleChange}
                placeholder="Enter pickup address" 
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 12px 12px 40px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  fontSize: '14px'
                }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Pickup Date & Time</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
              <input 
                type="datetime-local" 
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 12px 12px 40px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  fontSize: '14px'
                }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Drop Location</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#EF4444' }} />
              <input 
                type="text" 
                name="drop"
                value={formData.drop}
                onChange={handleChange}
                placeholder="Enter drop address" 
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 12px 12px 40px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  fontSize: '14px'
                }} 
              />
            </div>
          </div>

          {message && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              fontSize: '14px',
              background: message.type === 'success' ? '#E6F7F0' : '#FFE6E6',
              color: message.type === 'success' ? '#00B074' : '#FF4D4F',
              border: `1px solid ${message.type === 'success' ? '#00B07450' : '#FF4D4F50'}`
            }}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '10px',
              background: 'var(--primary)', 
              color: 'white', 
              padding: '14px', 
              borderRadius: '10px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'var(--transition)',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating...' : (
              <>
                <Send size={18} />
                Create Booking
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default NewBooking;
