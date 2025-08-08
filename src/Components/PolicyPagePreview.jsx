import React from 'react'
import Footer from './Footer';

function PolicyPagePreview({ data, pageNumber }) {
  if (!data) {
    return <div>No policy data available.</div>;
  }

  return (
    <div
      style={{
        width: '1088px',
        height: 'auto',
        minHeight: '1540px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '64px 64px',
        boxSizing: 'border-box',
        fontFamily: 'Lato',
        position: 'relative', // Ensure Footer absolute positioning works
      }}
    >
      <div
        style={{
          flex: 1,
          marginTop: '32px', // Added margin to match PolicyPage
          marginBottom: '32px', // Added margin to match PolicyPage
          border: 'none',
          padding: '16px',
          borderRadius: '4px',
          overflow: 'visible',
          backgroundColor: '#fff',
          position: 'relative',
        }}
      >
        <div style={{ 
          fontSize: 20, 
          color: 'rgb(14, 19, 40)', // Changed to match PolicyPage text color
          lineHeight: 1.6,
          textAlign: 'justify' // Added to match PolicyPage
        }}>
          {data.fields && data.fields.length > 0 ? (
            data.fields.map(field => {
              if (field.type === 'details') {
                return <div key={field.id} style={{ marginBottom: 16, fontSize: 20, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: field.content }} />;
              } else if (field.type === 'table') {
                return (
                  <table key={field.id} style={{ width: '100%', borderCollapse: 'collapse', margin: '24px 0' }}>
                    <tbody>
                      {field.content.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} style={{
                              border: i === 0 ? 'none' : 'none',
                              borderBottom: i === 0 ? 'none' : '1px solid #e5e7eb',
                              background: i === 0 ? 'rgb(14, 19, 40)' : i % 2 === 0 ? '#f9fafb' : '#fff',
                              color: i === 0 ? '#fff' : '#1f2937',
                              fontWeight: i === 0 ? 600 : 400,
                              padding: '12px 16px',
                              fontSize: i === 0 ? 16 : 20,
                              fontFamily: 'Lato, sans-serif',
                              textAlign: 'left'
                            }}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              } else {
                return null;
              }
            })
          ) : (
            <div style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No policy details provided.</div>
          )}
        </div>
        
      </div>
      
      {/* Footer positioned exactly like in PolicyPage */}
      <Footer />
    </div>
  );
}

export default PolicyPagePreview
