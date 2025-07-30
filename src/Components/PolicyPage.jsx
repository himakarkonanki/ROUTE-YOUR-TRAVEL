import React, { useState } from 'react'
import add from '../assets/icons/add_2.svg'
import logo from '../assets/icons/companyLogo.svg'
import table from '../assets/icons/table.svg'
import title from '../assets/icons/title.svg'
import ReusableTable from './ReusableTable' // Import the reusable table component
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HashtagNode } from "@lexical/hashtag";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import {
    TableNode,
    TableCellNode,
    TableRowNode,
} from "@lexical/table";
import { $generateNodesFromDOM } from '@lexical/html';
import { $insertNodes, $getRoot } from 'lexical';
import "../editor.css";
import Footer from './Footer'

function onError(error) {
    console.error("Lexical error:", error);
}

// Custom paste plugin to preserve formatting
function PastePlugin() {
    const [editor] = useLexicalComposerContext();

    React.useEffect(() => {
        const handlePaste = (event) => {
            event.preventDefault();
            
            const clipboardData = event.clipboardData || window.clipboardData;
            const htmlData = clipboardData.getData('text/html');
            const textData = clipboardData.getData('text/plain');

            editor.update(() => {
                if (htmlData) {
                    const parser = new DOMParser();
                    const dom = parser.parseFromString(htmlData, 'text/html');
                    const nodes = $generateNodesFromDOM(editor, dom);
                    $insertNodes(nodes);
                } else if (textData) {
                    const parser = new DOMParser();
                    const dom = parser.parseFromString(`<p>${textData.replace(/\n/g, '</p><p>')}</p>`, 'text/html');
                    const nodes = $generateNodesFromDOM(editor, dom);
                    $insertNodes(nodes);
                }
            });
        };

        const editorElement = editor.getRootElement();
        if (editorElement) {
            editorElement.addEventListener('paste', handlePaste);
            return () => {
                editorElement.removeEventListener('paste', handlePaste);
            };
        }
    }, [editor]);

    return null;
}

const exampleTheme = {
    ltr: 'ltr',
    rtl: 'rtl',
    paragraph: 'editor-paragraph',
    quote: 'editor-quote',
    heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'editor-heading-h3',
        h4: 'editor-heading-h4',
        h5: 'editor-heading-h5',
        h6: 'editor-heading-h6',
    },
    list: {
        nested: {
            listitem: 'editor-nested-listitem',
        },
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
        listitem: 'editor-listItem',
        listitemChecked: 'editor-listItemChecked',
        listitemUnchecked: 'editor-listItemUnchecked',
    },
    hashtag: 'editor-hashtag',
    image: 'editor-image',
    link: 'editor-link',
    text: {
        bold: 'editor-textBold',
        code: 'editor-textCode',
        italic: 'editor-textItalic',
        strikethrough: 'editor-textStrikethrough',
        subscript: 'editor-textSubscript',
        superscript: 'editor-textSuperscript',
        underline: 'editor-textUnderline',
        underlineStrikethrough: 'editor-textUnderlineStrikethrough',
    },
    code: 'editor-code',
    codeHighlight: {
        atrule: 'editor-tokenAttr',
        attr: 'editor-tokenAttr',
        boolean: 'editor-tokenProperty',
        builtin: 'editor-tokenSelector',
        cdata: 'editor-tokenComment',
        char: 'editor-tokenSelector',
        class: 'editor-tokenFunction',
        'class-name': 'editor-tokenFunction',
        comment: 'editor-tokenComment',
        constant: 'editor-tokenProperty',
        deleted: 'editor-tokenProperty',
        doctype: 'editor-tokenComment',
        entity: 'editor-tokenOperator',
        function: 'editor-tokenFunction',
        important: 'editor-tokenVariable',
        inserted: 'editor-tokenSelector',
        keyword: 'editor-tokenAttr',
        namespace: 'editor-tokenVariable',
        number: 'editor-tokenProperty',
        operator: 'editor-tokenOperator',
        prolog: 'editor-tokenComment',
        property: 'editor-tokenProperty',
        punctuation: 'editor-tokenPunctuation',
        regex: 'editor-tokenVariable',
        selector: 'editor-tokenSelector',
        string: 'editor-tokenSelector',
        symbol: 'editor-tokenProperty',
        tag: 'editor-tokenProperty',
        url: 'editor-tokenOperator',
        variable: 'editor-tokenVariable',
    },
};

