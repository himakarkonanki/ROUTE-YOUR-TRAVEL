import React, { useRef } from 'react';

export default function ContentEditor() {
  const editorRef = useRef(null);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Toolbar */}
      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
        <button onClick={() => execCommand('bold')}>Bold</button>
        <button onClick={() => execCommand('italic')}>Italic</button>
        <button onClick={() => execCommand('underline')}>Underline</button>
        <button onClick={() => execCommand('insertOrderedList')}>Numbered List</button>
        <button onClick={() => execCommand('insertUnorderedList')}>Bullet List</button>
        <button onClick={() => execCommand('formatBlock', 'h1')}>H1</button>
        <button onClick={() => execCommand('formatBlock', 'h2')}>H2</button>
        <button onClick={() => execCommand('formatBlock', 'p')}>Paragraph</button>
        <button onClick={() => execCommand('insertHorizontalRule')}>HR</button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
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
    </div>
  );
}
