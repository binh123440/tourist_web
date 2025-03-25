import React from 'react';
import { teamMembers } from './TeamMemberItems.js';
import './TeamMemberStyle.css';


const TeamMember = () => {
  return (
    <div className="meet-the-team">
      <h2>Đội ngũ của Lotus Voyages</h2>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div className="team-member" key={index}>
            <div className="team-image">
              <img src={member.image} alt={member.name} />
            </div>
            <h3>{member.name}</h3>
            <p>{member.description}</p>
            <input className='expand-btn' type='checkbox'></input> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMember;