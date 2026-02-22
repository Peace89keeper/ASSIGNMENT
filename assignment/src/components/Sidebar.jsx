
// src/components/Sidebar.jsx - HAMBURGER SIDEBAR VERSION
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/list',  label: 'List' },
    { path: '/details/:id',  label: 'Detail' },
    { path: '/photo',  label: 'Photo Result' },
    { path: '/',  label: 'Login' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Hamburger Toggle Button */}
      <button 
        className="hamburger-btn"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay - Full invisible when open */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar - Slides from left, fully invisible when closed */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                closeSidebar();
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;

