// src/routes/Admin.js
import React, { useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import IntegratedTourManager from '../components/admin/IntegratedTourManager';
import GalleryManager from '../components/admin/GalleryManager';
import './AdminStyle.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('tours');

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <h2>Quản lý</h2>
        <ul>
          <li className={activeTab === 'tours' ? 'active' : ''}>
            <Link to="/admin/tours" onClick={() => setActiveTab('tours')}>
              <i className="fas fa-plane-departure"></i> Tours
            </Link>
          </li>
          <li className={activeTab === 'gallery' ? 'active' : ''}>
            <Link to="/admin/gallery" onClick={() => setActiveTab('gallery')}>
              <i className="fas fa-images"></i> Thư viện ảnh
            </Link>
          </li>
        </ul>
      </div>
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<IntegratedTourManager />} />
          <Route path="/tours" element={<IntegratedTourManager />} />
          <Route path="/gallery" element={<GalleryManager />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;