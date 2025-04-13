// src/components/admin/GalleryManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GalleryForm from './GalleryForm';
import './GalleryManagerStyle.css'; // Thêm file CSS riêng

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'deleted', hoặc folder cụ thể
  const [selectedFolder, setSelectedFolder] = useState('gallery'); // 'all', 'gallery', 'tour'
  const [imageDetails, setImageDetails] = useState(null); // Chi tiết ảnh đang xem
  const [showImageDetails, setShowImageDetails] = useState(false);

  const fetchImages = async (deleted = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = {
        type: 'gallery', // Luôn lấy ảnh loại gallery
        deleted: deleted
      };

      const res = await axios.get('http://localhost:5000/api/admin/gallery', {
        params,
        headers: {
          'x-auth-token': token
        }
      });
      
      // Thêm debug logs này
      console.log("API response:", res.data);
      console.log("Images count:", res.data.length);
      
      if (deleted) {
        setDeletedImages(res.data);
      } else {
        setImages(res.data);
      }

      setLoading(false);
    } catch (err) {
      setError('Không thể tải thư viện ảnh');
      setLoading(false);
      console.error('Error fetching images:', err);
    }
  };

  const fetchImageDetails = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/admin/gallery/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setImageDetails(res.data);
      setShowImageDetails(true);
      setLoading(false);
    } catch (err) {
      setError('Không thể tải chi tiết ảnh');
      setLoading(false);
      console.error('Error fetching image details:', err);
    }
  };

  useEffect(() => {
    fetchImages(false);
    fetchImages(true);
  }, [selectedFolder]);

  const handleAddClick = () => {
    setCurrentImage(null);
    setShowForm(true);
    setShowImageDetails(false);
  };

  const handleEditClick = (image) => {
    setCurrentImage(image);
    setShowForm(true);
    setShowImageDetails(false);
  };

  const handleViewDetailsClick = (image) => {
    fetchImageDetails(image._id);
  };

  const handleCloseDetails = () => {
    setShowImageDetails(false);
    setImageDetails(null);
  };

  // Thay thế handleDeleteClick bằng softDelete
  const handleSoftDeleteClick = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này? Ảnh sẽ được chuyển vào thùng rác và có thể khôi phục.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/admin/gallery/${id}/soft-delete`, {}, {
          headers: {
            'x-auth-token': token
          }
        });

        // Cập nhật lại danh sách
        fetchImages(false);
        fetchImages(true);

        if (showImageDetails && imageDetails && imageDetails._id === id) {
          setShowImageDetails(false);
        }
      } catch (err) {
        setError('Không thể xóa ảnh');
        console.error('Error soft deleting image:', err);
      }
    }
  };

  // Thêm hàm khôi phục ảnh
  const handleRestoreClick = async (id) => {
    console.log('Restore button clicked for ID:', id);
    if (window.confirm('Bạn có muốn khôi phục ảnh này?')) {
      try {
        const token = localStorage.getItem('token');
        console.log('Using token:', token ? 'Exists' : 'Missing');

        const response = await axios.put(`http://localhost:5000/api/admin/gallery/${id}/restore`, {}, {
          headers: {
            'x-auth-token': token
          }
        });

        console.log('Restore response:', response.data);

        // Cập nhật lại danh sách
        fetchImages(false);
        fetchImages(true);

        // Hiển thị thông báo thành công
        alert('Khôi phục ảnh thành công!');
      } catch (err) {
        console.error('Error details:', err.response ? err.response.data : err.message);
        setError('Không thể khôi phục ảnh');
        console.error('Error restoring image:', err);
        // Hiển thị thông báo lỗi
        alert('Không thể khôi phục ảnh: ' + (err.response ? err.response.data.message : err.message));
      }
    }
  };

  // Thêm hàm xóa vĩnh viễn
  const handlePermanentDeleteClick = async (id) => {
    if (window.confirm('CẢNH BÁO: Ảnh sẽ bị xóa vĩnh viễn khỏi cả Cloudinary và database. Bạn không thể hoàn tác hành động này. Tiếp tục?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/gallery/${id}/permanent`, {
          headers: {
            'x-auth-token': token
          }
        });

        // Cập nhật lại danh sách
        fetchImages(true);

        if (showImageDetails && imageDetails && imageDetails._id === id) {
          setShowImageDetails(false);
        }
      } catch (err) {
        setError('Không thể xóa vĩnh viễn ảnh');
        console.error('Error permanently deleting image:', err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (currentImage) {
        // Cập nhật thông tin ảnh
        await axios.put(
          `http://localhost:5000/api/admin/gallery/${currentImage._id}`,
          {
            name: formData.name,
            description: formData.description,
            type: formData.type
          },
          {
            headers: {
              'x-auth-token': token,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Upload ảnh mới lên Cloudinary
        const data = new FormData();
        data.append('image', formData.imageFile);
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('type', formData.type);

        await axios.post(
          'http://localhost:5000/api/admin/gallery',
          data,
          {
            headers: {
              'x-auth-token': token,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      setShowForm(false);
      fetchImages(false, selectedFolder);
    } catch (err) {
      setError('Không thể lưu ảnh');
      console.error('Error saving image:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleFolderChange = (folder) => {
    setSelectedFolder(folder);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading && !showForm && !showImageDetails) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error && !showForm && !showImageDetails) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="gallery-manager">
      <h1>Quản lý Thư viện Ảnh</h1>

      {showForm ? (
        <GalleryForm
          image={currentImage}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={loading}
        />
      ) : showImageDetails ? (
        <div className="image-details">
          <button className="back-btn" onClick={handleCloseDetails}>
            <i className="fas fa-arrow-left"></i> Quay lại
          </button>

          <div className="image-details-container">
            <div className="image-preview-large">
              <img src={imageDetails.url} alt={imageDetails.name} />
            </div>

            <div className="image-info">
              <h2>{imageDetails.name}</h2>
              <p><strong>Loại:</strong> {imageDetails.type}</p>
              <p><strong>Mô tả:</strong> {imageDetails.description || 'Không có mô tả'}</p>
              <p><strong>Ngày tạo:</strong> {new Date(imageDetails.createdAt).toLocaleDateString('vi-VN')}</p>
              <p><strong>URL:</strong> <a href={imageDetails.url} target="_blank" rel="noopener noreferrer">{imageDetails.url}</a></p>
              <p><strong>Cloudinary ID:</strong> {imageDetails.cloudinaryId || 'N/A'}</p>

              <div className="action-buttons">
                <button
                  className="action-btn edit"
                  onClick={() => handleEditClick(imageDetails)}
                >
                  <i className="fas fa-edit"></i> Sửa
                </button>

                {!imageDetails.isDeleted ? (
                  <button
                    className="action-btn delete"
                    onClick={() => handleSoftDeleteClick(imageDetails._id)}
                  >
                    <i className="fas fa-trash"></i> Xóa
                  </button>
                ) : (
                  <>
                    <button
                      className="action-btn restore"
                      onClick={() => handleRestoreClick(imageDetails._id)}
                    >
                      <i className="fas fa-trash-restore"></i> Khôi phục
                    </button>
                    <button
                      className="action-btn delete-permanent"
                      onClick={() => handlePermanentDeleteClick(imageDetails._id)}
                    >
                      <i className="fas fa-trash-alt"></i> Xóa vĩnh viễn
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="gallery-controls">
            <div className="tab-buttons">
              <button
                className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                onClick={() => handleTabChange('active')}
              >
                <i className="fas fa-images"></i> Ảnh đang hoạt động
              </button>
              <button
                className={`tab-btn ${activeTab === 'deleted' ? 'active' : ''}`}
                onClick={() => handleTabChange('deleted')}
              >
                <i className="fas fa-trash"></i> Thùng rác ({deletedImages.length})
              </button>
            </div>

            {activeTab === 'active' && (
              <div className="folder-info">
                <p className="gallery-folder-label">
                  <i className="fas fa-folder-open"></i>Gallery của LotusVoyages
                </p>
              </div>
            )}
            <button className="add-btn" onClick={handleAddClick}>
              <i className="fas fa-plus"></i> Thêm Ảnh Mới
            </button>
          </div>

          {activeTab === 'active' ? (
            <>
              <div className="gallery-grid admin-gallery">
                {images.length === 0 ? (
                  <p className="no-data">Không có ảnh nào</p>
                ) : (
                  images.map((image) => (
                    <div className="gallery-item" key={image._id}>
                      <img
                        src={image.url}
                        alt={image.name}
                        onError={(e) => {
                          console.error(`Failed to load image: ${image.url}`);
                          e.target.src = '/placeholder.jpg'; // Hình mặc định khi lỗi
                          e.target.onerror = null; // Ngăn lặp vô hạn
                        }}
                      />
                      <div className="gallery-item-overlay">
                        <h3>{image.name}</h3>
                        <p className="image-type">{image.type}</p>
                        <div className="gallery-item-actions">
                          <button
                            className="action-btn view"
                            onClick={() => handleViewDetailsClick(image)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="action-btn edit"
                            onClick={() => handleEditClick(image)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleSoftDeleteClick(image._id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="gallery-grid admin-gallery deleted-gallery">
                {deletedImages.length === 0 ? (
                  <p className="no-data">Thùng rác trống</p>
                ) : (
                  deletedImages.map((image) => (
                    <div className="gallery-item deleted-item" key={image._id}>
                      <img src={image.url} alt={image.name} />
                      <div className="gallery-item-overlay">
                        <h3>{image.name}</h3>
                        <p className="image-type">{image.type}</p>
                        <div className="gallery-item-actions">
                          <button
                            className="action-btn view"
                            onClick={() => handleViewDetailsClick(image)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="action-btn restore"
                            onClick={() => handleRestoreClick(image._id)}
                            style={{ backgroundColor: '#2ecc71', zIndex: 100 }}
                          >
                            <i className="fas fa-trash-restore"></i>
                          </button>
                          <button
                            className="action-btn delete-permanent"
                            onClick={() => handlePermanentDeleteClick(image._id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GalleryManager;