// Icon Tray Component - Vertical layout positioned outside dashed border
function IconTray({ onSelectType, onClose }) {
    return (
        <div
            style={{
                position: 'absolute',
                left: '-70px',
                top: '0px',
                display: 'inline-flex',
                flexDirection: 'column',
                padding: '12px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '28px',
                background: '#F2F4FE',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                zIndex: 100,
                minWidth: '60px',
            }}
        >
            {/* Details Icon */}
            <div
                style={{
                    display: 'flex',
                    width: '36px',
                    height: '36px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
                onClick={() => onSelectType('details')}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0E1328';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    const icon = e.currentTarget.querySelector('img');
                    if (icon) {
                        icon.style.filter = 'brightness(0) invert(1)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.transform = 'scale(1)';
                    const icon = e.currentTarget.querySelector('img');
                    if (icon) {
                        icon.style.filter = 'none';
                    }
                }}
            >
                <img 
                    src={add} 
                    alt='details icon' 
                    style={{ 
                        width: '16px', 
                        height: '16px',
                        transition: 'filter 0.2s ease'
                    }} 
                />
            </div>

            {/* Title Icon - T */}
            <div
                style={{
                    display: 'flex',
                    width: '36px',
                    height: '36px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
                onClick={() => onSelectType('title')}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0E1328';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    const tText = e.currentTarget.querySelector('.t-text');
                    if (tText) tText.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.transform = 'scale(1)';
                    const tText = e.currentTarget.querySelector('.t-text');
                    if (tText) tText.style.color = '#6B7280';
                }}
            >
                <div
                    className="t-text"
                    style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#6B7280',
                        fontFamily: 'Lato',
                        transition: 'color 0.2s ease',
                    }}
                >
                    T
                </div>
            </div>

            {/* Table Icon */}
            <div
                style={{
                    display: 'flex',
                    width: '36px',
                    height: '36px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
                onClick={() => onSelectType('table')}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0E1328';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    const icon = e.currentTarget.querySelector('img');
                    if (icon) {
                        icon.style.filter = 'brightness(0) invert(1)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.transform = 'scale(1)';
                    const icon = e.currentTarget.querySelector('img');
                    if (icon) {
                        icon.style.filter = 'none';
                    }
                }}
            >
                <img 
                    src={table} 
                    alt='table icon' 
                    style={{ 
                        width: '16px', 
                        height: '16px',
                        transition: 'filter 0.2s ease'
                    }} 
                />
            </div>
        </div>
    );
}

