import MarkdownIt from 'markdown-it';
import get from 'lodash/get';
import StyledWrapper from './StyledWrapper';
import ButtonBar from 'components/ButtonBar';
import { IconPencil, IconCheck, IconX } from '@tabler/icons';
import { useEffect, useState, useRef } from 'react';
import { useTheme } from 'providers/Theme';
import { useSelector } from 'react-redux';
import CodeEditor from 'components/CodeEditor';

const md = new MarkdownIt();

const MarkdownEditor = ({ collection, content, defaultContent, onEdit, onSave, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const preferences = useSelector((state) => state.app.preferences);
  const { displayedTheme } = useTheme();
  const ref = useRef(null);

  const handleClick = (event) => {
    if (event?.detail === 2) {
      // double click
      setIsEditing(true);
    }
  };

  const htmlFromMarkdown = md.render(content != null && content !== '' ? content : defaultContent);

  return (
    <StyledWrapper ref={ref} className="w-full relative">
      {isEditing ? (
        <>
          <div className="h-full w-full">
            <CodeEditor
              collection={collection}
              theme={displayedTheme}
              value={content != null ? content : defaultContent}
              onEdit={onEdit}
              onSave={() => {
                setIsEditing(false);
                onSave();
              }}
              font={get(preferences, 'font.codeFont', 'default')}
              mode="application/text"
            />
          </div>
          <ButtonBar>
            <button
              onClick={() => {
                setIsEditing(false);
                onCancel();
              }}
            >
              <span className="flex items-center">
                Cancel
                <IconX size={18} strokeWidth={2} className="ml-1" />
              </span>
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                onSave();
              }}
            >
              <span className="flex items-center">
                Save
                <IconCheck size={18} strokeWidth={2} className="ml-1" />
              </span>
            </button>
          </ButtonBar>
        </>
      ) : (
        <>
          <div className="w-full h-full">
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: htmlFromMarkdown }}
              onClick={handleClick}
              style={{ cursor: 'text' }}
            />
          </div>
          <ButtonBar text="Edit" handleClick={() => setIsEditing(true)}>
            <button
              onClick={() => {
                setIsEditing(true);
              }}
            >
              <span className="flex items-center">
                Edit
                <IconPencil size={18} strokeWidth={2} className="ml-2" />
              </span>
            </button>
          </ButtonBar>
        </>
      )}
    </StyledWrapper>
  );
};

export default MarkdownEditor;
