import React, { useState, useEffect, useRef } from 'react';
import close from '../assets/icons/close.svg'
import hotel from '../assets/icons/hotel.svg'
import fork_spoon from '../assets/icons/fork_spoon.svg'
import table from '../assets/icons/table.svg'
import drag_indicator from '../assets/icons/drag_indicator.svg'
import flightland from '../assets/icons/flight_land.svg'
import interest from '../assets/icons/interests.svg'
import taxi from '../assets/icons/local_taxi.svg'

// Import components
import AddSectionTray from './AddSectionTray';
import ImageUpload from './ImageUpload';
import Footer from './Footer';

const ICON_OPTIONS = {
    PlaneLanding: flightland,
    Landmark: interest,
    CarFront: taxi,
    Hotel: hotel,
    Restaurant: fork_spoon,
    Table: table,
};

const SECTION_OPTIONS = [
    { value: 'PlaneLanding', label: 'Flight', heading: 'Arrival' },
    { value: 'Landmark', label: 'Activity', heading: 'Activities' },
    { value: 'CarFront', label: 'Car', heading: 'Transfer' },
];

function DayPage({ pageId, pageNumber, pageData, isPreview = false, onDataUpdate, dayNumber }) {
    // Initialize local state from pageData
    const [localData, setLocalData] = useState({
        destination: '',
        arrivalDetails: '',
        transferDetails: '',
        dropDetails: '',
        activityDetails: ['', '', ''],
        uploadedImage: null,
        mealSelections: {
            breakfast: false,
            lunch: false,
            dinner: false
        },
        icons: {
            arrival: 'PlaneLanding',
            transfer: 'CarFront',
            drop: 'CarFront',
            activity: 'Landmark',
        },
        sectionHeadings: {
            arrival: 'Arrival',
            transfer: 'Transfer',
            activity: 'Activities',
            drop: 'Drop',
        },
        dynamicSections: [],
        // Track which sections are visible
        visibleSections: {
            arrival: true,
            transfer: true,
            activity: true,
            drop: true
        }
    });

    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const [activeActivityIndex, setActiveActivityIndex] = useState(null);
    const dropdownRef = useRef(null);
    const fileInputRef = useRef(null);

    // Generate unique IDs based on pageId
    const getUniqueId = (fieldName, index = null) => {
        const baseId = `page_${pageId}_${fieldName}`;
        return index !== null ? `${baseId}_${index}` : baseId;
    };

    // Sync local state with incoming pageData when it changes
    useEffect(() => {
        if (pageData) {
            setLocalData({
                destination: pageData.destination || '',
                arrivalDetails: pageData.arrivalDetails || '',
                transferDetails: pageData.transferDetails || '',
                dropDetails: pageData.dropDetails || '',
                activityDetails: pageData.activityDetails || ['', '', ''],
                uploadedImage: pageData.uploadedImage || null,
                mealSelections: pageData.mealSelections || {
                    breakfast: false,
                    lunch: false,
                    dinner: false
                },
                icons: pageData.icons || {
                    arrival: 'PlaneLanding',
                    transfer: 'CarFront',
                    drop: 'CarFront',
                    activity: 'Landmark',
                },
                sectionHeadings: pageData.sectionHeadings || {
                    arrival: 'Arrival',
                    transfer: 'Transfer',
                    activity: 'Activities',
                    drop: 'Drop',
                },
                dynamicSections: pageData.dynamicSections || [],
                visibleSections: pageData.visibleSections || {
                    arrival: true,
                    transfer: true,
                    activity: true,
                    drop: true
                }
            });
        }
    }, [pageData]);

    useEffect(() => {
        // Force re-render when dayNumber changes
        // This ensures the component updates when pages are reordered
    }, [dayNumber]);

    // Helper to update data and notify parent
    const updateParent = (updatedFields) => {
        const updatedData = { ...localData, ...updatedFields };
        setLocalData(updatedData);
        if (onDataUpdate) onDataUpdate(updatedData);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownIndex(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleActivityChange = (index, value) => {
        const newActivities = [...localData.activityDetails];
        newActivities[index] = value;
        updateParent({ activityDetails: newActivities });
    };

    const handleActivityFocus = (index) => {
        setActiveActivityIndex(index);
    };

    const handleActivityBlur = () => {
        setActiveActivityIndex(null);
    };

    const handleMealToggle = (meal) => {
        const updatedMeals = {
            ...localData.mealSelections,
            [meal]: !localData.mealSelections[meal]
        };
        updateParent({ mealSelections: updatedMeals });
    };

    const handleSectionHeadingChange = (key, value) => {
        const updatedHeadings = {
            ...localData.sectionHeadings,
            [key]: value
        };
        updateParent({ sectionHeadings: updatedHeadings });
    };

    const handleDynamicSectionChange = (sectionId, field, value) => {
        const updatedSections = localData.dynamicSections.map(section =>
            section.id === sectionId
                ? { ...section, [field]: value }
                : section
        );
        updateParent({ dynamicSections: updatedSections });
    };

    const handleAddSection = (newSection) => {
        const updatedSections = [...localData.dynamicSections, newSection];
        updateParent({ dynamicSections: updatedSections });
    };

    const removeSection = (sectionId) => {
        const updatedSections = localData.dynamicSections.filter(section => section.id !== sectionId);
        updateParent({ dynamicSections: updatedSections });
    };

    // New function to handle deleting main sections
    const handleDeleteMainSection = (sectionKey) => {
        const updatedVisibleSections = {
            ...localData.visibleSections,
            [sectionKey]: false
        };
        
        // Also clear the data for the deleted section
        const clearedData = {};
        if (sectionKey === 'arrival') clearedData.arrivalDetails = '';
        if (sectionKey === 'transfer') clearedData.transferDetails = '';
        if (sectionKey === 'drop') clearedData.dropDetails = '';
        if (sectionKey === 'activity') clearedData.activityDetails = ['', '', ''];

        updateParent({ 
            visibleSections: updatedVisibleSections,
            ...clearedData
        });
    };



    const handleImageUpload = (file, imageUrl) => {
        updateParent({ uploadedImage: imageUrl });
        console.log('Image uploaded:', file);
    };

    const handleIconChange = (key, iconValue, heading) => {
        const updatedIcons = { ...localData.icons, [key]: iconValue };
        const updatedHeadings = { ...localData.sectionHeadings, [key]: heading };
        updateParent({
            icons: updatedIcons,
            sectionHeadings: updatedHeadings
        });
        setOpenDropdownIndex(null);
    };

    const renderDropdown = (key, index) => {
        if (isPreview) return null;

        return openDropdownIndex === index ? (
            <div ref={dropdownRef} style={{ position: 'absolute', top: '40px', left: '0', zIndex: 100, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', width: '180px', boxShadow: '0px 4px 8px rgba(0,0,0,0.1)', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }} onDragStart={e => e.preventDefault()}>
                {SECTION_OPTIONS.map((opt) => (
                    <div key={opt.value} onClick={() => handleIconChange(key, opt.value, opt.heading)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'} onDragStart={e => e.preventDefault()}>
                        <img src={ICON_OPTIONS[opt.value]} alt={opt.label} width={16} height={16} draggable={false} onDragStart={e => e.preventDefault()} style={{ userSelect: 'none', pointerEvents: 'none' }} />
                        <span style={{ fontFamily: 'Lato' ,fontSize: '14px', color: '#333', userSelect: 'none' }}>{opt.label}</span>
                    </div>
                ))}
            </div>
        ) : null;
    };

    const renderDynamicSection = (section) => {
        return (
            <div key={section.id} style={{ display: 'flex', width: '928px', padding: '4px', alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ display: 'flex', padding: '8px', justifyContent: 'center', alignItems: 'center', gap: '8px', borderRadius: '28px', background: 'rgba(243, 63, 63, 0.06)', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }} onDragStart={e => e.preventDefault()}>
                    <div style={{ width: '20px', height: '20px', aspectRatio: '1 / 1', userSelect: 'none' }}>
                        <img src={ICON_OPTIONS[section.icon]} alt={section.type} draggable={false} onDragStart={e => e.preventDefault()} style={{ userSelect: 'none', pointerEvents: 'none' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px', flex: '1 0 0' }}>
                    <div style={{ display: 'flex', padding: '0 0 4px 16px', justifyContent: 'center', alignItems: 'center', gap: '10px', alignSelf: 'stretch' }}>
                        {isPreview ? (
                            <div style={{ color: 'rgba(14, 19, 40, 0.64)', fontFamily: 'Inter', fontSize: '20px', fontStyle: 'normal', fontWeight: 500, lineHeight: '32px', textTransform: 'uppercase', flex: '1 0 0' }}>
                                {section.heading}
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={section.heading}
                                id={getUniqueId('dynamic_section_heading', section.id)}
                                name={getUniqueId('dynamic_section_heading', section.id)}
                                onChange={(e) => handleDynamicSectionChange(section.id, 'heading', e.target.value)}
                                style={{ color: 'rgba(14, 19, 40, 0.64)', fontFamily: 'Lato', fontSize: '20px', fontStyle: 'normal', fontWeight: 500, lineHeight: '32px', textTransform: 'uppercase', flex: '1 0 0', border: 'none', outline: 'none', background: 'transparent' }}
                            />
                        )}
                    </div>

                    <div style={{ display: 'flex', padding: '8px 16px', alignItems: 'center', alignSelf: 'stretch' }}>
                        {isPreview ? (
                            <div style={{ color: section.details ? '#0E1328' : 'rgba(14, 19, 40, 0.24)', fontFamily: 'Lato', fontSize: '28px', fontStyle: 'normal', fontWeight: 400, lineHeight: '36px', flex: '1 0 0' }}>
                                {section.details || `No ${section.heading.toLowerCase()} details`}
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={section.details}
                                id={getUniqueId('dynamic_section_details', section.id)}
                                name={getUniqueId('dynamic_section_details', section.id)}
                                onChange={(e) => handleDynamicSectionChange(section.id, 'details', e.target.value)}
                                placeholder={`Enter ${section.heading.toLowerCase()} details`}
                                style={{ color: section.details ? '#0E1328' : 'rgba(14, 19, 40, 0.24)', fontFamily: 'Lato', fontSize: '28px', fontStyle: 'normal', fontWeight: 400, lineHeight: '36px', flex: '1 0 0', border: 'none', outline: 'none', background: 'transparent' }}
                            />
                        )}
                    </div>
                </div>

                {!isPreview && (
                    <div onClick={() => removeSection(section.id)} style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(243, 63, 63, 0.1)', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }} onDragStart={e => e.preventDefault()}>
                        <img src={close} alt="remove" width={12} height={12} draggable={false} onDragStart={e => e.preventDefault()} style={{ userSelect: 'none', pointerEvents: 'none' }} />
                    </div>
                )}
            </div>
        );
    };

    // Helper function to render main sections with delete option
    const renderMainSection = (sectionKey, dropdownIndex, sectionData) => {
        if (!localData.visibleSections[sectionKey]) {
            return null; // Don't show deleted sections
        }

        // Render the section normally
        return (
            <div style={{ display: 'flex', width: '928px', padding: '4px', alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ display: 'inline-flex', padding: '8px', justifyContent: 'center', alignItems: 'center', gap: '8px', borderRadius: '28px', background: 'rgba(243, 63, 63, 0.06)', position: 'relative', cursor: isPreview ? 'default' : 'pointer', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }} onClick={!isPreview ? () => setOpenDropdownIndex(openDropdownIndex === dropdownIndex ? null : dropdownIndex) : undefined} onDragStart={e => e.preventDefault()}>
                    <div style={{ width: '20px', height: '20px', aspectRatio: '1 / 1', userSelect: 'none' }}>
                        <img src={ICON_OPTIONS[localData.icons[sectionKey]]} alt={sectionKey} draggable={false} onDragStart={e => e.preventDefault()} style={{ userSelect: 'none', pointerEvents: 'none' }} />
                    </div>
                    {/* Drag indicator - positioned below the icon when activity is active */}
                    {sectionKey === 'activity' && activeActivityIndex !== null && !isPreview && (
                        <div style={{
                            position: 'absolute',
                            top: '48px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            padding: '8px 16px',
                            alignItems: 'center',
                            alignSelf: 'stretch',
                            borderRadius: '12px',
                            background: 'rgba(14, 19, 40, 0.06)',
                            zIndex: 10
                        }}>
                            <img 
                                src={drag_indicator} 
                                alt="drag indicator" 
                                width={20} 
                                height={20} 
                                draggable={false} 
                                onDragStart={e => e.preventDefault()} 
                                style={{ userSelect: 'none', pointerEvents: 'none' }} 
                            />
                        </div>
                    )}
                    {renderDropdown(sectionKey, dropdownIndex)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px', flex: '1 0 0' }}>
                    <div style={{ display: 'flex', padding: '0 0 4px 16px', justifyContent: 'center', alignItems: 'center', gap: '10px', alignSelf: 'stretch' }}>
                        {isPreview ? (
                            <div style={{ color: 'rgba(14, 19, 40, 0.64)', fontFamily: 'Lato', fontSize: '20px', fontStyle: 'normal', fontWeight: 500, lineHeight: '32px', textTransform: 'uppercase', flex: '1 0 0' }}>
                                {localData.sectionHeadings[sectionKey]}
                            </div>
                        ) : (
                            <input
                                type="text"
                                id={getUniqueId(`${sectionKey}_heading`)}
                                name={getUniqueId(`${sectionKey}_heading`)}
                                value={localData.sectionHeadings[sectionKey]}
                                onChange={(e) => handleSectionHeadingChange(sectionKey, e.target.value)}
                                style={{ color: 'rgba(14, 19, 40, 0.64)', fontFamily: 'Lato', fontSize: '20px', fontStyle: 'normal', fontWeight: 500, lineHeight: '32px', textTransform: 'uppercase', flex: '1 0 0', border: 'none', outline: 'none', background: 'transparent' }}
                            />
                        )}
                    </div>

                    {sectionData}
                </div>

                {!isPreview && (
                    <div onClick={() => handleDeleteMainSection(sectionKey)} style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(243, 63, 63, 0.1)', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }} onDragStart={e => e.preventDefault()}>
                        <img src={close} alt="remove" width={12} height={12} draggable={false} onDragStart={e => e.preventDefault()} style={{ userSelect: 'none', pointerEvents: 'none' }} />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', width: '1088px', minHeight: '1540px', flexDirection: 'column', backgroundColor: '#fff', position: 'relative' }}>
            {/* Main Content Area */}
            <div style={{ display: 'flex', width: '100%', padding: '0 64px', flexDirection: 'column', alignItems: 'center', gap: '32px', flex: 1, paddingBottom: '80px' }}>
                {/* Image Upload Component */}
                {localData.uploadedImage ? (
                    <div style={{
                        display: 'flex',
                        width: '1088px',
                        height: '584px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexShrink: 0,
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: isPreview ? 'default' : 'pointer',
                        marginLeft: '-64px',
                        marginRight: '-64px',
                    }}
                        onClick={!isPreview ? () => fileInputRef.current?.click() : undefined}
                    >
                        <img
                            src={localData.uploadedImage}
                            alt="Day"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                ) : (
                    !isPreview && (
                        <ImageUpload onImageUpload={handleImageUpload} existingImage={localData.uploadedImage} />
                    )
                )}

                {/* Show placeholder in preview mode when no image */}
                {!localData.uploadedImage && isPreview && (
                    <div style={{
                        display: 'flex',
                        width: '1088px',
                        height: '584px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexShrink: 0,
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 24.03%, rgba(243, 63, 63, 0.06) 100%)',
                        borderRadius: '32px 32px 0 0',
                        marginLeft: '-64px',
                        marginRight: '-64px',
                        border: '2px dashed rgba(243, 63, 63, 0.3)'
                    }}>
                        <div style={{
                            color: 'rgba(14, 19, 40, 0.5)',
                            fontFamily: 'Lato',
                            fontSize: '24px',
                            fontWeight: 600,
                        }}>
                            No image uploaded
                        </div>
                    </div>
                )}

                {/* Title Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'stretch' }}>
                    <div style={{ display: 'flex', padding: '8px 16px', alignItems: 'center', alignSelf: 'stretch', borderRadius: '16px' }}>
                        <div style={{ color: '#0E1328', fontFamily: 'Lato', fontSize: '24px', fontStyle: 'normal', fontWeight: 500, lineHeight: '36px' }}>
                            DAY {dayNumber || 1}
                        </div>
                    </div>

                    <div style={{ display: 'flex', width: '960px', padding: '8px 16px', alignItems: 'center', borderRadius: '16px' }}>
                        {isPreview ? (
                            <div style={{ color: localData.destination ? '#0E1328' : 'rgba(14, 19, 40, 0.24)', fontFamily: 'Lato', fontSize: '48px', fontStyle: 'normal', fontWeight: 400, lineHeight: '56px', textTransform: 'capitalize', width: '920px', flexShrink: 0 }}>
                                {localData.destination || 'Enter Destination'}
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={localData.destination}
                                id={getUniqueId('destination')}
                                name={getUniqueId('destination')}
                                onChange={(e) => updateParent({ destination: e.target.value })}
                                placeholder="Enter Destination"
                                style={{ color: localData.destination ? '#0E1328' : 'rgba(14, 19, 40, 0.24)', fontFamily: 'Lato', fontSize: '48px', fontStyle: 'normal', fontWeight: 400, lineHeight: '56px', textTransform: 'capitalize', width: '920px', flexShrink: 0, border: 'none', outline: 'none', background: 'transparent' }}
                            />
                        )}
                    </div>

                    {/* Meal Options */}
                    <div style={{ display: 'flex', padding: '8px 16px', alignItems: 'center', gap: '12px', alignSelf: 'stretch', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            {['breakfast', 'lunch', 'dinner']
                                .filter(meal => {
                                    return isPreview ? localData.mealSelections[meal] : true;
                                })
                                .map((meal) => {
                                    const selected = localData.mealSelections[meal];
                                    return (
                                        <div
                                            key={meal}
                                            onClick={!isPreview ? () => handleMealToggle(meal) : undefined}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '8px 16px',
                                                borderRadius: '999px',
                                                gap: '8px',
                                                backgroundColor: isPreview ? 'transparent' : (selected ? '#FFFFFF' : '#F4F4F6'),
                                                border: '1px solid transparent',
                                                cursor: isPreview ? 'default' : 'pointer',
                                                boxShadow: (selected && !isPreview) ? '0 0 0 1px rgba(0,0,0,0.04)' : 'none',
                                                userSelect: 'none',
                                                WebkitUserSelect: 'none',
                                                MozUserSelect: 'none',
                                                msUserSelect: 'none'
                                            }}
                                            onDragStart={e => e.preventDefault()}
                                        >
                                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: selected ? 'none' : '2px solid #A3A3A3', backgroundColor: selected ? '#0E1328' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none' }}>
                                                {selected && (
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                        <path d="M3 6.2L5 8.2L9 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span style={{ fontFamily: 'Lato', fontSize: '16px', fontWeight: '600', textTransform: 'uppercase', color: selected ? '#0E1328' : '#A3A3A3', userSelect: 'none' }}>
                                                {meal}
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>

                {/* Main Content Frame */}
                <div style={{ display: 'flex', padding: '0 16px', flexDirection: 'column', alignItems: 'flex-start', gap: '24px', alignSelf: 'stretch' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'stretch' }}>
                        
                        {/* Arrival Section */}
                        {renderMainSection('arrival', 0, (
                            <div style={{ display: 'flex', padding: '8px 16px', alignItems: 'center', alignSelf: 'stretch' }}>
                                {isPreview ? (
                                    <div style={{ color: localData.arrivalDetails ? '#0E1328' : 'rgba(14, 19, 40, 0.24)', fontFamily: 'Lato', fontSize: '28px', fontStyle: 'normal', fontWeight: 400, lineHeight: '36px', flex: '1 0 0' }}>
                                        {localData.arrivalDetails || 'No arrival details'}
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        id={getUniqueId('arrival_details')}
                                        name={getUniqueId('arrival_details')}
                                        value={localData.arrivalDetails}
                                        onChange={(e) => updateParent({ arrivalDetails: e.target.value })}
                                        placeholder="Enter the arrival details"
                                        style={{ color: localData.arrivalDetails ? '#0E1328' : 'rgba(14, 19, 40, 0.24)', fontFamily: 'Lato', fontSize: '28px', fontStyle: 'normal', fontWeight: 400, lineHeight: '36px', flex: '1 0 0', border: 'none', outline: 'none', background: 'transparent' }}
                                    />
                                )}
                            </div>
                        ))}

                        {/* Transfer Section */}
                        {renderMainSection('transfer', 1, (
                            <div style={{ display: 'flex', padding: '8px 16px', alignItems: 'center', alignSelf: 'stretch' }}>
                                {isPreview ? (
                                    <div style={{ color: localData.transferDetails ? '#0E1328' : 'rgba(14, 19, 40, 0.24)', fontFamily: 'Lato', fontSize: '28px', fontStyle: 'normal', fontWeight: 400, lineHeight: '36px', flex: '1 0 0' }}>
                                        {localData.transferDetails || 'No transfer details'}
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        id={getUniqueId('transfer_details')}
                                        name={getUniqueId('transfer_details')}
                                        value={localData.transferDetails}
                                        onChange={(e) => updateParent({ transferDetails: e.target.value })}
                                        placeholder="Enter the transfer details"
                                        style={{ color: localData.transferDetails ? '#0E1328' : 'rgba(14, 19, 40, 0.24)', fontFamily: 'Lato', fontSize: '28px', fontStyle: 'normal', fontWeight: 400, lineHeight: '36px', flex: '1 0 0', border: 'none', outline: 'none', background: 'transparent' }}
                                    />
                                )}
                            </div>
                        ))}

                        {/* Activities Section */}
                        {renderMainSection('activity', 2, (
                            <div>
                                {localData.activityDetails.map((activity, index) => (
                                    <div key={index} style={{ display: 'flex', padding: '8px 16px', alignItems: 'center', alignSelf: 'stretch', borderRadius: '12px' }}>
                                        {isPreview ? (
                                            <div style={{ color: activity ? '#0E1328' : 'rgba(14, 19, 40, 0.24)', fontFamily: 'Lato', fontSize: '28px', fontStyle: 'normal', fontWeight: 400, lineHeight: '36px', flex: '1 0 0' }}>
                                                {activity || `No activity ${index + 1}`}
                                            </div>
                                        ) : (
                                            <input
                                                type="text"
                                                id={getUniqueId('activity', index)}
                                                name={getUniqueId('activity', index)}
                                                value={activity}
                                                onChange={(e) => handleActivityChange(index, e.target.value)}
                                                onFocus={() => handleActivityFocus(index)}
                                                onBlur={handleActivityBlur}
                                                placeholder="Enter activity details"
                                                style={{ color: activity ? '#0E1328' : 'rgba(14, 19, 40, 0.24)', fontFamily: 'Lato', fontSize: '28px', fontStyle: 'normal', fontWeight: 400, lineHeight: '36px', flex: '1 0 0', border: 'none', outline: 'none', background: 'transparent' }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}

                        {/* Drop Section */}
                        {renderMainSection('drop', 3, (
                            <div style={{ display: 'flex', padding: '8px 16px', alignItems: 'center', alignSelf: 'stretch' }}>
                                {isPreview ? (
                                    <div style={{ color: localData.dropDetails ? '#0E1328' : 'rgba(14, 19, 40, 0.24)', fontFamily: 'Lato', fontSize: '28px', fontStyle: 'normal', fontWeight: 400, lineHeight: '36px', flex: '1 0 0' }}>
                                        {localData.dropDetails || 'No drop details'}
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        id={getUniqueId('drop_details')}
                                        name={getUniqueId('drop_details')}
                                        value={localData.dropDetails}
                                        onChange={(e) => updateParent({ dropDetails: e.target.value })}
                                        placeholder="Enter the drop details"
                                        style={{ color: localData.dropDetails ? '#0E1328' : 'rgba(14, 19, 40, 0.24)', fontFamily: 'Lato', fontSize: '28px', fontStyle: 'normal', fontWeight: 400, lineHeight: '36px', flex: '1 0 0', border: 'none', outline: 'none', background: 'transparent' }}
                                    />
                                )}
                            </div>
                        ))}

                        {/* Render Dynamic Sections */}
                        {localData.dynamicSections.map(renderDynamicSection)}
                    </div>

                    {/* Use the AddSectionTray component - hide in preview */}
                    {!isPreview && <AddSectionTray onAddSection={handleAddSection} />}
                </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <Footer pageNumber={pageNumber} />
        </div>
    );
}

export default DayPage;