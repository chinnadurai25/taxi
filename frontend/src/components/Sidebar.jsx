import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PlusSquare, 
  MapPin, 
  Users, 
  Car, 
  Bell, 
  Settings, 
  ChevronRight,
  Menu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'New Booking', path: '/new-booking', icon: <PlusSquare size={20} /> },
    { name: 'Trips', path: '/trips', icon: <MapPin size={20} /> },
    { name: 'Drivers', path: '/drivers', icon: <Users size={20} /> },
    { name: 'Taxis', path: '/taxis', icon: <Car size={20} /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isOpen ? 260 : 80 }}
      className="sidebar"
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        zIndex: 100,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '40px',
        padding: '0 8px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          flexShrink: 0
        }}>
          <Car size={32} />
        </div>
        {isOpen && (
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontSize: '20px', fontWeight: '800', color: '#1A1D1F', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}
          >
            TaxiAdmin
          </motion.h2>
        )}
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 8px 16px -4px rgba(255, 107, 0, 0.4)' : 'none',
                  transition: 'var(--transition)',
                  fontWeight: isActive ? '600' : '500',
                  justifyContent: isOpen ? 'flex-start' : 'center'
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
                  {item.icon}
                </div>
                {isOpen && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          color: 'var(--text-muted)',
          background: 'rgba(0,0,0,0.03)',
          borderRadius: '12px'
        }}
      >
        {isOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
      </button>
    </motion.div>
  );
};

export default Sidebar;
