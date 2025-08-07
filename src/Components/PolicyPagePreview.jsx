// PolicyPagePreview.jsx
import React from 'react';
import Footer from './Footer';

function PolicyPagePreview({ data, pageNumber }) {
    if (!data) {
        return (
            <div style={{
                width: 1088,
                height: 1540,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'white',
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
                    <h2
                        key={field.id}
                        style={{
                            fontSize: '28px',
                            margin: '16px 0 8px',
                            fontFamily: 'Lato',
                            color: '#0E1328',
                            fontWeight: 400,
                        }}
                    >
                        {field.content}
                    </h2>
                );

            case 'details':
                return (
                    <p
                        key={field.id}
                        style={{
                            fontSize: '24px',
                            lineHeight: '1.6',
                            color: '#0E1328',
                            fontFamily: 'Lato',
                            textAlign: 'justify',
                            margin: 0, // Same as editor paragraphs
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                        dangerouslySetInnerHTML={{ __html: field.content }}
                    />
                );

            case 'table':
                let tableContent = field.content;

                if (!tableContent || !Array.isArray(tableContent) || tableContent.length === 0) {
                    tableContent = [
                        ['Table Title', 'Table Title'],
                        ['Type Here', 'Type Here'],
                        ['Type Here', 'Type Here'],
                        ['Enter the details…']
                    ];
                }

                const maxCols = Math.max(...tableContent.map(row => Array.isArray(row) ? row.length : 0), 2);
                tableContent = tableContent.map(row => {
                    if (!Array.isArray(row)) return Array(maxCols).fill('');
                    if (row.length < maxCols) return [...row, ...Array(maxCols - row.length).fill('')];
                    return row;
                });

                return (
                    <table
                        key={field.id}
                        style={{
                            width: '100%',
                            maxWidth: '100%',
                            borderCollapse: 'collapse',
                            tableLayout: 'fixed',
                            margin: '16px 0',
                            boxSizing: 'border-box',
                            wordBreak: 'break-word',
                        }}
                    >
                        <thead>
                            <tr>
                                {tableContent[0].map((cell, i) => (
                                    <th key={i} style={{
                                        backgroundColor: '#0E1328',
                                        color: '#FFF',
                                        fontWeight: 400,
                                        padding: '12px',
                                        fontSize: '20px',
                                        fontFamily: 'Lato',
                                        textAlign: 'left',
                                        border: 'none',
                                        boxSizing: 'border-box',
                                        borderTopLeftRadius: i === 0 ? '6px' : '0',
                                        borderTopRightRadius: i === tableContent[0].length - 1 ? '6px' : '0',
                                    }}>
                                        {cell || 'Table Title'}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableContent.slice(1).map((row, rowIndex) => {
                                const isLastRow = rowIndex === tableContent.length - 2;
                                const isSpannedRow = row.length === 1 || (row[0] && !row[1]);
                                
                                return (
                                    <tr key={rowIndex}>
                                        {isSpannedRow ? (
                                            <td
                                                colSpan={maxCols}
                                                style={{
                                                    padding: '12px',
                                                    fontSize: '24px',
                                                    fontFamily: 'Lato',
                                                    color: '#0E1328',
                                                    borderBottom: isLastRow ? 'none' : '1px solid #E0E0E0',
                                                    boxSizing: 'border-box',
                                                    whiteSpace: 'pre-wrap',
                                                }}
                                            >
                                                {row[0] || 'Type Here'}
                                            </td>
                                        ) : (
                                            row.map((cell, colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    style={{
                                                        padding: '12px',
                                                        fontSize: '24px',
                                                        fontFamily: 'Lato',
                                                        color: '#0E1328',
                                                        borderBottom: isLastRow ? 'none' : '1px solid #E0E0E0',
                                                        boxSizing: 'border-box',
                                                        whiteSpace: 'pre-wrap',
                                                    }}
                                                >
                                                    {cell || 'Type Here'}
                                                </td>
                                            ))
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                );

            default:
                return null;
        }
    };

    return (
        <div
            style={{
                width: 1088,
                height: 1540,
                padding: 64,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'white',
                position: 'relative',
                fontFamily: 'Lato',
            }}
        >
            <div
                style={{
                    fontSize: 64,
                    fontWeight: 400,
                    color: '#0E1328',
                    margin: 25,
                    lineHeight: 1,
                    border: 'none',
                    outline: 'none',
                }}
            >
                {title || 'Terms & Conditions'}
            </div>

            <div style={{ position: 'relative', flex: 1, margin: '0 0 8px' }}>
                <div
                    style={{
                        height: 'calc(100% - 0px)',
                        maxHeight: 'calc(100% - 0px)',
                        width: '100%',
                        padding: 32,
                        overflow: 'hidden',
                        fontSize: '24px',
                        lineHeight: 1.6,
                        color: '#0E1328',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        border: 'none',
                        outline: 'none',
                        position: 'relative',
                        fontFamily: 'Lato',
                        marginTop: 0,
                        textAlign: 'justify',
                        boxSizing: 'border-box',
                    }}
                >
                    {fields && fields.length > 0 ? (
                        <div style={{ margin: '-20px 0 0 0' }}>
                            {fields.map(field => renderField(field))}
                        </div>
                    ) : (
                        <p style={{ margin: '-20px 0 0 0', textAlign: 'justify' }}>
                            Type your Terms & Conditions here…
                        </p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default PolicyPagePreview;