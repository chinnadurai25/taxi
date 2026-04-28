import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px',
      padding: '12px 0'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: 'white', 
        padding: '12px 20px', 
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        width: '500px',
        border: '1px solid var(--border-color)'
      }}>
        <Search size={20} color="#9BA1A6" />
        <input 
          type="text" 
          placeholder="Search bookings, drivers, taxis..." 
          style={{ marginLeft: '12px', width: '100%', fontSize: '15px', background: 'transparent' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={24} color="#6F767E" />
          <div style={{ 
            position: 'absolute', 
            top: '-2px', 
            right: '-2px', 
            width: '10px', 
            height: '10px', 
            background: '#FF4D4F', 
            borderRadius: '50%', 
            border: '2px solid white' 
          }} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1D1F' }}>Admin User</div>
            <div style={{ fontSize: '12px', color: '#6F767E' }}>Office Staff</div>
          </div>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '50%', 
            background: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(255, 107, 0, 0.2)'
          }}>
            <User size={24} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
