import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import NewBooking from './pages/NewBooking';
import Trips from './pages/Trips';
import Drivers from './pages/Drivers';
import Taxis from './pages/Taxis';
import './App.css';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        {children}
      </main>
    </div>
  );
};

function App() {
  console.log("FlyRoll App Rendering...");
  return (
    <>
      <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/new-booking" element={<Layout><NewBooking /></Layout>} />
      <Route path="/trips" element={<Layout><Trips /></Layout>} />
      <Route path="/drivers" element={<Layout><Drivers /></Layout>} />
      <Route path="/taxis" element={<Layout><Taxis /></Layout>} />
      
      {/* Fallback routes for unimplemented features */}
      <Route path="/notifications" element={<Layout>
        <h1 className="section-title">Notifications</h1>
        <p className="section-subtitle">Manage your alerts and notifications</p>
        <div className="card">Coming soon...</div>
      </Layout>} />
      
      <Route path="/settings" element={<Layout>
        <h1 className="section-title">Settings</h1>
        <p className="section-subtitle">Configure your application preferences</p>
        <div className="card">Coming soon...</div>
      </Layout>} />

      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
