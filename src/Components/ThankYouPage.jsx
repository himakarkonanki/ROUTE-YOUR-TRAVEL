import React, { useState, useEffect } from 'react';
import _path from '../assets/icons/_Path_.svg';
import Thankyou from '../assets/icons/Thankthumbnail.svg';
import Footer from './Footer';

const ThankYouPage = ({ pageId, pageNumber, pageData, onDataChange, isPreview = false, totalPages }) => {
    const [base64Image, setBase64Image] = useState('');
    const [localData, setLocalData] = useState({
        thankYouTitle: '',
        thankYouMessage: '',
        phoneNumber: '',
        emailAddress: '',
        websiteOrInstagram: ''
    });

    // Sync local state with pageData
    useEffect(() => {
        if (pageData) {
            setLocalData({
                thankYouTitle: pageData.thankYouTitle || '',
                thankYouMessage: pageData.thankYouMessage || '',
                phoneNumber: pageData.phoneNumber || '',
                emailAddress: pageData.emailAddress || '',
                websiteOrInstagram: pageData.websiteOrInstagram || ''
            });
        }
    }, [pageData]);

      
    
      useEffect(() => {
        fetch(Thankyou)
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              setBase64Image(reader.result); // ✅ base64 string
            };
            reader.readAsDataURL(blob);
          });
      }, []);

    // Handle data changes and immediately notify parent
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
    const phoneId = `phoneNumber-${uniqueId}`;
    const emailId = `emailAddress-${uniqueId}`;
    const websiteId = `websiteOrInstagram-${uniqueId}`;

    return (

        <div style={{
            width: '1088px',
            height: '1540px',
            flexShrink: 0,
            aspectRatio: '272 / 385',
            
        }}>
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
                                    {localData.thankYouTitle || 'Thank You!'}
                                </div>
                            ) : (
                                // Edit mode - input field
                                <input
                                    type="text"
                                    id={titleId}
                                    value={localData.thankYouTitle}
                                    onChange={(e) => handleDataChange('thankYouTitle', e.target.value)}
                                    placeholder="Thank You!"
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
                                    {localData.thankYouMessage || 'Enter Some thank you greeting'}
                                </div>
                            ) : (
                                // Edit mode - textarea
                                <textarea
                                    value={localData.thankYouMessage}
                                    id={messageId}
                                    onChange={(e) => handleDataChange('thankYouMessage', e.target.value)}
                                    placeholder="Enter Some thank you greeting"
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

                        {/* Contact Details - Individual Fields */}
                        <div
                            style={{ // footer details
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: '8px',
                                alignSelf: 'stretch',
                                opacity: 0.42,
                            }}
                        >
                            {/* Phone Number Field */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    alignSelf: 'stretch',
                                }}
                            >
                                {isPreview ? (
                                    <div style={{
                                        color: localData.phoneNumber ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.50)',
                                        fontFamily: 'Lato',
                                        fontSize: '24px',
                                        fontStyle: 'italic',
                                        fontWeight: 400,
                                        lineHeight: '36px',
                                        flex: '1 0 0',
                                        wordWrap: 'break-word',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {localData.phoneNumber || '[Phone Number]'}
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        id={phoneId}
                                        value={localData.phoneNumber}
                                        onChange={(e) => handleDataChange('phoneNumber', e.target.value)}
                                        placeholder="[Phone Number]"
                                        style={{
                                            color: localData.phoneNumber ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.50)',
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

                            {/* Email Address Field */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    alignSelf: 'stretch',
                                }}
                            >
                                {isPreview ? (
                                    <div style={{
                                        color: localData.emailAddress ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.50)',
                                        fontFamily: 'Lato',
                                        fontSize: '24px',
                                        fontStyle: 'italic',
                                        fontWeight: 400,
                                        lineHeight: '36px',
                                        flex: '1 0 0',
                                        wordWrap: 'break-word',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {localData.emailAddress || '[Email Address]'}
                                    </div>
                                ) : (
                                    <input
                                        type="email"
                                        id={emailId}
                                        value={localData.emailAddress}
                                        onChange={(e) => handleDataChange('emailAddress', e.target.value)}
                                        placeholder="[Email Address]"
                                        style={{
                                            color: localData.emailAddress ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.50)',
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

                            {/* Website or Instagram Handle Field */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    alignSelf: 'stretch',
                                }}
                            >
                                {isPreview ? (
                                    <div style={{
                                        color: localData.websiteOrInstagram ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.50)',
                                        fontFamily: 'Lato',
                                        fontSize: '24px',
                                        fontStyle: 'italic',
                                        fontWeight: 400,
                                        lineHeight: '36px',
                                        flex: '1 0 0',
                                        wordWrap: 'break-word',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {localData.websiteOrInstagram || '[Website or Instagram Handle]'}
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        id={websiteId}
                                        value={localData.websiteOrInstagram}
                                        onChange={(e) => handleDataChange('websiteOrInstagram', e.target.value)}
                                        placeholder="[Website or Instagram Handle]"
                                        style={{
                                            color: localData.websiteOrInstagram ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.50)',
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

                <div style={{
                    width: '1090px',
                    height: '685px',
                    boxSizing: 'border-box',
                    marginTop: '700px',
                    // marginBottom: '70.5px',
                    // // marginLeft: '-100px',
                    // // marginRight: '-90px',
                    overflow: 'hidden',      
                    position: 'relative'
                }}>
                    <img src={base64Image} alt="Thank You"/>
                </div>

                {/* Footer - UPDATED: Pass totalPages or calculate correct page number */}
                <Footer pageNumber={totalPages || pageNumber} />
            </div>



        </div>
    );
};

export default ThankYouPage;
