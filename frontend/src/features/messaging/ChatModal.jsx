import React, { useState, useRef, useEffect } from 'react';
import ChatBox from './ChatBox';

const ChatModal = ({ isOpen, onClose, contextType, contextId, title, subtitle, receiverId }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      
      setPosition({
        x: initialPos.current.x + dx,
        y: initialPos.current.y + dy
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { ...position };
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '360px',
      height: '500px',
      maxHeight: 'calc(100vh - 40px)',
      backgroundColor: 'var(--color-bg-surface-elevated)',
      border: '1px solid var(--color-border)',
      borderRadius: '16px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      overflow: 'hidden',
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: isDragging ? 'none' : 'box-shadow 0.2s',
      userSelect: isDragging ? 'none' : 'auto'
    }}>
      <div 
        onMouseDown={handleMouseDown}
        style={{ 
        padding: '1rem', 
        background: 'var(--glass-bg)', 
        backdropFilter: 'var(--glass-blur)',
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--color-border)',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '10px', height: '10px', background: 'var(--color-success)', borderRadius: '50%' }}></div>
          <div>
            <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 700, color: 'white' }}>{title}</h2>
            {subtitle && (
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 500 }}>{subtitle}</p>
            )}
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
          style={{ 
            border: 'none', 
            background: 'var(--color-bg-surface)', 
            color: 'var(--color-text-primary)',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = 'var(--color-danger)'}
          onMouseOut={(e) => e.target.style.background = 'var(--color-bg-surface)'}
        >
          &times;
        </button>
      </div>
      
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: 'var(--color-bg-base)' }}>
        <ChatBox contextType={contextType} contextId={contextId} receiverId={receiverId} />
      </div>
    </div>
  );
};

export default ChatModal;
