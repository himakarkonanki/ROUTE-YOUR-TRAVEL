import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import company from '../assets/icons/companyLogo.svg';
import dnd from '../assets/icons/do_not_disturb_on_grey.svg';
import add from '../assets/icons/add_circle_grey.svg';
import upload from '../assets/icons/upload_image.svg';
import TripDurationPicker from './TripDurationPicker';

function CoverPage({ pageId, pageNumber, pageData, isPreview = false, onDataUpdate }) {
    const [base64Image, setBase64Image] = useState('');
    const [localData, setLocalData] = useState({
        backgroundImage: pageData?.backgroundImage || null,
        destinationName: pageData?.destinationName || '',
        adults: pageData?.adults || 0,
        children: pageData?.children || 0,
        tripDuration: pageData?.tripDuration || ''
    });

    const fileInputRef = useRef();

    // Memoize unique IDs to prevent recreation on every render
    const uniqueIds = useMemo(() => ({
        fileInput: `file-input-${pageId || 'default'}`,
        destinationInput: `destination-input-${pageId || 'default'}`,
        tripDurationContainer: `trip-duration-${pageId || 'default'}`,
        adultsContainer: `adults-container-${pageId || 'default'}`,
        childrenContainer: `children-container-${pageId || 'default'}`,
        adultsMinusBtn: `adults-minus-${pageId || 'default'}`,
        adultsPlusBtn: `adults-plus-${pageId || 'default'}`,
        childrenMinusBtn: `children-minus-${pageId || 'default'}`,
        childrenPlusBtn: `children-plus-${pageId || 'default'}`
    }), [pageId]);

    // Memoize styles to prevent recreation
    const styles = useMemo(() => ({
        container: {
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
        },
        logoContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            height: '90px',
        },
        logoWrapper: {
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
        },
        logo: {
            height: '46.918px',
            flexShrink: 0,
            alignSelf: 'stretch',
            aspectRatio: '240 / 46.92',
        },
        uploadPrompt: {
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
        },
        uploadPromptPreview: {
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
        },
        mainForm: {
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
        },
        sectionContainer: {
            display: 'flex',
            padding: '8px 16px',
            alignItems: 'center',
            gap: '16px',
            alignSelf: 'stretch',
            borderRadius: '16px',
            height: '64px',
        },
        labelContainer: {
            display: 'flex',
            width: '210px',
            height: '32px',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        labelContainerTall: {
            display: "flex",
            alignItems: "center",
            width: "210px",
            height: "64px",
            justifyContent: 'space-between'
        },
        labelText: {
            color: "rgba(255, 255, 255, 0.70)",
            fontFamily: "Lato",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "32px"
        },
        colon: {
            color: "rgba(255, 255, 255, 0.70)",
            fontFamily: "Lato",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "32px",
        },
        counter: {
            display: "flex",
            height: "64px",
            width: "200px",
            padding: "0 16px",
            justifyContent: isPreview ? "flex-start" : "center",
            alignItems: "center",
            gap: "16px",
            borderRadius: "16px",
            background: isPreview ? "transparent" : "rgba(242, 244, 254, 0.12)",
        },
        adultsCounterText: {
            color: localData.adults === 0 ? "rgba(242, 244, 254, 0.12)" : "#FFFFFF",
            fontSize: "28px",
            width: isPreview ? "auto" : "64px",
            textAlign: isPreview ? "left" : "center",
            fontFamily: 'Lato',
            fontWeight: 400,
            lineHeight: '36px',
        },
        childrenCounterText: {
            color: localData.children === 0 ? "rgba(242, 244, 254, 0.12)" : "#FFFFFF",
            fontSize: "28px",
            width: isPreview ? "auto" : "64px",
            textAlign: isPreview ? "left" : "center",
            fontFamily: 'Lato',
            fontWeight: 400,
            lineHeight: '36px',
        }
    }), [localData.backgroundImage, localData.adults, localData.children, isPreview]);

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

    useEffect(() => {
        fetch(company)
            .then((res) => res.blob())
            .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setBase64Image(reader.result);
                };
                reader.readAsDataURL(blob);
            });
    }, []);

    // Memoize callback to prevent unnecessary re-renders
    const handleDataChange = useCallback((field, value) => {
        const updatedData = { ...localData, [field]: value };
        setLocalData(updatedData);

        // Notify parent component for real-time preview updates
        if (onDataUpdate) {
            onDataUpdate(updatedData);
        }
    }, [localData, onDataUpdate]);

    // Memoize file upload handler
    const handleUpload = useCallback((e) => {
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
    }, [handleDataChange]);

    // Memoize counter handlers
    const handleAdultsDecrease = useCallback(() => {
        handleDataChange('adults', Math.max(0, localData.adults - 1));
    }, [handleDataChange, localData.adults]);

    const handleAdultsIncrease = useCallback(() => {
        handleDataChange('adults', localData.adults + 1);
    }, [handleDataChange, localData.adults]);

    const handleChildrenDecrease = useCallback(() => {
        handleDataChange('children', Math.max(0, localData.children - 1));
    }, [handleDataChange, localData.children]);

    const handleChildrenIncrease = useCallback(() => {
        handleDataChange('children', localData.children + 1);
    }, [handleDataChange, localData.children]);

    // Memoize file input click handler
    const triggerFileInput = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <div style={styles.container}>
            {/* Logo */}
            <div style={styles.logoContainer}>
                <div style={styles.logoWrapper}>
                    {base64Image && (
                        <img src={base64Image} alt="Company Logo" style={styles.logo} />
                    )}
                </div>
            </div>

            {/* Upload prompt (if no background and not in preview mode) */}
            {!localData.backgroundImage && !isPreview && (
                <div onClick={triggerFileInput} style={styles.uploadPrompt}>
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
                <div style={styles.uploadPromptPreview}>
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
                    id={uniqueIds.fileInput}
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                />
            )}

            {/* Main form area */}
            <div style={styles.mainForm}>
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
                        background: 'transparent'
                    }}>
                        {isPreview ? (
                            <div
                                id={uniqueIds.destinationInput}
                                style={{
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
                                    alignItems: 'center',
                                    background: 'transparent'
                                }}
                            >
                                {localData.destinationName || 'Enter Destination'}
                            </div>
                        ) : (
                            <input
                                type="text"
                                id={uniqueIds.destinationInput}
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
                <div id={uniqueIds.tripDurationContainer} style={styles.sectionContainer}>
                    <div style={styles.labelContainer}>
                        <div style={styles.labelText}>Trip Duration</div>
                        {isPreview && <div style={styles.colon}>:</div>}
                    </div>
                    <TripDurationPicker
                        value={localData.tripDuration}
                        onChange={(val) => handleDataChange('tripDuration', val)}
                        isPreview={isPreview}
                    />
                </div>

                {/* Adults section */}
                <div id={uniqueIds.adultsContainer} style={styles.sectionContainer}>
                    <div style={styles.labelContainerTall}>
                        <div style={styles.labelText}>
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
                        {isPreview && <div style={styles.colon}>:</div>}
                    </div>

                    <div style={styles.counter}>
                        {!isPreview && (
                            <div
                                id={uniqueIds.adultsMinusBtn}
                                onClick={handleAdultsDecrease}
                                style={{ cursor: "pointer" }}
                            >
                                <img src={dnd} alt="minus" width={32} height={32} />
                            </div>
                        )}
                        <div style={styles.adultsCounterText}>
                            {localData.adults}
                        </div>
                        {!isPreview && (
                            <div
                                id={uniqueIds.adultsPlusBtn}
                                onClick={handleAdultsIncrease}
                                style={{ cursor: "pointer" }}
                            >
                                <img src={add} alt="plus" width={32} height={32} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Children section */}
                <div id={uniqueIds.childrenContainer} style={styles.sectionContainer}>
                    <div style={styles.labelContainerTall}>
                        <div style={styles.labelText}>
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
                        {isPreview && <div style={styles.colon}>:</div>}
                    </div>

                    <div style={styles.counter}>
                        {!isPreview && (
                            <div
                                id={uniqueIds.childrenMinusBtn}
                                onClick={handleChildrenDecrease}
                                style={{ cursor: "pointer" }}
                            >
                                <img src={dnd} alt="minus" width={32} height={32} />
                            </div>
                        )}
                        <div style={styles.childrenCounterText}>
                            {localData.children}
                        </div>
                        {!isPreview && (
                            <div
                                id={uniqueIds.childrenPlusBtn}
                                onClick={handleChildrenIncrease}
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
