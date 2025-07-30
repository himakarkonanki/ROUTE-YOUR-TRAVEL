import React, { useRef, useState, useEffect } from 'react';
import company from '../assets/icons/companyLogo.svg';
import dnd from '../assets/icons/do_not_disturb_on.svg';
import add from '../assets/icons/add_circle.svg';
import upload from '../assets/icons/upload_image.svg';
import TripDurationPicker from './TripDurationPicker';

function CoverPage({ pageId, pageNumber, pageData, isPreview = false, onDataUpdate }) {
    const [localData, setLocalData] = useState({
        backgroundImage: pageData?.backgroundImage || null,
        destinationName: pageData?.destinationName || '',
        adults: pageData?.adults || 0,
        children: pageData?.children || 0,
        tripDuration: pageData?.tripDuration || ''
    });

    const fileInputRef = useRef();

    // Update local state when pageData changes (for real-time preview updates)
    useEffect(() => {
        setLocalData({
            backgroundImage: pageData?.backgroundImage || null,
            destinationName: pageData?.destinationName || '',
            adults: pageData?.adults || 0,
            children: pageData?.children || 0,
            tripDuration: pageData?.tripDuration || ''
        });
    }, [pageData]);

    // Handle data changes and notify parent component
    const handleDataChange = (field, value) => {
        const updatedData = { ...localData, [field]: value };
        setLocalData(updatedData);

        // Notify parent component for real-time preview updates
        if (onDataUpdate) {
            onDataUpdate(updatedData);
        }
    };

    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert("File size exceeds 2MB limit.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            handleDataChange('backgroundImage', reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Handle trip duration updates from TripDurationPicker
    const handleTripDurationChange = (duration) => {
        handleDataChange('tripDuration', duration);
    };

    return (
        <div style={{
            display: 'flex',
            width: '1088px',
            height: '100%',
            minHeight: '1540px',
            padding: '64px 64px 0 64px',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.72) 100%), url(${localData.backgroundImage || ""})`,
            backgroundColor: '#0E1328',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '32px',
        }}>

            {/* Logo */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
                height: '90px',
            }}>
                <div style={{
                    display: 'flex',
                    width: '272px',
                    height: '90px',
                    padding: '16px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    aspectRatio: '136 / 45',
                    borderRadius: '16px',
                    background: 'rgba(14, 19, 40, 0.80)',
                }}>
                    <img src={company} alt="Company Logo" style={{
                        height: '46.918px',
                        flexShrink: 0,
                        alignSelf: 'stretch',
                        aspectRatio: '240 / 46.92',
                    }} />
                </div>
            </div>

            {/* Upload prompt (if no background and not in preview mode) */}
            {!localData.backgroundImage && !isPreview && (
                <div
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        display: 'flex',
                        width: '960px',
                        height: '600px',
                        padding: '360px 105px 24px 105px',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        border: '1px dashed rgba(255, 255, 255, 0.40)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                    }}
                >
                    <img src={upload} alt='upload' style={{ width: '64px', height: '64px' }} />
                    <div style={{ color: '#FFF', fontFamily: 'Lato', fontSize: '24px', fontWeight: 600 }}>
                        Add Background Image
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.64)', fontFamily: 'Roboto', fontSize: '14px' }}>
                        PNG, JPEG or SVG (Max. Documents size: 2 MB)
                    </div>
                </div>
            )}

            {/* Upload prompt for preview mode when no background */}
            {!localData.backgroundImage && isPreview && (
                <div style={{
                    display: 'flex',
                    width: '960px',
                    height: '600px',
                    padding: '360px 105px 24px 105px',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: '1px dashed rgba(255, 255, 255, 0.20)',
                    borderRadius: '12px',
                    opacity: 0.5
                }}>
                    <img src={upload} alt='upload' style={{ width: '64px', height: '64px', opacity: 0.5 }} />
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Lato', fontSize: '24px', fontWeight: 600 }}>
                        No Background Image
                    </div>
                </div>
            )}

            {/* Hidden file input - only show in edit mode */}
            {!isPreview && (
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                />
            )}

            {/* Main form area */}
            <div style={{
                display: 'flex',
                padding: '32px 32px 64px 32px',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '16px',
                alignSelf: 'stretch',
                borderRadius: '32px 32px 0 0',
                background: 'rgba(14, 19, 40, 0.80)',
                position: 'relative',
                boxSizing: 'border-box'
            }}>
                {/* Destination */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    alignSelf: 'stretch',
                }}>
                    <div style={{
                        display: 'flex',
                        padding: '8px 16px',
                        alignItems: 'center',
                        alignSelf: 'stretch',
                        borderRadius: '16px'
                    }}>
                        <div style={{
                            color: 'rgba(255, 255, 255, 0.70)',
                            fontFamily: 'Lato',
                            fontSize: '28px',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            lineHeight: '36px',
                        }}>
                            Trip to,
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        padding: '8px 16px',
                        alignItems: 'center',
                        alignSelf: 'stretch',
                    }}>
                        {isPreview ? (
                            // Read-only display for preview
                            <div style={{
                                flex: '1 0 0',
                                color: '#F33F3F',
                                fontFamily: 'Lato',
                                fontSize: '64px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                lineHeight: '80px',
                                textTransform: 'capitalize',
                                minHeight: '80px',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {localData.destinationName || 'Enter Destination'}
                            </div>
                        ) : (
                            // Editable input for right panel
                            <input
                                type="text"
                                id='destination_name'
                                name="destination"
                                value={localData.destinationName}
                                onChange={(e) => handleDataChange('destinationName', e.target.value)}
                                placeholder="Enter Destination"
                                style={{
                                    flex: '1 0 0',
                                    color: '#F33F3F',
                                    fontFamily: 'Lato',
                                    fontSize: '64px',
                                    fontStyle: 'normal',
                                    fontWeight: '400',
                                    lineHeight: '80px',
                                    textTransform: 'capitalize',
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Trip Duration */}
                <div style={{
                    display: 'flex',
                    padding: '8px 16px',
                    alignItems: 'center',
                    gap: '16px',
                    alignSelf: 'stretch',
                    borderRadius: '16px',
                    height: '64px'
                }}>
                    <div style={{
                        display: 'flex',
                        width: '22%',
                        height: '32px',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            color: "rgba(255, 255, 255, 0.70)",
                            fontFamily: "Lato",
                            fontSize: "24px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "32px"
                        }}>Trip Duration</div>
                    </div>

                    <TripDurationPicker
                        value={localData.tripDuration}
                        onChange={(val) => handleDataChange('tripDuration', val)}
                        isPreview={isPreview}
                    />

                </div>

                {/* Adults section */}
                <div style={{
                    display: "flex",
                    padding: "8px 16px",
                    alignItems: "center",
                    gap: "16px",
                    alignSelf: "stretch",
                    height: "64px",
                    borderRadius: "16px"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        width: "22%",
                        height: "64px"
                    }}>
                        <div style={{
                            color: "rgba(255, 255, 255, 0.70)",
                            fontFamily: "Lato",
                            fontSize: "24px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "32px",
                        }}>
                            Adults
                            <div style={{
                                color: "rgba(255, 255, 255, 0.50)",
                                fontFamily: "Lato",
                                fontSize: "24px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "32px",
                            }}>(Above 12 yrs)</div>
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        height: "64px",
                        width: "200px",
                        padding: "0 16px",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "16px",
                        borderRadius: "16px",
                        background: "rgba(242, 244, 254, 0.12)",
                    }}>
                        {!isPreview && (
                            <div
                                onClick={() => handleDataChange('adults', Math.max(0, localData.adults - 1))}
                                style={{ cursor: "pointer" }}
                            >
                                <img src={dnd} alt="minus" width={32} height={32} />
                            </div>
                        )}
                        <div style={{
                            color: "#FFF",
                            fontSize: "28px",
                            width: "64px",
                            textAlign: "center"
                        }}>
                            {localData.adults}
                        </div>
                        {!isPreview && (
                            <div
                                onClick={() => handleDataChange('adults', localData.adults + 1)}
                                style={{ cursor: "pointer" }}
                            >
                                <img src={add} alt="plus" width={32} height={32} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Children section */}
                <div style={{
                    display: "flex",
                    padding: "8px 16px",
                    alignItems: "center",
                    gap: "16px",
                    alignSelf: "stretch",
                    height: "64px",
                    borderRadius: "16px"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        width: "22%",
                        height: "64px"
                    }}>
                        <div style={{
                            color: "rgba(255, 255, 255, 0.70)",
                            fontFamily: "Lato",
                            fontSize: "24px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "32px",
                        }}>
                            Children
                            <div style={{
                                color: "rgba(255, 255, 255, 0.50)",
                                fontFamily: "Lato",
                                fontSize: "24px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "32px",
                            }}>(Below 12 yrs)</div>
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        height: "64px",
                        width: "200px",
                        padding: "0 16px",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "16px",
                        borderRadius: "16px",
                        background: "rgba(242, 244, 254, 0.12)",
                    }}>
                        {!isPreview && (
                            <div
                                onClick={() => handleDataChange('children', Math.max(0, localData.children - 1))}
                                style={{ cursor: "pointer" }}
                            >
                                <img src={dnd} alt="minus" width={32} height={32} />
                            </div>
                        )}
                        <div style={{
                            color: "#FFF",
                            fontSize: "28px",
                            width: "64px",
                            textAlign: "center"
                        }}>
                            {localData.children}
                        </div>
                        {!isPreview && (
                            <div
                                onClick={() => handleDataChange('children', localData.children + 1)}
                                style={{ cursor: "pointer" }}
                            >
                                <img src={add} alt="plus" width={32} height={32} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Note container */}
                <div style={{
                    display: "flex",
                    padding: "16px",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    alignSelf: "stretch",
                    borderRadius: "16px",
                    minHeight: "32px",
                    marginBottom: "20px",
                }}>
                    <div style={{
                        color: "#9D0D0F99",
                        fontFamily: "Lato",
                        fontSize: "24px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "32px",
                        alignSelf: "stretch",
                    }}>
                        Note: Children should be below 12 yrs of age on the date of travel
                    </div>
                </div>

                {/* Footer Section */}
                <div style={{
                    display: "flex",
                    padding: "0 16px",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    gap: "20px",
                    alignSelf: "stretch",
                }}>
                    <div style={{
                        height: "1px",
                        alignSelf: "stretch",
                        borderRadius: "2px",
                        background: "rgba(255, 255, 255, 0.12)"
                    }}></div>

                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "2px",
                        alignSelf: "stretch"
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            alignSelf: "stretch",
                        }}>
                            <div style={{
                                color: "rgba(255, 255, 255, 0.50)",
                                fontFamily: "Lato",
                                fontSize: "20px",
                                fontStyle: "italic",
                                fontWeight: 400,
                                lineHeight: "36px",
                            }}>
                                Prepared by, Route Your Travel on Feb 26, 2025.
                            </div>
                            <div style={{
                                color: "rgba(255, 255, 255, 0.50)",
                                fontFamily: "Lato",
                                fontSize: "20px",
                                fontStyle: "italic",
                                fontWeight: 400,
                                lineHeight: "36px",
                            }}>
                                Version 1.0
                            </div>
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            alignSelf: "stretch",
                        }}>
                            <div style={{
                                color: "rgba(255, 255, 255, 0.50)",
                                fontFamily: "Lato",
                                fontSize: "20px",
                                fontStyle: "italic",
                                fontWeight: 400,
                                lineHeight: "36px",
                            }}>
                                ** Terms and Conditions Apply
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoverPage;