// Reusable Detail Editor Component
function DetailEditor({ id, type = 'details', onAddNew, showPlusIcon, hasContent, onContentChange, onRemove }) {
    const [showIconTray, setShowIconTray] = useState(false);

    const detailConfig = {
        namespace: `DetailEditor-${id}`,
        theme: exampleTheme,
        onError,
        editorState: null,
        nodes: [
            HeadingNode,
            QuoteNode,
            ListNode,
            ListItemNode,
            CodeNode,
            CodeHighlightNode,
            AutoLinkNode,
            LinkNode,
            HashtagNode,
            TableNode,
            TableCellNode,
            TableRowNode,
        ],
    };

    const handleEditorChange = (editorState) => {
        editorState.read(() => {
            const root = $getRoot();
            const textContent = root.getTextContent().trim();
            const newHasContent = textContent.length > 0;
            
            if (newHasContent !== hasContent) {
                onContentChange(id, newHasContent);
            }
        });
    };

    const handlePlusClick = () => {
        setShowIconTray(true);
    };

    const handleIconSelect = (selectedType) => {
        setShowIconTray(false);
        onAddNew(selectedType);
    };

    const handleCloseIconTray = () => {
        setShowIconTray(false);
    };

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (showIconTray && !event.target.closest('.icon-tray-container')) {
                setShowIconTray(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showIconTray]);

    const getPlaceholder = () => {
        switch (type) {
            case 'title':
                return 'Enter title...';
            case 'table':
                return null;
            default:
                return 'Enter the details...';
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'title':
                return {
                    fontSize: '64px',
                    fontWeight: 400,
                    lineHeight: '80px',
                    color: '#0E1328',
                    textTransform: 'capitalize',
                };
            case 'table':
                return null;
            default:
                return {
                    fontSize: '24px',
                    fontWeight: 400,
                    lineHeight: '32px',
                    color: '#0E1328',
                };
        }
    };

    const getPlaceholderStyles = () => {
        switch (type) {
            case 'title':
                return {
                    fontSize: '64px',
                    fontWeight: 400,
                    lineHeight: '80px',
                    color: '#9CA3AF',
                    textTransform: 'capitalize',
                };
            case 'table':
                return null;
            default:
                return {
                    fontSize: '24px',
                    fontWeight: 400,
                    lineHeight: '32px',
                    color: '#9CA3AF',
                };
        }
    };

    const editorStyles = getStyles();
    const placeholderStyles = getPlaceholderStyles();

    // Handle table removal
    const handleTableRemove = () => {
        if (onRemove) {
            onRemove(id);
        }
    };

    // Render ReusableTable component if type is 'table'
    if (type === 'table') {
        return (
            <div
                className="icon-tray-container"
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    alignSelf: 'stretch',
                    marginBottom: '24px',
                    position: 'relative',
                }}
            >
                {showPlusIcon && (
                    <div
                        style={{
                            display: 'flex',
                            width: '32px',
                            height: '32px',
                            padding: '4px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            borderRadius: '28px',
                            background: 'rgba(14, 19, 40, 0.06)',
                            flexShrink: 0,
                            cursor: 'pointer',
                            position: 'absolute',
                            left: '-48px',
                            top: '20px',
                        }}
                        onClick={handlePlusClick}
                    >
                        <img src={add} alt='add icon' />
                    </div>
                )}

                {showIconTray && (
                    <IconTray
                        onSelectType={handleIconSelect}
                        onClose={handleCloseIconTray}
                    />
                )}

                {/* Using the Reusable Table Component with table removal */}
                <ReusableTable 
                    rows={4}
                    columns={2}
                    headerPlaceholder="Type here"
                    cellPlaceholder="Type here"
                    onDataChange={(data) => {
                        // Check if table has any content
                        const hasData = data.some(row => row.some(cell => cell.trim() !== ''));
                        if (hasData !== hasContent) {
                            onContentChange(id, hasData);
                        }
                    }}
                    onTableRemove={handleTableRemove} // Pass table removal handler
                />
            </div>
        );
    }

    // Regular text editor for other types
    return (
        <LexicalComposer initialConfig={detailConfig}>
            <div
                className="icon-tray-container"
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    alignSelf: 'stretch',
                    marginBottom: type === 'title' ? '24px' : '16px',
                    position: 'relative',
                }}
            >
                {showPlusIcon && (
                    <div
                        style={{
                            display: 'flex',
                            width: '32px',
                            height: '32px',
                            padding: '4px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            borderRadius: '28px',
                            background: 'rgba(14, 19, 40, 0.06)',
                            flexShrink: 0,
                            cursor: 'pointer',
                            position: 'absolute',
                            left: '-48px',
                            top: type === 'title' ? '20px' : '4px',
                        }}
                        onClick={handlePlusClick}
                    >
                        <img src={add} alt='add icon' />
                    </div>
                )}

                {showIconTray && (
                    <IconTray
                        onSelectType={handleIconSelect}
                        onClose={handleCloseIconTray}
                    />
                )}

                <div style={{ flex: '1 0 0', position: 'relative', width: '100%' }}>
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable 
                                style={{
                                    outline: 'none',
                                    border: 'none',
                                    background: 'transparent',
                                    fontFamily: 'Lato',
                                    fontStyle: 'normal',
                                    cursor: 'text',
                                    minHeight: type === 'title' ? '80px' : '32px',
                                    width: '100%',
                                    ...editorStyles,
                                }}
                            />
                        }
                        placeholder={
                            placeholderStyles && (
                                <div 
                                    style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        fontFamily: 'Lato',
                                        fontStyle: 'normal',
                                        pointerEvents: 'none',
                                        ...placeholderStyles,
                                    }}
                                >
                                    {getPlaceholder()}
                                </div>
                            )
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <OnChangePlugin onChange={handleEditorChange} />
                    <PastePlugin />
                </div>
            </div>
            <HistoryPlugin />
            <ListPlugin />
            <LinkPlugin />
        </LexicalComposer>
    );
}

