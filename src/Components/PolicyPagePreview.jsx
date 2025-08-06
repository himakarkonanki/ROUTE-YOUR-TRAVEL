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
                            fontSize: '28px',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            lineHeight: '36px',
                            marginBottom: '16px',
                            marginTop: '24px',
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
                let tableContent = field.content;

                // If no content or invalid content, create default empty table structure
                if (!tableContent || !Array.isArray(tableContent) || tableContent.length === 0) {
                    tableContent = [
                        ['Table Title', 'Table Title'], // Header row
                        ['Type Here', 'Type Here'], // Data row 1
                        ['Type Here', 'Type Here'], // Data row 2
                        ['Enter the details…'] // Last row (spanned)
                    ];
                }

                // Ensure we have at least a header row
                if (!Array.isArray(tableContent[0])) {
                    tableContent[0] = ['Table Title', 'Table Title'];
                }

                return (
                    <div key={field.id} style={{
                        marginBottom: '32px',
                        width: '100%',
                        overflow: 'hidden'
                    }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontFamily: 'Lato',
                            background: '#FFF',
                            margin: '16px 0',
                        }}>
                            <thead>
                                <tr>
                                    {tableContent[0].map((cell, i) => (
                                        <th key={i} style={{
                                            backgroundColor: '#0E1328',
                                            color: 'white',
                                            padding: '12px',
                                            fontSize: '20px',
                                            fontFamily: 'Lato',
                                            textAlign: 'left',
                                            border: 'none',
                                        }}>
                                            {cell || 'Table Title'}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableContent.slice(1).map((row, rowIndex) => {
                                    // Handle spanned rows (like "Enter the details...")
                                    if (Array.isArray(row) && row.length === 1) {
                                        return (
                                            <tr key={rowIndex}>
                                                <td
                                                    colSpan={tableContent[0].length}
                                                    style={{
                                                        padding: '12px',
                                                        fontSize: '24px',
                                                        fontFamily: 'Lato',
                                                        color: '#0E1328',
                                                        borderBottom: rowIndex === tableContent.length - 2 ? 'none' : '1px solid #E0E0E0',
                                                        textAlign: 'left',
                                                    }}
                                                >
                                                    {row[0] || 'Enter the details…'}
                                                </td>
                                            </tr>
                                        );
                                    }

                                    // Handle regular rows
                                    return (
                                        <tr key={rowIndex}>
                                            {(Array.isArray(row) ? row : []).map((cell, colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    style={{
                                                        padding: '12px',
                                                        fontSize: '24px',
                                                        fontFamily: 'Lato',
                                                        color: '#0E1328',
                                                        borderBottom: rowIndex === tableContent.length - 2 ? 'none' : '1px solid #E0E0E0',
                                                        textAlign: 'left',
                                                    }}
                                                >
                                                    {cell || 'Type Here'}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
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
            <style>{`
                .policy-preview-content h2 {
                    font-size: 28px !important;
                    line-height: 1.3 !important;
                    margin: 20px 0 12px !important;
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
                
                .policy-preview-content * {
                    font-family: 'Lato', sans-serif !important;
                    color: #0E1328 !important;
                }
                
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
                                    alignItems: 'center',
                                    alignSelf: 'stretch',
                                    marginBottom: '32px',
                                    margin: '25px',
                                }}
                            >
                                <div style={{
                                    color: '#0E1328',
                                    fontFamily: 'Lato',
                                    fontSize: '64px',
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    lineHeight: 1,
                                }}>
                                    {title}
                                </div>
                            </div>
                        )}

                        {/* Dynamic Content */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignSelf: 'stretch',
                                paddingLeft: '32px',
                                paddingRight: '32px',
                                paddingBottom: '120px',
                                flex: '1 0 0',
                            }}
                        >
                            <div className="policy-preview-content">
                                {fields && fields.length > 0 ? (
                                    fields.map(field => renderField(field))
                                ) : (
                                    <div style={{
                                        color: '#0E1328',
                                        fontFamily: 'Lato',
                                        fontSize: '24px',
                                        lineHeight: 1.6,
                                        margin: '-20px 0 0 0'
                                    }}>
                                        Type your Terms & Conditions here…
                                    </div>
                                )}
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
