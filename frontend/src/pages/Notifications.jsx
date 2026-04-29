import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, Calendar, MapPin, User, ChevronRight, X, Car } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications/upcoming');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="section-title">Notifications</h1>
      <p className="section-subtitle">Manage your alerts and upcoming trip reminders</p>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', background: '#F8F9FA' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={20} color="var(--primary)" />
            Upcoming Trip Reminders
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading notifications...</div>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={notif._id} 
                style={{ 
                  padding: '24px', 
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '24px'
                }}
              >
                <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    background: 'var(--primary-light)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    flexShrink: 0
                  }}>
                    <Clock size={24} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#1A1D1F' }}>Next Trip: {notif.customer}</span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>
                        {notif.bookingId}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <Calendar size={14} />
                        Tomorrow, {new Date(notif.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <Clock size={14} />
                        {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <User size={14} />
                        {notif.phone}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6F767E', marginTop: '4px' }}>
                      <MapPin size={14} />
                      {notif.pickup} 
                      <ChevronRight size={14} />
                      {notif.drop}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => openModal(notif)}
                  style={{ 
                    padding: '10px 20px', 
                    borderRadius: '10px', 
                    border: '1px solid var(--border-color)', 
                    background: 'white',
                    fontWeight: '700',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div style={{ padding: '80px 20px', textAlign: 'center', color: '#6F767E' }}>
              <Bell size={48} style={{ marginBottom: '16px', opacity: 0.1 }} />
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1D1F', marginBottom: '8px' }}>No Notifications</h4>
              <p style={{ fontSize: '14px' }}>You're all caught up! No upcoming trips for tomorrow.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedBooking && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card" 
              style={{ width: '90%', maxWidth: '500px', padding: '32px', position: 'relative' }}
            >
              <button 
                onClick={closeModal}
                style={{ 
                  position: 'absolute', 
                  top: '24px', 
                  right: '24px', 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={24} />
              </button>
              
              <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#1A1D1F' }}>Booking Details</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 10px', borderRadius: '6px' }}>
                  {selectedBooking.bookingId}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#6F767E' }}>
                  {new Date(selectedBooking.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1D1F', margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Customer Info</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6F767E', fontSize: '14px' }}>Name</span>
                    <span style={{ fontWeight: '600', color: '#1A1D1F' }}>{selectedBooking.customer}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6F767E', fontSize: '14px' }}>Phone</span>
                    <span style={{ fontWeight: '600', color: '#1A1D1F' }}>{selectedBooking.phone}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1D1F', margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Trip Route</h4>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <MapPin size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6F767E', fontWeight: '600', marginBottom: '2px' }}>PICKUP</div>
                      <div style={{ fontSize: '15px', color: '#1A1D1F', fontWeight: '500' }}>{selectedBooking.pickup}</div>
                    </div>
                  </div>
                  <div style={{ borderLeft: '2px dashed var(--border-color)', height: '20px', marginLeft: '8px' }}></div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <MapPin size={18} color="#FF4D4F" style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6F767E', fontWeight: '600', marginBottom: '2px' }}>DROP-OFF</div>
                      <div style={{ fontSize: '15px', color: '#1A1D1F', fontWeight: '500' }}>{selectedBooking.drop}</div>
                    </div>
                  </div>
                </div>

                {(selectedBooking.driver || selectedBooking.taxi) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1D1F', margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Assigned Resources</h4>
                    
                    {selectedBooking.driver && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F8F9FA', borderRadius: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#1A1D1F' }}>{selectedBooking.driver.name}</div>
                          <div style={{ fontSize: '13px', color: '#6F767E' }}>{selectedBooking.driver.phone}</div>
                        </div>
                      </div>
                    )}

                    {selectedBooking.taxi && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F8F9FA', borderRadius: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#1A1D1F', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Car size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#1A1D1F' }}>{selectedBooking.taxi.model} ({selectedBooking.taxi.type})</div>
                          <div style={{ fontSize: '13px', color: '#6F767E', fontWeight: '600', letterSpacing: '0.5px' }}>{selectedBooking.taxi.taxiNumber}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {(!selectedBooking.driver && !selectedBooking.taxi) && (
                  <div style={{ padding: '16px', background: '#FFF1F0', borderRadius: '12px', border: '1px solid #FFCCC7', color: '#F5222D', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} />
                    This trip is still pending allocation.
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Notifications;
