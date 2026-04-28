import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Phone, Star, MoreVertical, X, UserPlus, Save } from 'lucide-react';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    status: 'Available',
    rating: 5.0
  });

  const fetchDrivers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/drivers');
      const data = await res.json();
      setDrivers(data);
    } catch (err) {
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ name: '', phone: '', status: 'Available', rating: 5.0 });
        fetchDrivers();
      }
    } catch (err) {
      console.error('Error saving driver:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 className="section-title">Drivers</h1>
        <button 
          onClick={() => setShowForm(true)}
          style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <UserPlus size={18} />
          Add New Driver
        </button>
      </div>
      <p className="section-subtitle">Manage your taxi drivers</p>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: '24px', overflow: 'hidden' }}
          >
            <div className="card" style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: '700' }}>Add New Driver</h3>
                <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600' }}>Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+1 234 567 890"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600' }}>Initial Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)' }}
                    >
                      <option value="Available">Available</option>
                      <option value="On Trip">On Trip</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600' }}>Rating (1-5)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="1" 
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)' }}
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px'
                  }}
                >
                  <Save size={18} />
                  Save Driver
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Driver Info</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length > 0 ? (
              drivers.map((driver) => (
                <tr key={driver._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        fontWeight: '700',
                        fontSize: '14px',
                        overflow: 'hidden'
                      }}>
                        {driver.avatar ? (
                          <img src={driver.avatar} alt={driver.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          driver.name.charAt(0)
                        )}
                      </div>
                      <div style={{ fontWeight: '600' }}>{driver.name}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                      <Phone size={14} />
                      {driver.phone}
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill status-${driver.status.replace(' ', '').toLowerCase()}`}>
                      {driver.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FFB800', fontWeight: '600' }}>
                      <Star size={16} fill="#FFB800" />
                      {driver.rating.toFixed(1)}
                    </div>
                  </td>
                  <td>
                    <button style={{ color: 'var(--text-muted)' }}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  {loading ? 'Loading drivers...' : 'No drivers found. Use "Add New Driver" to get started.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .status-available { background: #E6F7F0; color: #00B074; }
        .status-ontrip { background: #E6F0FF; color: #3B82F6; }
        .status-offline { background: #F5F5F5; color: #8C8C8C; }
      `}} />
    </motion.div>
  );
};

export default Drivers;
