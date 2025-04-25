// src/components/admin/TourForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminStyles.css';

const TourForm = ({ tour, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    date: '',
    destination: '',
    title: '',
    image: '',
    description: '',
    link: ''
  });
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    // Nếu có tour được truyền vào, điền vào form
    if (tour) {
      setFormData({
        date: tour.date || '',
        destination: tour.destination || '',
        title: tour.title || '',
        image: tour.image || '',
        description: tour.description || '',
        link: tour.link || ''
      });
      
      // Nếu có hình ảnh, hiển thị preview
      if (tour.image) {
        setImagePreview(tour.image.startsWith('http') ? tour.image : `http://localhost:5000${tour.image}`);
      }
    }

    // Lấy danh sách destinations
    const fetchDestinations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/destinations');
        setDestinations(res.data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
      }
    };

    fetchDestinations();
  }, [tour]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Cập nhật preview nếu thay đổi URL hình ảnh
    if (name === 'image') {
      setImagePreview(value.startsWith('http') ? value : `http://localhost:5000${value}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onSubmit(formData);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>{tour ? 'Cập nhật Tour' : 'Thêm Tour Mới'}</h2>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">Tiêu đề</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Nhập tiêu đề tour"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="destination">Điểm đến</label>
          <select
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn điểm đến --</option>
            {destinations.map(dest => (
              <option key={dest._id} value={dest.name}>
                {dest.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Ngày</label>
          <input
            type="text"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            placeholder="VD: 20/12/2024 - 30/12/2024"
          />
          <div className="form-text">Định dạng: DD/MM/YYYY - DD/MM/YYYY</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="link">Link (sử dụng để tạo URL)</label>
          <input
            type="text"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            required
            placeholder="VD: vietnam1, bhutan2"
          />
          <div className="form-text">URL sẽ là: /tour-detail/{formData.link}</div>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="image">URL Hình ảnh</label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
          placeholder="VD: /vietnam.jpg hoặc https://example.com/image.jpg"
        />
      </div>
      
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'cover' }} />
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="description">Mô tả</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Nhập mô tả ngắn về tour"
        ></textarea>
      </div>
      
      <div className="btn-container">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Đang lưu...' : (tour ? 'Cập nhật' : 'Thêm mới')}
        </button>
      </div>
    </form>
  );
};

export default TourForm;