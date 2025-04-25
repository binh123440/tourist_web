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

  // Tính toán ngày còn lại từ ngày bắt đầu tour
  const getDaysRemaining = (dateString) => {
    if (!dateString) return null;
    
    // Lấy ngày bắt đầu từ chuỗi ngày (ví dụ: "20/12/2024 - 30/12/2024")
    const startDateStr = dateString.split('-')[0].trim();
    const [day, month, year] = startDateStr.split('/').map(num => parseInt(num));
    
    const startDate = new Date(year, month - 1, day); // month trong JS bắt đầu từ 0
    const today = new Date();
    
    // Đặt giờ, phút, giây, mili giây về 0 để so sánh chỉ ngày
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    
    const diffTime = startDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : null;
  };

  if (loading) {
    return (
      <div className="tours-section">
        <div className="section-header">
          <h2 className="section-title">CHƯƠNG TRÌNH TRẢI NGHIỆM</h2>
          <div className="title-underline"></div>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải chương trình tour...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tours-section">
        <div className="section-header">
          <h2 className="section-title">CHƯƠNG TRÌNH TRẢI NGHIỆM</h2>
          <div className="title-underline"></div>
        </div>
        <div className="error-container">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tours-section">
      <div className="section-header">
        <h2 className="section-title">CHƯƠNG TRÌNH TRẢI NGHIỆM</h2>
        <div className="title-underline"></div>
      </div>
      
      {location.pathname !== '/tour' && (
        <div className="tours-filter">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            <i className="fas fa-globe-asia"></i> Tất cả
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'bhutan' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('bhutan')}
          >
            <i className="fas fa-mountain"></i> Bhutan
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'việt nam' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('việt nam')}
          >
            <i className="fas fa-map-marker-alt"></i> Việt Nam
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'pháp' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('pháp')}
          >
            <i className="fas fa-landmark"></i> Pháp
          </button>
        </div>
      )}
      
      <div className="tours-grid">
        {filteredTours.length > 0 ? (
          filteredTours.map((tour, index) => {
            const daysRemaining = getDaysRemaining(tour.date);
            return (
              <div 
                className="tour-card animate-card"
                key={tour._id || index}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link to={`/tour-detail/${tour.link}`} className="tour-link">
                  <div className="tour-image-container">
                    <div className="image-overlay"></div>
                    <img src={tour.image} alt={tour.title} loading="lazy" />
                    <div className="tour-destination-tag">
                      <i className="fas fa-map-marker-alt"></i> {tour.destination}
                    </div>
                    {daysRemaining && daysRemaining < 30 && (
                      <div className="tour-special-tag">
                        <i className="fas fa-calendar-alt"></i> Còn {daysRemaining} ngày
                      </div>
                    )}
                    {isAuthenticated && (
                      <div className="tour-admin-controls">
                        <button 
                          className="tour-edit-btn" 
                          onClick={(e) => handleEdit(e, tour._id)}
                          title="Sửa tour"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="tour-delete-btn" 
                          onClick={(e) => handleDelete(e, tour._id)}
                          title="Xóa tour"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="tour-content">
                    <div className="tour-meta">
                      <p className="tour-date">
                        <i className="far fa-calendar"></i> {tour.date}
                      </p>
                    </div>
                    <h3 className="tour-title">{tour.title}</h3>
                    <p className="tour-description">{tour.description}</p>
                    <div className="tour-footer">
                      <span className="tour-view-btn">
                        Xem chi tiết <i className="fas fa-long-arrow-alt-right"></i>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="no-tours">
            <i className="far fa-frown"></i>
            <p>Không có tour nào phù hợp với tiêu chí tìm kiếm.</p>
            <button 
              className="reset-filter-btn"
              onClick={() => handleCategoryChange('all')}
            >
              Xem tất cả tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;