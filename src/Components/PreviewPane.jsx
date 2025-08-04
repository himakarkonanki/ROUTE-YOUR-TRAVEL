import React, { useRef, useState } from 'react'
import close from '../assets/icons/close.svg'
import dnd from '../assets/icons/do_not_disturb_on.svg'
import download from '../assets/icons/download.svg'
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
                <div style={{ display: 'flex', padding: '0 24px', flexDirection: 'column', alignItems: 'flex-start', gap: '24px', flex: '1 0 0', alignSelf: 'stretch', background: '#FFF', borderRadius: '32px 32px 0 0' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        padding: '24px 12px 0 12px',
                        minHeight: '56px',
                        boxSizing: 'border-box',
                        position: 'relative'
                    }}>
                        {/* Left: Heading */}
                        <div style={{
                            flex: '1 0 0',
                            display: 'flex',
                            alignItems: 'center',
                            minWidth: 0
                        }}>
                            <div style={{
                                color: '#11121F',
                                fontFamily: 'Lato',
                                fontSize: '20px',
                                fontWeight: 600,
                                lineHeight: '24px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>
                                Itinerary Preview
                            </div>
                        </div>

                        {/* Center: Zoom + Download */}
                        <div style={{
                            flex: '0 0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            height: '40px'
                        }}>
                            {/* Zoom Controls */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(14, 19, 40, 0.04)',
                                borderRadius: '16px',
                                height: '40px',
                                padding: '0 12px'
                            }}>
                                {/* Zoom Out */}
                                <div
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: zoomLevel > zoomLevels[0] ? 'pointer' : 'not-allowed',
                                        opacity: zoomLevel > zoomLevels[0] ? 1 : 0.5,
                                        borderRadius: '4px',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={zoomLevel > zoomLevels[0] ? zoomOut : undefined}
                                    title="Zoom Out"
                                >
                                    <img src={dnd} alt="zoom-out" />
                                </div>
                                {/* Zoom Value */}
                                <div style={{
                                    minWidth: '52px',
                                    textAlign: 'center',
                                    fontFamily: 'Lato',
                                    fontSize: '18px',
                                    fontWeight: 500,
                                    color: '#11121F',
                                    cursor: 'pointer',
                                    lineHeight: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }} onClick={resetZoom} title="Reset Zoom (Click to fit)">
                                    {zoomLevel}%
                                </div>
                                {/* Zoom In */}
                                <div
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: zoomLevel < zoomLevels[zoomLevels.length - 1] ? 'pointer' : 'not-allowed',
                                        opacity: zoomLevel < zoomLevels[zoomLevels.length - 1] ? 1 : 0.5,
                                        borderRadius: '4px',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={zoomLevel < zoomLevels[zoomLevels.length - 1] ? zoomIn : undefined}
                                    title="Zoom In"
                                >
                                    <img src={add} alt="zoom-in" />
                                </div>
                            </div>

                            {/* Download PDF Button */}
                            <div
                                style={{
                                    borderRadius: '24px',
                                    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.30)), #3874FF',
                                    display: 'flex',
                                    height: '40px',
                                    padding: '0 16px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
                                    opacity: isGeneratingPDF ? 0.5 : 1,
                                }}
                                onClick={isGeneratingPDF ? undefined : downloadAsPDF}
                                title="Download as PDF"
                            >
                                <img src={download} alt="download-icon" style={{ width: '24px', height: '24px' }} />
                                <span style={{
                                    color: '#FFF',
                                    fontFamily: 'Lato',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                }}>
                                    {isGeneratingPDF ? 'Generating...' : 'Download as PDF'}
                                </span>
                            </div>
                        </div>

                        {/* Right: Close Button */}
                        <div style={{
                            flex: '1 0 0',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            minWidth: 0
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '28px',
                                background: 'rgba(0, 0, 0, 0.08)',
                                cursor: 'pointer'
                            }} onClick={onClose}>
                                <img src={close} alt="close icon" style={{ width: '24px', height: '24px' }} />
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
