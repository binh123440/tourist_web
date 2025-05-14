import React, { useState, useEffect, useCallback } from 'react';
import './GalleryStyle.css';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext';
// Remove TranslatedText import
// import TranslatedText from './TranslatedText';
import { useLanguage } from '../context/LanguageContext';
import Text from './Text'; // Import Text component
import axios from 'axios';

Modal.setAppElement('#root');

const Gallery = () => {
  // Get t function
  const { t } = useLanguage();
  const [images, setImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState(8);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState({});
  const [modalImageLoading, setModalImageLoading] = useState(true);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://tourist-web-noln.onrender.com/api/gallery');
        const loadingStates = {};
        res.data.forEach(img => { loadingStates[img._id || img.url] = true; });
        setImageLoading(loadingStates);
        setImages(res.data);
        setLoading(false);
      } catch (err) {
        // Use translated error
        setError(t('errorLoadingGallery'));
        setLoading(false);
        console.error('Error fetching images:', err);
      }
    };
    fetchImages();
    // Add t dependency if error message relies on language
  }, [t]);

  const handleLoadMore = () => {
    setVisibleImages(prev => Math.min(prev + 8, images.length));
  };

  const getOptimizedImageUrl = (url, size = 'thumbnail') => {
    if (!url) return '';
    
    if (url.includes('cloudinary.com')) {
      // Đây là URL Cloudinary
      switch (size) {
        case 'thumbnail':
          // Ảnh thumbnail cho grid gallery
          return url.replace('/upload/', '/upload/c_fill,h_400,w_400/');
        case 'modal':
          // Ảnh full size cho modal
          return url.replace('/upload/', '/upload/c_limit,w_1200,h_800/');
        default:
          return url;
      }
    }
    
    // Nếu là URL cục bộ hoặc URL khác
    return url;
  };

  const handleImageLoad = (id) => {
    setImageLoading(prev => ({
      ...prev,
      [id]: false
    }));
  };

  const openModal = (image, index) => {
    // Nếu là đối tượng image có url
    const imageUrl = typeof image === 'object' && image.url ? image.url : image;
    // Lấy bản đầy đủ cho modal
    const optimizedImageUrl = getOptimizedImageUrl(imageUrl, 'modal');
    setCurrentImage(optimizedImageUrl);
    setCurrentIndex(index);
    setModalIsOpen(true);
    setModalImageLoading(true); // Reset loading state khi mở modal mới
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const navigateImages = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % visibleImages 
      : (currentIndex - 1 + visibleImages) % visibleImages;
      
    const newImage = images[newIndex];
    const newImageUrl = typeof newImage === 'object' && newImage.url ? newImage.url : newImage;
    setCurrentImage(getOptimizedImageUrl(newImageUrl, 'modal'));
    setCurrentIndex(newIndex);
    setModalImageLoading(true); // Reset loading state khi chuyển ảnh
  };

  // Xử lý phím mũi tên
  const handleKeyDown = useCallback((e) => {
    if (!modalIsOpen) return;
    
    if (e.key === 'ArrowRight') {
      navigateImages('next');
    } else if (e.key === 'ArrowLeft') {
      navigateImages('prev');
    } else if (e.key === 'Escape') {
      closeModal();
    }
  }, [modalIsOpen, currentIndex, images, visibleImages]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleDelete = async (id) => {
    // Use translated confirmation
    if (window.confirm(t('deleteImageConfirm'))) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://tourist-web-noln.onrender.com/api/admin/gallery/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        setImages(images.filter(img => img._id !== id));
      } catch (err) {
        console.error('Error deleting image:', err);
        // Use translated error alert
        alert(t('deleteImageError'));
      }
    }
  };

  if (loading) {
    return (
      <div className="gallery">
        <div className="section-header">
          {/* Use Text component */}
          <Text tag="span" className="section-subtitle" translationKey="ourJourney" />
          <Text tag="h2" className="section-title" translationKey="photoGallery" />
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          {/* Use Text component */}
          <Text tag="p" translationKey="loadingGallery" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery">
        <div className="section-header">
          {/* Use Text component */}
          <Text tag="span" className="section-subtitle" translationKey="ourJourney" />
          <Text tag="h2" className="section-title" translationKey="photoGallery" />
        </div>
        {/* Display translated error */}
        <div className="error">{error}</div>
      </div>
    );
  }

  // Phân loại ảnh để tạo masonry layout tốt hơn
  const organizeGalleryItems = () => {
    const columns = window.innerWidth > 1140 ? 3 : window.innerWidth > 768 ? 2 : 1;
    const galleryColumns = Array.from({ length: columns }, () => []);
    
    images.slice(0, visibleImages).forEach((image, index) => {
      const columnIndex = index % columns;
      galleryColumns[columnIndex].push(image);
    });
    
    return galleryColumns;
  };
  
  const galleryColumns = organizeGalleryItems();

  // Hàm xử lý khi ảnh modal đã load xong
  const handleModalImageLoad = () => {
    setModalImageLoading(false);
  };

  // Hàm xử lý khi ảnh modal bị lỗi
  const handleModalImageError = (e) => {
    console.error('Modal image failed to load');
    e.target.src = '/placeholder.jpg'; // Sử dụng ảnh placeholder
    setModalImageLoading(false);
  };

  return (
    <div className="gallery">
      <div className="section-header">
        {/* Use Text component */}
        <Text tag="span" className="section-subtitle" translationKey="ourJourney" />
        <Text tag="h2" className="section-title" translationKey="photoGallery" />
      </div>
      
      <div className="masonry-gallery">
        {galleryColumns.map((column, colIndex) => (
          <div className="masonry-column" key={`column-${colIndex}`}>
            {column.map((image, index) => {
              const imageId = image._id || `img-${colIndex}-${index}`;
              const imageUrl = typeof image === 'object' ? (image.url || image) : image;
              const isImageLoading = imageLoading[imageId] !== false;
              const globalIndex = colIndex * Math.ceil(visibleImages / galleryColumns.length) + index; // Calculate global index for modal
              
              return (
                <div 
                  className="gallery-item" 
                  key={imageId}
                  data-aos="fade-up"
                  data-aos-delay={100 + (index % 4) * 100}
                >
                  <div className="gallery-item-inner">
                    {isImageLoading && (
                      <div className="image-loading-placeholder">
                        <div className="image-spinner"></div>
                      </div>
                    )}
                    <img 
                      src={getOptimizedImageUrl(imageUrl, 'thumbnail')} 
                      // Use t() for alt text, providing default
                      alt={image.name ? t(image.name) : t('galleryImage', { index: globalIndex + 1 })}
                      onClick={() => openModal(image, globalIndex)} 
                      onLoad={() => handleImageLoad(imageId)}
                      loading="lazy"
                      style={{ opacity: isImageLoading ? 0 : 1 }}
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                        handleImageLoad(imageId);
                      }}
                    />
                    <div className="gallery-overlay">
                      <div className="gallery-info">
                        {/* Use Text component, providing default */}
                        <Text tag="h4" translationKey={image.name || `galleryImage_${globalIndex + 1}`}>{t('galleryImage', { index: globalIndex + 1 })}</Text>
                        <Text tag="span" translationKey={image.description || 'galleryDefaultDesc'}>{t('galleryDefaultDesc')}</Text>
                        <button className="view-btn" onClick={() => openModal(image, globalIndex)}>
                          <i className="fas fa-search-plus"></i>
                        </button>
                      </div>
                    </div>
                    
                    {isAuthenticated && (
                      <div className="gallery-admin-controls">
                        <button 
                          className="gallery-delete-btn" 
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
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {visibleImages < images.length && (
        <button className="load-more-btn" onClick={handleLoadMore}>
          {/* Use Text component */}
          <Text tag="span" translationKey="loadMore" />
          <i className="fas fa-chevron-down"></i>
        </button>
      )}
      
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="gallery-modal"
        overlayClassName="overlay"
      >
        <div className="modal-content">
          {modalImageLoading && (
            <div className="modal-loading-placeholder">
              <div className="modal-spinner"></div>
            </div>
          )}
          
          <img 
            src={currentImage} 
            alt="Gallery" 
            className="modal-image" 
            style={{ opacity: modalImageLoading ? 0 : 1 }}
            onLoad={handleModalImageLoad}
            onError={handleModalImageError}
          />
          
          <button className="modal-nav prev-btn" onClick={() => navigateImages('prev')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <button className="modal-nav next-btn" onClick={() => navigateImages('next')}>
            <i className="fas fa-chevron-right"></i>
          </button>
          
          <button className="close-modal" onClick={closeModal}>
            <i className="fas fa-times"></i>
          </button>
          
          <div className="image-counter">
            {currentIndex + 1} / {Math.min(visibleImages, images.length)}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Gallery;