import React, { useRef, useState } from 'react'
import close from '../assets/icons/close.svg'
import dnd from '../assets/icons/do_not_disturb_on.svg'
import add from '../assets/icons/add_circle.svg'
import FrontPage from './FrontPage'
import DayPage from './DayPage'
import PolicyPage from './PolicyPage'
import ThankYouPage from './ThankYouPage'
import { PDFGenerator } from './pdf/PDFGenerator'

function PreviewPane({ onClose, pages }) {
    const pagesContainerRef = useRef(null);
    const [zoomLevel, setZoomLevel] = useState(75);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const scrollContainerRef = useRef(null);

    // Zoom level options
    const zoomLevels = [50, 67, 75, 90, 100, 125, 150, 175, 200];

    // Zoom functions
    const zoomIn = () => {
        const currentIndex = zoomLevels.findIndex(level => level === zoomLevel);
        if (currentIndex < zoomLevels.length - 1) {
            setZoomLevel(zoomLevels[currentIndex + 1]);
        }
    };

    const zoomOut = () => {
        const currentIndex = zoomLevels.findIndex(level => level === zoomLevel);
        if (currentIndex > 0) {
            setZoomLevel(zoomLevels[currentIndex - 1]);
        }
    };

    // Reset zoom to fit
    const resetZoom = () => {
        setZoomLevel(50);
    };

    // Function to render page component based on type
    const renderPageComponent = (page, pageNumber) => {
        let dayNumber = 1;
        if (page.type === 'day') {
            const currentPageIndex = pages.findIndex(p => p.id === page.id);
            const dayPagesBefore = pages.slice(0, currentPageIndex).filter(p => p.type === 'day').length;
            dayNumber = dayPagesBefore + 1;

            console.log(`Page ID: ${page.id}, Index: ${currentPageIndex}, Day Number: ${dayNumber}`);
        }

        const pageProps = {
            pageId: page.id,
            pageNumber: pageNumber,
            pageData: page,
            isPreview: true,
            ...(page.type === 'day' && { dayNumber }),
        };

        switch (page.type) {
            case 'cover':
                return <FrontPage {...pageProps} />;
            case 'day':
                return <DayPage {...pageProps} />;
            case 'policy':
                return <PolicyPage {...pageProps} />;
            case 'thankyou':
                return <ThankYouPage {...pageProps} />;
            default:
                return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: 'Lato', fontSize: '18px', color: '#666' }}>Unknown page type</div>;
        }
    };

    // PDF Download Function using separated PDFGenerator
    const downloadAsPDF = async () => {
        if (!pages || pages.length === 0) {
            alert('No pages to download');
            return;
        }

        if (isGeneratingPDF) {
            console.log('PDF generation already in progress...');
            return;
        }

        setIsGeneratingPDF(true);

        try {
            await PDFGenerator.generateAndDownload({
                pages,
                pagesContainerRef: pagesContainerRef.current,
                onProgress: (message) => console.log(message)
            });
        } catch (error) {
            console.error('Error generating PDF:', error);
            
            let errorMessage = 'Error generating PDF. Please try again.';
            
            if (error.name === 'AbortError') {
                errorMessage = 'PDF generation timed out. Please try again with fewer pages or simpler content.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Cannot connect to PDF service. Please ensure the backend server is running on port 5000.';
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            
            alert(errorMessage);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000, background: 'transparent', animation: 'slideUpFromBottom 0.3s ease-out forwards' }}>
            <div style={{ display: 'flex', width: '100%', height: '100%', paddingTop: '64px', justifyContent: 'center', alignItems: 'center', background: 'transparent' }}>
                <div style={{ display: 'flex', padding: '0 24px', flexDirection: 'column', alignItems: 'flex-start', gap: '24px', flex: '1 0 0', alignSelf: 'stretch', background: '#FFF' ,borderRadius:'32px 32px 0 0' }}>
                    {/* Header section */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', padding: '24px 12px 0 12px', width: '100%', position: 'relative' }}>
                        <div style={{ color: '#11121F', fontFamily: 'Lato', fontSize: '24px', fontStyle: 'normal', fontWeight: 600, lineHeight: '36px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: '1 1 0' }}>
                            Itinerary Preview
                        </div>

                        {/* Enhanced Controls with Zoom Functionality */}
                        <div style={{ display: 'flex', height: '40px', padding: '8px 12px', justifyContent: 'center', alignItems: 'center', gap: '8px', borderRadius: '16px', background: 'rgba(14, 19, 40, 0.04)', position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)' }}>
                            {/* Zoom Out Button */}
                            <div 
                                style={{ 
                                    width: '24px', 
                                    height: '24px', 
                                    aspectRatio: '1 / 1',
                                    cursor: zoomLevel > zoomLevels[0] ? 'pointer' : 'not-allowed',
                                    opacity: zoomLevel > zoomLevels[0] ? 1 : 0.5,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '4px',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={zoomLevel > zoomLevels[0] ? zoomOut : undefined}
                                onMouseEnter={(e) => {
                                    if (zoomLevel > zoomLevels[0]) {
                                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                title="Zoom Out"
                            >
                                <img src={dnd} alt='zoom-out' />
                            </div>

                            <div style={{ width: '1px', height: '24px', borderRadius: '2px', background: 'rgba(0, 0, 0, 0.16)' }} />

                            {/* Zoom Level Display with Reset on Click */}
                            <div 
                                style={{ 
                                    display: 'flex', 
                                    padding: '0 4px', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    transition: 'background 0.2s ease'
                                }}
                                onClick={resetZoom}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                title="Reset Zoom (Click to fit)"
                            >
                                <div style={{ width: '64px', color: '#000', textAlign: 'center', fontFamily: 'Lato', fontSize: '20px', fontStyle: 'normal', fontWeight: 400, lineHeight: '150%' }}>
                                    {zoomLevel}%
                                </div>
                            </div>

                            <div style={{ width: '1px', height: '24px', borderRadius: '2px', background: 'rgba(0, 0, 0, 0.16)' }} />

                            {/* Zoom In Button */}
                            <div 
                                style={{ 
                                    width: '24px', 
                                    height: '24px', 
                                    aspectRatio: '1 / 1',
                                    cursor: zoomLevel < zoomLevels[zoomLevels.length - 1] ? 'pointer' : 'not-allowed',
                                    opacity: zoomLevel < zoomLevels[zoomLevels.length - 1] ? 1 : 0.5,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '4px',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={zoomLevel < zoomLevels[zoomLevels.length - 1] ? zoomIn : undefined}
                                onMouseEnter={(e) => {
                                    if (zoomLevel < zoomLevels[zoomLevels.length - 1]) {
                                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                title="Zoom In"
                            >
                                <img src={add} alt='zoom-in' />
                            </div>

                            <div style={{ width: '1px', height: '24px', borderRadius: '2px', background: 'rgba(0, 0, 0, 0.16)' }} />

                            {/* Download PDF Button */}
                            <div 
                                style={{ 
                                    width: '24px', 
                                    height: '24px', 
                                    aspectRatio: '1 / 1', 
                                    cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
                                    opacity: isGeneratingPDF ? 0.5 : 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '4px',
                                    transition: 'background 0.2s ease'
                                }}
                                onClick={!isGeneratingPDF ? downloadAsPDF : undefined}
                                onMouseEnter={(e) => {
                                    if (!isGeneratingPDF) {
                                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                title={isGeneratingPDF ? "Generating PDF..." : "Download as PDF"}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.979 19.804 4.587 19.412C4.195 19.02 3.99934 18.5493 4 18V15H6V18H18V15H20V18C20 18.55 19.804 19.021 19.412 19.413C19.02 19.805 18.5493 20.0007 18 20H6Z" fill="currentColor"/>
                                </svg>
                            </div>
                        </div>

                        {/* Close Button */}
                        <div style={{ display: 'flex', width: '48px', height: '48px', paddingTop: '2px', justifyContent: 'center', alignItems: 'center', aspectRatio: '1 / 1', borderRadius: '28px', background: 'rgba(0, 0, 0, 0.08)', cursor: 'pointer', marginLeft: 'auto' }} onClick={onClose}>
                            <div style={{ width: '24px', height: '24px', flexShrink: 0, aspectRatio: '1 / 1' }}>
                                <img src={close} alt='close icon' />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '24px', flex: '1 0 0', alignSelf: 'stretch' }}>
                        {/* Scrollable container with zoom applied */}
                        <div 
                            ref={scrollContainerRef}
                            style={{ 
                                display: 'flex', 
                                padding: '32px', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: '24px', 
                                flex: '1 0 0', 
                                alignSelf: 'stretch', 
                                borderRadius: '24px 24px 0 0', 
                                background: '#EEF0F3', 
                                overflowY: 'auto', 
                                overflowX: 'auto',
                                maxHeight: 'calc(100vh - 150px)' 
                            }}
                        >
                            {/* Pages container with zoom transformation */}
                            <div 
                                ref={pagesContainerRef}
                                style={{ 
                                    display: 'flex', 
                                    width: '1088px', 
                                    maxWidth: 'none',
                                    flexDirection: 'column', 
                                    alignItems: 'flex-start', 
                                    gap: '24px',
                                    transform: `scale(${zoomLevel / 100})`,
                                    transformOrigin: 'center top',
                                    transition: 'transform 0.3s ease'
                                }}
                            >
                                {/* Render all pages dynamically */}
                                {pages && pages.map((page, index) => (
                                    <div 
                                        key={page.id} 
                                        className="pdf-page"
                                        data-page-id={page.id}
                                        style={{ 
                                            display: 'flex', 
                                            width: '100%', 
                                            flexDirection: 'column', 
                                            justifyContent: 'flex-start', 
                                            alignItems: 'center', 
                                            flexShrink: 0, 
                                            alignSelf: 'stretch', 
                                            borderRadius: '0',
                                            overflow: 'visible', 
                                            background: '#FFF', 
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                                        }}
                                    >
                                        {/* Render the actual page content */}
                                        {renderPageComponent(page, index + 1)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global styles */}
            <style jsx="true" global="true">{`
                /* Custom scrollbar for zoom container */
                div[style*="overflowY: auto"]::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                div[style*="overflowY: auto"]::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 4px;
                }
                
                div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 4px;
                }
                
                div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.3);
                }

                /* Animation for the preview pane */
                @keyframes slideUpFromBottom {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    )
}

export default PreviewPane
