import React, { useState } from 'react';
// Assuming teamMembers have keys now
import { teamMembers } from './TeamMemberItems.js';
import './TeamMemberStyle.css';
// Remove TranslatedText import
// import TranslatedText from './TranslatedText';
import { useLanguage } from '../context/LanguageContext';
import Text from './Text'; // Import Text component

const TeamMember = () => {
  // Get t function
  const { t } = useLanguage();
  const [expandedMember, setExpandedMember] = useState({});

  const handleToggleDescription = (memberId) => {
    setExpandedMember(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const gridClassName = teamMembers.length === 1 ? "team-grid single-member" : "team-grid";

  return (
    <div className="meet-the-team" id="team-member-section">
      <div className="section-header">
        {/* Use Text component */}
        <Text tag="span" className="section-subtitle" translationKey="teamSubtitle" />
        <Text tag="h2" className="section-title" translationKey="teamTitle" />
      </div>

      <div className={gridClassName}>
        {/* Assuming teamMembers array has nameKey, positionKey, descriptionKey */}
        {teamMembers.map((member, index) => (
          <div
            className="team-member"
            key={index}
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="team-card">
              <div className="team-image">
                {/* Use t() for alt text */}
                <img src={member.image} alt={member.nameKey ? t(member.nameKey) : member.name} />
                <div className="member-social">
                  {/* Social links remain the same */}
                  <a href={member.socialLinks?.facebook || '#'} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                  <a href={member.socialLinks?.twitter || '#'} target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                  <a href={member.socialLinks?.linkedin || '#'} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                  <a href={member.socialLinks?.instagram || '#'} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                </div>
              </div>

              <div className="team-info">
                {/* Use Text component */}
                <Text tag="h3" translationKey={member.nameKey || member.name} />
                <Text tag="span" className="position" translationKey={member.positionKey || member.position} />

                <div className="team-bio">
                  <div className={`bio-content ${expandedMember[index] ? 'expanded' : ''}`}>
                    {/* Use Text component */}
                    <Text translationKey={member.descriptionKey || member.description} />
                  </div>

                  {/* Check description length based on translated content if needed, or keep simple check */}
                  {(member.descriptionKey || member.description) && (member.descriptionKey ? t(member.descriptionKey) : member.description).length > 150 && (
                    <div className="toggle-container">
                      <button
                        className="expand-toggle"
                        onClick={() => handleToggleDescription(index)}
                        aria-label={t(expandedMember[index] ? "collapseAria" : "viewMoreAria")}
                        type="button"
                      >
                        {/* Use Text component */}
                        <Text translationKey={expandedMember[index] ? 'collapse' : 'viewMore'} />
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