import React, { useEffect, useRef, useState } from 'react';
import './PolicyPage.css';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import Delimiter from '@editorjs/delimiter';
import Quote from '@editorjs/quote';
import Footer from './Footer';

function PolicyPage({ onDataUpdate }) {
  const editorRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    if (!editorInstance) {
      const editor = new EditorJS({
        holder: 'editorjs',
        onReady: () => {
          console.log('Editor.js is ready to work!');
        },
        onChange: async () => {
          const savedData = await editor.saver.save();
          if (onDataUpdate) {
            // Extract title and fields from blocks
            let title = 'Terms & Conditions';
            const fields = [];
            let fieldId = 1;
            savedData.blocks.forEach(block => {
              if (block.type === 'header') {
                if (fieldId === 1) {
                  title = block.data.text || title;
                } else {
                  fields.push({ id: fieldId++, type: 'title', content: block.data.text });
                }
              } else if (block.type === 'paragraph') {
                fields.push({ id: fieldId++, type: 'details', content: block.data.text });
              } else if (block.type === 'table') {
                fields.push({ id: fieldId++, type: 'table', content: block.data.content });
              } else if (block.type === 'quote') {
                fields.push({ id: fieldId++, type: 'details', content: block.data.text });
              }
            });
            onDataUpdate({ title, fields });
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
              withHeadings: true,
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
          blocks: []
        }
      });

      setEditorInstance(editor);
    }

    return () => {
      if (editorInstance && editorInstance.destroy) {
        editorInstance.destroy();
      }
    };
  }, [editorInstance]);

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
          overflow: 'visible',
          backgroundColor: '#fff',
          position: 'relative',
        }}
      >
        <div 
          id="editorjs" 
          style={{
            minHeight: '600px',
            fontSize: '20px',
            lineHeight: '1.8',
            fontFamily: 'Lato',
            color: 'rgb(14, 19, 40)',
            textAlign: 'justify',
          }}
        />
      </div>

      <Footer/>
    </div>
  );
}

export default PolicyPage;
