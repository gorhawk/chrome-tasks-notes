import React, { useEffect, useRef, useState } from "react";
import { TASK_TEXT_WARNING_LENGTH } from "../storage/quotas";

interface TodoTitleEditorProps {
  value: string;
  onFinishEditing: (result: { value: string }) => void;
  onCancelEditing: () => void;
}

const TodoTitleEditor = ({
  value: initialValue,
  onFinishEditing,
  onCancelEditing,
}: TodoTitleEditorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onFinishEditing({ value });
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancelEditing();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const isNearTextLimit = value.length > TASK_TEXT_WARNING_LENGTH;

  return (
    <span className="inline-block">
      <input
        ref={inputRef}
        className={
          "mx-1 min-w-16 max-w-full field-sizing-content border-0 px-1.5 py-0.5 outline-2 outline-blue-500/30" +
          (isNearTextLimit ? " outline-amber-600" : "")
        }
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => onFinishEditing({ value })}
        onClick={(e) => e.stopPropagation()}
      />
      {isNearTextLimit && (
        <span className="ml-1 block text-xs text-amber-600">
          close to the sync size limit
        </span>
      )}
    </span>
  );
};

export default TodoTitleEditor;
