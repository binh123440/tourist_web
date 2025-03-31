import React, { useState } from 'react';
import { tours } from './ToursItems.js';
import './ToursStyle.css';
import { Link, useLocation } from 'react-router-dom';

const Tours = ({ selectedDestination = 'all' }) => {
  const [selectedCategory, setSelectedCategory] = useState('all'); // Trạng thái lưu danh mục được chọn
  const location = useLocation();

  const handleCategoryChange = (category) => {
    setSelectedCategory(category.toLowerCase());
  };

  // Kết hợp cả hai điều kiện lọc
  const filteredTours = tours.filter((tour) => {
    const matchesDestination =
      selectedDestination === 'all' || tour.destination.toLowerCase() === selectedDestination;
    const matchesCategory =
      selectedCategory === 'all' || tour.destination.toLowerCase().includes(selectedCategory);
    return matchesDestination && matchesCategory; // Chỉ giữ các tour thỏa mãn cả hai điều kiện
  });

  return (
    <div className="tours-section">
      <h2>CHƯƠNG TRÌNH TRẢI NGHIỆM</h2>
      {/* Bộ lọc danh mục */}
      {location.pathname !== '/tour' && (
        <div className="tours-menu">
          <button
            className={selectedCategory === 'all' ? 'active' : ''}
            onClick={() => handleCategoryChange('all')}
          >
            All Posts
          </button>
          <button
            className={selectedCategory === 'bhutan' ? 'active' : ''}
            onClick={() => handleCategoryChange('bhutan')}
          >
            Bhutan
          </button>
          <button
            className={selectedCategory === 'việt nam' ? 'active' : ''}
            onClick={() => handleCategoryChange('việt nam')}
          >
            Việt Nam
          </button>
          <button
            className={selectedCategory === 'pháp' ? 'active' : ''}
            onClick={() => handleCategoryChange('pháp')}
          >
            Pháp
          </button>
        </div>
      )}
      {/* Danh sách tour */}
      <div className="tours-grid">
        {filteredTours.map((tour, index) => (
          <div className="tour-item" key={index}>
            <img src={tour.image} alt={tour.title} />
            <div className="tour-content">
              <p className="date">{tour.date}</p>
              <p className="destination">{tour.destination}</p>
              <h3>{tour.title}</h3>
              <p className="description">{tour.description}</p>
              <Link to={`/tour-detail/${tour.link}`} className="continue-reading">
                Xem tour
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tours;