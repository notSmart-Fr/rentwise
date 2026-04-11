import React from 'react';

const InboxRow = ({ conversation, onClick }) => {
  const { 
    other_participant_name, 
    context_title, 
    last_message, 
    last_message_at, 
    unread_count 
  } = conversation;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time, else show date
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div 
      className={`inbox-row glass-panel ${unread_count > 0 ? 'unread' : ''}`} 
      onClick={() => onClick(conversation)}
    >
      <div className="inbox-avatar">
        {other_participant_name.charAt(0).toUpperCase()}
      </div>
      
      <div className="inbox-content">
        <div className="inbox-header">
          <span className="inbox-name">{other_participant_name}</span>
          <span className="inbox-time">{formatDate(last_message_at)}</span>
        </div>
        
        <div className="inbox-context">{context_title}</div>
        
        <div className="inbox-footer">
          <p className="inbox-preview">{last_message || 'Start a conversation...'}</p>
          {unread_count > 0 && (
            <span className="unread-badge">{unread_count}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxRow;
