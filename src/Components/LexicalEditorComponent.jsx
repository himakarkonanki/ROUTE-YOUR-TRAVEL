import React, { useEffect, useState } from 'react';
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
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { $generateNodesFromDOM } from '@lexical/html';
import { $insertNodes, $getRoot, $createParagraphNode, $createTextNode } from 'lexical';

function onError(error) {
    console.error("Lexical error:", error);
}

// Custom paste plugin
function PastePlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
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
                    const paragraph = $createParagraphNode();
                    paragraph.append($createTextNode(textData));
                    $insertNodes([paragraph]);
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
    paragraph: 'policy-editor-paragraph',
    quote: 'policy-editor-quote',
    heading: {
        h1: 'policy-editor-heading-h1',
        h2: 'policy-editor-heading-h2',
        h3: 'policy-editor-heading-h3',
        h4: 'policy-editor-heading-h4',
        h5: 'policy-editor-heading-h5',
        h6: 'policy-editor-heading-h6',
    },
    list: {
        nested: {
            listitem: 'policy-editor-nested-listitem',
        },
        ol: 'policy-editor-list-ol',
        ul: 'policy-editor-list-ul',
        listitem: 'policy-editor-listItem',
        listitemChecked: 'policy-editor-listItemChecked',
        listitemUnchecked: 'policy-editor-listItemUnchecked',
    },
    hashtag: 'policy-editor-hashtag',
    image: 'policy-editor-image',
    link: 'policy-editor-link',
    text: {
        bold: 'policy-editor-textBold',
        code: 'policy-editor-textCode',
        italic: 'policy-editor-textItalic',
        strikethrough: 'policy-editor-textStrikethrough',
        subscript: 'policy-editor-textSubscript',
        superscript: 'policy-editor-textSuperscript',
        underline: 'policy-editor-textUnderline',
        underlineStrikethrough: 'policy-editor-textUnderlineStrikethrough',
    },
    code: 'policy-editor-code',
};

const LexicalEditorComponent = ({ 
    id, 
    type = 'details', 
    placeholder = 'Enter text...', 
    initialContent = '', 
    onContentChange, 
    containerStyle = {}, 
    editorStyle = {}, 
    placeholderStyle = {},
    autoFocus = false 
}) => {
    const [uniqueNamespace] = useState(() => `PolicyLexicalEditor-${id}-${type}-${Date.now()}-${Math.random()}`);
    
    const editorConfig = {
        namespace: uniqueNamespace,
        theme: exampleTheme,
        onError,
        editorState: initialContent ? () => {
            const root = $getRoot();
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(initialContent));
            root.append(paragraph);
        } : null,
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
            const textContent = root.getTextContent();
            if (onContentChange) {
                onContentChange(textContent);
            }
        });
    };

    const defaultEditorStyle = {
        outline: 'none',
        border: 'none',
        background: 'transparent',
        fontFamily: 'Lato',
        fontStyle: 'normal',
        cursor: 'text',
        width: '100%',
        ...editorStyle,
    };

    const defaultPlaceholderStyle = {
        position: 'absolute',
        top: '0',
        left: '0',
        fontFamily: 'Lato',
        fontStyle: 'normal',
        pointerEvents: 'none',
        ...placeholderStyle,
    };

    return (
        <div 
            className="policy-lexical-editor-container" 
            data-editor-id={id}
            style={{ 
                position: 'relative', 
                width: '100%', 
                isolation: 'isolate',
                contain: 'layout style paint',
                ...containerStyle 
            }}
        >
            <LexicalComposer key={uniqueNamespace} initialConfig={editorConfig}>
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable style={defaultEditorStyle} />
                    }
                    placeholder={
                        placeholder ? (
                            <div style={defaultPlaceholderStyle}>
                                {placeholder}
                            </div>
                        ) : null
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <OnChangePlugin onChange={handleEditorChange} />
                <PastePlugin />
                <HistoryPlugin />
                <ListPlugin />
                <LinkPlugin />
                {autoFocus && <AutoFocusPlugin />}
            </LexicalComposer>
        </div>
    );
};

export default LexicalEditorComponent;
