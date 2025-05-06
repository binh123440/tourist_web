import React, { useState, useEffect } from 'react';
import './ToursStyle.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getTours } from '../services/api'; // Đảm bảo getTours được định nghĩa đúng
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Text from './Text';
import axios from 'axios';

const Tours = ({ selectedDestination = 'all' }) => {
  const { t, currentLanguage } = useLanguage();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const getLang = (fieldObject, lang = currentLanguage) => {
    return fieldObject?.[lang] || fieldObject?.vi || '';
  };

  useEffect(() => {
    const fetchAllTours = async () => {
      try {
        setLoading(true);
        // Luôn fetch tất cả các tour.
        // Giả sử getTours() hoặc getTours(null) sẽ fetch tất cả.
        // Điều chỉnh dòng này nếu API của bạn yêu cầu một cách khác để lấy tất cả tour.
        const data = await getTours(); // Hoặc getTours(null)
        setTours(data);
        setLoading(false);
      } catch (err) {
        setError(t('errorLoadingTours'));
        setLoading(false);
        console.error('Error fetching all tours:', err);
      }
    };

    fetchAllTours();
    // Đặt selectedCategory ban đầu dựa trên prop
    setSelectedCategory(selectedDestination === 'all' ? 'all' : selectedDestination.toLowerCase().normalize('NFC'));

  }, [selectedDestination, t]); // selectedDestination trong dependencies để cập nhật bộ lọc ban đầu

  const getDaysRemaining = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split(' - ');
    const endDateString = parts.length > 1 ? parts[1] : parts[0];
    const dateParts = endDateString.split(' ')[0].split('/');
    if (dateParts.length !== 3) return null;
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    try {
      const endDate = new Date(year, month, day);
      if (isNaN(endDate.getTime())) throw new Error("Invalid date created");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 ? diffDays : null;
    } catch (parseError) {
      console.error("Error parsing date:", dateString, parseError);
      return null;
    }
  };

  const handleCategoryChange = (category) => {
    // Chuẩn hóa category được chọn
    setSelectedCategory(category.toLowerCase().normalize('NFC'));
  };

  const handleEdit = (e, tourId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/tours?edit=${tourId}`);
  };

  const handleDelete = async (e, tourId) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(t('confirmDeleteTour'))) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/integrated-tours/${tourId}`, {
          headers: { 'x-auth-token': token }
        });
        setTours(tours.filter(tour => tour._id !== tourId));
      } catch (err) {
        console.error('Error deleting tour:', err);
        alert(t('deleteTourError'));
      }
    }
  };

  const filteredTours = tours.filter(tour => {
    if (selectedCategory === 'all') {
      return true;
    }
    // Lấy tên điểm đến tiếng Việt, chuẩn hóa và chuyển sang chữ thường
    const tourDestinationVi = (tour.destination?.vi || '')
      .trim()
      .normalize('NFC') // Chuẩn hóa Unicode
      .toLowerCase();

    // selectedCategory đã được chuẩn hóa trong handleCategoryChange
    return tourDestinationVi === selectedCategory;
  });

  if (loading) {
    return (
      <div className="tours-section">
        <div className="section-header">
          <Text tag="h2" className="section-title" translationKey="experiencePrograms" />
          <div className="title-underline"></div>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <Text tag="p" translationKey="loadingTours" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tours-section">
        <div className="section-header">
          <Text tag="h2" className="section-title" translationKey="experiencePrograms" />
          <div className="title-underline"></div>
        </div>
        <div className="error-container">
          <i className="fas fa-exclamation-circle"></i>
          <Text tag="p">{error}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="tours-section">
      <div className="section-header">
        <Text tag="h2" className="section-title" translationKey="experiencePrograms" />
        <div className="title-underline"></div>
      </div>

      {location.pathname === '/tour' && (
        <div className="tours-filter">
          <button
            className={`filter-btn ${selectedCategory === 'all'.normalize('NFC') ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            <i className="fas fa-globe-asia"></i> <Text translationKey="allDestinations" />
          </button>
          {/* Đảm bảo các giá trị này khớp với cách bạn lưu trữ hoặc nhập liệu */}
          <button
            className={`filter-btn ${selectedCategory === 'bhutan'.normalize('NFC') ? 'active' : ''}`}
            onClick={() => handleCategoryChange('bhutan')}
          >
            <i className="fas fa-mountain"></i> <Text translationKey="bhutan" />
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'việt nam'.normalize('NFC') ? 'active' : ''}`}
            onClick={() => handleCategoryChange('việt nam')}
          >
            <i className="fas fa-map-marker-alt"></i> <Text translationKey="vietnam" />
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'pháp'.normalize('NFC') ? 'active' : ''}`}
            onClick={() => handleCategoryChange('pháp')}
          >
            <i className="fas fa-landmark"></i> <Text translationKey="france" />
          </button>
        </div>
      )}

      <div className="tours-grid">
        {filteredTours.length > 0 ? (
          filteredTours.map((tour, index) => {
            const daysRemaining = getDaysRemaining(tour.date);
            const tourTitle = getLang(tour.title);
            const tourDestination = getLang(tour.destination);
            const tourDescription = getLang(tour.description);

            return (
              <div
                className="tour-card animate-card"
                key={tour._id || index}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link to={`/tour-detail/${tour.link}`} className="tour-link">
                  <div className="tour-image-container">
                    <div className="image-overlay"></div>
                    <img src={tour.image.startsWith('http') ? tour.image : `http://localhost:5000${tour.image}`} alt={tourTitle} loading="lazy" />
                    <div className="tour-destination-tag">
                      <i className="fas fa-map-marker-alt"></i> {tourDestination}
                    </div>
                    {daysRemaining !== null && daysRemaining < 30 && (
                      <div className="tour-special-tag">
                        <i className="fas fa-calendar-alt"></i>
                        {t('daysLeft', { days: daysRemaining })}
                      </div>
                    )}
                    {isAuthenticated && (
                      <div className="tour-admin-controls">
                        <button
                          className="tour-edit-btn"
                          onClick={(e) => handleEdit(e, tour._id)}
                          title={t('editTour')}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="tour-delete-btn"
                          onClick={(e) => handleDelete(e, tour._id)}
                          title={t('deleteTour')}
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
                    <h3 className="tour-title">{tourTitle}</h3>
                    <p className="tour-description">{tourDescription}</p>
                    <div className="tour-footer">
                      <Text tag="span" className="tour-view-btn" translationKey="viewDetails">
                         <i className="fas fa-long-arrow-alt-right"></i>
                      </Text>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="no-tours">
            <i className="far fa-frown"></i>
            <Text tag="p" translationKey="noToursFound" />
            <button
              className="reset-filter-btn"
              onClick={() => handleCategoryChange('all')}
            >
              <Text translationKey="viewAllTours" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;