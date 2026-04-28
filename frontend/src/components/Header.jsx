import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px',
      padding: '12px 0',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={toggleSidebar}
          className="mobile-hamburger"
          style={{ 
            display: 'none', 
            padding: '8px', 
            color: 'var(--text-main)',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-color)'
          }}
        >
          <Menu size={24} />
        </button>

        <div className="search-container" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: 'white', 
          padding: '12px 20px', 
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          width: '500px',
          border: '1px solid var(--border-color)',
          transition: 'var(--transition)'
        }}>
          <Search size={20} color="#9BA1A6" />
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ marginLeft: '12px', width: '100%', fontSize: '15px', background: 'transparent' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="notification-icon" style={{ position: 'relative', cursor: 'pointer' }}>
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
          <div className="user-info" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1D1F' }}>Admin</div>
          </div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(255, 107, 0, 0.2)',
            flexShrink: 0
          }}>
            <User size={20} />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .mobile-hamburger { display: block !important; }
          .search-container { width: 40px !important; padding: 10px !important; justify-content: center; }
          .search-container input { display: none; }
          .user-info { display: none; }
        }
        @media (max-width: 768px) {
          header { margin-bottom: 24px !important; }
        }
        @media (max-width: 400px) {
          .notification-icon { display: none; }
        }
      `}} />
    </header>
  );
};

export default Header;

