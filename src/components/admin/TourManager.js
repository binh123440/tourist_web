// src/components/admin/TourManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TourForm from './TourForm';
import './AdminStyles.css';

const TourManager = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('https://tourist-web-noln.onrender.com/api/admin/tours', {
        headers: {
          'x-auth-token': token
        }
      });
      setTours(res.data);
      setLoading(false);
    } catch (err) {
      setError('Không thể tải danh sách tour');
      setLoading(false);
      console.error('Error fetching tours:', err);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleAddClick = () => {
    setCurrentTour(null);
    setShowForm(true);
  };

  const handleEditClick = (tour) => {
    setCurrentTour(tour);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tour này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://tourist-web-noln.onrender.com/api/admin/tours/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        fetchTours();
      } catch (err) {
        setError('Không thể xóa tour');
        console.error('Error deleting tour:', err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (currentTour) {
        // Cập nhật tour hiện có
        await axios.put(
          `https://tourist-web-noln.onrender.com/api/admin/tours/${currentTour._id}`,
          formData,
          {
            headers: {
              'x-auth-token': token,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Tạo tour mới
        await axios.post(
          'https://tourist-web-noln.onrender.com/api/admin/tours',
          formData,
          {
            headers: {
              'x-auth-token': token,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      setShowForm(false);
      fetchTours();
    } catch (err) {
      setError('Không thể lưu tour');
      console.error('Error saving tour:', err);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách tour...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error">
          <i className="fas fa-exclamation-triangle"></i> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="page-header">
        <h1 className="page-title">Quản lý Tour</h1>
        <p className="page-description">
          Quản lý danh sách các tour du lịch và thông tin cơ bản của tour.
        </p>
      </div>
      
      {showForm ? (
        <TourForm 
          tour={currentTour} 
          onSubmit={handleFormSubmit} 
          onCancel={handleFormCancel} 
        />
      ) : (
        <>
          <button className="add-btn" onClick={handleAddClick}>
            <i className="fas fa-plus"></i> Thêm Tour Mới
          </button>
          
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th width="5%">STT</th>
                  <th width="35%">Tiêu đề</th>
                  <th width="15%">Điểm đến</th>
                  <th width="15%">Ngày</th>
                  <th width="15%">Link</th>
                  <th width="15%">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((tour, index) => (
                  <tr key={tour._id}>
                    <td data-label="STT">{index + 1}</td>
                    <td data-label="Tiêu đề">{tour.title}</td>
                    <td data-label="Điểm đến">{tour.destination}</td>
                    <td data-label="Ngày">{tour.date}</td>
                    <td data-label="Link">{tour.link}</td>
                    <td data-label="Thao tác">
                      <div className="action-btns">
                        <button 
                          className="action-btn view" 
                          onClick={() => window.open(`/tour-detail/${tour.link}`, '_blank')}
                          title="Xem"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="action-btn edit" 
                          onClick={() => handleEditClick(tour)}
                          title="Sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="action-btn delete" 
                          onClick={() => handleDeleteClick(tour._id)}
                          title="Xóa"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default TourManager;