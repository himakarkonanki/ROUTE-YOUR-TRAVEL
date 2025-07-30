import React, { useState, useEffect } from 'react';
import logo from '../assets/icons/companyLogo.svg';
import _path from '../assets/icons/_Path_.svg';
import Footer from './Footer';

const ThankYouPage = ({ pageId, pageNumber, pageData, onDataChange, isPreview = false }) => {
    const [localData, setLocalData] = useState({
        thankYouTitle: '',
        thankYouMessage: '',
        contactDetails: ''
    });

    // Sync local state with pageData
    useEffect(() => {
        if (pageData) {
            setLocalData({
                thankYouTitle: pageData.thankYouTitle || '',
                thankYouMessage: pageData.thankYouMessage || '',
                contactDetails: pageData.contactDetails || ''
            });
        }
    }, [pageData]);

    // UPDATED: Handle data changes and immediately notify parent
    const handleDataChange = (field, value) => {
        if (isPreview) return; // Prevent changes in preview mode
        
        const updatedData = { ...localData, [field]: value };
        setLocalData(updatedData);

        // Immediately call the parent's update function
        if (onDataChange) {
            onDataChange(updatedData);
        }
    };

    // Generate unique IDs based on pageId or pageNumber
    const uniqueId = pageId || `thankyou-${pageNumber || Date.now()}`;
    const titleId = `thankYouTitle-${uniqueId}`;
    const messageId = `thankYouMessage-${uniqueId}`;
    const contactId = `contacts-${uniqueId}`;

    return (
        <div // wrap
            style={{
                display: 'flex',
                width: '1088px',
                minHeight: '1540px',
                padding: '0 64px',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '32px',
                flexShrink: 0,
                background: '#0E1328',
                position: 'relative',
                borderRadius: '32px',
            }}
        >
            <div
                style={{ // container
                    display: 'flex',
                    width: '960px',
                    padding: '32px 32px 64px 32px',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '16px',
                    position: 'absolute',
                    left: '64px',
                    top: '100px',
                    borderRadius: '32px 32px 0 0',
                    background: 'rgba(14, 19, 40, 0.80)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                {/* Title Section */}
                <div
                    style={{ // Title
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        alignSelf: 'stretch',
                    }}
                >
                    <div
                        style={{ // span
                            display: 'flex',
                            padding: '8px 16px',
                            alignItems: 'center',
                            alignSelf: 'stretch',
                            borderRadius: '16px'
                        }}
                    >
                        {/* Page indicator or label can go here if needed */}
                    </div>

                    <div
                        style={{ // cover title
                            display: 'flex',
                            width: '896px',
                            padding: '8px 16px',
                            alignItems: 'center',
                            borderRadius: '16px',
                        }}
                    >
                        {isPreview ? (
                            // Preview mode - static text
                            <div style={{
                                flex: '1 0 0',
                                color: localData.thankYouTitle ? '#F33F3F' : 'rgba(243, 63, 63, 0.24)',
                                fontFamily: 'Lato',
                                fontSize: '64px',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                lineHeight: '80px',
                                textTransform: 'capitalize',
                                wordWrap: 'break-word',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {localData.thankYouTitle || 'Thank You'}
                            </div>
                        ) : (
                            // Edit mode - input field
                            <input
                                type="text"
                                id={titleId}
                                value={localData.thankYouTitle}
                                onChange={(e) => handleDataChange('thankYouTitle', e.target.value)}
                                placeholder="Thank You"
                                style={{
                                    flex: '1 0 0',
                                    color: localData.thankYouTitle ? '#F33F3F' : 'rgba(243, 63, 63, 0.24)',
                                    fontFamily: 'Lato',
                                    fontSize: '64px',
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    lineHeight: '80px',
                                    textTransform: 'capitalize',
                                    border: 'none',
                                    outline: 'none',
                                    background: 'transparent',
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Message Section */}
                <div // Details
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        alignSelf: 'stretch',
                    }}
                >
                    <div
                        style={{ // span
                            display: 'flex',
                            padding: '8px 16px',
                            alignItems: 'flex-start',
                            alignSelf: 'stretch',
                            borderRadius: '12px',
                        }}
                    >
                        {isPreview ? (
                            // Preview mode - static text
                            <div style={{
                                color: localData.thankYouMessage ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.24)',
                                fontFamily: 'Lato',
                                fontSize: '28px',
                                fontStyle: 'italic',
                                fontWeight: 400,
                                lineHeight: '36px',
                                flex: '1 0 0',
                                minHeight: '150px',
                                wordWrap: 'break-word',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {localData.thankYouMessage || 'Enter your thank you message here...'}
                            </div>
                        ) : (
                            // Edit mode - textarea
                            <textarea
                                value={localData.thankYouMessage}
                                id={messageId}
                                onChange={(e) => handleDataChange('thankYouMessage', e.target.value)}
                                placeholder="Enter your thank you message here..."
                                rows={6}
                                style={{
                                    color: localData.thankYouMessage ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.24)',
                                    fontFamily: 'Lato',
                                    fontSize: '28px',
                                    fontStyle: 'italic',
                                    fontWeight: 400,
                                    lineHeight: '36px',
                                    flex: '1 0 0',
                                    border: 'none',
                                    outline: 'none',
                                    background: 'transparent',
                                    resize: 'vertical',
                                    minHeight: '150px',
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Contact Details Section */}
                <div
                    style={{
                        display: 'flex',
                        padding: '0 16px',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        gap: '20px',
                        alignSelf: 'stretch',
                    }}
                >
                    {/* Divider */}
                    <div
                        style={{
                            height: '1px',
                            alignSelf: 'stretch',
                            borderRadius: '2px',
                            background: 'rgba(255, 255, 255, 0.12)',
                        }}
                    />

                    {/* Contact Details */}
                    <div
                        style={{ // footer details
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '4px',
                            alignSelf: 'stretch',
                            opacity: 0.42,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                alignSelf: 'stretch',
                            }}
                        >
                            {isPreview ? (
                                // Preview mode - static text
                                <div style={{
                                    color: localData.contactDetails ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.50)',
                                    fontFamily: 'Lato',
                                    fontSize: '24px',
                                    fontStyle: 'italic',
                                    fontWeight: 400,
                                    lineHeight: '36px',
                                    flex: '1 0 0',
                                    wordWrap: 'break-word',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {localData.contactDetails || '[Phone Number] [Email Address] [Website or Instagram Handle]'}
                                </div>
                            ) : (
                                // Edit mode - input field
                                <input
                                    type="text"
                                    id={contactId}
                                    value={localData.contactDetails}
                                    onChange={(e) => handleDataChange('contactDetails', e.target.value)}
                                    placeholder="[Phone Number] [Email Address] [Website or Instagram Handle]"
                                    style={{
                                        color: localData.contactDetails ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.50)',
                                        fontFamily: 'Lato',
                                        fontSize: '24px',
                                        fontStyle: 'italic',
                                        fontWeight: 400,
                                        lineHeight: '36px',
                                        flex: '1 0 0',
                                        border: 'none',
                                        outline: 'none',
                                        background: 'transparent',
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ThankYouPage;
