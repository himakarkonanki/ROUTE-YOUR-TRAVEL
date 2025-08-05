import React from 'react';

// This component renders a miniature version of a page based on its type and data
function PagePreview({ page }) {
  if (!page) return null;

  switch (page.type) {
    case 'cover':
      return (
        <div style={{
          width: '100%',
          height: '100%',
          background: page.backgroundImage ? `url(${page.backgroundImage}) center/cover` : '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 12,
          color: '#333',
        }}>
          {page.title || 'Cover Page'}
        </div>
      );
    case 'day':
      return (
        <div style={{
          width: '100%',
          height: '100%',
          background: page.uploadedImage ? `url(${page.uploadedImage}) center/cover` : '#e0f7fa',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          color: '#222',
        }}>
          <div style={{ fontWeight: 600 }}>{page.title || 'Day Page'}</div>
          <div style={{ fontSize: 8, opacity: 0.7 }}>{page.description || ''}</div>
        </div>
      );
    case 'thankyou':
      return (
        <div style={{
          width: '100%',
          height: '100%',
          background: '#fffbe7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 12,
          color: '#b8860b',
        }}>
          {page.title || 'Thank You!'}
        </div>
      );
    default:
      return (
        <div style={{
          width: '100%',
          height: '100%',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          color: '#888',
        }}>
          {page.title || 'Page'}
        </div>
      );
  }
}

export default PagePreview;
