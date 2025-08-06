import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  
  // History management state
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);
  const historyIndexRef = useRef(-1);

  // Initialize history with current pages state
  useEffect(() => {
    if (pages && pages.length > 0 && history.length === 0) {
      const initialState = JSON.parse(JSON.stringify(pages));
      setHistory([initialState]);
      setHistoryIndex(0);
      historyIndexRef.current = 0;
    }
  }, [pages, history.length]);

  // Keep ref in sync with state
  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  // Save state to history (called when page data changes)
  const saveToHistory = useCallback((newPages) => {
    if (isUndoRedoAction) return; // Don't save during undo/redo operations
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newPages)));
      
      // Limit history size to prevent memory issues (keep last 50 states)
      if (newHistory.length > 50) {
        newHistory.shift();
        setHistoryIndex(prev => Math.max(0, prev - 1));
        return newHistory;
      }
      
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [historyIndex, isUndoRedoAction]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setIsUndoRedoAction(true);
      
      // Apply the previous state
      const previousState = history[newIndex];
      if (onPageDataUpdate && previousState) {
        // Update all pages with previous state
        previousState.forEach(page => {
          onPageDataUpdate(page.id, page, true); // true flag indicates bulk update
        });
      }
      
      // Reset the flag after a brief delay
      setTimeout(() => setIsUndoRedoAction(false), 100);
    }
  }, [historyIndex, history, onPageDataUpdate]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setIsUndoRedoAction(true);
      
      // Apply the next state
      const nextState = history[newIndex];
      if (onPageDataUpdate && nextState) {
        // Update all pages with next state
        nextState.forEach(page => {
          onPageDataUpdate(page.id, page, true); // true flag indicates bulk update
        });
      }
      
      // Reset the flag after a brief delay
      setTimeout(() => setIsUndoRedoAction(false), 100);
    }
  }, [historyIndex, history, onPageDataUpdate]);

  // Enhanced page data update handler
  const handlePageDataUpdate = useCallback((pageId, updatedData, isBulkUpdate = false) => {
    if (onPageDataUpdate) {
      onPageDataUpdate(pageId, updatedData, isBulkUpdate);
      
      // Save to history only if it's not a bulk update (undo/redo)
      if (!isBulkUpdate && !isUndoRedoAction) {
        // Use current pages prop directly to get the most up-to-date state
        const updatedPages = pages.map(page => {
          if (page.id === pageId) {
            return { ...page, ...updatedData };
          }
          return page;
        });
        
        // Save to history immediately without setTimeout
        setHistory(prev => {
          const currentIndex = historyIndexRef.current;
          const newHistory = prev.slice(0, currentIndex + 1);
          newHistory.push(JSON.parse(JSON.stringify(updatedPages)));
          
          // Limit history size
          if (newHistory.length > 50) {
            newHistory.shift();
            const nextIndex = Math.max(0, newHistory.length - 1);
            setHistoryIndex(nextIndex);
            historyIndexRef.current = nextIndex;
            return newHistory;
          }
          
          const nextIndex = newHistory.length - 1;
          setHistoryIndex(nextIndex);
          historyIndexRef.current = nextIndex;
          return newHistory;
        });
      }
    }
  }, [onPageDataUpdate, pages, isUndoRedoAction]);

  // Check if undo/redo is available
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Add keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
      } else if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
        event.preventDefault();
        handleRedo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo, handleRedo]);

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

  // Handle wheel events on the entire right panel
  const handleWheel = useCallback((event) => {
    // Allow normal scrolling behavior
  }, []);

  // Preview handlers
  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  // Page component rendering
  const renderPageComponent = (page, pageNumber) => {
    const pageStyle = {
      position: 'relative',
      width: '100%',
      height: '100%',
    };

    let dayNumber = 1;
    if (page.type === 'day') {
      const currentPageIndex = pages.findIndex(p => p.id === page.id);
      const dayPagesBefore = pages.slice(0, currentPageIndex).filter(p => p.type === 'day').length;
      dayNumber = dayPagesBefore + 1;
    }

    const commonProps = {
      pageId: page.id,
      pageNumber: pageNumber,
      pageData: page,
      isPreview: false,
      ...(page.type === 'day' && { dayNumber }),
    };

    let pageProps;
    if (page.type === 'thankyou') {
      pageProps = {
        ...commonProps,
        onDataChange: (updatedData) => handlePageDataUpdate(page.id, updatedData)
      };
    } else {
      pageProps = {
        ...commonProps,
        onDataUpdate: (updatedData) => handlePageDataUpdate(page.id, updatedData)
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
        return 'FRONT PAGE'; // This ensures the cover page gets the correct title
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
      ref={scrollContainerRef}
      className="right-panel-scroll-container" // Add class for scroll targeting
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: '1 0 0',
        height: '100vh',
        overflow: 'auto',
        position: 'relative',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitScrollbar: 'none',
      }}
      onWheel={handleWheel}
    >
      <div
        style={{
          display: 'flex',
          width: '1088px',
          minHeight: '100vh',
          flexDirection: 'column',
          borderRadius: '32px 32px 0 0',
          overflow: 'visible',
        }}
      >
        {/* Control Section (Fixed at top) */}
        <div
          style={{
            display: 'flex',
            padding: '16px',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderRadius: '0',
            background: 'rgba(231, 233, 245, 0.92)',
            flexShrink: 0,
            zIndex: 10,
            position: 'fixed',
            top: 0,
            width: '1088px',
            backdropFilter: 'blur(50px)',
            WebkitBackdropFilter: 'blur(50px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{
                ...iconWrapper,
                opacity: canUndo ? 1 : 0.5,
                cursor: canUndo ? 'pointer' : 'not-allowed'
              }}
              onClick={canUndo ? handleUndo : undefined}
              title={canUndo ? 'Undo (Ctrl+Z)' : 'Nothing to undo'}
            >
              <img src={undo} alt="undo" draggable={false} style={{ userSelect: 'none' }} />
            </div>
            <div 
              style={{
                ...iconWrapper,
                opacity: canRedo ? 1 : 0.5,
                cursor: canRedo ? 'pointer' : 'not-allowed'
              }}
              onClick={canRedo ? handleRedo : undefined}
              title={canRedo ? 'Redo (Ctrl+Y)' : 'Nothing to redo'}
            >
              <img src={redo} alt="redo" draggable={false} style={{ userSelect: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{...buttonWrapper, cursor: 'pointer'}} onClick={handlePreviewClick}>
              <img style={icon} src={eye} alt="visibility" draggable={false} />
              <div style={divider}></div>
              <div style={label}>Preview</div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div
          style={{
            padding: '32px 0',
            paddingTop: '80px', // Add padding to avoid content being hidden by the fixed header
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 'calc(100vh - 80px)',
          }}
        >
          <div
            style={{
              width: '1088px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0px',
            }}
          >
            {/* RENDER ALL PAGES DYNAMICALLY */}
            {pages && pages.map((page, index) => (
              <div 
                key={page.id}
                ref={sectionRefs.current[page.id]}
                data-page-id={page.id} // CRITICAL: Add this attribute for scroll functionality
                className="page-component" // CRITICAL: Add this class for scroll functionality
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                  width: '100%',
                  marginBottom: '96px',
                }}
              >
                {/* ACTION ROW: Renders for ALL pages, including the Front Page */}
                <div style={actionRow}>
                  <div style={sectionTitle}>{getPageTitle(page)}</div>
                  <div style={{...downArrowIcon, cursor: 'pointer'}} onClick={navigateDown}>
                    <img src={forward} alt="down" draggable={false} style={{ userSelect: 'none' }} />
                  </div>
                  <div style={{...upArrowIcon, cursor: 'pointer'}} onClick={navigateUp}>
                    <img src={forward} alt="up" draggable={false} style={{ userSelect: 'none' }} />
                  </div>
                </div>

                {/* PAGE WRAPPER: Renders the specific page component below the action row */}
                <div style={page.type === 'cover' ? frontPageWrapper : dayPageWrapper}>
                  {renderPageComponent(page, index + 1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Overlay */}
      {showPreview && (
        <PreviewPane onClose={handleClosePreview} pages={pages} />
      )}

      {/* Global CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          div::-webkit-scrollbar { width: 0px; background: transparent; }
          div::-webkit-scrollbar-thumb { background: transparent; }
          @keyframes slideUpFromBottom {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
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

const label = {
  color: '#0E1328',
  fontFamily: 'Lato',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px',
  textTransform: 'uppercase',
  userSelect: 'none',
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
  transform: 'rotate(360deg)',
  aspectRatio: '1 / 1',
  userSelect: 'none',
};

const upArrowIcon = {
  width: '24px',
  height: '24px',
  transform: 'rotate(180deg)',
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
  flexShrink: 0,
  position: 'relative',
};

const dayPageWrapper = {
  display: 'flex',
  width: '1088px',
  height: '1540px',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexShrink: 0,
  position: 'relative',
  overflow: 'hidden',
};

export default RightPanel;
