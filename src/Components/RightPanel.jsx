import React, { useRef, useEffect, useState } from 'react';
import FrontPage from './FrontPage';
import undo from '../assets/icons/undo.svg';
import redo from '../assets/icons/redo.svg';
import eye from '../assets/icons/visibility.svg';
import download from '../assets/icons/download.svg';
import forward from '../assets/icons/arrow_forward_ios.svg';
import DayPage from './DayPage';
import ThankYouPage from './ThankYouPage';
import PolicyPage from './PolicyPage';
import Footer from './Footer';
import PreviewPane from './PreviewPane';

function RightPanel({ pages, onPageDataUpdate }) {
  const scrollContainerRef = useRef(null);
  const sectionRefs = useRef({});
  const [showPreview, setShowPreview] = useState(false);

  // Create refs for each page dynamically
  useEffect(() => {
    pages.forEach(page => {
      if (!sectionRefs.current[page.id]) {
        sectionRefs.current[page.id] = React.createRef();
      }
    });
  }, [pages]);

  // Function to find current visible section
  const getCurrentSectionIndex = () => {
    const container = scrollContainerRef.current;
    if (!container) return 0;

    const containerTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const viewportCenter = containerTop + containerHeight / 2;

    for (let i = 0; i < pages.length; i++) {
      const section = sectionRefs.current[pages[i].id]?.current;
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (viewportCenter >= sectionTop && viewportCenter <= sectionBottom) {
          return i;
        }
      }
    }
    return 0;
  };

  // Navigation functions
  const scrollToSection = (index) => {
    if (index >= 0 && index < pages.length) {
      const pageId = pages[index].id;
      const section = sectionRefs.current[pageId]?.current;
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const navigateUp = () => {
    const currentIndex = getCurrentSectionIndex();
    const previousIndex = Math.max(0, currentIndex - 1);
    scrollToSection(previousIndex);
  };

  const navigateDown = () => {
    const currentIndex = getCurrentSectionIndex();
    const nextIndex = Math.min(pages.length - 1, currentIndex + 1);
    scrollToSection(nextIndex);
  };

  // Preview handlers
  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  // FIXED: Page component rendering with correct prop names for all components
  const renderPageComponent = (page, pageNumber) => {
    const pageStyle = {
      position: 'relative',
      width: '100%',
      height: '100%',
    };

    // Create a unified props object that works for all page types
    const commonProps = {
      pageId: page.id,
      pageNumber: pageNumber,
      pageData: page,
      isPreview: false,
    };

    // Add the update handler with the correct prop name based on page type
    let pageProps;
    if (page.type === 'thankyou') {
      // ThankYouPage expects onDataChange
      pageProps = {
        ...commonProps,
        onDataChange: (updatedData) => {
          if (onPageDataUpdate) {
            onPageDataUpdate(page.id, updatedData);
          }
        }
      };
    } else {
      // Other pages expect onDataUpdate
      pageProps = {
        ...commonProps,
        onDataUpdate: (updatedData) => {
          if (onPageDataUpdate) {
            onPageDataUpdate(page.id, updatedData);
          }
        }
      };
    }

    let pageContent;
    
    switch (page.type) {
      case 'cover':
        pageContent = <FrontPage {...pageProps} />;
        break;
      case 'day':
        pageContent = <DayPage {...pageProps} />;
        break;
      case 'policy':
        pageContent = <PolicyPage {...pageProps} />;
        break;
      case 'thankyou':
        pageContent = <ThankYouPage {...pageProps} />;
        break;
      default:
        pageContent = <div>Unknown page type</div>;
        break;
    }

    // Only show footer for non-cover and non-thankyou pages
    const shouldShowFooter = page.type !== 'cover' && page.type !== 'thankyou';

    return (
      <div style={pageStyle}>
        {pageContent}
        {shouldShowFooter && <Footer pageNumber={pageNumber} />}
      </div>
    );
  };

  // Get page title based on type
  const getPageTitle = (page) => {
    switch (page.type) {
      case 'cover':
        return 'COVER PAGE';
      case 'day':
        return 'DAY PAGE';
      case 'policy':
        return 'POLICY PAGE';
      case 'thankyou':
        return 'THANK YOU PAGE';
      default:
        return page.title?.toUpperCase() || 'UNKNOWN PAGE';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: '1 0 0',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '1088px',
          height: '100vh',
          flexDirection: 'column',
          borderRadius: '32px 32px 0 0',
          overflow: 'hidden',
        }}
      >
        {/* Control Section (Fixed) */}
        <div
          style={{
            display: 'flex',
            padding: '16px',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderRadius: '0 0 32px 32px',
            background: 'rgba(231, 233, 245, 0.92)',
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          {/* Undo/Redo Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={iconWrapper}>
              <img 
                src={undo} 
                alt="undo" 
                draggable={false}
                style={{ userSelect: 'none' }}
              />
            </div>
            <div style={iconWrapper}>
              <img 
                src={redo} 
                alt="redo" 
                draggable={false}
                style={{ userSelect: 'none' }}
              />
            </div>
          </div>

          {/* Preview + Download Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{...buttonWrapper, cursor: 'pointer'}}
              onClick={handlePreviewClick}
            >
              <img 
                style={icon} 
                src={eye} 
                alt="visibility" 
                draggable={false}
              />
              <div style={divider}></div>
              <div style={label}>Preview</div>
            </div>
            <div style={downloadButton}>
              <img 
                style={icon} 
                src={download} 
                alt="download-icon" 
                draggable={false}
              />
              <div style={dividerWhite}></div>
              <div style={labelWhite}>Download</div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area with Dynamic Pages */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: 'none',
            padding: '32px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Content Container */}
          <div
            style={{
              width: '1088px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0px',
            }}
          >
            {/* Render all pages dynamically with page numbers */}
            {pages && pages.map((page, index) => (
              <div 
                key={page.id}
                ref={sectionRefs.current[page.id]}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                  width: '100%',
                  marginBottom: '96px',
                }}
              >
                <div style={actionRow}>
                  <div style={sectionTitle}>{getPageTitle(page)}</div>
                  {/* Down arrow - rotated 90deg clockwise to point down */}
                  <div 
                    style={{...downArrowIcon, cursor: 'pointer'}}
                    onClick={navigateDown}
                  >
                    <img 
                      src={forward} 
                      alt="down" 
                      draggable={false}
                      style={{ userSelect: 'none' }}
                    />
                  </div>
                  {/* Up arrow - rotated 270deg (or -90deg) to point up */}
                  <div 
                    style={{...upArrowIcon, cursor: 'pointer'}}
                    onClick={navigateUp}
                  >
                    <img 
                      src={forward} 
                      alt="up" 
                      draggable={false}
                      style={{ userSelect: 'none' }}
                    />
                  </div>
                </div>

                <div style={page.type === 'cover' ? frontPageWrapper : dayPageWrapper}>
                  {/* Pass the current page number (index + 1) with complete data */}
                  {renderPageComponent(page, index + 1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Overlay */}
      {showPreview && (
        <PreviewPane 
          onClose={handleClosePreview}
          pages={pages}
        />
      )}

      {/* Global CSS with animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          div::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
          
          div::-webkit-scrollbar-thumb {
            background: transparent;
          }
          
          @keyframes slideUpFromBottom {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `
      }} />
    </div>
  );
}

// Style objects remain the same
const iconWrapper = {
  display: 'flex',
  width: '48px',
  height: '48px',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '24px',
  background: '#F2F4FE',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
};

const buttonWrapper = {
  display: 'flex',
  height: '48px',
  padding: '0 16px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  borderRadius: '24px',
  background: '#F2F4FE',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
};

const downloadButton = {
  display: 'flex',
  height: '48px',
  padding: '0 16px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  borderRadius: '24px',
  background:
    'linear-gradient(0deg, rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.30)), linear-gradient(89deg, #8B23F3 0%, #F33F3F 92.8%)',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
};

const icon = {
  width: '24px',
  height: '24px',
  aspectRatio: '1 / 1',
  userSelect: 'none',
};

const divider = {
  width: '1px',
  height: '24px',
  borderRadius: '2px',
  background: 'rgba(14, 19, 40, 0.08)',
};

const dividerWhite = {
  width: '1px',
  height: '24px',
  borderRadius: '2px',
  background: 'rgba(255, 255, 255, 0.16)',
};

const label = {
  color: '#0E1328',
  fontFamily: 'Lato',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px',
  textTransform: 'uppercase',
  userSelect: 'none',
};

const labelWhite = {
  ...label,
  color: '#FFF',
};

const actionRow = {
  display: 'flex',
  padding: '8px',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
};

const sectionTitle = {
  flex: '1 0 0',
  color: 'rgba(14, 19, 40, 0.80)',
  fontFamily: 'Lato',
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: '27px',
  userSelect: 'none',
};

const downArrowIcon = {
  width: '24px',
  height: '24px',
  transform: 'rotate(90deg)', // Points down
  aspectRatio: '1 / 1',
  userSelect: 'none',
};

const upArrowIcon = {
  width: '24px',
  height: '24px',
  transform: 'rotate(-90deg)', // Points up
  aspectRatio: '1 / 1',
  userSelect: 'none',
};

const frontPageWrapper = {
  display: 'flex',
  width: '1088px',
  height: '1540px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  aspectRatio: '272/385',
  borderRadius: '32px',
  flexShrink: 0,
  position: 'relative',
};

const dayPageWrapper = {
  display: 'flex',
  width: '1088px',
  minHeight: '1540px',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexShrink: 0,
  position: 'relative',
};

export default RightPanel;