function PolicyPage() {
    const [detailFields, setDetailFields] = useState([{ id: 1, type: 'details', hasContent: false }]);

    const titleConfig = {
        namespace: "TitleEditor",
        theme: exampleTheme,
        onError,
        editorState: null,
        nodes: [
            HeadingNode,
            QuoteNode,
            ListNode,
            ListItemNode,
            CodeNode,
            CodeHighlightNode,
            AutoLinkNode,
            LinkNode,
            HashtagNode,
            TableNode,
            TableCellNode,
            TableRowNode,
        ],
    };

    const addNewField = (type = 'details') => {
        const newId = Math.max(...detailFields.map(field => field.id)) + 1;
        setDetailFields([...detailFields, { id: newId, type, hasContent: false }]);
    };

    const handleContentChange = (fieldId, hasContent) => {
        setDetailFields(prevFields => {
            const updatedFields = prevFields.map(field => 
                field.id === fieldId 
                    ? { ...field, hasContent }
                    : field
            );
            
            if (hasContent) {
                const fieldIndex = updatedFields.findIndex(f => f.id === fieldId);
                const isLastField = fieldIndex === updatedFields.length - 1;
                
                if (isLastField) {
                    const newId = Math.max(...updatedFields.map(field => field.id)) + 1;
                    updatedFields.push({ id: newId, type: 'details', hasContent: false });
                }
            }
            
            return updatedFields;
        });
    };

    // Handle field removal (for tables and other fields)
    const handleFieldRemove = (fieldId) => {
        setDetailFields(prevFields => {
            const updatedFields = prevFields.filter(field => field.id !== fieldId);
            
            // Ensure there's always at least one field
            if (updatedFields.length === 0) {
                return [{ id: 1, type: 'details', hasContent: false }];
            }
            
            // If we removed the last field and there's no empty field, add one
            const hasEmptyField = updatedFields.some(field => !field.hasContent);
            if (!hasEmptyField) {
                const newId = Math.max(...updatedFields.map(field => field.id)) + 1;
                updatedFields.push({ id: newId, type: 'details', hasContent: false });
            }
            
            return updatedFields;
        });
    };

    return (
        <div
            style={{
                display: 'flex',
                width: '1088px',
                height: '1540px',
                padding: '64px 64px 0 64px',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexShrink: 0,
                background: '#FFF',
                position: 'relative',
                overflow: 'visible',
                borderRadius: '32px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '20px',
                    flex: '1 0 0',
                    alignSelf: 'stretch',
                    flexDirection: 'column',
                    overflow: 'visible',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        flex: '1 0 0',
                        alignSelf: 'stretch',
                        overflow: 'visible',
                    }}
                >
                    {/* Editable Title Section */}
                    <LexicalComposer initialConfig={titleConfig}>
                        <div
                            style={{
                                display: 'flex',
                                padding: '8px 64px',
                                alignItems: 'center',
                                alignSelf: 'stretch',
                                borderRadius: '16px',
                                background: 'rgba(255, 255, 255, 0.04)',
                                position: 'relative',
                                marginBottom: '24px',
                            }}
                        >
                            <div style={{ flex: '1 0 0', position: 'relative' }}>
                                <RichTextPlugin
                                    contentEditable={
                                        <ContentEditable 
                                            style={{
                                                outline: 'none',
                                                border: 'none',
                                                background: 'transparent',
                                                color: '#0E1328',
                                                fontFamily: 'Lato',
                                                fontSize: '64px',
                                                fontStyle: 'normal',
                                                fontWeight: 400,
                                                lineHeight: '80px',
                                                textTransform: 'capitalize',
                                                minHeight: '80px',
                                                cursor: 'text',
                                            }}
                                        />
                                    }
                                    placeholder={
                                        <div 
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                left: '0',
                                                color: '#9CA3AF',
                                                fontFamily: 'Lato',
                                                fontSize: '64px',
                                                fontStyle: 'normal',
                                                fontWeight: 400,
                                                lineHeight: '80px',
                                                textTransform: 'capitalize',
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            Terms & Conditions
                                        </div>
                                    }
                                    ErrorBoundary={LexicalErrorBoundary}
                                />
                                <PastePlugin />
                            </div>
                        </div>
                        <HistoryPlugin />
                        <AutoFocusPlugin />
                        <ListPlugin />
                        <LinkPlugin />
                    </LexicalComposer>

                    {/* Dynamic Fields */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignSelf: 'stretch',
                            paddingLeft: '64px',
                            paddingRight: '16px',
                            paddingBottom: '120px',
                            overflow: 'visible',
                            flex: '1 0 0',
                        }}
                    >
                        {detailFields.map((field, index) => {
                            const firstEmptyFieldIndex = detailFields.findIndex(f => !f.hasContent);
                            const showPlusIcon = index === firstEmptyFieldIndex && !field.hasContent;
                            
                            return (
                                <DetailEditor
                                    key={field.id}
                                    id={field.id}
                                    type={field.type}
                                    onAddNew={addNewField}
                                    showPlusIcon={showPlusIcon}
                                    hasContent={field.hasContent}
                                    onContentChange={handleContentChange}
                                    onRemove={handleFieldRemove} // Pass the removal handler
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer */}
           <Footer/>
        </div>
    )
}

export default PolicyPage