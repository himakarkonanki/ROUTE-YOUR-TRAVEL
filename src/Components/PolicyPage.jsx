import React, { useRef, useState } from 'react';
import Toolbar from './Toolbar';
import Footer from './Footer';
import more from '../assets/icons/more_horiz.svg';
import EditorBar from './EditorBar';

export default function PolicyPage() {
  const editorRef = useRef(null);
  const titleRef = useRef(null);
  const [moreButtonPosition, setMoreButtonPosition] = useState({ show: false, x: 0, y: 0, row: null });
  const [showEditorBar, setShowEditorBar] = useState(false);
  const [editorBarPosition, setEditorBarPosition] = useState({ x: 0, y: 0 });
  const [selectedRow, setSelectedRow] = useState(null);

  // ... (keep all existing functions: placeCursorAtEnd, handleInput, handlePaste, insertTitle, insertTable)

  const placeCursorAtEnd = (element) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const handleInput = (e) => {
    const el = e.target;
    if (!el) return;
    if (el === editorRef.current) {
      if (el.scrollHeight > el.clientHeight || el.scrollTop > 0) {
        e.preventDefault();
        const sel = window.getSelection();
        if (sel.rangeCount) {
          const r = sel.getRangeAt(0);
          r.setStart(r.startContainer, r.startOffset - 1);
          r.deleteContents();
        }
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const r = sel.getRangeAt(0);
    r.deleteContents();

    if (e.target === titleRef.current) {
      const textNode = document.createTextNode(text.replace(/\n/g, ' '));
      r.insertNode(textNode);
      r.setStartAfter(textNode);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
      return;
    }

    text.split('\n').forEach((line, idx) => {
      const p = document.createElement('p');
      p.textContent = line;
      Object.assign(p.style, {
        margin: 0,
        fontSize: '24px',
        lineHeight: '1.6',
        fontFamily: 'Lato',
        color: '#0E1328',
      });
      r.insertNode(p);
      if (idx < text.split('\n').length - 1) {
        const br = document.createElement('br');
        r.insertNode(br);
      }
    });

    sel.removeAllRanges();
    sel.addRange(r);
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
  };

  // Table manipulation functions
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
    hideMoreButton();
  };

  const removeRow = () => {
    if (!selectedRow) return;
    
    const tbody = selectedRow.parentNode;
    const table = tbody.parentNode;
    
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
    if (!selectedRow) return;
    
    // Find the table that contains this row
    let table = selectedRow;
    while (table && table.tagName !== 'TABLE') {
      table = table.parentNode;
    }
    
    if (table) {
      table.remove();
    }
    hideMoreButton();
  };

  const handleRowClick = (e, row) => {
    e.stopPropagation();
    const rect = row.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();
    
    setSelectedRow(row); // Store the selected row
    setMoreButtonPosition({
      show: true,
      x: rect.left - editorRect.left - 50,
      y: rect.top - editorRect.top + rect.height / 2 - 16,
      row: row
    });
  };

  const hideMoreButton = () => {
    setMoreButtonPosition({ show: false, x: 0, y: 0, row: null });
    setShowEditorBar(false);
    setSelectedRow(null);
  };

  const handleMoreButtonClick = (e) => {
    e.stopPropagation();
    
    setEditorBarPosition({
      x: moreButtonPosition.x + 40,
      y: moreButtonPosition.y - 50
    });
    
    setShowEditorBar(true);
    setMoreButtonPosition(prev => ({ ...prev, show: false }));
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

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    ['Table Title', 'Table Title'].forEach((text) => {
      const th = document.createElement('th');
      th.textContent = text;
      Object.assign(th.style, {
        backgroundColor: '#0E1328',
        color: 'white',
        padding: '12px',
        fontSize: '20px',
        fontFamily: 'Lato',
        textAlign: 'left',
        border: 'none',
        boxSizing: 'border-box',
      });
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let i = 0; i < 3; i++) {
      const tr = document.createElement('tr');
      tr.addEventListener('click', (e) => handleRowClick(e, tr));
      Object.assign(tr.style, {
        cursor: 'pointer',
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
    lastRow.addEventListener('click', (e) => handleRowClick(e, lastRow));
    Object.assign(lastRow.style, {
      cursor: 'pointer',
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
    r.insertNode(table);
    r.setStartAfter(table);
    r.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r);
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
      onClick={hideMoreButton}
    >
      <div
        ref={titleRef}
        contentEditable
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
          outline: 'none',
        }}
      >
        Terms &amp; Conditions
      </div>

      <div style={{ position: 'relative', flex: 1, margin: '0 0 32px' }}>
        <Toolbar onInsertTitle={insertTitle} onInsertTable={insertTable} />

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          style={{
            height: '100%',
            width: '100%',
            padding: 32,
            overflow: 'hidden',
            fontSize: 24,
            lineHeight: 1.6,
            color: '#0E1328',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            border: 'none',
            outline: 'none',
            position: 'relative',
          }}
        >
          <p style={{ margin: '-20px 0 0 0' }}>Type your Terms &amp; Conditions here…</p>
          
          {moreButtonPosition.show && (
            <div
              contentEditable={false}
              style={{
                position: 'absolute',
                left: moreButtonPosition.x,
                top: moreButtonPosition.y,
                zIndex: 1000,
                width: '32px',
                height: '32px',
                backgroundColor: '#E8E8E8',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #D0D0D0',
                userSelect: 'none',
              }}
              onClick={handleMoreButtonClick}
              onMouseDown={(e) => e.preventDefault()}
            >
              <img
                src={more}
                alt="More options"
                style={{
                  width: '16px',
                  height: '16px',
                  filter: 'invert(0.3)',
                  display: 'block',
                  pointerEvents: 'none',
                }}
              />
            </div>
          )}

          {showEditorBar && (
            <div
              contentEditable={false}
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
