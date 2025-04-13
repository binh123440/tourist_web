// src/components/admin/TourManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TourForm from './TourForm';

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
      const res = await axios.get('http://localhost:5000/api/admin/tours', {
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
        await axios.delete(`http://localhost:5000/api/admin/tours/${id}`, {
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
          `http://localhost:5000/api/admin/tours/${currentTour._id}`,
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
          'http://localhost:5000/api/admin/tours',
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
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="tour-manager">
      <h1>Quản lý Tour</h1>
      
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
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tiêu đề</th>
                <th>Điểm đến</th>
                <th>Ngày</th>
                <th>Link</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour, index) => (
                <tr key={tour._id}>
                  <td>{index + 1}</td>
                  <td>{tour.title}</td>
                  <td>{tour.destination}</td>
                  <td>{tour.date}</td>
                  <td>{tour.link}</td>
                  <td>
                    <button 
                      className="action-btn edit" 
                      onClick={() => handleEditClick(tour)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="action-btn delete" 
                      onClick={() => handleDeleteClick(tour._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default TourManager;