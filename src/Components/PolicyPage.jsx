import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import Toolbar from './Toolbar';
import Footer from './Footer';
import more from '../assets/icons/more_horiz.svg';
import EditorBar from './EditorBar';
import ColumnEditorBar from './ColumnEditorBar'; // Import the new ColumnEditorBar

const PolicyPage = forwardRef((props, ref) => {
  // Hide EditorBar/ColumnEditorBar overlays on unmount (e.g., when switching to Preview Pane)
  useEffect(() => {
    return () => {
      setShowEditorBar(false);
      setShowColumnEditorBar(false);
    };
  }, []);

  // Add effect to hide overlays when isPreview changes to true
  useEffect(() => {
    if (props.isPreview) {
      setShowEditorBar(false);
      setShowColumnEditorBar(false);
      setMoreButtonPosition({ show: false, x: 0, y: 0, row: null, column: null });
      setSelectedRow(null);
      setSelectedCell(null);
    }
  }, [props.isPreview]);

  // Add global click handler to close overlays when clicking outside
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // Only handle clicks if not in preview mode
      if (props.isPreview) return;

      // Check if click is outside editor overlays
      const isClickOnMoreButton = e.target.closest('[data-more-button="true"]');
      const isClickOnEditorBar = e.target.closest('[data-editor-bar="true"]');
      const isClickOnColumnEditorBar = e.target.closest('[data-column-editor-bar="true"]');
      
      // If click is not on any of the overlay elements, hide them
      if (!isClickOnMoreButton && !isClickOnEditorBar && !isClickOnColumnEditorBar) {
        setShowEditorBar(false);
        setShowColumnEditorBar(false);
        setMoreButtonPosition({ show: false, x: 0, y: 0, row: null, column: null });
        setSelectedRow(null);
        setSelectedCell(null);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [props.isPreview]); // Removed state dependencies to avoid initialization issues

  const editorRef = useRef(null);
  const titleRef = useRef(null);
  const [moreButtonPosition, setMoreButtonPosition] = useState({ show: false, x: 0, y: 0, row: null, column: null });
  const [showEditorBar, setShowEditorBar] = useState(false);
  const [showColumnEditorBar, setShowColumnEditorBar] = useState(false);
  const [editorBarPosition, setEditorBarPosition] = useState({ x: 0, y: 0 });
  const [columnEditorBarPosition, setColumnEditorBarPosition] = useState({ x: 0, y: 0 });
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  const placeCursorAtEnd = (element) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  // Helper function to check if content exceeds available height with more precise boundary detection
  const checkContentOverflow = (element) => {
    if (!element) return false;
    
    // Get the actual boundaries
    const containerRect = element.closest('[style*="1088"]').getBoundingClientRect(); // Main container
    
    // Calculate the maximum allowed bottom position (accounting for footer space)
    // Footer typically needs about 60-80px, so we leave that space
    const footerSpace = 80; // Adjust this value to fine-tune where content stops
    const maxAllowedBottom = containerRect.bottom - footerSpace;
    
    // Check if any content exceeds this boundary
    const allChildren = element.querySelectorAll('*');
    for (let child of allChildren) {
      const childRect = child.getBoundingClientRect();
      if (childRect.bottom > maxAllowedBottom) {
        return true; // Content exceeds the allowed area
      }
    }
    
    // Also check the element's own scroll height vs client height as backup
    return element.scrollHeight > element.clientHeight;
  };

  // Helper function to prevent content overflow
  const preventContentOverflow = (element) => {
    if (!element) return;
    
    // If content overflows, remove the last added content
    while (checkContentOverflow(element) && element.lastChild) {
      // Check if the last child is the placeholder text, don't remove it
      if (element.children.length === 1 && 
          element.lastChild.textContent?.includes('Type your Terms & Conditions here')) {
        break;
      }
      element.removeChild(element.lastChild);
    }
  };

 // Replace your existing handleInput and handleKeyDown functions with these fixed versions:

  // Function to notify parent of data changes
  const notifyDataChange = () => {
    if (props.onDataUpdate) {
      const pageData = extractPageData();
      if (pageData) {
        props.onDataUpdate(pageData);
      }
    }
  };

  // Enhanced input handler that also notifies of changes
  const handleInput = (e) => {
    const el = e.target;
    if (!el) return;
    
    // Only restrict input for the main editor, not the title
    if (el === editorRef.current) {
      // Skip overflow check for deletion operations (backspace, delete)
      if (e.inputType && (e.inputType.includes('delete') || e.inputType.includes('Delete'))) {
        // Notify of changes after deletion
        setTimeout(notifyDataChange, 100);
        return; // Don't interfere with deletion operations
      }
      
      // Check if content overflows only for insertion operations
      if (checkContentOverflow(el)) {
        e.preventDefault();
        const sel = window.getSelection();
        if (sel.rangeCount) {
          const r = sel.getRangeAt(0);
          if (r.startOffset > 0) {
            r.setStart(r.startContainer, r.startOffset - 1);
            r.deleteContents();
          }
        }
        return;
      }
      
      // Notify of changes after successful input
      setTimeout(notifyDataChange, 100);
    } else if (el === titleRef.current) {
      // Notify of title changes
      setTimeout(notifyDataChange, 100);
    }
  };

const handleKeyDown = (e) => {
  const el = e.target;
  if (!el || el !== editorRef.current) return;
  
  // Handle Backspace key specifically - don't interfere with normal backspace behavior
  if (e.key === 'Backspace' || e.key === 'Delete') {
    // Let backspace/delete work normally without any overflow checks
    return;
  }
  
  // Handle Enter key specifically
  if (e.key === 'Enter') {
    e.preventDefault();
    
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    
    const r = sel.getRangeAt(0);
    const currentNode = sel.anchorNode;
    
    // Check if we're inside a list item
    let listItem = currentNode;
    while (listItem && listItem.nodeType !== Node.ELEMENT_NODE) {
      listItem = listItem.parentNode;
    }
    
    // Find the closest list item
    while (listItem && listItem.tagName !== 'LI') {
      listItem = listItem.parentNode;
      if (listItem === el) break; // Don't go beyond the editor
    }
    
    if (listItem && listItem.tagName === 'LI') {
      // We're inside a list item
      const list = listItem.parentNode; // ul or ol
      const isEmptyListItem = listItem.textContent.trim() === '';
      
      if (isEmptyListItem) {
        // If the list item is empty, exit the list and create a paragraph
        e.preventDefault();
        
        // Remove the empty list item
        listItem.remove();
        
        // Create a new paragraph after the list
        const newP = document.createElement('p');
        newP.innerHTML = '<br>';
        Object.assign(newP.style, {
          margin: '0',
          fontSize: '24px',
          lineHeight: '1.6',
          fontFamily: 'Lato',
          color: '#0E1328',
          textAlign: 'justify',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        });
        
        // Insert the paragraph after the list
        if (list.nextSibling) {
          list.parentNode.insertBefore(newP, list.nextSibling);
        } else {
          list.parentNode.appendChild(newP);
        }
        
        // If the list is now empty, remove it
        if (list.children.length === 0) {
          list.remove();
        }
        
        // Place cursor in the new paragraph
        const range = document.createRange();
        range.setStart(newP, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        
        // Notify of changes
        setTimeout(notifyDataChange, 100);
        
        return;
      } else {
        // Create a new list item
        const newLi = document.createElement('li');
        newLi.innerHTML = '<br>';
        Object.assign(newLi.style, {
          margin: '0 0 8px 0',
          fontSize: '24px',
          lineHeight: '1.6',
          fontFamily: 'Lato',
          color: '#0E1328',
          textAlign: 'justify',
          display: 'list-item',
        });
        
        // Check if adding this list item would cause overflow
        const tempLi = newLi.cloneNode(true);
        Object.assign(tempLi.style, {
          visibility: 'hidden',
          position: 'absolute',
        });
        
        // Insert temporarily to test
        if (listItem.nextSibling) {
          list.insertBefore(tempLi, listItem.nextSibling);
        } else {
          list.appendChild(tempLi);
        }
        
        if (checkContentOverflow(el)) {
          // Remove temp element and don't allow the new list item
          tempLi.remove();
          return;
        }
        
        // Remove temp element and insert actual list item
        tempLi.remove();
        
        if (listItem.nextSibling) {
          list.insertBefore(newLi, listItem.nextSibling);
        } else {
          list.appendChild(newLi);
        }
        
        // Place cursor in the new list item
        const range = document.createRange();
        range.setStart(newLi, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        
        // Notify of changes
        setTimeout(notifyDataChange, 100);
        
        return;
      }
    } else {
      // We're not in a list, handle normal paragraph creation
      // Check if adding a new line would cause overflow
      if (!sel.rangeCount) return;
      
      const r = sel.getRangeAt(0);
      
      // Create a temporary paragraph to test if it would fit
      const tempP = document.createElement('p');
      tempP.innerHTML = '<br>'; // Use <br> instead of &nbsp; for better cursor positioning
      Object.assign(tempP.style, {
        margin: 0,
        fontSize: '24px',
        lineHeight: '1.6',
        fontFamily: 'Lato',
        color: '#0E1328',
        textAlign: 'justify',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        visibility: 'hidden', // Hide during test
        position: 'absolute', // Remove from document flow during test
      });
      
      // Insert temp element to test overflow
      r.insertNode(tempP);
      
      // Check if this causes overflow using same method as table
      if (checkContentOverflow(el)) {
        // Remove the temp element and don't allow the Enter
        tempP.remove();
        return;
      }
      
      // Remove temp element and create actual paragraph
      tempP.remove();
      
      // Create the actual new paragraph
      const p = document.createElement('p');
      p.innerHTML = '<br>'; // Use <br> for proper cursor positioning
      Object.assign(p.style, {
        margin: 0,
        fontSize: '24px',
        lineHeight: '1.6',
        fontFamily: 'Lato',
        color: '#0E1328',
        textAlign: 'justify',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      });
      
      r.insertNode(p);
      
      // Position cursor at the beginning of the new paragraph
      r.setStart(p, 0);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
      
      // Notify of changes
      setTimeout(notifyDataChange, 100);
    }
  }
  
  // Handle other keys that might add content - but exclude navigation and deletion keys
  else if (e.key.length === 1 || e.key === 'Space') {
    // For regular character input, use delayed check to avoid interfering with typing
    setTimeout(() => {
      if (checkContentOverflow(el)) {
        // Only undo if this was actually a content addition (not deletion)
        const sel = window.getSelection();
        if (sel.rangeCount) {
          const r = sel.getRangeAt(0);
          if (r.startOffset > 0) {
            r.setStart(r.startContainer, r.startOffset - 1);
            r.deleteContents();
          }
        }
      }
    }, 0);
  }
};


const handlePaste = (e) => {
  e.preventDefault();
  
  // Get both HTML and plain text from clipboard
  const clipboardData = e.clipboardData || window.clipboardData;
  const htmlData = clipboardData.getData('text/html');
  const plainText = clipboardData.getData('text/plain');
  
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const r = sel.getRangeAt(0);
  r.deleteContents();

  // For title, just insert plain text without paragraph elements
  if (e.target === titleRef.current) {
    const textNode = document.createTextNode(plainText.replace(/\n/g, ' '));
    r.insertNode(textNode);
    r.setStartAfter(textNode);
    r.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r);
    return;
  }

  // Function to clean and preserve formatting from HTML
  const cleanHtml = (html) => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Remove unwanted attributes but preserve structure
    const cleanElement = (element) => {
      // Remove all attributes except essential ones for formatting
      const allowedAttributes = ['style', 'colspan'];
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

  // Apply PolicyPage styles to elements
  const applyPolicyPageStyles = (element) => {
    const tagName = element.tagName.toLowerCase();
    
    switch (tagName) {
      case 'p':
        Object.assign(element.style, {
          margin: '0',
          fontSize: '24px',
          lineHeight: '1.6',
          fontFamily: 'Lato',
          color: '#0E1328',
          textAlign: 'justify',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        });
        break;
      case 'ul':
        Object.assign(element.style, {
          margin: '0 0 16px 0',
          paddingLeft: '20px',
          fontSize: '24px',
          lineHeight: '1.6',
          fontFamily: 'Lato',
          color: '#0E1328',
          listStyleType: 'disc',
          listStylePosition: 'outside',
        });
        break;
      case 'ol':
        Object.assign(element.style, {
          margin: '0 0 16px 0',
          paddingLeft: '20px',
          fontSize: '24px',
          lineHeight: '1.6',
          fontFamily: 'Lato',
          color: '#0E1328',
          listStyleType: 'decimal',
          listStylePosition: 'outside',
        });
        break;
      case 'li':
        Object.assign(element.style, {
          margin: '0 0 8px 0',
          fontSize: '24px',
          lineHeight: '1.6',
          fontFamily: 'Lato',
          color: '#0E1328',
          textAlign: 'justify',
          display: 'list-item',
        });
        break;
    }
    
    // Recursively apply styles to children
    Array.from(element.children).forEach(child => {
      applyPolicyPageStyles(child);
    });
  };

  // For editor content with overflow checking
  const editorElement = editorRef.current;
  let contentToInsert = '';
  
  if (htmlData && htmlData.trim()) {
    // If HTML data exists, clean and use it
    contentToInsert = cleanHtml(htmlData);
  } else if (plainText && plainText.trim()) {
    // Convert plain text to formatted HTML
    contentToInsert = convertPlainTextToHtml(plainText);
  }
  
  if (contentToInsert) {
    // Create a temporary container to process the content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contentToInsert;
    
    // Apply PolicyPage styles to all elements
    Array.from(tempDiv.children).forEach(child => {
      applyPolicyPageStyles(child);
    });
    
    // Process each element with overflow checking
    const elementsToInsert = Array.from(tempDiv.children);
    let insertedElements = [];
    
    for (let element of elementsToInsert) {
      // Test if this element fits
      const testElement = element.cloneNode(true);
      Object.assign(testElement.style, {
        visibility: 'hidden',
        position: 'absolute',
      });
      
      r.insertNode(testElement);
      
      if (checkContentOverflow(editorElement)) {
        testElement.remove();
        
        // If it's a text element, try to fit partial content
        if (element.tagName === 'P') {
          const textContent = element.textContent || element.innerText || '';
          const words = textContent.split(' ');
          let fittingText = '';
          
          for (let i = 0; i < words.length; i++) {
            const testText = fittingText + (fittingText ? ' ' : '') + words[i];
            const tempP = document.createElement('p');
            tempP.textContent = testText;
            applyPolicyPageStyles(tempP);
            Object.assign(tempP.style, {
              visibility: 'hidden',
              position: 'absolute',
            });
            
            r.insertNode(tempP);
            
            if (checkContentOverflow(editorElement)) {
              tempP.remove();
              break;
            } else {
              fittingText = testText;
              tempP.remove();
            }
          }
          
          if (fittingText) {
            const finalP = document.createElement('p');
            finalP.textContent = fittingText;
            applyPolicyPageStyles(finalP);
            
            r.insertNode(finalP);
            r.setStartAfter(finalP);
            insertedElements.push(finalP);
          }
        }
        break; // Stop inserting more elements
      } else {
        testElement.remove();
        r.insertNode(element);
        r.setStartAfter(element);
        insertedElements.push(element);
      }
    }
    
    if (insertedElements.length > 0) {
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
      
      // Notify of changes after paste
      setTimeout(notifyDataChange, 100);
    }
  }
};


  // Column manipulation functions
  const addColumnLeft = () => {
    if (!selectedCell) return;

    const table = selectedCell.closest('table');
    if (!table) return;

    const columnIndex = Array.from(selectedCell.parentNode.children).indexOf(selectedCell);

    // Add header cell
    const thead = table.querySelector('thead');
    if (thead) {
      const headerRow = thead.querySelector('tr');
      if (headerRow) {
        const newTh = document.createElement('th');
        newTh.textContent = 'Table Title';
        
        // Add click handler for the new header cell
        if (!props.isPreview) {
          newTh.addEventListener('click', (e) => handleColumnClick(e, newTh));
        }
        
        // Calculate proper styling including border radius
        const isFirstColumn = columnIndex === 0;
        const styleObj = {
          backgroundColor: '#0E1328',
          color: props.isPreview ? '#9CA3AF' : '#FFF',
          fontWeight: 400,
          padding: '12px',
          fontSize: '20px',
          fontFamily: 'Lato',
          textAlign: 'left',
          border: 'none',
          boxSizing: 'border-box',
          cursor: props.isPreview ? 'default' : 'pointer',
        };
        
        // Add border radius for the new first column
        if (isFirstColumn) {
          styleObj.borderTopLeftRadius = '6px';
          // Remove border radius from the old first column
          if (headerRow.children[columnIndex]) {
            headerRow.children[columnIndex].style.borderTopLeftRadius = '0';
          }
        }
        
        Object.assign(newTh.style, styleObj);
        
        // Insert the new header cell at the correct position
        headerRow.insertBefore(newTh, headerRow.children[columnIndex]);
      }
    }

    // Add cells to body rows
    const tbody = table.querySelector('tbody');
    if (tbody) {
      Array.from(tbody.querySelectorAll('tr')).forEach(row => {
        const isSpannedRow = row.children[0]?.colSpan > 1;
        
        if (isSpannedRow) {
          // Increase colspan for spanned rows
          const spannedCell = row.children[0];
          spannedCell.colSpan = (spannedCell.colSpan || 1) + 1;
        } else {
          // Add regular cell
          const newTd = document.createElement('td');
          newTd.textContent = 'Type Here';
          Object.assign(newTd.style, {
            padding: '12px',
            fontSize: '24px',
            fontFamily: 'Lato',
            color: '#0E1328',
            borderBottom: '1px solid #E0E0E0',
            boxSizing: 'border-box',
          });
          
          // Insert the new cell at the correct position
          row.insertBefore(newTd, row.children[columnIndex]);
        }
      });
    }

    // Check if table addition causes overflow
    setTimeout(() => {
      if (checkContentOverflow(editorRef.current)) {
        preventContentOverflow(editorRef.current);
      }
      // Notify of changes
      notifyDataChange();
    }, 0);

    hideMoreButton();
  };

  const addColumnRight = () => {
    if (!selectedCell) return;

    const table = selectedCell.closest('table');
    if (!table) return;

    const columnIndex = Array.from(selectedCell.parentNode.children).indexOf(selectedCell);

    // Add header cell
    const thead = table.querySelector('thead');
    if (thead) {
      const headerRow = thead.querySelector('tr');
      if (headerRow) {
        const newTh = document.createElement('th');
        newTh.textContent = 'Table Title';
        Object.assign(newTh.style, {
          backgroundColor: '#0E1328',
          color: '#FFF',
          fontWeight: 400,
          padding: '12px',
          fontSize: '20px',
          fontFamily: 'Lato',
          textAlign: 'left',
          border: 'none',
          boxSizing: 'border-box',
        });
        
        if (columnIndex + 1 < headerRow.children.length) {
          headerRow.insertBefore(newTh, headerRow.children[columnIndex + 1]);
        } else {
          headerRow.appendChild(newTh);
        }
      }
    }

    // Add cells to body rows
    const tbody = table.querySelector('tbody');
    if (tbody) {
      Array.from(tbody.querySelectorAll('tr')).forEach(row => {
        const isSpannedRow = row.children[0]?.colSpan > 1;
        
        if (isSpannedRow) {
          // Increase colspan for spanned rows
          const spannedCell = row.children[0];
          spannedCell.colSpan = (spannedCell.colSpan || 1) + 1;
        } else {
          // Add regular cell
          const newTd = document.createElement('td');
          newTd.textContent = 'Type Here';
          Object.assign(newTd.style, {
            padding: '12px',
            fontSize: '24px',
            fontFamily: 'Lato',
            color: '#0E1328',
            borderBottom: '1px solid #E0E0E0',
            boxSizing: 'border-box',
          });
          
          if (columnIndex + 1 < row.children.length) {
            row.insertBefore(newTd, row.children[columnIndex + 1]);
          } else {
            row.appendChild(newTd);
          }
        }
      });
    }

    // Check if table addition causes overflow
    setTimeout(() => {
      if (checkContentOverflow(editorRef.current)) {
        preventContentOverflow(editorRef.current);
      }
    }, 0);

    hideMoreButton();
  };

  const removeColumn = () => {
    if (!selectedCell) return;

    const table = selectedCell.closest('table');
    if (!table) return;

    const columnIndex = Array.from(selectedCell.parentNode.children).indexOf(selectedCell);
    
    // Check if it's the last column
    const headerRow = table.querySelector('thead tr');
    if (headerRow && headerRow.children.length <= 1) {
      alert('Cannot remove the last column. Use "Remove table" to delete the entire table.');
      hideMoreButton();
      return;
    }

    // Remove header cell
    const thead = table.querySelector('thead');
    if (thead) {
      const headerRow = thead.querySelector('tr');
      if (headerRow && headerRow.children[columnIndex]) {
        headerRow.removeChild(headerRow.children[columnIndex]);
      }
    }

    // Remove cells from body rows
    const tbody = table.querySelector('tbody');
    if (tbody) {
      Array.from(tbody.querySelectorAll('tr')).forEach(row => {
        const isSpannedRow = row.children[0]?.colSpan > 1;
        
        if (isSpannedRow) {
          // Decrease colspan for spanned rows
          const spannedCell = row.children[0];
          const currentColspan = spannedCell.colSpan || 1;
          if (currentColspan > 1) {
            spannedCell.colSpan = currentColspan - 1;
          }
        } else {
          // Remove regular cell
          if (row.children[columnIndex]) {
            row.removeChild(row.children[columnIndex]);
          }
        }
      });
    }

    hideMoreButton();
  };

  // Row manipulation functions (existing)
  const addRowAbove = () => {
    if (!selectedRow) return;

    const newRow = document.createElement('tr');
    newRow.addEventListener('click', (e) => handleRowClick(e, newRow));
    Object.assign(newRow.style, {
      cursor: 'pointer',
      position: 'relative',
    });

    // Determine number of columns based on the selected row
    const cellCount = selectedRow.children.length;
    const isSpannedRow = selectedRow.children[0]?.colSpan > 1;

    if (isSpannedRow) {
      // If it's a spanned row (like "Enter the details..."), create a similar structure
      const td = document.createElement('td');
      td.colSpan = cellCount > 1 ? cellCount : 2;
      td.textContent = 'Type Here';
      Object.assign(td.style, {
        padding: '12px',
        fontSize: '24px',
        fontFamily: 'Lato',
        color: '#0E1328',
        borderBottom: '1px solid #E0E0E0',
        boxSizing: 'border-box',
      });
      newRow.appendChild(td);
    } else {
      // Regular row with individual cells
      for (let j = 0; j < cellCount; j++) {
        const td = document.createElement('td');
        td.textContent = 'Type Here';
        Object.assign(td.style, {
          padding: '12px',
          fontSize: '24px',
          fontFamily: 'Lato',
          color: '#0E1328',
          borderBottom: '1px solid #E0E0E0',
          boxSizing: 'border-box',
        });
        newRow.appendChild(td);
      }
    }

    selectedRow.parentNode.insertBefore(newRow, selectedRow);

    // Check if table addition causes overflow
    setTimeout(() => {
      if (checkContentOverflow(editorRef.current)) {
        preventContentOverflow(editorRef.current);
      }
    }, 0);

    hideMoreButton();
  };

  const addRowBelow = () => {
    if (!selectedRow) return;

    const newRow = document.createElement('tr');
    newRow.addEventListener('click', (e) => handleRowClick(e, newRow));
    Object.assign(newRow.style, {
      cursor: 'pointer',
      position: 'relative',
    });

    // Determine number of columns based on the selected row
    const cellCount = selectedRow.children.length;
    const isSpannedRow = selectedRow.children[0]?.colSpan > 1;

    if (isSpannedRow) {
      // If it's a spanned row, create a similar structure
      const td = document.createElement('td');
      td.colSpan = cellCount > 1 ? cellCount : 2;
      td.textContent = 'Type Here';
      Object.assign(td.style, {
        padding: '12px',
        fontSize: '24px',
        fontFamily: 'Lato',
        color: '#0E1328',
        borderBottom: '1px solid #E0E0E0',
        boxSizing: 'border-box',
      });
      newRow.appendChild(td);
    } else {
      // Regular row with individual cells
      for (let j = 0; j < cellCount; j++) {
        const td = document.createElement('td');
        td.textContent = 'Type Here';
        Object.assign(td.style, {
          padding: '12px',
          fontSize: '24px',
          fontFamily: 'Lato',
          color: '#0E1328',
          borderBottom: '1px solid #E0E0E0',
          boxSizing: 'border-box',
        });
        newRow.appendChild(td);
      }
    }

    if (selectedRow.nextSibling) {
      selectedRow.parentNode.insertBefore(newRow, selectedRow.nextSibling);
    } else {
      selectedRow.parentNode.appendChild(newRow);
    }

    // Check if table addition causes overflow
    setTimeout(() => {
      if (checkContentOverflow(editorRef.current)) {
        preventContentOverflow(editorRef.current);
      }
    }, 0);

    hideMoreButton();
  };

  const removeRow = () => {
    if (!selectedRow) return;

    const tbody = selectedRow.parentNode;

    // Don't allow removing if it's the last row in tbody
    if (tbody.children.length <= 1) {
      alert('Cannot remove the last row. Use "Remove table" to delete the entire table.');
      hideMoreButton();
      return;
    }

    selectedRow.remove();
    hideMoreButton();
  };

  const removeTable = () => {
    if (!selectedRow && !selectedCell) return;

    // Find the table that contains this row or cell
    let table = selectedRow || selectedCell;
    while (table && table.tagName !== 'TABLE') {
      table = table.parentNode;
    }

    if (table) {
      table.remove();
    }
    hideMoreButton();
  };

  // Enhanced click handlers to detect both row and column clicks
  const handleRowClick = (e, row) => {
    // Don't show editor controls in preview mode
    if (props.isPreview) {
      return;
    }

    e.stopPropagation();
    
    const clickedElement = e.target;
    const isHeaderCell = clickedElement.tagName === 'TH';
    const isCell = clickedElement.tagName === 'TD' || clickedElement.tagName === 'TH';
    
    if (isCell && isHeaderCell) {
      // Clicked on header cell - show column editor
      handleColumnClick(e, clickedElement);
      return;
    }
    
    // Regular row click behavior
    const rect = row.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();

    setSelectedRow(row);
    setSelectedCell(null);
    let x = rect.left - editorRect.left - 56;
    if (x < 8) x = 8;
    setMoreButtonPosition({
      show: true,
      x,
      y: rect.top - editorRect.top + rect.height / 2 - 20,
      row: row,
      column: null
    });
  };

  const handleColumnClick = (e, cell) => {
    // Don't show editor controls in preview mode
    if (props.isPreview) {
      return;
    }

    e.stopPropagation();
    
    const rect = cell.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();

    setSelectedCell(cell);
    setSelectedRow(null);
    setMoreButtonPosition({
      show: true,
      x: rect.left - editorRect.left + rect.width / 2 - 16,
      y: rect.bottom - editorRect.top + 8,
      row: null,
      column: cell
    });
  };

  const hideMoreButton = () => {
    setMoreButtonPosition({ show: false, x: 0, y: 0, row: null, column: null });
    setShowEditorBar(false);
    setShowColumnEditorBar(false);
    setSelectedRow(null);
    setSelectedCell(null);
  };

  const handleMoreButtonClick = (e) => {
    // Don't show editor controls in preview mode
    if (props.isPreview) {
      return;
    }

    e.stopPropagation();
    
    if (moreButtonPosition.row) {
      // Row context - show EditorBar
      setEditorBarPosition({
        x: moreButtonPosition.x,
        y: moreButtonPosition.y
      });
      setShowEditorBar(true);
      setShowColumnEditorBar(false);
    } else if (moreButtonPosition.column) {
      // Column context - show ColumnEditorBar
      setColumnEditorBarPosition({
        x: moreButtonPosition.x,
        y: moreButtonPosition.y
      });
      setShowColumnEditorBar(true);
      setShowEditorBar(false);
    }
    
    setMoreButtonPosition(prev => ({ ...prev, show: false }));
  };

  const insertTitle = () => {
    const el = editorRef.current;
    if (!el.contains(window.getSelection().anchorNode)) {
      el.focus();
      placeCursorAtEnd(el);
    }

    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const r = sel.getRangeAt(0);

    const h2 = document.createElement('h2');
    h2.textContent = 'Your Custom Title';
    Object.assign(h2.style, {
      fontSize: '28px',
      margin: '16px 0 8px',
      fontFamily: 'Lato',
      color: '#0E1328',
    });

    r.insertNode(h2);
    r.setStartAfter(h2);
    r.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r);

    // Check if title addition causes overflow
    setTimeout(() => {
      if (checkContentOverflow(el)) {
        h2.remove();
      } else {
        // Notify of changes only if title was successfully added
        notifyDataChange();
      }
    }, 0);
  };

  const insertTable = () => {
    const el = editorRef.current;
    if (!el.contains(window.getSelection().anchorNode)) {
      el.focus();
      placeCursorAtEnd(el);
    }

    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const r = sel.getRangeAt(0);

    // Create table element first to test if it will fit
    const table = document.createElement('table');
    Object.assign(table.style, {
      width: '100%',
      maxWidth: '100%',
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
      margin: '16px 0',
      boxSizing: 'border-box',
      wordBreak: 'break-word',
      visibility: 'hidden', // Hide during testing
      position: 'absolute',
    });

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    ['Table Title', 'Table Title'].forEach((text, idx, arr) => {
      const th = document.createElement('th');
      th.textContent = text;
      // Add click handler for header cells to enable column operations only if not in preview
      if (!props.isPreview) {
        th.addEventListener('click', (e) => handleColumnClick(e, th));
      }
      const styleObj = {
        backgroundColor: '#0E1328',
        color: props.isPreview ? '#9CA3AF' : '#FFF',
        fontWeight: 400,
        padding: '12px',
        fontSize: '20px',
        fontFamily: 'Lato',
        textAlign: 'left',
        border: 'none',
        boxSizing: 'border-box',
        cursor: props.isPreview ? 'default' : 'pointer', // Add cursor pointer only when not in preview
      };
      if (idx === 0) styleObj.borderTopLeftRadius = '6px';
      if (idx === arr.length - 1) styleObj.borderTopRightRadius = '6px';
      Object.assign(th.style, styleObj);
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let i = 0; i < 3; i++) {
      const tr = document.createElement('tr');
      if (!props.isPreview) {
        tr.addEventListener('click', (e) => handleRowClick(e, tr));
      }
      Object.assign(tr.style, {
        cursor: props.isPreview ? 'default' : 'pointer',
        position: 'relative',
      });

      for (let j = 0; j < 2; j++) {
        const td = document.createElement('td');
        td.textContent = 'Type Here';
        Object.assign(td.style, {
          padding: '12px',
          fontSize: '24px',
          fontFamily: 'Lato',
          color: '#0E1328',
          borderBottom: '1px solid #E0E0E0',
          boxSizing: 'border-box',
        });
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    const lastRow = document.createElement('tr');
    if (!props.isPreview) {
      lastRow.addEventListener('click', (e) => handleRowClick(e, lastRow));
    }
    Object.assign(lastRow.style, {
      cursor: props.isPreview ? 'default' : 'pointer',
      position: 'relative',
    });

    const lastCell = document.createElement('td');
    lastCell.colSpan = 2;
    lastCell.textContent = 'Enter the details…';
    Object.assign(lastCell.style, {
      padding: '12px',
      fontSize: '24px',
      fontFamily: 'Lato',
      color: '#0E1328',
      boxSizing: 'border-box',
    });
    lastRow.appendChild(lastCell);
    tbody.appendChild(lastRow);

    table.appendChild(tbody);

    // Test insert the table to check for overflow
    r.insertNode(table);
    
    // Check if table would cause overflow
    if (checkContentOverflow(el)) {
      // Remove the test table and don't allow insertion
      table.remove();
      return; // Don't insert the table
    }

    // Remove the test table and insert the actual visible table
    table.remove();

    // Create the actual table with proper visibility and event handlers
    const actualTable = document.createElement('table');
    Object.assign(actualTable.style, {
      width: '100%',
      maxWidth: '100%',
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
      margin: '16px 0',
      boxSizing: 'border-box',
      wordBreak: 'break-word',
    });

    const actualThead = document.createElement('thead');
    const actualHeadRow = document.createElement('tr');
    ['Table Title', 'Table Title'].forEach((text, idx, arr) => {
      const th = document.createElement('th');
      th.textContent = text;
      // Add click handler for header cells to enable column operations only if not in preview
      if (!props.isPreview) {
        th.addEventListener('click', (e) => handleColumnClick(e, th));
      }
      const styleObj = {
        backgroundColor: '#0E1328',
        color: props.isPreview ? '#9CA3AF' : '#FFF',
        fontWeight: 400,
        padding: '12px',
        fontSize: '20px',
        fontFamily: 'Lato',
        textAlign: 'left',
        border: 'none',
        boxSizing: 'border-box',
        cursor: props.isPreview ? 'default' : 'pointer',
      };
      if (idx === 0) styleObj.borderTopLeftRadius = '6px';
      if (idx === arr.length - 1) styleObj.borderTopRightRadius = '6px';
      Object.assign(th.style, styleObj);
      actualHeadRow.appendChild(th);
    });
    actualThead.appendChild(actualHeadRow);
    actualTable.appendChild(actualThead);

    const actualTbody = document.createElement('tbody');
    for (let i = 0; i < 3; i++) {
      const tr = document.createElement('tr');
      if (!props.isPreview) {
        tr.addEventListener('click', (e) => handleRowClick(e, tr));
      }
      Object.assign(tr.style, {
        cursor: props.isPreview ? 'default' : 'pointer',
        position: 'relative',
      });

      for (let j = 0; j < 2; j++) {
        const td = document.createElement('td');
        td.textContent = 'Type Here';
        Object.assign(td.style, {
          padding: '12px',
          fontSize: '24px',
          fontFamily: 'Lato',
          color: '#0E1328',
          borderBottom: '1px solid #E0E0E0',
          boxSizing: 'border-box',
        });
        tr.appendChild(td);
      }
      actualTbody.appendChild(tr);
    }

    const actualLastRow = document.createElement('tr');
    if (!props.isPreview) {
      actualLastRow.addEventListener('click', (e) => handleRowClick(e, actualLastRow));
    }
    Object.assign(actualLastRow.style, {
      cursor: props.isPreview ? 'default' : 'pointer',
      position: 'relative',
    });

    const actualLastCell = document.createElement('td');
    actualLastCell.colSpan = 2;
    actualLastCell.textContent = 'Enter the details…';
    Object.assign(actualLastCell.style, {
      padding: '12px',
      fontSize: '24px',
      fontFamily: 'Lato',
      color: '#0E1328',
      boxSizing: 'border-box',
    });
    actualLastRow.appendChild(actualLastCell);
    actualTbody.appendChild(actualLastRow);

    actualTable.appendChild(actualTbody);

    // Insert the actual table
    r.insertNode(actualTable);
    r.setStartAfter(actualTable);
    r.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r);
    
    // Notify of changes after table insertion
    setTimeout(notifyDataChange, 100);
  };

  // Data extraction functions for preview (existing)
  const extractPageData = () => {
    const editorElement = editorRef.current;
    const titleElement = titleRef.current;

    if (!editorElement || !titleElement) return null;

    // Extract title
    const title = titleElement.textContent || titleElement.innerText || 'Terms & Conditions';

    // Extract content from editor
    const fields = [];
    let fieldId = 1;

    // Process all child nodes in the editor
    const processNode = (node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();

        switch (tagName) {
          case 'h2': {
            fields.push({
              id: fieldId++,
              type: 'title',
              content: node.textContent || node.innerText || ''
            });
            break;
          }

          case 'p': {
            const textContent = node.textContent || node.innerText || '';
            if (textContent.trim() && !textContent.includes('Type your Terms & Conditions here')) {
              fields.push({
                id: fieldId++,
                type: 'details',
                content: node.outerHTML || node.innerHTML || textContent
              });
            }
            break;
          }
          case 'ul':
          case 'ol':
            // For lists, preserve the full HTML structure
            const listContent = node.outerHTML || '';
            if (listContent.trim()) {
              fields.push({
                id: fieldId++,
                type: 'details',
                content: listContent
              });
            }
            break;

          case 'table': {
            const tableData = extractTableData(node);
            if (tableData && tableData.length > 0) {
              fields.push({
                id: fieldId++,
                type: 'table',
                content: tableData
              });
            }
            break;
          }

          default: {
            // For other elements, check if they have text content
            const content = node.textContent || node.innerText || '';
            if (content.trim() && !content.includes('Type your Terms & Conditions here')) {
              // Preserve HTML structure for complex elements
              const htmlContent = node.outerHTML || node.innerHTML || content;
              fields.push({
                id: fieldId++,
                type: 'details',
                content: htmlContent
              });
            }
            break;
          }
        }
      }
    };

    // Process all children of the editor
    Array.from(editorElement.childNodes).forEach(processNode);

    return {
      title,
      fields
    };
  };

  // Helper function to extract table data
  const extractTableData = (tableElement) => {
    const rows = [];

    // Extract header row from thead
    const thead = tableElement.querySelector('thead');
    if (thead) {
      const headerRow = thead.querySelector('tr');
      if (headerRow) {
        const headerCells = Array.from(headerRow.querySelectorAll('th')).map(th =>
          th.textContent || th.innerText || ''
        );
        rows.push(headerCells);
      }
    }

    // Extract body rows from tbody
    const tbody = tableElement.querySelector('tbody');
    if (tbody) {
      const bodyRows = Array.from(tbody.querySelectorAll('tr'));
      bodyRows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td')).map(td => {
          const content = td.textContent || td.innerText || '';

          // Return content directly (let preview handle colspan)
          return content;
        });

        rows.push(cells);
      });
    }

    return rows;
  };

  // Function to restore page data (for undo/redo functionality)
  const restorePageData = (data) => {
    if (!data || !editorRef.current || !titleRef.current) return;

    // Restore title
    if (data.title) {
      titleRef.current.textContent = data.title;
    }

    // Restore editor content
    if (data.fields && Array.isArray(data.fields)) {
      // Clear existing content
      editorRef.current.innerHTML = '';

      // Reconstruct content from fields
      data.fields.forEach(field => {
        let element;

        switch (field.type) {
          case 'title':
            element = document.createElement('h2');
            element.textContent = field.content;
            Object.assign(element.style, {
              fontSize: '28px',
              margin: '16px 0 8px',
              fontFamily: 'Lato',
              color: '#0E1328',
            });
            break;

          case 'details':
            // Check if content is HTML or plain text
            if (field.content.includes('<')) {
              // HTML content - create a temporary div to parse it
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = field.content;
              
              // Extract the first element (should be the main content)
              const contentElement = tempDiv.firstElementChild;
              if (contentElement) {
                element = contentElement;
                // Reapply styles to ensure consistency
                applyPolicyPageStyles(element);
              }
            } else {
              // Plain text content
              element = document.createElement('p');
              element.textContent = field.content;
              Object.assign(element.style, {
                margin: '0',
                fontSize: '24px',
                lineHeight: '1.6',
                fontFamily: 'Lato',
                color: '#0E1328',
                textAlign: 'justify',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              });
            }
            break;

          case 'table':
            // Reconstruct table from table data
            element = reconstructTable(field.content);
            break;

          default:
            // Fallback for unknown types
            element = document.createElement('p');
            element.textContent = field.content || '';
            Object.assign(element.style, {
              margin: '0',
              fontSize: '24px',
              lineHeight: '1.6',
              fontFamily: 'Lato',
              color: '#0E1328',
              textAlign: 'justify',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            });
            break;
        }

        if (element) {
          editorRef.current.appendChild(element);
        }
      });

      // If no content was restored, add the placeholder
      if (editorRef.current.children.length === 0) {
        const placeholder = document.createElement('p');
        placeholder.textContent = 'Type your Terms & Conditions here…';
        Object.assign(placeholder.style, {
          margin: '-20px 0 0 0',
          textAlign: 'justify',
          fontSize: '24px',
          lineHeight: '1.6',
          fontFamily: 'Lato',
          color: '#0E1328',
        });
        editorRef.current.appendChild(placeholder);
      }
    }
  };

  // Helper function to reconstruct table from table data
  const reconstructTable = (tableData) => {
    if (!tableData || !Array.isArray(tableData) || tableData.length === 0) return null;

    const table = document.createElement('table');
    Object.assign(table.style, {
      width: '100%',
      maxWidth: '100%',
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
      margin: '16px 0',
      boxSizing: 'border-box',
      wordBreak: 'break-word',
    });

    // Create thead with first row
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    
    const headerData = tableData[0];
    headerData.forEach((cellText, idx) => {
      const th = document.createElement('th');
      th.textContent = cellText;
      
      if (!props.isPreview) {
        th.addEventListener('click', (e) => handleColumnClick(e, th));
      }
      
      const styleObj = {
        backgroundColor: '#0E1328',
        color: props.isPreview ? '#9CA3AF' : '#FFF',
        fontWeight: 400,
        padding: '12px',
        fontSize: '20px',
        fontFamily: 'Lato',
        textAlign: 'left',
        border: 'none',
        boxSizing: 'border-box',
        cursor: props.isPreview ? 'default' : 'pointer',
      };
      
      if (idx === 0) styleObj.borderTopLeftRadius = '6px';
      if (idx === headerData.length - 1) styleObj.borderTopRightRadius = '6px';
      Object.assign(th.style, styleObj);
      headRow.appendChild(th);
    });
    
    thead.appendChild(headRow);
    table.appendChild(thead);

    // Create tbody with remaining rows
    const tbody = document.createElement('tbody');
    
    for (let i = 1; i < tableData.length; i++) {
      const tr = document.createElement('tr');
      if (!props.isPreview) {
        tr.addEventListener('click', (e) => handleRowClick(e, tr));
      }
      Object.assign(tr.style, {
        cursor: props.isPreview ? 'default' : 'pointer',
        position: 'relative',
      });

      const rowData = tableData[i];
      
      // Check if this is a spanned row (single cell with content)
      if (rowData.length === 1 && headerData.length > 1) {
        const td = document.createElement('td');
        td.colSpan = headerData.length;
        td.textContent = rowData[0];
        Object.assign(td.style, {
          padding: '12px',
          fontSize: '24px',
          fontFamily: 'Lato',
          color: '#0E1328',
          boxSizing: 'border-box',
        });
        tr.appendChild(td);
      } else {
        // Regular row with individual cells
        rowData.forEach(cellText => {
          const td = document.createElement('td');
          td.textContent = cellText;
          Object.assign(td.style, {
            padding: '12px',
            fontSize: '24px',
            fontFamily: 'Lato',
            color: '#0E1328',
            borderBottom: '1px solid #E0E0E0',
            boxSizing: 'border-box',
          });
          tr.appendChild(td);
        });
      }
      
      tbody.appendChild(tr);
    }
    
    table.appendChild(tbody);
    return table;
  };

  // Expose both extractPageData and restorePageData via ref
  useImperativeHandle(ref, () => ({
    extractPageData,
    restorePageData
  }));

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
      onClick={(e) => {
        // Only handle clicks if not in preview mode and click is directly on this container
        if (!props.isPreview && e.target === e.currentTarget) {
          hideMoreButton();
        }
      }}
    >
      <div
        ref={titleRef}
        contentEditable={!props.isPreview}
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        style={{
          fontSize: 64,
          fontWeight: 400,
          color: '#0E1328',
          margin: 25,
          lineHeight: 1,
          border: 'none',
          outline: props.isPreview ? 'none' : '1px black',
        }}
      >
        Terms &amp; Conditions
      </div>

      <div style={{ position: 'relative', flex: 1, margin: '0 0 8px' }}>
        {!props.isPreview && <Toolbar onInsertTitle={insertTitle} onInsertTable={insertTable} />}

        <div
          ref={editorRef}
          contentEditable={!props.isPreview}
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          style={{
            height: 'calc(100% - 0px)', // Remove the conservative 40px reduction
            maxHeight: 'calc(100% - 0px)', // Allow full height usage
            width: '100%',
            padding: 32,
            overflow: 'hidden', // Prevent scrolling and content overflow
            fontSize: 24,
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
            boxSizing: 'border-box', // Include padding in height calculations
          }}
        >
          <p style={{ margin: '-20px 0 0 0', textAlign: 'justify' }}>Type your Terms &amp; Conditions here…</p>

          {/* More button overlay - Only show if not in preview mode */}
          {moreButtonPosition.show && !props.isPreview && (
            <div
              contentEditable={false}
              data-more-button="true"
              style={{
                position: 'absolute',
                left: moreButtonPosition.x,
                top: moreButtonPosition.y,
                zIndex: 1000,
                height: '20px',
                backgroundColor: '#0E1328',
                padding: '0 4px',
                gap: '10px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                flexShrink: 0,
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                userSelect: 'none',
              }}
              onClick={handleMoreButtonClick}
              onMouseDown={(e) => e.preventDefault()}
            >
              <img
                src={more}
                alt="More options"
                style={{
                  width: '24px',
                  height: '24px',
                  aspectRatio: '1/1',
                  pointerEvents: 'none',
                }}
              />
            </div>
          )}

          {/* EditorBar overlay for rows - Only show if not in preview mode */}
          {showEditorBar && !props.isPreview && (
            <div
              contentEditable={false}
              data-editor-bar="true"
              style={{
                position: 'absolute',
                left: editorBarPosition.x,
                top: editorBarPosition.y,
                zIndex: 1001,
                userSelect: 'none',
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.preventDefault()}
            >
              <EditorBar
                onAddRowAbove={addRowAbove}
                onAddRowBelow={addRowBelow}
                onRemoveRow={removeRow}
                onRemoveTable={removeTable}
              />
            </div>
          )}

          {/* ColumnEditorBar overlay for columns - Only show if not in preview mode */}
          {showColumnEditorBar && !props.isPreview && (
            <div
              contentEditable={false}
              data-column-editor-bar="true"
              style={{
                position: 'absolute',
                left: columnEditorBarPosition.x,
                top: columnEditorBarPosition.y,
                zIndex: 1001,
                userSelect: 'none',
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.preventDefault()}
            >
              <ColumnEditorBar
                onAddColumnLeft={addColumnLeft}
                onAddColumnRight={addColumnRight}
                onRemoveColumn={removeColumn}
              />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
});

PolicyPage.displayName = 'PolicyPage';

export default PolicyPage;