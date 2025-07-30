import React, { useEffect, useState } from 'react';
import add from '../assets/icons/add_2.svg';
import table from '../assets/icons/table.svg';
import title from '../assets/icons/title.svg';
import ReusableTable from './ReusableTable';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { HashtagNode } from '@lexical/hashtag';
import {
  TableNode,
  TableCellNode,
  TableRowNode,
} from '@lexical/table';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';

const theme = {
  paragraph: 'editor-paragraph',
  heading: {
    h1: 'editor-heading-h1',
  },
  list: {
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listItem',
  },
};

function DetailEditor({ id, type = 'details', value = '', hasContent, onContentChange, onAddNew, showPlusIcon, onRemove }) {
  const detailConfig = {
    namespace: `DetailEditor-${id}`,
    theme,
    onError: (err) => console.error(err),
    editorState: value || null,
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

  const handleChange = (editorState) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editorState);
      const text = editorState._nodeMap.get('root')?.getTextContent() || '';
      onContentChange(id, text.trim().length > 0, html);
    });
  };

  if (type === 'table') {
    return (
      <div style={{ marginBottom: '24px' }}>
        <ReusableTable
          onDataChange={(data) => {
            const hasData = data.some(row => row.some(cell => cell.trim() !== ''));
            onContentChange(id, hasData, data);
          }}
          onTableRemove={() => onRemove(id)}
        />
      </div>
    );
  }

  return (
    <LexicalComposer initialConfig={detailConfig}>
      <div style={{ marginBottom: '16px' }}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              style={{
                minHeight: type === 'title' ? '80px' : '32px',
                fontSize: type === 'title' ? '64px' : '24px',
                fontWeight: 400,
                lineHeight: type === 'title' ? '80px' : '32px',
                color: '#0E1328',
                fontFamily: 'Lato',
              }}
            />
          }
          placeholder={
            <div style={{ position: 'absolute', color: '#9CA3AF' }}>
              {type === 'title' ? 'Enter title...' : 'Enter the details...'}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
      </div>
    </LexicalComposer>
  );
}

export default DetailEditor;
