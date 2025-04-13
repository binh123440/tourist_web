import React, { useState, useEffect } from 'react';
import './GalleryStyle.css';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

Modal.setAppElement('#root');

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState(8);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/gallery');
        setImages(res.data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải thư viện ảnh');
        setLoading(false);
        console.error('Error fetching images:', err);
      }
    };

    fetchImages();
  }, []);

  const handleLoadMore = () => {
    setVisibleImages(images.length);
  };

  // Hàm tối ưu URL ảnh Cloudinary - thêm các transformation
  const getOptimizedImageUrl = (url, size = 'thumbnail') => {
    if (!url) return '';
    
    // Thêm console.log để debug
    console.log('Original URL:', url);
    
    if (url.includes('cloudinary.com')) {
      console.log('Cloudinary URL detected');
      // Đây là URL Cloudinary
      switch (size) {
        case 'thumbnail':
          // Ảnh thumbnail cho grid gallery
          return url.replace('/upload/', '/upload/c_fill,h_300,w_300/');
        case 'modal':
          // Ảnh full size cho modal
          return url.replace('/upload/', '/upload/c_limit,w_1200,h_800/');
        default:
          return url;
      }
    }
    
    // Nếu là URL cục bộ (bắt đầu bằng /)
    if (url.startsWith('/')) {
      console.log('Local URL detected');
      return url;
    }
    
    // Nếu là URL đầy đủ khác
    console.log('Other URL type detected');
    return url;
  };

  const openModal = (image) => {
    // Nếu là đối tượng image có url
    const imageUrl = typeof image === 'object' && image.url ? image.url : image;
    // Lấy bản đầy đủ cho modal
    const optimizedImageUrl = getOptimizedImageUrl(imageUrl, 'modal');
    setCurrentImage(optimizedImageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/gallery/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        // Cập nhật lại danh sách ảnh sau khi xóa
        setImages(images.filter(img => img._id !== id));
      } catch (err) {
        console.error('Error deleting image:', err);
        alert('Không thể xóa ảnh');
      }
    }
  };

  if (loading) {
    return (
      <div className="gallery">
        <h2>Thư viện ảnh</h2>
        <div className="loading">Đang tải ảnh...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery">
        <h2>Thư viện ảnh</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <h2>Thư viện ảnh</h2>
      <div className="gallery-grid">
        {images.slice(0, visibleImages).map((image, index) => {
          // Xác định URL ảnh
          const imageUrl = typeof image === 'object' ? 
            (image.url || image) : image;
          
          console.log('Image data:', image);
          console.log('Image URL to display:', imageUrl);
          
          return (
            <div className="gallery-item" key={image._id || index}>
              <img 
                src={getOptimizedImageUrl(imageUrl, 'thumbnail')} 
                alt={image.name || `Gallery ${index + 1}`}
                onClick={() => openModal(image)} 
                loading="lazy"
                onError={(e) => {
                  console.error('Image load error:', e);
                  e.target.src = '/placeholder.jpg'; // Hình placeholder khi lỗi
                }}
              />
              {isAuthenticated && (
                <div className="gallery-admin-controls">
                  <button 
                    className="action-btn delete gallery-delete-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image._id);
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {visibleImages < images.length && (
        <button className="load-more" onClick={handleLoadMore}>Xem thêm</button>
      )}
      
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="gallery-modal"
        overlayClassName="overlay"
      >
        <img src={currentImage} alt="Gallery" className="modal-image" />
        <button className="close-modal" onClick={closeModal}>
          <i className="fas fa-times"></i>
        </button>
      </Modal>
    </div>
  );
};

export default Gallery;