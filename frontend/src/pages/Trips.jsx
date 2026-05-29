import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Eye, Filter, X, Ruler, Timer, IndianRupee, CheckCircle } from 'lucide-react';
import API_BASE_URL from '../config';

const STATUS_COLORS = {
  Pending:   { color: '#F59E0B', bg: '#FFFBEB' },
  Assigned:  { color: '#3B82F6', bg: '#EFF6FF' },
  'On Trip': { color: '#8B5CF6', bg: '#F5F3FF' },
  Completed: { color: '#10B981', bg: '#ECFDF5' },
  Cancelled: { color: '#EF4444', bg: '#FEF2F2' },
};

const Trips = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [closeModal, setCloseModal] = useState(null); // booking object
  const [closeForm, setCloseForm] = useState({ km: '', duration: '', total: '' });
  const [closing, setClosing] = useState(false);
  const [successId, setSuccessId] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const openClose = (booking) => {
    setCloseModal(booking);
    setCloseForm({ km: '', duration: '', total: '' });
  };

  const handleCloseTrip = async (e) => {
    e.preventDefault();
    if (!closeModal) return;
    setClosing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${closeModal._id}/close`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          km: parseFloat(closeForm.km),
          duration: closeForm.duration,
          total: parseFloat(closeForm.total)
        })
      });
      if (res.ok) {
        setSuccessId(closeModal._id);
        setCloseModal(null);
        fetchBookings();
        setTimeout(() => setSuccessId(null), 3000);
      }
    } catch (err) {
      console.error('Error closing trip:', err);
    } finally {
      setClosing(false);
    }
  };

  const filtered = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  const StatusBtn = ({ label }) => (
    <button
      onClick={() => setFilterStatus(label)}
      style={{
        padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: '600',
        border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s',
        borderColor: filterStatus === label ? 'var(--primary)' : '#E5E7EB',
        background: filterStatus === label ? 'var(--primary)' : 'white',
        color: filterStatus === label ? 'white' : '#6F767E',
      }}
    >{label === 'all' ? 'All' : label}</button>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Success toast */}
      <AnimatePresence>
        {successId && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            style={{
              position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
              background: '#10B981', color: 'white', padding: '14px 24px',
              borderRadius: '14px', fontWeight: '700', fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '10px',
              boxShadow: '0 8px 24px rgba(16,185,129,0.4)'
            }}
          >
            <CheckCircle size={18} /> Trip closed! Message sent to customer.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 className="section-title">Trips</h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Filter size={13} color="#9CA3AF" style={{ marginTop: '8px' }} />
          {['all', 'Pending', 'Assigned', 'On Trip', 'Completed', 'Cancelled'].map(s => (
            <StatusBtn key={s} label={s} />
          ))}
        </div>
      </div>
      <p className="section-subtitle">View and manage all taxi trips · Close trips to send customer summary message</p>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Date/Time</th>
              <th className="hide-mobile">Route</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((booking) => {
                const sm = STATUS_COLORS[booking.status] || {};
                return (
                  <tr key={booking._id}>
                    <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{booking.bookingId}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{booking.customer}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{booking.phone}</div>
                    </td>
                    <td style={{ fontSize: '14px' }}>
                      <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                        {new Date(booking.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div style={{ fontWeight: '700' }}>
                        {new Date(booking.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </div>
                    </td>
                    <td className="hide-mobile">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                        <MapPin size={12} color="var(--primary)" />
                        <span>{booking.pickup}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>
                        <MapPin size={12} color="#EF4444" />
                        <span>{booking.drop}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', padding: '4px 12px',
                        borderRadius: '99px', fontSize: '12px', fontWeight: '700',
                        color: sm.color, background: sm.bg
                      }}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {/* Close Trip button — only for Assigned / On Trip */}
                        {(booking.status === 'Assigned' || booking.status === 'On Trip') && (
                          <button
                            onClick={() => openClose(booking)}
                            style={{
                              padding: '7px 14px', borderRadius: '9px', fontSize: '12px',
                              fontWeight: '700', border: 'none', cursor: 'pointer',
                              background: '#6366F1', color: 'white',
                              display: 'flex', alignItems: 'center', gap: '6px'
                            }}
                          >
                            <CheckCircle size={13} /> Close Trip
                          </button>
                        )}
                        {booking.status === 'Completed' && (
                          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>✓ Closed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  {loading ? 'Loading trips…' : 'No trips found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Close Trip Modal */}
      <AnimatePresence>
        {closeModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(4px)'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card"
              style={{ width: '90%', maxWidth: '440px', padding: '32px', position: 'relative' }}
            >
              <button onClick={() => setCloseModal(null)} style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF'
              }}>
                <X size={22} />
              </button>

              <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px', color: '#1A1D1F' }}>Close Trip</h3>
              <p style={{ color: '#6F767E', fontSize: '13px', marginBottom: '20px' }}>
                {closeModal.bookingId} · {closeModal.customer} · {closeModal.pickup} → {closeModal.drop}
              </p>

              {/* Info box */}
              <div style={{
                background: '#F0FDF4', borderRadius: '12px', padding: '12px 16px',
                border: '1.5px solid #6EE7B7', marginBottom: '24px',
                fontSize: '13px', color: '#065F46', display: 'flex', alignItems: 'flex-start', gap: '8px'
              }}>
                <CheckCircle size={16} style={{ marginTop: '1px', flexShrink: 0 }} />
                A trip summary message will be sent to the customer automatically. No payment required.
              </div>

              <form onSubmit={handleCloseTrip} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Ruler size={14} /> Distance (KM)
                  </label>
                  <input
                    type="number" min="0" step="0.1" required
                    value={closeForm.km}
                    onChange={e => setCloseForm(f => ({ ...f, km: e.target.value }))}
                    placeholder="e.g. 25"
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: '10px',
                      border: '1.5px solid #E5E7EB', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Timer size={14} /> Duration (hrs)
                  </label>
                  <input
                    type="text" required
                    value={closeForm.duration}
                    onChange={e => setCloseForm(f => ({ ...f, duration: e.target.value }))}
                    placeholder="e.g. 2.68"
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: '10px',
                      border: '1.5px solid #E5E7EB', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <IndianRupee size={14} /> Total Amount (₹)
                  </label>
                  <input
                    type="number" min="0" step="1" required
                    value={closeForm.total}
                    onChange={e => setCloseForm(f => ({ ...f, total: e.target.value }))}
                    placeholder="e.g. 500"
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: '10px',
                      border: '1.5px solid #E5E7EB', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>

                {/* Preview message */}
                {closeForm.km && closeForm.duration && closeForm.total && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{
                      background: '#1A1D1F', color: '#E5E7EB', borderRadius: '12px',
                      padding: '14px 16px', fontSize: '12.5px', lineHeight: '1.7',
                      fontFamily: 'monospace'
                    }}
                  >
                    <div style={{ color: '#6EE7B7', fontWeight: '700', marginBottom: '6px', fontSize: '11px' }}>📨 MESSAGE PREVIEW</div>
                    Hi {closeModal.customer}, your trip with Nanban Taxi is closed.{'\n'}
                    KM: {closeForm.km}{'\n'}
                    Duration: {closeForm.duration} hrs{'\n'}
                    Total: ₹{closeForm.total}
                  </motion.div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button type="button" onClick={() => setCloseModal(null)}
                    style={{
                      flex: 1, padding: '13px', borderRadius: '12px', fontWeight: '700',
                      border: '1.5px solid #E5E7EB', background: 'white', cursor: 'pointer', fontSize: '14px'
                    }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={closing}
                    style={{
                      flex: 2, background: closing ? '#9CA3AF' : '#6366F1', color: 'white',
                      padding: '13px', borderRadius: '12px', fontWeight: '700', border: 'none',
                      cursor: closing ? 'not-allowed' : 'pointer', fontSize: '14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}>
                    <CheckCircle size={16} />
                    {closing ? 'Closing…' : 'Close Trip & Send Message'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Trips;
