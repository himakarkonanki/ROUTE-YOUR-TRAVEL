import React from 'react';
import PagePreview from './PagePreview';

// Renders a scaled-down live preview of the page
function ThumbnailGenerator({ page }) {
  return (
    <div style={{
      width: '200px',
      height: '200px',
      overflow: 'hidden',
      background: '#fff',
      borderRadius: 8,
      position: 'relative',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    }}>
      <div style={{
        width: '288px', // virtual page width
        height: '100px', // virtual page height
        transform: 'scale(0.2)', // scale down to fit 40x56px
        transformOrigin: 'top left',
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
      }}>
        <PagePreview page={page} />
      </div>
    </div>
  );
}

export default ThumbnailGenerator;
