// src/components/admin/GalleryForm.js
import React, { useState, useEffect, useRef } from 'react';

const GalleryForm = ({ image, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'gallery',
    imageFile: null,
    imagePreview: null
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Nếu có image được truyền vào (chế độ chỉnh sửa), cập nhật form
    if (image) {
      setFormData({
        name: image.name || '',
        description: image.description || '',
        type: image.type || 'gallery',
        imageFile: null,
        imagePreview: image.url || null
      });
    } else {
      // Reset form trong chế độ thêm mới
      setFormData({
        name: '',
        description: '',
        type: 'gallery',
        imageFile: null,
        imagePreview: null
      });
    }
  }, [image]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageFile: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>{image ? 'Cập nhật hình ảnh' : 'Thêm hình ảnh mới'}</h2>
      
      <div className="form-group">
        <label htmlFor="name">Tên hình ảnh</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Mô tả</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>
      
      <div className="form-group">
        <label htmlFor="type">Phân loại</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="gallery">Gallery</option>
          <option value="tour">Tour</option>
          <option value="destination">Điểm đến</option>
        </select>
      </div>
      
      {!image && (
        <div className="form-group">
          <label htmlFor="image">Tải lên hình ảnh</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            required={!image}
          />
        </div>
      )}
      
      {formData.imagePreview && (
        <div className="image-preview">
          <h3>Xem trước hình ảnh:</h3>
          <img 
            src={formData.imagePreview} 
            alt="Preview" 
            style={{ maxWidth: '300px', maxHeight: '200px' }} 
          />
        </div>
      )}
      
      <div className="btn-container">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Đang lưu...' : (image ? 'Cập nhật' : 'Thêm mới')}
        </button>
      </div>
    </form>
  );
};

export default GalleryForm;