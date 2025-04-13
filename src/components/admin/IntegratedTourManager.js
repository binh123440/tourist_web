// Component quản lý tour tích hợp - xử lý danh sách, thêm, sửa, xóa tour
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Thư viện gọi API
import { useLocation, useNavigate } from 'react-router-dom'; // Xử lý điều hướng
import IntegratedTourForm from './IntegratedTourForm'; // Component form nhập liệu

const IntegratedTourManager = () => {
  // Các state quản lý dữ liệu và trạng thái
  const [tours, setTours] = useState([]); // Danh sách tour
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState(null); // Thông báo lỗi
  const [showForm, setShowForm] = useState(false); // Hiển thị/ẩn form
  const [currentTour, setCurrentTour] = useState(null); // Tour hiện tại đang chỉnh sửa
  const location = useLocation(); // Lấy thông tin URL hiện tại
  const navigate = useNavigate(); // Điều hướng trang

  // Khi component được tải, lấy danh sách tour và kiểm tra query param
  useEffect(() => {
    fetchTours();
    
    // Kiểm tra xem có tham số edit trên URL không
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    if (editId) {
      handleEditById(editId); // Nếu có, tải thông tin tour để chỉnh sửa
    }
  }, [location]); // Chạy lại khi location thay đổi

  // Hàm lấy danh sách tour từ API
  const fetchTours = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // Lấy token xác thực
      const res = await axios.get('http://localhost:5000/api/admin/integrated-tours', {
        headers: {
          'x-auth-token': token // Gửi token trong header
        }
      });
      setTours(res.data); // Cập nhật state với dữ liệu từ API
      setLoading(false);
    } catch (err) {
      setError('Không thể tải danh sách tour');
      setLoading(false);
      console.error('Error fetching tours:', err);
    }
  };

  // Hàm lấy thông tin chi tiết tour theo ID để chỉnh sửa
  const handleEditById = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/admin/integrated-tours/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setCurrentTour(res.data);
      setShowForm(true);
      setLoading(false);
    } catch (err) {
      setError('Không thể tải thông tin tour');
      setLoading(false);
      console.error('Error fetching tour for edit:', err);
    }
  };

  // Hàm xử lý khi nhấp vào nút thêm mới
  const handleAddClick = () => {
    setCurrentTour(null); // Đặt currentTour thành null để biết đây là thêm mới
    setShowForm(true); // Hiển thị form
  };

  // Hàm xử lý khi nhấp vào nút chỉnh sửa
  const handleEditClick = (tour) => {
    navigate(`/admin/tours?edit=${tour._id}`); // Thêm tham số edit vào URL
  };

  // Hàm xử lý khi nhấp vào nút xóa
  const handleDeleteClick = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tour này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/integrated-tours/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        fetchTours(); // Tải lại danh sách sau khi xóa
      } catch (err) {
        setError('Không thể xóa tour');
        console.error('Error deleting tour:', err);
      }
    }
  };

  // Hàm xử lý khi gửi form
  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        'http://localhost:5000/api/admin/integrated-tours',
        formData,
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setShowForm(false);
      fetchTours(); // Tải lại danh sách sau khi lưu
      navigate('/admin/tours'); // Chuyển về trang danh sách
    } catch (err) {
      setError('Không thể lưu tour');
      console.error('Error saving tour:', err);
    }
  };

  // Hàm xử lý khi hủy form
  const handleFormCancel = () => {
    setShowForm(false);
    navigate('/admin/tours'); // Chuyển về trang danh sách
  };

  // Hiển thị loading nếu đang tải dữ liệu
  if (loading && !showForm) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  // Hiển thị lỗi nếu có
  if (error && !showForm) {
    return <div className="error">{error}</div>;
  }

  // Phần giao diện chính của component
  return (
    <div className="integrated-tour-manager">
      <h1>Quản lý Tour</h1>
      
      {showForm ? (
        // Hiển thị form nếu showForm = true
        <IntegratedTourForm 
          tourData={currentTour} 
          onSubmit={handleFormSubmit} 
          onCancel={handleFormCancel} 
        />
      ) : (
        // Ngược lại hiển thị danh sách tour
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
                <th>Chi tiết</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour, index) => (
                // Hiển thị từng tour trong bảng
                <tr key={tour._id}>
                  <td>{index + 1}</td>
                  <td>{tour.title}</td>
                  <td>{tour.destination}</td>
                  <td>{tour.date}</td>
                  <td>
                    {tour.hasDetail ? (
                      <span className="status-badge success">Có</span>
                    ) : (
                      <span className="status-badge warning">Chưa có</span>
                    )}
                  </td>
                  <td>
                    {/* Các nút thao tác: xem, sửa, xóa */}
                    <button 
                      className="action-btn view" 
                      onClick={() => window.open(`/tour-detail/${tour.link}`, '_blank')}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
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

export default IntegratedTourManager;