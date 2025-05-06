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
import { $getRoot, $getSelection, $isRangeSelection } from 'lexical'; // Ensure $isRangeSelection is imported if used

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
  // Use a ref to track if the initial state has been applied
  const hasAppliedInitialState = useRef(false);

  useEffect(() => {
    // Only run if we have HTML, an editor instance, and haven't applied the state yet
    if (!initialHtml || !editor || hasAppliedInitialState.current) {
      // If initialHtml is empty/null and editor exists, clear the editor
      if (!initialHtml && editor && !hasAppliedInitialState.current) {
          editor.update(() => {
              $getRoot().clear();
              $getRoot().selectEnd(); // Move selection to end after clearing
          });
          hasAppliedInitialState.current = true; // Mark as applied even if empty
      }
      return;
    }


    editor.update(() => {
      try { // Add try...catch for robustness
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialHtml, 'text/html');
        // Generate Lexical nodes from the parsed DOM
        const nodes = $generateNodesFromDOM(editor, dom);

        const root = $getRoot();
        root.clear(); // Clear any existing content

        // --- FIX: Use selection to insert nodes ---
        // Select the end of the root node to ensure insertion happens correctly
        root.selectEnd();
        const selection = $getSelection();

        // Use insertNodes - this handles wrapping inline nodes correctly
        if (selection) { // Check if selection exists
          selection.insertNodes(nodes);
        } else {
           // Fallback if selection is null (less likely at root, but safe)
           // This might still fail if nodes are invalid top-level types
           root.append(...nodes);
           console.warn("Lexical InitialStatePlugin: Selection was null, attempting direct append.");
        }
        // --- End FIX ---

        // Mark that the initial state has been applied to prevent re-running
        hasAppliedInitialState.current = true;

      } catch (error) {
          console.error("Error applying initial HTML state to Lexical:", error);
          // Optionally clear the editor on error
          // $getRoot().clear();
      }
    });

  }, [initialHtml, editor]); // Depend on initialHtml and editor instance

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