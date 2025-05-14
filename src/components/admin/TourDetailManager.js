// src/components/admin/TourDetailManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './AdminStyles.css';

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
      const res = await axios.get('https://tourist-web-noln.onrender.com/api/admin/tour-details', {
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
      const res = await axios.get(`https://tourist-web-noln.onrender.com/api/admin/tour-details/${id}`, {
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
        await axios.delete(`https://tourist-web-noln.onrender.com/api/admin/tour-details/${id}`, {
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
          `https://tourist-web-noln.onrender.com/api/admin/tour-details/${currentTourDetail._id}`,
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
          'https://tourist-web-noln.onrender.com/api/admin/tour-details',
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
    return (
      <div className="admin-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin chi tiết tour...</p>
        </div>
      </div>
    );
  }

  if (error && !showForm) {
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
        <h1 className="page-title">Quản lý Chi tiết Tour</h1>
        <p className="page-description">
          Quản lý thông tin chi tiết về lịch trình, chương trình các tour du lịch.
        </p>
      </div>
      
      {showForm ? (
        <div className="admin-form">
          <h2>{currentTourDetail ? 'Chỉnh sửa chi tiết tour' : 'Thêm mới chi tiết tour'}</h2>
          <div className="form-placeholder">
            <p>Sử dụng Form trong ứng dụng thật. Ở đây chỉ là mockup.</p>
          </div>
          <div className="btn-container">
            <button className="cancel-btn" onClick={handleFormCancel}>Quay lại</button>
          </div>
        </div>
      ) : (
        <>
          <button className="add-btn" onClick={handleAddClick}>
            <i className="fas fa-plus"></i> Thêm Chi tiết Tour Mới
          </button>
          
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th width="5%">STT</th>
                  <th width="15%">Tour ID</th>
                  <th width="45%">Tiêu đề</th>
                  <th width="15%">Số ngày</th>
                  <th width="20%">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {tourDetails.map((detail, index) => (
                  <tr key={detail._id}>
                    <td data-label="STT">{index + 1}</td>
                    <td data-label="Tour ID">{detail.tourId}</td>
                    <td data-label="Tiêu đề">{detail.title}</td>
                    <td data-label="Số ngày">
                      <span className="status-badge success">
                        {detail.days ? detail.days.length : 0} ngày
                      </span>
                    </td>
                    <td data-label="Thao tác">
                      <div className="action-btns">
                        <button 
                          className="action-btn view" 
                          onClick={() => window.open(`/tour-detail/${detail.tourId}`, '_blank')}
                          title="Xem"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="action-btn edit" 
                          onClick={() => handleEditClick(detail)}
                          title="Sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="action-btn delete" 
                          onClick={() => handleDeleteClick(detail._id)}
                          title="Xóa"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {tourDetails.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      <div className="no-data">
                        <i className="fas fa-info-circle"></i>
                        <p>Chưa có dữ liệu chi tiết tour</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default TourDetailManager;