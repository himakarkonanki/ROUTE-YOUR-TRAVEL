import React, { useState } from 'react';
import add from '../assets/icons/add_circle_blue.svg';
import remove from '../assets/icons/close.svg';
import titleIcon from '../assets/icons/Title.svg';
import tableIcon from '../assets/icons/table.svg';

function Toolbar({ onInsertTitle, onInsertTable }) {
  const [trayOpen, setTrayOpen] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        left: '-30px',
        top: '8px',
        display: 'inline-flex',
        flexDirection: 'column',
        padding: '12px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px',
        borderRadius: '28px',
        background: 'rgba(14, 19, 40, 0.06)',
      }}
    >
      <style>{`
        .toolbar-btn {
          width: 28px;
          height: 28px;
          background: #F4F6FA;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: background 0.15s;
        }
        .toolbar-btn:hover {
          background: #0E1328;
        }
        .toolbar-btn img {
          filter: none;
          transition: filter 0.15s;
        }
        .toolbar-btn:hover img {
          filter: brightness(0) invert(1);
        }
      `}</style>
      {/* Toggle Button */}
      <div
        style={{
          width: '23px',
          height: '23px',
          cursor: 'pointer',
        }}
        onClick={() => setTrayOpen(!trayOpen)}
      >
        <img src={trayOpen ? remove : add} alt="Toggle" />
      </div>

      {/* Tray Options */}
      {trayOpen && (
        <>
          {/* Title Button */}
          <div
            className="toolbar-btn"
            onClick={onInsertTitle}
          >
            <img src={titleIcon} alt="Title" width="16" height="16" />
          </div>

          {/* Table Button */}
          <div
            className="toolbar-btn"
            onClick={onInsertTable}
          >
            <img src={tableIcon} alt="Table" width="16" height="16" />
          </div>
        </>
      )}
    </div>
  );
}

export default Toolbar;
