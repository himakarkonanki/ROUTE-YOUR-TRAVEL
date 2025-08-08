import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import './PolicyPage.css';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import Delimiter from '@editorjs/delimiter';
import Quote from '@editorjs/quote';
import Footer from './Footer';


const PolicyPage = React.forwardRef(function PolicyPage({ onDataUpdate, initialData, pageNumber = 1 }, ref) {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    if (!editorInstanceRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        onReady: () => {
          console.log('Editor.js is ready to work!');
        },
        onChange: async () => {
          const savedData = await editor.saver.save();
          
          if (onDataUpdate) {
            // Extract title and fields from blocks
            let title = 'Terms & Conditions'; // Static title
            const fields = [];
            let fieldId = 1;
            savedData.blocks.forEach(block => {
              if (block.type === 'header') {
                // All headers are treated as content, not as the page title
                fields.push({ 
                  id: fieldId++, 
                  type: 'title', 
                  content: block.data.text,
                  level: block.data.level || 1
                });
              } else if (block.type === 'paragraph') {
                fields.push({ id: fieldId++, type: 'details', content: block.data.text });
              } else if (block.type === 'table') {
                fields.push({ id: fieldId++, type: 'table', content: block.data.content });
              } else if (block.type === 'quote') {
                fields.push({ id: fieldId++, type: 'details', content: block.data.text });
              }
            });
            onDataUpdate({ title, fields, blocks: savedData.blocks });
          }
          console.log('Content changed:', savedData);
        },
        autofocus: true,
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: 'Enter a section title...',
              levels: [1, 2, 3, 4],
              defaultLevel: 2
            }
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: {
              placeholder: ''
            }
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          checklist: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'checklist'
            }
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 4, // Set to 4 to match your table structure
              cols: 2, // Set to 2 for "Room Type" and "Cost in INR"
              withHeadings: true, // Always create tables with headers
              headings: ['Column 1', 'Column 2'], // Default header text
            }
          },
          delimiter: Delimiter,
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter important clause...',
              captionPlaceholder: 'Reference or note...',
            }
          }
        },
        data: {
          blocks: initialData && initialData.blocks ? initialData.blocks : []
        }
      });

      editorInstanceRef.current = editor;
      setEditorInstance(editor);
    }

    return () => {
      if (editorInstanceRef.current && editorInstanceRef.current.destroy) {
        editorInstanceRef.current.destroy();
      }
    };
  }, [initialData]);

  // Expose restorePageData for undo/redo
  useImperativeHandle(ref, () => ({
    restorePageData: (page) => {
      if (editorInstanceRef.current && page && page.blocks) {
        editorInstanceRef.current.render({ blocks: page.blocks });
      }
    }
  }));

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
      }}
    >
      <div
        style={{
          flex: 1,
          marginTop: '32px',
          marginBottom: '32px',
          border: 'none',
          padding: '16px',
          borderRadius: '4px',
          overflow: 'visible', // Hide overflow at this level
          backgroundColor: '#fff',
          position: 'relative',
          maxHeight: '1100px',
          minHeight: '200px', // Ensure minimum height for content area
        }}
      >
        <div 
          id="editorjs" 
          style={{
            height: '100%',
            maxHeight: '1068px', // 1250px - 32px padding (16px top + 16px bottom)
            minHeight: '150px', // Minimum height for editor content
            fontSize: '20px',
            lineHeight: '1.8',
            fontFamily: 'Lato',
            color: 'rgb(14, 19, 40)',
            textAlign: 'justify',
            overflow: 'visible', 
            position: 'relative',
          }}
        />
      </div>

      <Footer pageNumber={pageNumber}/>
    </div>
  );
});

export default PolicyPage;