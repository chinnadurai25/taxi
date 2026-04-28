import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, MapPin, Wrench, MoreVertical, Plus, X, Save } from 'lucide-react';

const Taxis = () => {
  const [taxis, setTaxis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    model: '',
    taxiNumber: '',
    type: 'Sedan',
    status: 'Available'
  });

  const fetchTaxis = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/taxis');
      const data = await res.json();
      setTaxis(data);
    } catch (err) {
      console.error('Error fetching taxis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxis();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/taxis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ model: '', taxiNumber: '', type: 'Sedan', status: 'Available' });
        fetchTaxis();
      }
    } catch (err) {
      console.error('Error saving taxi:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 className="section-title">Taxis</h1>
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
          <Plus size={18} />
          Add New Taxi
        </button>
      </div>
      <p className="section-subtitle">Manage your taxi fleet</p>

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
                <h3 style={{ fontWeight: '700' }}>Add New Taxi</h3>
                <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="grid-2-col">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600' }}>Model Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Toyota Camry"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600' }}>Taxi Number</label>
                    <input 
                      type="text" 
                      required
                      placeholder="TX-001"
                      value={formData.taxiNumber}
                      onChange={(e) => setFormData({...formData, taxiNumber: e.target.value})}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', textTransform: 'uppercase' }}
                    />
                  </div>
                </div>
                <div className="grid-2-col">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600' }}>Vehicle Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)' }}
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Mini">Mini</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600' }}>Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)' }}
                    >
                      <option value="Available">Available</option>
                      <option value="On Trip">On Trip</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
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
                  Save Taxi
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
              <th>Taxi Info</th>
              <th>Number</th>
              <th className="hide-mobile">Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {taxis.length > 0 ? (
              taxis.map((taxi) => (
                <tr key={taxi._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '10px', 
                        background: 'var(--bg-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)'
                      }}>
                        <Car size={20} />
                      </div>
                      <div style={{ fontWeight: '600' }}>{taxi.model}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      background: '#1A1D1F', 
                      color: 'white', 
                      padding: '4px 10px', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '1px'
                    }}>
                      {taxi.taxiNumber}
                    </span>
                  </td>
                  <td className="hide-mobile">
                    <div style={{ color: 'var(--text-muted)' }}>{taxi.type}</div>
                  </td>
                  <td>
                    <span className={`status-pill status-${taxi.status.replace(' ', '').toLowerCase()}`}>
                      {taxi.status}
                    </span>
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
                  {loading ? 'Loading taxis...' : 'No taxis found. Use "Add New Taxi" to get started.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .status-available { background: #E6F7F0; color: #00B074; }
        .status-ontrip { background: #E6F0FF; color: #3B82F6; }
        .status-maintenance { background: #FFF1F0; color: #F5222D; }
      `}} />
    </motion.div>
  );
};

export default Taxis;
