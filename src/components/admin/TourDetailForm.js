// src/components/admin/TourDetailForm.js
import React from 'react';

const TourDetailForm = ({ tourDetail, onSubmit, onCancel }) => {
  return (
    <div className="tour-detail-form">
      <h2>Form Quản lý Chi tiết Tour</h2>
      <p>Form này sẽ được phát triển sau</p>
      <button onClick={onCancel}>Hủy</button>
    </div>
  );
};

export default TourDetailForm;