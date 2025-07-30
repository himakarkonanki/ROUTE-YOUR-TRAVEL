// ThumbnailGenerator.jsx
import React from 'react';
import FrontPage from './FrontPage';
import DayPage from './DayPage';
import ThankYouPage from './ThankYouPage';
import PolicyPage from './PolicyPage';

function ThumbnailGenerator({ pageType, style }) {
  const renderPageContent = () => {
    switch (pageType) {
      case 'cover':
        return <FrontPage />;
      case 'day':
        return <DayPage />;
      case 'policy':
        return <PolicyPage />;
      case 'thankyou':
        return <ThankYouPage />;
      default:
        return <div>Unknown page type</div>;
    }
  };

  return (
    <div
      style={{
        ...style,
        transform: 'scale(0.37)', // Scale down to fit thumbnail size (1088px -> ~28px)
        transformOrigin: 'top left',
        width: '1088px',
        height: '1540px',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {renderPageContent()}
    </div>
  );
}

export default ThumbnailGenerator;
