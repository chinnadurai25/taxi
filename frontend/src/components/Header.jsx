import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Menu, Clock, Calendar as CalendarIcon } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications/upcoming');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px',
      padding: '12px 0',
      gap: '16px',
      position: 'relative'
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
        <div 
          className="notification-icon" 
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <Bell size={24} color="#6F767E" />
          {notifications.length > 0 && (
            <div style={{ 
              position: 'absolute', 
              top: '-2px', 
              right: '-2px', 
              width: '18px', 
              height: '18px', 
              background: '#FF4D4F', 
              color: 'white',
              fontSize: '10px',
              fontWeight: '800',
              borderRadius: '50%', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white' 
            }}>
              {notifications.length}
            </div>
          )}

          {showDropdown && (
            <div 
              ref={dropdownRef}
              className="notification-dropdown"
              style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: '320px',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: '1px solid var(--border-color)',
                zIndex: 1000,
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', background: '#F8F9FA' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>Next Trip Notifications</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6F767E' }}>Bookings scheduled for tomorrow</p>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif._id} 
                      style={{ 
                        padding: '16px', 
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8F9FA'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#1A1D1F' }}>{notif.customer}</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>
                          {notif.bookingId}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', color: '#6F767E', fontSize: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} />
                          {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CalendarIcon size={14} />
                          Tomorrow
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6F767E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {notif.pickup} → {notif.drop}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6F767E' }}>
                    <Bell size={32} style={{ marginBottom: '12px', opacity: 0.2 }} />
                    <p style={{ fontSize: '14px' }}>No upcoming trips for tomorrow.</p>
                  </div>
                )}
              </div>
              <div style={{ padding: '12px', textAlign: 'center', background: '#F8F9FA' }}>
                <button style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  View All Bookings
                </button>
              </div>
            </div>
          )}
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
          .notification-dropdown { right: -50px !important; width: 280px !important; }
        }
        @media (max-width: 400px) {
          .notification-icon { display: none; }
        }
      `}} />
    </header>
  );
};

export default Header;

