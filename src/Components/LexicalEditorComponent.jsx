import React, { useState } from 'react';
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

// Main LexicalEditor Component
function LexicalEditorComponent({ 
    id, 
    type = 'details', 
    placeholder, 
    onContentChange, 
    autoFocus = false,
    containerStyle = {},
    editorStyle = {},
    placeholderStyle = {}
}) {
    const editorConfig = {
        namespace: `Editor-${id}-${type}`,
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
        if (onContentChange) {
            editorState.read(() => {
                const root = $getRoot();
                const textContent = root.getTextContent().trim();
                const newHasContent = textContent.length > 0;
                onContentChange(id, newHasContent);
            });
        }
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
        <LexicalComposer initialConfig={editorConfig}>
            <div style={{ ...containerStyle, position: 'relative', width: '100%' }}>
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable style={defaultEditorStyle} />
                    }
                    placeholder={
                        placeholder && (
                            <div style={defaultPlaceholderStyle}>
                                {placeholder}
                            </div>
                        )
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <OnChangePlugin onChange={handleEditorChange} />
                <PastePlugin />
            </div>
            <HistoryPlugin />
            {autoFocus && <AutoFocusPlugin />}
            <ListPlugin />
            <LinkPlugin />
        </LexicalComposer>
    );
}

export default LexicalEditorComponent;