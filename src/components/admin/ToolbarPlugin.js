import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $isRootOrShadowRoot
} from 'lexical'
import { $wrapNodes } from '@lexical/selection'
import { $findMatchingParent } from '@lexical/utils'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode
} from '@lexical/list'
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text'
import { $patchStyleText } from '@lexical/selection'

const LowPriority = 1

function ToolbarPlugin () {
  const [editor] = useLexicalComposerContext()
  const toolbarRef = useRef(null)

  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [blockType, setBlockType] = useState('paragraph')
  const [fontColor, setFontColor] = useState('#000000')
  const [textAlignment, setTextAlignment] = useState('left');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      // Cập nhật trạng thái định dạng text
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))

      // Cập nhật trạng thái block type
      const anchorNode = selection.anchor.getNode()
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, e => {
              const parent = e.getParent()
              return parent !== null && $isRootOrShadowRoot(parent)
            })

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow()
      }

      // Lấy thông tin căn lề
      if (element !== null) {
        const elementDOM = editor.getElementByKey(element.getKey());
        if (elementDOM !== null) {
          const textAlign = window.getComputedStyle(elementDOM).textAlign;
          setTextAlignment(textAlign);
        }
        
        if ($isListNode(element)) {
          const parentList = $findMatchingParent(anchorNode, node => {
            return node instanceof ListNode
          })
          const type = parentList ? parentList.getTag() : element.getTag()
          setBlockType(type)
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType()
          setBlockType(type)
        }
      }
    }
  }, [editor])

  useEffect(() => {
    // Lắng nghe sự kiện thay đổi selection và cập nhật toolbar
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar()
        return false
      },
      LowPriority
    )
  }, [editor, updateToolbar])

  useEffect(() => {
    // Lắng nghe trạng thái undo/redo
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      payload => {
        setCanUndo(payload)
        return false
      },
      LowPriority
    )
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      payload => {
        setCanRedo(payload)
        return false
      },
      LowPriority
    )
  }, [editor])

  // Hàm định dạng block (Heading, Paragraph, List)
  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode())
        }
      })
    }
  }

  const formatHeading = headingSize => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode(headingSize))
        }
      })
    }
  }

  const formatBulletList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const formatNumberedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  // Thêm các hàm xử lý click riêng cho từng nút
  const handleBoldClick = () => {
    // Cập nhật trạng thái UI ngay lập tức
    setIsBold(!isBold);
    // Gửi lệnh tới editor
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const handleItalicClick = () => {
    // Cập nhật trạng thái UI ngay lập tức
    setIsItalic(!isItalic);
    // Gửi lệnh tới editor
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const handleUnderlineClick = () => {
    // Cập nhật trạng thái UI ngay lập tức
    setIsUnderline(!isUnderline);
    // Gửi lệnh tới editor
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  // Thêm các hàm xử lý căn lề
  const handleAlignLeft = () => {
    // Cập nhật trạng thái UI ngay lập tức
    setTextAlignment('left');
    // Gửi lệnh tới editor
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
  };

  const handleAlignCenter = () => {
    // Cập nhật trạng thái UI ngay lập tức
    setTextAlignment('center');
    // Gửi lệnh tới editor
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
  };

  const handleAlignRight = () => {
    // Cập nhật trạng thái UI ngay lập tức
    setTextAlignment('right');
    // Gửi lệnh tới editor
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
  };

  const handleAlignJustify = () => {
    // Cập nhật trạng thái UI ngay lập tức
    setTextAlignment('justify');
    // Gửi lệnh tới editor
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
  };

  return (
    <div className='editor-toolbar' ref={toolbarRef}>
      {/* Undo/Redo */}
      <button
        type='button'
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className='toolbar-item spaced'
        title='Hoàn tác'
      >
        <i className='fas fa-undo'></i>
      </button>
      <button
        type='button'
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className='toolbar-item'
        title='Làm lại'
      >
        <i className='fas fa-redo'></i>
      </button>
      <div className='divider'></div>

      {/* Block Types (Heading, List) */}
      <div className='divider'></div>


      {/* Text Formatting với các hàm xử lý mới */}
      <button
        type='button'
        onClick={handleBoldClick} // Thay thế bằng hàm mới
        className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
        title='In đậm'
      >
        <i className='fas fa-bold'></i>
      </button>
      <button
        type='button'
        onClick={handleItalicClick} // Thay thế bằng hàm mới
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        title='In nghiêng'
      >
        <i className='fas fa-italic'></i>
      </button>
      <button
        type='button'
        onClick={handleUnderlineClick} // Thay thế bằng hàm mới
        className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
        title='Gạch chân'
      >
        <i className='fas fa-underline'></i>
      </button>
      <div className='divider'></div>

      {/* Alignment */}
      <button
        type='button'
        onClick={handleAlignLeft}
        className={`toolbar-item spaced ${textAlignment === 'left' || textAlignment === 'start' ? 'active' : ''}`}
        title='Căn trái'
      >
        <i className='fas fa-align-left'></i>
      </button>
      <button
        type='button'
        onClick={handleAlignCenter}
        className={`toolbar-item spaced ${textAlignment === 'center' ? 'active' : ''}`}
        title='Căn giữa'
      >
        <i className='fas fa-align-center'></i>
      </button>
      <button
        type='button'
        onClick={handleAlignRight}
        className={`toolbar-item spaced ${textAlignment === 'right' ? 'active' : ''}`}
        title='Căn phải'
      >
        <i className='fas fa-align-right'></i>
      </button>
      <button
        type='button'
        onClick={handleAlignJustify}
        className={`toolbar-item ${textAlignment === 'justify' ? 'active' : ''}`}
        title='Căn đều'
      >
        <i className='fas fa-align-justify'></i>
      </button>

    </div>
  )
}

export default ToolbarPlugin
