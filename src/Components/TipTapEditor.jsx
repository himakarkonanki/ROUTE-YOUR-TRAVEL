// TiptapEditor.jsx
import React, { useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

function TiptapEditor({ 
    value, 
    onChange, 
    placeholder = "Start writing...", 
    minHeight = "120px",
    maxHeight = "400px"
}) {
    const isUpdatingRef = useRef(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            if (isUpdatingRef.current) return; // Prevent loops
            
            const html = editor.getHTML();
            onChange({ target: { value: html } });
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor-constrained',
            },
        },
    });

    // FIXED: Better content sync that preserves cursor position
    React.useEffect(() => {
        if (editor && value !== undefined) {
            const currentContent = editor.getHTML();
            
            // Only update if content is actually different
            if (currentContent !== value) {
                isUpdatingRef.current = true;
                
                // Store current selection
                const { from, to } = editor.state.selection;
                
                // Update content
                editor.commands.setContent(value, false);
                
                // Restore selection if possible
                setTimeout(() => {
                    try {
                        if (from !== undefined && to !== undefined) {
                            const docSize = editor.state.doc.content.size;
                            const safeFrom = Math.min(from, docSize);
                            const safeTo = Math.min(to, docSize);
                            
                            editor.commands.setTextSelection({ from: safeFrom, to: safeTo });
                        }
                    } catch (error) {
                        // If selection restore fails, just focus the editor
                        editor.commands.focus();
                    }
                    isUpdatingRef.current = false;
                }, 0);
            }
        }
    }, [editor, value]);

    if (!editor) {
        return null;
    }

    return (
        <div style={{ width: '100%' }}>
            <EditorContent 
                editor={editor} 
                style={{
                    background: 'transparent',
                    minHeight: minHeight,
                    maxHeight: maxHeight,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    width: '100%',
                    boxSizing: 'border-box'
                }}
            />

            <style jsx="true" global="true">{`
                .tiptap-editor-constrained {
                    font-family: 'Lato', sans-serif !important;
                    font-size: 24px !important;
                    line-height: 32px !important;
                    color: #0E1328 !important;
                    min-height: ${minHeight} !important;
                    max-height: ${maxHeight} !important;
                    padding: 16px !important;
                    outline: none !important;
                    border: none !important;
                    background: transparent !important;
                    
                    width: 100% !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                    word-wrap: break-word !important;
                    overflow-wrap: break-word !important;
                    white-space: pre-wrap !important;
                    
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                }

                .tiptap-editor-constrained:focus {
                    outline: none !important;
                    box-shadow: none !important;
                }

                .tiptap-editor-constrained:empty:before {
                    content: '${placeholder}';
                    color: #9CA3AF;
                    pointer-events: none;
                    height: 0;
                }

                .tiptap-editor-constrained h1,
                .tiptap-editor-constrained h2,
                .tiptap-editor-constrained h3,
                .tiptap-editor-constrained p,
                .tiptap-editor-constrained li {
                    word-wrap: break-word !important;
                    overflow-wrap: break-word !important;
                    max-width: 100% !important;
                }

                .tiptap-editor-constrained h1 {
                    font-size: 36px;
                    line-height: 1.2;
                    margin: 24px 0 16px;
                    font-weight: 700;
                }

                .tiptap-editor-constrained h2 {
                    font-size: 28px;
                    line-height: 1.3;
                    margin: 20px 0 12px;
                    font-weight: 600;
                }

                .tiptap-editor-constrained h3 {
                    font-size: 22px;
                    line-height: 1.4;
                    margin: 16px 0 8px;
                    font-weight: 600;
                }

                .tiptap-editor-constrained p {
                    margin: 12px 0;
                    line-height: 1.6;
                }

                .tiptap-editor-constrained ul, .tiptap-editor-constrained ol {
                    margin: 12px 0;
                    padding-left: 24px;
                }

                .tiptap-editor-constrained li {
                    margin: 4px 0;
                    line-height: 1.6;
                }

                .tiptap-editor-constrained blockquote {
                    border-left: 4px solid #0066cc;
                    padding-left: 16px;
                    margin: 16px 0;
                    font-style: italic;
                    color: #555;
                }

                .ProseMirror {
                    outline: none !important;
                    border: none !important;
                    background: transparent !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                }
            `}</style>
        </div>
    );
}

export default TiptapEditor;