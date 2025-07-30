// ImageUpload.js
import React, { useState, useRef } from 'react';
import upload_image from '../assets/icons/upload_image.svg';

function ImageUpload({ onImageUpload, existingImage }) {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(existingImage || null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFiles = (files) => {
        const file = files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload only image files (JPEG or PNG)');
                return;
            }

            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB');
                return;
            }

            setIsUploading(true);

            // Create preview URL
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);

            // Simulate upload process (replace with actual upload logic)
            setTimeout(() => {
                setIsUploading(false);
                if (onImageUpload) {
                    onImageUpload(file, imageUrl);
                }
            }, 1000);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            style={{
                display: 'flex',
                width: '1088px',
                height: '584px',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 24.03%, rgba(243, 63, 63, 0.06) 100%)',
                borderRadius: '32px 32px 0 0', // Apply border radius to match parent container
            }}
        >
            {uploadedImage ? (
                // Full image display occupying entire area with border-radius
                <div 
                    style={{
                        display: 'flex',
                        width: '1088px', // Full container width
                        height: '584px', // Full container height
                        cursor: 'pointer',
                        position: 'relative',
                        borderRadius: '32px 32px 0 0', // Match the container border-radius
                        overflow: 'hidden', // Ensure image respects border-radius
                    }}
                    onClick={openFileDialog}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <img 
                        src={uploadedImage} 
                        alt="Uploaded preview" 
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </div>
            ) : (
                // Upload area with padding only when no image
                <div 
                    style={{
                        display: 'flex',
                        width: '1024px',
                        height: '520px',
                        padding: '24px 40px',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '32px',
                        flexShrink: 0,
                        borderRadius: '12px',
                        border: dragActive 
                            ? '2px solid rgba(243, 63, 63, 1)' 
                            : '1px dashed rgba(243, 63, 63, 0.64)',
                        backgroundColor: dragActive ? 'rgba(243, 63, 63, 0.05)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                    }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={openFileDialog}
                >
                    {isUploading ? (
                        // Loading state
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                border: '4px solid rgba(243, 63, 63, 0.3)',
                                borderTop: '4px solid rgba(243, 63, 63, 1)',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                            }}></div>
                            <div style={{
                                color: '#0E1328',
                                fontFamily: 'Lato',
                                fontSize: '24px',
                                fontWeight: 600,
                            }}>
                                Uploading...
                            </div>
                        </div>
                    ) : (
                        // Default upload state
                        <>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                flexShrink: 0,
                                aspectRatio: '1 / 1',
                            }}>
                                <img src={upload_image} alt='upload-icon' />
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '16px',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}>
                                    <div style={{
                                        color: '#0E1328',
                                        textAlign: 'center',
                                        fontFamily: 'Lato',
                                        fontSize: '24px',
                                        fontStyle: 'normal',
                                        fontWeight: 600,
                                        lineHeight: '36px',
                                    }}>
                                        {dragActive ? 'Drop image here' : 'Upload Image'}
                                    </div>
                                    <div style={{
                                        color: '#0E1328',
                                        textAlign: 'center',
                                        fontFamily: 'Lato',
                                        fontSize: '24px',
                                        fontStyle: 'normal',
                                        fontWeight: 600,
                                        lineHeight: '36px',
                                    }}>
                                        JPEG or PNG (Max. size: 2 MB)
                                    </div>
                                    <div style={{
                                        color: 'rgba(14, 19, 40, 0.64)',
                                        textAlign: 'center',
                                        fontFamily: 'Lato',
                                        fontSize: '16px',
                                        fontStyle: 'normal',
                                        fontWeight: 400,
                                        lineHeight: '24px',
                                        marginTop: '8px',
                                    }}>
                                        Click to browse or drag and drop
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {/* CSS for loading spinner */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `
            }} />
        </div>
    );
}

export default ImageUpload;
