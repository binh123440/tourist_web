import React, { useState } from 'react';
import { teamMembers } from './TeamMemberItems.js';
import './TeamMemberStyle.css';

const TeamMember = () => {
  const [expandedMember, setExpandedMember] = useState({});
  
  // Xử lý toggle cho từng member độc lập bằng ID
  const handleToggleDescription = (memberId) => {
    setExpandedMember(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };
  
  // Thêm class đặc biệt khi chỉ có 1 thành viên
  const gridClassName = teamMembers.length === 1 ? "team-grid single-member" : "team-grid";

  return (
    <div className="meet-the-team" id="team-member-section">
      <div className="section-header">
        <span className="section-subtitle">Đội ngũ chuyên nghiệp</span>
        <h2 className="section-title">ĐỘI NGŨ CỦA LOTUS VOYAGES</h2>
      </div>
      
      <div className={gridClassName}>
        {teamMembers.map((member, index) => (
          <div 
            className="team-member"
            key={index}
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="team-card">
              <div className="team-image">
                <img src={member.image} alt={member.name} />
                <div className="member-social">
                  <a href={member.socialLinks?.facebook || '#'} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href={member.socialLinks?.twitter || '#'} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href={member.socialLinks?.linkedin || '#'} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href={member.socialLinks?.instagram || '#'} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
              
              <div className="team-info">
                <h3>{member.name}</h3>
                <span className="position">{member.position}</span>
                
                <div className="team-bio">
                  {/* Sử dụng div thay vì p để tránh issues với nested elements */}
                  <div className={`bio-content ${expandedMember[index] ? 'expanded' : ''}`}>
                    {member.description}
                  </div>
                  
                  {member.description && member.description.length > 150 && (
                    <div className="toggle-container">
                      <button 
                        className="expand-toggle" 
                        onClick={() => handleToggleDescription(index)}
                        aria-label={expandedMember[index] ? "Thu gọn thông tin" : "Xem thêm thông tin"}
                        type="button"
                      >
                        {expandedMember[index] ? 'Thu gọn' : 'Xem thêm'}
                        <i className={`fas fa-chevron-${expandedMember[index] ? 'up' : 'down'}`}></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMember;