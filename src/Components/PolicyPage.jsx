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

const handleInput = (e) => {
  const el = e.target;
  if (!el) return;
  
  // Only restrict input for the main editor, not the title
  if (el === editorRef.current) {
    // Skip overflow check for deletion operations (backspace, delete)
    if (e.inputType && (e.inputType.includes('delete') || e.inputType.includes('Delete'))) {
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
    
    // Check if adding a new line would cause overflow
    const sel = window.getSelection();
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
  const text = e.clipboardData.getData('text/plain');
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const r = sel.getRangeAt(0);
  r.deleteContents();

  // For title, just insert plain text without paragraph elements
  if (e.target === titleRef.current) {
    const textNode = document.createTextNode(text.replace(/\n/g, ' '));
    r.insertNode(textNode);
    r.setStartAfter(textNode);
    r.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r);
    return;
  }

  // For editor content, split into separate paragraphs to match normal behavior
  const editorElement = editorRef.current;
  
  // Split text into paragraphs by double line breaks (empty lines)
  const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim());
  
  // If no double line breaks found, treat as single paragraph with line breaks
  if (paragraphs.length === 1) {
    const p = document.createElement('p');
    // Only replace single line breaks with <br>, not double ones
    const formattedText = text.replace(/\n/g, '<br>');
    p.innerHTML = formattedText;
    
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
    
    // Test if it fits
    const testP = p.cloneNode(true);
    Object.assign(testP.style, {
      visibility: 'hidden',
      position: 'absolute',
    });
    
    r.insertNode(testP);
    
    if (checkContentOverflow(editorElement)) {
      testP.remove();
      // Try to fit partial content
      const words = text.split(' ');
      let fittingText = '';
      
      for (let i = 0; i < words.length; i++) {
        const testText = fittingText + (fittingText ? ' ' : '') + words[i];
        const tempP = document.createElement('p');
        tempP.innerHTML = testText.replace(/\n/g, '<br>');
        Object.assign(tempP.style, {
          margin: 0,
          fontSize: '24px',
          lineHeight: '1.6',
          fontFamily: 'Lato',
          color: '#0E1328',
          textAlign: 'justify',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
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
        finalP.innerHTML = fittingText.replace(/\n/g, '<br>');
        Object.assign(finalP.style, {
          margin: 0,
          fontSize: '24px',
          lineHeight: '1.6',
          fontFamily: 'Lato',
          color: '#0E1328',
          textAlign: 'justify',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        });
        
        r.insertNode(finalP);
        r.setStartAfter(finalP);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
      }
    } else {
      testP.remove();
      r.insertNode(p);
      r.setStartAfter(p);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
    }
  } else {
    // Multiple paragraphs - insert each as separate paragraph element
    let addedElements = [];
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paraText = paragraphs[i].trim();
      if (!paraText) continue;
      
      const p = document.createElement('p');
      // Handle line breaks within this paragraph
      p.innerHTML = paraText.replace(/\n/g, '<br>');
      
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
      
      // Test if this paragraph fits
      const testP = p.cloneNode(true);
      Object.assign(testP.style, {
        visibility: 'hidden',
        position: 'absolute',
      });
      
      r.insertNode(testP);
      
      if (checkContentOverflow(editorElement)) {
        testP.remove();
        break;
      } else {
        testP.remove();
        r.insertNode(p);
        r.setStartAfter(p);
        addedElements.push(p);
      }
    }
    
    if (addedElements.length > 0) {
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
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
        
        if (columnIndex === 0) {
          headerRow.insertBefore(newTh, headerRow.children[columnIndex]);
        } else {
          headerRow.insertBefore(newTh, headerRow.children[columnIndex]);
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
          
          if (columnIndex === 0) {
            row.insertBefore(newTd, row.children[0]);
          } else {
            row.insertBefore(newTd, row.children[columnIndex]);
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
                content: node.innerHTML || textContent
              });
            }
            break;
          }

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
              fields.push({
                id: fieldId++,
                type: 'details',
                content: node.innerHTML || content
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

  // Expose the extractPageData function via ref
  useImperativeHandle(ref, () => ({
    extractPageData
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