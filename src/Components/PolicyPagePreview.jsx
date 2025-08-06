// PolicyPagePreview.jsx
import React from 'react';
import Footer from './Footer';

function PolicyPagePreview({ data, pageNumber }) {
    if (!data) {
        return (
            <div style={{
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
            }}>
                No content to preview
            </div>
        );
    }

    const { title, fields } = data;

    const renderField = (field) => {
        switch (field.type) {
            case 'title':
                return (
                    <div
                        key={field.id}
                        style={{
                            color: '#0E1328',
                            fontFamily: 'Lato',
                            fontSize: '64px',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            lineHeight: '80px',
                            textTransform: 'capitalize',
                            marginBottom: '24px',
                        }}
                    >
                        {field.content}
                    </div>
                );

            case 'details':
                return (
                    <div
                        key={field.id}
                        style={{
                            color: '#0E1328',
                            fontFamily: 'Lato',
                            fontSize: '24px',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            lineHeight: '32px',
                            marginBottom: '16px',
                        }}
                        dangerouslySetInnerHTML={{ __html: field.content }}
                    />
                );

            case 'table':
                // Show table even if it's empty or has no content
                let tableContent = field.content;

                // If no content or invalid content, create default empty table structure
                if (!tableContent || !Array.isArray(tableContent) || tableContent.length === 0) {
                    // Create a default 2x4 empty table (header + 3 rows, 2 columns)
                    tableContent = [
                        ['', ''], // Header row
                        ['', ''], // Data row 1
                        ['', ''], // Data row 2
                        ['', '']  // Data row 3
                    ];
                }

                // Ensure header row exists and is an array
                if (!Array.isArray(tableContent[0])) {
                    tableContent[0] = ['', ''];
                }

                // If header row is shorter than the longest row, pad it
                const maxCols = Math.max(...tableContent.map(row => Array.isArray(row) ? row.length : 0), 2);
                tableContent = tableContent.map(row => {
                    if (!Array.isArray(row)) return Array(maxCols).fill('');
                    if (row.length < maxCols) return [...row, ...Array(maxCols - row.length).fill('')];
                    return row;
                });

                return (
                    <div key={field.id} style={{
                        marginBottom: '32px',
                        width: '100%',
                        overflow: 'hidden' // Prevent table overflow
                    }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'separate',
                            borderSpacing: '0',
                            fontFamily: 'Lato',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            background: '#FFF',
                        }}>
                            <thead>
                                <tr>
                                    {(() => {
                                        // Check if all header cells are empty
                                        const allHeaderEmpty = tableContent[0].every(cell => !cell || cell.trim() === '');
                                        // If all header cells are empty, show a single placeholder in the first cell
                                        if (allHeaderEmpty) {
                                            return tableContent[0].map((cell, i) => (
                                                <th key={i} style={{
                                                    padding: '16px 20px',
                                                    background: '#0E1328',
                                                    color: '#FFF',
                                                    fontSize: '20px',
                                                    fontWeight: 600,
                                                    lineHeight: '28px',
                                                    textAlign: 'left',
                                                }}>
                                                    {i === 0 ? (
                                                        <span style={{
                                                            color: 'rgba(255, 255, 255, 0.5)',
                                                            fontStyle: 'normal'
                                                        }}>
                                                            Table Title
                                                        </span>
                                                    ) : null}
                                                </th>
                                            ));
                                        }
                                        // Otherwise, show each header cell or placeholder
                                        return tableContent[0].map((cell, i) => (
                                            <th key={i} style={{
                                                padding: '16px 20px',
                                                background: '#0E1328',
                                                color: '#FFF',
                                                fontSize: '20px',
                                                fontWeight: 600,
                                                lineHeight: '28px',
                                                textAlign: 'left',
                                            }}>
                                                {cell || (
                                                    <span style={{
                                                        color: 'rgba(255, 255, 255, 0.5)',
                                                        fontStyle: 'normal'
                                                    }}>
                                                        Table Title
                                                    </span>
                                                )}
                                            </th>
                                        ));
                                    })()}
                                </tr>
                            </thead>
                            <tbody>
                                {tableContent.slice(1).map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                            <td
                                                key={colIndex}
                                                style={{
                                                    padding: '12px 16px 12px 8px',
                                                    fontSize: '18px',
                                                    fontWeight: 400,
                                                    color: '#0E1328',
                                                    lineHeight: '24px',
                                                    borderBottom: rowIndex === tableContent.length - 2
                                                        ? 'none'
                                                        : '1px solid rgba(14, 19, 40, 0.12)',
                                                    textAlign: 'left',
                                                    background: '#FFF',
                                                    whiteSpace: 'pre-wrap',
                                                    minHeight: '60px', // Ensure minimum height for empty cells
                                                }}
                                            >
                                                {/* Show content or placeholder for empty cells */}
                                                {cell || (
                                                    <span style={{
                                                        color: '#9CA3AF',
                                                        fontStyle: 'normal',
                                                        fontSize: '16px'
                                                    }}>
                                                        Type here
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {/* FIXED: Global styles moved to a style element in head */}
            <style>{`
                /* Ensure rich text content styling is preserved */
                .policy-preview-content h1 {
                    font-size: 36px !important;
                    line-height: 1.2 !important;
                    margin: 24px 0 16px !important;
                    font-weight: 700 !important;
                    color: #0E1328 !important;
                    font-family: 'Lato', sans-serif !important;
                }
                
                .policy-preview-content h2 {
                    font-size: 28px !important;
                    line-height: 1.3 !important;
                    margin: 20px 0 12px !important;
                    font-weight: 600 !important;
                    color: #0E1328 !important;
                    font-family: 'Lato', sans-serif !important;
                }
                
                .policy-preview-content h3 {
                    font-size: 22px !important;
                    line-height: 1.4 !important;
                    margin: 16px 0 8px !important;
                    font-weight: 600 !important;
                    color: #0E1328 !important;
                    font-family: 'Lato', sans-serif !important;
                }
                
                .policy-preview-content p {
                    margin: 12px 0 !important;
                    line-height: 1.6 !important;
                    color: #0E1328 !important;
                    font-family: 'Lato', sans-serif !important;
                    font-size: 24px !important;
                    font-weight: 400 !important;
                }
                
                .policy-preview-content ul, .policy-preview-content ol {
                    margin: 12px 0 !important;
                    padding-left: 24px !important;
                    color: #0E1328 !important;
                    font-family: 'Lato', sans-serif !important;
                    font-size: 24px !important;
                    font-weight: 400 !important;
                    line-height: 32px !important;
                }
                
                .policy-preview-content li {
                    margin: 4px 0 !important;
                    line-height: 1.6 !important;
                    color: #0E1328 !important;
                    font-family: 'Lato', sans-serif !important;
                    font-size: 24px !important;
                    font-weight: 400 !important;
                }
                
                .policy-preview-content blockquote {
                    border-left: 4px solid #0066cc !important;
                    padding-left: 16px !important;
                    margin: 16px 0 !important;
                    font-style: italic !important;
                    color: #555 !important;
                    font-family: 'Lato', sans-serif !important;
                    font-size: 24px !important;
                    font-weight: 400 !important;
                    line-height: 32px !important;
                }
                
                .policy-preview-content strong {
                    font-weight: bold !important;
                }
                
                .policy-preview-content em {
                    font-style: italic !important;
                }
                
                .policy-preview-content del {
                    text-decoration: line-through !important;
                }

                /* Fix for all text elements in preview */
                .policy-preview-content * {
                    font-family: 'Lato', sans-serif !important;
                    color: #0E1328 !important;
                }
                /* Ensure table header text is visible (white) */
                .policy-preview-content th {
                    color: #FFF !important;
                }
            `}</style>

            <div
                style={{
                    display: 'flex',
                    width: '1088px',
                    minHeight: '1540px',
                    padding: '64px 64px 0 64px',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexShrink: 0,
                    background: '#FFF',
                    position: 'relative',
                    borderRadius: '32px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '20px',
                        flex: '1 0 0',
                        alignSelf: 'stretch',
                        flexDirection: 'column',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            flex: '1 0 0',
                            alignSelf: 'stretch',
                        }}
                    >
                        {/* Main Title */}
                        {title && (
                            <div
                                style={{
                                    display: 'flex',
                                    padding: '8px 64px',
                                    alignItems: 'center',
                                    alignSelf: 'stretch',
                                    borderRadius: '16px',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    marginBottom: '32px',
                                }}
                            >
                                <div style={{
                                    color: '#0E1328',
                                    fontFamily: 'Lato',
                                    fontSize: '64px',
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    lineHeight: '80px',
                                    textTransform: 'capitalize',
                                }}>
                                    {title}
                                </div>
                            </div>
                        )}

                        {/* Dynamic Content - FIXED: Better text styling preservation */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignSelf: 'stretch',
                                paddingLeft: '64px',
                                paddingRight: '64px',
                                paddingBottom: '120px',
                                flex: '1 0 0',
                            }}
                        >
                            <div className="policy-preview-content">
                                {fields && fields.map(field => renderField(field))}
                            </div>
                        </div>
                    </div>
                </div>

                <Footer pageNumber={pageNumber} />
            </div>
        </>
    );
}

export default PolicyPagePreview;