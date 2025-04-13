// src/components/admin/TourDetailManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TourDetailForm from './TourDetailForm';
import { useLocation, useNavigate } from 'react-router-dom';

const TourDetailManager = () => {
  const [tourDetails, setTourDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentTourDetail, setCurrentTourDetail] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTourDetails();
    
    // Kiểm tra nếu có query parameter edit
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    if (editId) {
      handleEditById(editId);
    }
  }, [location]);

  const fetchTourDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/tour-details', {
        headers: {
          'x-auth-token': token
        }
      });
      setTourDetails(res.data);
      setLoading(false);
    } catch (err) {
      setError('Không thể tải danh sách chi tiết tour');
      setLoading(false);
      console.error('Error fetching tour details:', err);
    }
  };

  const handleEditById = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/admin/tour-details/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setCurrentTourDetail(res.data);
      setShowForm(true);
      setLoading(false);
    } catch (err) {
      setError('Không thể tải chi tiết tour');
      setLoading(false);
      console.error('Error fetching tour detail for edit:', err);
    }
  };

  const handleAddClick = () => {
    setCurrentTourDetail(null);
    setShowForm(true);
  };

  const handleEditClick = (tourDetail) => {
    setCurrentTourDetail(tourDetail);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chi tiết tour này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/tour-details/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        fetchTourDetails();
      } catch (err) {
        setError('Không thể xóa chi tiết tour');
        console.error('Error deleting tour detail:', err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (currentTourDetail) {
        // Cập nhật chi tiết tour hiện có
        await axios.put(
          `http://localhost:5000/api/admin/tour-details/${currentTourDetail._id}`,
          formData,
          {
            headers: {
              'x-auth-token': token,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Tạo chi tiết tour mới
        await axios.post(
          'http://localhost:5000/api/admin/tour-details',
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
      fetchTourDetails();
      
      // Xóa query parameter sau khi lưu
      navigate('/admin/tour-details');
    } catch (err) {
      setError('Không thể lưu chi tiết tour');
      console.error('Error saving tour detail:', err);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    // Xóa query parameter khi hủy
    navigate('/admin/tour-details');
  };

  if (loading && !showForm) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error && !showForm) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="tour-detail-manager">
      <h1>Quản lý Chi tiết Tour</h1>
      
      {showForm ? (
        <div className="tour-detail-form-container">
          <h2>{currentTourDetail ? 'Chỉnh sửa chi tiết tour' : 'Thêm mới chi tiết tour'}</h2>
          <p>Sử dụng Form trong ứng dụng thật. Ở đây chỉ là mockup.</p>
          <div className="btn-container">
            <button className="cancel-btn" onClick={handleFormCancel}>Quay lại</button>
          </div>
        </div>
      ) : (
        <>
          <button className="add-btn" onClick={handleAddClick}>
            <i className="fas fa-plus"></i> Thêm Chi tiết Tour Mới
          </button>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tour ID</th>
                <th>Tiêu đề</th>
                <th>Số ngày</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {tourDetails.map((detail, index) => (
                <tr key={detail._id}>
                  <td>{index + 1}</td>
                  <td>{detail.tourId}</td>
                  <td>{detail.title}</td>
                  <td>{detail.days ? detail.days.length : 0}</td>
                  <td>
                    <button 
                      className="action-btn view" 
                      onClick={() => window.open(`/tour-detail/${detail.tourId}`, '_blank')}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="action-btn edit" 
                      onClick={() => handleEditClick(detail)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="action-btn delete" 
                      onClick={() => handleDeleteClick(detail._id)}
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

export default TourDetailManager;