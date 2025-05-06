// Component quản lý tour tích hợp - xử lý danh sách, thêm, sửa, xóa tour
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import IntegratedTourForm from './IntegratedTourForm';
import './AdminStyles.css';

const IntegratedTourManager = () => {
  // Các state quản lý dữ liệu và trạng thái
  const [tours, setTours] = useState([]); // Danh sách tour
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState(null); // Thông báo lỗi
  const [showForm, setShowForm] = useState(false); // Hiển thị/ẩn form
  const [currentTour, setCurrentTour] = useState(null); // Tour hiện tại đang chỉnh sửa
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [notification, setNotification] = useState({ show: false, message: '', type: '' }); // Thông báo
  const [sortField, setSortField] = useState('title'); // Trường sắp xếp
  const [sortDirection, setSortDirection] = useState('asc'); // Hướng sắp xếp
  
  const location = useLocation();
  const navigate = useNavigate();

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
        
        // Hiển thị thông báo xóa thành công
        showNotification('Xóa tour thành công', 'success');
        
        fetchTours(); // Tải lại danh sách sau khi xóa
      } catch (err) {
        setError('Không thể xóa tour');
        showNotification('Không thể xóa tour', 'error');
        console.error('Error deleting tour:', err);
      }
    }
  };

  // Hàm xử lý khi gửi form
  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');

      // --- FIX: Access the correct ID ---
      // Determine the ID based on the expected structure from your GET request
      // Adjust 'currentTour.tour._id' if your ID is located elsewhere (e.g., currentTour._id)
      const tourIdForUpdate = currentTour?.tour?._id || currentTour?._id; // Example: Check nested first, then top-level

      // Add a check to prevent sending 'undefined'
      if (currentTour && !tourIdForUpdate) {
        console.error("CRITICAL: Cannot update tour because ID is missing!", currentTour);
        setError('Không thể cập nhật tour: Thiếu ID.');
        showNotification('Không thể cập nhật tour: Thiếu ID.', 'error');
        return; // Stop execution if ID is missing for an update
      }

      const apiUrl = currentTour
        ? `http://localhost:5000/api/admin/integrated-tours/${tourIdForUpdate}` // Use the correctly accessed ID
        : 'http://localhost:5000/api/admin/integrated-tours';

      const method = currentTour ? 'put' : 'post';

      console.log("Submitting form. Is Edit:", !!currentTour);
      console.log("Current Tour Data:", currentTour);
      console.log("ID being used for URL:", tourIdForUpdate); // Log the ID being used

      await axios({
        method,
        url: apiUrl,
        data: formData,
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      // Hiển thị thông báo thành công
      showNotification(
        currentTour ? 'Cập nhật tour thành công' : 'Thêm tour mới thành công', 
        'success'
      );
      
      setShowForm(false);
      fetchTours(); // Tải lại danh sách sau khi lưu
      navigate('/admin/tours'); // Chuyển về trang danh sách
    } catch (err) {
      setError('Không thể lưu tour: ' + (err.response?.data?.msg || err.message));
      showNotification('Không thể lưu tour', 'error');
      console.error('Error saving tour:', err);
    }
  };

  // Hàm xử lý khi hủy form
  const handleFormCancel = () => {
    setShowForm(false);
    navigate('/admin/tours'); // Chuyển về trang danh sách
  };

  // Hiển thị thông báo
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Hàm lọc tour theo từ khóa tìm kiếm
  const filteredTours = tours.filter(tour => {
    if (!searchTerm) return true; // Return all if no search term
    const searchLower = searchTerm.toLowerCase();
  
    // Check Vietnamese title (ensure it exists and is a string)
    const titleMatch = tour.title?.vi && typeof tour.title.vi === 'string'
      ? tour.title.vi.toLowerCase().includes(searchLower)
      : false;
  
    // Check Vietnamese destination (ensure it exists and is a string)
    const destinationMatch = tour.destination?.vi && typeof tour.destination.vi === 'string'
      ? tour.destination.vi.toLowerCase().includes(searchLower)
      : false;
  
    // You could optionally search other languages here too if needed
    // const titleEnMatch = tour.title?.en?.toLowerCase().includes(searchLower) || false;
    // return titleMatch || destinationMatch || titleEnMatch;
  
    return titleMatch || destinationMatch;
  });

  // Sắp xếp tour
  const sortedTours = [...filteredTours].sort((a, b) => {
    let fieldA = '';
    let fieldB = '';

    // Access nested fields based on sortField, defaulting to Vietnamese
    if (sortField === 'title') {
        fieldA = a.title?.vi || ''; // Use Vietnamese title
        fieldB = b.title?.vi || '';
    } else if (sortField === 'destination') {
        fieldA = a.destination?.vi || ''; // Use Vietnamese destination
        fieldB = b.destination?.vi || '';
    } else if (sortField === 'date') {
        fieldA = a.date || '';
        fieldB = b.date || '';
    }
    // Add other sortable fields if necessary

    // Ensure comparison is done on strings for localeCompare
    fieldA = String(fieldA);
    fieldB = String(fieldB);

    // Use localeCompare for better string sorting, especially with accents
    const comparison = fieldA.localeCompare(fieldB, 'vi', { sensitivity: 'base' });

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Hàm thay đổi trường sắp xếp
  const handleSort = (field) => {
    if (field === sortField) {
      // Nếu đã sắp xếp theo field này, đổi chiều sắp xếp
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Nếu chưa sắp xếp theo field này, đặt field mới và reset chiều sắp xếp
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Hiển thị biểu tượng sắp xếp
  const getSortIcon = (field) => {
    if (field !== sortField) return null;
    
    return sortDirection === 'asc' 
      ? <i className="fas fa-sort-up"></i> 
      : <i className="fas fa-sort-down"></i>;
  };

  // Hiển thị loading nếu đang tải dữ liệu
  if (loading && !showForm) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách tour tích hợp...</p>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error && !showForm) {
    return (
      <div className="admin-container">
        <div className="error">
          <i className="fas fa-exclamation-triangle"></i> {error}
        </div>
      </div>
    );
  }

  // Cắt ngắn tiêu đề nếu quá dài
  const truncateTitle = (title, maxLength = 50) => {
    if (!title || typeof title !== 'string') { // Add check for non-string input
        return '';
    }
    if (title.length <= maxLength) {
        return title;
    }
    return title.substring(0, maxLength) + '...';
};

  return (
    <div className="admin-container">
      {/* Hiển thị thông báo */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{notification.message}</span>
        </div>
      )}
      
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Quản lý Tour Tích Hợp</h1>
          <p className="page-description">
            Quản lý cả thông tin cơ bản và chi tiết tour trong một giao diện thống nhất.
          </p>
        </div>
        
        {!showForm && (
          <div className="page-actions">
            <button className="add-btn" onClick={handleAddClick}>
              <i className="fas fa-plus"></i> Thêm Tour Tích Hợp Mới
            </button>
          </div>
        )}
      </div>
      
      {showForm ? (
        <IntegratedTourForm 
          tourData={currentTour}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <>
          {/* Thanh tìm kiếm và bộ lọc */}
          <div className="search-filter-container">
            <div className="search-box">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Tìm kiếm tour theo tên, điểm đến..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search" 
                  onClick={() => setSearchTerm('')}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            
            <div className="filter-options">
              <span className="results-count">
                {filteredTours.length} kết quả
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th width="5%">STT</th>
                  <th 
                    width="35%" 
                    onClick={() => handleSort('title')}
                    className="sortable-header"
                  >
                    Tiêu đề {getSortIcon('title')}
                  </th>
                  <th 
                    width="15%" 
                    onClick={() => handleSort('destination')}
                    className="sortable-header"
                  >
                    Điểm đến {getSortIcon('destination')}
                  </th>
                  <th 
                    width="15%" 
                    onClick={() => handleSort('date')}
                    className="sortable-header"
                  >
                    Ngày {getSortIcon('date')}
                  </th>
                  <th width="10%">Chi tiết</th>
                  <th width="20%">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedTours.map((tour, index) => (
                  <tr key={tour._id} className="tour-row">
                    <td data-label="STT">{index + 1}</td>
                    <td data-label="Tiêu đề">
                      <div className="tour-title">
                        {tour.image && (
                          <div className="tour-thumbnail">
                            <img 
                              src={tour.image.startsWith('http') ? tour.image : `http://localhost:5000${tour.image}`} 
                              alt={tour.title?.vi || 'Tour image'}
                            />
                          </div>
                        )}
                        <span className="title-text" title={tour.title?.vi}> 
                          {truncateTitle(tour.title?.vi || '')} 
                        </span>
                      </div>
                    </td>
                    <td data-label="Điểm đến">{tour.destination?.vi || ''}</td> 
                    <td data-label="Ngày">{tour.date}</td>
                    <td data-label="Chi tiết">
                      {tour.hasDetail ? (
                        <span className="status-badge success">Có</span>
                      ) : (
                        <span className="status-badge warning">Chưa có</span>
                      )}
                    </td>
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
                
                {sortedTours.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      <div className="no-data">
                        <i className="fas fa-info-circle"></i>
                        <p>
                          {searchTerm ? 
                            `Không tìm thấy tour nào phù hợp với từ khóa "${searchTerm}"` : 
                            'Chưa có dữ liệu tour tích hợp'
                          }
                        </p>
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

export default IntegratedTourManager;