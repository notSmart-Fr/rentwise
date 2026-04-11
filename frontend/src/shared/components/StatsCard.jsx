import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, color = 'blue' }) => {
  return (
    <div className={`stats-card ${color}`}>
      <div className="stats-card-icon">
        {icon}
      </div>
      <div className="stats-card-content">
        <h3 className="stats-card-value">{value}</h3>
        <p className="stats-card-title">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
