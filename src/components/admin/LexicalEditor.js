// src/components/admin/LexicalEditor.js
import React, { useEffect, useRef } from 'react'; // Chỉ giữ lại useEffect
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from './ToolbarPlugin'; // Giả sử bạn đã tạo ToolbarPlugin.js

// Import các node types
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list'; 
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';

// Import các hàm xử lý HTML
import { $generateNodesFromDOM, $generateHtmlFromNodes } from '@lexical/html';
import { $getRoot, $getSelection, $isRangeSelection } from 'lexical';


// Cấu hình Theme (có thể tùy chỉnh hoặc dùng theme mặc định)
const editorTheme = {
  // Ví dụ:
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
  },
  // ... thêm các style khác nếu cần
};

// Placeholder khi editor trống
function Placeholder() {
  return <div className="editor-placeholder">Nhập nội dung...</div>;
}

// Các node cần thiết cho editor
const editorNodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  AutoLinkNode,
  LinkNode,
];

// Cập nhật InitialStatePlugin
function InitialStatePlugin({ initialHtml }) {
  const [editor] = useLexicalComposerContext();
  const hasAppliedInitialState = useRef(false);
  
  useEffect(() => {
    if (!initialHtml || !editor || hasAppliedInitialState.current) return;
    
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHtml, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      
      // Chèn nội dung mà không thay đổi selection hiện tại
      root.append(...nodes);
    });
    
    // Đánh dấu đã áp dụng state ban đầu
    hasAppliedInitialState.current = true;
  }, [initialHtml, editor]);

  return null;
}

// --- Kết thúc Component ToolbarPlugin ---

function LexicalEditor({ initialHtml, onChange }) {
  const initialConfig = {
    namespace: 'MyEditor',
    theme: editorTheme,
    onError(error) {
      console.error(error);
    },
    nodes: editorNodes,
    // editable: true, // Mặc định là true
  };

  // Cập nhật handleStateChange
  const handleStateChange = (editorState, editor) => {
    // Chỉ cập nhật HTML đầu ra mà không làm mất vị trí con trỏ
    const currentEditorState = editor.getEditorState();
    let htmlString = '';
    
    currentEditorState.read(() => {
      htmlString = $generateHtmlFromNodes(editor, null);
    });
    
    if (onChange) {
      onChange(htmlString);
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
      <ToolbarPlugin />
        <div className="editor-inner"> {/* Bọc RichTextPlugin để có thể scroll */}
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <OnChangePlugin onChange={handleStateChange} ignoreInitialChange={true} />
        <InitialStatePlugin initialHtml={initialHtml} />
      </div>
    </LexicalComposer>
  );
}

export default LexicalEditor;