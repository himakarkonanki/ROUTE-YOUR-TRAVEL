import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import add from '../assets/icons/add_2.svg'
import logo from '../assets/icons/companyLogo.svg'
import table from '../assets/icons/table.svg'
import title from '../assets/icons/title.svg'
import ReusableTable from './ReusableTable'
import Footer from './Footer'
import TipTapEditor from './TipTapEditor'
import PolicyPagePreview from './PolicyPagePreview'

// Icon Tray Component - Optimized with memoization
const IconTray = React.memo(({ onSelectType, onClose }) => {
    const iconTrayStyles = useMemo(() => ({
        container: {
            position: 'absolute',
            left: '-70px',
            top: '0px',
            display: 'inline-flex',
            flexDirection: 'column',
            padding: '12px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '28px',
            background: '#F2F4FE',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            zIndex: 100,
            minWidth: '60px',
        },
        iconButton: {
            display: 'flex',
            width: '36px',
            height: '36px',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '12px',
            background: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
        icon: {
            width: '16px',
            height: '16px',
            transition: 'filter 0.2s ease'
        },
        titleText: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#6B7280',
            fontFamily: 'Lato',
            transition: 'color 0.2s ease',
        }
    }), []);

    const handleMouseEnter = useCallback((e, isTitle = false) => {
        e.currentTarget.style.background = '#0E1328';
        e.currentTarget.style.transform = 'scale(1.05)';
        
        if (isTitle) {
            const tText = e.currentTarget.querySelector('.t-text');
            if (tText) tText.style.color = '#FFFFFF';
        } else {
            const icon = e.currentTarget.querySelector('img');
            if (icon) icon.style.filter = 'brightness(0) invert(1)';
        }
    }, []);

    const handleMouseLeave = useCallback((e, isTitle = false) => {
        e.currentTarget.style.background = '#FFFFFF';
        e.currentTarget.style.transform = 'scale(1)';
        
        if (isTitle) {
            const tText = e.currentTarget.querySelector('.t-text');
            if (tText) tText.style.color = '#6B7280';
        } else {
            const icon = e.currentTarget.querySelector('img');
            if (icon) icon.style.filter = 'none';
        }
    }, []);

    return (
        <div style={iconTrayStyles.container}>
            {/* Title Icon */}
            <div
                style={iconTrayStyles.iconButton}
                onClick={() => onSelectType('title')}
                onMouseEnter={(e) => handleMouseEnter(e, true)}
                onMouseLeave={(e) => handleMouseLeave(e, true)}
            >
                <div className="t-text" style={iconTrayStyles.titleText}>T</div>
            </div>

            {/* Table Icon */}
            <div
                style={iconTrayStyles.iconButton}
                onClick={() => onSelectType('table')}
                onMouseEnter={(e) => handleMouseEnter(e)}
                onMouseLeave={(e) => handleMouseLeave(e)}
            >
                <img src={table} alt='table icon' style={iconTrayStyles.icon} />
            </div>
        </div>
    );
});

