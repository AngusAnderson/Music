import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../css/context_menu/context_menu.css'

const ContextMenu = ({ children, items = [], className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    const x = e.pageX;
    const y = e.pageY;
    // Edge detection: adjust if near viewport edges
    const adjustedX = x + 200 > window.innerWidth ? x - 200 : x;
    const adjustedY = y + 150 > window.innerHeight ? y - 150 : y;
    setPosition({ x: adjustedX, y: adjustedY });
    setIsVisible(true);
  }, []);

  const handleItemClick = useCallback((onClick) => {
    setIsVisible(false);
    onClick?.();
  }, []);

  const handleHide = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        handleHide();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleHide();
    };

    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';  // Optional: prevent scroll
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isVisible, handleHide, handleClickOutside, handleKeyDown]);

  return (
    <div className={className} onContextMenu={handleContextMenu}>
      {children}
      {isVisible && (
        <ul
          ref={menuRef}
          className="context-menu"
          style={{
            position: 'fixed',
            top: `${position.y}px`,
            left: `${position.x}px`,
            zIndex: 9999,
          }}
          role="menu"
          tabIndex={-1}
        >
          {items.map((item, index) => (
            <li
              key={item.id || index}
              className="context-menu-item"
              role="menuitem"
              onClick={() => handleItemClick(item.onClick)}
            >
              {item.icon && <span className="item-icon">{item.icon}</span>}
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContextMenu;