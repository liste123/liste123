import { useRef, useLayoutEffect, useState } from "react";
import { useKeyboardEvent } from "../../../../utils/use-keyboard-event";
import { useEffectDebounced } from "../../../../utils/use-effect-debounced";
// import { useClickOutside } from "../../../../utils/use-click-outside";

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

  // Focus on the field:
  useLayoutEffect(() => {
    inputRef.current.focus();
  }, []);

  // Handle blur event also on mobile:
  // https://stackoverflow.com/questions/4971061/capture-done-button-click-in-iphones-virtual-keyboard-with-javascript
  useLayoutEffect(() => {
    const onLoseFocus = () =>
      onBlur &&
      onBlur(
        inputRef.current.value,
        inputRef.current.value !== initialValue.current
      );
    inputRef.current.addEventListener("focusout", onLoseFocus);
    return () => {
      inputRef.current.removeEventListener("focusout", onLoseFocus);
    };
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

  // Cancel Event
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

  // Add More Event
  useKeyboardEvent(
    "Enter",
    (evt) => {
      cancelOnChange();
      onEnter && onEnter(evt.target.value, evt.ctrlKey || evt.metaKey);
    },
    { target: inputRef }
  );

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