// DetailEditor component - Fixed and optimized
const DetailEditor = React.memo(({ 
    id, 
    type = 'details', 
    onAddNew, 
    onReplace,
    showPlusIcon, 
    hasContent, 
    onContentChange, 
    onRemove, 
    initialValue = '',
    pageId,
    fieldIndex
}) => {
    const [showIconTray, setShowIconTray] = useState(false);
    const [value, setValue] = useState(initialValue);
    const debounceTimeoutRef = useRef(null);
    const editorRef = useRef(null);
    const isUpdatingRef = useRef(false);

    // Sync with initialValue changes
    useEffect(() => {
        if (initialValue !== value && !isUpdatingRef.current) {
            setValue(initialValue);
        }
    }, [initialValue, value]);

    // Memoized content extraction
    const extractContent = useCallback((newValue) => {
        let textContent = '';
        let newHasContent = false;
        
        if (type === 'table') {
            if (Array.isArray(newValue)) {
                newHasContent = newValue.some(row => 
                    Array.isArray(row) && row.some(cell => 
                        typeof cell === 'string' && cell.trim() !== ''
                    )
                );
            }
        } else if (typeof newValue === 'string') {
            if (type === 'details') {
                // For rich text, check both HTML and plain text
                textContent = newValue.replace(/<[^>]*>/g, '').trim();
                newHasContent = textContent.length > 0 && 
                               textContent !== '<p></p>' && 
                               newValue.trim() !== '<p></p>' &&
                               newValue.trim() !== '';
            } else {
                // For title, use direct value
                textContent = newValue.trim();
                newHasContent = textContent.length > 0;
            }
        }
        
        return { textContent, newHasContent };
    }, [type]);

    // Optimized input change handler
    const handleInputChange = useCallback((e) => {
        const newValue = e.target ? e.target.value : e;
        
        // Prevent loops
        isUpdatingRef.current = true;
        setValue(newValue);
        
        // Clear existing timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        
        // Debounced content change notification
        debounceTimeoutRef.current = setTimeout(() => {
            const { newHasContent } = extractContent(newValue);
            onContentChange(id, newHasContent, newValue);
            isUpdatingRef.current = false;
        }, 150);
    }, [id, onContentChange, extractContent]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    // Memoized event handlers
    const handlePlusClick = useCallback(() => {
        setShowIconTray(true);
    }, []);

    const handleIconSelect = useCallback((selectedType) => {
        setShowIconTray(false);
        
        if (!hasContent && selectedType !== type) {
            onReplace(id, selectedType);
        } else {
            onAddNew(selectedType, id); // Pass current field ID
        }
        
        // Focus handling
        setTimeout(() => {
            if (editorRef.current) {
                if (type === 'title' || selectedType === 'title') {
                    const titleInput = editorRef.current.tagName === 'INPUT' ? 
                        editorRef.current : 
                        editorRef.current.querySelector('input');
                    if (titleInput) {
                        titleInput.focus();
                        titleInput.setSelectionRange(titleInput.value.length, titleInput.value.length);
                    }
                } else if (selectedType !== 'table') {
                    const tiptapEditor = editorRef.current.querySelector('.ProseMirror');
                    if (tiptapEditor) {
                        tiptapEditor.focus();
                    }
                }
            }
        }, 100);
    }, [hasContent, type, onReplace, id, onAddNew]);

    const handleCloseIconTray = useCallback(() => {
        setShowIconTray(false);
    }, []);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showIconTray && !event.target.closest('.icon-tray-container')) {
                setShowIconTray(false);
            }
        };

        if (showIconTray) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showIconTray]);

    // Memoized styles and placeholders
    const { placeholder, inputStyles } = useMemo(() => {
        const getPlaceholder = () => {
            switch (type) {
                case 'title': return 'Enter title...';
                case 'table': return null;
                default: return 'Enter the details...';
            }
        };

        const getStyles = () => {
            switch (type) {
                case 'title':
                    return {
                        fontSize: '64px',
                        fontWeight: 400,
                        lineHeight: '80px',
                        color: '#0E1328',
                        textTransform: 'capitalize',
                        fontFamily: 'Lato',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        width: '100%',
                        minHeight: '80px',
                        resize: 'none',
                    };
                case 'table':
                    return null;
                default:
                    return {
                        fontSize: '24px',
                        fontWeight: 400,
                        lineHeight: '32px',
                        color: '#0E1328',
                        fontFamily: 'Lato',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        width: '100%',
                        minHeight: '32px',
                        resize: 'vertical',
                    };
            }
        };

        return {
            placeholder: getPlaceholder(),
            inputStyles: getStyles()
        };
    }, [type]);

    // Memoized table handlers
    const handleTableRemove = useCallback(() => {
        if (onRemove) {
            onRemove(id);
        }
    }, [onRemove, id]);

    const handleTableDataChange = useCallback((data) => {
        const properlyFormattedData = Array.isArray(data) ? data : [];
        const { newHasContent } = extractContent(properlyFormattedData);
        onContentChange(id, newHasContent, properlyFormattedData);
    }, [id, onContentChange, extractContent]);

    // Memoized unique ID generator
    const generateUniqueId = useCallback((prefix) => {
        return `${prefix}-page-${pageId}-field-${fieldIndex}-${id}-${type}`;
    }, [pageId, fieldIndex, id, type]);

    // Memoized container styles
    const containerStyles = useMemo(() => ({
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginBottom: type === 'title' ? '24px' : (type === 'table' ? '24px' : '16px'),
        position: 'relative',
        minHeight: type === 'title' ? '80px' : '40px',
    }), [type]);

    const plusIconStyles = useMemo(() => ({
        display: 'flex',
        width: '32px',
        height: '32px',
        padding: '4px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '28px',
        background: 'rgba(14, 19, 40, 0.06)',
        flexShrink: 0,
        cursor: 'pointer',
        position: 'absolute',
        left: '-48px',
        top: type === 'title' ? '50%' : '5px', // Adjusted top alignment
        transform: type === 'title' ? 'translateY(-50%)' : 'none',
        zIndex: 5,
    }), [type]);

    // Table component
    if (type === 'table') {
        return (
            <div className="icon-tray-container" style={containerStyles}>
                {showPlusIcon && (
                    <div style={plusIconStyles} onClick={handlePlusClick}>
                        <img src={add} alt='add icon' />
                    </div>
                )}

                {showIconTray && (
                    <IconTray
                        onSelectType={handleIconSelect}
                        onClose={handleCloseIconTray}
                    />
                )}

                <ReusableTable 
                    rows={4}
                    columns={2}
                    headerPlaceholder="Table Title"
                    cellPlaceholder="Type here"
                    initialData={Array.isArray(initialValue) ? initialValue : undefined}
                    onDataChange={handleTableDataChange}
                    onTableRemove={handleTableRemove}
                    idPrefix={generateUniqueId('table')}
                />
            </div>
        );
    }

    // Text input components
    return (
        <div className="icon-tray-container" style={containerStyles}>
            {showPlusIcon && (
                <div style={plusIconStyles} onClick={handlePlusClick}>
                    <img src={add} alt='add icon' />
                </div>
            )}

            {showIconTray && (
                <IconTray
                    onSelectType={handleIconSelect}
                    onClose={handleCloseIconTray}
                />
            )}

            <div 
                ref={editorRef}
                style={{ 
                    flex: '1 0 0', 
                    position: 'relative', 
                    width: '100%',
                    display: 'flex',
                    alignItems: type === 'title' ? 'center' : 'flex-start',
                    paddingTop: type === 'details' ? '5px' : '0', // Add padding for alignment
                }}
            >
                {type === 'title' ? (
                    <input
                        ref={editorRef}
                        type="text"
                        id={generateUniqueId('policy-title-field')}
                        name={generateUniqueId('policy-title')}
                        value={value}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        style={inputStyles}
                        autoFocus={showPlusIcon}
                    />
                ) : (
                    <div ref={editorRef} style={{ width: '100%' }}>
                        <TipTapEditor
                            editorId={generateUniqueId('policy-details-editor')}
                            editorName={generateUniqueId('policy-details')}
                            value={value}
                            onChange={handleInputChange}
                            placeholder={placeholder}
                            minHeight="40px"
                            maxHeight="300px"
                            autoFocus={showPlusIcon}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

// Main PolicyPage Component - FIXED plus icon logic
function PolicyPage({ pageId, pageNumber, pageData, isPreview, onDataUpdate }) {
    const [detailFields, setDetailFields] = useState([{ 
        id: 1, 
        type: 'details',
        hasContent: false,
        content: ''
    }]);
    const [titleValue, setTitleValue] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    
    const updateTimeoutRef = useRef(null);
    const isInternalUpdateRef = useRef(false);
    const lastSentDataRef = useRef(null);
    
    const uniquePageId = useMemo(() => pageId || `page-${pageNumber || 1}`, [pageId, pageNumber]);
    
    const getPreviewData = useCallback(() => {
        const fieldsWithContent = detailFields.filter(field => {
            if (field.type === 'table') {
                return true;
            }
            return field.hasContent && field.content && field.content.trim() !== '';
        });

        return {
            title: titleValue,
            fields: fieldsWithContent,
            pageNumber: pageNumber,
            createdAt: pageData?.content?.createdAt || new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
    }, [titleValue, detailFields, pageNumber, pageData?.content?.createdAt]);

    const containerStyles = useMemo(() => ({
        main: {
            display: 'flex',
            width: '1088px',
            minHeight: '1540px',
            padding: '64px 64px 0 64px',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexShrink: 0,
            background: '#FFF',
            position: 'relative',
            overflow: 'visible',
        },
        content: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '20px',
            flex: '1 0 0',
            alignSelf: 'stretch',
            flexDirection: 'column',
            overflow: 'visible',
        },
        inner: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            flex: '1 0 0',
            alignSelf: 'stretch',
            overflow: 'visible',
        },
        titleContainer: {
            display: 'flex',
            padding: '8px 64px',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.04)',
            position: 'relative',
            marginBottom: '24px',
        },
        titleInput: {
            outline: 'none',
            border: 'none',
            background: 'transparent',
            color: titleValue ? '#0E1328' : '#9CA3AF',
            fontFamily: 'Lato',
            fontSize: '64px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '80px',
            textTransform: 'capitalize',
            minHeight: '80px',
            width: '100%',
        },
        fieldsContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'stretch',
            paddingLeft: '64px',
            paddingRight: '16px',
            paddingBottom: '120px',
            overflow: 'visible',
        },
        loading: {
            display: 'flex',
            width: '1088px',
            minHeight: '1540px',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#FFF',
            borderRadius: '32px',
            fontFamily: 'Lato',
            fontSize: '18px',
            color: '#666'
        }
    }), [titleValue]);

    // FIXED: Stable plus icon logic - moved outside of render to prevent blinking
    const fieldsWithPlusIcon = useMemo(() => {
        return detailFields.map((field) => {
            // Show plus icon for any field that is empty.
            // This allows adding a new field (like a title or table) in place of any empty line.
            const showPlusIcon = !field.hasContent;
            return {
                ...field,
                showPlusIcon
            };
        });
    }, [detailFields]);

    const addNewField = useCallback((type = 'details', afterId = null) => {
        setDetailFields(prevFields => {
            const newId = Math.max(0, ...prevFields.map(field => field.id)) + 1;
            const newField = { id: newId, type, hasContent: false, content: '' };

            if (afterId !== null) {
                const afterIndex = prevFields.findIndex(field => field.id === afterId);
                const newFields = [...prevFields];
                newFields.splice(afterIndex + 1, 0, newField);

                // If adding a title or table, ensure a details field follows
                if (type === 'title' || type === 'table') {
                    const detailsField = { id: newId + 1, type: 'details', hasContent: false, content: '' };
                    newFields.splice(afterIndex + 2, 0, detailsField);
                }
                return newFields;
            }

            // Default behavior if afterId is not provided
            return [...prevFields, newField];
        });
    }, []);

    const handleReplaceField = useCallback((fieldId, newType) => {
        setDetailFields(prevFields => {
            const fieldIndex = prevFields.findIndex(field => field.id === fieldId);
            const updatedFields = [...prevFields];
            
            updatedFields[fieldIndex] = {
                ...updatedFields[fieldIndex],
                type: newType,
                content: '',
                hasContent: false
            };
            
            if (newType === 'title' || newType === 'table') {
                const nextIndex = fieldIndex + 1;
                const newDetailsId = Math.max(...updatedFields.map(field => field.id)) + 1;
                
                if (nextIndex >= updatedFields.length || 
                    updatedFields[nextIndex].type !== 'details' || 
                    updatedFields[nextIndex].hasContent) {
                    updatedFields.splice(nextIndex, 0, {
                        id: newDetailsId,
                        type: 'details',
                        hasContent: false,
                        content: ''
                    });
                }
            }
            
            return updatedFields;
        });
    }, []);

    const handleContentChange = useCallback((fieldId, hasContent, content = '') => {
        setDetailFields(prevFields => {
            const fieldIndex = prevFields.findIndex(f => f.id === fieldId);
            if (fieldIndex === -1) return prevFields;

            const originalField = prevFields[fieldIndex];
            const wasEmpty = !originalField.hasContent;

            // Create updated fields array
            const updatedFields = prevFields.map(field => 
                field.id === fieldId ? { ...field, hasContent, content } : field
            );

            // If a field transitions from empty to having content
            if (wasEmpty && hasContent) {
                const nextFieldIndex = fieldIndex + 1;
                
                // Check if there's already an empty details field right after
                const hasEmptyDetailsFieldAfter = nextFieldIndex < updatedFields.length &&
                                                  updatedFields[nextFieldIndex].type === 'details' &&
                                                  !updatedFields[nextFieldIndex].hasContent;

                // If not, add one
                if (!hasEmptyDetailsFieldAfter) {
                    const newId = Math.max(0, ...updatedFields.map(f => f.id)) + 1;
                    updatedFields.splice(nextFieldIndex, 0, { 
                        id: newId, 
                        type: 'details', 
                        hasContent: false,
                        content: ''
                    });
                }
            }
            
            return updatedFields;
        });
    }, []);

    const handleFieldRemove = useCallback((fieldId) => {
        setDetailFields(prevFields => {
            const updatedFields = prevFields.filter(field => field.id !== fieldId);
            
            if (updatedFields.length === 0) {
                return [{ id: 1, type: 'details', hasContent: false, content: '' }];
            }
            
            const hasEmptyField = updatedFields.some(field => !field.hasContent);
            if (!hasEmptyField) {
                const newId = Math.max(...updatedFields.map(field => field.id)) + 1;
                updatedFields.push({ 
                    id: newId, 
                    type: 'details', 
                    hasContent: false,
                    content: ''
                });
            }
            
            return updatedFields;
        });
    }, []);

    const handleTitleChange = useCallback((e) => {
        setTitleValue(e.target.value);
    }, []);

    // Initialization effect
    useEffect(() => {
        if (pageData && pageData.content) {
            const newTitle = pageData.content.title || '';
            const newFields = pageData.content.fields && pageData.content.fields.length > 0 
                ? pageData.content.fields 
                : [{ id: 1, type: 'details', hasContent: false, content: '' }];
            
            setTitleValue(newTitle);
            setDetailFields(newFields);
        } else {
            setTitleValue('');
            setDetailFields([{ 
                id: 1, 
                type: 'details', 
                hasContent: false,
                content: ''
            }]);
        }
        setIsInitialized(true);
    }, [pageData]);

    // Data update effect
    useEffect(() => {
        if (onDataUpdate && !isPreview && isInitialized && !isInternalUpdateRef.current) {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
            
            updateTimeoutRef.current = setTimeout(() => {
                const previewData = getPreviewData();
                const hasContent = titleValue.trim() || detailFields.some(field => field.hasContent);
                
                const dataString = JSON.stringify(previewData);
                if (hasContent && dataString !== lastSentDataRef.current) {
                    isInternalUpdateRef.current = true;
                    lastSentDataRef.current = dataString;
                    
                    onDataUpdate({
                        ...pageData,
                        content: previewData,
                        lastModified: new Date().toISOString()
                    });
                    
                    setTimeout(() => {
                        isInternalUpdateRef.current = false;
                    }, 100);
                }
            }, 300);
        }
    }, [titleValue, detailFields, isInitialized, onDataUpdate, isPreview, getPreviewData, pageData]);

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, []);

    if (!isInitialized) {
        return <div style={containerStyles.loading}>Loading...</div>;
    }

    if (isPreview) {
        const previewData = getPreviewData();
        return <PolicyPagePreview data={previewData} pageNumber={pageNumber} />;
    }

    return (
        <div style={containerStyles.main}>
            <div style={containerStyles.content}>
                <div style={containerStyles.inner}>
                    {/* Title Section */}
                    <div style={containerStyles.titleContainer}>
                        <input
                            type="text"
                            id={`policy-page-main-title-${uniquePageId}`}
                            name={`policy-page-title-${uniquePageId}`}
                            value={titleValue}
                            onChange={handleTitleChange}
                            placeholder="Terms & Conditions"
                            style={containerStyles.titleInput}
                        />
                    </div>

                    {/* Dynamic Fields */}
                    <div style={containerStyles.fieldsContainer}>
                        {fieldsWithPlusIcon.map((field, index) => (
                            <DetailEditor
                                key={field.id}
                                id={field.id}
                                type={field.type}
                                onAddNew={addNewField}
                                onReplace={handleReplaceField}
                                showPlusIcon={field.showPlusIcon}
                                hasContent={field.hasContent}
                                onContentChange={handleContentChange}
                                onRemove={handleFieldRemove}
                                initialValue={field.content}
                                pageId={uniquePageId}
                                fieldIndex={index}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <Footer pageNumber={pageNumber}/>
        </div>
    );
}

export default PolicyPage;