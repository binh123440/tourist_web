import React, { useState, useEffect } from 'react';
import './ToursStyle.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getTours } from '../services/api';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Tours = ({ selectedDestination = 'all' }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const data = await getTours(selectedDestination);
        setTours(data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải danh sách tour. Vui lòng thử lại sau.');
        setLoading(false);
        console.error('Error fetching tours:', err);
      }
    };

    fetchTours();
  }, [selectedDestination]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category.toLowerCase());
  };

  const handleEdit = (e, tourId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/tours?edit=${tourId}`);
  };

  const handleDelete = async (e, tourId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Bạn có chắc chắn muốn xóa tour này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/tours/${tourId}`, {
          headers: {
            'x-auth-token': token
          }
        });
        // Cập nhật danh sách tour sau khi xóa
        setTours(tours.filter(tour => tour._id !== tourId));
      } catch (err) {
        console.error('Error deleting tour:', err);
        alert('Không thể xóa tour');
      }
    }
  };

  // Lọc tours dựa trên category đã chọn
  const filteredTours = tours.filter((tour) => {
    return selectedCategory === 'all' || 
           tour.destination.toLowerCase().includes(selectedCategory);
  });

  if (loading) {
    return (
      <div className="tours-section">
        <h2>CHƯƠNG TRÌNH TRẢI NGHIỆM</h2>
        <div className="loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tours-section">
        <h2>CHƯƠNG TRÌNH TRẢI NGHIỆM</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

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
        {filteredTours.length > 0 ? (
          filteredTours.map((tour, index) => (
            <div className="tour-item" key={index}>
              <Link to={`/tour-detail/${tour.link}`}>
                <img src={tour.image} alt={tour.title} />
                <div className="tour-content">
                  <p className="date">{tour.date}</p>
                  <p className="destination">{tour.destination}</p>
                  <h3>{tour.title}</h3>
                  <p className="description">{tour.description}</p>
                  <span className="continue-reading">
                    Xem tour
                  </span>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="no-tours">Không có tour nào phù hợp.</div>
        )}
      </div>
    </div>
  );
};

export default Tours;