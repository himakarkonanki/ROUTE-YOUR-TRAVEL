import React from 'react'
import Footer from './Footer';

function PolicyPagePreview({ data, pageNumber, isPDFMode = false }) {
  if (!data) {
    return <div>No policy data available.</div>;
  }

  // Define all styles inline for PDF compatibility
  const getInlineStyles = () => ({
    container: {
      width: '1088px',
      height: 'auto',
      minHeight: '1540px',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      padding: '64px 64px',
      boxSizing: 'border-box',
      fontFamily: 'Lato',
      position: 'relative',
    },
    contentWrapper: {
      flex: 1,
      marginTop: '32px',
      marginBottom: '32px',
      border: 'none',
      padding: '16px',
      borderRadius: '4px',
      backgroundColor: '#fff',
      position: 'relative',
      minHeight: '200px',
      height: 'auto',
    },
    contentArea: {
      height: 'auto',
      fontSize: '20px',
      lineHeight: '1.8',
      fontFamily: 'Lato',
      color: 'rgb(14, 19, 40)',
      textAlign: 'justify',
      overflow: 'visible',
      position: 'relative',
      paddingBottom: '20px',
    },
    table: {
      borderCollapse: 'collapse',
      width: '100%',
      margin: '16px 0',
      border: 'none',
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'table',
      position: 'relative',
      clear: 'both',
      fontFamily: 'Lato, sans-serif',
      backgroundColor: '#fff',
      // PDF-specific properties
      pageBreakInside: 'avoid',
      WebkitPrintColorAdjust: 'exact',
      colorAdjust: 'exact',
    },
    headerCell: {
      backgroundColor: 'rgb(14, 19, 40)',
      color: '#ffffff',
      fontWeight: '600',
      fontFamily: 'Lato, sans-serif',
      fontSize: '20px',
      padding: '12px',
      border: 'none',
      textAlign: 'left',
      minHeight: '44px',
      verticalAlign: 'top',
      // PDF-specific properties
      WebkitPrintColorAdjust: 'exact',
      colorAdjust: 'exact',
      MozAppearance: 'none',
      WebkitAppearance: 'none',
      appearance: 'none',
    },
    dataCell: {
      backgroundColor: '#ffffff',
      color: 'rgb(14, 19, 40)',
      fontFamily: 'Lato, sans-serif',
      fontWeight: '400',
      fontSize: '20px',
      padding: '12px 8px 12px 12px',
      border: 'none',
      textAlign: 'left',
      minHeight: '44px',
      verticalAlign: 'top',
      // PDF-specific properties
      WebkitPrintColorAdjust: 'exact',
      colorAdjust: 'exact',
    },
    evenRowCell: {
      backgroundColor: '#f9fafb',
      color: 'rgb(14, 19, 40)',
      fontFamily: 'Lato, sans-serif',
      fontWeight: '400',
      fontSize: '20px',
      padding: '12px 8px 12px 12px',
      border: 'none',
      textAlign: 'left',
      minHeight: '44px',
      verticalAlign: 'top',
      // PDF-specific properties
      WebkitPrintColorAdjust: 'exact',
      colorAdjust: 'exact',
    },
    h1: {
      fontSize: '32px',
      fontWeight: '700',
      lineHeight: '1.2',
      margin: '24px 0 16px 0',
      color: 'rgb(14, 19, 40)',
      fontFamily: 'Lato, sans-serif',
    },
    h2: {
      fontSize: '28px',
      fontWeight: '600',
      lineHeight: '1.3',
      margin: '20px 0 14px 0',
      color: 'rgb(14, 19, 40)',
      fontFamily: 'Lato, sans-serif',
    },
    h3: {
      fontSize: '24px',
      fontWeight: '600',
      lineHeight: '1.4',
      margin: '18px 0 12px 0',
      color: 'rgb(14, 19, 40)',
      fontFamily: 'Lato, sans-serif',
    },
    h4: {
      fontSize: '22px',
      fontWeight: '600',
      lineHeight: '1.4',
      margin: '16px 0 10px 0',
      color: 'rgb(14, 19, 40)',
      fontFamily: 'Lato, sans-serif',
    },
    h5: {
      fontSize: '20px',
      fontWeight: '600',
      lineHeight: '1.4',
      margin: '14px 0 8px 0',
      color: 'rgb(14, 19, 40)',
      fontFamily: 'Lato, sans-serif',
    },
    h6: {
      fontSize: '18px',
      fontWeight: '600',
      lineHeight: '1.4',
      margin: '12px 0 6px 0',
      color: 'rgb(14, 19, 40)',
      fontFamily: 'Lato, sans-serif',
    },
    paragraph: {
      marginBottom: '16px',
      fontSize: '20px',
      lineHeight: '1.6',
      fontFamily: 'Lato, sans-serif',
      color: 'rgb(14, 19, 40)',
    },
    noData: {
      color: '#9CA3AF',
      fontStyle: 'italic',
      fontSize: '20px',
      fontFamily: 'Lato, sans-serif',
    }
  });

  const styles = getInlineStyles();

  // Function to render table with proper header detection
  const renderTable = (field) => {
    const hasHeaders = field.hasHeaders === true;
    
    return (
      <table key={field.id} style={styles.table}>
        {hasHeaders ? (
          // Table with explicit headers
          <>
            <thead>
              <tr>
                {field.content[0].map((cell, j) => (
                  <th key={j} style={styles.headerCell}>
                    <span style={{
                      color: '#ffffff',
                      fontWeight: '600',
                      display: 'block',
                      WebkitPrintColorAdjust: 'exact',
                      colorAdjust: 'exact'
                    }}>
                      {cell && cell.trim() !== '' ? cell : '\u00A0'}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {field.content.slice(1).map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td 
                      key={j} 
                      style={i % 2 === 0 ? styles.dataCell : styles.evenRowCell}
                    >
                      <span style={{
                        color: 'rgb(14, 19, 40)',
                        fontWeight: '400',
                        display: 'block'
                      }}>
                        {cell && cell.trim() !== '' ? cell : '\u00A0'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </>
        ) : (
          // Table without explicit headers - treat first row as header
          <tbody>
            {field.content.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td 
                    key={j} 
                    style={i === 0 ? styles.headerCell : (i % 2 === 1 ? styles.dataCell : styles.evenRowCell)}
                  >
                    <span style={{
                      color: i === 0 ? '#ffffff' : 'rgb(14, 19, 40)',
                      fontWeight: i === 0 ? '600' : '400',
                      display: 'block',
                      WebkitPrintColorAdjust: 'exact',
                      colorAdjust: 'exact'
                    }}>
                      {cell && cell.trim() !== '' ? cell : '\u00A0'}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <div style={styles.contentArea}>
          {data.fields && data.fields.length > 0 ? (
            data.fields.map(field => {
              if (field.type === 'title') {
                const level = field.level || 1;
                
                switch (level) {
                  case 1:
                    return <h1 key={field.id} style={styles.h1} dangerouslySetInnerHTML={{ __html: field.content }} />;
                  case 2:
                    return <h2 key={field.id} style={styles.h2} dangerouslySetInnerHTML={{ __html: field.content }} />;
                  case 3:
                    return <h3 key={field.id} style={styles.h3} dangerouslySetInnerHTML={{ __html: field.content }} />;
                  case 4:
                    return <h4 key={field.id} style={styles.h4} dangerouslySetInnerHTML={{ __html: field.content }} />;
                  case 5:
                    return <h5 key={field.id} style={styles.h5} dangerouslySetInnerHTML={{ __html: field.content }} />;
                  case 6:
                    return <h6 key={field.id} style={styles.h6} dangerouslySetInnerHTML={{ __html: field.content }} />;
                  default:
                    return <h1 key={field.id} style={styles.h1} dangerouslySetInnerHTML={{ __html: field.content }} />;
                }
              } else if (field.type === 'details') {
                return (
                  <div 
                    key={field.id} 
                    style={styles.paragraph} 
                    dangerouslySetInnerHTML={{ __html: field.content }} 
                  />
                );
              } else if (field.type === 'table') {
                return renderTable(field);
              } else {
                return null;
              }
            })
          ) : (
            <div style={styles.noData}>No policy details provided.</div>
          )}
        </div>
      </div>
      
      <Footer pageNumber={pageNumber} />
    </div>
  );
}

export default PolicyPagePreview;
