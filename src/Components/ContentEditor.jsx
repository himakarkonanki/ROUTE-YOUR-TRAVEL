import React, { useRef } from 'react';

export default function ContentEditor() {
  const editorRef = useRef(null);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    
    // Get both HTML and plain text from clipboard
    const clipboardData = e.clipboardData || window.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const plainText = clipboardData.getData('text/plain');
    
    // Function to clean and preserve formatting
    const cleanHtml = (html) => {
      // Create a temporary div to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Remove unwanted attributes but preserve structure
      const cleanElement = (element) => {
        // Remove all attributes except essential ones for formatting
        const allowedAttributes = ['style'];
        const attrs = Array.from(element.attributes);
        attrs.forEach(attr => {
          if (!allowedAttributes.includes(attr.name.toLowerCase())) {
            element.removeAttribute(attr.name);
          }
        });
        
        // Clean style attribute to only include safe formatting
        if (element.style) {
          const allowedStyles = [
            'font-weight', 'font-style', 'text-decoration',
            'list-style-type', 'margin-left', 'padding-left'
          ];
          const computedStyles = {};
          
          allowedStyles.forEach(style => {
            const value = element.style.getPropertyValue(style);
            if (value) {
              computedStyles[style] = value;
            }
          });
          
          // Clear all styles and re-add only allowed ones
          element.removeAttribute('style');
          Object.keys(computedStyles).forEach(style => {
            element.style.setProperty(style, computedStyles[style]);
          });
        }
        
        // Recursively clean child elements
        Array.from(element.children).forEach(child => {
          cleanElement(child);
        });
      };
      
      // Clean all elements in the temp div
      Array.from(tempDiv.children).forEach(element => {
        cleanElement(element);
      });
      
      return tempDiv.innerHTML;
    };
    
    // Function to convert plain text to HTML with bullet point detection
    const convertPlainTextToHtml = (text) => {
      const lines = text.split('\n');
      let html = '';
      let inList = false;
      let listType = null;
      
      lines.forEach(line => {
        const trimmedLine = line.trim();
        
        if (!trimmedLine) {
          // Empty line - close any open list
          if (inList) {
            html += listType === 'ul' ? '</ul>' : '</ol>';
            inList = false;
            listType = null;
          }
          html += '<p><br></p>';
          return;
        }
        
        // Check for bullet points (•, *, -, +)
        const bulletMatch = trimmedLine.match(/^[•*\-+]\s+(.+)$/);
        // Check for numbered lists (1., 2., etc.)
        const numberMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
        
        if (bulletMatch) {
          // Handle bullet points
          if (!inList || listType !== 'ul') {
            if (inList) html += listType === 'ul' ? '</ul>' : '</ol>';
            html += '<ul>';
            inList = true;
            listType = 'ul';
          }
          html += `<li>${bulletMatch[1]}</li>`;
        } else if (numberMatch) {
          // Handle numbered lists
          if (!inList || listType !== 'ol') {
            if (inList) html += listType === 'ul' ? '</ul>' : '</ol>';
            html += '<ol>';
            inList = true;
            listType = 'ol';
          }
          html += `<li>${numberMatch[2]}</li>`;
        } else {
          // Regular text - close any open list
          if (inList) {
            html += listType === 'ul' ? '</ul>' : '</ol>';
            inList = false;
            listType = null;
          }
          html += `<p>${trimmedLine}</p>`;
        }
      });
      
      // Close any remaining open list
      if (inList) {
        html += listType === 'ul' ? '</ul>' : '</ol>';
      }
      
      return html;
    };
    
    let contentToInsert = '';
    
    if (htmlData && htmlData.trim()) {
      // If HTML data exists, clean and use it
      contentToInsert = cleanHtml(htmlData);
    } else if (plainText && plainText.trim()) {
      // Convert plain text to formatted HTML
      contentToInsert = convertPlainTextToHtml(plainText);
    }
    
    if (contentToInsert) {
      // Insert the formatted content
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        // Create a temporary container to hold the new content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentToInsert;
        
        // Insert each child node from the temp container
        const fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild);
        }
        
        range.insertNode(fragment);
        
        // Move cursor to the end of inserted content
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Toolbar */}
      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => execCommand('bold')}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          Bold
        </button>
        <button 
          onClick={() => execCommand('italic')}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          Italic
        </button>
        <button 
          onClick={() => execCommand('underline')}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          Underline
        </button>
        <button 
          onClick={() => execCommand('insertOrderedList')}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          Numbered List
        </button>
        <button 
          onClick={() => execCommand('insertUnorderedList')}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          Bullet List
        </button>
        <button 
          onClick={() => execCommand('formatBlock', 'h1')}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          H1
        </button>
        <button 
          onClick={() => execCommand('formatBlock', 'h2')}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          H2
        </button>
        <button 
          onClick={() => execCommand('formatBlock', 'p')}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          Paragraph
        </button>
        <button 
          onClick={() => execCommand('insertHorizontalRule')}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          HR
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onPaste={handlePaste}
        style={{
          minHeight: '600px',
          border: '2px solid black',
          padding: '24px',
          borderRadius: '6px',
          outline: 'none',
          fontFamily: 'Lato',
          lineHeight: '1.6',
          marginTop: 0,
        }}
      >
        <p style={{ marginTop: 0 }}>Type your Terms & Conditions here...</p>
      </div>
      
      {/* Instructions */}
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '4px',
        fontSize: '14px',
        color: '#666'
      }}>
        <strong>Paste Support:</strong>
        <ul style={{ marginTop: '8px', marginBottom: '0' }}>
          <li>Bullet points (•, *, -, +) will be converted to HTML bullet lists</li>
          <li>Numbered lists (1., 2., 3.) will be converted to HTML numbered lists</li>
          <li>Existing HTML formatting will be preserved and cleaned</li>
          <li>Regular text will be formatted as paragraphs</li>
        </ul>
      </div>
    </div>
  );
}