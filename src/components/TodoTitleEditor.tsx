import React, { useEffect, useRef, useState } from "react";
import { TASK_TEXT_WARNING_LENGTH } from "../storage/quotas";

interface TodoTitleEditorProps {
  value: string;
  initialWidth: number | null;
  onFinishEditing: (result: { value: string }) => void;
  onCancelEditing: () => void;
}

const TodoTitleEditor = ({
  value: initialValue,
  initialWidth,
  onFinishEditing,
  onCancelEditing,
}: TodoTitleEditorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onFinishEditing({ value });
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
          "mx-1 inline-block border-0 px-1.5 py-0.5 outline-2 outline-dashed outline-blue-300" +
          (isNearTextLimit ? " outline-amber-600" : "")
        }
        type="text"
        style={{ width: initialWidth ?? undefined }}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={onCancelEditing}
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
