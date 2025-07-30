import React from 'react'
import close from '../assets/icons/close.svg'
import dnd from '../assets/icons/do_not_disturb_on.svg'
import add from '../assets/icons/add_circle.svg'
import FrontPage from './FrontPage'
import DayPage from './DayPage'
import PolicyPage from './PolicyPage'
import ThankYouPage from './ThankYouPage'
import Footer from './Footer'

function PreviewPane({ onClose, pages }) {
    // Function to render page component based on type
    const renderPageComponent = (page, pageNumber) => {

        let dayNumber = 1;
        if (page.type === 'day') {
            const currentPageIndex = pages.findIndex(p => p.id === page.id);
            const dayPagesBefore = pages.slice(0, currentPageIndex).filter(p => p.type === 'day').length;
            dayNumber = dayPagesBefore + 1;

            // DEBUG: Add this line to see what's happening
            console.log(`Page ID: ${page.id}, Index: ${currentPageIndex}, Day Number: ${dayNumber}`);
        }
        // Pass the entire page data to each component, not just pageId
        const pageProps = {
            pageId: page.id,
            pageNumber: pageNumber,
            pageData: page, // Pass the entire page object with all data
            isPreview: true,
            ...(page.type === 'day' && { dayNumber }), // Flag to indicate this is preview mode
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

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000, background: '#E7E9F5', animation: 'slideUpFromBottom 0.3s ease-out forwards' }}>
            <div style={{ display: 'flex', width: '100%', height: '100%', paddingTop: '64px', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.60)' }}>
                <div style={{ display: 'flex', width: '1680px', maxWidth: '100%', height: 'calc(100% - 64px)', flexDirection: 'column', alignItems: 'flex-start', gap: '24px', flexShrink: 0, alignSelf: 'stretch', borderRadius: '48px 48px 0 0', background: '#FFF' }}>
                    <div style={{ display: 'flex', padding: '0 24px', flexDirection: 'column', alignItems: 'flex-start', gap: '24px', flex: '1 0 0', alignSelf: 'stretch', background: '#FFF' }}>
                        {/* Header section */}
                        <div style={{ display: 'flex', alignItems: 'center', padding: '24px 12px 0 12px', width: '100%', position: 'relative' }}>
                            <div style={{ color: '#11121F', fontFamily: 'Lato', fontSize: '24px', fontStyle: 'normal', fontWeight: 600, lineHeight: '36px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: '1 1 0' }}>
                                Itinerary Preview
                            </div>

                            {/* Zoom Controls */}
                            <div style={{ display: 'flex', height: '40px', padding: '8px 12px', justifyContent: 'center', alignItems: 'center', gap: '8px', borderRadius: '16px', background: 'rgba(14, 19, 40, 0.04)', position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)' }}>
                                <div style={{ width: '24px', height: '24px', aspectRatio: '1 / 1' }}>
                                    <img src={dnd} alt='dnd' />
                                </div>
                                <div style={{ width: '1px', height: '24px', borderRadius: '2px', background: 'rgba(0, 0, 0, 0.16)' }} />
                                <div style={{ display: 'flex', padding: '0 4px', justifyContent: 'center', alignItems: 'center' }}>
                                    <div style={{ width: '64px', color: '#000', textAlign: 'center', fontFamily: 'Lato', fontSize: '20px', fontStyle: 'normal', fontWeight: 400, lineHeight: '150%' }}>
                                        50%
                                    </div>
                                </div>
                                <div style={{ width: '1px', height: '24px', borderRadius: '2px', background: 'rgba(0, 0, 0, 0.16)' }} />
                                <div style={{ width: '24px', height: '24px', aspectRatio: '1 / 1', cursor: 'pointer' }}>
                                    <img src={add} alt='add-icon' />
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
                            <div style={{ display: 'flex', padding: '32px', flexDirection: 'column', alignItems: 'center', gap: '24px', flex: '1 0 0', alignSelf: 'stretch', borderRadius: '24px 24px 0 0', background: '#EEF0F3', overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
                                <div style={{ display: 'flex', width: '1088px', maxWidth: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}>
                                    {/* Render all pages dynamically */}
                                    {pages && pages.map((page, index) => (
                                        <div key={page.id} style={{ display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', flexShrink: 0, alignSelf: 'stretch', borderRadius: '16px', overflow: 'hidden', background: '#FFF', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                                            {/* Render the actual page content without additional wrapper styles */}
                                            {renderPageComponent(page, index + 1)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreviewPane