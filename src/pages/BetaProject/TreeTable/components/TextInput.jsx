import { useRef, useEffect, useState } from "react";
import { useKeyboardEvent } from "../../../../utils/use-keyboard-event";
import { useEffectDebounced } from "../../../../utils/use-effect-debounced";
import { useClickOutside } from "../../../../utils/use-click-outside";

export const TextInput = ({
  value,
  onChange,
  onBlur,
  onEnter,
  onCancel,
  ...props
}) => {
  const inputRef = useRef();
  const initialValue = useRef(value);
  const [_value, setValue] = useState(value);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Debounced "onChage"
  const { cancel: cancelOnChange } = useEffectDebounced(
    () => onChange && onChange(_value),
    [_value],
    {
      delay: 500,
      skipFirst: true
    }
  );

  // Multiple ways to trigger the "onBlur" event
  useKeyboardEvent(
    "Escape",
    () => {
      cancelOnChange();
      // onChange && onChange(initialValue.current);
      // onBlur && onBlur();
      onCancel && onCancel(initialValue.current);
    },
    { target: inputRef }
  );

  useKeyboardEvent(
    "Enter",
    (evt) => {
      cancelOnChange();
      onEnter && onEnter(evt.target.value, evt.ctrlKey || evt.metaKey);
    },
    { target: inputRef }
  );
  useClickOutside(inputRef, onBlur);

  return (
    <input
      {...props}
      ref={inputRef}
      type="text"
      value={_value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
