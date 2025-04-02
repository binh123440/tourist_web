import React, { useState } from 'react';
import './GalleryStyle.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Gallery = () => {
  const allImages = [
    '1.jpg',
    '2.webp',
    '3.jpg',
    'founder.jpg',
    '1.jpg',
    '2.webp',
    '3.jpg',
    'founder.jpg',
    '1.jpg',
    '2.webp',
    '3.jpg',
    'founder.jpg'
  ];

  const [visibleImages, setVisibleImages] = useState(8);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const handleLoadMore = () => {
    setVisibleImages(allImages.length);
  };

  const openModal = (image) => {
    setCurrentImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="gallery">
      <h2>Thư viện ảnh</h2>
      <div className="gallery-grid">
        {allImages.slice(0, visibleImages).map((image, index) => (
          <div className="gallery-item" key={index} onClick={() => openModal(image)}>
            <img src={image} alt={`Gallery ${index + 1}`} />
          </div>
        ))}
      </div>
      {visibleImages < allImages.length && (
        <button className="load-more" onClick={handleLoadMore}>Xem thêm</button>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="gallery-modal"
        overlayClassName="overlay"
      >
        <img src={currentImage} alt="Current" className="modal-image" />
      </Modal>
    </div>
  );
};

export default Gallery;